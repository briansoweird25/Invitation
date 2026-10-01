import type { KitPiece, KitPieceProps } from "./types";
import { svgBase } from "./types";

/*
 * Botanicals are drawn in a square 120 x 120 box (the garland is 200 x 50) and fill the box they are given.
 * They are made of a stem, leaves and blooms in one or two colors.
 */

type Leaf = [x: number, y: number, rotation: number, rx?: number, ry?: number];

function Leaves({ leaves, color, opacity, rx = 11, ry = 4.5 }: { leaves: Leaf[]; color: string; opacity: number; rx?: number; ry?: number }) {
  return (
    <>
      {leaves.map(([x, y, r, lrx, lry]) => (
        <ellipse key={`${x}-${y}`} cx={x} cy={y} rx={lrx ?? rx} ry={lry ?? ry} transform={`rotate(${r} ${x} ${y})`} fill={color} opacity={opacity} />
      ))}
    </>
  );
}

/** Five-petal bloom centered on (x, y). */
function Bloom({ x, y, size, color, center }: { x: number; y: number; size: number; color: string; center: string }) {
  return (
    <g>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx={x} cy={y - size * 0.62} rx={size * 0.42} ry={size * 0.62} transform={`rotate(${a} ${x} ${y})`} fill={color} opacity={0.85} />
      ))}
      <circle cx={x} cy={y} r={size * 0.28} fill={center} />
    </g>
  );
}

/** Points along a straight line from (x0, y0) to (x1, y1). */
const along = (x0: number, y0: number, x1: number, y1: number, n: number) =>
  Array.from({ length: n }, (_, i) => {
    const t = (i + 1) / (n + 1);
    return { x: x0 + (x1 - x0) * t, y: y0 + (y1 - y0) * t, t };
  });

function Svg({ className, viewBox = "0 0 120 120", children }: { className?: string; viewBox?: string; children: React.ReactNode }) {
  return (
    <svg {...svgBase} viewBox={viewBox} fill="none" className={className ?? "size-full"}>
      {children}
    </svg>
  );
}

function Sprig({ color, className }: KitPieceProps) {
  const leaves: Leaf[] = [
    [26, 86, -20],
    [40, 68, -60],
    [52, 52, -20],
    [66, 38, -60],
    [80, 26, -20],
    [94, 16, -60],
  ];
  return (
    <Svg className={className}>
      <path d="M8 112C30 80 54 50 112 8" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <Leaves leaves={leaves} color={color} opacity={0.55} />
      <circle cx="104" cy="14" r="4" fill={color} />
    </Svg>
  );
}

function OliveBranch({ color, secondaryColor, className }: KitPieceProps) {
  const olive = secondaryColor ?? color;
  const pts = along(10, 110, 108, 12, 7);
  return (
    <Svg className={className}>
      <path d="M10 110C40 82 70 50 108 12" stroke={color} strokeWidth="1.1" strokeLinecap="round" />
      {pts.map(({ x, y }, i) => (
        <g key={i}>
          <ellipse cx={x - 4} cy={y - 7} rx="9" ry="3" transform={`rotate(-70 ${x - 4} ${y - 7})`} fill={color} opacity={0.6} />
          <ellipse cx={x + 6} cy={y + 4} rx="9" ry="3" transform={`rotate(-5 ${x + 6} ${y + 4})`} fill={color} opacity={0.6} />
          {i % 3 === 1 && <ellipse cx={x + 3} cy={y + 12} rx="3.2" ry="4.4" fill={olive} />}
        </g>
      ))}
    </Svg>
  );
}

function Eucalyptus({ color, className }: KitPieceProps) {
  const pts = along(12, 108, 106, 14, 8);
  return (
    <Svg className={className}>
      <path d="M12 108C40 84 72 52 106 14" stroke={color} strokeWidth="1" strokeLinecap="round" />
      {pts.map(({ x, y, t }, i) => {
        const r = 7 - t * 3;
        return <circle key={i} cx={x + (i % 2 ? 7 : -7)} cy={y + (i % 2 ? 5 : -5)} r={r} fill={color} opacity={0.5 + (i % 3) * 0.1} />;
      })}
    </Svg>
  );
}

function Fern({ color, className }: KitPieceProps) {
  const pts = along(14, 108, 106, 14, 11);
  const rad = (deg: number) => (deg * Math.PI) / 180;
  return (
    <Svg className={className}>
      <path d="M14 108C44 82 74 52 106 14" stroke={color} strokeWidth="1" strokeLinecap="round" />
      {pts.map(({ x, y, t }, i) => {
        const len = 11 - t * 7;
        // Leaflets sweep forward from the stem on both sides.
        return [15, -105].map((deg) => (
          <ellipse
            key={`${i}-${deg}`}
            cx={x + Math.cos(rad(deg)) * len}
            cy={y + Math.sin(rad(deg)) * len}
            rx={len}
            ry="2"
            transform={`rotate(${deg} ${x + Math.cos(rad(deg)) * len} ${y + Math.sin(rad(deg)) * len})`}
            fill={color}
            opacity={0.6}
          />
        ));
      })}
    </Svg>
  );
}

