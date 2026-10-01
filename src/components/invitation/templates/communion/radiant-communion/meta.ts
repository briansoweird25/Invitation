import type { TemplateMeta } from "../../../templateTypes";

const base = { headingFont: "Libre Baskerville", bodyFont: "Lora", decorations: ["rays", "cross"] };

export const radiantCommunion: TemplateMeta = {
  id: "radiant-communion",
  name: "Radiant Communion",
  description: "Radiating light behind a cross, engraved capitals and a gilded frame.",
  category: "communion",
  alsoSuits: ["baptism", "anniversary"],
  styles: ["traditional", "vintage", "luxury"],
  layout: "badge-seal",
  tier: "premium",
  status: "active",
  addedAt: "2026-10-09",
  capabilities: {
    decorations: [
      { id: "rays", label: "Rays of light" },
      { id: "cross", label: "Cross" },
    ],
    frames: ["foil-double", "double-line", "oval", "thin-line"],
    patterns: ["diamonds", "stars"],
    backgrounds: ["foil-sheen", "vignette", "paper-grain"],
    backgroundImage: true,
    palettes: "any",
    fontPairings: ["engraved", "classic-serif", "supper-club", "heirloom", "luxe-caps"],
  },
  presets: [
    { id: "ivory-gold", name: "Ivory & Gold", design: { ...base, backgroundColor: "#F8F2E4", textColor: "#3A3224", accentColor: "#9A7326", secondaryColor: "#D8B65C", frame: { id: "foil-double" } } },
    { id: "navy-gold", name: "Navy & Gold", design: { ...base, backgroundColor: "#16243F", textColor: "#F4EEDC", accentColor: "#E3BE6B", secondaryColor: "#E3BE6B", frame: { id: "double-line" }, background: { id: "vignette" } } },
    { id: "white-silver", name: "White & Silver", design: { ...base, backgroundColor: "#F7F8FA", textColor: "#2A3140", accentColor: "#6F7E95", secondaryColor: "#B8C2D2", frame: { id: "oval" } } },
  ],
  sampleContent: { eventTitle: "First Holy Communion", hostNames: "Sofia Grace", date: "2026-05-23", time: "10:30", venue: "Our Lady of Peace" },
};
