import { getTemplate } from "@/components/invitation/templateCatalog";
import { contrastRatio } from "@/lib/color";
import { useInvitationStore } from "@/stores/invitationStore";
import { ColorControl } from "../controls/ColorControl";
import { Disclosure } from "../controls/Disclosure";
import { PaletteGrid } from "../controls/PaletteGrid";
import { PanelSection } from "../PanelSection";

export function ColorsPanel() {
  const design = useInvitationStore((s) => s.design);
  const update = useInvitationStore((s) => s.updateDesign);
  const template = useInvitationStore((s) => getTemplate(s.templateId));
  const ratio = contrastRatio(design.textColor, design.backgroundColor);

  return (
    <PanelSection id="colors" title="Colors">
      <PaletteGrid
        allowed={template?.capabilities.palettes ?? "any"}
        styles={template?.styles ?? []}
        design={design}
        onSelect={(p) =>
          update({
            backgroundColor: p.backgroundColor,
            textColor: p.textColor,
            accentColor: p.accentColor,
            secondaryColor: p.secondaryColor,
            paletteId: p.id,
          })
        }
      />
      {ratio !== null && ratio < 3 && (
        <p role="status" className="text-xs text-destructive">
          Low contrast between text and background. The invitation may be hard to read.
        </p>
      )}
      <Disclosure label="Custom colors">
        <ColorControl id="color-text" label="Text color" value={design.textColor} onChange={(textColor) => update({ textColor, paletteId: undefined })} />
        <ColorControl id="color-accent" label="Accent color" value={design.accentColor} onChange={(accentColor) => update({ accentColor, paletteId: undefined })} />
        <ColorControl
          id="color-secondary"
          label="Second accent"
          value={design.secondaryColor ?? design.accentColor}
          onChange={(secondaryColor) => update({ secondaryColor, paletteId: undefined })}
        />
      </Disclosure>
    </PanelSection>
  );
}
