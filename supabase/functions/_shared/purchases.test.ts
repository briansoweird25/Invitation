import { beforeEach, describe, expect, it, vi } from "vitest";
import { applyStripeEvent, confirmCheckout, startCheckout, type PaidDetails, type PurchaseRecord, type PurchaseStore, type StripeConfig } from "./purchases";
import type { StripeEvent } from "./stripe";

const ALICE = "11111111-1111-4111-8111-111111111111";
const BOB = "22222222-2222-4222-8222-222222222222";

/** An in-memory stand-in for the purchases table, with the same rules the real store follows. */
function fakeStore() {
  const rows = new Map<string, PurchaseRecord & { paidDetails?: PaidDetails }>();
  const calls = { markPaid: 0, insertPending: 0 };
  const store: PurchaseStore = {
    async userHasPaid(userId) {
      return [...rows.values()].some((r) => r.userId === userId && r.status === "paid");
    },
    async latestPendingSession(userId) {
      return [...rows.values()].filter((r) => r.userId === userId && r.status === "pending").at(-1)?.sessionId ?? null;
    },
    async insertPending(userId, sessionId) {
      calls.insertPending++;
      rows.set(sessionId, { sessionId, userId, status: "pending" });
    },
    async getBySession(sessionId) {
      return rows.get(sessionId) ?? null;
    },
    async markPaid(details) {
      calls.markPaid++;
      rows.set(details.sessionId, { sessionId: details.sessionId, userId: details.userId, status: "paid", paidDetails: details });
    },
    async markUnpaid(sessionId, status) {
      const row = rows.get(sessionId);
      if (row?.status === "pending") row.status = status;
    },
  };
  return { store, rows, calls };
}

/** A fake Stripe API: records every request and answers from a table of sessions. */
function fakeStripe(sessions: Record<string, object> = {}) {
  const requests: { url: string; method: string; headers: Record<string, string>; body?: string }[] = [];
  let next = 1;
  const fetchFn = vi.fn(async (url: string, init?: RequestInit) => {
    const headers = (init?.headers ?? {}) as Record<string, string>;
    const method = init?.method ?? "GET";
    requests.push({ url, method, headers, body: init?.body as string | undefined });
    if (method === "POST" && url.endsWith("/v1/checkout/sessions")) {
      const id = `cs_test_new${next++}`;
      sessions[id] = { id, object: "checkout.session", status: "open", url: `https://checkout.stripe.com/c/pay/${id}` };
      return Response.json(sessions[id]);
    }
    const id = url.split("/").pop()!;
    return sessions[id] ? Response.json(sessions[id]) : Response.json({ error: { message: "No such session" } }, { status: 404 });
  });
  return { fetchFn, requests, sessions };
}

const config = (fetchFn: StripeConfig["fetch"]): StripeConfig => ({ secretKey: "sk_test_secret", priceId: "price_premium", siteUrl: "https://app.example.com", fetch: fetchFn, now: () => 1_800_000_000_000 });

const paidSession = (id: string, userId: string, extra: object = {}) => ({
  id,
  object: "checkout.session",
  status: "complete",
  payment_status: "paid",
  client_reference_id: userId,
  customer: "cus_1",
  payment_intent: "pi_1",
  amount_total: 1900,
  currency: "USD",
  metadata: { product: "premium", user_id: userId },
  ...extra,
});

const event = (type: string, session: object): StripeEvent => ({ id: "evt_1", type, data: { object: session } });

let warn: ReturnType<typeof vi.spyOn>;
beforeEach(() => {
  warn = vi.spyOn(console, "warn").mockImplementation(() => {});
});

