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
  "minimal-wedding": () => import("./templates/wedding/minimal-wedding").then((m) => ({ default: m.MinimalWedding })),
  "modern-birthday": () => import("./templates/birthday/modern-birthday").then((m) => ({ default: m.ModernBirthday })),
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
