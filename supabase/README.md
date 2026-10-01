# Supabase

Migrations in `migrations/` create the whole backend. They run in filename order.

| File | What it does |
| --- | --- |
| `20260101000000_initial_schema.sql` | `profiles`, `templates`, `invitations`, `rsvps`, triggers and Row Level Security |
| `20260101000100_storage.sql` | the public `invitation-assets` bucket and its upload policies |
| `20260101000200_seed_templates.sql` | catalogue rows for the four built-in templates (safe to re-run) |

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
