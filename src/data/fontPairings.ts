import type { TemplateStyle } from "./taxonomy";

export interface FontPairing {
  /** Permanent, kebab-case. */
  id: string;
  name: string;
  heading: string;
  body: string;
  /** For names and short flourishes only, never for dates, addresses or body text. */
  script?: string;
  tags: TemplateStyle[];
}

/** Curated pairings. Font names must exist in `lib/fonts.ts` (checked by `npm run check:templates`). */
export const fontPairings: FontPairing[] = [
  { id: "classic-serif", name: "Classic serif", heading: "Cormorant Garamond", body: "Inter", tags: ["elegant", "traditional"] },
  { id: "romantic-script", name: "Romantic script", heading: "Playfair Display", body: "Lora", script: "Pinyon Script", tags: ["romantic", "floral"] },
  { id: "garden", name: "Garden", heading: "Cormorant Garamond", body: "DM Sans", script: "Great Vibes", tags: ["botanical", "floral", "romantic"] },
  { id: "luxe-caps", name: "Luxe caps", heading: "Cinzel", body: "Montserrat", tags: ["luxury"] },
  { id: "deco-display", name: "Deco display", heading: "Italiana", body: "DM Sans", tags: ["luxury", "vintage"] },
  { id: "engraved", name: "Engraved", heading: "Libre Baskerville", body: "Lora", tags: ["traditional", "vintage"] },
  { id: "poster-serif", name: "Poster serif", heading: "DM Serif Display", body: "DM Sans", tags: ["vintage", "editorial", "playful"] },
  { id: "fat-display", name: "Fat display", heading: "Abril Fatface", body: "Lora", tags: ["vintage", "editorial"] },
  { id: "magazine", name: "Magazine", heading: "Fraunces", body: "Inter", tags: ["editorial", "modern"] },
  { id: "fashion-serif", name: "Fashion serif", heading: "Bodoni Moda", body: "DM Sans", tags: ["editorial", "luxury"] },
  { id: "clean-grotesk", name: "Clean grotesk", heading: "Inter", body: "Inter", tags: ["modern", "minimal"] },
  { id: "geometric", name: "Geometric", heading: "Manrope", body: "Inter", tags: ["modern", "minimal"] },
  { id: "friendly-round", name: "Friendly round", heading: "Fredoka", body: "Nunito", tags: ["playful", "colorful"] },
  { id: "brush-party", name: "Brush party", heading: "Baloo 2", body: "Nunito", script: "Pacifico", tags: ["playful", "colorful"] },
  { id: "rustic-hand", name: "Rustic hand", heading: "Amatic SC", body: "Lora", script: "Caveat", tags: ["rustic"] },
];

export function getFontPairing(id: string | undefined): FontPairing | undefined {
  return fontPairings.find((p) => p.id === id);
}
