import type { InvitationDesign } from "@/types/invitation";
import { getKitPiece } from "./registry";
import type { ColorSlot, KitKind, KitPieceProps } from "./types";

/** Resolves a piece's color slots from the design, so pieces recolor with every palette. */
export function colorForSlot(design: InvitationDesign, slot: ColorSlot | undefined): string {
  switch (slot) {
    case "text":
      return design.textColor;
    case "background":
      return design.backgroundColor;
    case "secondary":
      return design.secondaryColor ?? design.accentColor;
    default:
      return design.accentColor;
  }
}

interface KitProps extends Partial<Pick<KitPieceProps, "color" | "opacity" | "className">> {
  kind: KitKind;
  id: string | undefined;
  design: InvitationDesign;
}

/** Draws a kit piece using the invitation's colors. Unknown ids draw nothing. */
export function Kit({ kind, id, design, color, opacity, className }: KitProps) {
  const piece = getKitPiece(kind, id);
  if (!piece) return null;
  const Piece = piece.component;
  return (
    <Piece
      color={color ?? colorForSlot(design, piece.colorSlots[0])}
      secondaryColor={colorForSlot(design, "secondary")}
      opacity={opacity}
      className={className}
    />
  );
}
