import type { TemplateMeta } from "../../../templateTypes";

const base = { headingFont: "Bodoni Moda", bodyFont: "Lora", scriptFont: "Pinyon Script", decorations: ["flourish"] };

export const supperDinnerParty: TemplateMeta = {
  id: "supper-dinner-party",
  name: "Supper Dinner Party",
  description: "A menu-card layout: the headline, then date, time and place as three centered courses.",
  category: "dinner-party",
  alsoSuits: ["anniversary", "engagement", "general-party"],
  styles: ["elegant", "vintage", "editorial"],
  layout: "framed-card",
  tier: "free",
  status: "active",
  addedAt: "2026-10-11",
  capabilities: {
    decorations: [{ id: "flourish", label: "Flourish" }],
    frames: ["double-line", "thin-line", "foil-double"],
    patterns: ["dots"],
    backgrounds: ["paper-grain", "linen", "vignette"],
    backgroundImage: true,
    palettes: "any",
    fontPairings: ["supper-club", "fashion-serif", "engraved", "classic-serif", "heirloom"],
  },
  presets: [
    { id: "forest-gold", name: "Forest & Gold", design: { ...base, backgroundColor: "#1F3329", textColor: "#EFE8D4", accentColor: "#D3B565", secondaryColor: "#A3B391", frame: { id: "double-line" }, background: { id: "vignette" } } },
    { id: "linen-ink", name: "Linen & Ink", design: { ...base, backgroundColor: "#F5EFE3", textColor: "#23262E", accentColor: "#8A3B2E", secondaryColor: "#6F7B4D", frame: { id: "thin-line" }, background: { id: "linen" } } },
    { id: "plum-cream", name: "Plum & Cream", design: { ...base, backgroundColor: "#3A1F32", textColor: "#F6EBDD", accentColor: "#E2B77A", secondaryColor: "#B98AA7", frame: { id: "foil-double" } } },
  ],
  sampleContent: { eventTitle: "An evening of food and friends", hostNames: "Hosted by Elena", date: "2026-10-24", time: "20:00", venue: "Elena's Table" },
};
