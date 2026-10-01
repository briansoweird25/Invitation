import type { TemplateMeta } from "../../../templateTypes";

const base = { headingFont: "Abril Fatface", bodyFont: "Manrope", decorations: ["stripes", "stars"] };

export const varsityGraduation: TemplateMeta = {
  id: "varsity-graduation",
  name: "Varsity Graduation",
  description: "A bold school-poster look: a solid headline banner, a huge name and stripe bands.",
  category: "graduation",
  alsoSuits: ["general-party"],
  styles: ["traditional", "editorial", "colorful"],
  layout: "typographic-poster",
  tier: "free",
  status: "active",
  addedAt: "2026-10-03",
  capabilities: {
    decorations: [
      { id: "stripes", label: "Stripe bands" },
      { id: "stars", label: "Sparkles" },
    ],
    frames: ["thin-line"],
    patterns: ["stripes", "checks"],
    backgrounds: ["paper-grain", "wash-soft"],
    backgroundImage: true,
    palettes: "any",
    fontPairings: ["campus", "poster-serif", "fat-display", "magazine", "clean-grotesk"],
  },
  presets: [
    { id: "navy-gold", name: "Navy & Gold", design: { ...base, backgroundColor: "#F6F1E6", textColor: "#14213D", accentColor: "#14213D", secondaryColor: "#C99A2E" } },
    { id: "maroon-cream", name: "Maroon & Cream", design: { ...base, backgroundColor: "#F6F1E6", textColor: "#3B1218", accentColor: "#8C1C2B", secondaryColor: "#B8963E", background: { id: "paper-grain" } } },
    { id: "black-and-gold", name: "Black & Gold", design: { ...base, backgroundColor: "#16161A", textColor: "#F4EFE2", accentColor: "#E3B52F", secondaryColor: "#F4EFE2" } },
    { id: "green-white", name: "Green & White", design: { ...base, backgroundColor: "#FBFAF5", textColor: "#123524", accentColor: "#1E5B3C", secondaryColor: "#D2A93C" } },
  ],
  sampleContent: { eventTitle: "Class of 2026", hostNames: "Jordan Lee", date: "2026-06-06", time: "15:00", venue: "The Lee Family Home" },
};
