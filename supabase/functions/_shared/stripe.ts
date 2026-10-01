/**
 * Stripe helpers for the Edge Functions. They use plain `fetch` and Web Crypto, so there is no SDK to install and the
 * same code runs in Deno (the functions) and Node (the tests). The secret key only ever lives in the function's
 * environment; nothing here is imported by the browser app.
 */

const encoder = new TextEncoder();

export type FetchFn = (input: string, init?: RequestInit) => Promise<Response>;

// ---------------------------------------------------------------------------
// Webhook signatures
// ---------------------------------------------------------------------------

const toHex = (buffer: ArrayBuffer) => [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, "0")).join("");

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return toHex(await crypto.subtle.sign("HMAC", key, encoder.encode(message)));
}

/** Compares two strings in time that does not depend on where they differ. */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/**
 * Verifies a `Stripe-Signature` header against the raw request body: the HMAC-SHA256 of "<timestamp>.<body>" with
 * the endpoint's signing secret, within a tolerance so old events cannot be replayed. Must be given the exact bytes
 * Stripe sent, so read the body as text before parsing it.
 */
export async function verifyStripeSignature(rawBody: string, header: string | null, secret: string, options: { toleranceSeconds?: number; now?: number } = {}): Promise<boolean> {
  if (!header || !secret) return false;
  const { toleranceSeconds = 300, now = Date.now() } = options;
  let timestamp: string | undefined;
  const signatures: string[] = [];
  for (const part of header.split(",")) {
    const [key, value] = part.split("=", 2);
    if (key?.trim() === "t") timestamp = value?.trim();
    else if (key?.trim() === "v1" && value) signatures.push(value.trim());
  }
  if (!timestamp || !/^\d+$/.test(timestamp) || signatures.length === 0) return false;
  if (Math.abs(now / 1000 - Number(timestamp)) > toleranceSeconds) return false;
  const expected = await hmacSha256Hex(secret, `${timestamp}.${rawBody}`);
  return signatures.some((s) => timingSafeEqual(s, expected));
}

/** Builds a valid header for a body. Used by tests and by local webhook rehearsals. */
export async function signStripePayload(rawBody: string, secret: string, timestampSeconds = Math.floor(Date.now() / 1000)): Promise<string> {
  return `t=${timestampSeconds},v1=${await hmacSha256Hex(secret, `${timestampSeconds}.${rawBody}`)}`;
}

// ---------------------------------------------------------------------------
// Requests to the Stripe API
// ---------------------------------------------------------------------------

/** Stripe wants form encoding with bracketed keys: { a: { b: 1 }, c: [x] } becomes a[b]=1&c[0]=x. */
export function encodeForm(params: Record<string, unknown>): string {
  const pairs: string[] = [];
  const walk = (prefix: string, value: unknown) => {
    if (value === undefined || value === null) return;
    if (Array.isArray(value)) value.forEach((v, i) => walk(`${prefix}[${i}]`, v));
    else if (typeof value === "object") for (const [k, v] of Object.entries(value)) walk(`${prefix}[${k}]`, v);
    else pairs.push(`${encodeURIComponent(prefix)}=${encodeURIComponent(String(value))}`);
  };
  for (const [key, value] of Object.entries(params)) walk(key, value);
  return pairs.join("&");
}

/** A path inside this site, never an absolute or protocol-relative URL, so it cannot send people elsewhere. */
export function safeReturnTo(value: unknown): string | undefined {
  if (typeof value !== "string" || value.length > 300) return undefined;
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\") || /[\u0000-\u001f]/.test(value)) return undefined;
  return value;
}

export interface CheckoutParamsInput {
  priceId: string;
  siteUrl: string;
  userId: string;
  email?: string;
  returnTo?: string;
}

/**
 * The Checkout Session for the one-time Premium purchase. The price comes from the server's configuration, never
 * from the request, and the user is bound to the session through `client_reference_id` and metadata.
 */
export function buildCheckoutParams({ priceId, siteUrl, userId, email, returnTo }: CheckoutParamsInput): Record<string, unknown> {
  const base = siteUrl.replace(/\/+$/, "");
  const back = returnTo ? `&return_to=${encodeURIComponent(returnTo)}` : "";
  return {
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    client_reference_id: userId,
    customer_email: email,
    customer_creation: "always",
    metadata: { product: "premium", user_id: userId },
    payment_intent_data: { metadata: { product: "premium", user_id: userId } },
    success_url: `${base}/premium/success?session_id={CHECKOUT_SESSION_ID}${back}`,
    cancel_url: `${base}/premium/cancelled${back ? `?${back.slice(1)}` : ""}`,
  };
}

export interface StripeSession {
  id: string;
  object: "checkout.session";
  url?: string | null;
  status?: "open" | "complete" | "expired" | null;
  payment_status?: "paid" | "unpaid" | "no_payment_required" | null;
  client_reference_id?: string | null;
  customer?: string | null;
  payment_intent?: string | null;
  amount_total?: number | null;
  currency?: string | null;
  metadata?: Record<string, string> | null;
}

export class StripeApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

async function stripeRequest<T>(fetchFn: FetchFn, secretKey: string, path: string, init: { method: "GET" | "POST"; body?: string; idempotencyKey?: string }): Promise<T> {
  const headers: Record<string, string> = { Authorization: `Bearer ${secretKey}` };
  if (init.body) headers["Content-Type"] = "application/x-www-form-urlencoded";
  if (init.idempotencyKey) headers["Idempotency-Key"] = init.idempotencyKey;
  const response = await fetchFn(`https://api.stripe.com${path}`, { method: init.method, headers, body: init.body });
  const json = (await response.json().catch(() => ({}))) as { error?: { message?: string } } & T;
  if (!response.ok) throw new StripeApiError(json.error?.message ?? `Stripe returned ${response.status}`, response.status);
  return json;
}

export function createCheckoutSession(fetchFn: FetchFn, secretKey: string, params: Record<string, unknown>, idempotencyKey?: string): Promise<StripeSession> {
  return stripeRequest<StripeSession>(fetchFn, secretKey, "/v1/checkout/sessions", { method: "POST", body: encodeForm(params), idempotencyKey });
}

export function retrieveCheckoutSession(fetchFn: FetchFn, secretKey: string, sessionId: string): Promise<StripeSession> {
  if (!/^cs_[A-Za-z0-9_]+$/.test(sessionId)) throw new StripeApiError("Invalid session id", 400);
  return stripeRequest<StripeSession>(fetchFn, secretKey, `/v1/checkout/sessions/${sessionId}`, { method: "GET" });
}

export interface StripeEvent {
  id: string;
  type: string;
  data: { object: Record<string, unknown> };
}
