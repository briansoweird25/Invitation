import { expect, test, type Page } from "@playwright/test";
import { templateList } from "../../src/components/invitation/templateCatalog";
import { installMockSupabase, login, seedRow, trackErrors } from "./helpers/mockSupabase";

/** Opens a collapsible editor section when it is closed. */
async function open(page: Page, title: string) {
  const header = page.getByRole("button", { name: title, exact: true });
  if ((await header.getAttribute("aria-expanded")) === "false") await header.click();
}

test.describe("the editor reflects each template's capabilities", () => {
  for (const template of templateList) {
    test(template.id, async ({ page, context }) => {
      const errors = trackErrors(page);
      await installMockSupabase(context, { premium: true });
      await login(page);
      await page.goto(`/editor/new?template=${template.id}`);
      await expect(page.locator("#event-hostNames")).toBeVisible();
      await expect(page.locator("[role=img]").first()).toBeVisible();

      const caps = template.capabilities;
      const looks = page.getByRole("button", { name: "Looks", exact: true });
      await expect(looks).toHaveCount(template.presets.length >= 2 ? 1 : 0);
      if (template.presets.length >= 2) {
        await open(page, "Looks");
        for (const preset of template.presets) await expect(page.getByRole("button", { name: preset.name, exact: true })).toBeVisible();
      }

      const hasDecorations = caps.decorations.length + caps.frames.length + caps.patterns.length > 0;
      await expect(page.getByRole("button", { name: "Decorations", exact: true })).toHaveCount(hasDecorations ? 1 : 0);
      if (hasDecorations) {
        await open(page, "Decorations");
        for (const option of caps.decorations) await expect(page.locator(`#deco-${option.id}`)).toBeVisible();
        // The first look turns its decorations on, so each option's switch matches the preset.
        const first = template.presets[0].design.decorations ?? [];
        for (const option of caps.decorations) await expect(page.locator(`#deco-${option.id}`)).toHaveAttribute("aria-checked", String(first.includes(option.id)));
      }
      await expect(page.getByRole("button", { name: "Typography", exact: true })).toBeVisible();
      await expect(page.getByRole("button", { name: "Colors", exact: true })).toBeVisible();
      expect(errors).toEqual([]);
    });
  }
});

test.describe("looks, autosave and reload", () => {
  test("choosing a look and editing text is saved and survives a reload", async ({ page, context }) => {
    const errors = trackErrors(page);
    const mock = await installMockSupabase(context, { premium: true });
    await login(page);
    await page.goto("/editor/new?template=golden-graduation");
    await open(page, "Looks");
    await page.getByRole("button", { name: "Ivory Laurel", exact: true }).click();
    await expect(page.getByRole("button", { name: "Ivory Laurel", exact: true })).toHaveAttribute("aria-pressed", "true");
    await page.fill("#event-hostNames", "Priya Raman");
    await expect(page.locator("header >> text=✓ Saved")).toBeVisible();

    const row = [...mock.db.values()].find((r) => r.template_id === "golden-graduation");
    expect(row?.category).toBe("graduation");
    expect((row?.design as { presetId?: string }).presetId).toBe("ivory-laurel");
    expect((row?.content as { hostNames: string }).hostNames).toBe("Priya Raman");

    await page.reload();
    await expect(page.locator("#event-hostNames")).toHaveValue("Priya Raman");
    await open(page, "Looks");
    await expect(page.getByRole("button", { name: "Ivory Laurel", exact: true })).toHaveAttribute("aria-pressed", "true");
    expect(errors).toEqual([]);
  });

  test("a decoration switch changes the design and is saved", async ({ page, context }) => {
    const mock = await installMockSupabase(context, { premium: true });
    await login(page);
    await page.goto("/editor/new?template=garden-party");
    await open(page, "Decorations");
    await page.locator("#deco-wildflowers").click();
    await page.fill("#event-hostNames", "Patio Party");
    await expect(page.locator("header >> text=✓ Saved")).toBeVisible();
    const row = [...mock.db.values()].find((r) => r.template_id === "garden-party");
    expect((row?.design as { decorations?: string[] }).decorations).not.toContain("wildflowers");
  });
});

test.describe("existing invitations keep working", () => {
  test("an invitation with a legacy border decoration, an unknown category and a later-added template all open", async ({ page, context }) => {
    const errors = trackErrors(page);
    const mock = await installMockSupabase(context, { premium: true });
    mock.db.set("aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1", seedRow("aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1", "Legacy border", "Ava & Noah", { design: { headingFont: "Cormorant Garamond", bodyFont: "Inter", backgroundColor: "#F6F1E8", textColor: "#3A3128", accentColor: "#8A7352", decorations: ["border"] } }));
    mock.db.set("aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2", seedRow("aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2", "Odd category", "Sam", { category: "space-party" }));
    mock.db.set("aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3", seedRow("aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3", "Grad night", "Jordan Lee", { template_id: "chalkboard-graduation", category: "graduation" }));
    await login(page);
    await page.goto("/dashboard");
    await expect(page.locator("article h2")).toHaveCount(3);
    await expect(page.locator("article .aspect-\\[4\\/5\\]")).toHaveCount(3);

    for (const [id, host] of [["aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1", "Ava & Noah"], ["aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2", "Sam"], ["aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3", "Jordan Lee"]]) {
      await page.goto(`/editor/${id}`);
      await expect(page.locator("#event-hostNames")).toHaveValue(host);
      await expect(page.locator("[role=img]").first()).toBeVisible();
    }
    expect(errors).toEqual([]);
  });
});

test.describe("mobile", () => {
  test.use({ viewport: { width: 375, height: 800 } });

  const overflows = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);

  for (const path of ["/", "/templates", "/templates/corporate-event", "/templates/graduation?access=premium", "/pricing"]) {
    test(`${path} does not scroll sideways`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      expect(await overflows(page)).toBe(false);
    });
  }

  test("dashboard and editor fit the screen", async ({ page, context }) => {
    const errors = trackErrors(page);
    const mock = await installMockSupabase(context, { premium: true });
    mock.db.set("bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1", seedRow("bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1", "Gala", "Northwind Co.", { template_id: "gala-corporate", category: "corporate-event" }));
    await login(page);
    await page.goto("/dashboard");
    await expect(page.locator("article h2")).toHaveText("Gala");
    expect(await overflows(page)).toBe(false);
    await page.goto("/editor/bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1");
    await expect(page.locator("[role=img]").first()).toBeVisible();
    expect(await overflows(page)).toBe(false);
    expect(errors).toEqual([]);
  });
});
