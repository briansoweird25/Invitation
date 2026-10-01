import type { BrowserContext, Page } from "@playwright/test";

/**
 * An in-memory stand-in for the parts of Supabase the app uses: auth, the invitations table and storage.
 * The tests run against it because the real project needs credentials and network access.
 */
export const SUPABASE_URL = "https://test.supabase.co";
export const USER_ID = "11111111-1111-4111-8111-111111111111";
export const OTHER_USER_ID = "22222222-2222-4222-8222-222222222222";

type Row = Record<string, any>;

const b64 = (o: unknown) => Buffer.from(JSON.stringify(o)).toString("base64url");
const jwt = () =>
  `${b64({ alg: "HS256", typ: "JWT" })}.${b64({ sub: USER_ID, exp: Math.floor(Date.now() / 1000) + 3600, aud: "authenticated", role: "authenticated" })}.sig`;
const user = { id: USER_ID, aud: "authenticated", role: "authenticated", email: "ava@example.com", user_metadata: { name: "Ava" }, app_metadata: {}, created_at: "2026-01-01T00:00:00Z" };
const session = () => ({ access_token: jwt(), token_type: "bearer", expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600, refresh_token: "r", user });

export const defaultDesign = (extra: Record<string, unknown> = {}) => ({
  headingFont: "Cormorant Garamond",
  bodyFont: "Inter",
  backgroundColor: "#F6F1E8",
  textColor: "#3A3128",
  accentColor: "#8A7352",
  ...extra,
});

export function seedRow(id: string, title: string, hostNames: string, extra: Row = {}): Row {
  return {
    id,
    user_id: USER_ID,
    template_id: "elegant-wedding",
    category: "wedding",
    title,
    slug: null,
    content: { eventTitle: "Together", hostNames, date: "2026-06-14", time: "16:00", venue: "Hall", address: "", message: "Hi" },
    design: defaultDesign(),
    rsvp_settings: { enabled: false },
    status: "draft",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-02-01T00:00:00Z",
    ...extra,
  };
}

export interface MockSupabase {
  db: Map<string, Row>;
  log: { removed: string[]; uploads: string[] };
  /** Guest replies, in insertion order. */
  rsvps: Row[];
  failNext: { patch: boolean; list: boolean; rsvpSubmit: boolean };
}

const get = (r: Row, col: string) => (col.includes("->>") ? r[col.split("->>")[0]]?.[col.split("->>")[1]] : r[col]);
const matches = (r: Row, params: URLSearchParams) =>
  [...params.entries()].every(([k, v]) => {
    if (["select", "order", "limit"].includes(k)) return true;
    if (v.startsWith("eq.")) return String(get(r, k)) === v.slice(3);
    if (v.startsWith("neq.")) return String(get(r, k)) !== v.slice(4);
    return true;
  });

