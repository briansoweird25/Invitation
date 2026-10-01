import type { TemplateMeta } from "../../../templateTypes";

const base = { headingFont: "Italiana", bodyFont: "DM Sans", frame: { id: "foil-double" }, pattern: { id: "deco-fans", opacity: 0.1 }, decorations: ["sunrise"] };

export const decoParty: TemplateMeta = {
  id: "deco-party",
  name: "Deco Party",
  description: "An art deco card with a sunrise motif, stepped rules and wide-set capitals.",
  category: "general-party",
  alsoSuits: ["dinner-party", "anniversary", "corporate-event"],
  styles: ["luxury", "vintage", "elegant"],
  layout: "centered-classic",
  tier: "premium",
  status: "active",
  addedAt: "2026-10-04",
  capabilities: {
    decorations: [{ id: "sunrise", label: "Sunrise" }],
    frames: ["foil-double", "double-line", "notched-corners"],
    patterns: ["deco-fans", "diamonds", "stripes"],
    backgrounds: ["foil-sheen", "vignette"],
    backgroundImage: true,
    palettes: "any",
    fontPairings: ["deco-display", "luxe-caps", "fashion-serif", "supper-club"],
  },
  presets: [
    { id: "noir-gold", name: "Noir & Gold", design: { ...base, backgroundColor: "#15151A", textColor: "#F2E9D2", accentColor: "#D8B45B", secondaryColor: "#8C7A4E", background: { id: "vignette" } } },
    { id: "emerald-night", name: "Emerald Night", design: { ...base, backgroundColor: "#0F3B33", textColor: "#EFE7D0", accentColor: "#D9B867", secondaryColor: "#7FB5A2", background: { id: "foil-sheen" } } },
    { id: "pearl", name: "Pearl", design: { ...base, backgroundColor: "#F3EFE7", textColor: "#222831", accentColor: "#9A7B3C", secondaryColor: "#C7A867" } },
  ],
  sampleContent: { eventTitle: "An evening of", hostNames: "Cocktails & Jazz", date: "2026-11-14", time: "20:00", venue: "The Grand Room", address: "1 Marquee Avenue" },
};
