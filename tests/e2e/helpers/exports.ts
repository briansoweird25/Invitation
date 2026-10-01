import zlib from "node:zlib";
import { expect, type Page } from "@playwright/test";
import { readFile } from "node:fs/promises";

export interface Downloaded {
  filename: string;
  buffer: Buffer;
}

/** Opens the editor's Export menu, picks a format and returns the file the browser downloads. */
export async function exportFromEditor(page: Page, format: "png" | "pdf"): Promise<Downloaded> {
  await page.getByRole("button", { name: "Export" }).click();
  const [download] = await Promise.all([page.waitForEvent("download", { timeout: 60_000 }), page.getByRole("menuitem", { name: format === "png" ? "Download PNG image" : "Download PDF" }).click()]);
  const path = await download.path();
  return { filename: download.suggestedFilename(), buffer: await readFile(path) };
}

/** Width and height from a PNG's header, after checking its signature. */
export function pngSize(buffer: Buffer): { width: number; height: number } {
  expect(buffer.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

/**
 * Compares the exported picture with a screenshot of the same invitation drawn on screen. Both are scaled to the
 * screenshot's size, then every pixel is compared. Returns the share of pixels that differ clearly and the mean
 * difference, so a test can allow for font anti-aliasing but not for missing decoration, wrong colors or shifted text.
 */
export async function diffAgainstScreen(page: Page, exported: Buffer, screen: Buffer): Promise<{ differing: number; mean: number }> {
  return page.evaluate(
    async ([a, b]) => {
      const load = (b64: string) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = `data:image/png;base64,${b64}`;
        });
      const [ia, ib] = await Promise.all([load(a), load(b)]);
      const w = ib.naturalWidth;
      const h = ib.naturalHeight;
      const draw = (img: HTMLImageElement) => {
        const c = document.createElement("canvas");
        c.width = w;
        c.height = h;
        const ctx = c.getContext("2d")!;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, w, h);
        return ctx.getImageData(0, 0, w, h).data;
      };
      const da = draw(ia);
      const db = draw(ib);
      let differing = 0;
      let sum = 0;
      for (let i = 0; i < da.length; i += 4) {
        const d = (Math.abs(da[i] - db[i]) + Math.abs(da[i + 1] - db[i + 1]) + Math.abs(da[i + 2] - db[i + 2])) / 3;
        sum += d;
        if (d > 48) differing++;
      }
      const pixels = da.length / 4;
      return { differing: differing / pixels, mean: sum / pixels };
    },
    [exported.toString("base64"), screen.toString("base64")] as const,
  );
}

/** How many distinct colors a PNG holds (sampled), to tell a real picture from a blank one. */
export async function distinctColors(page: Page, png: Buffer): Promise<number> {
  return page.evaluate(async (b64) => {
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = `data:image/png;base64,${b64}`;
    });
    const c = document.createElement("canvas");
    c.width = 300;
    c.height = 375;
    const ctx = c.getContext("2d")!;
    ctx.drawImage(img, 0, 0, 300, 375);
    const d = ctx.getImageData(0, 0, 300, 375).data;
    const seen = new Set<number>();
    for (let i = 0; i < d.length; i += 4) seen.add((d[i] << 16) | (d[i + 1] << 8) | d[i + 2]);
    return seen.size;
  }, png.toString("base64"));
}

/** A small solid-color PNG, built here so tests need no fixture file. */
export function solidPng(width: number, height: number, [r, g, b]: [number, number, number]): Buffer {
  
  const crcTable = Array.from({ length: 256 }, (_, n) => {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    return c >>> 0;
  });
  const crc = (buf: Buffer) => {
    let c = 0xffffffff;
    for (const byte of buf) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  };
  const chunk = (type: string, data: Buffer) => {
    const body = Buffer.concat([Buffer.from(type), data]);
    const out = Buffer.alloc(12 + data.length);
    out.writeUInt32BE(data.length, 0);
    body.copy(out, 4);
    out.writeUInt32BE(crc(body), 8 + data.length);
    return out;
  };
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header.set([8, 2, 0, 0, 0], 8);
  const row = Buffer.concat([Buffer.from([0]), Buffer.from(Array.from({ length: width }, () => [r, g, b]).flat())]);
  const raw = Buffer.concat(Array.from({ length: height }, () => row));
  return Buffer.concat([Buffer.from("89504e470d0a1a0a", "hex"), chunk("IHDR", header), chunk("IDAT", zlib.deflateSync(raw)), chunk("IEND", Buffer.alloc(0))]);
}

/** The color of one pixel of a PNG, read through a canvas in the page. */
export async function pixelAt(page: Page, png: Buffer, x: number, y: number): Promise<[number, number, number]> {
  return page.evaluate(
    async ([b64, px, py]) => {
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = `data:image/png;base64,${b64}`;
      });
      const c = document.createElement("canvas");
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const ctx = c.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const d = ctx.getImageData(px as number, py as number, 1, 1).data;
      return [d[0], d[1], d[2]] as [number, number, number];
    },
    [png.toString("base64"), x, y] as const,
  );
}
