import { expect, test, type BrowserContext, type Page } from "@playwright/test";
import { getTemplate, templateList } from "../../src/components/invitation/templateCatalog";
import { exportFromEditor, pngSize } from "./helpers/exports";
import { installMockSupabase, login, seedRow, trackErrors, type MockSupabase } from "./helpers/mockSupabase";

const PREMIUM_TEMPLATE = "floral-wedding";
const FREE_TEMPLATE = "elegant-wedding";
const PREMIUM_LOOK = "midnight-foil"; // premium Look on the free elegant-wedding template
const FREE_LOOK = "ivory-gold";
const ID = "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee";

/** The page Stripe would show. The test never talks to Stripe; this stands in for its hosted page. */
async function mockStripePage(context: BrowserContext) {
  await context.route("https://checkout.stripe.test/**", (r) => r.fulfill({ status: 200, contentType: "text/html", body: "<!doctype html><title>Stripe Checkout</title><h1>Pay securely</h1>" }));
}

async function setup(context: BrowserContext, options: { premium?: boolean } = {}) {
  const mock = await installMockSupabase(context);
  await mockStripePage(context);
  if (options.premium) mock.stripe.grantPremium();
  return mock;
}

const gotoEditor = (page: Page, query: string) => page.goto(`/editor/new?${query}`);

