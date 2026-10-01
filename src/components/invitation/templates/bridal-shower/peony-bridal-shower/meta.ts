import type { TemplateMeta } from "../../../templateTypes";

const base = { headingFont: "Playfair Display", bodyFont: "Lora", scriptFont: "Pinyon Script", frame: { id: "oval" }, decorations: ["bouquets", "hearts"] };

export const peonyBridalShower: TemplateMeta = {
  id: "peony-bridal-shower",
  name: "Peony Bridal Shower",
  description: "A soft oval frame, a heart divider and two bouquets that meet along the foot of the card.",
  category: "bridal-shower",
  alsoSuits: ["engagement", "wedding", "general-party"],
  styles: ["romantic", "floral", "elegant"],
  layout: "framed-card",
  tier: "free",
  status: "active",
  addedAt: "2026-10-05",
  capabilities: {
    decorations: [
      { id: "bouquets", label: "Bouquets" },
      { id: "garland", label: "Leaf garland" },
      { id: "hearts", label: "Heart divider" },
    ],
    frames: ["oval", "thin-line", "double-line"],
    patterns: ["leaves", "dots"],
    backgrounds: ["watercolor", "wash-soft", "paper-grain"],
    backgroundImage: true,
    palettes: "any",
    fontPairings: ["romantic-script", "garden", "heirloom", "classic-serif"],
  },
  presets: [
    { id: "blush", name: "Blush", design: { ...base, backgroundColor: "#FBEFEC", textColor: "#4A3535", accentColor: "#B5736B", secondaryColor: "#D9A9A0", background: { id: "watercolor", opacity: 0.4 } } },
    { id: "sage", name: "Sage", design: { ...base, backgroundColor: "#EEF0E8", textColor: "#3E4A39", accentColor: "#6F8560", secondaryColor: "#C98F86" } },
    { id: "dusty-blue", name: "Dusty Blue", design: { ...base, backgroundColor: "#F1F4F7", textColor: "#2F3D50", accentColor: "#6F8CAB", secondaryColor: "#D7A5A5", frame: { id: "double-line" } } },
  ],
  sampleContent: { eventTitle: "A bridal shower for", hostNames: "Claire", date: "2026-04-25", time: "11:00", venue: "The Tea House" },
};
