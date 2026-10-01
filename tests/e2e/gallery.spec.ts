import { expect, test } from "@playwright/test";
import { categoriesWithTemplates, templateList, templatesForCategory } from "@/components/invitation/templateCatalog";
import { getCategoryConfig } from "@/data/categories";
import { installMockSupabase, login, trackErrors } from "./helpers/mockSupabase";

const names = async (page: import("@playwright/test").Page) => {
  await page.locator("article h2, :text(\"No templates here yet\")").first().waitFor();
  return page.locator("article h2").allInnerTexts();
};
const expectedNames = (category: Parameters<typeof templatesForCategory>[0]) => templatesForCategory(category).map((t) => t.name).sort();

test.describe("category discovery", () => {
  test("every category page lists its primary and alsoSuits templates, and the tab counts match", async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto("/templates");
    await expect(page.locator("article h2")).toHaveCount(templateList.length);

    for (const category of categoriesWithTemplates()) {
      await page.goto(`/templates/${category}`);
      await expect(page.locator("article h2")).toHaveCount(templatesForCategory(category).length);
      expect((await names(page)).sort()).toEqual(expectedNames(category));
      const label = getCategoryConfig(category).label;
      await expect(page.locator("nav[aria-label='Template categories'] a", { hasText: label })).toContainText(String(templatesForCategory(category).length));
    }
    expect(errors).toEqual([]);
  });

  test("a template that only suits a category is listed after the templates that belong to it", async ({ page }) => {
    await page.goto("/templates/baby-shower");
    const list = await names(page);
    const primary = templateList.filter((t) => t.category === "baby-shower").map((t) => t.name);
    expect(list.slice(0, primary.length).sort()).toEqual([...primary].sort());
    expect(list).toContain("Confetti Birthday");
  });

  test("category tabs only appear for categories with discoverable templates", async ({ page }) => {
    await page.goto("/templates");
    await expect(page.locator("nav[aria-label='Template categories'] a")).toHaveCount(categoriesWithTemplates().length + 1);
  });

  test("free and premium filters work on category pages and combine with the category", async ({ page }) => {
    for (const category of ["baby-shower", "wedding"] as const) {
      const all = templatesForCategory(category);
      for (const [access, wantPremium] of [["free", false], ["premium", true]] as const) {
        await page.goto(`/templates/${category}?access=${access}`);
        const expected = all.filter((t) => t.isPremium === wantPremium).map((t) => t.name).sort();
        if (expected.length === 0) await expect(page.getByText("No templates here yet")).toBeVisible();
        else expect((await names(page)).sort()).toEqual(expected);
      }
    }
  });

  test("style filters combine with category and access, and the URL stays shareable", async ({ page }) => {
    await page.goto("/templates/baby-shower?style=playful&access=free");
    const expected = templatesForCategory("baby-shower").filter((t) => !t.isPremium && t.styles.includes("playful")).map((t) => t.name).sort();
    expect((await names(page)).sort()).toEqual(expected);
    await page.reload();
    expect((await names(page)).sort()).toEqual(expected);
    // Switching tabs keeps the other filters.
    await page.locator("nav[aria-label='Template categories'] a", { hasText: "Birthday" }).click();
    await expect(page).toHaveURL(/style=playful/);
    await expect(page).toHaveURL(/access=free/);
  });

  test("an unknown category is a 404", async ({ page }) => {
    await page.goto("/templates/space-party");
    await expect(page.getByText("Page not found")).toBeVisible();
  });
});

test.describe("selecting a template keeps the template, preset and category", () => {
  test("from a category page the editor starts with that category's wording and the chosen template", async ({ page, context }) => {
    const errors = trackErrors(page);
    await installMockSupabase(context);
    await login(page);
    await page.goto("/templates/baby-shower");
    await page.locator("article", { hasText: "Confetti Birthday" }).getByRole("link", { name: "Use template" }).click();
    await expect(page).toHaveURL(/template=confetti-birthday/);
    await expect(page).toHaveURL(/category=baby-shower/);
    await expect(page.locator("label", { hasText: "Parents-to-be" })).toBeVisible();
    await expect(page.locator("#event-hostNames")).toHaveValue(/Nina/);
    await expect(page.locator("[role=img]")).toContainText("Nina");
    expect(errors).toEqual([]);
  });

  test("the preview dialog carries the chosen Look into the editor", async ({ page, context }) => {
    await installMockSupabase(context);
    await login(page);
    await page.goto("/templates/baby-shower");
    await page.getByRole("button", { name: "Preview Confetti Birthday" }).click();
    await page.locator("[role=group][aria-label=Variations]").getByRole("button", { name: "Mint Pop" }).click();
    await page.getByRole("link", { name: "Use this template" }).click();
    await expect(page).toHaveURL(/preset=mint-pop/);
    await expect(page).toHaveURL(/category=baby-shower/);
    const bg = await page.locator("[role=img] > div > div").evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg).toBe("rgb(223, 245, 236)");
  });

  test("existing template links without a category still work and use the primary category", async ({ page, context }) => {
    await installMockSupabase(context);
    await login(page);
    await page.goto("/editor/new?template=confetti-birthday");
    await expect(page.locator("label", { hasText: /^Name$/ })).toBeVisible();
    await expect(page.locator("#event-hostNames")).toHaveValue("Leo");
    await page.goto("/editor/new?template=confetti-birthday&category=retirement");
    await expect(page.locator("#event-hostNames")).toHaveValue("Leo");
  });

  test("the saved invitation records the chosen category", async ({ page, context }) => {
    const mock = await installMockSupabase(context);
    await login(page);
    await page.goto("/editor/new?template=confetti-birthday&category=baby-shower");
    await page.fill("#event-hostNames", "Priya & Omar");
    await expect(page.locator("header >> text=✓ Saved")).toBeVisible();
    const row = [...mock.db.values()].find((r) => r.template_id === "confetti-birthday");
    expect(row?.category).toBe("baby-shower");
    await page.reload();
    await expect(page.locator("label", { hasText: "Parents-to-be" })).toBeVisible();
  });
});

test("the landing page counts discoverable templates per category", async ({ page }) => {
  await page.goto("/");
  const cards = page.locator("#categories ul > li");
  await expect(cards).toHaveCount(categoriesWithTemplates().length);
  for (const category of categoriesWithTemplates()) {
    const n = templatesForCategory(category).length;
    await expect(page.locator("#categories ul > li", { hasText: getCategoryConfig(category).label })).toContainText(`${n} ${n === 1 ? "design" : "designs"}`);
  }
});
