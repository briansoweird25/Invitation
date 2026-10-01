import type { KitPiece, KitPieceProps } from "./types";
import { svgBase } from "./types";

/* Dividers, corners, wreaths and seals. Each fills the box it is given, so size it with className. */

function Svg({ className, viewBox, children }: { className?: string; viewBox: string; children: React.ReactNode }) {
  return (
    <svg {...svgBase} viewBox={viewBox} fill="none" className={className ?? "size-full"}>
      {children}
    </svg>
  );
}

function DividerDiamond({ color, opacity = 0.8, className }: KitPieceProps) {
  return (
    <Svg viewBox="0 0 100 10" className={className}>
      <g stroke={color} strokeWidth="0.5" opacity={opacity}>
        <path d="M2 5H42M58 5H98" />
        <path d="M50 1.5L53.5 5L50 8.5L46.5 5Z" fill={color} />
      </g>
    </Svg>
  );
}

function DividerFlourish({ color, opacity = 0.85, className }: KitPieceProps) {
  return (
    <Svg viewBox="0 0 100 16" className={className}>
      <g stroke={color} strokeWidth="0.6" strokeLinecap="round" opacity={opacity}>
        <path d="M4 8H34C38 8 40 4 44 4C47 4 48 6 47 8C46 10 43 10 43 8" />
        <path d="M96 8H66C62 8 60 12 56 12C53 12 52 10 53 8C54 6 57 6 57 8" />
        <circle cx="50" cy="8" r="1.2" fill={color} stroke="none" />
      </g>
    </Svg>
  );
}

function DividerDots({ color, opacity = 0.8, className }: KitPieceProps) {
  return (
    <Svg viewBox="0 0 100 10" className={className}>
      <g opacity={opacity}>
        <path d="M2 5H40M60 5H98" stroke={color} strokeWidth="0.4" />
        {[44, 50, 56].map((x) => (
          <circle key={x} cx={x} cy="5" r={x === 50 ? 1.6 : 1} fill={color} />
        ))}
      </g>
    </Svg>
  );
}

/** Drawn for the top-left corner. Rotate with a class such as `rotate-90` for the others. */
function CornerFlourish({ color, opacity = 0.85, className }: KitPieceProps) {
  return (
    <Svg viewBox="0 0 40 40" className={className}>
      <g stroke={color} strokeWidth="0.7" strokeLinecap="round" opacity={opacity}>
        <path d="M2 38V14C2 7 7 2 14 2H38" />
        <path d="M7 38V18C7 12 12 7 18 7H38" strokeWidth="0.35" />
        <path d="M14 14C14 10 18 10 18 13C18 16 14 16 14 14Z" fill={color} stroke="none" />
      </g>
    </Svg>
  );
}

/** A wreath of leaves following a ring, open at the top. */
function Laurel({ color, opacity = 0.85, className }: KitPieceProps) {
  const leaves = Array.from({ length: 21 }, (_, i) => {
    const deg = 300 + i * 15; // from the upper right, around the bottom, to the upper left
    const rad = (deg * Math.PI) / 180;
    const side = i % 2 ? 1 : -1;
    const r = 36 + side * 2.5;
    return { x: 50 + r * Math.cos(rad), y: 50 + r * Math.sin(rad), rot: deg + 90 + side * 28 };
  });
  return (
    <Svg viewBox="0 0 100 100" className={className}>
      <g opacity={opacity}>
        <path d="M68 16.5A36 36 0 1 1 32 16.5" stroke={color} strokeWidth="0.8" strokeLinecap="round" transform="rotate(180 50 50) rotate(180 50 50)" />
        {leaves.map(({ x, y, rot }, i) => (
          <ellipse key={i} cx={x} cy={y} rx="6" ry="2.3" transform={`rotate(${rot} ${x} ${y})`} fill={color} />
        ))}
      </g>
    </Svg>
  );
}

/** A scalloped badge. The center is left empty for a monogram or short text. */
function Seal({ color, secondaryColor, opacity = 0.9, className }: KitPieceProps) {
  const bumps = 20;
  const d = Array.from({ length: bumps }, (_, i) => {
    const a0 = (i / bumps) * Math.PI * 2;
    const a1 = ((i + 1) / bumps) * Math.PI * 2;
    const p = (a: number, r: number) => `${50 + r * Math.cos(a)} ${50 + r * Math.sin(a)}`;
    return `${i === 0 ? "M" : "L"}${p(a0, 44)}Q${p((a0 + a1) / 2, 50)} ${p(a1, 44)}`;
  }).join("") + "Z";
  return (
    <Svg viewBox="0 0 100 100" className={className}>
      <g opacity={opacity}>
        <path d={d} fill={color} />
        <circle cx="50" cy="50" r="36" stroke={secondaryColor ?? "currentColor"} strokeWidth="0.8" opacity={0.7} />
        <circle cx="50" cy="50" r="33" stroke={secondaryColor ?? "currentColor"} strokeWidth="0.4" opacity={0.7} />
      </g>
    </Svg>
  );
}

