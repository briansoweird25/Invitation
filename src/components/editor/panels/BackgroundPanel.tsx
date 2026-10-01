import { getKitPiece } from "@/components/invitation/kit/registry";
import { getTemplate } from "@/components/invitation/templateCatalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { fieldError, imageUrlSchema } from "@/lib/validation";
import { useInvitationStore } from "@/stores/invitationStore";
import { ColorControl } from "../controls/ColorControl";
import { ImageUpload } from "../controls/ImageUpload";
import { Field } from "@/components/ui/field";
import { PanelSection } from "../PanelSection";

export function BackgroundPanel() {
  const design = useInvitationStore((s) => s.design);
  const update = useInvitationStore((s) => s.updateDesign);
  const error = fieldError(imageUrlSchema, design.backgroundImage);
  const caps = useInvitationStore((s) => getTemplate(s.templateId)?.capabilities);

  return (
    <PanelSection id="background" title="Background">
      <ColorControl id="bg-color" label="Background color" value={design.backgroundColor} onChange={(backgroundColor) => update({ backgroundColor })} />
      {caps && caps.backgrounds.length > 0 && (
        <Field id="bg-effect" label="Texture or wash" helper="Drawn over the background color.">
          <Select
            id="bg-effect"
            value={design.background?.id ?? ""}
            onChange={(e) => update({ background: e.target.value ? { ...design.background, id: e.target.value } : undefined })}
          >
            <option value="">None</option>
            {caps.backgrounds.map((id) => (
              <option key={id} value={id}>
                {getKitPiece("background", id)?.label ?? id}
              </option>
            ))}
          </Select>
        </Field>
      )}
      {caps?.backgroundImage !== false && (
        <>
        <ImageUpload id="bg-upload" onUploaded={(backgroundImage) => update({ backgroundImage })} />
        <Field id="bg-image" label="Or paste an image link" helper="Optional." error={error}>
          <Input
            id="bg-image"
            type="url"
            inputMode="url"
            placeholder="https://"
            value={design.backgroundImage ?? ""}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "bg-image-error" : undefined}
            onChange={(e) => update({ backgroundImage: e.target.value || undefined })}
          />
        </Field>
        {design.backgroundImage && (
          <Button variant="ghost" size="sm" onClick={() => update({ backgroundImage: undefined })}>
            Remove image
          </Button>
        )}
        </>
      )}
    </PanelSection>
  );
}
