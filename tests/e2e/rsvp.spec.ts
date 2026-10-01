import { expect, test, type Page } from "@playwright/test";
import { installMockSupabase, login, seedRow, trackErrors } from "./helpers/mockSupabase";

const ID = "dddddddd-dddd-4ddd-8ddd-dddddddddddd";
const rsvpOn = (extra: Record<string, unknown> = {}) => ({ enabled: true, ...extra });
const published = (rsvp: Record<string, unknown> = rsvpOn(), extra: Record<string, unknown> = {}) =>
  seedRow(ID, "Ava and Noah", "Ava & Noah", { status: "published", slug: "ava-and-noah", rsvp_settings: rsvp, ...extra });

const choose = (page: Page, label: string) => page.getByLabel(label, { exact: true }).check();

test.describe("the guest form", () => {
  test("a guest who is not signed in can accept, and the reply is stored", async ({ page, context }) => {
    const errors = trackErrors(page);
    const mock = await installMockSupabase(context);
    mock.db.set(ID, published(rsvpOn({ maxGuests: 4 })));
    await page.goto("/invitation/ava-and-noah");
    await page.getByLabel("Your name").fill("  Priya Raman ");
    await choose(page, "Yes, I'll be there");
    await page.getByLabel("How many people, including you?").fill("3");
    await page.getByLabel("Email (optional)").fill("priya@example.com");
    await page.getByLabel("A note for the host (optional)").fill("Can't wait!");
    await page.getByRole("button", { name: "Send RSVP" }).click();

    await expect(page.getByRole("status")).toContainText("Thank you, Priya Raman");
    expect(mock.rsvps).toHaveLength(1);
    expect(mock.rsvps[0]).toMatchObject({ invitation_id: ID, guest_name: "Priya Raman", guest_email: "priya@example.com", attendance: "attending", guest_count: 3, message: "Can't wait!" });
    expect(errors).toEqual([]);
  });

  test("a decline stores one guest, hides the count and leaves optional fields empty", async ({ page, context }) => {
    const mock = await installMockSupabase(context);
    mock.db.set(ID, published());
    await page.goto("/invitation/ava-and-noah");
    await page.getByLabel("Your name").fill("Sam");
    await choose(page, "Sorry, I can't make it");
    await expect(page.getByLabel("How many people, including you?")).toHaveCount(0);
    await page.getByRole("button", { name: "Send RSVP" }).click();
    await expect(page.getByText("We'll miss you.")).toBeVisible();
    expect(mock.rsvps[0]).toMatchObject({ attendance: "declined", guest_count: 1, guest_email: null, message: null });
  });

  test("validation explains what to fix and sends nothing", async ({ page, context }) => {
    const mock = await installMockSupabase(context);
    mock.db.set(ID, published(rsvpOn({ maxGuests: 2 })));
    await page.goto("/invitation/ava-and-noah");
    await page.getByRole("button", { name: "Send RSVP" }).click();
    await expect(page.getByText("Enter your name.")).toBeVisible();
    await expect(page.getByText("Choose whether you can come.")).toBeVisible();

    await page.getByLabel("Your name").fill("Sam");
    await choose(page, "Yes, I'll be there");
    await page.getByLabel("How many people, including you?").fill("5");
    await page.getByLabel("Email (optional)").fill("not-an-email");
    await page.getByRole("button", { name: "Send RSVP" }).click();
    await expect(page.getByText("This invitation allows up to 2 guests per reply.")).toBeVisible();
    await expect(page.getByText(/valid email/i)).toBeVisible();
    expect(mock.rsvps).toHaveLength(0);
  });

  test("a failed send keeps the form and the answers, with a friendly message", async ({ page, context }) => {
    const mock = await installMockSupabase(context);
    mock.db.set(ID, published());
    mock.failNext.rsvpSubmit = true;
    await page.goto("/invitation/ava-and-noah");
    await page.getByLabel("Your name").fill("Sam");
    await choose(page, "Yes, I'll be there");
    await page.getByRole("button", { name: "Send RSVP" }).click();
    await expect(page.getByRole("alert").filter({ hasText: "We couldn't send your reply." })).toBeVisible();
    await expect(page.locator("body")).not.toContainText("boom");
    await expect(page.getByLabel("Your name")).toHaveValue("Sam");
    mock.failNext.rsvpSubmit = false;
    await page.getByRole("button", { name: "Send RSVP" }).click();
    await expect(page.getByText("Thank you, Sam")).toBeVisible();
  });

  test("the hidden trap field fakes success and stores nothing", async ({ page, context }) => {
    const mock = await installMockSupabase(context);
    mock.db.set(ID, published());
    await page.goto("/invitation/ava-and-noah");
    await page.getByLabel("Your name").fill("Bot");
    await choose(page, "Yes, I'll be there");
    await page.locator("input[name=website]").fill("http://spam.example", { force: true });
    await page.getByRole("button", { name: "Send RSVP" }).click();
    await expect(page.getByText("Thank you, Bot")).toBeVisible();
    expect(mock.rsvps).toHaveLength(0);
  });

  test("after the deadline the form is replaced by a closed note", async ({ page, context }) => {
    const mock = await installMockSupabase(context);
    mock.db.set(ID, published(rsvpOn({ deadline: "2020-01-01", contactEmail: "ava@example.com" })));
    await page.goto("/invitation/ava-and-noah");
    await expect(page.getByText("Replies closed on January 1, 2020.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Send RSVP" })).toHaveCount(0);
    await expect(page.getByRole("link", { name: /ava@example.com/ })).toBeVisible();
  });

  test("a reply the database refuses (unpublished meanwhile) says replies are closed", async ({ page, context }) => {
    const mock = await installMockSupabase(context);
    mock.db.set(ID, published());
    await page.goto("/invitation/ava-and-noah");
    await expect(page.getByLabel("Your name")).toBeVisible();
    mock.db.get(ID)!.status = "draft";
    await page.getByLabel("Your name").fill("Sam");
    await choose(page, "Yes, I'll be there");
    await page.getByRole("button", { name: "Send RSVP" }).click();
    await expect(page.getByText("This invitation is no longer accepting replies.")).toBeVisible();
  });

  test("no form when RSVP is off", async ({ page, context }) => {
    const mock = await installMockSupabase(context);
    mock.db.set(ID, published({ enabled: false }));
    await page.goto("/invitation/ava-and-noah");
    await expect(page.getByTestId("public-invitation")).toBeVisible();
    await expect(page.getByRole("heading", { name: "RSVP" })).toHaveCount(0);
  });

  test("a second guest can reply after the first", async ({ page, context }) => {
    const mock = await installMockSupabase(context);
    mock.db.set(ID, published());
    await page.goto("/invitation/ava-and-noah");
    await page.getByLabel("Your name").fill("First");
    await choose(page, "Yes, I'll be there");
    await page.getByRole("button", { name: "Send RSVP" }).click();
    await page.getByRole("button", { name: "Reply for someone else" }).click();
    await expect(page.getByLabel("Your name")).toHaveValue("");
    await page.getByLabel("Your name").fill("Second");
    await choose(page, "Sorry, I can't make it");
    await page.getByRole("button", { name: "Send RSVP" }).click();
    await expect(page.getByText("Thank you, Second")).toBeVisible();
    expect(mock.rsvps.map((r) => r.guest_name)).toEqual(["First", "Second"]);
  });
});

