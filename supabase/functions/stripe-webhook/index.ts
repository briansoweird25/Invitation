// Receives events from Stripe. The only way a payment becomes Premium access besides a direct session lookup.
// Every request must carry a valid Stripe signature over the exact body; anything else is rejected.
import { env } from "../_shared/http.ts";
import { applyStripeEvent } from "../_shared/purchases.ts";
import { verifyStripeSignature, type StripeEvent } from "../_shared/stripe.ts";
import { serviceClient, supabasePurchaseStore } from "../_shared/supabaseStore.ts";

Deno.serve(async (request) => {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });

  // The signature covers the raw bytes, so read the body as text before anything parses it.
  const rawBody = await request.text();
  const valid = await verifyStripeSignature(rawBody, request.headers.get("stripe-signature"), env("STRIPE_WEBHOOK_SECRET"));
  if (!valid) return new Response("Invalid signature", { status: 400 });

  let event: StripeEvent;
  try {
    event = JSON.parse(rawBody) as StripeEvent;
  } catch {
    return new Response("Invalid payload", { status: 400 });
  }

  try {
    const outcome = await applyStripeEvent(supabasePurchaseStore(serviceClient()), event);
    return new Response(JSON.stringify({ received: true, outcome }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (e) {
    // A failure here makes Stripe retry the event later, which is what we want.
    console.error("[stripe-webhook]", event.type, e);
    return new Response("Processing error", { status: 500 });
  }
});
