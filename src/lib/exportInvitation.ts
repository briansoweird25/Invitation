import { createElement } from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import { InvitationRenderer } from "@/components/invitation/InvitationRenderer";
import { getTemplate } from "@/components/invitation/templateCatalog";
import { loadTemplateComponent } from "@/components/invitation/templateLoader";
import type { InvitationContent, InvitationDesign } from "@/types/invitation";
import { exportFileName, type ExportFormat } from "./exportName";
import { ensureFontLoaded } from "./fonts";
import { assemblePdf, deflate, rgbaToRgb } from "./pdf";

/**
 * Exports draw the invitation with the same `InvitationRenderer` as the editor and the public page, laid out at a
 * fixed width in an off-screen box, and turn that into a picture. There is no second renderer, so every template,
 * Look, frame, pattern, font and long-text fit comes out exactly as it appears on screen.
 *
 * Exports run in the browser from the data the signed-in owner already has loaded (the editor or the dashboard).
 * They have no URL and read nothing from the server, so drafts are as private as they were.
 */

/** The invitation is laid out 1200 CSS px wide (1500 tall, the 4:5 card) and drawn at twice that. */
export const EXPORT_CARD_WIDTH = 1200;
export const EXPORT_PIXEL_RATIO = 2;
/** Printed at 8 x 10 inches, so the full size file is 300 dpi. */
const PAGE_POINTS = { width: 8 * 72, height: 10 * 72 };
const MAX_IMAGE_BYTES = 15 * 1024 * 1024;

export const EXPORT_ERROR_MESSAGE = "We couldn't create your file. Please try again.";
export const EXPORT_TEMPLATE_MESSAGE = "This invitation uses a template that is no longer available, so it can't be exported.";
export const EXPORT_IMAGE_MESSAGE =
  "We couldn't load your background image, so the export would be missing it. Check the image link, or upload the image instead, and try again.";

/** An error whose message is safe to show as it is. */
export class ExportError extends Error {}

export interface ExportSource {
  templateId: string;
  content: InvitationContent;
  design: InvitationDesign;
  /** The invitation's name, used for the file name. */
  title: string;
}

export interface ExportResult {
  blob: Blob;
  filename: string;
  /** Pixel size of the picture inside the file. */
  width: number;
  height: number;
}

const frame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

function readAsDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

/**
 * Turns a linked background image into an embedded one for the export render only. The saved invitation is
 * untouched. A picture the browser may not read (no CORS, a dead link, SVG, too large) stops the export with a
 * clear message instead of quietly producing a file without it.
 */
