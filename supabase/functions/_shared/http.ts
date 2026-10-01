import { createClient } from "npm:@supabase/supabase-js@2";

/** Environment for the Stripe functions. Missing values fail loudly with a log line, never with a secret in the response. */
export function env(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing environment variable ${name}`);
  return value;
}

function allowedOrigins(): string[] {
  const configured = Deno.env.get("ALLOWED_ORIGINS");
  const list = configured ? configured.split(",") : [Deno.env.get("SITE_URL") ?? ""];
  return list.map((o) => o.trim().replace(/\/+$/, "")).filter(Boolean);
}

export function corsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("origin") ?? "";
  const allowed = allowedOrigins().includes(origin);
  return {
    "Access-Control-Allow-Origin": allowed ? origin : (allowedOrigins()[0] ?? ""),
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}

export function json(request: Request, status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders(request), "Content-Type": "application/json" } });
}

/** The signed-in user for a request, checked with Supabase Auth. Returns null for a missing or invalid token. */
export async function authenticatedUser(request: Request): Promise<{ id: string; email?: string } | null> {
  const authorization = request.headers.get("authorization") ?? "";
  const token = authorization.replace(/^Bearer\s+/i, "");
  if (!token) return null;
  const client = createClient(env("SUPABASE_URL"), env("SUPABASE_ANON_KEY"), { auth: { persistSession: false } });
  const { data, error } = await client.auth.getUser(token);
  if (error || !data.user) return null;
  return { id: data.user.id, email: data.user.email ?? undefined };
}
