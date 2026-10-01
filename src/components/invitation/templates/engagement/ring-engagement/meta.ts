import type { TemplateMeta } from "../../../templateTypes";

const base = { headingFont: "Manrope", bodyFont: "Inter", decorations: ["rings", "gem"] };

export const ringEngagement: TemplateMeta = {
  id: "ring-engagement",
  name: "Ring Engagement",
  description: "Two interlocked rings above clean, centered names and details.",
  category: "engagement",
  alsoSuits: ["bridal-shower", "anniversary"],
  styles: ["minimal", "modern", "elegant"],
  layout: "centered-classic",
  tier: "free",
  status: "active",
  addedAt: "2026-10-06",
  capabilities: {
    decorations: [
      { id: "rings", label: "Interlocked rings" },
      { id: "gem", label: "Sparkle" },
    ],
    frames: ["thin-line", "corner-brackets"],
    patterns: ["dots"],
    backgrounds: ["paper-grain", "wash-soft", "foil-sheen"],
    backgroundImage: true,
    palettes: "any",
    fontPairings: ["geometric", "clean-grotesk", "magazine", "classic-serif"],
  },
  presets: [
    { id: "ivory-gold", name: "Ivory & Gold", design: { ...base, backgroundColor: "#FAF7F0", textColor: "#2B2823", accentColor: "#A8812F", secondaryColor: "#C9B27C" } },
    { id: "slate-rose", name: "Slate & Rose", design: { ...base, backgroundColor: "#F4F2F1", textColor: "#2A3038", accentColor: "#B8707A", secondaryColor: "#5E6B7B" } },
    { id: "midnight", name: "Midnight", tier: "premium", design: { ...base, backgroundColor: "#16202F", textColor: "#EFE9DC", accentColor: "#D9B867", secondaryColor: "#9FB1CC", background: { id: "foil-sheen" } } },
  ],
  sampleContent: { eventTitle: "They said yes", hostNames: "Ana & Luis", date: "2026-03-07", time: "18:30", venue: "Casa Verde" },
};
