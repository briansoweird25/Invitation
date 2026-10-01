import { getTemplate, startingPoint } from "@/components/invitation/templateCatalog";
import type { Invitation } from "@/types/invitation";

/** An invitation that has not been saved yet, so it has no id, owner, slug or timestamps. */
export type InvitationDraft = Pick<Invitation, "title" | "category" | "templateId" | "content" | "design" | "rsvp" | "status">;

/**
 * Starts a draft from a template and one of its presets (the default preset when none is given).
 * `category` is the category page the template was chosen from; it is used when the template suits it.
 */
export function createInvitationDraft(templateId: string, presetId?: string | null, category?: string | null): InvitationDraft {
  const template = getTemplate(templateId);
  if (!template) throw new Error(`Unknown template: ${templateId}`);
  const resolved = startingPoint(template, presetId, category);
  return {
    title: "Untitled invitation",
    category: resolved.category,
    templateId,
    content: resolved.content,
    design: resolved.design,
    rsvp: { enabled: false },
    status: "draft",
  };
}
