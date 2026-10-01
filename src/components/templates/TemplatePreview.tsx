import { InvitationRenderer } from "@/components/invitation/InvitationRenderer";
import { getTemplate, type TemplateId } from "@/components/invitation/templateRegistry";

/** A template rendered with its own sample content and default design. */
export function TemplatePreview({ id }: { id: TemplateId }) {
  const template = getTemplate(id);
  if (!template) return null;
  return <InvitationRenderer templateId={id} content={template.sampleContent} design={template.defaultDesign} />;
}
