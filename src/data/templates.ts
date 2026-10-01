import type { TemplateId } from "@/components/invitation/templateRegistry";
import type { InvitationCategory } from "@/types/invitation";

export const categories: { id: InvitationCategory; label: string }[] = [
  { id: "wedding", label: "Wedding" },
  { id: "birthday", label: "Birthday" },
];

export function isTemplateCategory(value: string | undefined): value is InvitationCategory {
  return categories.some((c) => c.id === value);
}

/** Where a chosen template leads. The editor reads the id back with `useSelectedTemplate`. */
export function templateEditorPath(id: TemplateId): string {
  return `/editor/new?template=${id}`;
}
