import { Mail, Phone } from "lucide-react";
import { formatDate } from "@/lib/invitationFormat";
import type { RSVPSettings } from "@/types/invitation";

/**
 * What a guest needs to reply: the deadline and how to reach the host. Renders nothing when RSVP is off or
 * the host gave neither. The reply form itself arrives with the RSVP phase.
 */
export function RsvpInfo({ rsvp }: { rsvp: RSVPSettings }) {
  if (!rsvp.enabled) return null;
  const { deadline, contactName, contactEmail, contactPhone } = rsvp;
  if (!deadline && !contactEmail && !contactPhone) return null;

  return (
    <section aria-labelledby="rsvp-heading" className="rounded-lg border bg-surface p-5 text-center">
      <h2 id="rsvp-heading" className="font-serif text-xl font-medium">
        RSVP
      </h2>
      {deadline && <p className="mt-1 text-sm text-muted-foreground">Please reply by {formatDate(deadline, "full-us")}.</p>}
      {(contactEmail || contactPhone) && (
        <ul className="mt-3 space-y-1.5 text-sm">
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
      )}
    </section>
  );
}
