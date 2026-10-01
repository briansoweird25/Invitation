import type { TemplateMeta } from "../../../templateTypes";

const base = { headingFont: "Fraunces", bodyFont: "DM Sans", decorations: ["droplets", "eucalyptus"] };

export const waterBaptism: TemplateMeta = {
  id: "water-baptism",
  name: "Water Baptism",
  description: "Droplets gather in the corner above a low, left-aligned name and details.",
  category: "baptism",
  alsoSuits: ["baby-shower", "communion"],
  styles: ["minimal", "botanical", "modern"],
  layout: "asymmetric",
  tier: "free",
  status: "active",
  addedAt: "2026-10-08",
  capabilities: {
    decorations: [
      { id: "droplets", label: "Droplets" },
      { id: "eucalyptus", label: "Eucalyptus" },
    ],
    frames: ["thin-line"],
    patterns: ["dots"],
    backgrounds: ["watercolor", "wash-soft", "paper-grain"],
    backgroundImage: true,
    palettes: "any",
    fontPairings: ["magazine", "garden", "geometric", "clean-grotesk", "classic-serif"],
  },
  presets: [
    { id: "aqua", name: "Aqua", design: { ...base, backgroundColor: "#F2F7F8", textColor: "#1F3A44", accentColor: "#3C8CA3", secondaryColor: "#9CCFDC", background: { id: "watercolor", opacity: 0.35 } } },
    { id: "sage-mist", name: "Sage Mist", design: { ...base, backgroundColor: "#EEF1EA", textColor: "#2C3A30", accentColor: "#5E7A6A", secondaryColor: "#B7C7B8" } },
    { id: "sand", name: "Sand", design: { ...base, backgroundColor: "#F7F1E8", textColor: "#3C3226", accentColor: "#B08A5E", secondaryColor: "#8AA6B5", background: { id: "paper-grain" } } },
  ],
  sampleContent: { eventTitle: "The baptism of", hostNames: "Lucas Michael", date: "2026-05-02", time: "11:00", venue: "St. Mary's Church" },
};
