import type { TemplateMeta } from "../../../templateTypes";

const base = { headingFont: "Cormorant Garamond", bodyFont: "DM Sans" };

export const moonlightBabyShower: TemplateMeta = {
  id: "moonlight-baby-shower",
  name: "Moonlight Baby Shower",
  description: "A crescent moon and a few stars over calm, centered details.",
  category: "baby-shower",
  alsoSuits: ["baptism"],
  styles: ["romantic", "modern", "minimal"],
  layout: "centered-classic",
  tier: "free",
  status: "active",
  addedAt: "2026-10-02",
  capabilities: {
    decorations: [
      { id: "moon", label: "Crescent moon" },
      { id: "stars", label: "Sparkles" },
    ],
    frames: ["thin-line", "double-line", "arch-window"],
    patterns: ["stars", "dots"],
    backgrounds: ["vignette", "wash-dawn", "foil-sheen"],
    backgroundImage: true,
    palettes: "any",
    fontPairings: ["garden", "classic-serif", "romantic-script", "geometric", "clean-grotesk"],
  },
  presets: [
    {
      id: "midnight-blue",
      name: "Midnight Blue",
      design: {
        ...base,
        scriptFont: "Great Vibes",
        backgroundColor: "#1B2A49",
        textColor: "#F4EEDC",
        accentColor: "#E8CF8F",
        secondaryColor: "#9FB4D9",
        pattern: { id: "stars", opacity: 0.12 },
        decorations: ["moon", "stars"],
      },
    },
    {
      id: "daybreak",
      name: "Daybreak",
      design: {
        ...base,
        backgroundColor: "#F3EFE8",
        textColor: "#2B3350",
        accentColor: "#C99A6B",
        secondaryColor: "#A8B5D1",
        background: { id: "wash-dawn" },
        decorations: ["moon", "stars"],
      },
    },
    {
      id: "plum-night",
      tier: "premium",
      name: "Plum Night",
      design: {
        ...base,
        scriptFont: "Pinyon Script",
        backgroundColor: "#3A2B4D",
        textColor: "#F6E8EE",
        accentColor: "#F2B8C6",
        secondaryColor: "#C6B3E0",
        background: { id: "vignette" },
        frame: { id: "thin-line" },
        decorations: ["moon", "stars"],
      },
    },
  ],
  sampleContent: {
    eventTitle: "A baby shower for",
    hostNames: "Nina & Sam",
    date: "2026-05-16",
    time: "17:00",
    venue: "The Sunroom",
    address: "7 Greenhouse Row",
    message: "A little star is on the way. Join us under the moon.",
  },
};
