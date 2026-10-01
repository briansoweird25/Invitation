-- Premium access: one-time purchases, and server-side enforcement.
--
-- Clients can only READ their own purchase rows. Rows are written by two Edge Functions that hold the Stripe and
-- service-role secrets (create-checkout-session, stripe-webhook), after Stripe confirms a payment. Nothing a browser
-- sends can create or change a purchase.
--
-- Premium templates and Looks are enforced by a trigger on invitations, so a modified frontend or a hand-made API
-- request cannot create or switch to them. The Free/Premium facts come from the `templates` table, which mirrors the
-- app's catalog (see the templates_mirror migrations).

-- ---------------------------------------------------------------------------
-- purchases
-- ---------------------------------------------------------------------------

create table public.purchases (
  id                          uuid primary key default gen_random_uuid(),
  user_id                     uuid not null references auth.users (id) on delete cascade,
  product                     text not null default 'premium' check (product in ('premium')),
  -- pending: checkout started. paid: Stripe confirmed payment. expired / failed: it never completed.
  status                      text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'expired')),
  stripe_checkout_session_id  text not null unique,
  stripe_payment_intent_id    text,
  stripe_customer_id          text,
  amount_total                integer check (amount_total is null or amount_total >= 0),
  currency                    text check (currency is null or char_length(currency) = 3),
  created_at                  timestamptz not null default now(),
  paid_at                     timestamptz,
  updated_at                  timestamptz not null default now(),
  constraint paid_purchases_have_a_date check (status <> 'paid' or paid_at is not null)
);

create index purchases_user_id_status_idx on public.purchases (user_id, status);

create trigger purchases_set_updated_at
  before update on public.purchases
  for each row execute function public.set_updated_at();

alter table public.purchases enable row level security;

-- The only client policy: read your own rows. There are no insert, update or delete policies.
create policy "Users can read their own purchases"
  on public.purchases for select to authenticated
  using ((select auth.uid()) = user_id);

revoke all on public.purchases from anon, authenticated;
grant select on public.purchases to authenticated;

-- ---------------------------------------------------------------------------
-- Access check and enforcement
-- ---------------------------------------------------------------------------

-- Whether a user has a confirmed Premium purchase. Internal: clients cannot call it.
create or replace function public.user_has_premium(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.purchases p
    where p.user_id = uid and p.product = 'premium' and p.status = 'paid'
  );
$$;

revoke all on function public.user_has_premium(uuid) from public, anon, authenticated;

-- Blocks creating an invitation with a Premium template or Look, and choosing one, without Premium access.
--
-- Existing invitations are never locked: an update that keeps the same template and Look always passes, and an
-- invitation that already uses a premium template may switch between that template's Looks. Only starting a
-- premium template, switching to one, or newly choosing a premium Look on a free template needs access.
-- Unknown templates are not blocked, because the server cannot know what they are.
-- The error is SQLSTATE PT402, which the API returns as HTTP 402.
create or replace function public.enforce_premium_access()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  tpl_premium boolean;
  tpl_looks jsonb;
  new_look text := new.design ->> 'presetId';
  template_known boolean;
  same_template boolean := false;
  needs_premium boolean := false;
begin
  -- OLD only exists on updates, so it is read inside this block and nowhere else.
  if tg_op = 'UPDATE' then
    same_template := new.template_id is not distinct from old.template_id;
    if same_template and new_look is not distinct from (old.design ->> 'presetId') then
      return new;
    end if;
  end if;

  select true, t.is_premium, coalesce(t.configuration -> 'premiumPresets', '[]'::jsonb)
    into template_known, tpl_premium, tpl_looks
  from public.templates t
  where t.slug = new.template_id;

  if template_known then
    if same_template then
      -- Same template, different Look: only a premium Look on a free template needs access.
      needs_premium := not tpl_premium and new_look is not null and tpl_looks ? new_look;
    else
      needs_premium := tpl_premium or (new_look is not null and tpl_looks ? new_look);
    end if;
  end if;

  if needs_premium and not public.user_has_premium(new.user_id) then
    raise exception 'premium_required' using errcode = 'PT402', hint = 'This template or Look needs Premium access.';
  end if;
  return new;
end;
$$;

revoke all on function public.enforce_premium_access() from public, anon, authenticated;

create trigger invitations_enforce_premium_access
  before insert or update on public.invitations
  for each row execute function public.enforce_premium_access();
