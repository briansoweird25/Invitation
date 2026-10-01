import { PGlite } from "@electric-sql/pglite";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

/**
 * A real Postgres (PGlite, in process) with the project's migrations applied, plus the few Supabase pieces the
 * migrations rely on: the auth schema (users, auth.uid()), the roles, and the default grants. It lets the tests
 * check Row Level Security and the Premium trigger against the actual SQL, not a description of it.
 */

export const ALICE = "11111111-1111-4111-8111-111111111111";
export const BOB = "22222222-2222-4222-8222-222222222222";

const MIGRATIONS = path.resolve(import.meta.dirname, "../migrations");

const SUPABASE_STUBS = `
  create role anon nologin;
  create role authenticated nologin;
  create role service_role nologin bypassrls;
  create schema auth;
  create table auth.users (id uuid primary key, email text, raw_user_meta_data jsonb default '{}'::jsonb);
  create function auth.uid() returns uuid language sql stable as $$
    select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
  $$;
  grant usage on schema auth to anon, authenticated, service_role;
  grant usage on schema public to anon, authenticated, service_role;
  grant execute on function auth.uid() to anon, authenticated, service_role;
  -- Supabase grants new public tables to these roles by default; the migrations then revoke what clients must not have.
  alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
  alter default privileges in schema public grant all on functions to anon, authenticated, service_role;
`;

export async function createDatabase() {
  const db = new PGlite();
  await db.exec(SUPABASE_STUBS);
  // The storage migration needs Supabase's storage schema, which is not part of what is tested here.
  const files = readdirSync(MIGRATIONS).filter((f) => f.endsWith(".sql") && !f.includes("_storage")).sort();
  for (const file of files) await db.exec(readFileSync(path.join(MIGRATIONS, file), "utf8"));
  await db.exec(`insert into auth.users (id, email) values ('${ALICE}', 'alice@example.com'), ('${BOB}', 'bob@example.com');`);
  return db;
}

export type Db = Awaited<ReturnType<typeof createDatabase>>;

type Role = "anon" | "authenticated" | "service_role" | "owner";

/** Runs a callback as a Supabase role, optionally as a signed-in user, then returns to the owner role. */
export async function as<T>(db: Db, role: Role, userId: string | null, fn: () => Promise<T>): Promise<T> {
  if (role !== "owner") await db.exec(`set role ${role}`);
  await db.query(`select set_config('request.jwt.claim.sub', $1, false)`, [userId ?? ""]);
  try {
    return await fn();
  } finally {
    await db.exec("reset role");
    await db.query(`select set_config('request.jwt.claim.sub', '', false)`);
  }
}

/** Resolves to the error's SQLSTATE code and message when the statement fails, or null when it succeeds. */
export async function failure(promise: Promise<unknown>): Promise<{ code: string; message: string } | null> {
  try {
    await promise;
    return null;
  } catch (e) {
    const err = e as { code?: string; message?: string };
    return { code: err.code ?? "", message: err.message ?? "" };
  }
}
