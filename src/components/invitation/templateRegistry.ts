import type { ComponentType } from "react";
import type { InvitationCategory, InvitationContent, InvitationDesign, TemplateProps } from "@/types/invitation";
import { ElegantWedding } from "./templates/ElegantWedding";
import { FloralWedding } from "./templates/FloralWedding";
import { MinimalWedding } from "./templates/MinimalWedding";
import { ModernBirthday } from "./templates/ModernBirthday";

export interface DecorationOption {
  id: string;
  label: string;
}

export interface TemplateDefinition {
  name: string;
  category: InvitationCategory;
  description: string;
  isPremium: boolean;
  component: ComponentType<TemplateProps>;
  /** Decorations this template can show, toggled through `design.decorations`. */
  decorationOptions: DecorationOption[];
  /** Starting design when a user picks this template. */
  defaultDesign: InvitationDesign;
  /** Starting content, also used for gallery and landing previews. */
  sampleContent: InvitationContent;
}

/**
 * Add a template by creating a component and registering it here.
 * Nothing else (editor, renderer, database) needs to change.
 */
export const templateRegistry = {
  "elegant-wedding": {
    name: "Elegant Wedding",
    category: "wedding",
    description: "Classic serif type, a thin border and a quiet neutral palette.",
    isPremium: false,
    component: ElegantWedding,
    decorationOptions: [{ id: "border", label: "Thin border" }],
    defaultDesign: {
      headingFont: "Cormorant Garamond",
      bodyFont: "Inter",
      backgroundColor: "#F6F1E8",
      textColor: "#3A3128",
      accentColor: "#8A7352",
      decorations: ["border"],
    },
    sampleContent: {
      eventTitle: "Together with their families",
      hostNames: "Eleanor & James",
      date: "2026-06-14",
      time: "16:00",
      venue: "The Garden Pavilion",
      address: "12 Orchard Lane, Napa Valley",
      message: "Join us for an evening of love, laughter and celebration.",
    },
  },
  "floral-wedding": {
    name: "Floral Wedding",
    category: "wedding",
    description: "Soft botanical details and an asymmetric, natural composition.",
    isPremium: true,
    component: FloralWedding,
    decorationOptions: [{ id: "sprigs", label: "Botanical sprigs" }],
    defaultDesign: {
      headingFont: "Cormorant Garamond",
      bodyFont: "Inter",
      backgroundColor: "#EEF0E8",
      textColor: "#3E4A39",
      accentColor: "#7C8F6B",
      decorations: ["sprigs"],
    },
    sampleContent: {
      eventTitle: "You are invited to celebrate",
      hostNames: "Sofia & Daniel",
      date: "2026-09-20",
      time: "16:00",
      venue: "Olive Grove Estate",
      address: "48 Hillside Road, Sonoma",
      message: "We would be honored to have you with us as we say I do.",
    },
  },
  "minimal-wedding": {
    name: "Minimal Wedding",
    category: "wedding",
    description: "Generous whitespace, modern type and a strict grid.",
    isPremium: false,
    component: MinimalWedding,
    decorationOptions: [{ id: "rule", label: "Divider line" }],
    defaultDesign: {
      headingFont: "Inter",
      bodyFont: "Inter",
      backgroundColor: "#FBFBF9",
      textColor: "#1D1D1B",
      accentColor: "#9B978F",
      decorations: ["rule"],
    },
    sampleContent: {
      eventTitle: "Wedding",
      hostNames: "Lena & Marc",
      date: "2026-09-20",
      time: "15:00",
      venue: "Lakeside Studio, Zürich",
      address: "Seestrasse 20",
      message: "",
    },
  },
  "modern-birthday": {
    name: "Modern Birthday",
    category: "birthday",
    description: "Bold display type, a vivid accent and playful shapes.",
    isPremium: false,
    component: ModernBirthday,
    decorationOptions: [{ id: "shapes", label: "Playful shapes" }],
    defaultDesign: {
      headingFont: "Inter",
      bodyFont: "Inter",
      backgroundColor: "#FF6B3D",
      textColor: "#1D1D1B",
      accentColor: "#FFE9D6",
      decorations: ["shapes"],
    },
    sampleContent: {
      eventTitle: "turns 30",
      hostNames: "Maya",
      date: "2026-10-12",
      time: "20:00",
      venue: "The Rooftop",
      address: "88 Skyline Avenue",
      message: "",
    },
  },
} satisfies Record<string, TemplateDefinition>;

export type TemplateId = keyof typeof templateRegistry;

export const DEFAULT_TEMPLATE_ID: TemplateId = "elegant-wedding";

export interface TemplateListItem extends TemplateDefinition {
  id: TemplateId;
}

export const templateList: TemplateListItem[] = (Object.keys(templateRegistry) as TemplateId[]).map((id) => ({
  id,
  ...templateRegistry[id],
}));

export function isTemplateId(value: string | null | undefined): value is TemplateId {
  return typeof value === "string" && Object.hasOwn(templateRegistry, value);
}

export function getTemplate(id: string | null | undefined): TemplateListItem | undefined {
  return isTemplateId(id) ? templateList.find((t) => t.id === id) : undefined;
}
