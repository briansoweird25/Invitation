import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url && anonKey);

/** The single Supabase client. Null when the environment variables are missing. */
export const supabase = isSupabaseConfigured ? createClient(url!, anonKey!) : null;
