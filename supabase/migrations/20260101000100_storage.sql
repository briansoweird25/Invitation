-- Storage for images users add to their invitations.
-- The bucket is public so published invitations can show their images without signing URLs.
-- Only the owner can add, replace or remove files, and only inside a folder named after their user id:
--   invitation-assets/<user id>/<file>

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'invitation-assets',
  'invitation-assets',
  true,
  5242880, -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy "Users can upload to their own folder"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'invitation-assets'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Users can see their own files"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'invitation-assets'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Users can replace their own files"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'invitation-assets'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'invitation-assets'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Users can delete their own files"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'invitation-assets'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
