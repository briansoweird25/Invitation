import { getTemplate } from "@/components/invitation/templateCatalog";
import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { fontOptions, type FontKind } from "@/lib/fonts";
import { useInvitationStore } from "@/stores/invitationStore";
import { Disclosure } from "../controls/Disclosure";
import { PairingCards } from "../controls/PairingCards";
import { PanelSection } from "../PanelSection";

const groups: { kind: FontKind[]; label: string }[] = [
  { kind: ["serif"], label: "Serif" },
  { kind: ["display"], label: "Display" },
  { kind: ["sans"], label: "Sans-serif" },
  { kind: ["hand", "script"], label: "Handwritten and script" },
];

function FontSelect({ id, value, onChange, allowNone }: { id: string; value: string; onChange: (value: string) => void; allowNone?: boolean }) {
  return (
    <Select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
      {allowNone && <option value="">None</option>}
      {groups.map((g) => (
        <optgroup key={g.label} label={g.label}>
          {fontOptions
            .filter((f) => g.kind.includes(f.kind))
            .map((f) => (
              <option key={f.name}>{f.name}</option>
            ))}
        </optgroup>
      ))}
    </Select>
  );
}

export function TypographyPanel() {
  const design = useInvitationStore((s) => s.design);
  const update = useInvitationStore((s) => s.updateDesign);
  const template = useInvitationStore((s) => getTemplate(s.templateId));
  const pairings = template?.capabilities.fontPairings ?? "any";

  return (
    <PanelSection id="typography" title="Typography">
      {pairings !== "any" && pairings.length === 0 ? null : (
        <PairingCards
          allowed={pairings}
          styles={template?.styles ?? []}
          design={design}
          onSelect={(p) =>
            update({ headingFont: p.heading, bodyFont: p.body, scriptFont: p.script, fontPairingId: p.id })
          }
        />
      )}
      <Disclosure label="Choose fonts yourself">
        <Field id="type-heading" label="Heading font" helper="Names and dates.">
          <FontSelect id="type-heading" value={design.headingFont} onChange={(headingFont) => update({ headingFont, fontPairingId: undefined })} />
        </Field>
        <Field id="type-body" label="Body font" helper="Smaller supporting text.">
          <FontSelect id="type-body" value={design.bodyFont} onChange={(bodyFont) => update({ bodyFont, fontPairingId: undefined })} />
        </Field>
        <Field id="type-script" label="Script font" helper="Optional. Used for names and flourishes in templates that support it.">
          <FontSelect id="type-script" value={design.scriptFont ?? ""} allowNone onChange={(scriptFont) => update({ scriptFont: scriptFont || undefined, fontPairingId: undefined })} />
        </Field>
      </Disclosure>
    </PanelSection>
  );
}
