// Settles a Checkout the user has just returned from: asks Stripe (with the secret key) whether the session is
// paid and records it. The browser only passes the session id; it can never say "paid" itself.
import { authenticatedUser, corsHeaders, env, json } from "../_shared/http.ts";
import { confirmCheckout } from "../_shared/purchases.ts";
import { StripeApiError } from "../_shared/stripe.ts";
import { serviceClient, supabasePurchaseStore } from "../_shared/supabaseStore.ts";

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(request) });
  if (request.method !== "POST") return json(request, 405, { error: "Method not allowed" });

  try {
    const user = await authenticatedUser(request);
    if (!user) return json(request, 401, { error: "Please sign in to continue." });

    const { sessionId } = (await request.json().catch(() => ({}))) as { sessionId?: unknown };
    if (typeof sessionId !== "string") return json(request, 400, { error: "Missing session." });

    const outcome = await confirmCheckout(
      supabasePurchaseStore(serviceClient()),
      { secretKey: env("STRIPE_SECRET_KEY"), priceId: env("STRIPE_PREMIUM_PRICE_ID"), siteUrl: env("SITE_URL"), fetch },
      user.id,
      sessionId,
    );
    return json(request, 200, outcome);
  } catch (e) {
    if (e instanceof StripeApiError && (e.status === 400 || e.status === 403 || e.status === 404)) return json(request, 404, { error: "We couldn't find that checkout." });
    console.error("[confirm-checkout-session]", e);
    return json(request, 500, { error: "We couldn't confirm your purchase. Please try again." });
  }
});
