import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2";
import type { PaidDetails, PurchaseRecord, PurchaseStore } from "./purchases.ts";

/** The service-role client. Only Edge Functions create it; the key never leaves the function's environment. */
export function serviceClient(): SupabaseClient {
  return createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
}

// A Checkout Session stays open for 24 hours; a pending row older than this is not worth reusing.
const REUSE_WINDOW_MS = 23 * 60 * 60 * 1000;

export function supabasePurchaseStore(db: SupabaseClient): PurchaseStore {
  const check = (error: { message: string } | null) => {
    if (error) throw new Error(`purchases: ${error.message}`);
  };

  return {
    async userHasPaid(userId) {
      const { data, error } = await db.from("purchases").select("id").eq("user_id", userId).eq("product", "premium").eq("status", "paid").limit(1);
      check(error);
      return (data?.length ?? 0) > 0;
    },

    async latestPendingSession(userId) {
      const since = new Date(Date.now() - REUSE_WINDOW_MS).toISOString();
      const { data, error } = await db
        .from("purchases")
        .select("stripe_checkout_session_id")
        .eq("user_id", userId)
        .eq("status", "pending")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(1);
      check(error);
      return data?.[0]?.stripe_checkout_session_id ?? null;
    },

    async insertPending(userId, sessionId) {
      const { error } = await db.from("purchases").insert({ user_id: userId, stripe_checkout_session_id: sessionId, status: "pending" });
      check(error);
    },

    async getBySession(sessionId): Promise<PurchaseRecord | null> {
      const { data, error } = await db.from("purchases").select("stripe_checkout_session_id, user_id, status").eq("stripe_checkout_session_id", sessionId).maybeSingle();
      check(error);
      return data ? { sessionId: data.stripe_checkout_session_id, userId: data.user_id, status: data.status } : null;
    },

    async markPaid(d: PaidDetails) {
      const { error } = await db.from("purchases").upsert(
        {
          user_id: d.userId,
          stripe_checkout_session_id: d.sessionId,
          stripe_payment_intent_id: d.paymentIntentId,
          stripe_customer_id: d.customerId,
          amount_total: d.amountTotal,
          currency: d.currency,
          status: "paid",
          paid_at: new Date().toISOString(),
        },
        { onConflict: "stripe_checkout_session_id" },
      );
      check(error);
    },

    async markUnpaid(sessionId, status) {
      const { error } = await db.from("purchases").update({ status }).eq("stripe_checkout_session_id", sessionId).eq("status", "pending");
      check(error);
    },
  };
}
