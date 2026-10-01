-- Catalogue rows for the templates that ship with the app. Safe to re-run.

insert into public.templates (name, slug, category, is_premium)
values
  ('Elegant Wedding', 'elegant-wedding', 'wedding', false),
  ('Floral Wedding', 'floral-wedding', 'wedding', true),
  ('Minimal Wedding', 'minimal-wedding', 'wedding', false),
  ('Modern Birthday', 'modern-birthday', 'birthday', false)
on conflict (slug) do update
  set name = excluded.name,
      category = excluded.category,
      is_premium = excluded.is_premium;
