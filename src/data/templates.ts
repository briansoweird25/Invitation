import { isInvitationCategory } from "./taxonomy";

export const isTemplateCategory = isInvitationCategory;

/** Where a chosen template leads. The editor reads these back with `useSelectedTemplate`. */
export function templateEditorPath(id: string, presetId?: string): string {
  const params = new URLSearchParams({ template: id });
  if (presetId) params.set("preset", presetId);
  return `/editor/new?${params.toString()}`;
}
