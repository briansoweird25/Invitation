import { z } from "zod";
import { safeRedirectPath } from "./redirect";
import { supabase } from "./supabase";

/**
 * Premium access from the app's side. The app can only READ whether the signed-in user has a confirmed purchase
 * (Row Level Security returns only their own rows) and ask the server to start or confirm a checkout. It never
 * says "paid": payment is recorded by the server, from Stripe, and enforced by the database.
 */

export const ACCESS_ERROR_MESSAGE = "We couldn't check your Premium access. Please try again.";
export const CHECKOUT_ERROR_MESSAGE = "We couldn't start checkout. Please try again.";
export const CONFIRM_ERROR_MESSAGE = "We couldn't confirm your purchase. Please try again.";

function client() {
  if (!supabase) throw new Error("Supabase is not configured.");
  return supabase;
}

function fail(error: unknown, message: string): never {
  if (import.meta.env.DEV) console.error("[purchases]", error);
  throw new Error(message);
}

/** Whether the signed-in user has a paid Premium purchase. The query is the same one the database rules use. */
export async function fetchPremiumAccess(userId: string): Promise<boolean> {
  const { data, error } = await client().from("purchases").select("id").eq("user_id", userId).eq("product", "premium").eq("status", "paid").limit(1);
  if (error) fail(error, ACCESS_ERROR_MESSAGE);
  return (data?.length ?? 0) > 0;
}

const checkoutSchema = z.discriminatedUnion("status", [
  z.object({ status: z.literal("owned") }),
  z.object({ status: z.literal("checkout"), url: z.url().refine((u) => u.startsWith("https://"), "Checkout must use https") }),
]);

export type CheckoutResult = z.infer<typeof checkoutSchema>;

/** Asks the server for a Stripe Checkout. The only thing sent is where to come back to. */
export async function startPremiumCheckout(returnTo?: string): Promise<CheckoutResult> {
  const { data, error } = await client().functions.invoke("create-checkout-session", { body: { returnTo: returnTo ? safeRedirectPath(returnTo, "") || undefined : undefined } });
  if (error) return fail(error, CHECKOUT_ERROR_MESSAGE);
  const parsed = checkoutSchema.safeParse(data);
  if (!parsed.success) return fail(parsed.error, CHECKOUT_ERROR_MESSAGE);
  return parsed.data;
}

const confirmSchema = z.object({ status: z.enum(["paid", "pending", "expired"]) });
export type ConfirmStatus = z.infer<typeof confirmSchema>["status"];

/** Asks the server to check a returned Checkout Session with Stripe and record it if it is paid. */
export async function confirmPremiumCheckout(sessionId: string): Promise<ConfirmStatus> {
  const { data, error } = await client().functions.invoke("confirm-checkout-session", { body: { sessionId } });
  if (error) return fail(error, CONFIRM_ERROR_MESSAGE);
  const parsed = confirmSchema.safeParse(data);
  if (!parsed.success) return fail(parsed.error, CONFIRM_ERROR_MESSAGE);
  return parsed.data.status;
}
