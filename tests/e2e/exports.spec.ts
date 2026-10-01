import { expect, test, type BrowserContext, type Page } from "@playwright/test";
import { templateList } from "../../src/components/invitation/templateCatalog";
import { sampleContentFor } from "../../src/components/invitation/templateCatalog";
import { stressContent } from "../../src/lib/testContent";
import { diffAgainstScreen, distinctColors, exportFromEditor, pixelAt, pngSize, solidPng } from "./helpers/exports";
import { installMockSupabase, login, seedRow, trackErrors } from "./helpers/mockSupabase";

const ID = "ffffffff-ffff-4fff-8fff-ffffffffffff";
const byId = (id: string) => templateList.find((t) => t.id === id)!;

/** A saved, published invitation for a template and Look, so one row serves both the public page and the editor. */
function row(templateId: string, presetIndex = 0, extra: Record<string, unknown> = {}) {
  const t = byId(templateId);
  return seedRow(ID, "Ava & Noah's Wedding", "Ava & Noah", {
    status: "published",
    slug: "ava-and-noah",
    template_id: t.id,
    category: t.category,
    content: sampleContentFor(t),
    design: { ...t.presets[presetIndex].design, presetId: t.presets[presetIndex].id },
    ...extra,
  });
}

const openEditor = async (page: Page) => {
  await page.goto(`/editor/${ID}`);
  // On a phone the fields are in a drawer, so wait for the preview instead.
  await expect(page.getByRole("img", { name: "Invitation preview" })).toBeVisible();
  await expect(page.locator("header >> text=✓ Saved")).toBeVisible();
};