function Wildflower({ color, secondaryColor, className }: KitPieceProps) {
  const bloom = secondaryColor ?? color;
  return (
    <Svg className={className}>
      <path d="M30 112C34 80 40 54 50 30" stroke={color} strokeWidth="1.1" strokeLinecap="round" />
      <path d="M62 112C64 84 74 60 88 40" stroke={color} strokeWidth="1.1" strokeLinecap="round" />
      <Leaves leaves={[[34, 90, -30, 10, 3.5], [46, 62, 30, 9, 3], [66, 92, -30, 10, 3.5], [76, 66, 35, 9, 3]]} color={color} opacity={0.6} />
      <Bloom x={50} y={28} size={14} color={bloom} center={color} />
      <Bloom x={88} y={38} size={11} color={bloom} center={color} />
      <Bloom x={24} y={58} size={9} color={bloom} center={color} />
    </Svg>
  );
}

function CornerBouquet({ color, secondaryColor, className }: KitPieceProps) {
  const bloom = secondaryColor ?? color;
  const leaves: Leaf[] = [
    [20, 88, -35, 14, 5],
    [34, 70, -50, 14, 5],
    [52, 96, -15, 14, 5],
    [64, 78, -25, 13, 4.5],
    [26, 52, -70, 12, 4.5],
    [80, 100, -5, 12, 4.5],
  ];
  return (
    <Svg className={className}>
      <Leaves leaves={leaves} color={color} opacity={0.6} />
      <Bloom x={34} y={86} size={20} color={bloom} center={color} />
      <Bloom x={62} y={100} size={15} color={bloom} center={color} />
      <Bloom x={22} y={64} size={13} color={bloom} center={color} />
      <circle cx="48" cy="62" r="3" fill={color} opacity={0.7} />
      <circle cx="76" cy="86" r="2.5" fill={color} opacity={0.7} />
    </Svg>
  );
}

/** A horizontal swag of leaves. Needs a wide box: about 4:1. */
function LeafGarland({ color, secondaryColor, className }: KitPieceProps) {
  const dot = secondaryColor ?? color;
  const quad = (t: number) => ({ x: 200 * t, y: 2 * (1 - t) * t * 48 + 8 });
  const pts = Array.from({ length: 17 }, (_, i) => ({ ...quad((i + 1) / 18), i }));
  return (
    <Svg className={className} viewBox="0 0 200 50">
      <path d="M0 8Q100 56 200 8" stroke={color} strokeWidth="0.9" strokeLinecap="round" />
      {pts.map(({ x, y, i }) => (
        <ellipse key={i} cx={x} cy={y + (i % 2 ? 4 : -4)} rx="8" ry="2.8" transform={`rotate(${i % 2 ? 40 : -40} ${x} ${y + (i % 2 ? 4 : -4)})`} fill={color} opacity={0.55} />
      ))}
      {[4, 8, 12].map((i) => {
        const p = quad((i + 1) / 18);
        return <circle key={i} cx={p.x} cy={p.y + 1} r="2.6" fill={dot} />;
      })}
    </Svg>
  );
}

export const botanicals: KitPiece[] = [
  { id: "sprig", kind: "botanical", label: "Sprig", tags: ["botanical", "romantic", "floral"], colorSlots: ["accent"], component: Sprig },
  { id: "olive-branch", kind: "botanical", label: "Olive branch", tags: ["botanical", "elegant", "rustic"], colorSlots: ["accent", "secondary"], component: OliveBranch },
  { id: "eucalyptus", kind: "botanical", label: "Eucalyptus", tags: ["botanical", "minimal", "rustic"], colorSlots: ["accent"], component: Eucalyptus },
  { id: "fern", kind: "botanical", label: "Fern", tags: ["botanical", "rustic"], colorSlots: ["accent"], component: Fern },
  { id: "wildflower", kind: "botanical", label: "Wildflowers", tags: ["floral", "rustic", "romantic"], colorSlots: ["accent", "secondary"], component: Wildflower },
  { id: "corner-bouquet", kind: "botanical", label: "Corner bouquet", tags: ["floral", "romantic", "elegant"], colorSlots: ["accent", "secondary"], component: CornerBouquet },
  { id: "leaf-garland", kind: "botanical", label: "Leaf garland", tags: ["botanical", "floral", "rustic"], colorSlots: ["accent", "secondary"], component: LeafGarland },
];
