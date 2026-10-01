import type { TemplateMeta } from "../../../templateTypes";

const base = { headingFont: "Fraunces", bodyFont: "DM Sans", scriptFont: "Pacifico", decorations: ["bubbles", "hearts"] };

export const bubblyBridalShower: TemplateMeta = {
  id: "bubbly-bridal-shower",
  name: "Bubbly Bridal Shower",
  description: "A rounded color panel with soft bubbles, the bride's name on top and light details below.",
  category: "bridal-shower",
  alsoSuits: ["general-party", "engagement"],
  styles: ["modern", "playful", "colorful"],
  layout: "split",
  tier: "free",
  status: "active",
  addedAt: "2026-10-05",
  capabilities: {
    decorations: [
      { id: "bubbles", label: "Bubbles" },
      { id: "hearts", label: "Heart" },
    ],
    frames: ["thin-line"],
    patterns: ["dots", "confetti"],
    backgrounds: ["paper-grain", "wash-soft"],
    backgroundImage: true,
    palettes: "any",
    fontPairings: ["brush-party", "magazine", "friendly-round", "poster-serif", "geometric"],
  },
  presets: [
    { id: "rose", name: "Rosé", design: { ...base, backgroundColor: "#FFF5F2", textColor: "#4A2A33", accentColor: "#E0708A", secondaryColor: "#FFFFFF" } },
    { id: "lilac", name: "Lilac", design: { ...base, backgroundColor: "#F7F3FB", textColor: "#35264D", accentColor: "#7B5EA7", secondaryColor: "#E3D7F3" } },
    { id: "peach-fizz", name: "Peach Fizz", design: { ...base, backgroundColor: "#FFF8EE", textColor: "#4B2A1E", accentColor: "#C85A3A", secondaryColor: "#FFD9A8", background: { id: "paper-grain" } } },
  ],
  sampleContent: { eventTitle: "A bridal shower for", hostNames: "Claire", date: "2026-04-25", time: "11:00", venue: "The Tea House" },
};
