import { backgrounds } from "./backgrounds";
import { botanicals } from "./botanicals";
import { frames } from "./frames";
import { ornaments } from "./ornaments";
import { patterns } from "./patterns";
import { shapes } from "./shapes";
import type { KitKind, KitPiece } from "./types";

/**
 * Every shared decoration piece. Kit v1 is small, so it is bundled together.
 * Revisit lazy loading if the kit grows past about a hundred pieces.
 */
export const kitPieces: KitPiece[] = [...frames, ...botanicals, ...patterns, ...ornaments, ...shapes, ...backgrounds];

export function getKitPiece(kind: KitKind, id: string | undefined): KitPiece | undefined {
  return id ? kitPieces.find((p) => p.kind === kind && p.id === id) : undefined;
}

export function kitPiecesOfKind(kind: KitKind): KitPiece[] {
  return kitPieces.filter((p) => p.kind === kind);
}
