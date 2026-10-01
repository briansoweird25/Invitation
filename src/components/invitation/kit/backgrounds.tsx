import type { KitPiece, KitPieceProps } from "./types";
import { svgBase, useUid } from "./types";

/*
 * Washes and textures drawn over the card's background color.
 * Everything is SVG gradients, patterns and filters, so there are no image files to load.
 */

function Layer({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <svg {...svgBase} viewBox="0 0 100 125" preserveAspectRatio="xMidYMid slice" className={className ?? "pointer-events-none absolute inset-0 size-full"}>
      {children}
    </svg>
  );
}

function WashSoft({ color, opacity = 1, className }: KitPieceProps) {
  const id = useUid();
  return (
    <Layer className={className}>
      <defs>
        <radialGradient id={`${id}a`} cx="0" cy="0" r="85" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={color} stopOpacity="0.35" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}b`} cx="100" cy="125" r="80" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={color} stopOpacity="0.28" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <g opacity={opacity}>
        <rect width="100" height="125" fill={`url(#${id}a)`} />
        <rect width="100" height="125" fill={`url(#${id}b)`} />
      </g>
    </Layer>
  );
}

function WashDawn({ color, opacity = 1, className }: KitPieceProps) {
  const id = useUid();
  return (
    <Layer className={className}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.4" />
          <stop offset="0.65" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="100" height="125" fill={`url(#${id})`} opacity={opacity} />
    </Layer>
  );
}

function WashDiagonal({ color, secondaryColor, opacity = 1, className }: KitPieceProps) {
  const id = useUid();
  return (
    <Layer className={className}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.3" />
          <stop offset="0.5" stopColor={color} stopOpacity="0" />
          <stop offset="1" stopColor={secondaryColor ?? color} stopOpacity="0.28" />
        </linearGradient>
      </defs>
      <rect width="100" height="125" fill={`url(#${id})`} opacity={opacity} />
    </Layer>
  );
}

function Vignette({ color, opacity = 1, className }: KitPieceProps) {
  const id = useUid();
  return (
    <Layer className={className}>
      <defs>
        <radialGradient id={id} cx="50" cy="62.5" r="80" gradientUnits="userSpaceOnUse">
          <stop offset="0.55" stopColor={color} stopOpacity="0" />
          <stop offset="1" stopColor={color} stopOpacity="0.22" />
        </radialGradient>
      </defs>
      <rect width="100" height="125" fill={`url(#${id})`} opacity={opacity} />
    </Layer>
  );
}

function PaperGrain({ color, opacity = 1, className }: KitPieceProps) {
  const id = useUid();
  return (
    <Layer className={className}>
      <defs>
        <filter id={id} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" stitchTiles="stitch" result="noise" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 -0.1" />
        </filter>
      </defs>
      <rect width="100" height="125" filter={`url(#${id})`} fill={color} opacity={0.22 * opacity} style={{ mixBlendMode: "multiply" }} />
    </Layer>
  );
}

function Linen({ color, opacity = 1, className }: KitPieceProps) {
  const id = useUid();
  return (
    <Layer className={className}>
      <defs>
        <pattern id={id} width="1.1" height="1.1" patternUnits="userSpaceOnUse">
          <path d="M0 0.3H1.1M0.3 0V1.1" stroke={color} strokeWidth="0.08" />
        </pattern>
      </defs>
      <rect width="100" height="125" fill={`url(#${id})`} opacity={0.2 * opacity} />
    </Layer>
  );
}

function Watercolor({ color, secondaryColor, opacity = 1, className }: KitPieceProps) {
  const id = useUid();
  return (
    <Layer className={className}>
      <defs>
        <filter id={id} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>
      <g filter={`url(#${id})`} opacity={opacity}>
        <ellipse cx="14" cy="16" rx="38" ry="26" fill={color} opacity="0.32" />
        <ellipse cx="88" cy="108" rx="42" ry="28" fill={secondaryColor ?? color} opacity="0.3" />
        <ellipse cx="86" cy="30" rx="22" ry="16" fill={color} opacity="0.16" />
      </g>
    </Layer>
  );
}

function FoilSheen({ opacity = 1, className }: KitPieceProps) {
  const id = useUid();
  return (
    <Layer className={className}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.38" stopColor="#fff" stopOpacity="0.22" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.72" stopColor="#fff" stopOpacity="0.14" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="100" height="125" fill={`url(#${id})`} opacity={opacity} />
    </Layer>
  );
}

export const backgrounds: KitPiece[] = [
  { id: "wash-soft", kind: "background", label: "Soft wash", tags: ["romantic", "elegant", "floral"], colorSlots: ["accent"], component: WashSoft },
  { id: "wash-dawn", kind: "background", label: "Dawn wash", tags: ["romantic", "modern", "playful"], colorSlots: ["accent"], component: WashDawn },
  { id: "wash-diagonal", kind: "background", label: "Diagonal wash", tags: ["modern", "colorful", "elegant"], colorSlots: ["accent", "secondary"], component: WashDiagonal },
  { id: "vignette", kind: "background", label: "Vignette", tags: ["vintage", "luxury", "traditional"], colorSlots: ["text"], component: Vignette },
  { id: "paper-grain", kind: "background", label: "Paper grain", tags: ["vintage", "rustic", "minimal"], colorSlots: ["text"], component: PaperGrain },
  { id: "linen", kind: "background", label: "Linen", tags: ["rustic", "elegant", "minimal"], colorSlots: ["text"], component: Linen },
  { id: "watercolor", kind: "background", label: "Watercolor wash", tags: ["floral", "romantic", "botanical"], colorSlots: ["accent", "secondary"], component: Watercolor },
  { id: "foil-sheen", kind: "background", label: "Foil sheen", tags: ["luxury", "elegant"], colorSlots: [], component: FoilSheen },
];
