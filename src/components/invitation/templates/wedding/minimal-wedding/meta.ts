import type { TemplateMeta } from "../../../templateTypes";

const base = { headingFont: "Inter", bodyFont: "Inter" };

export const minimalWedding: TemplateMeta = {
  id: "minimal-wedding",
  name: "Minimal Wedding",
  description: "Generous whitespace, modern type and a strict grid.",
  category: "wedding",
  styles: ["minimal", "modern"],
  layout: "editorial-grid",
  tier: "free",
  status: "active",
  addedAt: "2026-01-01",
  capabilities: {
    decorations: [{ id: "rule", label: "Divider line" }],
    frames: ["thin-line", "corner-brackets"],
    patterns: ["dots", "checks"],
    backgrounds: ["paper-grain", "linen"],
    backgroundImage: true,
    palettes: "any",
    fontPairings: ["clean-grotesk", "geometric", "magazine", "fashion-serif", "classic-serif"],
  },
  presets: [
    {
      id: "paper-ink",
      name: "Paper & Ink",
      design: { ...base, backgroundColor: "#FBFBF9", textColor: "#1D1D1B", accentColor: "#8A867F", decorations: ["rule"] },
    },
    {
      id: "eucalyptus",
      name: "Eucalyptus",
      design: {
        ...base,
        backgroundColor: "#E9EFEA",
        textColor: "#26362F",
        accentColor: "#5E7A6A",
        frame: { id: "corner-brackets" },
        decorations: ["rule"],
      },
    },
    {
      id: "cobalt-editorial",
      name: "Cobalt Editorial",
      design: { ...base, backgroundColor: "#F5F2EC", textColor: "#10213F", accentColor: "#E4452B", decorations: ["rule"] },
    },
  ],
  sampleContent: { eventTitle: "Wedding", hostNames: "Lena & Marc", venue: "Lakeside Studio, Zürich", address: "Seestrasse 20", time: "15:00", message: "" },
};
