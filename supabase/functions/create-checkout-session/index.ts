// Starts a Stripe Checkout for the one-time Premium purchase. Called by the signed-in app.
// The request carries no price and no "paid" flag: the price is this function's configuration and the user is
// the one in the verified token.
import { authenticatedUser, corsHeaders, env, json } from "../_shared/http.ts";
import { startCheckout } from "../_shared/purchases.ts";
import { safeReturnTo } from "../_shared/stripe.ts";
import { serviceClient, supabasePurchaseStore } from "../_shared/supabaseStore.ts";

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(request) });
  if (request.method !== "POST") return json(request, 405, { error: "Method not allowed" });

  try {
    const user = await authenticatedUser(request);
    if (!user) return json(request, 401, { error: "Please sign in to continue." });

    const body = await request.json().catch(() => ({}));
    const outcome = await startCheckout(
      supabasePurchaseStore(serviceClient()),
      { secretKey: env("STRIPE_SECRET_KEY"), priceId: env("STRIPE_PREMIUM_PRICE_ID"), siteUrl: env("SITE_URL"), fetch },
      user,
      safeReturnTo((body as { returnTo?: unknown }).returnTo),
    );
    return json(request, 200, outcome);
  } catch (e) {
    console.error("[create-checkout-session]", e);
    return json(request, 500, { error: "We couldn't start checkout. Please try again." });
  }
});
