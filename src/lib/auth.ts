import type { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export const AUTH_NOT_CONFIGURED = "Sign-in isn't available right now. Please try again later.";

export type AuthResult = { ok: true; session: Session | null } | { ok: false; message: string };

/** Maps Supabase auth errors to messages that are safe to show. Raw errors are only logged in development. */
function friendlyMessage(error: { code?: string; message: string }): string {
  if (import.meta.env.DEV) console.error("[auth]", error);
  switch (error.code) {
    case "invalid_credentials":
      return "Incorrect email or password.";
    case "email_not_confirmed":
      return "Please confirm your email address first. Check your inbox for the link.";
    case "user_already_exists":
    case "email_exists":
      return "An account with this email already exists. Try logging in instead.";
    case "weak_password":
      return "Choose a stronger password.";
    case "over_request_rate_limit":
    case "over_email_send_rate_limit":
      return "Too many attempts. Please wait a moment and try again.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export async function signInWithEmail(email: string, password: string): Promise<AuthResult> {
  if (!supabase) return { ok: false, message: AUTH_NOT_CONFIGURED };
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return error ? { ok: false, message: friendlyMessage(error) } : { ok: true, session: data.session };
}

/** `session` is null when the project requires email confirmation before sign-in. */
export async function signUpWithEmail(name: string, email: string, password: string): Promise<AuthResult> {
  if (!supabase) return { ok: false, message: AUTH_NOT_CONFIGURED };
  const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });
  return error ? { ok: false, message: friendlyMessage(error) } : { ok: true, session: data.session };
}

export async function signOut(): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error && import.meta.env.DEV) console.error("[auth]", error);
}