async function embedBackgroundImage(design: InvitationDesign): Promise<InvitationDesign> {
  const url = design.backgroundImage;
  if (!url || url.startsWith("data:") || !/^https?:\/\//i.test(url)) return design;
  try {
    const response = await fetch(url, { mode: "cors", credentials: "omit" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const blob = await response.blob();
    if (!/^image\/(png|jpeg|webp|gif)$/.test(blob.type) || blob.size > MAX_IMAGE_BYTES) throw new Error(`Unusable image: ${blob.type}, ${blob.size} bytes`);
    return { ...design, backgroundImage: await readAsDataUrl(blob) };
  } catch (e) {
    if (import.meta.env.DEV) console.error("[export] background image", e);
    throw new ExportError(EXPORT_IMAGE_MESSAGE);
  }
}

/** Waits for fonts and for the fitted text regions to settle, so the picture is taken after layout is final. */
async function settle(host: HTMLElement) {
  await frame();
  await document.fonts.ready;
  await frame();
  let previous = "";
  for (let i = 0; i < 20; i++) {
    const regions = Array.from(host.querySelectorAll<HTMLElement>("[data-fitbox]"));
    const now = regions.map((r) => r.dataset.fitScale).join(",") + `|${host.scrollHeight}`;
    if (regions.length > 0 && now === previous) return;
    previous = now;
    await frame();
  }
}

async function drawCanvas(source: ExportSource, pixelRatio: number): Promise<HTMLCanvasElement> {
  const { toCanvas } = await import("html-to-image");
  const host = document.createElement("div");
  // Off screen but laid out (not display:none), so measurements and fitted text are real.
  host.style.cssText = `position:fixed;left:-100000px;top:0;width:${EXPORT_CARD_WIDTH}px;pointer-events:none;`;
  host.setAttribute("aria-hidden", "true");
  document.body.appendChild(host);
  const root = createRoot(host);
  try {
    flushSync(() => root.render(createElement(InvitationRenderer, { templateId: source.templateId, content: source.content, design: source.design })));
    await settle(host);
    const card = host.firstElementChild as HTMLElement | null;
    if (!card) throw new Error("Nothing was rendered");
    const options = { pixelRatio, width: EXPORT_CARD_WIDTH, height: Math.round(EXPORT_CARD_WIDTH * 1.25), cacheBust: false } as const;
    // Safari can return a blank first picture from SVG based capture, so it gets a throwaway first pass.
    if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) await toCanvas(card, options);
    return await toCanvas(card, options);
  } finally {
    root.unmount();
    host.remove();
  }
}

async function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
  if (!blob) throw new Error("The canvas produced no data");
  return blob;
}

async function toPdf(canvas: HTMLCanvasElement, title: string): Promise<Blob> {
  const { width, height } = canvas;
  const flat = document.createElement("canvas");
  flat.width = width;
  flat.height = height;
  const ctx = flat.getContext("2d");
  if (!ctx) throw new Error("No 2d context");
  ctx.fillStyle = "#fff"; // PDF images carry no transparency, so any gap is white paper
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(canvas, 0, 0);
  const image =
    typeof CompressionStream === "undefined"
      ? ({ width, height, kind: "jpeg", data: new Uint8Array(await (await canvasToBlob(flat, "image/jpeg", 0.95)).arrayBuffer()) } as const)
      : ({ width, height, kind: "rgb-flate", data: await deflate(rgbaToRgb(ctx.getImageData(0, 0, width, height).data)) } as const);
  const bytes = assemblePdf(image, { pageWidth: PAGE_POINTS.width, pageHeight: PAGE_POINTS.height, title });
  return new Blob([bytes as BlobPart], { type: "application/pdf" });
}

export async function exportInvitation(format: ExportFormat, source: ExportSource): Promise<ExportResult> {
  if (!getTemplate(source.templateId)) throw new ExportError(EXPORT_TEMPLATE_MESSAGE);
  try {
    const design = await embedBackgroundImage(source.design);
    const prepared = { ...source, design };
    // Load everything the render needs before drawing it: the template chunk and its fonts.
    await Promise.all([loadTemplateComponent(source.templateId), ...[design.headingFont, design.bodyFont, design.scriptFont].map((f) => (f ? ensureFontLoaded(f) : undefined))]);

    let canvas: HTMLCanvasElement;
    try {
      canvas = await drawCanvas(prepared, EXPORT_PIXEL_RATIO);
    } catch (e) {
      // A very large canvas can fail on a small device. Try again at normal size before giving up.
      if (import.meta.env.DEV) console.error("[export] retrying at 1x", e);
      canvas = await drawCanvas(prepared, 1);
    }
    const filename = exportFileName(source.title, source.content.hostNames, format);
    const blob = format === "png" ? await canvasToBlob(canvas, "image/png") : await toPdf(canvas, source.title.trim() || source.content.hostNames);
    return { blob, filename, width: canvas.width, height: canvas.height };
  } catch (e) {
    if (e instanceof ExportError) throw e;
    if (import.meta.env.DEV) console.error("[export]", e);
    throw new ExportError(EXPORT_ERROR_MESSAGE);
  }
}

/** Saves a blob as a file through a temporary link. */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Give the browser a moment to start the download before the URL goes away.
  window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
