import { getTemplate } from "@/components/invitation/templateCatalog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useInvitationStore } from "@/stores/invitationStore";
import { PieceGrid } from "../controls/PieceGrid";
import { PanelSection } from "../PanelSection";

export function DecorationPanel() {
  const templateId = useInvitationStore((s) => s.templateId);
  const design = useInvitationStore((s) => s.design);
  const update = useInvitationStore((s) => s.updateDesign);
  const caps = getTemplate(templateId)?.capabilities;
  const active = design.decorations ?? [];

  // Nothing to offer for this template: hide the panel.
  if (!caps || (caps.decorations.length === 0 && caps.frames.length === 0 && caps.patterns.length === 0)) return null;

  const toggle = (id: string, on: boolean) =>
    update({ decorations: on ? [...active, id] : active.filter((d) => d !== id) });

  // Choosing a frame also drops the legacy "border" decoration, so "None" really means none.
  const setFrame = (id: string | undefined) =>
    update({ frame: id ? { id } : undefined, decorations: active.filter((d) => d !== "border") });

  return (
    <PanelSection id="decorations" title="Decorations">
      {caps.frames.length > 0 && (
        <PieceGrid label="Frame" kind="frame" options={caps.frames} value={design.frame?.id} design={design} onChange={setFrame} />
      )}
      {caps.patterns.length > 0 && (
        <PieceGrid
          label="Pattern"
          kind="pattern"
          options={caps.patterns}
          value={design.pattern?.id}
          design={design}
          onChange={(id) => update({ pattern: id ? { ...design.pattern, id } : undefined })}
        />
      )}
      {caps.decorations.map((o) => (
        <div key={o.id} className="flex items-center justify-between gap-4">
          <Label htmlFor={`deco-${o.id}`}>{o.label}</Label>
          <Switch id={`deco-${o.id}`} checked={active.includes(o.id)} onCheckedChange={(on) => toggle(o.id, on)} />
        </div>
      ))}
    </PanelSection>
  );
}