describe("startCheckout", () => {
  it("creates a Checkout Session with the server's price for the signed-in user and records it as pending", async () => {
    const { store, rows } = fakeStore();
    const stripe = fakeStripe();
    const outcome = await startCheckout(store, config(stripe.fetchFn), { id: ALICE, email: "alice@example.com" }, "/templates");
    expect(outcome).toEqual({ status: "checkout", url: "https://checkout.stripe.com/c/pay/cs_test_new1" });
    expect(rows.get("cs_test_new1")).toMatchObject({ userId: ALICE, status: "pending" });

    const create = stripe.requests[0];
    expect(create.url).toBe("https://api.stripe.com/v1/checkout/sessions");
    expect(create.headers.Authorization).toBe("Bearer sk_test_secret");
    expect(create.headers["Idempotency-Key"]).toBeTruthy();
    const form = new URLSearchParams(create.body);
    expect(form.get("mode")).toBe("payment");
    expect(form.get("line_items[0][price]")).toBe("price_premium");
    expect(form.get("client_reference_id")).toBe(ALICE);
    expect(form.get("metadata[user_id]")).toBe(ALICE);
  });

  it("does not send someone who already owns Premium to pay again", async () => {
    const { store } = fakeStore();
    await store.markPaid({ sessionId: "cs_old", userId: ALICE, paymentIntentId: null, customerId: null, amountTotal: null, currency: null });
    const stripe = fakeStripe();
    expect(await startCheckout(store, config(stripe.fetchFn), { id: ALICE })).toEqual({ status: "owned" });
    expect(stripe.requests).toHaveLength(0);
  });

  it("does not treat another user's purchase as ownership", async () => {
    const { store } = fakeStore();
    await store.markPaid({ sessionId: "cs_bob", userId: BOB, paymentIntentId: null, customerId: null, amountTotal: null, currency: null });
    const stripe = fakeStripe();
    expect((await startCheckout(store, config(stripe.fetchFn), { id: ALICE })).status).toBe("checkout");
  });

  it("reuses a checkout that is still open instead of creating a second one", async () => {
    const { store, calls } = fakeStore();
    const stripe = fakeStripe();
    const first = await startCheckout(store, config(stripe.fetchFn), { id: ALICE });
    const second = await startCheckout(store, config(stripe.fetchFn), { id: ALICE });
    expect(second).toEqual(first);
    expect(calls.insertPending).toBe(1);
    expect(stripe.requests.filter((r) => r.method === "POST")).toHaveLength(1);
  });

  it("starts a new checkout when the earlier one expired", async () => {
    const { store, calls } = fakeStore();
    const stripe = fakeStripe();
    await startCheckout(store, config(stripe.fetchFn), { id: ALICE });
    stripe.sessions.cs_test_new1 = { id: "cs_test_new1", object: "checkout.session", status: "expired", url: null };
    const outcome = await startCheckout(store, config(stripe.fetchFn), { id: ALICE });
    expect(outcome).toEqual({ status: "checkout", url: "https://checkout.stripe.com/c/pay/cs_test_new2" });
    expect(calls.insertPending).toBe(2);
  });

  it("settles an earlier checkout that was in fact paid, instead of charging twice", async () => {
    const { store, rows } = fakeStore();
    const stripe = fakeStripe();
    await startCheckout(store, config(stripe.fetchFn), { id: ALICE });
    stripe.sessions.cs_test_new1 = paidSession("cs_test_new1", ALICE);
    expect(await startCheckout(store, config(stripe.fetchFn), { id: ALICE })).toEqual({ status: "owned" });
    expect(rows.get("cs_test_new1")?.status).toBe("paid");
    expect(stripe.requests.filter((r) => r.method === "POST")).toHaveLength(1);
  });

  it("fails without recording anything when Stripe refuses", async () => {
    const { store, calls } = fakeStore();
    const failing = vi.fn(async () => Response.json({ error: { message: "Invalid API Key" } }, { status: 401 }));
    await expect(startCheckout(store, config(failing), { id: ALICE })).rejects.toThrow();
    expect(calls.insertPending).toBe(0);
  });
});

describe("applyStripeEvent", () => {
  it("records a paid checkout for the user the session names", async () => {
    const { store, rows } = fakeStore();
    expect(await applyStripeEvent(store, event("checkout.session.completed", paidSession("cs_1", ALICE)))).toBe("paid");
    expect(rows.get("cs_1")).toMatchObject({ userId: ALICE, status: "paid" });
    expect(rows.get("cs_1")?.paidDetails).toMatchObject({ paymentIntentId: "pi_1", customerId: "cus_1", amountTotal: 1900, currency: "usd" });
  });

  it("completes a pending purchase created at checkout", async () => {
    const { store, rows } = fakeStore();
    await store.insertPending(ALICE, "cs_1");
    await applyStripeEvent(store, event("checkout.session.completed", paidSession("cs_1", ALICE)));
    expect(rows.get("cs_1")?.status).toBe("paid");
  });

  it("is idempotent: a retried event changes nothing", async () => {
    const { store, calls } = fakeStore();
    const e = event("checkout.session.completed", paidSession("cs_1", ALICE));
    await applyStripeEvent(store, e);
    await applyStripeEvent(store, e);
    await applyStripeEvent(store, event("checkout.session.async_payment_succeeded", paidSession("cs_1", ALICE)));
    expect(calls.markPaid).toBe(1);
  });

  it("does not grant access for a completed checkout whose payment has not settled", async () => {
    const { store, rows } = fakeStore();
    await store.insertPending(ALICE, "cs_1");
    expect(await applyStripeEvent(store, event("checkout.session.completed", paidSession("cs_1", ALICE, { payment_status: "unpaid" })))).toBe("ignored");
    expect(rows.get("cs_1")?.status).toBe("pending");
    expect(await applyStripeEvent(store, event("checkout.session.async_payment_succeeded", paidSession("cs_1", ALICE)))).toBe("paid");
    expect(rows.get("cs_1")?.status).toBe("paid");
  });

  it("marks failed and expired checkouts, never touching a paid one", async () => {
    const { store, rows } = fakeStore();
    await store.insertPending(ALICE, "cs_fail");
    await store.insertPending(ALICE, "cs_exp");
    await applyStripeEvent(store, event("checkout.session.async_payment_failed", paidSession("cs_fail", ALICE, { payment_status: "unpaid" })));
    await applyStripeEvent(store, event("checkout.session.expired", paidSession("cs_exp", ALICE, { payment_status: "unpaid", status: "expired" })));
    expect(rows.get("cs_fail")?.status).toBe("failed");
    expect(rows.get("cs_exp")?.status).toBe("expired");

    await applyStripeEvent(store, event("checkout.session.completed", paidSession("cs_paid", ALICE)));
    await applyStripeEvent(store, event("checkout.session.expired", paidSession("cs_paid", ALICE)));
    expect(rows.get("cs_paid")?.status).toBe("paid");
  });

  it("ignores events that are not Premium checkouts or have no valid user", async () => {
    const { store, rows } = fakeStore();
    expect(await applyStripeEvent(store, event("customer.created", { id: "cus_1", object: "customer" }))).toBe("ignored");
    expect(await applyStripeEvent(store, event("payment_intent.succeeded", { id: "pi_1", object: "payment_intent" }))).toBe("ignored");
    expect(await applyStripeEvent(store, event("checkout.session.completed", paidSession("cs_x", ALICE, { metadata: { product: "other", user_id: ALICE } })))).toBe("ignored");
    expect(await applyStripeEvent(store, event("checkout.session.completed", paidSession("cs_y", "not-a-uuid", { metadata: { product: "premium" } })))).toBe("ignored");
    expect(await applyStripeEvent(store, event("checkout.session.completed", paidSession("cs_z", ALICE, { client_reference_id: null, metadata: { product: "premium" } })))).toBe("ignored");
    expect(rows.size).toBe(0);
  });

  it("keeps a record of a duplicate payment from someone who already owns Premium, and warns", async () => {
    const { store, rows } = fakeStore();
    await applyStripeEvent(store, event("checkout.session.completed", paidSession("cs_1", ALICE)));
    await applyStripeEvent(store, event("checkout.session.completed", paidSession("cs_2", ALICE)));
    expect(rows.get("cs_2")?.status).toBe("paid");
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("duplicate payment"));
    expect(await store.userHasPaid(ALICE)).toBe(true);
  });
});

