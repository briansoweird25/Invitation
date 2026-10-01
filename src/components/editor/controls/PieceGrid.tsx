import { Kit } from "@/components/invitation/kit/Kit";
import { getKitPiece } from "@/components/invitation/kit/registry";
import type { KitKind } from "@/components/invitation/kit/types";
import { cn } from "@/lib/utils";
import type { InvitationDesign } from "@/types/invitation";

interface PieceGridProps {
  /** Visible group label. */
  label: string;
  kind: Extract<KitKind, "frame" | "pattern" | "background">;
  options: string[];
  value: string | undefined;
  design: InvitationDesign;
  onChange: (id: string | undefined) => void;
}

/** Thumbnails of kit frames, patterns or washes drawn with the invitation's own colors. */
export function PieceGrid({ label, kind, options, value, design, onChange }: PieceGridProps) {
  const labelId = `piece-${kind}`;
  const current = value ? (getKitPiece(kind, value)?.label ?? value) : "None";

  return (
    <div role="group" aria-labelledby={labelId} className="space-y-2">
      <p id={labelId} className="text-sm font-medium leading-none">
        {label} <span className="font-normal text-muted-foreground">· {current}</span>
      </p>
      <div className="grid grid-cols-4 gap-2">
        {[undefined, ...options].map((id) => {
          const piece = id ? getKitPiece(kind, id) : undefined;
          const name = piece?.label ?? "None";
          const selected = (value ?? undefined) === id;
          return (
            <button
              key={id ?? "none"}
              type="button"
              title={name}
              aria-label={name}
              aria-pressed={selected}
              onClick={() => onChange(id)}
              className={cn(
                "@container relative aspect-[4/5] overflow-hidden rounded-md border text-[10px] text-muted-foreground",
                selected ? "border-foreground ring-1 ring-foreground" : "hover:border-subtle-foreground",
              )}
              style={{ backgroundColor: design.backgroundColor }}
            >
              {piece ? (
                <Kit kind={kind} id={id} design={design} />
              ) : (
                <span className="absolute inset-0 grid place-items-center" style={{ color: design.textColor }}>
                  None
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
