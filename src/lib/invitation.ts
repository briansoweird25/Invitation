import { getTemplate, startingPoint } from "@/components/invitation/templateCatalog";
import { FALLBACK_CATEGORY } from "@/data/taxonomy";
import type { Invitation } from "@/types/invitation";

/** An invitation that has not been saved yet, so it has no id, owner, slug or timestamps. */
export type InvitationDraft = Pick<Invitation, "title" | "category" | "templateId" | "content" | "design" | "rsvp" | "status">;

/** Starts a draft from a template and one of its presets (the default preset when none is given). */
export function createInvitationDraft(templateId: string, presetId?: string | null): InvitationDraft {
  const template = getTemplate(templateId);
  if (!template) throw new Error(`Unknown template: ${templateId}`);
  const { content, design } = startingPoint(template, presetId);
  return {
    title: "Untitled invitation",
    category: template.category ?? FALLBACK_CATEGORY,
    templateId,
    content,
    design,
    rsvp: { enabled: false },
    status: "draft",
  };
}
