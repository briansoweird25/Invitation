import { describe, expect, it } from "vitest";
import type { TemplateListItem } from "@/components/invitation/templateCatalog";
import type { InvitationCategory } from "@/data/taxonomy";
import {
  categoriesInUse,
  filterBase,
  filterByStyles,
  parseAccess,
  parseSort,
  parseStyles,
  sortTemplates,
  stylesInUse,
  suitsCategory,
  templateCategories,
  templatesInCategory,
} from "./templateFilters";

const fixture = (id: string, category: InvitationCategory, extra: Partial<TemplateListItem> = {}): TemplateListItem =>
  ({ id, name: id, category, styles: ["elegant"], tier: "free", isPremium: false, status: "active", addedAt: "2026-01-01", ...extra }) as TemplateListItem;

const list: TemplateListItem[] = [
  fixture("wedding-only", "wedding"),
  fixture("wedding-also", "wedding", { alsoSuits: ["engagement", "anniversary"], tier: "premium", isPremium: true, styles: ["floral"] }),
  fixture("birthday-also", "birthday", { alsoSuits: ["baby-shower", "general-party"], featured: true, styles: ["playful"] }),
  fixture("shower-premium", "baby-shower", { tier: "premium", isPremium: true, styles: ["botanical", "playful"] }),
  fixture("graduation-only", "graduation"),
];
const ids = (l: TemplateListItem[]) => l.map((t) => t.id);

describe("category discovery", () => {
  it("lists a template in its primary category", () => {
    expect(ids(templatesInCategory(list, "wedding"))).toEqual(["wedding-only", "wedding-also"]);
    expect(ids(templatesInCategory(list, "graduation"))).toEqual(["graduation-only"]);
  });

  it("lists a template in every alsoSuits category too", () => {
    expect(ids(templatesInCategory(list, "engagement"))).toEqual(["wedding-also"]);
    expect(ids(templatesInCategory(list, "anniversary"))).toEqual(["wedding-also"]);
    expect(ids(templatesInCategory(list, "baby-shower"))).toEqual(["birthday-also", "shower-premium"]);
    expect(ids(templatesInCategory(list, "general-party"))).toEqual(["birthday-also"]);
  });

  it("keeps a template without alsoSuits in its primary category only", () => {
    const categoriesOfOnly = (["wedding", "birthday", "graduation", "engagement"] as const).filter((c) => suitsCategory(list[0], c));
    expect(categoriesOfOnly).toEqual(["wedding"]);
    expect(templateCategories(list[0])).toEqual(["wedding"]);
  });

  it("puts the primary category first and drops duplicates", () => {
    expect(templateCategories({ category: "wedding", alsoSuits: ["engagement", "wedding", "engagement"] })).toEqual(["wedding", "engagement"]);
  });

  it("does not duplicate template records", () => {
    const everywhere = ["wedding", "engagement", "anniversary", "birthday", "baby-shower", "general-party", "graduation"] as const;
    const seen = everywhere.flatMap((c) => ids(templatesInCategory(list, c)));
    expect(new Set(list.map((t) => t.id)).size).toBe(list.length);
    // wedding-also is listed under three categories but is still one record
    expect(seen.filter((id) => id === "wedding-also")).toHaveLength(3);
  });

  it("counts the templates discoverable in each category", () => {
    const counts = Object.fromEntries(categoriesInUse(list).map((c) => [c, templatesInCategory(list, c).length]));
    expect(counts).toEqual({ wedding: 2, birthday: 1, "baby-shower": 2, engagement: 1, anniversary: 1, graduation: 1, "general-party": 1 });
  });

  it("lists only categories that have discoverable templates, in taxonomy order", () => {
    expect(categoriesInUse(list)).toEqual(["wedding", "birthday", "baby-shower", "engagement", "anniversary", "graduation", "general-party"]);
    expect(categoriesInUse([])).toEqual([]);
  });
});

describe("filters", () => {
  it("filters by access", () => {
    expect(ids(filterBase(list, { access: "free" }))).toEqual(["wedding-only", "birthday-also", "graduation-only"]);
    expect(ids(filterBase(list, { access: "premium" }))).toEqual(["wedding-also", "shower-premium"]);
    expect(ids(filterBase(list, { access: "all" }))).toHaveLength(5);
  });

  it("combines category and access, including alsoSuits categories", () => {
    expect(ids(filterBase(list, { category: "baby-shower", access: "free" }))).toEqual(["birthday-also"]);
    expect(ids(filterBase(list, { category: "baby-shower", access: "premium" }))).toEqual(["shower-premium"]);
    expect(ids(filterBase(list, { category: "wedding", access: "premium" }))).toEqual(["wedding-also"]);
    expect(ids(filterBase(list, { category: "engagement", access: "free" }))).toEqual([]);
    expect(ids(filterBase(list, { category: "engagement", access: "premium" }))).toEqual(["wedding-also"]);
  });

  it("combines category, access and style", () => {
    const base = filterBase(list, { category: "baby-shower", access: "all" });
    expect(ids(filterByStyles(base, ["playful"]))).toEqual(["birthday-also", "shower-premium"]);
    expect(ids(filterByStyles(base, ["botanical"]))).toEqual(["shower-premium"]);
    expect(ids(filterByStyles(base, []))).toEqual(["birthday-also", "shower-premium"]);
  });

  it("counts styles from the filtered list", () => {
    const base = filterBase(list, { category: "baby-shower", access: "all" });
    expect(stylesInUse(base)).toEqual([
      { style: "botanical", count: 1 },
      { style: "playful", count: 2 },
    ]);
  });

  it("lists primary-category templates first on a category page, then the rest in sort order", () => {
    const base = filterBase(list, { category: "baby-shower", access: "all" });
    expect(ids(sortTemplates(base, "featured"))).toEqual(["birthday-also", "shower-premium"]);
    expect(ids(sortTemplates(base, "featured", "baby-shower"))).toEqual(["shower-premium", "birthday-also"]);
    expect(ids(sortTemplates(base, "az", "baby-shower"))).toEqual(["shower-premium", "birthday-also"]);
  });

  it("parses URL parameters safely", () => {
    expect(parseAccess("premium")).toBe("premium");
    expect(parseAccess("nonsense")).toBe("all");
    expect(parseSort("az")).toBe("az");
    expect(parseSort(null)).toBe("featured");
    expect(parseStyles("floral,nope,floral,vintage")).toEqual(["floral", "vintage"]);
    expect(parseStyles(null)).toEqual([]);
  });
});
