import type { KitPiece, KitPieceProps } from "./types";
import { svgBase } from "./types";

/*
 * Frames are drawn on the full card in a 100 x 125 box (the 4:5 card), inset about 5 units.
 * Strokes use the card's own scale, so a frame looks the same in a thumbnail and in the editor.
 */

function FrameSvg({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <svg {...svgBase} viewBox="0 0 100 125" fill="none" className={className ?? "pointer-events-none absolute inset-0 size-full"}>
      {children}
    </svg>
  );
}

const line = (color: string, width: number, opacity: number) => ({ stroke: color, strokeWidth: width, opacity, fill: "none" });

function ThinLine({ color, opacity = 0.6, className }: KitPieceProps) {
  return (
    <FrameSvg className={className}>
      <rect x="5" y="5" width="90" height="115" {...line(color, 0.3, opacity)} />
    </FrameSvg>
  );
}

function DoubleLine({ color, opacity = 0.6, className }: KitPieceProps) {
  return (
    <FrameSvg className={className}>
      <rect x="4" y="4" width="92" height="117" {...line(color, 0.3, opacity)} />
      <rect x="6.5" y="6.5" width="87" height="112" {...line(color, 0.2, opacity)} />
    </FrameSvg>
  );
}

function NotchedCorners({ color, opacity = 0.7, className }: KitPieceProps) {
  return (
    <FrameSvg className={className}>
      <path d="M8.5 5H91.5L95 8.5V116.5L91.5 120H8.5L5 116.5V8.5Z" {...line(color, 0.3, opacity)} />
      <path d="M10.5 7.5H89.5L92.5 10.5V114.5L89.5 117.5H10.5L7.5 114.5V10.5Z" {...line(color, 0.15, opacity)} />
    </FrameSvg>
  );
}

function CornerBrackets({ color, opacity = 0.8, className }: KitPieceProps) {
  const l = 11;
  return (
    <FrameSvg className={className}>
      <path
        d={`M5 ${5 + l}V5H${5 + l} M${95 - l} 5H95V${5 + l} M95 ${120 - l}V120H${95 - l} M${5 + l} 120H5V${120 - l}`}
        {...line(color, 0.4, opacity)}
        strokeLinecap="square"
      />
    </FrameSvg>
  );
}

function ArchWindow({ color, opacity = 0.7, className }: KitPieceProps) {
  return (
    <FrameSvg className={className}>
      <path d="M18 117V52A32 32 0 0 1 82 52V117Z" {...line(color, 0.3, opacity)} />
      <path d="M21.5 117V52A28.5 28.5 0 0 1 78.5 52V117" {...line(color, 0.15, opacity)} />
    </FrameSvg>
  );
}

function Oval({ color, opacity = 0.7, className }: KitPieceProps) {
  return (
    <FrameSvg className={className}>
      <ellipse cx="50" cy="62.5" rx="43" ry="55" {...line(color, 0.3, opacity)} />
      <ellipse cx="50" cy="62.5" rx="40.5" ry="52.5" {...line(color, 0.15, opacity)} />
    </FrameSvg>
  );
}

function TicketEdge({ color, opacity = 0.7, className }: KitPieceProps) {
  return (
    <FrameSvg className={className}>
      <path d="M5 5H95V55A7 7 0 0 0 95 69V120H5V69A7 7 0 0 0 5 55Z" {...line(color, 0.3, opacity)} strokeDasharray="1.2 0.8" />
    </FrameSvg>
  );
}

function FoilDouble({ color, secondaryColor, opacity = 0.9, className }: KitPieceProps) {
  return (
    <FrameSvg className={className}>
      <rect x="5" y="5" width="90" height="115" {...line(color, 0.7, opacity)} />
      <rect x="7.5" y="7.5" width="85" height="110" {...line(secondaryColor ?? color, 0.2, opacity)} />
    </FrameSvg>
  );
}

export const frames: KitPiece[] = [
  { id: "thin-line", kind: "frame", label: "Thin line", tags: ["elegant", "minimal", "traditional"], colorSlots: ["accent"], component: ThinLine },
  { id: "double-line", kind: "frame", label: "Double line", tags: ["elegant", "traditional", "romantic"], colorSlots: ["accent"], component: DoubleLine },
  { id: "notched-corners", kind: "frame", label: "Notched corners", tags: ["luxury", "vintage", "elegant"], colorSlots: ["accent"], component: NotchedCorners },
  { id: "corner-brackets", kind: "frame", label: "Corner brackets", tags: ["modern", "minimal", "editorial"], colorSlots: ["accent"], component: CornerBrackets },
  { id: "arch-window", kind: "frame", label: "Arch window", tags: ["botanical", "romantic", "elegant"], colorSlots: ["accent"], component: ArchWindow },
  { id: "oval", kind: "frame", label: "Oval", tags: ["vintage", "traditional", "romantic"], colorSlots: ["accent"], component: Oval },
  { id: "ticket-edge", kind: "frame", label: "Ticket edge", tags: ["playful", "modern", "colorful"], colorSlots: ["accent"], component: TicketEdge },
  { id: "foil-double", kind: "frame", label: "Foil double rule", tags: ["luxury", "elegant"], colorSlots: ["accent", "secondary"], component: FoilDouble },
];
