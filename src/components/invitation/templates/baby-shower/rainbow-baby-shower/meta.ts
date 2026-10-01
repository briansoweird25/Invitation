import type { TemplateMeta } from "../../../templateTypes";

const base = { headingFont: "Fredoka", bodyFont: "Nunito" };

export const rainbowBabyShower: TemplateMeta = {
  id: "rainbow-baby-shower",
  name: "Rainbow Baby Shower",
  description: "A soft rainbow over little clouds, with rounded, friendly type.",
  category: "baby-shower",
  alsoSuits: ["birthday", "general-party"],
  styles: ["playful", "colorful"],
  layout: "split",
  tier: "free",
  status: "active",
  addedAt: "2026-10-02",
  capabilities: {
    decorations: [
      { id: "clouds", label: "Clouds" },
      { id: "sparkles", label: "Sparkles" },
    ],
    frames: ["thin-line", "double-line"],
    patterns: ["dots", "stars", "confetti"],
    backgrounds: ["wash-dawn", "paper-grain"],
    backgroundImage: true,
    palettes: "any",
    fontPairings: ["friendly-round", "brush-party", "geometric", "clean-grotesk"],
  },
  presets: [
    {
      id: "sunrise",
      name: "Sunrise",
      design: {
        ...base,
        backgroundColor: "#FFF8EC",
        textColor: "#3B2F4A",
        accentColor: "#F08A5D",
        secondaryColor: "#F9C74F",
        decorations: ["clouds", "sparkles"],
      },
    },
    {
      id: "pastel",
      name: "Pastel",
      design: {
        ...base,
        backgroundColor: "#FDF3F6",
        textColor: "#3A2E4F",
        accentColor: "#F4A6C0",
        secondaryColor: "#9ED8DB",
        pattern: { id: "dots", opacity: 0.12 },
        decorations: ["clouds"],
      },
    },
    {
      id: "sky",
      name: "Sky",
      design: {
        ...base,
        backgroundColor: "#EAF5FB",
        textColor: "#1E3A52",
        accentColor: "#6EC1E4",
        secondaryColor: "#F7C873",
        background: { id: "wash-dawn" },
        decorations: ["clouds", "sparkles"],
      },
    },
  ],
  sampleContent: {
    eventTitle: "A baby shower for",
    hostNames: "Nina & Sam",
    date: "2026-05-16",
    time: "14:00",
    venue: "The Sunroom",
    address: "7 Greenhouse Row",
    message: "Come celebrate our little ray of sunshine.",
  },
};