/** Routes every request to the fake Supabase host into the in-memory database. */
export async function installMockSupabase(context: BrowserContext): Promise<MockSupabase> {
  const mock: MockSupabase = { db: new Map(), log: { removed: [], uploads: [] }, rsvps: [], failNext: { patch: false, list: false, rsvpSubmit: false } };
  const CORS = { "access-control-allow-origin": "*", "access-control-allow-headers": "*", "access-control-allow-methods": "*", "access-control-expose-headers": "*" };

  await context.route(`${SUPABASE_URL}/**`, async (route) => {
    const req = route.request();
    const url = new URL(req.url());
    const method = req.method();
    const json = (status: number, body: unknown) => route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body), headers: CORS });
    const noContent = () => route.fulfill({ status: 204, headers: CORS });
    if (method === "OPTIONS") return noContent();

    if (url.pathname.includes("/auth/v1/token")) return json(200, session());
    if (url.pathname.includes("/auth/v1/logout")) return noContent();
    if (url.pathname === "/storage/v1/object/invitation-assets" && method === "DELETE") {
      mock.log.removed.push(...JSON.parse(req.postData() ?? "{}").prefixes);
      return json(200, []);
    }
    if (url.pathname.startsWith("/storage/v1/object/invitation-assets/") && method === "POST") {
      mock.log.uploads.push(url.pathname);
      return json(200, { Key: url.pathname });
    }

    if (url.pathname.startsWith("/rest/v1/rsvps")) {
      // Mirrors the row level security policies: replies are write-only for guests and readable by the owner.
      const authed = /\.sig$/.test(req.headers()["authorization"] ?? "");
      if (method === "POST") {
        if (mock.failNext.rsvpSubmit) return json(500, { message: "boom" });
        const body = JSON.parse(req.postData() ?? "{}");
        const inv = mock.db.get(body.invitation_id);
        const settings = inv?.rsvp_settings ?? {};
        const today = new Date().toISOString().slice(0, 10);
        const open = inv?.status === "published" && settings.enabled === true && (!settings.deadline || settings.deadline >= today) && body.guest_count <= (settings.maxGuests ?? 50);
        if (!open) return json(403, { code: "42501", message: "new row violates row-level security policy" });
        mock.rsvps.push({ id: crypto.randomUUID(), created_at: new Date(Date.now() + mock.rsvps.length).toISOString(), ...body });
        return route.fulfill({ status: 201, headers: CORS });
      }
      if (method === "GET") {
        const visible = authed ? mock.rsvps.filter((r) => mock.db.get(r.invitation_id)?.user_id === USER_ID && matches(r, url.searchParams)) : [];
        return json(200, visible.sort((a, b) => b.created_at.localeCompare(a.created_at)));
      }
    }

    if (url.pathname.startsWith("/rest/v1/invitations")) {
      const wantsObject = (req.headers()["accept"] ?? "").includes("pgrst.object");
      const rows = [...mock.db.values()].filter((r) => matches(r, url.searchParams));
      if (method === "GET") {
        if (mock.failNext.list) return json(500, { message: "boom" });
        const sorted = rows.sort((a, b) => b.updated_at.localeCompare(a.updated_at));
        if (wantsObject) return sorted.length ? json(200, sorted[0]) : json(406, {});
        return json(200, url.searchParams.get("select") === "id" ? sorted.map((r) => ({ id: r.id })) : sorted);
      }
      if (method === "POST") {
        const body = JSON.parse(req.postData() ?? "{}");
        const row = { id: crypto.randomUUID(), slug: null, status: "draft", created_at: new Date().toISOString(), updated_at: new Date().toISOString(), ...body };
        mock.db.set(row.id, row);
        return json(201, row);
      }
      if (method === "PATCH") {
        if (mock.failNext.patch) return json(500, { message: "boom" });
        const target = rows[0];
        if (!target) return json(404, {});
        const body = JSON.parse(req.postData() ?? "{}");
        if (body.slug && [...mock.db.values()].some((r) => r.id !== target.id && r.slug === body.slug)) return json(409, { code: "23505", message: "duplicate key" });
        Object.assign(target, body, { updated_at: new Date().toISOString() });
        return (req.headers()["prefer"] ?? "").includes("return=representation") ? json(200, wantsObject ? target : [target]) : noContent();
      }
      if (method === "DELETE") {
        rows.forEach((r) => mock.db.delete(r.id));
        return noContent();
      }
    }
    return json(404, { message: `unmocked ${url.pathname}` });
  });
  return mock;
}

/** Signs in through the real login form (the mocked auth endpoint accepts any credentials). */
export async function login(page: Page) {
  await page.goto("/login");
  await page.fill("#login-email", "ava@example.com");
  await page.fill("#login-password", "password-123");
  await page.click("button[type=submit]");
  await page.waitForSelector("h1:has-text('Welcome back, Ava')");
}

/** Collects console errors and uncaught exceptions so a test can assert there were none. */
export function trackErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && !/status of (4\d\d|5\d\d)/.test(m.text()) && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  return errors;
}
