import type { TemplateMeta } from "../../../templateTypes";

const base = { headingFont: "Abril Fatface", bodyFont: "DM Sans", frame: { id: "ticket-edge" }, decorations: ["burst", "sparkles"] };

export const ticketParty: TemplateMeta = {
  id: "ticket-party",
  name: "Ticket Party",
  description: "An admit-one ticket with a perforated stub for the date and place.",
  category: "general-party",
  alsoSuits: ["birthday", "corporate-event", "dinner-party"],
  styles: ["playful", "colorful", "vintage"],
  layout: "ticket-label",
  tier: "free",
  status: "active",
  addedAt: "2026-10-04",
  capabilities: {
    decorations: [
      { id: "burst", label: "Starburst" },
      { id: "sparkles", label: "Sparkles" },
    ],
    frames: ["ticket-edge", "thin-line", "corner-brackets"],
    patterns: ["dots", "stripes", "checks"],
    backgrounds: ["paper-grain", "wash-diagonal"],
    backgroundImage: true,
    palettes: "any",
    fontPairings: ["poster-serif", "fat-display", "campus", "brush-party", "magazine"],
  },
  presets: [
    { id: "carnival", name: "Carnival", design: { ...base, backgroundColor: "#FFF1D0", textColor: "#2A1B3D", accentColor: "#E8433F", secondaryColor: "#F5B82E" } },
    { id: "midnight-show", name: "Midnight Show", design: { ...base, backgroundColor: "#1E1B3A", textColor: "#F8EFD9", accentColor: "#F5B82E", secondaryColor: "#E8528A" } },
    { id: "mint-cinema", name: "Mint Cinema", design: { ...base, backgroundColor: "#E4F3EA", textColor: "#16352C", accentColor: "#E5533D", secondaryColor: "#F2C14E", pattern: { id: "dots", opacity: 0.08 } } },
  ],
  sampleContent: { eventTitle: "The Summer Send-Off", hostNames: "Alex & Friends", date: "2026-08-15", time: "19:00", venue: "The Studio" },
};
