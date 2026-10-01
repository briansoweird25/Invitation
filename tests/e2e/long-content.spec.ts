import { expect, test, type Page } from "@playwright/test";
import { templateList } from "@/components/invitation/templateCatalog";
import { stressContent, type StressKind } from "@/lib/testContent";
import { installMockSupabase, login, trackErrors } from "./helpers/mockSupabase";
import { measurePreview } from "./helpers/preview";

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 375, height: 800 },
] as const;

const FONT_SETS = [
  { name: "template fonts", fonts: null },
  { name: "wide capitals (Cinzel)", fonts: { heading: "Cinzel", body: "Montserrat" } },
  { name: "script (Great Vibes)", fonts: { heading: "Great Vibes", body: "Amatic SC" } },
  { name: "heavy display (Abril Fatface)", fonts: { heading: "Abril Fatface", body: "Nunito" } },
] as const;

async function fill(page: Page, kind: StressKind) {
  const c = stressContent(kind);
  await page.fill("#event-hostNames", c.hostNames);
  await page.fill("#event-eventTitle", c.eventTitle);
  await page.fill("#event-venue", c.venue);
  await page.fill("#event-address", c.address);
  await page.fill("#event-additionalDetails", c.additionalDetails ?? "");
  await page.fill("#message-text", c.message);
}

async function setFonts(page: Page, fonts: { heading: string; body: string }) {
  const toggle = page.getByRole("button", { name: "Choose fonts yourself" });
  if ((await toggle.getAttribute("aria-expanded")) !== "true") await toggle.click();
  await page.selectOption("#type-heading", fonts.heading);
  await page.selectOption("#type-body", fonts.body);
}

async function settle(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(350);
}

for (const template of templateList) {
  test(`${template.id}: long, unbroken and missing content stays inside the frame`, async ({ page, context }) => {
    const errors = trackErrors(page);
    await installMockSupabase(context);
    await login(page);
    await page.goto(`/editor/new?template=${template.id}`);
    await page.waitForSelector("#event-hostNames");
    await page.click('button[aria-controls="panel-message"]');
    await page.click('button[aria-controls="panel-typography"]');

    const scenarios: { name: string; kind: StressKind; fonts: (typeof FONT_SETS)[number]["fonts"] }[] = [
      ...FONT_SETS.map((f) => ({ name: `long content, ${f.name}`, kind: "long" as const, fonts: f.fonts })),
      { name: "unbroken words", kind: "unbroken", fonts: null },
      { name: "missing optional content", kind: "empty", fonts: null },
    ];

    for (const scenario of scenarios) {
      await page.setViewportSize({ width: 1440, height: 900 });
      await fill(page, scenario.kind);
      if (scenario.fonts) await setFonts(page, scenario.fonts);
      for (const viewport of VIEWPORTS) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await settle(page);
        const report = await measurePreview(page);
        const label = `${template.id} / ${scenario.name} / ${viewport.name} (${report.cardWidth}px card)`;
        expect(report.measured, `${label}: nothing was measured`).toBeGreaterThan(0);
        expect(report.overflowing, `${label}: text reaches the frame margin`).toEqual([]);
        expect(report.horizontalPageOverflow, `${label}: page scrolls sideways`).toBe(false);
        // Content may shrink to fit, but not to the point of being unreadable.
        if (scenario.kind === "long") expect(report.smallestScale, `${label}: shrunk too far`).toBeGreaterThanOrEqual(0.4);
      }
    }
    expect(errors).toEqual([]);
  });
}
