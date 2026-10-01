import type { KitPiece, KitPieceProps } from "./types";
import { svgBase } from "./types";

/* Solid shapes in a 100 x 100 box. They fill the box they are given; rotate and place them with className. */

function Svg({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <svg {...svgBase} viewBox="0 0 100 100" className={className ?? "size-full"}>
      {children}
    </svg>
  );
}

const Circle = ({ color, opacity = 1, className }: KitPieceProps) => (
  <Svg className={className}>
    <circle cx="50" cy="50" r="50" fill={color} opacity={opacity} />
  </Svg>
);

const Ring = ({ color, opacity = 1, className }: KitPieceProps) => (
  <Svg className={className}>
    <circle cx="50" cy="50" r="42" fill="none" stroke={color} strokeWidth="14" opacity={opacity} />
  </Svg>
);

const HalfCircle = ({ color, opacity = 1, className }: KitPieceProps) => (
  <Svg className={className}>
    <path d="M0 70A50 50 0 0 1 100 70Z" fill={color} opacity={opacity} />
  </Svg>
);

const Arch = ({ color, opacity = 1, className }: KitPieceProps) => (
  <Svg className={className}>
    <path d="M10 100V50A40 40 0 0 1 90 50V100Z" fill={color} opacity={opacity} />
  </Svg>
);

const Blob = ({ color, opacity = 1, className }: KitPieceProps) => (
  <Svg className={className}>
    <path d="M52 4C74 2 96 20 96 46C96 74 78 96 50 96C24 96 4 78 4 52C4 26 26 6 52 4Z" fill={color} opacity={opacity} />
  </Svg>
);

const Starburst = ({ color, opacity = 1, className }: KitPieceProps) => {
  const points = Array.from({ length: 24 }, (_, i) => {
    const a = (i / 24) * Math.PI * 2;
    const r = i % 2 ? 36 : 50;
    return `${50 + r * Math.cos(a)},${50 + r * Math.sin(a)}`;
  }).join(" ");
  return (
    <Svg className={className}>
      <polygon points={points} fill={color} opacity={opacity} />
    </Svg>
  );
};

const Squiggle = ({ color, opacity = 1, className }: KitPieceProps) => (
  <Svg className={className}>
    <path d="M4 50Q16 22 28 50T52 50T76 50T100 50" fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" opacity={opacity} />
  </Svg>
);

const Square = ({ color, opacity = 1, className }: KitPieceProps) => (
  <Svg className={className}>
    <rect width="100" height="100" fill={color} opacity={opacity} />
  </Svg>
);

const Heart = ({ color, opacity = 1, className }: KitPieceProps) => (
  <Svg className={className}>
    <path d="M50 92C20 68 6 52 6 33C6 18 17 8 30 8C39 8 46 12 50 20C54 12 61 8 70 8C83 8 94 18 94 33C94 52 80 68 50 92Z" fill={color} opacity={opacity} />
  </Svg>
);

const Droplet = ({ color, opacity = 1, className }: KitPieceProps) => (
  <Svg className={className}>
    <path d="M50 4C50 4 18 42 18 64C18 82 32 96 50 96C68 96 82 82 82 64C82 42 50 4 50 4Z" fill={color} opacity={opacity} />
  </Svg>
);

export const shapes: KitPiece[] = [
  { id: "circle", kind: "shape", label: "Circle", tags: ["modern", "playful", "colorful"], colorSlots: ["accent"], component: Circle },
  { id: "ring", kind: "shape", label: "Ring", tags: ["modern", "playful", "editorial"], colorSlots: ["accent"], component: Ring },
  { id: "half-circle", kind: "shape", label: "Half circle", tags: ["modern", "colorful", "editorial"], colorSlots: ["accent"], component: HalfCircle },
  { id: "arch", kind: "shape", label: "Arch", tags: ["romantic", "modern", "botanical"], colorSlots: ["accent"], component: Arch },
  { id: "blob", kind: "shape", label: "Blob", tags: ["playful", "colorful"], colorSlots: ["accent"], component: Blob },
  { id: "starburst", kind: "shape", label: "Starburst", tags: ["playful", "colorful", "vintage"], colorSlots: ["accent"], component: Starburst },
  { id: "squiggle", kind: "shape", label: "Squiggle", tags: ["playful", "colorful", "modern"], colorSlots: ["accent"], component: Squiggle },
  { id: "square", kind: "shape", label: "Square", tags: ["modern", "editorial", "minimal"], colorSlots: ["text"], component: Square },
  { id: "heart", kind: "shape", label: "Heart", tags: ["romantic", "playful", "traditional"], colorSlots: ["accent"], component: Heart },
  { id: "droplet", kind: "shape", label: "Droplet", tags: ["minimal", "modern", "botanical"], colorSlots: ["accent"], component: Droplet },
];
