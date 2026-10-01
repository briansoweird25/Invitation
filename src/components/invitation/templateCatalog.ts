import { categoryConfigs } from "@/data/categories";
import { type InvitationCategory } from "@/data/taxonomy";
import { categoriesInUse, suitsCategory } from "@/lib/templateFilters";
import type { InvitationContent, InvitationDesign } from "@/types/invitation";
import type { DesignPreset, TemplateMeta } from "./templateTypes";
import { botanicalBabyShower } from "./templates/baby-shower/botanical-baby-shower/meta";
import { moonlightBabyShower } from "./templates/baby-shower/moonlight-baby-shower/meta";
import { rainbowBabyShower } from "./templates/baby-shower/rainbow-baby-shower/meta";
import { confettiBirthday } from "./templates/birthday/confetti-birthday/meta";
import { editorialBirthday } from "./templates/birthday/editorial-birthday/meta";
import { modernBirthday } from "./templates/birthday/modern-birthday/meta";
import { vintageBirthday } from "./templates/birthday/vintage-birthday/meta";
import { elegantWedding } from "./templates/wedding/elegant-wedding/meta";
import { floralWedding } from "./templates/wedding/floral-wedding/meta";
import { luxuryWedding } from "./templates/wedding/luxury-wedding/meta";
import { minimalWedding } from "./templates/wedding/minimal-wedding/meta";

/**
 * Catalog metadata for every template. It holds no components, so it stays small and always loaded.
 * To add a template, create its component and meta, then add the meta here.
 */
const metas: TemplateMeta[] = [
  elegantWedding,
  floralWedding,
  luxuryWedding,
  minimalWedding,
  modernBirthday,
  confettiBirthday,
  vintageBirthday,
  editorialBirthday,
  botanicalBabyShower,
  rainbowBabyShower,
  moonlightBabyShower,
];

export type TemplateId = string;

export const DEFAULT_TEMPLATE_ID: TemplateId = "elegant-wedding";

/** A catalog entry as the UI uses it. */
export interface TemplateListItem extends TemplateMeta {
  isPremium: boolean;
}

const toItem = (meta: TemplateMeta): TemplateListItem => ({ ...meta, isPremium: meta.tier === "premium" });

const byId = new Map(metas.map((m) => [m.id, toItem(m)]));

/** Active templates, in catalog order. Retired templates are excluded. */
export const templateList: TemplateListItem[] = [...byId.values()].filter((t) => t.status === "active");

export function isTemplateId(value: string | null | undefined): value is TemplateId {
  return typeof value === "string" && byId.has(value);
}

/** Finds any template, including retired ones, because existing invitations may still use them. */
export function getTemplate(id: string | null | undefined): TemplateListItem | undefined {
  return id ? byId.get(id) : undefined;
}

/** Categories with at least one discoverable active template (primary or `alsoSuits`), in taxonomy order. */
export function categoriesWithTemplates(): InvitationCategory[] {
  return categoriesInUse(templateList);
}

/** Active templates that belong in a category's page. A template is never duplicated; it is listed by reference. */
export function templatesForCategory(category: InvitationCategory): TemplateListItem[] {
  return templateList.filter((t) => suitsCategory(t, category));
}

/** The category an invitation started from `template` gets: the requested one when the template suits it, else the primary. */
export function resolveCategory(template: TemplateMeta, requested?: string | null): InvitationCategory {
  return requested && suitsCategory(template, requested as InvitationCategory) ? (requested as InvitationCategory) : template.category;
}

export function getPreset(template: TemplateMeta, presetId?: string | null): DesignPreset {
  return template.presets.find((p) => p.id === presetId) ?? template.presets[0];
}

/**
 * The sample content a template starts with. In its primary category that is the category sample plus the
 * template's own overrides. In any other category it is that category's sample, so a birthday template
 * shown under Baby Shower starts with baby shower wording.
 */
export function sampleContentFor(template: TemplateMeta, category?: string | null): InvitationContent {
  const resolved = resolveCategory(template, category);
  const base = categoryConfigs[resolved].sampleContent;
  return resolved === template.category ? { ...base, ...template.sampleContent } : { ...base };
}

/** Content and design for previews and for starting a new invitation. */
export function startingPoint(
  template: TemplateMeta,
  presetId?: string | null,
  category?: string | null,
): { content: InvitationContent; design: InvitationDesign; category: InvitationCategory } {
  const preset = getPreset(template, presetId);
  return {
    content: sampleContentFor(template, category),
    design: { ...preset.design, presetId: preset.id },
    category: resolveCategory(template, category),
  };
}
