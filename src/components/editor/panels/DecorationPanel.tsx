import { getTemplate } from "@/components/invitation/templateRegistry";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useInvitationStore } from "@/stores/invitationStore";
import { PanelSection } from "../PanelSection";

export function DecorationPanel() {
  const templateId = useInvitationStore((s) => s.templateId);
  const active = useInvitationStore((s) => s.design.decorations ?? []);
  const update = useInvitationStore((s) => s.updateDesign);
  const options = getTemplate(templateId)?.decorationOptions ?? [];

  const toggle = (id: string, on: boolean) =>
    update({ decorations: on ? [...active, id] : active.filter((d) => d !== id) });

  return (
    <PanelSection id="decorations" title="Decorations">
      {options.length === 0 && <p className="text-sm text-muted-foreground">This template has no decorations.</p>}
      {options.map((o) => (
        <div key={o.id} className="flex items-center justify-between gap-4">
          <Label htmlFor={`deco-${o.id}`}>{o.label}</Label>
          <Switch id={`deco-${o.id}`} checked={active.includes(o.id)} onCheckedChange={(on) => toggle(o.id, on)} />
        </div>
      ))}
    </PanelSection>
  );
}
