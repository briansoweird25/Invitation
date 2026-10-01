import { describe, expect, it } from "vitest";
import { assemblePdf, deflate, pdfString, rgbaToRgb } from "./pdf";

const text = (bytes: Uint8Array) => new TextDecoder("latin1").decode(bytes);
const build = (title?: string) =>
  assemblePdf({ width: 2, height: 3, kind: "rgb-flate", data: new Uint8Array([1, 2, 3, 4, 5]) }, { pageWidth: 576, pageHeight: 720, title, date: new Date(Date.UTC(2026, 0, 2, 3, 4, 5)) });

describe("assemblePdf", () => {
  it("writes a one-page document with the image filling the page", () => {
    const s = text(build("Ava and Noah"));
    expect(s.startsWith("%PDF-1.4")).toBe(true);
    expect(s.trimEnd().endsWith("%%EOF")).toBe(true);
    expect(s).toContain("/MediaBox [0 0 576 720]");
    expect(s).toContain("/Count 1");
    expect(s).toContain("q 576 0 0 720 0 0 cm /Im0 Do Q");
    expect(s).toContain("/Width 2 /Height 3");
    expect(s).toContain("/FlateDecode");
    expect(s).toContain("/Title (Ava and Noah)");
    expect(s).toContain("/CreationDate (D:20260102030405Z)");
  });

  it("uses the DCT filter for a JPEG image", () => {
    const s = text(assemblePdf({ width: 1, height: 1, kind: "jpeg", data: new Uint8Array([0xff, 0xd8]) }, { pageWidth: 10, pageHeight: 10 }));
    expect(s).toContain("/DCTDecode");
    expect(s).not.toContain("/Title");
  });

  it("has a cross-reference table whose offsets point at each object", () => {
    const bytes = build();
    const s = text(bytes);
    const start = Number(/startxref\n(\d+)\n/.exec(s)![1]);
    expect(s.slice(start, start + 4)).toBe("xref");
    const entries = [...s.slice(start).matchAll(/(\d{10}) 00000 n /g)].map((m) => Number(m[1]));
    expect(entries).toHaveLength(6);
    entries.forEach((offset, i) => expect(s.slice(offset, offset + `${i + 1} 0 obj`.length)).toBe(`${i + 1} 0 obj`));
  });

  it("records the exact stream lengths", () => {
    const s = text(build());
    expect(s).toMatch(/\/Length 5 >>\nstream\n/);
  });
});

describe("pdfString", () => {
  it("escapes parentheses and backslashes", () => {
    expect(pdfString("a (b) \\ c")).toBe("(a \\(b\\) \\\\ c)");
  });
  it("encodes non-ASCII text as UTF-16", () => {
    expect(pdfString("Zoë")).toBe("<FEFF005A006F00EB>");
  });
});

describe("pixel helpers", () => {
  it("drops alpha", () => {
    expect([...rgbaToRgb(new Uint8ClampedArray([1, 2, 3, 255, 4, 5, 6, 0]))]).toEqual([1, 2, 3, 4, 5, 6]);
  });
  it("compresses to a zlib stream", async () => {
    const out = await deflate(new Uint8Array(1000));
    expect(out[0]).toBe(0x78);
    expect(out.length).toBeLessThan(100);
  });
});
