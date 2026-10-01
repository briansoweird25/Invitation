import type { TemplateMeta } from "../../../templateTypes";

const base = { headingFont: "Cormorant Garamond", bodyFont: "Inter" };

export const elegantWedding: TemplateMeta = {
  id: "elegant-wedding",
  name: "Elegant Wedding",
  description: "Classic serif type, a fine frame and a quiet neutral palette.",
  category: "wedding",
  styles: ["elegant", "traditional"],
  layout: "centered-classic",
  tier: "free",
  status: "active",
  featured: true,
  addedAt: "2026-01-01",
  capabilities: {
    decorations: [
      { id: "flourish", label: "Flourish divider" },
      { id: "corner-flourish", label: "Corner flourishes" },
    ],
    frames: ["thin-line", "double-line", "notched-corners", "corner-brackets", "foil-double"],
    patterns: [],
    backgrounds: ["paper-grain", "linen", "wash-soft", "vignette"],
    backgroundImage: true,
    palettes: "any",
    fontPairings: ["classic-serif", "romantic-script", "garden", "luxe-caps", "deco-display", "engraved", "fashion-serif"],
  },
  presets: [
    {
      id: "ivory-gold",
      name: "Ivory & Gold",
      design: { ...base, backgroundColor: "#F6F1E8", textColor: "#3A3128", accentColor: "#8A7352", frame: { id: "thin-line" }, decorations: [] },
    },
    {
      id: "blush-peony",
      name: "Blush Peony",
      design: {
        headingFont: "Playfair Display",
        bodyFont: "Lora",
        backgroundColor: "#FBEFEC",
        textColor: "#4A3535",
        accentColor: "#B5736B",
        frame: { id: "double-line" },
        decorations: ["flourish"],
      },
    },
    {
      id: "midnight-foil",
      tier: "premium",
      name: "Midnight Foil",
      design: {
        ...base,
        backgroundColor: "#1F2430",
        textColor: "#F2EDE4",
        accentColor: "#C8A96A",
        secondaryColor: "#8C7A4E",
        frame: { id: "foil-double" },
        background: { id: "wash-soft" },
        decorations: ["corner-flourish"],
      },
    },
  ],
  sampleContent: { date: "2026-06-14", time: "16:00" },
};
