import { describe, expect, it } from "vitest";
import { buildCheckoutParams, encodeForm, safeReturnTo, signStripePayload, timingSafeEqual, verifyStripeSignature } from "./stripe";

const SECRET = "whsec_test_secret";
const BODY = '{"id":"evt_1","type":"checkout.session.completed"}';
const NOW = 1_800_000_000_000;

describe("verifyStripeSignature", () => {
  it("accepts a correct signature", async () => {
    const header = await signStripePayload(BODY, SECRET, NOW / 1000);
    expect(await verifyStripeSignature(BODY, header, SECRET, { now: NOW })).toBe(true);
  });

  it("rejects a body that was changed after signing", async () => {
    const header = await signStripePayload(BODY, SECRET, NOW / 1000);
    expect(await verifyStripeSignature(BODY.replace("evt_1", "evt_2"), header, SECRET, { now: NOW })).toBe(false);
    expect(await verifyStripeSignature(`${BODY} `, header, SECRET, { now: NOW })).toBe(false);
  });

  it("rejects the wrong secret, an empty secret and a missing or malformed header", async () => {
    const header = await signStripePayload(BODY, SECRET, NOW / 1000);
    expect(await verifyStripeSignature(BODY, header, "whsec_other", { now: NOW })).toBe(false);
    expect(await verifyStripeSignature(BODY, header, "", { now: NOW })).toBe(false);
    expect(await verifyStripeSignature(BODY, null, SECRET, { now: NOW })).toBe(false);
    expect(await verifyStripeSignature(BODY, "", SECRET, { now: NOW })).toBe(false);
    expect(await verifyStripeSignature(BODY, "garbage", SECRET, { now: NOW })).toBe(false);
    expect(await verifyStripeSignature(BODY, `t=${NOW / 1000}`, SECRET, { now: NOW })).toBe(false);
    expect(await verifyStripeSignature(BODY, `v1=abc`, SECRET, { now: NOW })).toBe(false);
    expect(await verifyStripeSignature(BODY, `t=abc,v1=abc`, SECRET, { now: NOW })).toBe(false);
  });

  it("rejects a replayed old event and a timestamp from the future, but allows small clock drift", async () => {
    const old = await signStripePayload(BODY, SECRET, NOW / 1000 - 301);
    expect(await verifyStripeSignature(BODY, old, SECRET, { now: NOW })).toBe(false);
    const future = await signStripePayload(BODY, SECRET, NOW / 1000 + 301);
    expect(await verifyStripeSignature(BODY, future, SECRET, { now: NOW })).toBe(false);
    const drift = await signStripePayload(BODY, SECRET, NOW / 1000 - 120);
    expect(await verifyStripeSignature(BODY, drift, SECRET, { now: NOW })).toBe(true);
  });

  it("accepts any matching v1 signature, as Stripe sends several while rotating secrets", async () => {
    const good = await signStripePayload(BODY, SECRET, NOW / 1000);
    const header = good.replace(",v1=", ",v1=deadbeef,v1=");
    expect(await verifyStripeSignature(BODY, header, SECRET, { now: NOW })).toBe(true);
  });

  it("does not accept a signature made with a v0 scheme", async () => {
    const good = await signStripePayload(BODY, SECRET, NOW / 1000);
    expect(await verifyStripeSignature(BODY, good.replace("v1=", "v0="), SECRET, { now: NOW })).toBe(false);
  });
});

describe("timingSafeEqual", () => {
  it("compares strings exactly", () => {
    expect(timingSafeEqual("abc", "abc")).toBe(true);
    expect(timingSafeEqual("abc", "abd")).toBe(false);
    expect(timingSafeEqual("abc", "abcd")).toBe(false);
  });
});

describe("encodeForm", () => {
  it("uses Stripe's bracket notation for nested objects and arrays and skips empty values", () => {
    const out = decodeURIComponent(encodeForm({ mode: "payment", line_items: [{ price: "price_1", quantity: 1 }], metadata: { a: "b" }, skip: undefined, nope: null }));
    expect(out).toBe("mode=payment&line_items[0][price]=price_1&line_items[0][quantity]=1&metadata[a]=b");
  });
  it("escapes values", () => {
    expect(encodeForm({ q: "a&b=c d" })).toBe("q=a%26b%3Dc%20d");
  });
});

describe("safeReturnTo", () => {
  it("keeps paths inside this site", () => {
    expect(safeReturnTo("/editor/new?template=floral-wedding")).toBe("/editor/new?template=floral-wedding");
    expect(safeReturnTo("/templates")).toBe("/templates");
  });
  it("drops anything that could leave the site or is malformed", () => {
    for (const bad of ["https://evil.example", "//evil.example", "/\\evil.example", "javascript:alert(1)", "templates", "", 5, undefined, "/a\nb", "/" + "x".repeat(400)]) {
      expect(safeReturnTo(bad)).toBeUndefined();
    }
  });
});

describe("buildCheckoutParams", () => {
  const params = buildCheckoutParams({ priceId: "price_123", siteUrl: "https://app.example.com/", userId: "11111111-1111-4111-8111-111111111111", email: "a@b.co", returnTo: "/editor/new?template=floral-wedding" });

  it("is a one-time payment for the configured price, bound to the user", () => {
    expect(params).toMatchObject({
      mode: "payment",
      line_items: [{ price: "price_123", quantity: 1 }],
      client_reference_id: "11111111-1111-4111-8111-111111111111",
      customer_email: "a@b.co",
      customer_creation: "always",
      metadata: { product: "premium", user_id: "11111111-1111-4111-8111-111111111111" },
    });
  });

  it("returns to this site's success and cancel pages, keeping the placeholder Stripe fills in", () => {
    expect(params.success_url).toBe("https://app.example.com/premium/success?session_id={CHECKOUT_SESSION_ID}&return_to=%2Feditor%2Fnew%3Ftemplate%3Dfloral-wedding");
    expect(params.cancel_url).toBe("https://app.example.com/premium/cancelled?return_to=%2Feditor%2Fnew%3Ftemplate%3Dfloral-wedding");
  });

  it("has no subscription, coupon or tax settings", () => {
    const keys = Object.keys(params).join(",");
    expect(keys).not.toMatch(/subscription|promotion|discount|tax|invoice/);
  });

  it("works without a return path", () => {
    const bare = buildCheckoutParams({ priceId: "p", siteUrl: "https://a.b", userId: "u" });
    expect(bare.success_url).toBe("https://a.b/premium/success?session_id={CHECKOUT_SESSION_ID}");
    expect(bare.cancel_url).toBe("https://a.b/premium/cancelled");
  });
});
