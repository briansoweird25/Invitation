import type { TemplateMeta } from "../../../templateTypes";

const base = { headingFont: "Playfair Display", bodyFont: "Lora", decorations: ["heart", "small-hearts"] };

export const heartAnniversary: TemplateMeta = {
  id: "heart-anniversary",
  name: "Heart Anniversary",
  description: "A large soft heart behind italic names, set like a love letter.",
  category: "anniversary",
  alsoSuits: ["engagement", "wedding"],
  styles: ["romantic", "vintage", "editorial"],
  layout: "typographic-poster",
  tier: "free",
  status: "active",
  addedAt: "2026-10-07",
  capabilities: {
    decorations: [
      { id: "heart", label: "Large heart" },
      { id: "small-hearts", label: "Small hearts" },
    ],
    frames: ["thin-line", "double-line", "oval"],
    patterns: ["dots", "stripes"],
    backgrounds: ["paper-grain", "watercolor", "wash-soft"],
    backgroundImage: true,
    palettes: "any",
    fontPairings: ["romantic-script", "engraved", "poster-serif", "heirloom", "fashion-serif"],
  },
  presets: [
    { id: "rouge", name: "Rouge", design: { ...base, backgroundColor: "#FBF1EC", textColor: "#4A2227", accentColor: "#B23A48", secondaryColor: "#E58A94" } },
    { id: "sepia", name: "Sepia", design: { ...base, backgroundColor: "#F1E6CF", textColor: "#3B2E1F", accentColor: "#8B3A2F", secondaryColor: "#C48A5A", background: { id: "paper-grain" } } },
    { id: "plum", name: "Plum", design: { ...base, backgroundColor: "#2F1F3A", textColor: "#F6E8EE", accentColor: "#F2B8C6", secondaryColor: "#C57BA0" } },
  ],
  sampleContent: { eventTitle: "Celebrating 25 years", hostNames: "Margaret & Robert", date: "2026-11-14", venue: "The Heritage Club" },
};
