import type { TemplateMeta } from "../../../templateTypes";

const base = { headingFont: "Cormorant Garamond", bodyFont: "Inter" };

export const floralWedding: TemplateMeta = {
  id: "floral-wedding",
  name: "Floral Wedding",
  description: "Soft botanical details and an asymmetric, natural composition.",
  category: "wedding",
  styles: ["floral", "romantic", "botanical"],
  layout: "asymmetric",
  tier: "premium",
  status: "active",
  featured: true,
  addedAt: "2026-01-01",
  capabilities: {
    decorations: [
      { id: "sprigs", label: "Botanical sprigs" },
      { id: "corner-bouquet", label: "Corner bouquet" },
      { id: "garland", label: "Leaf garland" },
    ],
    frames: ["thin-line", "double-line"],
    patterns: ["leaves"],
    backgrounds: ["watercolor", "wash-soft", "paper-grain"],
    backgroundImage: true,
    palettes: "any",
    fontPairings: ["garden", "romantic-script", "classic-serif", "engraved", "rustic-hand"],
  },
  presets: [
    {
      id: "sage-garden",
      name: "Sage Garden",
      design: { ...base, backgroundColor: "#EEF0E8", textColor: "#3E4A39", accentColor: "#7C8F6B", decorations: ["sprigs"] },
    },
    {
      id: "blush-garden",
      name: "Blush Garden",
      design: {
        ...base,
        backgroundColor: "#FBEFEC",
        textColor: "#4A3535",
        accentColor: "#B5736B",
        secondaryColor: "#7C8F6B",
        background: { id: "wash-soft" },
        decorations: ["sprigs", "corner-bouquet"],
      },
    },
    {
      id: "evening-garden",
      name: "Evening Garden",
      design: {
        ...base,
        backgroundColor: "#24332B",
        textColor: "#EEF0E8",
        accentColor: "#A3B391",
        secondaryColor: "#D9A9A0",
        background: { id: "watercolor" },
        decorations: ["garland"],
      },
    },
  ],
  sampleContent: {
    eventTitle: "You are invited to celebrate",
    hostNames: "Sofia & Daniel",
    date: "2026-09-20",
    time: "16:00",
    venue: "Olive Grove Estate",
    address: "48 Hillside Road, Sonoma",
    message: "We would be honored to have you with us as we say I do.",
  },
};
