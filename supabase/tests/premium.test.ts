import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { allTemplates } from "../../src/components/invitation/templateCatalog";
import { ALICE, as, BOB, createDatabase, failure, type Db } from "./db";

let db: Db;
beforeAll(async () => {
  db = await createDatabase();
}, 60_000);
afterAll(() => db.close());

beforeEach(async () => {
  await db.exec("delete from public.rsvps; delete from public.invitations; delete from public.purchases;");
});

const FREE = "elegant-wedding";
const PREMIUM = "floral-wedding";
const PREMIUM_LOOK = "midnight-foil"; // a premium Look on the free elegant-wedding template
const FREE_LOOK = "ivory-gold";

async function insertInvitation(userId: string, template: string, presetId?: string, extra: { status?: string; slug?: string } = {}) {
  const design = JSON.stringify(presetId ? { presetId } : {});
  return db.query(
    `insert into public.invitations (user_id, template_id, category, design, status, slug) values ($1, $2, 'wedding', $3::jsonb, $4, $5) returning id`,
    [userId, template, design, extra.status ?? "draft", extra.slug ?? null],
  );
}

/** Inserts as the database owner, which skips Row Level Security and the access check: a row that existed before payments. */
async function seedExisting(userId: string, template: string, presetId?: string) {
  await db.exec("alter table public.invitations disable trigger invitations_enforce_premium_access");
  const { rows } = await insertInvitation(userId, template, presetId);
  await db.exec("alter table public.invitations enable trigger invitations_enforce_premium_access");
  return (rows[0] as { id: string }).id;
}

async function pay(userId: string, status = "paid") {
  await db.query(
    `insert into public.purchases (user_id, status, stripe_checkout_session_id, paid_at) values ($1, $2, $3, case when $2 = 'paid' then now() end)`,
    [userId, status, `cs_${Math.random().toString(36).slice(2)}`],
  );
}

const asUser = <T>(userId: string, fn: () => Promise<T>) => as(db, "authenticated", userId, fn);

describe("the templates mirror matches the catalog", () => {
  it("has a row for every template with the same Free/Premium flag and premium Looks", async () => {
    const { rows } = await db.query<{ slug: string; is_premium: boolean; configuration: { premiumPresets: string[] } }>("select slug, is_premium, configuration from public.templates");
    const bySlug = new Map(rows.map((r) => [r.slug, r]));
    for (const t of allTemplates()) {
      const row = bySlug.get(t.id);
      expect(row, `${t.id} is missing from the mirror`).toBeDefined();
      expect(row!.is_premium, `${t.id} premium flag`).toBe(t.tier === "premium");
      expect(row!.configuration.premiumPresets, `${t.id} premium Looks`).toEqual(t.presets.filter((p) => p.tier === "premium").map((p) => p.id));
    }
  });
});

describe("creating invitations", () => {
  it("lets anyone use free templates and free Looks", async () => {
    expect(await failure(asUser(ALICE, () => insertInvitation(ALICE, FREE)))).toBeNull();
    expect(await failure(asUser(ALICE, () => insertInvitation(ALICE, FREE, FREE_LOOK)))).toBeNull();
  });

  it("blocks a premium template without a purchase, with HTTP 402 semantics", async () => {
    const err = await failure(asUser(ALICE, () => insertInvitation(ALICE, PREMIUM)));
    expect(err).toMatchObject({ code: "PT402", message: "premium_required" });
  });

  it("blocks a premium Look on a free template without a purchase", async () => {
    expect(await failure(asUser(ALICE, () => insertInvitation(ALICE, FREE, PREMIUM_LOOK)))).toMatchObject({ code: "PT402" });
  });

  it("does not accept a pending, failed or expired purchase", async () => {
    for (const status of ["pending", "failed", "expired"]) {
      await db.exec("delete from public.purchases");
      await pay(ALICE, status);
      expect(await failure(asUser(ALICE, () => insertInvitation(ALICE, PREMIUM))), status).toMatchObject({ code: "PT402" });
    }
  });

  it("allows premium templates and Looks after a paid purchase", async () => {
    await pay(ALICE);
    expect(await failure(asUser(ALICE, () => insertInvitation(ALICE, PREMIUM)))).toBeNull();
    expect(await failure(asUser(ALICE, () => insertInvitation(ALICE, FREE, PREMIUM_LOOK)))).toBeNull();
  });

  it("does not let one user's purchase unlock another user", async () => {
    await pay(ALICE);
    expect(await failure(asUser(BOB, () => insertInvitation(BOB, PREMIUM)))).toMatchObject({ code: "PT402" });
  });

  it("does not block templates the server does not know", async () => {
    expect(await failure(asUser(ALICE, () => insertInvitation(ALICE, "some-future-template")))).toBeNull();
  });

  it("cannot be bypassed by sending the premium template under another user's id", async () => {
    await pay(BOB);
    // Row Level Security rejects the foreign user_id before the access check matters.
    expect(await failure(asUser(ALICE, () => insertInvitation(BOB, PREMIUM)))).toMatchObject({ code: "42501" });
  });
});

