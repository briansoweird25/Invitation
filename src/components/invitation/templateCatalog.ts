import { categoryConfigs } from "@/data/categories";
import { categories, type InvitationCategory } from "@/data/taxonomy";
import type { InvitationContent, InvitationDesign } from "@/types/invitation";
import type { DesignPreset, TemplateMeta } from "./templateTypes";
import { modernBirthday } from "./templates/birthday/modern-birthday/meta";
import { elegantWedding } from "./templates/wedding/elegant-wedding/meta";
import { floralWedding } from "./templates/wedding/floral-wedding/meta";
import { minimalWedding } from "./templates/wedding/minimal-wedding/meta";

/**
 * Catalog metadata for every template. It holds no components, so it stays small and always loaded.
 * To add a template, create its component and meta, then add the meta here.
 */
const metas: TemplateMeta[] = [elegantWedding, floralWedding, minimalWedding, modernBirthday];

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

/** Categories that currently have at least one active template, in taxonomy order. */
export function categoriesWithTemplates(): InvitationCategory[] {
  return categories.filter((c) => templateList.some((t) => t.category === c));
}

export function getPreset(template: TemplateMeta, presetId?: string | null): DesignPreset {
  return template.presets.find((p) => p.id === presetId) ?? template.presets[0];
}

/** The invitation content a template starts with: the category sample, with the template's own overrides. */
export function sampleContentFor(template: TemplateMeta): InvitationContent {
  return { ...categoryConfigs[template.category].sampleContent, ...template.sampleContent };
}

/** Content and design for previews and for starting a new invitation. */
export function startingPoint(template: TemplateMeta, presetId?: string | null): { content: InvitationContent; design: InvitationDesign } {
  const preset = getPreset(template, presetId);
  return { content: sampleContentFor(template), design: { ...preset.design, presetId: preset.id } };
}
