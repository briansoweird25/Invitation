import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RSVP_EMAIL_MAX, RSVP_MESSAGE_MAX, RSVP_NAME_MAX, rsvpSubmissionSchema } from "@/lib/rsvp";
import { submitRsvp } from "@/lib/rsvpApi";
import { validateForm, type FieldErrors } from "@/lib/validation";
import type { Attendance } from "@/types/invitation";
import { cn } from "@/lib/utils";

interface RsvpFormProps {
  invitationId: string;
  maxGuests: number;
}

type FormErrors = FieldErrors<{ guestName: string; guestEmail: string; attendance: string; guestCount: string; message: string }>;

const CHOICES: { value: Attendance; label: string }[] = [
  { value: "attending", label: "Yes, I'll be there" },
  { value: "declined", label: "Sorry, I can't make it" },
];

/** A short, single-column reply form. Large touch targets, no account, nothing required but a name and an answer. */
export function RsvpForm({ invitationId, maxGuests }: RsvpFormProps) {
  const [attendance, setAttendance] = useState<Attendance | "">("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState<{ name: string; attendance: Attendance } | null>(null);
  // Bumped to remount the form after "reply for someone else", clearing every field.
  const [round, setRound] = useState(0);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    // A person never fills this hidden field. A bot that does gets a fake success and nothing is stored.
    const trap = String(form.get("website") ?? "");
    const result = validateForm(rsvpSubmissionSchema(maxGuests), {
      guestName: form.get("guestName"),
      guestEmail: form.get("guestEmail"),
      attendance: attendance || undefined,
      guestCount: form.get("guestCount") ?? 1,
      message: form.get("message"),
    });
    setErrors(result.errors ?? {});
    setFormError(undefined);
    if (!result.data) return;

    setSubmitting(true);
    try {
      if (!trap) await submitRsvp(invitationId, result.data);
      setSent({ name: result.data.guestName, attendance: result.data.attendance });
      toast.success("RSVP sent");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "We couldn't send your reply. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div role="status" className="space-y-3 text-center">
        <p className="font-serif text-xl font-medium">Thank you, {sent.name}</p>
        <p className="text-sm text-muted-foreground">
          {sent.attendance === "attending" ? "Your reply has been sent. We look forward to seeing you." : "Your reply has been sent. We'll miss you."}
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSent(null);
            setAttendance("");
            setRound((n) => n + 1);
          }}
        >
          Reply for someone else
        </Button>
      </div>
    );
  }

  const showCount = attendance === "attending" && maxGuests > 1;

  return (
    <form key={round} onSubmit={onSubmit} noValidate className="space-y-5 text-left" aria-label="RSVP">
      <Field id="rsvp-guestName" label="Your name" error={errors.guestName}>
        <Input id="rsvp-guestName" name="guestName" autoComplete="name" maxLength={RSVP_NAME_MAX} aria-invalid={Boolean(errors.guestName)} aria-describedby={errors.guestName ? "rsvp-guestName-error" : undefined} />
      </Field>

      <fieldset className="space-y-2" aria-describedby={errors.attendance ? "rsvp-attendance-error" : undefined}>
        <legend className="text-sm font-medium">Will you come?</legend>
        <div className="grid gap-2">
          {CHOICES.map((c) => (
            <label
              key={c.value}
              className={cn(
                "flex min-h-12 cursor-pointer items-center gap-3 rounded-md border bg-surface px-3 text-sm has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
                attendance === c.value && "border-foreground ring-1 ring-foreground",
              )}
            >
              <input type="radio" name="attendance" value={c.value} checked={attendance === c.value} onChange={() => setAttendance(c.value)} className="size-4 accent-accent" />
              {c.label}
            </label>
          ))}
        </div>
        {errors.attendance && (
          <p id="rsvp-attendance-error" role="alert" className="text-xs text-destructive">
            {errors.attendance}
          </p>
        )}
      </fieldset>

      {showCount && (
        <Field id="rsvp-guestCount" label="How many people, including you?" error={errors.guestCount} helper={`Up to ${maxGuests}.`}>
          <Input id="rsvp-guestCount" name="guestCount" type="number" inputMode="numeric" min={1} max={maxGuests} defaultValue={1} aria-invalid={Boolean(errors.guestCount)} aria-describedby={errors.guestCount ? "rsvp-guestCount-error" : undefined} />
        </Field>
      )}

      <Field id="rsvp-guestEmail" label="Email (optional)" error={errors.guestEmail} helper="Only the host will see it.">
        <Input id="rsvp-guestEmail" name="guestEmail" type="email" autoComplete="email" maxLength={RSVP_EMAIL_MAX} aria-invalid={Boolean(errors.guestEmail)} aria-describedby={errors.guestEmail ? "rsvp-guestEmail-error" : undefined} />
      </Field>

      <Field id="rsvp-message" label="A note for the host (optional)" error={errors.message}>
        <Textarea id="rsvp-message" name="message" rows={3} maxLength={RSVP_MESSAGE_MAX} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "rsvp-message-error" : undefined} />
      </Field>

      {/* Honeypot: off screen and out of the tab order. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {formError && (
        <p role="alert" className="text-sm text-destructive">
          {formError}
        </p>
      )}
      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {submitting ? "Sending…" : "Send RSVP"}
      </Button>
    </form>
  );
}
