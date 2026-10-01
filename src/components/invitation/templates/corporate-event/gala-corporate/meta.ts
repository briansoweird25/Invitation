import type { TemplateMeta } from "../../../templateTypes";

const base = { headingFont: "Cinzel", bodyFont: "Montserrat" };

export const galaCorporate: TemplateMeta = {
  id: "gala-corporate",
  name: "Gala Corporate",
  description: "A tall date column in the accent color beside a refined, capitalised invitation.",
  category: "corporate-event",
  alsoSuits: ["dinner-party", "retirement", "general-party"],
  styles: ["luxury", "elegant", "modern"],
  layout: "split",
  tier: "premium",
  status: "active",
  addedAt: "2026-10-12",
  capabilities: {
    decorations: [],
    frames: [],
    patterns: ["diamonds"],
    backgrounds: ["foil-sheen", "vignette", "paper-grain"],
    backgroundImage: true,
    palettes: "any",
    fontPairings: ["luxe-caps", "supper-club", "deco-display", "fashion-serif"],
  },
  presets: [
    { id: "black-tie", name: "Black Tie", design: { ...base, backgroundColor: "#12141A", textColor: "#F1EBDD", accentColor: "#C9A55C" } },
    { id: "navy-silver", name: "Navy & Silver", design: { ...base, backgroundColor: "#F3F5F8", textColor: "#16233A", accentColor: "#1B2B4B", background: { id: "paper-grain" } } },
    { id: "burgundy", name: "Burgundy", design: { ...base, backgroundColor: "#F7F0E8", textColor: "#3A1B22", accentColor: "#6E1F33" } },
  ],
  sampleContent: { eventTitle: "Annual Gala 2026", hostNames: "Northwind Co.", date: "2026-09-10", time: "18:00", venue: "The Grand Hall" },
};
