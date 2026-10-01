import type { TemplateStyle } from "./taxonomy";

export interface Palette {
  /** Permanent, kebab-case. */
  id: string;
  name: string;
  tags: TemplateStyle[];
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  secondaryColor?: string;
}

/**
 * Curated palettes. Text on background must reach 4.5:1 contrast (checked by `npm run check:templates`).
 * The accent is for emphasis and shapes, not long text.
 */
export const palettes: Palette[] = [
  { id: "ivory-gold", name: "Ivory & Gold", tags: ["elegant", "luxury"], backgroundColor: "#F6F1E8", textColor: "#3A3128", accentColor: "#8A7352", secondaryColor: "#C8A96A" },
  { id: "midnight-foil", name: "Midnight Foil", tags: ["luxury", "elegant"], backgroundColor: "#1F2430", textColor: "#F2EDE4", accentColor: "#C8A96A", secondaryColor: "#8C7A4E" },
  { id: "sage-garden", name: "Sage Garden", tags: ["floral", "botanical", "romantic"], backgroundColor: "#EEF0E8", textColor: "#3E4A39", accentColor: "#7C8F6B", secondaryColor: "#C98F86" },
  { id: "blush-peony", name: "Blush Peony", tags: ["romantic", "floral"], backgroundColor: "#FBEFEC", textColor: "#4A3535", accentColor: "#B5736B", secondaryColor: "#D9A9A0" },
  { id: "eucalyptus", name: "Eucalyptus", tags: ["botanical", "minimal"], backgroundColor: "#E9EFEA", textColor: "#26362F", accentColor: "#5E7A6A", secondaryColor: "#B7C7B8" },
  { id: "evening-forest", name: "Evening Forest", tags: ["botanical", "floral", "luxury"], backgroundColor: "#24332B", textColor: "#EEF0E8", accentColor: "#A3B391", secondaryColor: "#D9A9A0" },
  { id: "kraft-linen", name: "Kraft & Linen", tags: ["rustic", "vintage"], backgroundColor: "#EDE3D2", textColor: "#43352A", accentColor: "#9A6B3F", secondaryColor: "#6F7B4D" },
  { id: "parchment-ink", name: "Parchment Ink", tags: ["vintage", "traditional"], backgroundColor: "#F1E6CF", textColor: "#2F2A22", accentColor: "#8B3A2F", secondaryColor: "#2F4A58" },
  { id: "navy-heritage", name: "Navy Heritage", tags: ["traditional", "elegant"], backgroundColor: "#F4F1EA", textColor: "#1F2A44", accentColor: "#7A1F2B", secondaryColor: "#B79B5A" },
  { id: "tangerine-pop", name: "Tangerine Pop", tags: ["playful", "colorful"], backgroundColor: "#FF6B3D", textColor: "#1D1D1B", accentColor: "#FFE9D6" },
  { id: "confetti-bright", name: "Confetti Bright", tags: ["playful", "colorful"], backgroundColor: "#FFF4D6", textColor: "#23233F", accentColor: "#F0457A", secondaryColor: "#2BB3A6" },
  { id: "cobalt-editorial", name: "Cobalt Editorial", tags: ["editorial", "modern"], backgroundColor: "#F5F2EC", textColor: "#10213F", accentColor: "#E4452B" },
  { id: "paper-ink", name: "Paper & Ink", tags: ["minimal", "modern"], backgroundColor: "#FBFBF9", textColor: "#1D1D1B", accentColor: "#8A867F" },
];

export function getPalette(id: string | undefined): Palette | undefined {
  return palettes.find((p) => p.id === id);
}
