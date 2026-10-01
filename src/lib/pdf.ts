/**
 * A minimal single-page PDF writer for one full-page image. The invitation is drawn by `InvitationRenderer`
 * and rasterised first, so the PDF only has to hold that picture at the right physical size.
 */

export interface PdfImage {
  width: number;
  height: number;
  /** "rgb-flate" is 8-bit RGB compressed with zlib. "jpeg" is a complete JPEG file. */
  kind: "rgb-flate" | "jpeg";
  data: Uint8Array;
}

export interface PdfOptions {
  /** Page size in PDF points (1/72 inch). */
  pageWidth: number;
  pageHeight: number;
  title?: string;
  /** Fixed in tests; defaults to now. */
  date?: Date;
}

const enc = new TextEncoder();

/** A PDF text string: plain ASCII in parentheses, anything else as UTF-16BE hex. */
export function pdfString(text: string): string {
  if (/^[\x20-\x7e]*$/.test(text)) return `(${text.replace(/[\\()]/g, "\\$&")})`;
  let hex = "FEFF";
  for (let i = 0; i < text.length; i++) hex += text.charCodeAt(i).toString(16).padStart(4, "0").toUpperCase();
  return `<${hex}>`;
}

const pdfDate = (d: Date) => {
  const p = (n: number) => String(n).padStart(2, "0");
  return `D:${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}${p(d.getUTCHours())}${p(d.getUTCMinutes())}${p(d.getUTCSeconds())}Z`;
};

const num = (n: number) => String(Math.round(n * 100) / 100);

/** Drops the alpha channel of RGBA pixels, giving the packed RGB a PDF image wants. */
export function rgbaToRgb(rgba: Uint8ClampedArray | Uint8Array): Uint8Array {
  const out = new Uint8Array((rgba.length / 4) * 3);
  for (let i = 0, j = 0; i < rgba.length; i += 4, j += 3) {
    out[j] = rgba[i];
    out[j + 1] = rgba[i + 1];
    out[j + 2] = rgba[i + 2];
  }
  return out;
}

/** Compresses bytes with zlib, which is what the PDF FlateDecode filter expects. */
export async function deflate(bytes: Uint8Array): Promise<Uint8Array> {
  const stream = new Blob([bytes as BlobPart]).stream().pipeThrough(new CompressionStream("deflate"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

export function assemblePdf(image: PdfImage, { pageWidth, pageHeight, title, date = new Date() }: PdfOptions): Uint8Array {
  const chunks: Uint8Array[] = [];
  const offsets: number[] = [];
  let length = 0;
  const push = (data: Uint8Array | string) => {
    const bytes = typeof data === "string" ? enc.encode(data) : data;
    chunks.push(bytes);
    length += bytes.length;
  };
  const object = (n: number, dict: string, stream?: Uint8Array | string) => {
    offsets[n] = length;
    push(`${n} 0 obj\n<< ${dict}${stream ? ` /Length ${typeof stream === "string" ? enc.encode(stream).length : stream.length}` : ""} >>\n`);
    if (stream) {
      push("stream\n");
      push(stream);
      push("\nendstream\n");
    }
    push("endobj\n");
  };

  push("%PDF-1.4\n");
  push(new Uint8Array([0x25, 0xe2, 0xe3, 0xcf, 0xd3, 0x0a])); // marks the file as binary
  object(1, "/Type /Catalog /Pages 2 0 R");
  object(2, "/Type /Pages /Kids [3 0 R] /Count 1");
  object(3, `/Type /Page /Parent 2 0 R /MediaBox [0 0 ${num(pageWidth)} ${num(pageHeight)}] /Resources << /XObject << /Im0 4 0 R >> /ProcSet [/PDF /ImageC] >> /Contents 5 0 R`);
  object(
    4,
    `/Type /XObject /Subtype /Image /Width ${image.width} /Height ${image.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter ${image.kind === "jpeg" ? "/DCTDecode" : "/FlateDecode"}`,
    image.data,
  );
  object(5, "", `q ${num(pageWidth)} 0 0 ${num(pageHeight)} 0 0 cm /Im0 Do Q`);
  object(6, `${title ? `/Title ${pdfString(title)} ` : ""}/Producer (Invitation Generator) /CreationDate (${pdfDate(date)})`);

  const xref = length;
  push(`xref\n0 7\n0000000000 65535 f \n`);
  for (let n = 1; n <= 6; n++) push(`${String(offsets[n]).padStart(10, "0")} 00000 n \n`);
  push(`trailer\n<< /Size 7 /Root 1 0 R /Info 6 0 R >>\nstartxref\n${xref}\n%%EOF\n`);

  const out = new Uint8Array(length);
  let at = 0;
  for (const c of chunks) {
    out.set(c, at);
    at += c.length;
  }
  return out;
}