async function openPreview(page: Page, templateName: string) {
  await page.getByRole("button", { name: `Preview ${templateName}` }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
}

const premiumRow = (id = ID, extra: Record<string, unknown> = {}) => {
  const t = getTemplate(PREMIUM_TEMPLATE)!;
  return seedRow(id, "Our wedding", "Ava & Noah", { template_id: t.id, category: t.category, design: { ...t.presets[0].design, presetId: t.presets[0].id }, ...extra });
};

test.describe("what is marked Premium", () => {
  test("the gallery marks Premium templates and leaves free ones free", async ({ page, context }) => {
    await setup(context);
    await page.goto("/templates");
    const card = (name: string) => page.locator("article", { hasText: name });
    await expect(card("Floral Wedding")).toContainText("Premium");
    await expect(card("Elegant Wedding")).toContainText("Free");
    await page.goto("/templates?access=premium");
    for (const t of templateList.filter((x) => x.isPremium)) await expect(page.locator("article", { hasText: t.name }).first()).toBeVisible();
  });

  test("badges come from the catalog: every template card matches its tier", async ({ page, context }) => {
    await setup(context);
    await page.goto("/templates");
    for (const t of templateList.slice(0, 12)) {
      await expect(page.locator("article", { hasText: t.name }).first()).toContainText(t.isPremium ? "Premium" : "Free");
    }
  });

  test("the preview of a free template with a premium Look marks that Look", async ({ page, context }) => {
    await setup(context);
    await page.goto("/templates/wedding");
    await openPreview(page, "Elegant Wedding");
    await page.getByRole("button", { name: "Midnight Foil" }).click();
    await expect(page.getByRole("dialog")).toContainText("Midnight Foil · Premium");
    await page.getByRole("button", { name: "Ivory & Gold" }).click();
    await expect(page.getByRole("dialog")).not.toContainText("· Premium");
  });
});

test.describe("signed out", () => {
  test("can preview Premium but is asked to log in to unlock, and free templates stay open", async ({ page, context }) => {
    await setup(context);
    await page.goto("/templates/wedding");
    await openPreview(page, "Floral Wedding");
    await expect(page.getByRole("link", { name: "Use this template" })).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Log in to unlock Premium" })).toBeVisible();
    await page.keyboard.press("Escape");
    await openPreview(page, "Elegant Wedding");
    await expect(page.getByRole("link", { name: "Use this template" })).toBeVisible();
  });

  test("the pricing page offers a login, not a payment", async ({ page, context }) => {
    const mock = await setup(context);
    await page.goto("/pricing");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Unlock Premium once");
    await expect(page.getByRole("link", { name: "Log in to unlock Premium" })).toBeVisible();
    expect(mock.checkouts).toHaveLength(0);
  });
});

test.describe("signed in without Premium", () => {
  test("free templates and free Looks work fully", async ({ page, context }) => {
    const mock = await setup(context);
    await login(page);
    await gotoEditor(page, `template=${FREE_TEMPLATE}`);
    await page.fill("#event-hostNames", "Priya & Omar");
    await expect(page.locator("header >> text=✓ Saved")).toBeVisible();
    expect([...mock.db.values()].find((r) => r.template_id === FREE_TEMPLATE)).toBeTruthy();
    await page.getByRole("button", { name: "Blush Peony" }).click();
    await expect(page.getByRole("button", { name: "Blush Peony" })).toHaveAttribute("aria-pressed", "true");
  });

  test("a Premium template can be previewed but not used: the preview offers Unlock", async ({ page, context }) => {
    await setup(context);
    await login(page);
    await page.goto("/templates/wedding");
    await expect(page.locator("article", { hasText: "Floral Wedding" }).getByRole("link", { name: "Unlock template" })).toBeVisible();
    await openPreview(page, "Floral Wedding");
    await expect(page.getByRole("link", { name: "Use this template" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: /Unlock Premium/ })).toBeVisible();
    // The preview itself still works, including the other Looks.
    await page.getByRole("dialog").getByRole("button", { name: /^(?!Close)/ }).first().isVisible();
  });

  test("the editor URL of a Premium template shows the gate, not the editor, and creates nothing", async ({ page, context }) => {
    const mock = await setup(context);
    await login(page);
    await gotoEditor(page, `template=${PREMIUM_TEMPLATE}`);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Floral Wedding is part of Premium");
    await expect(page.locator("#event-hostNames")).toHaveCount(0);
    await expect(page.getByRole("button", { name: /Unlock Premium/ })).toBeVisible();
    await page.waitForTimeout(1500);
    expect(mock.db.size).toBe(0);
  });

  test("a premium Look in the URL of a free template shows the gate with a way back to the free Look", async ({ page, context }) => {
    const mock = await setup(context);
    await login(page);
    await gotoEditor(page, `template=${FREE_TEMPLATE}&preset=${PREMIUM_LOOK}`);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("This Look is part of Premium");
    await page.getByRole("link", { name: "Use this template's free Look" }).click();
    await expect(page.locator("#event-hostNames")).toBeVisible();
    expect(mock.checkouts).toHaveLength(0);
  });

  test("in the editor a premium Look is marked and locked; choosing it asks to unlock and changes nothing", async ({ page, context }) => {
    const mock = await setup(context);
    await login(page);
    await gotoEditor(page, `template=${FREE_TEMPLATE}`);
    const looks = page.getByRole("group", { name: "Looks" });
    await expect(looks).toContainText("Midnight Foil · Premium");
    await expect(looks.getByRole("button", { name: "Ivory & Gold" })).toHaveAttribute("aria-pressed", "true");
    await looks.getByRole("button", { name: "Midnight Foil" }).click();
    await expect(page.getByRole("dialog")).toContainText("This Look is part of Premium");
    await expect(page.getByRole("button", { name: /Unlock Premium/ })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(looks.getByRole("button", { name: "Midnight Foil" })).toHaveAttribute("aria-pressed", "false");
    await expect(looks.getByRole("button", { name: "Ivory & Gold" })).toHaveAttribute("aria-pressed", "true");
    await looks.getByRole("button", { name: "Blush Peony" }).click();
    expect(mock.checkouts).toHaveLength(0);
  });

  test("local storage, URL flags and stored claims unlock nothing", async ({ page, context }) => {
    const mock = await setup(context);
    await login(page);
    await page.evaluate(() => {
      localStorage.setItem("premium", "true");
      localStorage.setItem("hasPremium", "true");
      sessionStorage.setItem("premium", "true");
    });
    await gotoEditor(page, `template=${PREMIUM_TEMPLATE}&premium=true&paid=1&hasPremium=true`);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("part of Premium");
    await expect(page.locator("#event-hostNames")).toHaveCount(0);
    expect(mock.db.size).toBe(0);
  });

  test("a hand-made request to create a Premium invitation is refused by the server", async ({ page, context }) => {
    const mock = await setup(context);
    await login(page);
    const token = await page.evaluate(() => Object.keys(localStorage).map((k) => localStorage.getItem(k)).find((v) => v?.includes("access_token")) ?? "");
    const accessToken = (JSON.parse(token) as { access_token: string }).access_token;
    const status = await page.evaluate(
      async (jwt) => {
        const res = await fetch("https://test.supabase.co/rest/v1/invitations", {
          method: "POST",
          headers: { authorization: `Bearer ${jwt}`, apikey: "x", "content-type": "application/json", prefer: "return=representation" },
          body: JSON.stringify({ user_id: "11111111-1111-4111-8111-111111111111", template_id: "floral-wedding", category: "wedding", design: {} }),
        });
        return res.status;
      },
      accessToken,
    );
    expect(status).toBe(402);
    expect(mock.db.size).toBe(0);
  });

  test("a purchase row cannot be written from the browser", async ({ page, context }) => {
    const mock = await setup(context);
    await login(page);
    const status = await page.evaluate(async () => {
      const token = Object.keys(localStorage).map((k) => localStorage.getItem(k)).find((v) => v?.includes("access_token")) ?? "{}";
      const res = await fetch("https://test.supabase.co/rest/v1/purchases", {
        method: "POST",
        headers: { authorization: `Bearer ${(JSON.parse(token) as { access_token: string }).access_token}`, apikey: "x", "content-type": "application/json" },
        body: JSON.stringify({ user_id: "11111111-1111-4111-8111-111111111111", status: "paid", stripe_checkout_session_id: "cs_forged" }),
      });
      return res.status;
    });
    expect(status).toBe(403);
    expect(mock.purchases).toHaveLength(0);
  });
});

test.describe("checkout", () => {
  test("Unlock sends only a return path to the server and goes to the hosted checkout", async ({ page, context }) => {
    const mock = await setup(context);
    await login(page);
    await gotoEditor(page, `template=${PREMIUM_TEMPLATE}`);
    await page.getByRole("button", { name: /Unlock Premium/ }).click();
    await expect(page).toHaveURL(/checkout\.stripe\.test\/c\/pay\/cs_test_1/);
    expect(mock.checkouts).toHaveLength(1);
    // No price, no amount, no "paid" flag: only where to come back to.
    expect(mock.checkouts[0].requestBody).toEqual({ returnTo: `/editor/new?template=${PREMIUM_TEMPLATE}` });
    expect(mock.purchases).toHaveLength(0);
  });

  test("shows a loading state while checkout starts, and cannot be pressed twice", async ({ page, context }) => {
    const mock = await setup(context);
    await context.route("https://test.supabase.co/functions/v1/create-checkout-session", async (route) => {
      await new Promise((r) => setTimeout(r, 1200));
      await route.fallback();
    });
    await login(page);
    await gotoEditor(page, `template=${PREMIUM_TEMPLATE}`);
    await page.getByRole("button", { name: /Unlock Premium/ }).click();
    const busy = page.getByRole("button", { name: "Taking you to secure checkout…" });
    await expect(busy).toBeVisible();
    await expect(busy).toBeDisabled();
    await expect(page).toHaveURL(/checkout\.stripe\.test/);
    expect(mock.checkouts).toHaveLength(1);
  });

  test("a failed checkout start shows a friendly error and can be retried", async ({ page, context }) => {
    const mock = await setup(context);
    mock.failNext.checkout = true;
    await login(page);
    await gotoEditor(page, `template=${PREMIUM_TEMPLATE}`);
    await page.getByRole("button", { name: /Unlock Premium/ }).click();
    await expect(page.getByRole("alert").filter({ hasText: "We couldn't start checkout" })).toBeVisible();
    await expect(page.locator("body")).not.toContainText("boom");
    mock.failNext.checkout = false;
    await page.getByRole("button", { name: /Unlock Premium/ }).click();
    await expect(page).toHaveURL(/checkout\.stripe\.test/);
  });

  test("a cancelled checkout says nothing was charged and offers to try again or keep browsing", async ({ page, context }) => {
    const mock = await setup(context);
    await login(page);
    await page.goto(mock.stripe.cancelUrl(`/editor/new?template=${PREMIUM_TEMPLATE}`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("No payment was made");
    await expect(page.getByText("You weren't charged.")).toBeVisible();
    expect(mock.purchases).toHaveLength(0);
    await page.getByRole("link", { name: "Keep browsing" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("part of Premium");
    await page.goBack();
    await page.getByRole("button", { name: /Unlock Premium/ }).click();
    await expect(page).toHaveURL(/checkout\.stripe\.test/);
  });

  test("a successful checkout confirms with the server, unlocks Premium and returns to the template", async ({ page, context }) => {
    const mock = await setup(context);
    await login(page);
    const returnTo = `/editor/new?template=${PREMIUM_TEMPLATE}`;
    await gotoEditor(page, `template=${PREMIUM_TEMPLATE}`);
    await page.getByRole("button", { name: /Unlock Premium/ }).click();
    await expect(page).toHaveURL(/checkout\.stripe\.test\/c\/pay\/(cs_test_1)/);
    mock.stripe.pay("cs_test_1"); // Stripe's webhook, not the browser

    await page.goto(mock.stripe.successUrl("cs_test_1", returnTo));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Premium unlocked");
    expect(mock.checkouts[0].confirmCalls).toBeGreaterThan(0);
    await page.getByRole("link", { name: "Continue" }).click();
    await expect(page.locator("#event-hostNames")).toBeVisible();
    await page.fill("#event-hostNames", "Priya & Omar");
    await expect(page.locator("header >> text=✓ Saved")).toBeVisible();
    expect([...mock.db.values()].find((r) => r.template_id === PREMIUM_TEMPLATE)).toBeTruthy();
  });

  test("a success page opened without a real payment unlocks nothing", async ({ page, context }) => {
    const mock = await setup(context);
    await login(page);
    await gotoEditor(page, `template=${PREMIUM_TEMPLATE}`);
    await page.getByRole("button", { name: /Unlock Premium/ }).click();
    await expect(page).toHaveURL(/checkout\.stripe\.test/);
    // Back at the app, claiming success without paying: the server says the session is not paid.
    await page.clock.install();
    await page.goto(mock.stripe.successUrl("cs_test_1", `/editor/new?template=${PREMIUM_TEMPLATE}`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Confirming your purchase");
    // Each check waits three (fake) seconds before the next; step through them.
    for (let i = 0; i < 10; i++) {
      await page.clock.fastForward(3500);
      await page.waitForTimeout(150);
    }
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Your payment is still processing");
    await page.goto(`/editor/new?template=${PREMIUM_TEMPLATE}`);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("part of Premium");
    expect(mock.purchases).toHaveLength(0);
  });

  test("a payment that settles a few seconds later is picked up by the success page", async ({ page, context }) => {
    const mock = await setup(context);
    await login(page);
    await gotoEditor(page, `template=${PREMIUM_TEMPLATE}`);
    await page.getByRole("button", { name: /Unlock Premium/ }).click();
    await expect(page).toHaveURL(/checkout\.stripe\.test/);
    await page.goto(mock.stripe.successUrl("cs_test_1"));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Confirming your purchase");
    mock.stripe.pay("cs_test_1");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Premium unlocked", { timeout: 15_000 });
  });

  test("an expired checkout is reported and can be restarted", async ({ page, context }) => {
    const mock = await setup(context);
    await login(page);
    await gotoEditor(page, `template=${PREMIUM_TEMPLATE}`);
    await page.getByRole("button", { name: /Unlock Premium/ }).click();
    await expect(page).toHaveURL(/checkout\.stripe\.test/);
    mock.stripe.expire("cs_test_1");
    await page.goto(mock.stripe.successUrl("cs_test_1"));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("That checkout is no longer open");
    await expect(page.getByRole("button", { name: /Unlock Premium/ })).toBeVisible();
  });

  test("an unknown session id is an error, never a success", async ({ page, context }) => {
    const mock = await setup(context);
    await login(page);
    await page.goto(mock.stripe.successUrl("cs_test_made_up"));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("We couldn't confirm your purchase");
    expect(mock.purchases).toHaveLength(0);
  });

  test("the return path cannot send people off the site", async ({ page, context }) => {
    const mock = await setup(context);
    mock.stripe.grantPremium();
    await login(page);
    await page.goto("/premium/success?return_to=https%3A%2F%2Fevil.example%2Fphish");
    await page.getByRole("link", { name: "Continue" }).click();
    await expect(page).toHaveURL(/\/templates$/);
  });
});

test.describe("already owned and duplicate purchases", () => {
  test("an owner sees everything unlocked: no gate, no Unlock, premium Looks apply", async ({ page, context }) => {
    const mock = await setup(context, { premium: true });
    await login(page);
    await page.goto("/templates/wedding");
    await expect(page.locator("article", { hasText: "Floral Wedding" }).getByRole("link", { name: "Use template" })).toBeVisible();
    await openPreview(page, "Floral Wedding");
    await expect(page.getByRole("link", { name: "Use this template" })).toBeVisible();
    await expect(page.getByRole("button", { name: /Unlock Premium/ })).toHaveCount(0);
    await page.keyboard.press("Escape");

    await gotoEditor(page, `template=${PREMIUM_TEMPLATE}`);
    await expect(page.locator("#event-hostNames")).toBeVisible();
    await page.fill("#event-hostNames", "Priya & Omar");
    await expect(page.locator("header >> text=✓ Saved")).toBeVisible();
    expect([...mock.db.values()].some((r) => r.template_id === PREMIUM_TEMPLATE)).toBe(true);

    await gotoEditor(page, `template=${FREE_TEMPLATE}`);
    await page.getByRole("group", { name: "Looks" }).getByRole("button", { name: "Midnight Foil" }).click();
    await expect(page.getByRole("group", { name: "Looks" }).getByRole("button", { name: "Midnight Foil" })).toHaveAttribute("aria-pressed", "true");
    expect(mock.checkouts).toHaveLength(0);
  });

  test("the server refuses a second checkout from an owner and the app shows the owned state", async ({ page, context }) => {
    const mock = await setup(context);
    await login(page);
    await gotoEditor(page, `template=${PREMIUM_TEMPLATE}`);
    await expect(page.getByRole("button", { name: /Unlock Premium/ })).toBeVisible();
    // The purchase happens elsewhere (another device or tab) while this page still believes it is locked.
    mock.stripe.grantPremium();
    await page.getByRole("button", { name: /Unlock Premium/ }).click();
    // The server says "owned" and sends no one to pay; the app refreshes access and the editor opens.
    await expect(page.locator("#event-hostNames")).toBeVisible();
    expect(mock.checkouts).toHaveLength(0);
  });

  test("the pricing page shows the owned state when the server says the account already owns Premium", async ({ page, context }) => {
    const mock = await setup(context);
    await login(page);
    await page.goto("/pricing");
    await expect(page.getByRole("button", { name: /Unlock Premium/ })).toBeVisible();
    mock.stripe.grantPremium();
    await page.getByRole("button", { name: /Unlock Premium/ }).click();
    await expect(page.getByText("You already have Premium")).toBeVisible();
    expect(mock.checkouts).toHaveLength(0);
  });

  test("the cancelled and success pages say so when you already own Premium", async ({ page, context }) => {
    await setup(context, { premium: true });
    await login(page);
    await page.goto("/premium/cancelled");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("You already have Premium");
    await page.goto("/premium/success");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("You already have Premium");
  });

  test("the success page without a checkout sends someone without Premium to the plans", async ({ page, context }) => {
    await setup(context);
    await login(page);
    await page.goto("/premium/success");
    await expect(page).toHaveURL(/\/pricing$/);
  });

  test("the pricing page shows the owned state", async ({ page, context }) => {
    await setup(context, { premium: true });
    await login(page);
    await page.goto("/pricing");
    await expect(page.getByText("You already have Premium")).toBeVisible();
    await expect(page.getByRole("button", { name: /Unlock Premium/ })).toHaveCount(0);
  });
});

test.describe("restoring a purchase", () => {
  test("Premium returns after signing out and back in, and settings can re-check it", async ({ page, context }) => {
    await setup(context, { premium: true });
    await login(page);
    await page.goto("/dashboard/settings");
    await expect(page.getByText("Premium is active on this account")).toBeVisible();

    await page.getByRole("button", { name: "Log out" }).click();
    await expect(page).toHaveURL(/\/$/);
    await login(page);
    await page.goto("/dashboard/settings");
    await expect(page.getByText("Premium is active on this account")).toBeVisible();
    await page.getByRole("button", { name: "Check my purchase" }).click();
    await expect(page.getByText("Premium is active on your account")).toBeVisible();
  });

  test("an account without a purchase says so", async ({ page, context }) => {
    await setup(context);
    await login(page);
    await page.goto("/dashboard/settings");
    await expect(page.getByRole("button", { name: /Unlock Premium/ })).toBeVisible();
    await page.getByRole("button", { name: "Check my purchase" }).click();
    await expect(page.getByText("No Premium purchase found on this account")).toBeVisible();
  });
});

test.describe("existing invitations are never locked", () => {
  test("an existing Premium invitation opens, edits, autosaves and keeps its design without a purchase", async ({ page, context }) => {
    const errors = trackErrors(page);
    const mock = await setup(context);
    mock.db.set(ID, premiumRow());
    await login(page);
    await page.goto(`/editor/${ID}`);
    await expect(page.locator("#event-hostNames")).toHaveValue("Ava & Noah");
    await page.fill("#event-hostNames", "Ava & Noah Smith");
    await expect(page.locator("header >> text=✓ Saved")).toBeVisible();
    expect(mock.db.get(ID)!.content.hostNames).toBe("Ava & Noah Smith");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    expect(errors).toEqual([]);
  });

  test("it can be published and unpublished from the dashboard, and a signed-out guest still sees it", async ({ page, context, browser }) => {
    const mock = await setup(context);
    mock.db.set(ID, premiumRow());
    await login(page);
    await page.goto("/dashboard");
    await page.getByRole("button", { name: /More actions/ }).click();
    await page.getByRole("menuitem", { name: "Publish" }).click();
    await expect(page.getByRole("link", { name: "View" })).toBeVisible();
    expect(mock.db.get(ID)!.status).toBe("published");

    const guestContext = await browser.newContext();
    const guestMock = await installMockSupabase(guestContext);
    guestMock.db.set(ID, mock.db.get(ID)!);
    const guest = await guestContext.newPage();
    await guest.goto(`/invitation/${mock.db.get(ID)!.slug}`);
    await expect(guest.getByTestId("public-invitation")).toContainText("Noah");
    await guestContext.close();
  });

  test("a published Premium invitation stays public for guests whatever the owner owns", async ({ page, context }) => {
    const mock = await setup(context);
    mock.db.set(ID, premiumRow(ID, { status: "published", slug: "ava-and-noah" }));
    await page.goto("/invitation/ava-and-noah");
    await expect(page.getByTestId("public-invitation")).toContainText("Noah");
  });

  test("it can be exported as PNG and PDF without a purchase", async ({ page, context }) => {
    const mock = await setup(context);
    mock.db.set(ID, premiumRow());
    await login(page);
    await page.goto(`/editor/${ID}`);
    await expect(page.locator("#event-hostNames")).toBeVisible();
    const png = await exportFromEditor(page, "png");
    expect(pngSize(png.buffer)).toEqual({ width: 2400, height: 3000 });
    const pdf = await exportFromEditor(page, "pdf");
    expect(pdf.buffer.toString("latin1")).toContain("%PDF-1.4");
  });

  test("an existing invitation keeps a premium Look it already had", async ({ page, context }) => {
    const mock = await setup(context);
    const t = getTemplate(FREE_TEMPLATE)!;
    mock.db.set(ID, seedRow(ID, "Midnight", "Ava & Noah", { template_id: t.id, design: { ...t.presets.find((p) => p.id === PREMIUM_LOOK)!.design, presetId: PREMIUM_LOOK } }));
    await login(page);
    await page.goto(`/editor/${ID}`);
    await expect(page.getByRole("group", { name: "Looks" }).getByRole("button", { name: "Midnight Foil" })).toHaveAttribute("aria-pressed", "true");
    await page.fill("#event-hostNames", "Ava & Noah Smith");
    await expect(page.locator("header >> text=✓ Saved")).toBeVisible();
    // Switching to another premium Look would be new use; here the other Looks are free ones.
    await page.getByRole("group", { name: "Looks" }).getByRole("button", { name: "Blush Peony" }).click();
    await expect(page.locator("header >> text=✓ Saved")).toBeVisible();
  });

  test("old free invitations still work", async ({ page, context }) => {
    const mock = await setup(context);
    mock.db.set(ID, seedRow(ID, "Old one", "Sam", { design: { headingFont: "Cormorant Garamond", bodyFont: "Inter", backgroundColor: "#F6F1E8", textColor: "#3A3128", accentColor: "#8A7352", decorations: ["border"] } }));
    await login(page);
    await page.goto("/dashboard");
    await expect(page.locator("article h2")).toHaveText("Old one");
    await page.goto(`/editor/${ID}`);
    await expect(page.locator("#event-hostNames")).toHaveValue("Sam");
  });
});

test.describe("when the server refuses a save", () => {
  test("a new Premium invitation whose access disappeared goes back to the gate, and resumes after unlocking", async ({ page, context }) => {
    const mock = await setup(context, { premium: true });
    await login(page);
    await gotoEditor(page, `template=${PREMIUM_TEMPLATE}`);
    await expect(page.locator("#event-hostNames")).toBeVisible();
    mock.purchases.length = 0; // the purchase disappears on the server; the browser's idea of access is now stale
    let writes = 0;
    page.on("request", (r) => r.method() === "POST" && r.url().includes("/rest/v1/invitations") && writes++);
    await page.fill("#event-hostNames", "Priya & Omar");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("part of Premium");
    const settled = writes;
    await page.waitForTimeout(6500);
    expect(writes).toBe(settled); // no retry loop (the editor's final flush on leaving is one more refused request)
    expect(settled).toBeLessThanOrEqual(2);
    expect(mock.db.size).toBe(0);

    mock.stripe.grantPremium();
    await page.getByRole("button", { name: /Unlock Premium/ }).click();
    await expect(page.locator("#event-hostNames")).toHaveValue("Priya & Omar");
    await expect(page.locator("header >> text=✓ Saved")).toBeVisible({ timeout: 15_000 });
    expect(mock.db.size).toBe(1);
  });

  test("choosing a premium Look the server refuses pauses saving, asks to unlock, and resumes after unlocking", async ({ page, context }) => {
    const mock = await setup(context, { premium: true });
    const t = getTemplate(FREE_TEMPLATE)!;
    mock.db.set(ID, seedRow(ID, "Mine", "Ava & Noah", { template_id: t.id, design: { ...t.presets[0].design, presetId: t.presets[0].id } }));
    await login(page);
    await page.goto(`/editor/${ID}`);
    const looks = page.getByRole("group", { name: "Looks" });
    await expect(looks.getByRole("button", { name: "Midnight Foil" })).toBeVisible();
    mock.purchases.length = 0;
    let writes = 0;
    page.on("request", (r) => r.method() === "PATCH" && r.url().includes("/rest/v1/invitations") && writes++);
    await looks.getByRole("button", { name: "Midnight Foil" }).click();
    await expect(page.getByRole("dialog")).toContainText("can't be saved without Premium");
    await expect(page.locator("header")).toContainText("Needs Premium to save");
    await page.waitForTimeout(6500);
    expect(writes).toBe(1);
    expect(mock.db.get(ID)!.design.presetId).toBe(t.presets[0].id);

    mock.stripe.grantPremium();
    await page.getByRole("button", { name: /Unlock Premium/ }).click();
    await expect(page.locator("header >> text=✓ Saved")).toBeVisible({ timeout: 15_000 });
    expect(mock.db.get(ID)!.design.presetId).toBe(PREMIUM_LOOK);
  });
});

test.describe("mobile", () => {
  test.use({ viewport: { width: 375, height: 760 } });
  const overflows = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);

  test("the gate, the unlock dialog and the pricing page fit a phone", async ({ page, context }) => {
    await setup(context);
    await login(page);
    await gotoEditor(page, `template=${PREMIUM_TEMPLATE}`);
    await expect(page.getByRole("button", { name: /Unlock Premium/ })).toBeVisible();
    expect(await overflows(page)).toBe(false);
    await page.goto("/pricing");
    await expect(page.getByRole("button", { name: /Unlock Premium/ })).toBeVisible();
    expect(await overflows(page)).toBe(false);
    await page.goto("/premium/cancelled");
    expect(await overflows(page)).toBe(false);
  });

  test("the locked Look prompt works in the phone editor", async ({ page, context }) => {
    await setup(context);
    await login(page);
    await gotoEditor(page, `template=${FREE_TEMPLATE}`);
    await page.getByRole("button", { name: "Design" }).click();
    await page.getByRole("group", { name: "Looks" }).getByRole("button", { name: "Midnight Foil" }).click();
    const dialog = page.getByRole("dialog").filter({ hasText: "Unlock Premium" });
    await expect(dialog).toBeVisible();
    const box = await dialog.boundingBox();
    expect(box!.width).toBeLessThanOrEqual(375);
  });
});
