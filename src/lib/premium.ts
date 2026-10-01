import type { DesignPreset, TemplateMeta } from "@/components/invitation/templateTypes";
import { getTemplate } from "@/components/invitation/templateCatalog";

/**
 * Which templates and Looks need Premium access. The template catalog is the only source: a template's `tier` and a
 * Look's optional `tier`. The same facts are mirrored to the database (`npm run templates:sql`), where they are enforced.
 * These helpers decide what the interface offers; they do not grant anything. The database decides what is allowed.
 */

type TierSource = Pick<TemplateMeta, "tier">;
type PresetSource = Pick<DesignPreset, "tier">;

/** Every Look of a premium template is premium; a free template may mark single Looks premium. */
export function isPremiumPreset(template: TierSource, preset: PresetSource): boolean {
  return template.tier === "premium" || preset.tier === "premium";
}

export function templateIsPremium(templateId: string): boolean {
  return getTemplate(templateId)?.tier === "premium";
}

/** A Look that is premium on its own, on a template that is free. */
export function lookIsPremiumOnFreeTemplate(templateId: string, presetId: string | undefined): boolean {
  const template = getTemplate(templateId);
  if (!template || template.tier === "premium" || !presetId) return false;
  return template.presets.find((p) => p.id === presetId)?.tier === "premium";
}

/** Starting a new invitation: a premium template, or a premium Look of any template. */
export function startNeedsPremium(templateId: string, presetId?: string | null): boolean {
  const template = getTemplate(templateId);
  if (!template) return false;
  if (template.tier === "premium") return true;
  return Boolean(presetId) && template.presets.find((p) => p.id === presetId)?.tier === "premium";
}

/**
 * Picking a Look inside an existing invitation. An invitation that already uses a premium template keeps all of
 * that template's Looks (it was never taken away), so only a premium Look on a free template is locked.
 */
export function lookIsLocked(hasPremium: boolean, templateId: string, presetId: string): boolean {
  return !hasPremium && lookIsPremiumOnFreeTemplate(templateId, presetId);
}
