import type { TemplateMeta } from "../../../templateTypes";

const base = { headingFont: "Fraunces", bodyFont: "DM Sans", decorations: ["plate", "rim"] };

export const plateDinnerParty: TemplateMeta = {
  id: "plate-dinner-party",
  name: "Plate Dinner Party",
  description: "A big round plate holds the headline, with the host and details set below like place cards.",
  category: "dinner-party",
  alsoSuits: ["general-party", "corporate-event"],
  styles: ["rustic", "modern", "colorful"],
  layout: "badge-seal",
  tier: "free",
  status: "active",
  addedAt: "2026-10-11",
  capabilities: {
    decorations: [
      { id: "plate", label: "Tinted plate" },
      { id: "rim", label: "Inner rim" },
    ],
    frames: ["thin-line"],
    patterns: ["checks", "dots"],
    backgrounds: ["linen", "paper-grain", "wash-soft"],
    backgroundImage: true,
    palettes: "any",
    fontPairings: ["magazine", "poster-serif", "garden", "geometric"],
  },
  presets: [
    { id: "terracotta", name: "Terracotta", design: { ...base, backgroundColor: "#F5E6DA", textColor: "#3D2218", accentColor: "#B4532A", secondaryColor: "#E2A27D", background: { id: "linen" } } },
    { id: "olive-oil", name: "Olive Oil", design: { ...base, backgroundColor: "#F3F1DF", textColor: "#2E3320", accentColor: "#6B7B2E", secondaryColor: "#C8CC8C" } },
    { id: "wine", name: "Red Wine", design: { ...base, backgroundColor: "#2B1420", textColor: "#F5E9DE", accentColor: "#D98A8A", secondaryColor: "#8E3B52" } },
  ],
  sampleContent: { eventTitle: "An evening of food and friends", hostNames: "Hosted by Elena", date: "2026-10-24", time: "20:00", venue: "Elena's Table" },
};
