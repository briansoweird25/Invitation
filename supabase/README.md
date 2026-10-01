# Supabase

Migrations in `migrations/` create the whole backend. They run in filename order.

| File | What it does |
| --- | --- |
| `20260101000000_initial_schema.sql` | `profiles`, `templates`, `invitations`, `rsvps`, triggers and Row Level Security |
| `20260101000100_storage.sql` | the public `invitation-assets` bucket and its upload policies |
| `20260101000200_seed_templates.sql` | catalogue rows for the four built-in templates (safe to re-run) |
| `20260101000300_rsvp_limits.sql` | the database enforces the RSVP deadline and maximum guests per reply |
| `20260101000400_premium_purchases.sql` | `purchases`, and the trigger that enforces Premium templates and Looks |
| `*_templates_mirror_*.sql` | generated: mirrors the catalog's Free/Premium facts (`npm run templates:sql -- <name>`) |

## Apply them

Either paste each file, in order, into the dashboard's **SQL Editor** and run it, or use the CLI:

```bash
npx supabase login
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

## Security model

- Every table has RLS on. Clients get only the grants they need.
- `invitations`: owners can read, create, update and delete their own rows. Anyone can read rows with `status = 'published'`.
- `rsvps`: anyone can insert a reply to a published invitation with RSVPs enabled. Only the invitation owner can read or delete replies.
- `profiles`: users can read and update their own row. Rows are created by a trigger on `auth.users`.
- `templates`: read-only for clients.
- Storage: files live in `invitation-assets/<user id>/...`. Only that user can write there. The bucket is public for reads so published invitations can show their images.
- The app only ever uses the publishable key. Never use the secret or service-role key in client code.

## Premium and Stripe

- `purchases`: read-only for the owner (RLS). Written only by the Edge Functions with the service-role key, after Stripe confirms payment. A client cannot insert, update or delete a purchase.
- A trigger on `invitations` refuses (HTTP 402, SQLSTATE `PT402`) creating an invitation with a Premium template or Look, or switching to one, unless the account has a paid purchase. Existing invitations are never locked.
- Edge Functions live in `functions/`: `create-checkout-session`, `confirm-checkout-session` (signed-in users) and `stripe-webhook` (Stripe, verified by signature; `config.toml` turns the platform JWT check off for it). Shared, framework-free logic is in `functions/_shared/` and is covered by unit tests.
- Secrets (function environment only): `STRIPE_SECRET_KEY`, `STRIPE_PREMIUM_PRICE_ID`, `STRIPE_WEBHOOK_SECRET`, `SITE_URL`, optional `ALLOWED_ORIGINS`. Full setup is in the repository `README.md` ("Premium setup").
- The migrations are tested against a real Postgres in process (PGlite) in `tests/premium.test.ts`: RLS on purchases, the access trigger, forged writes, and the catalog mirror. That checks the SQL, not your hosted project: apply the migrations to a staging project and try a Stripe test-mode payment before going live.
