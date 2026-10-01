import type { TemplateMeta } from "../../../templateTypes";

const base = { headingFont: "Cormorant Garamond", bodyFont: "DM Sans", scriptFont: "Great Vibes", decorations: ["olive", "rule"] };

export const oliveEngagement: TemplateMeta = {
  id: "olive-engagement",
  name: "Olive Engagement",
  description: "A left-aligned card with a script name and an olive branch along the edge.",
  category: "engagement",
  alsoSuits: ["wedding", "dinner-party", "general-party"],
  styles: ["rustic", "botanical", "romantic"],
  layout: "asymmetric",
  tier: "free",
  status: "active",
  addedAt: "2026-10-06",
  capabilities: {
    decorations: [
      { id: "olive", label: "Olive branches" },
      { id: "rule", label: "Short rule" },
    ],
    frames: ["thin-line"],
    patterns: ["leaves"],
    backgrounds: ["linen", "paper-grain", "watercolor"],
    backgroundImage: true,
    palettes: "any",
    fontPairings: ["garden", "heirloom", "romantic-script", "classic-serif", "rustic-hand"],
  },
  presets: [
    { id: "grove", name: "Grove", design: { ...base, backgroundColor: "#F3EFE4", textColor: "#2F3A2B", accentColor: "#6E7F4F", secondaryColor: "#8C9A62", background: { id: "linen" } } },
    { id: "terracotta", name: "Terracotta", design: { ...base, backgroundColor: "#F6EADF", textColor: "#3D2A20", accentColor: "#A9573A", secondaryColor: "#7B8A55", background: { id: "paper-grain" } } },
    { id: "twilight-olive", name: "Twilight Olive", design: { ...base, backgroundColor: "#26302A", textColor: "#EEF0E4", accentColor: "#B7C48A", secondaryColor: "#D9B88F" } },
  ],
  sampleContent: { eventTitle: "They said yes", hostNames: "Ana & Luis", date: "2026-03-07", time: "18:30", venue: "Casa Verde" },
};