test.describe("PNG and PDF from the editor", () => {
  test("a PNG is high resolution and named after the invitation", async ({ page, context }) => {
    const errors = trackErrors(page);
    const mock = await installMockSupabase(context);
    mock.db.set(ID, row("elegant-wedding"));
    await login(page);
    await openEditor(page);
    const png = await exportFromEditor(page, "png");
    expect(png.filename).toBe("ava-and-noah-s-wedding.png");
    expect(pngSize(png.buffer)).toEqual({ width: 2400, height: 3000 });
    expect(await distinctColors(page, png.buffer)).toBeGreaterThan(20);
    await expect(page.getByText("PNG ready")).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("a PDF is one 8 x 10 inch page holding a 2400 x 3000 picture", async ({ page, context }) => {
    const mock = await installMockSupabase(context);
    mock.db.set(ID, row("gala-corporate"));
    await login(page);
    await openEditor(page);
    const pdf = await exportFromEditor(page, "pdf");
    expect(pdf.filename).toBe("ava-and-noah-s-wedding.pdf");
    const text = pdf.buffer.toString("latin1");
    expect(text.startsWith("%PDF-1.4")).toBe(true);
    expect(text.trimEnd().endsWith("%%EOF")).toBe(true);
    expect(text).toContain("/MediaBox [0 0 576 720]");
    expect(text).toContain("/Width 2400 /Height 3000");
    expect(text).toContain("/Title (Ava & Noah's Wedding)");
    expect(pdf.buffer.length).toBeGreaterThan(10_000);
  });

  test("a new unsaved invitation exports what is on screen, and the name follows the title field", async ({ page, context }) => {
    await installMockSupabase(context);
    await login(page);
    await page.goto("/editor/new?template=varsity-graduation");
    await page.fill("#invitation-title", "Jordan's Graduation");
    await page.fill("#event-hostNames", "Jordan Lee");
    const png = await exportFromEditor(page, "png");
    expect(png.filename).toBe("jordan-s-graduation.png");
    expect(pngSize(png.buffer).width).toBe(2400);
  });

  test("a Look chosen in the editor is what gets exported", async ({ page, context }) => {
    await installMockSupabase(context, { premium: true });
    await login(page);
    await page.goto("/editor/new?template=golden-graduation");
    const looks = page.getByRole("button", { name: "Looks", exact: true });
    if ((await looks.getAttribute("aria-expanded")) === "false") await looks.click();
    await page.getByRole("button", { name: "Ivory Laurel", exact: true }).click();
    const png = await exportFromEditor(page, "png");
    // The Look's background is ivory (#F6F1E8); the Navy Foil default would be dark blue.
    const [r, g, b] = await pixelAt(page, png.buffer, 12, 1500);
    expect(r).toBeGreaterThan(200);
    expect(g).toBeGreaterThan(200);
    expect(b).toBeGreaterThan(190);
  });

  test("exporting does not change the saved invitation", async ({ page, context }) => {
    const mock = await installMockSupabase(context);
    await context.route("https://img.test/**", (r) => r.fulfill({ status: 200, contentType: "image/png", body: solidPng(4, 4, [200, 30, 30]), headers: { "access-control-allow-origin": "*" } }));
    mock.db.set(ID, row("elegant-wedding", 0, { design: { ...byId("elegant-wedding").presets[0].design, backgroundImage: "https://img.test/bg.png" } }));
    const before = JSON.stringify(mock.db.get(ID));
    await login(page);
    await openEditor(page);
    await exportFromEditor(page, "png");
    expect(JSON.stringify(mock.db.get(ID))).toBe(before);
    expect(mock.db.get(ID)!.design.backgroundImage).toBe("https://img.test/bg.png");
  });
});

test.describe("images", () => {
  test("a linked background image is part of the exported picture", async ({ page, context }) => {
    const mock = await installMockSupabase(context);
    await context.route("https://img.test/**", (r) => r.fulfill({ status: 200, contentType: "image/png", body: solidPng(8, 8, [200, 30, 30]), headers: { "access-control-allow-origin": "*" } }));
    mock.db.set(ID, row("elegant-wedding", 0, { design: { ...byId("elegant-wedding").presets[0].design, backgroundImage: "https://img.test/bg.png" } }));
    await login(page);
    await openEditor(page);
    const png = await exportFromEditor(page, "png");
    const [r, g, b] = await pixelAt(page, png.buffer, 20, 20);
    expect(r).toBeGreaterThan(180);
    expect(g).toBeLessThan(80);
    expect(b).toBeLessThan(80);
  });

  test("shows a preparing state while a slow image loads", async ({ page, context }) => {
    const mock = await installMockSupabase(context);
    await context.route("https://img.test/**", async (r) => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await r.fulfill({ status: 200, contentType: "image/png", body: solidPng(4, 4, [30, 30, 200]), headers: { "access-control-allow-origin": "*" } });
    });
    mock.db.set(ID, row("elegant-wedding", 0, { design: { ...byId("elegant-wedding").presets[0].design, backgroundImage: "https://img.test/slow.png" } }));
    await login(page);
    await openEditor(page);
    await page.getByRole("button", { name: "Export" }).click();
    const downloading = page.waitForEvent("download", { timeout: 60_000 });
    await page.getByRole("menuitem", { name: "Download PNG image" }).click();
    const busy = page.getByRole("button", { name: "Preparing PNG" });
    await expect(busy).toBeVisible();
    await expect(busy).toBeDisabled();
    await downloading;
    await expect(page.getByRole("button", { name: "Export" })).toBeEnabled();
  });

  test("an image the browser may not read stops the export with a clear message and nothing downloads", async ({ page, context }) => {
    const mock = await installMockSupabase(context);
    // Allowed for a different site only: the page can display this image but may not read it.
    await context.route("https://img.test/**", (r) => r.fulfill({ status: 200, contentType: "image/png", body: solidPng(4, 4, [200, 30, 30]), headers: { "access-control-allow-origin": "https://some-other-site.example" } }));
    mock.db.set(ID, row("elegant-wedding", 0, { design: { ...byId("elegant-wedding").presets[0].design, backgroundImage: "https://img.test/nocors.png" } }));
    await login(page);
    await openEditor(page);
    let downloaded = false;
    page.on("download", () => (downloaded = true));
    await page.getByRole("button", { name: "Export" }).click();
    await page.getByRole("menuitem", { name: "Download PNG image" }).click();
    await expect(page.getByText(/couldn't load your background image/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Export" })).toBeEnabled();
    expect(downloaded).toBe(false);
  });

  test("a missing image (404) is reported the same way", async ({ page, context }) => {
    const mock = await installMockSupabase(context);
    await context.route("https://img.test/**", (r) => r.fulfill({ status: 404, headers: { "access-control-allow-origin": "*" } }));
    mock.db.set(ID, row("elegant-wedding", 0, { design: { ...byId("elegant-wedding").presets[0].design, backgroundImage: "https://img.test/gone.png" } }));
    await login(page);
    await openEditor(page);
    await page.getByRole("button", { name: "Export" }).click();
    await page.getByRole("menuitem", { name: "Download PDF" }).click();
    await expect(page.getByText(/couldn't load your background image/)).toBeVisible();
  });
});

/**
 * The export must look like the screen. For each case the same saved invitation is drawn by the public page and
 * exported from the editor; the two are compared pixel by pixel after scaling to the same size.
 */
async function expectMatchesScreen(page: Page, context: BrowserContext, mockRow: ReturnType<typeof row>, label: string, tolerance = 0.05) {
  const mock = await installMockSupabase(context);
  mock.db.set(ID, mockRow);
  await page.setViewportSize({ width: 1280, height: 1000 });
  await page.goto("/invitation/ava-and-noah");
  const card = page.getByTestId("public-invitation");
  await expect(card).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(800);
  const screen = await card.screenshot();
  await login(page);
  await openEditor(page);
  const png = await exportFromEditor(page, "png");
  expect(pngSize(png.buffer)).toEqual({ width: 2400, height: 3000 });
  const diff = await diffAgainstScreen(page, png.buffer, screen);
  expect(diff.differing, `${label}: ${(diff.differing * 100).toFixed(2)}% of pixels differ clearly`).toBeLessThan(tolerance);
  expect(diff.mean, `${label}: mean difference ${diff.mean.toFixed(2)}`).toBeLessThan(tolerance * 160);
}

test.describe("the export matches the screen", () => {
  const cases: [string, number][] = [
    ["elegant-wedding", 0],
    ["floral-wedding", 1],
    ["luxury-wedding", 2],
    ["confetti-birthday", 1],
    ["botanical-baby-shower", 0],
    ["golden-graduation", 1],
    ["ticket-party", 2],
    ["garden-party", 1],
    ["deco-party", 0],
    ["peony-bridal-shower", 2],
    ["ring-engagement", 1],
    ["gilded-anniversary", 1],
    ["radiant-communion", 2],
    ["water-baptism", 0],
    ["sunset-retirement", 2],
    ["supper-dinner-party", 0],
    ["summit-corporate", 1],
    ["gala-corporate", 2],
  ];
  for (const [id, preset] of cases) {
    test(`${id} (${byId(id).presets[preset].name})`, async ({ page, context }) => {
      await expectMatchesScreen(page, context, row(id, preset), `${id}/${byId(id).presets[preset].id}`);
    });
  }

  // Long text can break a line differently at 1200 px than at 520 px (font metrics are not perfectly scale-free),
  // so these allow more difference. The layout, colors and decoration must still match.
  for (const id of ["elegant-wedding", "ticket-party", "gala-corporate", "plate-dinner-party", "varsity-graduation", "supper-dinner-party"]) {
    test(`${id} with very long content`, async ({ page, context }) => {
      await expectMatchesScreen(page, context, row(id, 0, { content: stressContent("long") }), `${id} long`, 0.1);
    });
  }

  test("an invitation saved before frames existed still gets its frame", async ({ page, context }) => {
    const base = { headingFont: "Cormorant Garamond", bodyFont: "Inter", backgroundColor: "#F6F1E8", textColor: "#3A3128", accentColor: "#8A7352", decorations: ["border"] };
    await expectMatchesScreen(page, context, row("elegant-wedding", 0, { design: base }), "legacy border");
  });
});

test.describe("every template exports", () => {
  for (const t of templateList) {
    test(t.id, async ({ page, context }) => {
      const errors = trackErrors(page);
      const mock = await installMockSupabase(context);
      mock.db.set(ID, row(t.id, t.presets.length - 1));
      await login(page);
      await openEditor(page);
      const png = await exportFromEditor(page, "png");
      expect(pngSize(png.buffer)).toEqual({ width: 2400, height: 3000 });
      expect(await distinctColors(page, png.buffer)).toBeGreaterThan(15);
      expect(png.buffer.length).toBeGreaterThan(30_000);
      expect(errors).toEqual([]);
    });
  }
});

test.describe("from the dashboard", () => {
  test("exports a saved invitation without opening it", async ({ page, context }) => {
    const mock = await installMockSupabase(context);
    mock.db.set(ID, row("sunset-retirement"));
    await login(page);
    await page.goto("/dashboard");
    await page.getByRole("button", { name: /More actions/ }).click();
    const [download] = await Promise.all([page.waitForEvent("download", { timeout: 60_000 }), page.getByRole("menuitem", { name: "Download PNG" }).click()]);
    expect(download.suggestedFilename()).toBe("ava-and-noah-s-wedding.png");
    await expect(page.getByText("PNG ready")).toBeVisible();

    await page.getByRole("button", { name: /More actions/ }).click();
    const [pdf] = await Promise.all([page.waitForEvent("download", { timeout: 60_000 }), page.getByRole("menuitem", { name: "Download PDF" }).click()]);
    expect(pdf.suggestedFilename()).toBe("ava-and-noah-s-wedding.pdf");
  });

  test("a draft can be exported by its owner", async ({ page, context }) => {
    const mock = await installMockSupabase(context);
    mock.db.set(ID, row("ring-engagement", 0, { status: "draft", slug: null }));
    await login(page);
    await page.goto("/dashboard");
    await page.getByRole("button", { name: /More actions/ }).click();
    const [download] = await Promise.all([page.waitForEvent("download", { timeout: 60_000 }), page.getByRole("menuitem", { name: "Download PNG" }).click()]);
    const { readFile } = await import("node:fs/promises");
    expect(pngSize(await readFile(await download.path())).width).toBe(2400);
    expect(download.suggestedFilename()).toBe("ava-and-noah-s-wedding.png");
  });

  test("an invitation whose template is gone explains why it cannot be exported", async ({ page, context }) => {
    const mock = await installMockSupabase(context);
    mock.db.set(ID, row("elegant-wedding", 0, { template_id: "template-that-was-removed" }));
    await login(page);
    await page.goto("/dashboard");
    await page.getByRole("button", { name: /More actions/ }).click();
    await page.getByRole("menuitem", { name: "Download PNG" }).click();
    await expect(page.getByText(/template that is no longer available/)).toBeVisible();
  });
});

test.describe("who can export", () => {
  test("a signed-out visitor cannot reach the editor or the dashboard, and the public page has no export", async ({ page, context }) => {
    const mock = await installMockSupabase(context);
    mock.db.set(ID, row("elegant-wedding"));
    await page.goto(`/editor/${ID}`);
    await expect(page).toHaveURL(/\/login/);
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
    await page.goto("/invitation/ava-and-noah");
    await expect(page.getByTestId("public-invitation")).toBeVisible();
    await expect(page.getByRole("button", { name: /export|download/i })).toHaveCount(0);
  });
});

test.describe("mobile", () => {
  test.use({ viewport: { width: 375, height: 760 } });

  test("the editor's Export button fits the header and produces the same file", async ({ page, context }) => {
    const errors = trackErrors(page);
    const mock = await installMockSupabase(context);
    mock.db.set(ID, row("garden-party", 1));
    await login(page);
    await openEditor(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
    const button = page.getByRole("button", { name: "Export" });
    const box = await button.boundingBox();
    expect(box!.x + box!.width).toBeLessThanOrEqual(375);
    expect(box!.width).toBeGreaterThanOrEqual(32);
    const png = await exportFromEditor(page, "png");
    expect(pngSize(png.buffer)).toEqual({ width: 2400, height: 3000 });
    const pdf = await exportFromEditor(page, "pdf");
    expect(pdf.buffer.toString("latin1")).toContain("/MediaBox [0 0 576 720]");
    expect(errors).toEqual([]);
  });

  test("the dashboard export works on a phone", async ({ page, context }) => {
    const mock = await installMockSupabase(context);
    mock.db.set(ID, row("bubbly-bridal-shower"));
    await login(page);
    await page.goto("/dashboard");
    await page.getByRole("button", { name: /More actions/ }).click();
    const [download] = await Promise.all([page.waitForEvent("download", { timeout: 60_000 }), page.getByRole("menuitem", { name: "Download PNG" }).click()]);
    expect(download.suggestedFilename()).toBe("ava-and-noah-s-wedding.png");
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
  });
});
