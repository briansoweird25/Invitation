import { palettes } from "@/data/palettes";
import { contrastRatio } from "@/lib/color";
import { cn } from "@/lib/utils";
import { useInvitationStore } from "@/stores/invitationStore";
import { ColorControl } from "../controls/ColorControl";
import { PanelSection } from "../PanelSection";

export function ColorsPanel() {
  const design = useInvitationStore((s) => s.design);
  const update = useInvitationStore((s) => s.updateDesign);
  const ratio = contrastRatio(design.textColor, design.backgroundColor);

  return (
    <PanelSection id="colors" title="Colors">
      <div role="group" aria-label="Color palettes" className="grid grid-cols-3 gap-2">
        {palettes.map((p) => {
          const active =
            p.backgroundColor === design.backgroundColor && p.textColor === design.textColor && p.accentColor === design.accentColor;
          return (
            <button
              key={p.name}
              type="button"
              aria-pressed={active}
              onClick={() => update({ backgroundColor: p.backgroundColor, textColor: p.textColor, accentColor: p.accentColor })}
              className={cn("rounded-md border p-2 text-left", active ? "border-foreground" : "hover:border-subtle-foreground")}
            >
              <span className="flex h-6 overflow-hidden rounded-sm border" aria-hidden="true">
                <span className="flex-[2]" style={{ backgroundColor: p.backgroundColor }} />
                <span className="flex-1" style={{ backgroundColor: p.textColor }} />
                <span className="flex-1" style={{ backgroundColor: p.accentColor }} />
              </span>
              <span className="mt-1.5 block truncate text-xs text-muted-foreground">{p.name}</span>
            </button>
          );
        })}
      </div>
      <ColorControl id="color-text" label="Text color" value={design.textColor} onChange={(textColor) => update({ textColor })} />
      <ColorControl id="color-accent" label="Accent color" value={design.accentColor} onChange={(accentColor) => update({ accentColor })} />
      {ratio !== null && ratio < 3 && (
        <p role="status" className="text-xs text-destructive">
          Low contrast between text and background. The invitation may be hard to read.
        </p>
      )}
    </PanelSection>
  );
}
