import { Mail, Phone } from "lucide-react";
import { formatDate } from "@/lib/invitationFormat";
import { isRsvpClosed, maxGuestsFor } from "@/lib/rsvp";
import type { RSVPSettings } from "@/types/invitation";
import { RsvpForm } from "./RsvpForm";

function Contact({ rsvp }: { rsvp: RSVPSettings }) {
  const { contactName, contactEmail, contactPhone } = rsvp;
  if (!contactEmail && !contactPhone) return null;
  return (
    <ul className="space-y-1.5 text-sm">
      {contactEmail && (
        <li>
          <a className="inline-flex items-center gap-2 underline-offset-4 hover:underline" href={`mailto:${contactEmail}`}>
            <Mail className="size-4" aria-hidden="true" /> {contactName ? `${contactName}: ` : ""}
            {contactEmail}
          </a>
        </li>
      )}
      {contactPhone && (
        <li>
          <a className="inline-flex items-center gap-2 underline-offset-4 hover:underline" href={`tel:${contactPhone.replace(/[^\d+]/g, "")}`}>
            <Phone className="size-4" aria-hidden="true" /> {!contactEmail && contactName ? `${contactName}: ` : ""}
            {contactPhone}
          </a>
        </li>
      )}
    </ul>
  );
}

/**
 * The guest's RSVP area on the public page: the reply form while replies are open, a short note once the
 * deadline has passed, and the host's contact details. Renders nothing when the host has not turned RSVPs on.
 */
export function RsvpSection({ invitationId, rsvp, now }: { invitationId: string; rsvp: RSVPSettings; now?: Date }) {
  if (!rsvp.enabled) return null;
  const closed = isRsvpClosed(rsvp.deadline, now);
  const hasContact = Boolean(rsvp.contactEmail || rsvp.contactPhone);

  return (
    <section aria-labelledby="rsvp-heading" className="space-y-4 rounded-lg border bg-surface p-5 text-center sm:p-6">
      <div>
        <h2 id="rsvp-heading" className="font-serif text-2xl font-medium">
          RSVP
        </h2>
        {rsvp.deadline && !closed && <p className="mt-1 text-sm text-muted-foreground">Please reply by {formatDate(rsvp.deadline, "full-us")}.</p>}
        {closed && <p className="mt-1 text-sm text-muted-foreground">Replies closed on {formatDate(rsvp.deadline!, "full-us")}.</p>}
      </div>
      {!closed && <RsvpForm invitationId={invitationId} maxGuests={maxGuestsFor(rsvp)} />}
      {hasContact && (
        <div className="space-y-2 border-t pt-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{closed ? "Need to reach the host?" : "Questions?"}</p>
          <Contact rsvp={rsvp} />
        </div>
      )}
    </section>
  );
}
