import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  return (
    <PanelSection id="background" title="Background">
      <ColorControl id="bg-color" label="Background color" value={design.backgroundColor} onChange={(backgroundColor) => update({ backgroundColor })} />
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
    </PanelSection>
  );
}
