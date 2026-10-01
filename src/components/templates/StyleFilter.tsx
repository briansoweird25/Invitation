import { styleLabel } from "@/lib/templateFilters";
import { cn } from "@/lib/utils";
import type { TemplateStyle } from "@/data/taxonomy";

interface StyleFilterProps {
  styles: { style: TemplateStyle; count: number }[];
  selected: TemplateStyle[];
  onToggle: (style: TemplateStyle) => void;
  onClear: () => void;
}

/** Multi-select style chips. A template matches when it has any of the selected styles. */
export function StyleFilter({ styles, selected, onToggle, onClear }: StyleFilterProps) {
  if (styles.length === 0) return null;
  return (
    <div role="group" aria-label="Filter by style" className="flex flex-wrap items-center gap-2">
      {styles.map(({ style, count }) => {
        const active = selected.includes(style);
        return (
          <button
            key={style}
            type="button"
            aria-pressed={active}
            onClick={() => onToggle(style)}
            className={cn(
              "rounded-md border px-3 py-1.5 text-sm transition-colors",
              active ? "border-foreground bg-foreground text-background" : "text-muted-foreground hover:border-subtle-foreground hover:text-foreground",
            )}
          >
            {styleLabel(style)}
            <span className={cn("ml-1.5 text-xs", active ? "text-background/70" : "text-subtle-foreground")}>{count}</span>
          </button>
        );
      })}
      {selected.length > 0 && (
        <button type="button" onClick={onClear} className="px-2 py-1.5 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
          Clear styles
        </button>
      )}
    </div>
  );
}
