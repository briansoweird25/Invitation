import { useId, type ComponentType } from "react";
import type { TemplateStyle } from "@/data/taxonomy";

export type KitKind = "frame" | "botanical" | "pattern" | "ornament" | "shape" | "background";

export type ColorSlot = "accent" | "secondary" | "text" | "background";

export interface KitPieceProps {
  /** Main color. The renderer or template passes the matching design color. */
  color: string;
  /** Optional second color. Pieces fall back to `color`. */
  secondaryColor?: string;
  /** 0 to 1. Pieces have their own sensible default. */
  opacity?: number;
  /** Sizes and positions the piece. Pieces fill the box they are given. */
  className?: string;
}

export interface KitPiece {
  id: string;
  kind: KitKind;
  label: string;
  tags: TemplateStyle[];
  /** The design colors this piece uses. The first slot supplies `color`. */
  colorSlots: ColorSlot[];
  component: ComponentType<KitPieceProps>;
}

/** A DOM-safe unique id for SVG <pattern>, <filter> and gradient definitions. */
export function useUid(): string {
  return `k${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
}

/** Shared SVG attributes: decorative, never focusable, and scaling with its box. */
export const svgBase = { "aria-hidden": true, focusable: false } as const;