test.describe("the owner's RSVP dashboard", () => {
  const reply = (name: string, attendance: "attending" | "declined", count: number, extra: Record<string, unknown> = {}, minutes = 0) => ({
    id: crypto.randomUUID(),
    invitation_id: ID,
    guest_name: name,
    guest_email: null,
    attendance,
    guest_count: count,
    message: null,
    created_at: new Date(Date.UTC(2026, 3, 1, 12, minutes)).toISOString(),
    ...extra,
  });

  test("shows the numbers, the guest list and filters", async ({ page, context }) => {
    const errors = trackErrors(page);
    const mock = await installMockSupabase(context);
    mock.db.set(ID, published());
    mock.rsvps.push(
      reply("Priya Raman", "attending", 2, { guest_email: "priya@example.com", message: "Looking forward to it" }, 1),
      reply("Omar Ali", "attending", 3, {}, 2),
      reply("Sam Lee", "declined", 1, { message: "Out of town" }, 3),
    );
    await login(page);
    await page.goto("/dashboard");
    await page.getByRole("link", { name: "RSVPs" }).click();

    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Ava and Noah");
    await expect(page.getByTestId("stat-attending")).toHaveText("2");
    await expect(page.getByTestId("stat-declined")).toHaveText("1");
    await expect(page.getByTestId("stat-guests")).toHaveText("5");
    await expect(page.getByTestId("stat-replies")).toHaveText("3");

    const rows = page.locator("section[aria-labelledby=guest-list-heading] li");
    await expect(rows).toHaveCount(3);
    await expect(rows.first()).toContainText("Sam Lee"); // newest first
    await expect(page.getByText("Looking forward to it")).toBeVisible();
    await expect(page.getByRole("link", { name: "priya@example.com" })).toHaveAttribute("href", "mailto:priya@example.com");

    await page.getByRole("button", { name: /^Attending/ }).click();
    await expect(rows).toHaveCount(2);
    await page.getByRole("button", { name: /^Not attending/ }).click();
    await expect(rows).toHaveCount(1);
    await expect(rows.first()).toContainText("Out of town");
    expect(errors).toEqual([]);
  });

  test("an invitation with no replies shows an empty state with zeros", async ({ page, context }) => {
    const mock = await installMockSupabase(context);
    mock.db.set(ID, published());
    await login(page);
    await page.goto(`/dashboard/invitations/${ID}/rsvps`);
    await expect(page.getByRole("heading", { name: "No replies yet" })).toBeVisible();
    await expect(page.getByTestId("stat-replies")).toHaveText("0");
  });

  test("warns when RSVP is off or the invitation is a draft", async ({ page, context }) => {
    const mock = await installMockSupabase(context);
    mock.db.set(ID, published({ enabled: false }));
    await login(page);
    await page.goto(`/dashboard/invitations/${ID}/rsvps`);
    await expect(page.getByText("RSVPs are turned off for this invitation")).toBeVisible();

    mock.db.set(ID, published(rsvpOn(), { status: "draft" }));
    await page.reload();
    await expect(page.getByText("isn't published yet")).toBeVisible();
  });

  test("another user's invitation, a malformed id and an unknown id all read as not found", async ({ page, context }) => {
    const mock = await installMockSupabase(context);
    mock.db.set(ID, published(rsvpOn(), { user_id: "22222222-2222-4222-8222-222222222222" }));
    await login(page);
    for (const id of [ID, "not-a-uuid", "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee"]) {
      await page.goto(`/dashboard/invitations/${id}/rsvps`);
      await expect(page.getByRole("heading", { name: "Invitation not found" })).toBeVisible();
    }
  });

  test("requires signing in", async ({ page, context }) => {
    await installMockSupabase(context);
    await page.goto(`/dashboard/invitations/${ID}/rsvps`);
    await expect(page).toHaveURL(/\/login/);
  });

  test("the dashboard shows the RSVPs link only when RSVP is on", async ({ page, context }) => {
    const mock = await installMockSupabase(context);
    mock.db.set(ID, published({ enabled: false }));
    await login(page);
    await page.goto("/dashboard");
    await expect(page.locator("article h2")).toHaveText("Ava and Noah");
    await expect(page.getByRole("link", { name: "RSVPs" })).toHaveCount(0);
  });

  test("guests cannot read replies", async ({ page, context }) => {
    const mock = await installMockSupabase(context);
    mock.db.set(ID, published());
    mock.rsvps.push(reply("Priya Raman", "attending", 2));
    const result = await page.goto("/invitation/ava-and-noah").then(() =>
      page.evaluate(async () => {
        const res = await fetch("https://test.supabase.co/rest/v1/rsvps?select=*", { headers: { apikey: "x", authorization: "Bearer x" } });
        return res.json();
      }),
    );
    expect(result).toEqual([]);
  });
});

