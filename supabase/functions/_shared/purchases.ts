import { buildCheckoutParams, createCheckoutSession, retrieveCheckoutSession, StripeApiError, type FetchFn, type StripeEvent, type StripeSession } from "./stripe.ts";

/**
 * The Premium purchase rules, free of any framework. The Edge Functions wire them to Stripe and Supabase; the tests
 * wire them to fakes. Nothing here trusts the browser: the user comes from a verified token, the price from the
 * server's configuration, and "paid" only from Stripe (a signed webhook or a direct lookup with the secret key).
 */

export interface PurchaseRecord {
  sessionId: string;
  userId: string;
  status: "pending" | "paid" | "failed" | "expired";
}

export interface PaidDetails {
  sessionId: string;
  userId: string;
  paymentIntentId: string | null;
  customerId: string | null;
  amountTotal: number | null;
  currency: string | null;
}

/** What the rules need from the database. The real implementation uses the service-role client. */
export interface PurchaseStore {
  userHasPaid(userId: string): Promise<boolean>;
  latestPendingSession(userId: string): Promise<string | null>;
  insertPending(userId: string, sessionId: string): Promise<void>;
  getBySession(sessionId: string): Promise<PurchaseRecord | null>;
  /** Marks the purchase paid, creating the row if there is none. Must be safe to call twice. */
  markPaid(details: PaidDetails): Promise<void>;
  /** Moves a purchase that is still pending to failed or expired. A paid purchase is never changed. */
  markUnpaid(sessionId: string, status: "failed" | "expired"): Promise<void>;
}

export interface StripeConfig {
  secretKey: string;
  priceId: string;
  siteUrl: string;
  fetch: FetchFn;
  now?: () => number;
}

const isUuid = (v: unknown): v is string => typeof v === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);

export type CheckoutOutcome = { status: "owned" } | { status: "checkout"; url: string };

export async function startCheckout(store: PurchaseStore, config: StripeConfig, user: { id: string; email?: string }, returnTo?: string): Promise<CheckoutOutcome> {
  // Someone who already owns Premium is never sent to pay again.
  if (await store.userHasPaid(user.id)) return { status: "owned" };

  // Reuse a checkout that is still open, so a double click or a second tab does not create a second payment.
  const pending = await store.latestPendingSession(user.id);
  if (pending) {
    try {
      const existing = await retrieveCheckoutSession(config.fetch, config.secretKey, pending);
      if (existing.status === "open" && existing.url) return { status: "checkout", url: existing.url };
      // It was completed (a webhook may be on its way), expired or otherwise finished: fall through to settle or restart.
      if (existing.status === "complete" && existing.payment_status === "paid") {
        await recordPaid(store, existing, user.id);
        return { status: "owned" };
      }
    } catch (e) {
      if (!(e instanceof StripeApiError)) throw e;
    }
  }

  const now = (config.now ?? Date.now)();
  const idempotencyKey = `premium:${user.id}:${Math.floor(now / 60_000)}:${returnTo ?? ""}`;
  const session = await createCheckoutSession(
    config.fetch,
    config.secretKey,
    buildCheckoutParams({ priceId: config.priceId, siteUrl: config.siteUrl, userId: user.id, email: user.email, returnTo }),
    encodeURIComponent(idempotencyKey).slice(0, 255),
  );
  if (!session.url) throw new Error("Stripe returned no checkout URL");
  await store.insertPending(user.id, session.id);
  return { status: "checkout", url: session.url };
}

/** Records a session Stripe reports as paid, for the user the session names. Returns false when it is not ours. */
async function recordPaid(store: PurchaseStore, session: StripeSession, expectedUserId?: string): Promise<boolean> {
  const userId = session.client_reference_id ?? session.metadata?.user_id;
  if (session.metadata?.product !== "premium" || !isUuid(userId)) return false;
  if (expectedUserId && userId !== expectedUserId) return false;
  if (session.payment_status !== "paid") return false;

  const existing = await store.getBySession(session.id);
  if (existing?.status === "paid") return true; // already recorded: webhook retries and confirmations are harmless
  if (!existing && (await store.userHasPaid(userId))) {
    // A second payment from someone who already owns Premium. Keep the record so the money is traceable; it needs a manual refund.
    console.warn(`[premium] duplicate payment for user ${userId} in session ${session.id}`);
  }
  await store.markPaid({
    sessionId: session.id,
    userId,
    paymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : null,
    customerId: typeof session.customer === "string" ? session.customer : null,
    amountTotal: typeof session.amount_total === "number" ? session.amount_total : null,
    currency: typeof session.currency === "string" ? session.currency.toLowerCase() : null,
  });
  return true;
}

export type EventOutcome = "paid" | "failed" | "expired" | "ignored";

/** Applies a verified Stripe event. Unknown or irrelevant events are accepted and ignored. */
export async function applyStripeEvent(store: PurchaseStore, event: StripeEvent): Promise<EventOutcome> {
  const session = event.data?.object as unknown as StripeSession | undefined;
  if (!session || session.object !== "checkout.session" || session.metadata?.product !== "premium") return "ignored";

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded":
      // `completed` can arrive before an asynchronous payment settles; only "paid" counts.
      return (await recordPaid(store, session)) ? "paid" : "ignored";
    case "checkout.session.async_payment_failed":
      await store.markUnpaid(session.id, "failed");
      return "failed";
    case "checkout.session.expired":
      await store.markUnpaid(session.id, "expired");
      return "expired";
    default:
      return "ignored";
  }
}

export type ConfirmOutcome = { status: "paid" } | { status: "pending" } | { status: "expired" };

/**
 * Looks a session up with Stripe and records it if it is paid. This lets the success page settle at once even when
 * the webhook is slow. It only ever acts on a session that belongs to the signed-in user.
 */
export async function confirmCheckout(store: PurchaseStore, config: StripeConfig, userId: string, sessionId: string): Promise<ConfirmOutcome> {
  if (await store.userHasPaid(userId)) return { status: "paid" };
  const session = await retrieveCheckoutSession(config.fetch, config.secretKey, sessionId);
  const owner = session.client_reference_id ?? session.metadata?.user_id;
  if (owner !== userId || session.metadata?.product !== "premium") throw new StripeApiError("Session does not belong to this user", 403);
  if (await recordPaid(store, session, userId)) return { status: "paid" };
  if (session.status === "expired") {
    await store.markUnpaid(session.id, "expired");
    return { status: "expired" };
  }
  return { status: "pending" };
}
