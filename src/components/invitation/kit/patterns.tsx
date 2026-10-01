import type { ReactNode } from "react";
import type { KitPiece, KitPieceProps } from "./types";
import { svgBase, useUid } from "./types";

/*
 * Patterns repeat a small tile across the whole card. Tile sizes are in the card's 100 x 125 units,
 * so the density looks the same at every preview size.
 */

function Tile({ color, opacity, className, width, height, children }: KitPieceProps & { width: number; height: number; children: ReactNode }) {
  const id = useUid();
  return (
    <svg {...svgBase} viewBox="0 0 100 125" preserveAspectRatio="xMidYMid slice" className={className ?? "pointer-events-none absolute inset-0 size-full"}>
      <defs>
        <pattern id={id} width={width} height={height} patternUnits="userSpaceOnUse" fill={color} stroke={color}>
          {children}
        </pattern>
      </defs>
      <rect width="100" height="125" fill={`url(#${id})`} opacity={opacity} />
    </svg>
  );
}

const Dots = (p: KitPieceProps) => (
  <Tile {...p} opacity={p.opacity ?? 0.14} width={7} height={7}>
    <circle cx="3.5" cy="3.5" r="1" stroke="none" />
  </Tile>
);

const Confetti = (p: KitPieceProps) => (
  <Tile {...p} opacity={p.opacity ?? 0.3} width={22} height={22}>
    <rect x="3" y="4" width="3.2" height="1.2" transform="rotate(30 4.6 4.6)" stroke="none" />
    <circle cx="14" cy="6" r="1.1" stroke="none" />
    <rect x="9" y="14" width="1.2" height="3.4" transform="rotate(-25 9.6 15.7)" stroke="none" />
    <path d="M17 17q1.2-1.6 2.4 0t2.4 0" fill="none" strokeWidth="0.5" strokeLinecap="round" />
    <circle cx="4" cy="18" r="0.8" stroke="none" />
  </Tile>
);

const Stripes = (p: KitPieceProps) => (
  <Tile {...p} opacity={p.opacity ?? 0.1} width={8} height={8}>
    <rect width="4" height="8" stroke="none" />
  </Tile>
);

const Checks = (p: KitPieceProps) => (
  <Tile {...p} opacity={p.opacity ?? 0.08} width={12} height={12}>
    <rect width="6" height="6" stroke="none" />
    <rect x="6" y="6" width="6" height="6" stroke="none" />
  </Tile>
);

const DecoFans = (p: KitPieceProps) => (
  <Tile {...p} opacity={p.opacity ?? 0.24} width={12} height={8}>
    <g fill="none" strokeWidth="0.25">
      <path d="M0 8A6 6 0 0 1 12 8M2 8A4 4 0 0 1 10 8M4 8A2 2 0 0 1 8 8" />
      <path d="M-6 4A6 6 0 0 1 6 4M-4 4A4 4 0 0 1 4 4M-2 4A2 2 0 0 1 2 4M6 4A6 6 0 0 1 18 4M8 4A4 4 0 0 1 16 4M10 4A2 2 0 0 1 14 4" />
    </g>
  </Tile>
);

const LeafToile = (p: KitPieceProps) => (
  <Tile {...p} opacity={p.opacity ?? 0.14} width={16} height={16}>
    <g fill="none" strokeWidth="0.3" strokeLinecap="round">
      <path d="M3 14Q6 8 11 4" />
      <ellipse cx="6" cy="9" rx="3" ry="1.1" transform="rotate(-50 6 9)" fill={p.color} stroke="none" />
      <ellipse cx="9" cy="6.5" rx="2.6" ry="1" transform="rotate(-50 9 6.5)" fill={p.color} stroke="none" />
      <ellipse cx="12" cy="14" rx="2.2" ry="0.9" transform="rotate(20 12 14)" fill={p.color} stroke="none" />
    </g>
  </Tile>
);

const Stars = (p: KitPieceProps) => (
  <Tile {...p} opacity={p.opacity ?? 0.2} width={16} height={16}>
    <path d="M4 1.5L4.7 3.3L6.5 4L4.7 4.7L4 6.5L3.3 4.7L1.5 4L3.3 3.3Z" stroke="none" />
    <path d="M12 10L12.4 11.2L13.6 11.6L12.4 12L12 13.2L11.6 12L10.4 11.6L11.6 11.2Z" stroke="none" />
  </Tile>
);

const Diamonds = (p: KitPieceProps) => (
  <Tile {...p} opacity={p.opacity ?? 0.22} width={10} height={10}>
    <path d="M5 1L9 5L5 9L1 5Z" fill="none" strokeWidth="0.25" />
    <circle cx="5" cy="5" r="0.5" stroke="none" />
  </Tile>
);

export const patterns: KitPiece[] = [
  { id: "dots", kind: "pattern", label: "Dots", tags: ["playful", "modern", "minimal"], colorSlots: ["accent"], component: Dots },
  { id: "confetti", kind: "pattern", label: "Confetti", tags: ["playful", "colorful"], colorSlots: ["accent"], component: Confetti },
  { id: "stripes", kind: "pattern", label: "Stripes", tags: ["modern", "playful", "vintage"], colorSlots: ["accent"], component: Stripes },
  { id: "checks", kind: "pattern", label: "Checks", tags: ["modern", "minimal", "rustic"], colorSlots: ["accent"], component: Checks },
  { id: "deco-fans", kind: "pattern", label: "Deco fans", tags: ["luxury", "vintage", "elegant"], colorSlots: ["accent"], component: DecoFans },
  { id: "leaves", kind: "pattern", label: "Leaves", tags: ["botanical", "floral", "rustic"], colorSlots: ["accent"], component: LeafToile },
  { id: "stars", kind: "pattern", label: "Stars", tags: ["playful", "colorful", "luxury"], colorSlots: ["accent"], component: Stars },
  { id: "diamonds", kind: "pattern", label: "Diamonds", tags: ["traditional", "vintage", "luxury"], colorSlots: ["accent"], component: Diamonds },
];
