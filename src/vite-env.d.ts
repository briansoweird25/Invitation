/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string;
  /** Optional text for the Unlock button, such as "$19". The real price is set in Stripe. */
  readonly VITE_PREMIUM_PRICE_LABEL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
