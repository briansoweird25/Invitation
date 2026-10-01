import type { TemplateMeta } from "../../../templateTypes";

const base = { headingFont: "Cormorant Garamond", bodyFont: "Lora", scriptFont: "Pinyon Script", decorations: ["cross", "sparkles"] };

export const blessingBaptism: TemplateMeta = {
  id: "blessing-baptism",
  name: "Blessing Baptism",
  description: "A small cross, a script name and calm, centered details inside an arched frame.",
  category: "baptism",
  alsoSuits: ["communion"],
  styles: ["traditional", "elegant", "minimal"],
  layout: "centered-classic",
  tier: "free",
  status: "active",
  addedAt: "2026-10-08",
  capabilities: {
    decorations: [
      { id: "cross", label: "Cross" },
      { id: "sparkles", label: "Sparkles" },
    ],
    frames: ["arch-window", "thin-line", "double-line"],
    patterns: ["dots", "stars"],
    backgrounds: ["wash-soft", "wash-dawn", "paper-grain"],
    backgroundImage: true,
    palettes: "any",
    fontPairings: ["classic-serif", "heirloom", "romantic-script", "engraved"],
  },
  presets: [
    { id: "pearl", name: "Pearl", design: { ...base, backgroundColor: "#FBFAF6", textColor: "#34404F", accentColor: "#7C8EA8", secondaryColor: "#C8A96A", frame: { id: "arch-window" } } },
    { id: "blush", name: "Blush", design: { ...base, backgroundColor: "#FBF1EE", textColor: "#4A3A3C", accentColor: "#B88A86", secondaryColor: "#D9B99B", frame: { id: "thin-line" }, background: { id: "wash-soft" } } },
    { id: "heaven", name: "Heaven", design: { ...base, backgroundColor: "#EEF3F9", textColor: "#243349", accentColor: "#5F7FA8", secondaryColor: "#E8CF8F", frame: { id: "double-line" }, background: { id: "wash-dawn" } } },
  ],
  sampleContent: { eventTitle: "The baptism of", hostNames: "Lucas Michael", date: "2026-05-02", time: "11:00", venue: "St. Mary's Church" },
};
