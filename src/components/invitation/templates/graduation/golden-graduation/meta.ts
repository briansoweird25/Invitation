import type { TemplateMeta } from "../../../templateTypes";

const base = { headingFont: "Cinzel", bodyFont: "Montserrat", decorations: ["laurel", "seal"] };

export const goldenGraduation: TemplateMeta = {
  id: "golden-graduation",
  name: "Golden Graduation",
  description: "A formal foil-framed card with a laurel wreath, a script name and a small seal.",
  category: "graduation",
  alsoSuits: ["retirement", "corporate-event"],
  styles: ["luxury", "elegant", "traditional"],
  layout: "framed-card",
  tier: "premium",
  status: "active",
  addedAt: "2026-10-03",
  capabilities: {
    decorations: [
      { id: "laurel", label: "Laurel wreath" },
      { id: "seal", label: "Seal" },
      { id: "corners", label: "Corner flourishes" },
    ],
    frames: ["foil-double", "double-line", "notched-corners", "thin-line"],
    patterns: ["diamonds", "dots"],
    backgrounds: ["foil-sheen", "vignette", "paper-grain"],
    backgroundImage: true,
    palettes: "any",
    fontPairings: ["luxe-caps", "supper-club", "classic-serif", "deco-display", "heirloom"],
  },
  presets: [
    { id: "navy-foil", name: "Navy Foil", design: { ...base, scriptFont: "Great Vibes", backgroundColor: "#14213D", textColor: "#F4F1E8", accentColor: "#E3BE6B", secondaryColor: "#8FA3C7", frame: { id: "foil-double" }, background: { id: "foil-sheen" } } },
    { id: "ivory-laurel", name: "Ivory Laurel", design: { ...base, scriptFont: "Pinyon Script", backgroundColor: "#F6F1E8", textColor: "#2E2A24", accentColor: "#8A7352", secondaryColor: "#C8A96A", frame: { id: "double-line" } } },
    { id: "emerald-gold", name: "Emerald & Gold", design: { ...base, scriptFont: "Great Vibes", backgroundColor: "#12352A", textColor: "#F1EBD8", accentColor: "#D9B867", secondaryColor: "#9DBBA8", frame: { id: "notched-corners" }, background: { id: "vignette" }, decorations: ["laurel", "seal", "corners"] } },
  ],
  sampleContent: { eventTitle: "Class of 2026", hostNames: "Jordan Lee", date: "2026-06-06", time: "15:00", venue: "The Lee Family Home" },
};
