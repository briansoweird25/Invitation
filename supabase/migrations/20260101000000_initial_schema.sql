-- Invitation Generator: core schema.
-- Tables: profiles, templates, invitations, rsvps. Row Level Security is enabled on all of them.

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles: one row per auth user
-- ---------------------------------------------------------------------------

create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text,
  name        text,
  avatar_url  text,
  created_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read their own profile"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

create policy "Users can update their own profile"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Rows are created by the trigger below, never by clients.
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (name, avatar_url) on public.profiles to authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, nullif(trim(new.raw_user_meta_data ->> 'name'), ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Accounts created before this migration.
insert into public.profiles (id, email, name)
select id, email, nullif(trim(raw_user_meta_data ->> 'name'), '')
from auth.users
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- templates: catalogue metadata. The renderer components live in the app, so
-- a new template never needs a schema change. Clients can only read it.
-- ---------------------------------------------------------------------------

create table public.templates (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  slug           text not null unique,
  category       text not null,
  thumbnail_url  text,
  preview_url    text,
  is_premium     boolean not null default false,
  configuration  jsonb not null default '{}'::jsonb,
  created_at     timestamptz not null default now()
);

alter table public.templates enable row level security;

create policy "Templates are readable by everyone"
  on public.templates for select to anon, authenticated
  using (true);

revoke all on public.templates from anon, authenticated;
grant select on public.templates to anon, authenticated;

-- ---------------------------------------------------------------------------
-- invitations: the source of truth for an invitation (content, design, RSVP settings)
-- ---------------------------------------------------------------------------

create table public.invitations (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users (id) on delete cascade,
  -- Matches an id in the app's template registry (for example "elegant-wedding").
  template_id    text not null check (char_length(template_id) between 1 and 60),
  category       text not null check (char_length(category) between 1 and 40),
  title          text not null default 'Untitled invitation' check (char_length(title) between 1 and 120),
  -- Set when the invitation is published. Lowercase words separated by single hyphens.
  slug           text unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) between 3 and 60),
  content        jsonb not null default '{}'::jsonb check (octet_length(content::text) <= 20000),
  design         jsonb not null default '{}'::jsonb check (octet_length(design::text) <= 20000),
  rsvp_settings  jsonb not null default '{"enabled": false}'::jsonb check (octet_length(rsvp_settings::text) <= 20000),
  status         text not null default 'draft' check (status in ('draft', 'published')),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint published_invitations_have_a_slug check (status = 'draft' or slug is not null)
);

create index invitations_user_id_updated_at_idx on public.invitations (user_id, updated_at desc);

create trigger invitations_set_updated_at
  before update on public.invitations
  for each row execute function public.set_updated_at();

alter table public.invitations enable row level security;

-- Owners have full access to their own invitations, drafts included.
create policy "Owners can read their invitations"
  on public.invitations for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Owners can create invitations"
  on public.invitations for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Owners can update their invitations"
  on public.invitations for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Owners can delete their invitations"
  on public.invitations for delete to authenticated
  using ((select auth.uid()) = user_id);

-- Anyone can read a published invitation. Drafts are never visible to others.
-- The public invitation page and RSVP form (later phases) rely on this policy.
create policy "Published invitations are public"
  on public.invitations for select to anon, authenticated
  using (status = 'published');

revoke all on public.invitations from anon, authenticated;
grant select on public.invitations to anon;
grant select, insert, update, delete on public.invitations to authenticated;

-- ---------------------------------------------------------------------------
-- rsvps: guest replies. Anyone may reply to a published invitation that has
-- RSVPs switched on. Only the invitation owner can read replies.
-- ---------------------------------------------------------------------------

create table public.rsvps (
  id             uuid primary key default gen_random_uuid(),
  invitation_id  uuid not null references public.invitations (id) on delete cascade,
  guest_name     text not null check (char_length(guest_name) between 1 and 120),
  guest_email    text check (guest_email is null or char_length(guest_email) <= 254),
  attendance     text not null check (attendance in ('attending', 'declined')),
  guest_count    integer not null default 1 check (guest_count between 1 and 50),
  message        text check (message is null or char_length(message) <= 1000),
  created_at     timestamptz not null default now()
);

create index rsvps_invitation_id_created_at_idx on public.rsvps (invitation_id, created_at desc);

alter table public.rsvps enable row level security;

create policy "Guests can reply to published invitations that accept RSVPs"
  on public.rsvps for insert to anon, authenticated
  with check (
    exists (
      select 1
      from public.invitations i
      where i.id = invitation_id
        and i.status = 'published'
        and coalesce((i.rsvp_settings ->> 'enabled')::boolean, false)
    )
  );

create policy "Owners can read replies to their invitations"
  on public.rsvps for select to authenticated
  using (
    exists (
      select 1
      from public.invitations i
      where i.id = invitation_id
        and i.user_id = (select auth.uid())
    )
  );

create policy "Owners can delete replies to their invitations"
  on public.rsvps for delete to authenticated
  using (
    exists (
      select 1
      from public.invitations i
      where i.id = invitation_id
        and i.user_id = (select auth.uid())
    )
  );

revoke all on public.rsvps from anon, authenticated;
grant insert on public.rsvps to anon, authenticated;
grant select, delete on public.rsvps to authenticated;