test.describe("mobile", () => {
  test.use({ viewport: { width: 375, height: 700 } });

  test("the form and the owner's list fit the screen", async ({ page, context }) => {
    const mock = await installMockSupabase(context);
    mock.db.set(ID, published(rsvpOn({ contactEmail: "a-very-long-email-address-for-the-host@example-domain.com" })));
    mock.rsvps.push({ id: crypto.randomUUID(), invitation_id: ID, guest_name: "A".repeat(100), guest_email: "x".repeat(60) + "@example.com", attendance: "attending", guest_count: 2, message: "word ".repeat(60), created_at: new Date().toISOString() });
    const overflows = () => page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);

    await page.goto("/invitation/ava-and-noah");
    await expect(page.getByRole("button", { name: "Send RSVP" })).toBeVisible();
    expect(await overflows()).toBe(false);
    const submit = await page.getByRole("button", { name: "Send RSVP" }).boundingBox();
    expect(submit!.height).toBeGreaterThanOrEqual(40);

    await login(page);
    await page.goto("/dashboard");
    expect(await overflows()).toBe(false);
    await page.goto(`/dashboard/invitations/${ID}/rsvps`);
    await expect(page.getByTestId("stat-replies")).toHaveText("1");
    expect(await overflows()).toBe(false);
  });
});
