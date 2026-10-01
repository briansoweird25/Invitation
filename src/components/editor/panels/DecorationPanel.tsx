import { getKitPiece } from "@/components/invitation/kit/registry";
import { getTemplate } from "@/components/invitation/templateCatalog";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Field } from "@/components/ui/field";
import { useInvitationStore } from "@/stores/invitationStore";
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
  const setFrame = (id: string) =>
    update({ frame: id ? { id } : undefined, decorations: active.filter((d) => d !== "border") });

  return (
    <PanelSection id="decorations" title="Decorations">
      {caps.frames.length > 0 && (
        <Field id="deco-frame" label="Frame">
          <Select id="deco-frame" value={design.frame?.id ?? ""} onChange={(e) => setFrame(e.target.value)}>
            <option value="">None</option>
            {caps.frames.map((id) => (
              <option key={id} value={id}>
                {getKitPiece("frame", id)?.label ?? id}
              </option>
            ))}
          </Select>
        </Field>
      )}
      {caps.patterns.length > 0 && (
        <Field id="deco-pattern" label="Pattern">
          <Select
            id="deco-pattern"
            value={design.pattern?.id ?? ""}
            onChange={(e) => update({ pattern: e.target.value ? { ...design.pattern, id: e.target.value } : undefined })}
          >
            <option value="">None</option>
            {caps.patterns.map((id) => (
              <option key={id} value={id}>
                {getKitPiece("pattern", id)?.label ?? id}
              </option>
            ))}
          </Select>
        </Field>
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
