import type { InvitationCategory, LayoutId, TemplateStyle } from "@/data/taxonomy";
import type { InvitationContent, InvitationDesign } from "@/types/invitation";

export interface DecorationOption {
  id: string;
  label: string;
}

/**
 * What the editor may offer for a template. A template only lists what it really supports,
 * and panels with nothing to offer are hidden. Values are kit piece ids (see `kit/registry.ts`).
 */
export interface TemplateCapabilities {
  /** Template-specific on/off decorations, stored in `design.decorations`. */
  decorations: DecorationOption[];
  frames: string[];
  patterns: string[];
  backgrounds: string[];
  /** Whether the template shows an uploaded or linked background image. */
  backgroundImage: boolean;
  /** Palette ids from `data/palettes.ts`, or "any". */
  palettes: string[] | "any";
  /** Font pairing ids from `data/fontPairings.ts`, or "any". */
  fontPairings: string[] | "any";
}

/** A curated, complete design for a template. Presets vary mood, not structure. */
export interface DesignPreset {
  /** Unique within the template. */
  id: string;
  name: string;
  /**
   * "premium" marks a Look that needs Premium access even on a free template. Every Look of a premium template
   * needs it already. The first Look of a free template is its default and must stay free. Omitted means free.
   */
  tier?: "free" | "premium";
  /** Resolved values, exactly as stored in an invitation. The first preset of a template is its default. */
  design: InvitationDesign;
}

/** Catalog metadata. It is small and always loaded; the component is loaded on demand. */
export interface TemplateMeta {
  /** Permanent, lowercase kebab-case. Never rename or reuse. */
  id: string;
  name: string;
  description: string;
  category: InvitationCategory;
  alsoSuits?: InvitationCategory[];
  /** One to four style tags. */
  styles: TemplateStyle[];
  layout: LayoutId;
  tier: "free" | "premium";
  /** Retired templates are hidden from the gallery but still render for existing invitations. */
  status: "active" | "retired";
  featured?: boolean;
  /** ISO date. Drives "New". */
  addedAt: string;
  capabilities: TemplateCapabilities;
  /** At least one. The first is the default. */
  presets: DesignPreset[];
  /** Overrides parts of the category sample content. */
  sampleContent?: Partial<InvitationContent>;
}
