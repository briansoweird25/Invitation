export type TemplateCategory = "wedding" | "birthday";

export type TemplateId = "elegant-wedding" | "floral-wedding" | "minimal-wedding" | "modern-birthday";

export interface TemplateInfo {
  id: TemplateId;
  name: string;
  category: TemplateCategory;
  description: string;
  isPremium: boolean;
}

/** Gallery metadata. Phase 4 attaches the real renderer components via the template registry. */
export const templates: TemplateInfo[] = [
  {
    id: "elegant-wedding",
    name: "Elegant Wedding",
    category: "wedding",
    description: "Classic serif type, a thin border and a quiet neutral palette.",
    isPremium: false,
  },
  {
    id: "floral-wedding",
    name: "Floral Wedding",
    category: "wedding",
    description: "Soft botanical details and an asymmetric, natural composition.",
    isPremium: true,
  },
  {
    id: "minimal-wedding",
    name: "Minimal Wedding",
    category: "wedding",
    description: "Generous whitespace, modern type and a strict grid.",
    isPremium: false,
  },
  {
    id: "modern-birthday",
    name: "Modern Birthday",
    category: "birthday",
    description: "Bold display type, a vivid accent and playful shapes.",
    isPremium: false,
  },
];

export const categories: { id: TemplateCategory; label: string }[] = [
  { id: "wedding", label: "Wedding" },
  { id: "birthday", label: "Birthday" },
];

export function isTemplateCategory(value: string | undefined): value is TemplateCategory {
  return categories.some((c) => c.id === value);
}

export function getTemplate(id: string | null): TemplateInfo | undefined {
  return templates.find((t) => t.id === id);
}

/** Where a chosen template leads. The editor itself arrives in Phase 5. */
export function templateEditorPath(id: TemplateId): string {
  return `/editor/new?template=${id}`;
}
