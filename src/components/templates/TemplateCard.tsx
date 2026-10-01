import { Eye } from "lucide-react";
import { Link } from "react-router-dom";
import type { TemplateListItem } from "@/components/invitation/templateCatalog";
import type { InvitationCategory } from "@/data/taxonomy";
import { Button } from "@/components/ui/button";
import { getCategoryConfig } from "@/data/categories";
import { templateEditorPath } from "@/data/templates";
import { styleLabel } from "@/lib/templateFilters";
import { AccessBadge } from "./AccessBadge";
import { LazyMount } from "./LazyMount";
import { TemplatePreview } from "./TemplatePreview";

interface TemplateCardProps {
  template: TemplateListItem;
  onPreview: (id: TemplateListItem["id"]) => void;
  /** The category page the card is shown on. Templates that only suit it get its sample content and category. */
  category?: InvitationCategory;
}

/** A soft backdrop tinted with the template's own background color, so the grid has color and rhythm. */
export const tintFor = (color: string) => `color-mix(in srgb, ${color} 22%, var(--muted))`;

export function TemplateCard({ template, onPreview, category }: TemplateCardProps) {
  const defaultDesign = template.presets[0].design;
  const shownCategory = category ?? template.category;
  const chosenCategory = category && category !== template.category ? category : undefined;
  const meta = [getCategoryConfig(shownCategory).label, ...template.styles.slice(0, 2).map(styleLabel)].join(" · ");

  return (
    <article className="group">
      <button
        type="button"
        onClick={() => onPreview(template.id)}
        aria-label={`Preview ${template.name}`}
        className="relative block w-full rounded-lg p-6 text-left transition-[filter] hover:brightness-[0.97] sm:p-7 xl:p-5"
        style={{ backgroundColor: tintFor(defaultDesign.backgroundColor) }}
      >
        <div className="shadow-soft transition-transform duration-300 group-hover:-translate-y-1">
          <LazyMount placeholder={<div className="aspect-[4/5] w-full" style={{ backgroundColor: defaultDesign.backgroundColor }} />}>
            <TemplatePreview id={template.id} category={category} />
          </LazyMount>
        </div>
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-md bg-surface/90 px-2.5 py-1 text-xs opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 max-md:opacity-100">
          <Eye className="size-3.5" aria-hidden="true" /> Preview
        </span>
      </button>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-serif text-2xl font-medium leading-tight">{template.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{meta}</p>
        </div>
        <AccessBadge isPremium={template.isPremium} className="mt-1.5" />
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{template.description}</p>
      <Button asChild variant="secondary" className="mt-4 w-full sm:w-auto">
        <Link to={templateEditorPath(template.id, undefined, chosenCategory)}>Use template</Link>
      </Button>
    </article>
  );
}
