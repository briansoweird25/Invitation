const HEX = /^#[0-9a-f]{6}$/i;

export const isHexColor = (value: string) => HEX.test(value);

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two #rrggbb colors, or null if either is not valid. */
export function contrastRatio(a: string, b: string): number | null {
  if (!isHexColor(a) || !isHexColor(b)) return null;
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** The candidate with the best contrast against `background`. Used for text drawn on an accent-colored shape. */
export function pickReadable(background: string, ...candidates: string[]): string {
  return candidates.reduce((best, c) => ((contrastRatio(c, background) ?? 0) > (contrastRatio(best, background) ?? 0) ? c : best), candidates[0]);
}
