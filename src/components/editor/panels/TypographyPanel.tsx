import { Select } from "@/components/ui/select";
import { fontOptions } from "@/lib/fonts";
import { useInvitationStore } from "@/stores/invitationStore";
import { Field } from "@/components/ui/field";
import { PanelSection } from "../PanelSection";

export function TypographyPanel() {
  const design = useInvitationStore((s) => s.design);
  const update = useInvitationStore((s) => s.updateDesign);

  return (
    <PanelSection id="typography" title="Typography">
      <Field id="type-heading" label="Heading font" helper="Names and dates.">
        <Select id="type-heading" value={design.headingFont} onChange={(e) => update({ headingFont: e.target.value })}>
          {fontOptions.map((f) => (
            <option key={f.name}>{f.name}</option>
          ))}
        </Select>
      </Field>
      <Field id="type-body" label="Body font" helper="Smaller supporting text.">
        <Select id="type-body" value={design.bodyFont} onChange={(e) => update({ bodyFont: e.target.value })}>
          {fontOptions.map((f) => (
            <option key={f.name}>{f.name}</option>
          ))}
        </Select>
      </Field>
    </PanelSection>
  );
}
