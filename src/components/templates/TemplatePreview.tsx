import { InvitationRenderer } from "@/components/invitation/InvitationRenderer";
import { getPreset, getTemplate, sampleContentFor, type TemplateId } from "@/components/invitation/templateCatalog";

/** A template rendered with its sample content and a preset (the default one unless given). */
export function TemplatePreview({ id, presetId }: { id: TemplateId; presetId?: string }) {
  const template = getTemplate(id);
  if (!template) return null;
  return <InvitationRenderer templateId={id} content={sampleContentFor(template)} design={getPreset(template, presetId).design} />;
}
