import type { TemplateMeta } from "../../../templateTypes";

const base = { headingFont: "Playfair Display", bodyFont: "Lora", decorations: ["corners", "seal"] };

export const distinguishedRetirement: TemplateMeta = {
  id: "distinguished-retirement",
  name: "Distinguished Retirement",
  description: "A certificate-style card with corner flourishes, a two-column When and Where and a seal.",
  category: "retirement",
  alsoSuits: ["anniversary", "graduation", "corporate-event"],
  styles: ["traditional", "elegant", "vintage"],
  layout: "framed-card",
  tier: "free",
  status: "active",
  addedAt: "2026-10-10",
  capabilities: {
    decorations: [
      { id: "corners", label: "Corner flourishes" },
      { id: "seal", label: "Seal" },
    ],
    frames: ["double-line", "foil-double", "notched-corners", "thin-line"],
    patterns: ["diamonds", "dots"],
    backgrounds: ["paper-grain", "vignette", "linen"],
    backgroundImage: true,
    palettes: "any",
    fontPairings: ["romantic-script", "engraved", "heirloom", "classic-serif", "supper-club"],
  },
  presets: [
    { id: "navy-burgundy", name: "Navy & Burgundy", design: { ...base, backgroundColor: "#F4F1EA", textColor: "#1F2A44", accentColor: "#7A1F2B", secondaryColor: "#B79B5A", frame: { id: "double-line" } } },
    { id: "parchment", name: "Parchment", design: { ...base, backgroundColor: "#F1E6CF", textColor: "#2F2A22", accentColor: "#8B3A2F", secondaryColor: "#2F4A58", frame: { id: "notched-corners" }, background: { id: "paper-grain" } } },
    { id: "oxford-green", name: "Oxford Green", design: { ...base, backgroundColor: "#1F3329", textColor: "#EFE8D4", accentColor: "#D3B565", secondaryColor: "#A3B391", frame: { id: "foil-double" }, background: { id: "vignette" } } },
  ],
  sampleContent: { eventTitle: "is retiring", hostNames: "Dr. Alan Brooks", date: "2026-12-04", time: "18:00", venue: "The Oak Room" },
};
