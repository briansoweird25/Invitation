import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(url && publishableKey);

/** The single Supabase client. Null when the environment variables are missing. */
export const supabase = isSupabaseConfigured ? createClient(url!, publishableKey!) : null;
