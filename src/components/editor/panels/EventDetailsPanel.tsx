import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useInvitationStore } from "@/stores/invitationStore";
import { Field } from "../controls/Field";
import { PanelSection } from "../PanelSection";

export function EventDetailsPanel() {
  const category = useInvitationStore((s) => s.category);
  const content = useInvitationStore((s) => s.content);
  const update = useInvitationStore((s) => s.updateContent);
  const birthday = category === "birthday";

  return (
    <PanelSection id="event" title="Event details">
      <Field id="event-hostNames" label={birthday ? "Name" : "Names"} helper={birthday ? undefined : 'For example "Eleanor & James".'}>
        <Input id="event-hostNames" value={content.hostNames} maxLength={80} onChange={(e) => update({ hostNames: e.target.value })} />
      </Field>
      <Field
        id="event-eventTitle"
        label={birthday ? "Headline" : "Opening line"}
        helper={birthday ? 'For example "turns 30".' : 'For example "Together with their families".'}
      >
        <Input id="event-eventTitle" value={content.eventTitle} maxLength={60} onChange={(e) => update({ eventTitle: e.target.value })} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field id="event-date" label="Date">
          <Input id="event-date" type="date" value={content.date} onChange={(e) => update({ date: e.target.value })} />
        </Field>
        <Field id="event-time" label="Time">
          <Input id="event-time" type="time" value={content.time} onChange={(e) => update({ time: e.target.value })} />
        </Field>
      </div>
      <Field id="event-venue" label="Venue">
        <Input id="event-venue" value={content.venue} maxLength={80} onChange={(e) => update({ venue: e.target.value })} />
      </Field>
      <Field id="event-address" label="Address">
        <Input id="event-address" value={content.address} maxLength={120} onChange={(e) => update({ address: e.target.value })} />
      </Field>
      <Field id="event-additionalDetails" label="Additional details" helper="Optional. Dress code, parking, anything guests should know.">
        <Textarea
          id="event-additionalDetails"
          className="min-h-20"
          value={content.additionalDetails ?? ""}
          maxLength={200}
          onChange={(e) => update({ additionalDetails: e.target.value })}
        />
      </Field>
    </PanelSection>
  );
}
