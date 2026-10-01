import type { TemplateMeta } from "../../../templateTypes";

const base = { headingFont: "Amatic SC", bodyFont: "Nunito", scriptFont: "Caveat", decorations: ["squiggle", "sparkles"] };

export const chalkboardGraduation: TemplateMeta = {
  id: "chalkboard-graduation",
  name: "Chalkboard Graduation",
  description: "A hand-lettered, left-aligned card with a big chalk headline and a squiggle underline.",
  category: "graduation",
  alsoSuits: ["general-party", "birthday"],
  styles: ["playful", "modern", "colorful"],
  layout: "asymmetric",
  tier: "free",
  status: "active",
  addedAt: "2026-10-03",
  capabilities: {
    decorations: [
      { id: "squiggle", label: "Squiggle underline" },
      { id: "sparkles", label: "Sparkles" },
    ],
    frames: ["thin-line", "corner-brackets"],
    patterns: ["dots", "stars"],
    backgrounds: ["paper-grain", "wash-diagonal"],
    backgroundImage: true,
    palettes: "any",
    fontPairings: ["rustic-hand", "brush-party", "friendly-round", "clean-grotesk"],
  },
  presets: [
    { id: "slate", name: "Slate", design: { ...base, backgroundColor: "#2B3A3A", textColor: "#F1EFE6", accentColor: "#E8D9A0", secondaryColor: "#9CC5B8", pattern: { id: "dots", opacity: 0.08 } } },
    { id: "paper-pink", name: "Paper & Pink", design: { ...base, backgroundColor: "#FFF6EC", textColor: "#2A2540", accentColor: "#E2457D", secondaryColor: "#2BB3A6" } },
    { id: "sunshine", name: "Sunshine", design: { ...base, backgroundColor: "#FFD84D", textColor: "#1E1B33", accentColor: "#1E1B33", secondaryColor: "#E2457D", background: { id: "paper-grain" } } },
  ],
  sampleContent: { eventTitle: "Class of 2026", hostNames: "Jordan Lee", date: "2026-06-06", time: "15:00", venue: "The Lee Family Home" },
};
