import type { TemplateListItem } from "@/components/invitation/templateCatalog";
import { isTemplateStyle, styleTags, type InvitationCategory, type TemplateStyle } from "@/data/taxonomy";

export type Access = "all" | "free" | "premium";
export type SortKey = "featured" | "new" | "az";

export const sortOptions: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "new", label: "New" },
  { value: "az", label: "A to Z" },
];

export const styleLabel = (style: string) => style.charAt(0).toUpperCase() + style.slice(1);

export function parseAccess(value: string | null): Access {
  return value === "free" || value === "premium" ? value : "all";
}

export function parseSort(value: string | null): SortKey {
  return value === "new" || value === "az" ? value : "featured";
}

/** `?style=floral,vintage` becomes ["floral", "vintage"]. Unknown tags and duplicates are dropped. */
export function parseStyles(value: string | null): TemplateStyle[] {
  return [...new Set((value ?? "").split(",").filter(isTemplateStyle))];
}

interface Filters {
  category?: InvitationCategory;
  access: Access;
}

/** Category and price filters. Style filters are applied separately so style counts can ignore them. */
export function filterBase(list: TemplateListItem[], { category, access }: Filters): TemplateListItem[] {
  return list.filter((t) => (!category || t.category === category) && (access === "all" || (access === "premium") === t.isPremium));
}

/** A template matches when it has at least one of the selected styles. No selection matches everything. */
export function filterByStyles(list: TemplateListItem[], styles: TemplateStyle[]): TemplateListItem[] {
  return styles.length === 0 ? list : list.filter((t) => t.styles.some((s) => styles.includes(s)));
}

/** Stable sorts: ties keep catalog order. */
export function sortTemplates(list: TemplateListItem[], sort: SortKey): TemplateListItem[] {
  const indexed = list.map((t, i) => ({ t, i }));
  const compare: Record<SortKey, (a: { t: TemplateListItem; i: number }, b: { t: TemplateListItem; i: number }) => number> = {
    featured: (a, b) => Number(Boolean(b.t.featured)) - Number(Boolean(a.t.featured)),
    new: (a, b) => b.t.addedAt.localeCompare(a.t.addedAt),
    az: (a, b) => a.t.name.localeCompare(b.t.name),
  };
  return indexed.sort((a, b) => compare[sort](a, b) || a.i - b.i).map((x) => x.t);
}

/** Styles that at least one template in the list has, in taxonomy order, with counts. */
export function stylesInUse(list: TemplateListItem[]): { style: TemplateStyle; count: number }[] {
  return styleTags
    .map((style) => ({ style, count: list.filter((t) => t.styles.includes(style)).length }))
    .filter((s) => s.count > 0);
}
