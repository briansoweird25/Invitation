import type { User } from "@supabase/supabase-js";
import { create } from "zustand";
import { supabase } from "@/lib/supabase";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthState {
  status: AuthStatus;
  user: User | null;
}

export const useAuthStore = create<AuthState>(() => ({ status: "loading", user: null }));

const setUser = (user: User | null) =>
  useAuthStore.setState({ user, status: user ? "authenticated" : "unauthenticated" });

/**
 * Restores the persisted session and keeps the store in sync with Supabase
 * (sign in, sign out, token refresh, other tabs). Returns a cleanup function.
 */
export function initAuth(): () => void {
  if (!supabase) {
    setUser(null);
    return () => {};
  }

  void supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
  const { data } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
  return () => data.subscription.unsubscribe();
}

export function displayName(user: User | null): string {
  const name = user?.user_metadata?.name;
  return typeof name === "string" && name.trim() ? name.trim() : (user?.email ?? "");
}
