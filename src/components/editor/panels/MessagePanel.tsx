import { Textarea } from "@/components/ui/textarea";
import { useInvitationStore } from "@/stores/invitationStore";
import { Field } from "@/components/ui/field";
import { PanelSection } from "../PanelSection";

const MAX = 300;

export function MessagePanel() {
  const message = useInvitationStore((s) => s.content.message);
  const update = useInvitationStore((s) => s.updateContent);

  return (
    <PanelSection id="message" title="Message">
      <Field id="message-text" label="Your message" helper={`${message.length} / ${MAX}. Long messages are shortened on the invitation.`}>
        <Textarea id="message-text" value={message} maxLength={MAX} onChange={(e) => update({ message: e.target.value })} />
      </Field>
    </PanelSection>
  );
}
