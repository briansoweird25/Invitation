import { expect, test } from "@playwright/test";
import { templateList } from "../../src/components/invitation/templateCatalog";
import { installMockSupabase, login, seedRow, trackErrors } from "./helpers/mockSupabase";

const ID = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";
const published = (extra: Record<string, unknown> = {}) => seedRow(ID, "Ava and Noah", "Ava & Noah", { status: "published", slug: "ava-and-noah", ...extra });

test("a guest who is not signed in sees a published invitation", async ({ page, context }) => {
  const errors = trackErrors(page);
  const mock = await installMockSupabase(context);
  mock.db.set(ID, published());
  await page.goto("/invitation/ava-and-noah");
  const card = page.getByTestId("public-invitation");
  await expect(card).toBeVisible();
  await expect(card).toContainText("Noah");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Ava and Noah");
  await expect(page).toHaveTitle("Ava and Noah");
  await expect(page.locator('meta[name=robots]')).toHaveAttribute("content", /noindex/);
  // No site navigation, no editor controls.
  await expect(page.getByRole("link", { name: "Edit" })).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("a draft, an unknown slug and a malformed slug all look the same: not available", async ({ page, context }) => {
  const mock = await installMockSupabase(context);
  mock.db.set(ID, published({ status: "draft" }));
  for (const slug of ["ava-and-noah", "nobody-here", "Bad_Slug!"]) {
    await page.goto(`/invitation/${slug}`);
    await expect(page.getByRole("heading", { name: "This invitation isn't available" })).toBeVisible();
    await expect(page.getByTestId("public-invitation")).toHaveCount(0);
  }
});

test("a failed load shows a friendly message and can be retried", async ({ page, context }) => {
  const mock = await installMockSupabase(context);
  mock.db.set(ID, published());
  mock.failNext.list = true;
  await page.goto("/invitation/ava-and-noah");
  await expect(page.getByRole("heading", { name: "We couldn't load this invitation" })).toBeVisible();
  await expect(page.locator("body")).not.toContainText("boom");
  mock.failNext.list = false;
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(page.getByTestId("public-invitation")).toBeVisible();
});

test("the RSVP details show only when RSVP is enabled", async ({ page, context }) => {
  const mock = await installMockSupabase(context);
  mock.db.set(ID, published({ rsvp_settings: { enabled: true, deadline: "2026-05-01", contactName: "Ava", contactEmail: "ava@example.com" } }));
  await page.goto("/invitation/ava-and-noah");
  await expect(page.getByRole("heading", { name: "RSVP" })).toBeVisible();
  await expect(page.getByText("Please reply by May 1, 2026.")).toBeVisible();
  await expect(page.getByRole("link", { name: /ava@example.com/ })).toHaveAttribute("href", "mailto:ava@example.com");

  mock.db.get(ID)!.rsvp_settings = { enabled: false, contactEmail: "ava@example.com" };
  await page.reload();
  await expect(page.getByTestId("public-invitation")).toBeVisible();
  await expect(page.getByRole("heading", { name: "RSVP" })).toHaveCount(0);
});

test("copy link copies the public URL", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  const mock = await installMockSupabase(context);
  mock.db.set(ID, published());
  await page.goto("/invitation/ava-and-noah");
  await page.getByRole("button", { name: "Copy link" }).click();
  await expect(page.getByRole("button", { name: "Copied" })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(new URL("/invitation/ava-and-noah", page.url()).toString());
});

test("publishing from the dashboard gives a working public link, and unpublishing takes it down", async ({ page, context, browser }) => {
  const mock = await installMockSupabase(context);
  mock.db.set(ID, seedRow(ID, "Our wedding", "Ava & Noah"));
  await login(page);
  await page.goto("/dashboard");
  await page.getByRole("button", { name: /More actions/ }).click();
  await page.getByRole("menuitem", { name: "Publish" }).click();
  await expect(page.getByRole("link", { name: "View" })).toBeVisible();

  // A second, signed-out visitor.
  const guestContext = await browser.newContext();
  await guestContext.route("**/*", (r) => r.fallback());
  const guestMock = await installMockSupabase(guestContext);
  guestMock.db.set(ID, mock.db.get(ID)!);
  const guest = await guestContext.newPage();
  await guest.goto(`/invitation/${mock.db.get(ID)!.slug}`);
  await expect(guest.getByTestId("public-invitation")).toContainText("Noah");

  await page.getByRole("button", { name: /More actions/ }).click();
  await page.getByRole("menuitem", { name: "Unpublish" }).click();
  await expect(page.getByRole("link", { name: "View" })).toHaveCount(0);
  guestMock.db.set(ID, mock.db.get(ID)!);
  await guest.reload();
  await expect(guest.getByRole("heading", { name: "This invitation isn't available" })).toBeVisible();
  await guestContext.close();
});

test.describe("every template renders on the public page", () => {
  for (const t of templateList) {
    test(t.id, async ({ page, context }) => {
      const errors = trackErrors(page);
      const mock = await installMockSupabase(context);
      mock.db.set(ID, published({ template_id: t.id, category: t.category, design: { ...t.presets[0].design } }));
      await page.goto("/invitation/ava-and-noah");
      // Some templates set the two names on separate lines, so check for the second name.
      await expect(page.getByTestId("public-invitation")).toContainText("Noah");
      expect(errors).toEqual([]);
    });
  }
});

test.describe("mobile", () => {
  test.use({ viewport: { width: 375, height: 700 } });
  test("the invitation fits the screen and does not scroll sideways", async ({ page, context }) => {
    const mock = await installMockSupabase(context);
    mock.db.set(ID, published({ template_id: "gala-corporate", category: "corporate-event", design: { ...templateList.find((t) => t.id === "gala-corporate")!.presets[0].design } }));
    await page.goto("/invitation/ava-and-noah");
    const box = await page.getByTestId("public-invitation").boundingBox();
    expect(box!.width).toBeLessThanOrEqual(375);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
  });
});
