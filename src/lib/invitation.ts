import { getTemplate, type TemplateId } from "@/components/invitation/templateRegistry";
import type { Invitation } from "@/types/invitation";

/** An invitation that has not been saved yet, so it has no id, owner, slug or timestamps. */
export type InvitationDraft = Pick<Invitation, "title" | "category" | "templateId" | "content" | "design" | "rsvp" | "status">;

export function createInvitationDraft(templateId: TemplateId): InvitationDraft {
  const template = getTemplate(templateId)!;
  return {
    title: "Untitled invitation",
    category: template.category,
    templateId,
    content: { ...template.sampleContent },
    design: { ...template.defaultDesign },
    rsvp: { enabled: false },
    status: "draft",
  };
}
