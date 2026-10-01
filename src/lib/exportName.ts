import { slugify } from "./slug";

export type ExportFormat = "png" | "pdf";

export const FORMAT_LABEL: Record<ExportFormat, string> = { png: "PNG", pdf: "PDF" };

/**
 * A clean file name from the invitation's name, falling back to the host names and then to "invitation":
 * "Ava & Noah's Wedding" becomes "ava-and-noah-s-wedding.png". Lowercase, hyphens, no spaces or symbols.
 */
export function exportFileName(title: string, hostNames: string, format: ExportFormat): string {
  const base = slugify(title.trim() ? title : hostNames, slugify(hostNames, "invitation"));
  return `${base}.${format}`;
}
