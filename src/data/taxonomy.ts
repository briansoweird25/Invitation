/**
 * The single source of truth for invitation categories and style tags.
 * Ids are stored with saved invitations, so they are permanent: append, never rename or remove.
 */

export const categories = [
  "wedding",
  "birthday",
  "baby-shower",
  "bridal-shower",
  "engagement",
  "anniversary",
  "graduation",
  "baptism",
  "communion",
  "retirement",
  "dinner-party",
  "corporate-event",
  "general-party",
] as const;

export type InvitationCategory = (typeof categories)[number];

export const styleTags = [
  "elegant",
  "romantic",
  "floral",
  "modern",
  "minimal",
  "luxury",
  "vintage",
  "rustic",
  "botanical",
  "playful",
  "colorful",
  "traditional",
  "editorial",
] as const;

export type TemplateStyle = (typeof styleTags)[number];

export const layouts = [
  "centered-classic",
  "framed-card",
  "asymmetric",
  "split",
  "arch-window",
  "typographic-poster",
  "editorial-grid",
  "badge-seal",
  "full-bleed-image",
  "ticket-label",
] as const;

export type LayoutId = (typeof layouts)[number];

/** Used when a stored category is not (or no longer) in the taxonomy. */
export const FALLBACK_CATEGORY: InvitationCategory = "general-party";

export function isInvitationCategory(value: unknown): value is InvitationCategory {
  return typeof value === "string" && (categories as readonly string[]).includes(value);
}

export function isTemplateStyle(value: unknown): value is TemplateStyle {
  return typeof value === "string" && (styleTags as readonly string[]).includes(value);
}

/** Maps any stored value to a known category so one odd row never breaks a screen. */
export function toInvitationCategory(value: unknown): InvitationCategory {
  return isInvitationCategory(value) ? value : FALLBACK_CATEGORY;
}
