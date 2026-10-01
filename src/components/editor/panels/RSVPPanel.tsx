import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { emailSchema, fieldError, MAX_GUESTS_LIMIT } from "@/lib/validation";
import { useInvitationStore } from "@/stores/invitationStore";
import { Field } from "../controls/Field";
import { PanelSection } from "../PanelSection";

export function RSVPPanel() {
  const rsvp = useInvitationStore((s) => s.rsvp);
  const update = useInvitationStore((s) => s.updateRsvp);
  const emailError = fieldError(emailSchema, rsvp.contactEmail);

  return (
    <PanelSection id="rsvp" title="RSVP">
      <div className="flex items-center justify-between gap-4">
        <Label htmlFor="rsvp-enabled">Collect RSVPs</Label>
        <Switch id="rsvp-enabled" checked={rsvp.enabled} onCheckedChange={(enabled) => update({ enabled })} />
      </div>
      {rsvp.enabled ? (
        <>
          <Field id="rsvp-deadline" label="Reply by">
            <Input id="rsvp-deadline" type="date" value={rsvp.deadline ?? ""} onChange={(e) => update({ deadline: e.target.value || undefined })} />
          </Field>
          <Field id="rsvp-maxGuests" label="Maximum guests per reply" helper="Optional.">
            <Input
              id="rsvp-maxGuests"
              type="number"
              inputMode="numeric"
              min={1}
              max={MAX_GUESTS_LIMIT}
              value={rsvp.maxGuests ?? ""}
              onChange={(e) => {
                const n = e.target.valueAsNumber;
                update({ maxGuests: Number.isFinite(n) ? Math.min(MAX_GUESTS_LIMIT, Math.max(1, Math.round(n))) : undefined });
              }}
            />
          </Field>
          <Field id="rsvp-contactName" label="Contact name">
            <Input id="rsvp-contactName" value={rsvp.contactName ?? ""} maxLength={80} onChange={(e) => update({ contactName: e.target.value || undefined })} />
          </Field>
          <Field id="rsvp-contactEmail" label="Contact email" error={emailError}>
            <Input
              id="rsvp-contactEmail"
              type="email"
              value={rsvp.contactEmail ?? ""}
              aria-invalid={Boolean(emailError)}
              aria-describedby={emailError ? "rsvp-contactEmail-error" : undefined}
              onChange={(e) => update({ contactEmail: e.target.value || undefined })}
            />
          </Field>
          <Field id="rsvp-contactPhone" label="Contact phone">
            <Input id="rsvp-contactPhone" type="tel" value={rsvp.contactPhone ?? ""} maxLength={30} onChange={(e) => update({ contactPhone: e.target.value || undefined })} />
          </Field>
        </>
      ) : (
        <p className="text-xs text-muted-foreground">Turn this on to let guests reply from your published invitation.</p>
      )}
    </PanelSection>
  );
}
