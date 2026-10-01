import type { TemplateMeta } from "../../../templateTypes";

const base = { headingFont: "Fraunces", bodyFont: "Inter", decorations: ["rings", "sun"] };

export const sunsetRetirement: TemplateMeta = {
  id: "sunset-retirement",
  name: "Sunset Retirement",
  description: "A low sun with soft rings at the foot of the card and a bold name above.",
  category: "retirement",
  alsoSuits: ["general-party", "anniversary"],
  styles: ["modern", "colorful", "minimal"],
  layout: "typographic-poster",
  tier: "free",
  status: "active",
  addedAt: "2026-10-10",
  capabilities: {
    decorations: [
      { id: "rings", label: "Sun rings" },
      { id: "sun", label: "Sun" },
    ],
    frames: ["thin-line"],
    patterns: ["dots", "stripes"],
    backgrounds: ["paper-grain", "wash-dawn", "wash-soft"],
    backgroundImage: true,
    palettes: "any",
    fontPairings: ["magazine", "poster-serif", "fashion-serif", "geometric"],
  },
  presets: [
    { id: "golden-hour", name: "Golden Hour", design: { ...base, backgroundColor: "#FFF4E0", textColor: "#3A2418", accentColor: "#E08A2E", secondaryColor: "#F2B25C" } },
    { id: "coral-dusk", name: "Coral Dusk", design: { ...base, backgroundColor: "#FCEDE8", textColor: "#40211F", accentColor: "#D9534A", secondaryColor: "#F0A090" } },
    { id: "deep-sea", name: "Deep Sea", design: { ...base, backgroundColor: "#12303D", textColor: "#F2EBDD", accentColor: "#F0A04B", secondaryColor: "#5FA8B5" } },
  ],
  sampleContent: { eventTitle: "is retiring", hostNames: "Dr. Alan Brooks", date: "2026-12-04", time: "18:00", venue: "The Oak Room" },
};