function Sparkle({ color, opacity = 0.9, className }: KitPieceProps) {
  return (
    <Svg viewBox="0 0 60 60" className={className}>
      <g fill={color} opacity={opacity}>
        <path d="M24 6L28 20L42 24L28 28L24 42L20 28L6 24L20 20Z" />
        <path d="M46 34L48 41L55 43L48 45L46 52L44 45L37 43L44 41Z" />
        <path d="M44 6L45 10L49 11L45 12L44 16L43 12L39 11L43 10Z" />
      </g>
    </Svg>
  );
}

function Ribbon({ color, secondaryColor, opacity = 0.95, className }: KitPieceProps) {
  return (
    <Svg viewBox="0 0 120 32" className={className}>
      <g opacity={opacity}>
        <path d="M0 6H12L20 16L12 26H0L8 16Z" fill={secondaryColor ?? color} opacity={0.75} />
        <path d="M120 6H108L100 16L108 26H120L112 16Z" fill={secondaryColor ?? color} opacity={0.75} />
        <path d="M14 2H106V30H14Z" fill={color} />
        <path d="M14 30L22 24H14ZM106 30L98 24H106Z" fill={color} opacity={0.6} />
      </g>
    </Svg>
  );
}

function Cross({ color, opacity = 0.9, className }: KitPieceProps) {
  return (
    <Svg viewBox="0 0 60 80" className={className}>
      <g opacity={opacity}>
        <path d="M26 2H34V24H54V32H34V78H26V32H6V24H26Z" fill={color} />
      </g>
    </Svg>
  );
}

function SunRays({ color, opacity = 0.9, className }: KitPieceProps) {
  const rays = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2;
    const [r1, r2] = i % 2 ? [32, 44] : [32, 50];
    return <path key={i} d={`M${50 + r1 * Math.cos(a)} ${50 + r1 * Math.sin(a)}L${50 + r2 * Math.cos(a)} ${50 + r2 * Math.sin(a)}`} />;
  });
  return (
    <Svg viewBox="0 0 100 100" className={className}>
      <g stroke={color} strokeWidth="2.4" strokeLinecap="round" opacity={opacity}>
        <circle cx="50" cy="50" r="22" fill={color} stroke="none" />
        {rays}
      </g>
    </Svg>
  );
}

export const ornaments: KitPiece[] = [
  { id: "divider-diamond", kind: "ornament", label: "Diamond divider", tags: ["elegant", "traditional", "luxury"], colorSlots: ["accent"], component: DividerDiamond },
  { id: "divider-flourish", kind: "ornament", label: "Flourish divider", tags: ["romantic", "elegant", "vintage"], colorSlots: ["accent"], component: DividerFlourish },
  { id: "divider-dots", kind: "ornament", label: "Dotted divider", tags: ["modern", "playful", "minimal"], colorSlots: ["accent"], component: DividerDots },
  { id: "corner-flourish", kind: "ornament", label: "Corner flourish", tags: ["vintage", "luxury", "traditional"], colorSlots: ["accent"], component: CornerFlourish },
  { id: "laurel", kind: "ornament", label: "Laurel wreath", tags: ["traditional", "vintage", "elegant"], colorSlots: ["accent"], component: Laurel },
  { id: "seal", kind: "ornament", label: "Seal", tags: ["vintage", "traditional", "luxury"], colorSlots: ["accent", "secondary"], component: Seal },
  { id: "sparkle", kind: "ornament", label: "Sparkles", tags: ["playful", "luxury", "romantic"], colorSlots: ["accent"], component: Sparkle },
  { id: "ribbon", kind: "ornament", label: "Ribbon banner", tags: ["vintage", "playful", "traditional"], colorSlots: ["accent", "secondary"], component: Ribbon },
  { id: "cross", kind: "ornament", label: "Cross", tags: ["traditional", "minimal", "elegant"], colorSlots: ["accent"], component: Cross },
  { id: "sun-rays", kind: "ornament", label: "Sun rays", tags: ["traditional", "vintage", "playful"], colorSlots: ["accent"], component: SunRays },
];