describe("existing invitations are never locked", () => {
  it("lets an owner without access keep editing, publishing and unpublishing a premium invitation", async () => {
    const id = await seedExisting(ALICE, PREMIUM, "gold");
    const edit = (sql: string, params: unknown[] = []) => failure(asUser(ALICE, () => db.query(sql, params)));
    expect(await edit("update public.invitations set title = 'New title' where id = $1", [id])).toBeNull();
    expect(await edit(`update public.invitations set content = '{"hostNames":"Ava"}'::jsonb where id = $1`, [id])).toBeNull();
    expect(await edit(`update public.invitations set status = 'published', slug = 'ava-and-noah' where id = $1`, [id])).toBeNull();
    expect(await edit(`update public.invitations set status = 'draft' where id = $1`, [id])).toBeNull();
  });

  it("lets such an owner switch between that premium template's Looks", async () => {
    const id = await seedExisting(ALICE, PREMIUM, "gold");
    expect(await failure(asUser(ALICE, () => db.query(`update public.invitations set design = '{"presetId":"other"}'::jsonb where id = $1`, [id])))).toBeNull();
  });

  it("keeps a premium Look on a free template editable while the Look stays the same", async () => {
    const id = await seedExisting(ALICE, FREE, PREMIUM_LOOK);
    expect(await failure(asUser(ALICE, () => db.query(`update public.invitations set title = 'Still mine', design = '{"presetId":"${PREMIUM_LOOK}","accentColor":"#000"}'::jsonb where id = $1`, [id])))).toBeNull();
  });

  it("blocks switching an existing free invitation to a premium template or Look", async () => {
    const id = await seedExisting(ALICE, FREE, FREE_LOOK);
    expect(await failure(asUser(ALICE, () => db.query(`update public.invitations set template_id = $2 where id = $1`, [id, PREMIUM])))).toMatchObject({ code: "PT402" });
    expect(await failure(asUser(ALICE, () => db.query(`update public.invitations set design = '{"presetId":"${PREMIUM_LOOK}"}'::jsonb where id = $1`, [id])))).toMatchObject({ code: "PT402" });
  });

  it("allows those switches after a purchase", async () => {
    const id = await seedExisting(ALICE, FREE, FREE_LOOK);
    await pay(ALICE);
    expect(await failure(asUser(ALICE, () => db.query(`update public.invitations set design = '{"presetId":"${PREMIUM_LOOK}"}'::jsonb where id = $1`, [id])))).toBeNull();
    expect(await failure(asUser(ALICE, () => db.query(`update public.invitations set template_id = $2 where id = $1`, [id, PREMIUM])))).toBeNull();
  });

  it("keeps published premium invitations readable by anyone", async () => {
    await db.exec("alter table public.invitations disable trigger invitations_enforce_premium_access");
    await insertInvitation(ALICE, PREMIUM, undefined, { status: "published", slug: "premium-and-public" });
    await db.exec("alter table public.invitations enable trigger invitations_enforce_premium_access");
    const { rows } = await as(db, "anon", null, () => db.query("select slug from public.invitations where status = 'published'"));
    expect(rows).toEqual([{ slug: "premium-and-public" }]);
  });
});

