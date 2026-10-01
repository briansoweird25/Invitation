import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import type { TemplateProps } from "@/types/invitation";

type TemplateComponent = ComponentType<TemplateProps>;

/**
 * Template components load on demand, one chunk each, so the catalog can grow without growing the app.
 * Register new templates here next to their meta in `templateCatalog.ts`.
 */
const loaders: Record<string, () => Promise<{ default: TemplateComponent }>> = {
  "elegant-wedding": () => import("./templates/wedding/elegant-wedding").then((m) => ({ default: m.ElegantWedding })),
  "floral-wedding": () => import("./templates/wedding/floral-wedding").then((m) => ({ default: m.FloralWedding })),
  "luxury-wedding": () => import("./templates/wedding/luxury-wedding").then((m) => ({ default: m.LuxuryWedding })),
  "minimal-wedding": () => import("./templates/wedding/minimal-wedding").then((m) => ({ default: m.MinimalWedding })),
  "modern-birthday": () => import("./templates/birthday/modern-birthday").then((m) => ({ default: m.ModernBirthday })),
  "confetti-birthday": () => import("./templates/birthday/confetti-birthday").then((m) => ({ default: m.ConfettiBirthday })),
  "vintage-birthday": () => import("./templates/birthday/vintage-birthday").then((m) => ({ default: m.VintageBirthday })),
  "botanical-baby-shower": () => import("./templates/baby-shower/botanical-baby-shower").then((m) => ({ default: m.BotanicalBabyShower })),
  "rainbow-baby-shower": () => import("./templates/baby-shower/rainbow-baby-shower").then((m) => ({ default: m.RainbowBabyShower })),
  "moonlight-baby-shower": () => import("./templates/baby-shower/moonlight-baby-shower").then((m) => ({ default: m.MoonlightBabyShower })),
  "editorial-birthday": () => import("./templates/birthday/editorial-birthday").then((m) => ({ default: m.EditorialBirthday })),
};

const cache = new Map<string, LazyExoticComponent<TemplateComponent>>();

/** Returns a lazily loaded component for a template id, or undefined when there is none. */
export function getTemplateComponent(id: string): LazyExoticComponent<TemplateComponent> | undefined {
  const loader = loaders[id];
  if (!loader) return undefined;
  let component = cache.get(id);
  if (!component) {
    component = lazy(loader);
    cache.set(id, component);
  }
  return component;
}
