import { describe, expect, it } from "vitest";
import { categoryConfigs } from "@/data/categories";
import { categories } from "@/data/taxonomy";
import { createInvitationDraft } from "@/lib/invitation";
import { filterBase, suitsCategory } from "@/lib/templateFilters";
import {
  categoriesWithTemplates,
  getTemplate,
  resolveCategory,
  sampleContentFor,
  startingPoint,
  templateList,
  templatesForCategory,
} from "./templateCatalog";

describe("template catalog", () => {
  it("has unique ids and valid categories", () => {
    expect(new Set(templateList.map((t) => t.id)).size).toBe(templateList.length);
    for (const t of templateList) {
      expect(categories).toContain(t.category);
      for (const c of t.alsoSuits ?? []) {
        expect(categories).toContain(c);
        expect(c).not.toBe(t.category);
      }
      expect(new Set(t.alsoSuits ?? []).size).toBe((t.alsoSuits ?? []).length);
    }
  });

  it("preserves the ids and primary categories of the shipped templates", () => {
    const expected: Record<string, string> = {
      "elegant-wedding": "wedding",
      "floral-wedding": "wedding",
      "minimal-wedding": "wedding",
      "luxury-wedding": "wedding",
      "modern-birthday": "birthday",
      "confetti-birthday": "birthday",
      "vintage-birthday": "birthday",
      "editorial-birthday": "birthday",
      "botanical-baby-shower": "baby-shower",
      "rainbow-baby-shower": "baby-shower",
      "moonlight-baby-shower": "baby-shower",
    };
    for (const [id, category] of Object.entries(expected)) expect(getTemplate(id)?.category).toBe(category);
  });

  it("makes every template discoverable in its primary and alsoSuits categories", () => {
    for (const t of templateList) {
      for (const c of [t.category, ...(t.alsoSuits ?? [])]) expect(templatesForCategory(c).map((x) => x.id)).toContain(t.id);
    }
  });

  it("only lists categories that have discoverable templates", () => {
    for (const c of categories) expect(categoriesWithTemplates().includes(c)).toBe(templatesForCategory(c).length > 0);
  });

  it("reports counts that match what the category page shows", () => {
    for (const c of categoriesWithTemplates()) {
      expect(filterBase(templateList, { category: c, access: "all" })).toHaveLength(templatesForCategory(c).length);
      const free = filterBase(templateList, { category: c, access: "free" }).length;
      const premium = filterBase(templateList, { category: c, access: "premium" }).length;
      expect(free + premium).toBe(templatesForCategory(c).length);
    }
  });

  it("gives every template at least three presets", () => {
    for (const t of templateList) expect(t.presets.length).toBeGreaterThanOrEqual(3);
  });
});

describe("category-aware starting points", () => {
  const confetti = getTemplate("confetti-birthday")!;

  it("uses the primary category by default", () => {
    expect(resolveCategory(confetti)).toBe("birthday");
    expect(createInvitationDraft("confetti-birthday").category).toBe("birthday");
  });

  it("uses a requested category the template suits, with that category's sample content", () => {
    expect(suitsCategory(confetti, "baby-shower")).toBe(true);
    const draft = createInvitationDraft("confetti-birthday", null, "baby-shower");
    expect(draft.category).toBe("baby-shower");
    expect(draft.content.hostNames).toBe(categoryConfigs["baby-shower"].sampleContent.hostNames);
    expect(sampleContentFor(confetti, "baby-shower")).toEqual(categoryConfigs["baby-shower"].sampleContent);
  });

  it("falls back to the primary category for a category the template does not suit", () => {
    expect(resolveCategory(confetti, "retirement")).toBe("birthday");
    expect(createInvitationDraft("confetti-birthday", null, "retirement").category).toBe("birthday");
    expect(createInvitationDraft("confetti-birthday", null, "not-a-category").category).toBe("birthday");
  });

  it("keeps the template's own sample content in its primary category", () => {
    expect(sampleContentFor(confetti).hostNames).toBe(confetti.sampleContent?.hostNames);
  });

  it("preserves the chosen preset", () => {
    const point = startingPoint(confetti, "mint-pop", "baby-shower");
    expect(point.design.presetId).toBe("mint-pop");
    expect(createInvitationDraft("confetti-birthday", "sunny-day").design.presetId).toBe("sunny-day");
    expect(createInvitationDraft("confetti-birthday", "does-not-exist").design.presetId).toBe(confetti.presets[0].id);
  });
});
