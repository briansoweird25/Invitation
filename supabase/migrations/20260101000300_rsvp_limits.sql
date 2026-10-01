-- RSVP limits enforced by the database, not only by the form.
--
-- A reply is accepted only while the reply-by date has not passed (with one day of grace for time zones)
-- and only up to the host's "maximum guests per reply" (50 when unset). Settings that are missing or not
-- in the expected shape mean "no limit" rather than blocking every reply.
--
-- This replaces the insert policy from the initial schema. It has not been run against a live database
-- from the development sandbox: apply it to a staging project and send a test reply first.

drop policy "Guests can reply to published invitations that accept RSVPs" on public.rsvps;

create policy "Guests can reply to published invitations that accept RSVPs"
  on public.rsvps for insert to anon, authenticated
  with check (
    exists (
      select 1
      from public.invitations i
      where i.id = invitation_id
        and i.status = 'published'
        and coalesce((i.rsvp_settings ->> 'enabled')::boolean, false)
        and case
              when i.rsvp_settings ->> 'deadline' ~ '^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$'
                then (i.rsvp_settings ->> 'deadline')::date >= current_date - 1
              else true
            end
        and guest_count <= case
              when i.rsvp_settings ->> 'maxGuests' ~ '^\d{1,2}$'
                then greatest(1, least(50, (i.rsvp_settings ->> 'maxGuests')::int))
              else 50
            end
    )
  );
