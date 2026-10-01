import type { TemplateMeta } from "../../../templateTypes";

const base = { headingFont: "Cormorant Garamond", bodyFont: "Montserrat", scriptFont: "Pinyon Script", decorations: ["rays", "sparkles"] };

export const gildedAnniversary: TemplateMeta = {
  id: "gilded-anniversary",
  name: "Gilded Anniversary",
  description: "A double-ringed medallion for the milestone, with a script name and a flourish below.",
  category: "anniversary",
  alsoSuits: ["retirement", "dinner-party"],
  styles: ["luxury", "traditional", "elegant"],
  layout: "badge-seal",
  tier: "premium",
  status: "active",
  addedAt: "2026-10-07",
  capabilities: {
    decorations: [
      { id: "rays", label: "Starburst" },
      { id: "sparkles", label: "Sparkles" },
    ],
    frames: ["foil-double", "double-line", "thin-line"],
    patterns: ["diamonds", "dots"],
    backgrounds: ["foil-sheen", "vignette", "paper-grain"],
    backgroundImage: true,
    palettes: "any",
    fontPairings: ["classic-serif", "supper-club", "heirloom", "luxe-caps", "romantic-script"],
  },
  presets: [
    { id: "champagne", name: "Champagne", design: { ...base, backgroundColor: "#F7EBD9", textColor: "#4A3A22", accentColor: "#9A7326", secondaryColor: "#D8BE8A", frame: { id: "foil-double" } } },
    { id: "ruby", name: "Ruby", design: { ...base, backgroundColor: "#3A0F1B", textColor: "#F6E9E0", accentColor: "#E3BE6B", secondaryColor: "#B5495B", frame: { id: "double-line" }, background: { id: "vignette" } } },
    { id: "silver", name: "Silver", design: { ...base, backgroundColor: "#F2F3F5", textColor: "#272C36", accentColor: "#6B7A90", secondaryColor: "#B5BEC9", frame: { id: "thin-line" } } },
  ],
  sampleContent: { eventTitle: "Celebrating 25 years", hostNames: "Margaret & Robert", date: "2026-11-14", venue: "The Heritage Club" },
};
