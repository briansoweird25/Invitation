import type { TemplateMeta } from "../../../templateTypes";

const base = { headingFont: "Manrope", bodyFont: "Inter", decorations: ["blocks"] };

export const summitCorporate: TemplateMeta = {
  id: "summit-corporate",
  name: "Summit Corporate",
  description: "A Swiss-style grid: a big left-aligned event name above a ruled details table.",
  category: "corporate-event",
  alsoSuits: ["general-party", "graduation"],
  styles: ["modern", "minimal", "editorial"],
  layout: "editorial-grid",
  tier: "free",
  status: "active",
  addedAt: "2026-10-12",
  capabilities: {
    decorations: [{ id: "blocks", label: "Geometric blocks" }],
    frames: ["corner-brackets", "thin-line"],
    patterns: ["checks", "dots"],
    backgrounds: ["paper-grain", "wash-soft"],
    backgroundImage: true,
    palettes: "any",
    fontPairings: ["geometric", "clean-grotesk", "magazine", "fashion-serif"],
  },
  presets: [
    { id: "boardroom", name: "Boardroom", design: { ...base, backgroundColor: "#F4F7FA", textColor: "#12263F", accentColor: "#1F6FEB" } },
    { id: "graphite", name: "Graphite", design: { ...base, backgroundColor: "#F2F2EF", textColor: "#1D1F23", accentColor: "#D5502A" } },
    { id: "after-hours", name: "After Hours", design: { ...base, backgroundColor: "#10151F", textColor: "#EDEFF3", accentColor: "#5FA8FF" } },
  ],
  sampleContent: { eventTitle: "Annual Summit 2026", hostNames: "Northwind Co.", date: "2026-09-10", time: "18:00", venue: "The Grand Hall" },
};
