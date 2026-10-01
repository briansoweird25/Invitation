import { InvitationRenderer } from "@/components/invitation/InvitationRenderer";
import { getPreset, getTemplate, sampleContentFor, type TemplateId } from "@/components/invitation/templateCatalog";

/** A template rendered with sample content for a category (its primary one unless given) and a preset (the default one unless given). */
export function TemplatePreview({ id, presetId, category }: { id: TemplateId; presetId?: string; category?: string }) {
  const template = getTemplate(id);
  if (!template) return null;
  return <InvitationRenderer templateId={id} content={sampleContentFor(template, category)} design={getPreset(template, presetId).design} />;
}