describe("confirmCheckout", () => {
  it("records a paid session that belongs to the user", async () => {
    const { store, rows } = fakeStore();
    const stripe = fakeStripe({ cs_1: paidSession("cs_1", ALICE) });
    expect(await confirmCheckout(store, config(stripe.fetchFn), ALICE, "cs_1")).toEqual({ status: "paid" });
    expect(rows.get("cs_1")?.status).toBe("paid");
  });

  it("refuses another user's session", async () => {
    const { store, rows } = fakeStore();
    const stripe = fakeStripe({ cs_1: paidSession("cs_1", BOB) });
    await expect(confirmCheckout(store, config(stripe.fetchFn), ALICE, "cs_1")).rejects.toMatchObject({ status: 403 });
    expect(rows.size).toBe(0);
  });

  it("reports an unpaid session as pending and an expired one as expired", async () => {
    const { store, rows } = fakeStore();
    await store.insertPending(ALICE, "cs_exp");
    const stripe = fakeStripe({
      cs_open: paidSession("cs_open", ALICE, { status: "open", payment_status: "unpaid" }),
      cs_exp: paidSession("cs_exp", ALICE, { status: "expired", payment_status: "unpaid" }),
    });
    expect(await confirmCheckout(store, config(stripe.fetchFn), ALICE, "cs_open")).toEqual({ status: "pending" });
    expect(await confirmCheckout(store, config(stripe.fetchFn), ALICE, "cs_exp")).toEqual({ status: "expired" });
    expect(rows.get("cs_exp")?.status).toBe("expired");
  });

  it("answers without calling Stripe when the user already owns Premium", async () => {
    const { store } = fakeStore();
    await store.markPaid({ sessionId: "cs_old", userId: ALICE, paymentIntentId: null, customerId: null, amountTotal: null, currency: null });
    const stripe = fakeStripe();
    expect(await confirmCheckout(store, config(stripe.fetchFn), ALICE, "cs_whatever")).toEqual({ status: "paid" });
    expect(stripe.requests).toHaveLength(0);
  });

  it("rejects a malformed session id before calling Stripe", async () => {
    const { store } = fakeStore();
    const stripe = fakeStripe();
    await expect(confirmCheckout(store, config(stripe.fetchFn), ALICE, "../customers")).rejects.toMatchObject({ status: 400 });
    expect(stripe.requests).toHaveLength(0);
  });

  it("does not trust a session whose product metadata is not premium", async () => {
    const { store, rows } = fakeStore();
    const stripe = fakeStripe({ cs_1: paidSession("cs_1", ALICE, { metadata: { product: "other", user_id: ALICE } }) });
    await expect(confirmCheckout(store, config(stripe.fetchFn), ALICE, "cs_1")).rejects.toMatchObject({ status: 403 });
    expect(rows.size).toBe(0);
  });
});
