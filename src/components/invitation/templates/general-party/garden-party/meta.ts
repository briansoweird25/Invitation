import type { TemplateMeta } from "../../../templateTypes";

const base = { headingFont: "Cormorant Garamond", bodyFont: "DM Sans", scriptFont: "Great Vibes", decorations: ["arch", "wildflowers"] };

export const gardenParty: TemplateMeta = {
  id: "garden-party",
  name: "Garden Party",
  description: "A soft arch, wildflowers at the foot and calm centered details.",
  category: "general-party",
  alsoSuits: ["bridal-shower", "dinner-party", "engagement"],
  styles: ["floral", "botanical", "rustic"],
  layout: "arch-window",
  tier: "free",
  status: "active",
  addedAt: "2026-10-04",
  capabilities: {
    decorations: [
      { id: "arch", label: "Arch" },
      { id: "wildflowers", label: "Wildflowers" },
    ],
    frames: ["thin-line", "arch-window"],
    patterns: ["leaves", "dots"],
    backgrounds: ["watercolor", "paper-grain", "wash-soft"],
    backgroundImage: true,
    palettes: "any",
    fontPairings: ["garden", "romantic-script", "classic-serif", "rustic-hand", "heirloom"],
  },
  presets: [
    { id: "meadow", name: "Meadow", design: { ...base, backgroundColor: "#F6F3E8", textColor: "#33402F", accentColor: "#B9626A", secondaryColor: "#8FA37A" } },
    { id: "lavender-lawn", name: "Lavender Lawn", design: { ...base, backgroundColor: "#F4F0F7", textColor: "#3A3050", accentColor: "#7C5FA3", secondaryColor: "#B9A5D6", background: { id: "watercolor", opacity: 0.4 } } },
    { id: "citrus-grove", name: "Citrus Grove", design: { ...base, backgroundColor: "#FFF8E6", textColor: "#3C3A1F", accentColor: "#C9691F", secondaryColor: "#E9B949", background: { id: "paper-grain" } } },
  ],
  sampleContent: { eventTitle: "Please join us for a", hostNames: "Garden Party", date: "2026-06-20", time: "16:00", venue: "The Walled Garden", address: "3 Orchard Lane" },
};
