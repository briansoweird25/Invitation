import type { TemplateMeta } from "../../../templateTypes";

const base = { headingFont: "Fredoka", bodyFont: "Nunito" };

export const confettiBirthday: TemplateMeta = {
  id: "confetti-birthday",
  name: "Confetti Birthday",
  description: "A bouncy, colorful party card with a ribbon, confetti and a dashed ticket.",
  category: "birthday",
  alsoSuits: ["baby-shower", "general-party"],
  styles: ["playful", "colorful"],
  layout: "ticket-label",
  tier: "free",
  status: "active",
  addedAt: "2026-10-01",
  capabilities: {
    decorations: [
      { id: "starbursts", label: "Starbursts" },
      { id: "squiggles", label: "Squiggles" },
    ],
    frames: ["ticket-edge", "thin-line"],
    patterns: ["confetti", "dots", "stars", "stripes"],
    backgrounds: ["wash-dawn", "wash-diagonal"],
    backgroundImage: true,
    palettes: "any",
    fontPairings: ["friendly-round", "brush-party", "clean-grotesk", "geometric"],
  },
  presets: [
    {
      id: "bubblegum",
      name: "Bubblegum",
      design: {
        ...base,
        backgroundColor: "#FFF4D6",
        textColor: "#23233F",
        accentColor: "#F0457A",
        secondaryColor: "#2BB3A6",
        frame: { id: "ticket-edge" },
        pattern: { id: "confetti", opacity: 0.35 },
        decorations: ["starbursts"],
      },
    },
    {
      id: "mint-pop",
      name: "Mint Pop",
      design: {
        ...base,
        backgroundColor: "#DFF5EC",
        textColor: "#12332B",
        accentColor: "#FF7A59",
        secondaryColor: "#F4B400",
        frame: { id: "ticket-edge" },
        pattern: { id: "dots", opacity: 0.18 },
        decorations: ["squiggles"],
      },
    },
    {
      id: "sunny-day",
      name: "Sunny Day",
      design: {
        ...base,
        backgroundColor: "#FFD23F",
        textColor: "#1D1D1B",
        accentColor: "#E4452B",
        secondaryColor: "#2F6BFF",
        pattern: { id: "stars", opacity: 0.2 },
        decorations: ["starbursts", "squiggles"],
      },
    },
  ],
  sampleContent: {
    eventTitle: "is turning 7!",
    hostNames: "Leo",
    date: "2026-07-18",
    time: "14:00",
    venue: "Bounce World",
    address: "5 Trampoline Way",
    message: "Cake, games and lots of confetti. Come and play!",
  },
};