describe("the purchases table", () => {
  it("shows a user only their own purchases", async () => {
    await pay(ALICE);
    await pay(BOB, "pending");
    const alice = await asUser(ALICE, () => db.query<{ user_id: string }>("select user_id from public.purchases"));
    expect(alice.rows.map((r) => r.user_id)).toEqual([ALICE]);
    const bob = await asUser(BOB, () => db.query<{ status: string }>("select status from public.purchases"));
    expect(bob.rows.map((r) => r.status)).toEqual(["pending"]);
  });

  it("shows nothing and allows nothing to signed-out visitors", async () => {
    await pay(ALICE);
    expect(await failure(as(db, "anon", null, () => db.query("select * from public.purchases")))).toMatchObject({ code: "42501" });
  });

  it("cannot be written by a client: no insert, update or delete", async () => {
    await pay(ALICE, "pending");
    const grant = () => asUser(ALICE, () => db.query(`insert into public.purchases (user_id, status, stripe_checkout_session_id, paid_at) values ('${ALICE}', 'paid', 'cs_forged', now())`));
    expect(await failure(grant())).toMatchObject({ code: "42501" });
    expect(await failure(asUser(ALICE, () => db.query(`update public.purchases set status = 'paid', paid_at = now() where user_id = '${ALICE}'`)))).toMatchObject({ code: "42501" });
    expect(await failure(asUser(ALICE, () => db.query(`delete from public.purchases where user_id = '${ALICE}'`)))).toMatchObject({ code: "42501" });
    // And so the premium check still says no.
    expect(await failure(asUser(ALICE, () => insertInvitation(ALICE, PREMIUM)))).toMatchObject({ code: "PT402" });
  });

  it("cannot be forged by an anonymous insert either", async () => {
    expect(await failure(as(db, "anon", null, () => db.query(`insert into public.purchases (user_id, status, stripe_checkout_session_id, paid_at) values ('${ALICE}', 'paid', 'cs_forged', now())`)))).toMatchObject({ code: "42501" });
  });

  it("can be written by the service role, which is what the Edge Functions use", async () => {
    const result = await failure(as(db, "service_role", null, () => db.query(`insert into public.purchases (user_id, status, stripe_checkout_session_id, paid_at) values ('${ALICE}', 'paid', 'cs_real', now())`)));
    expect(result).toBeNull();
    expect(await failure(asUser(ALICE, () => insertInvitation(ALICE, PREMIUM)))).toBeNull();
  });

  it("refuses a second row for the same Stripe session, so a webhook retry cannot duplicate a purchase", async () => {
    await db.exec(`insert into public.purchases (user_id, status, stripe_checkout_session_id, paid_at) values ('${ALICE}', 'paid', 'cs_same', now())`);
    expect(await failure(db.exec(`insert into public.purchases (user_id, status, stripe_checkout_session_id, paid_at) values ('${ALICE}', 'paid', 'cs_same', now())`))).toMatchObject({ code: "23505" });
  });

  it("will not mark a purchase paid without a payment date", async () => {
    expect(await failure(db.exec(`insert into public.purchases (user_id, status, stripe_checkout_session_id) values ('${ALICE}', 'paid', 'cs_nodate')`))).toMatchObject({ code: "23514" });
  });

  it("cannot call the internal access functions", async () => {
    expect(await failure(asUser(ALICE, () => db.query(`select public.user_has_premium('${ALICE}')`)))).toMatchObject({ code: "42501" });
  });

  it("keeps the template catalog read-only for clients", async () => {
    expect(await failure(asUser(ALICE, () => db.query(`update public.templates set is_premium = false where slug = '${PREMIUM}'`)))).toMatchObject({ code: "42501" });
  });
});

describe("other tables still follow their rules", () => {
  it("lets an owner read and change only their own invitations", async () => {
    const id = await seedExisting(ALICE, FREE);
    expect((await asUser(BOB, () => db.query("select id from public.invitations where id = $1", [id]))).rows).toEqual([]);
    const updated = await asUser(BOB, () => db.query("update public.invitations set title = 'hijack' where id = $1 returning id", [id]));
    expect(updated.rows).toEqual([]);
  });

  it("still lets guests reply to a published invitation that has RSVPs on, and nobody but the owner read replies", async () => {
    await db.exec("alter table public.invitations disable trigger invitations_enforce_premium_access");
    const { rows } = await db.query<{ id: string }>(
      `insert into public.invitations (user_id, template_id, category, status, slug, rsvp_settings) values ('${ALICE}', '${FREE}', 'wedding', 'published', 'rsvp-on', '{"enabled": true}'::jsonb) returning id`,
    );
    await db.exec("alter table public.invitations enable trigger invitations_enforce_premium_access");
    const id = rows[0].id;
    expect(await failure(as(db, "anon", null, () => db.query(`insert into public.rsvps (invitation_id, guest_name, attendance) values ($1, 'Guest', 'attending')`, [id])))).toBeNull();
    expect((await asUser(ALICE, () => db.query("select guest_name from public.rsvps"))).rows).toEqual([{ guest_name: "Guest" }]);
    expect((await asUser(BOB, () => db.query("select guest_name from public.rsvps"))).rows).toEqual([]);
  });
});
