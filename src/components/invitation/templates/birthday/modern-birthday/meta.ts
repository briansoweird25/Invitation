import type { TemplateMeta } from "../../../templateTypes";

const base = { headingFont: "Inter", bodyFont: "Inter" };

export const modernBirthday: TemplateMeta = {
  id: "modern-birthday",
  name: "Modern Birthday",
  description: "Bold display type, a vivid accent and playful shapes.",
  category: "birthday",
  styles: ["modern", "playful", "colorful"],
  layout: "typographic-poster",
  tier: "free",
  status: "active",
  featured: true,
  addedAt: "2026-01-01",
  capabilities: {
    decorations: [
      { id: "shapes", label: "Playful shapes" },
      { id: "starburst", label: "Starburst" },
    ],
    frames: ["ticket-edge", "thin-line"],
    patterns: ["confetti", "dots", "stars"],
    backgrounds: ["wash-dawn", "paper-grain"],
    backgroundImage: true,
    palettes: "any",
    fontPairings: ["clean-grotesk", "friendly-round", "brush-party", "poster-serif", "fat-display", "geometric"],
  },
  presets: [
    {
      id: "tangerine-pop",
      name: "Tangerine Pop",
      design: { ...base, backgroundColor: "#FF6B3D", textColor: "#1D1D1B", accentColor: "#FFE9D6", decorations: ["shapes"] },
    },
    {
      id: "confetti-bright",
      name: "Confetti Bright",
      design: {
        ...base,
        backgroundColor: "#FFF4D6",
        textColor: "#23233F",
        accentColor: "#F0457A",
        secondaryColor: "#2BB3A6",
        pattern: { id: "confetti", opacity: 0.4 },
        decorations: ["shapes"],
      },
    },
    {
      id: "cobalt-night",
      name: "Cobalt Night",
      design: {
        ...base,
        backgroundColor: "#10213F",
        textColor: "#FFF4D6",
        accentColor: "#F0457A",
        pattern: { id: "stars", opacity: 0.22 },
        decorations: ["shapes", "starburst"],
      },
    },
  ],
  sampleContent: { eventTitle: "turns 30", hostNames: "Maya", venue: "The Rooftop", address: "88 Skyline Avenue", date: "2026-10-12", time: "20:00", message: "" },
};
