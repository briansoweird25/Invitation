export type FontKind = "serif" | "sans" | "display" | "script" | "hand";

export interface FontOption {
  /** What is stored in `InvitationDesign`. */
  name: string;
  stack: string;
  kind: FontKind;
  /**
   * Loads the font's CSS (and so its files) the first time it is used.
   * Fonts the application UI already uses are bundled statically and have no loader.
   */
  load?: () => Promise<unknown>;
}

const serif = 'Georgia, "Times New Roman", serif';
const sans = "ui-sans-serif, system-ui, sans-serif";
const cursive = 'cursive, "Brush Script MT", serif';

/** Fonts available to invitations. All are open-licensed and served through @fontsource packages. */
export const fontOptions: FontOption[] = [
  // Bundled with the app UI
  { name: "Cormorant Garamond", stack: `"Cormorant Garamond", ${serif}`, kind: "serif" },
  { name: "Inter", stack: `"Inter Variable", Inter, ${sans}`, kind: "sans" },
  // Loaded on demand
  { name: "Playfair Display", stack: `"Playfair Display Variable", ${serif}`, kind: "serif", load: () => Promise.all([import("@fontsource-variable/playfair-display/index.css"), import("@fontsource-variable/playfair-display/wght-italic.css")]) },
  { name: "Lora", stack: `"Lora Variable", ${serif}`, kind: "serif", load: () => Promise.all([import("@fontsource-variable/lora/index.css"), import("@fontsource-variable/lora/wght-italic.css")]) },
  { name: "Libre Baskerville", stack: `"Libre Baskerville Variable", ${serif}`, kind: "serif", load: () => import("@fontsource-variable/libre-baskerville/index.css") },
  { name: "Fraunces", stack: `"Fraunces Variable", ${serif}`, kind: "serif", load: () => import("@fontsource-variable/fraunces/index.css") },
  { name: "Bodoni Moda", stack: `"Bodoni Moda Variable", ${serif}`, kind: "serif", load: () => import("@fontsource-variable/bodoni-moda/index.css") },
  { name: "Cinzel", stack: `"Cinzel Variable", ${serif}`, kind: "display", load: () => import("@fontsource-variable/cinzel/index.css") },
  { name: "Italiana", stack: `"Italiana", ${serif}`, kind: "display", load: () => import("@fontsource/italiana/400.css") },
  { name: "DM Serif Display", stack: `"DM Serif Display", ${serif}`, kind: "display", load: () => import("@fontsource/dm-serif-display/400.css") },
  { name: "Abril Fatface", stack: `"Abril Fatface", ${serif}`, kind: "display", load: () => import("@fontsource/abril-fatface/400.css") },
  { name: "DM Sans", stack: `"DM Sans Variable", ${sans}`, kind: "sans", load: () => import("@fontsource-variable/dm-sans/index.css") },
  { name: "Montserrat", stack: `"Montserrat Variable", ${sans}`, kind: "sans", load: () => import("@fontsource-variable/montserrat/index.css") },
  { name: "Manrope", stack: `"Manrope Variable", ${sans}`, kind: "sans", load: () => import("@fontsource-variable/manrope/index.css") },
  { name: "Nunito", stack: `"Nunito Variable", ${sans}`, kind: "sans", load: () => import("@fontsource-variable/nunito/index.css") },
  { name: "Fredoka", stack: `"Fredoka Variable", ${sans}`, kind: "display", load: () => import("@fontsource-variable/fredoka/index.css") },
  { name: "Baloo 2", stack: `"Baloo 2 Variable", ${sans}`, kind: "display", load: () => import("@fontsource-variable/baloo-2/index.css") },
  { name: "Amatic SC", stack: `"Amatic SC", ${sans}`, kind: "hand", load: () => Promise.all([import("@fontsource/amatic-sc/400.css"), import("@fontsource/amatic-sc/700.css")]) },
  { name: "Caveat", stack: `"Caveat Variable", ${cursive}`, kind: "hand", load: () => import("@fontsource-variable/caveat/index.css") },
  { name: "Pacifico", stack: `"Pacifico", ${cursive}`, kind: "script", load: () => import("@fontsource/pacifico/400.css") },
  { name: "Pinyon Script", stack: `"Pinyon Script", ${cursive}`, kind: "script", load: () => import("@fontsource/pinyon-script/400.css") },
  { name: "Great Vibes", stack: `"Great Vibes", ${cursive}`, kind: "script", load: () => import("@fontsource/great-vibes/400.css") },
];

const byName = new Map(fontOptions.map((f) => [f.name, f]));

export function getFont(name: string): FontOption | undefined {
  return byName.get(name);
}

/** Turns a stored font name into a CSS font-family value. */
export function resolveFont(name: string): string {
  return byName.get(name)?.stack ?? `"${name}", ${sans}`;
}

const loading = new Map<string, Promise<unknown>>();

/** Loads a font once. Safe to call repeatedly. Failures are ignored; the fallback stack is used. */
export function ensureFontLoaded(name: string): Promise<unknown> {
  const font = byName.get(name);
  if (!font?.load) return Promise.resolve();
  let promise = loading.get(name);
  if (!promise) {
    promise = font.load().catch(() => undefined);
    loading.set(name, promise);
  }
  return promise;
}
