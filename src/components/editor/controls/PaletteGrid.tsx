import { palettes, type Palette } from "@/data/palettes";
import { cn } from "@/lib/utils";
import type { InvitationDesign } from "@/types/invitation";

interface PaletteGridProps {
  /** Palette ids to offer, or "any". */
  allowed: string[] | "any";
  /** Styles of the template, used to list matching palettes first. */
  styles: string[];
  design: InvitationDesign;
  onSelect: (palette: Palette) => void;
}

const isActive = (p: Palette, d: InvitationDesign) =>
  p.backgroundColor.toLowerCase() === d.backgroundColor.toLowerCase() &&
  p.textColor.toLowerCase() === d.textColor.toLowerCase() &&
  p.accentColor.toLowerCase() === d.accentColor.toLowerCase();

/** Curated palettes shown as small colored cards, best matches for the template first. */
export function PaletteGrid({ allowed, styles, design, onSelect }: PaletteGridProps) {
  const offered = palettes.filter((p) => allowed === "any" || allowed.includes(p.id));
  const score = (p: Palette) => p.tags.filter((t) => styles.includes(t)).length;
  const sorted = [...offered].sort((a, b) => score(b) - score(a));

  return (
    <div role="group" aria-label="Color palettes" className="grid grid-cols-2 gap-2">
      {sorted.map((p) => {
        const active = isActive(p, design);
        return (
          <button
            key={p.id}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(p)}
            className={cn("overflow-hidden rounded-md border text-left", active ? "border-foreground ring-1 ring-foreground" : "hover:border-subtle-foreground")}
          >
            <span className="block px-2.5 py-2" style={{ backgroundColor: p.backgroundColor, color: p.textColor }} aria-hidden="true">
              <span className="block font-serif text-lg leading-none">Aa</span>
              <span className="mt-2 flex items-center gap-1">
                <span className="h-1 w-6 rounded-full" style={{ backgroundColor: p.accentColor }} />
                {p.secondaryColor && <span className="size-2 rounded-full" style={{ backgroundColor: p.secondaryColor }} />}
              </span>
            </span>
            <span className="block truncate border-t bg-surface px-2.5 py-1.5 text-xs text-muted-foreground">{p.name}</span>
          </button>
        );
      })}
    </div>
  );
}
