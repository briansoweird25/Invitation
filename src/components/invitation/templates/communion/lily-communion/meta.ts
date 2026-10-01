import type { TemplateMeta } from "../../../templateTypes";

const base = { headingFont: "Cormorant Garamond", bodyFont: "DM Sans", scriptFont: "Great Vibes", decorations: ["garland", "cross", "wildflowers"] };

export const lilyCommunion: TemplateMeta = {
  id: "lily-communion",
  name: "Lily Communion",
  description: "A leaf garland, a small cross and wildflowers around a script name.",
  category: "communion",
  alsoSuits: ["baptism"],
  styles: ["floral", "romantic", "traditional"],
  layout: "centered-classic",
  tier: "free",
  status: "active",
  addedAt: "2026-10-09",
  capabilities: {
    decorations: [
      { id: "garland", label: "Leaf garland" },
      { id: "cross", label: "Cross" },
      { id: "wildflowers", label: "Wildflowers" },
    ],
    frames: ["thin-line", "double-line"],
    patterns: ["leaves", "dots"],
    backgrounds: ["watercolor", "wash-soft", "paper-grain"],
    backgroundImage: true,
    palettes: "any",
    fontPairings: ["garden", "heirloom", "romantic-script", "classic-serif"],
  },
  presets: [
    { id: "white-lily", name: "White Lily", design: { ...base, backgroundColor: "#FBFAF6", textColor: "#33402F", accentColor: "#6F8560", secondaryColor: "#C98F86" } },
    { id: "rose-veil", name: "Rose Veil", design: { ...base, backgroundColor: "#FBF0EE", textColor: "#4A3535", accentColor: "#B5736B", secondaryColor: "#8FA37A", background: { id: "wash-soft" } } },
    { id: "blue-sky", name: "Blue Sky", design: { ...base, backgroundColor: "#F1F5F9", textColor: "#263548", accentColor: "#5F82AA", secondaryColor: "#A9C0A0", background: { id: "watercolor", opacity: 0.35 } } },
  ],
  sampleContent: { eventTitle: "First Holy Communion", hostNames: "Sofia Grace", date: "2026-05-23", time: "10:30", venue: "Our Lady of Peace" },
};
