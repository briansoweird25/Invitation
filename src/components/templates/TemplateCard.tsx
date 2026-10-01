import { Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import type { TemplateListItem } from "@/components/invitation/templateCatalog";
import { templateEditorPath } from "@/data/templates";
import { AccessBadge } from "./AccessBadge";
import { TemplatePreview } from "./TemplatePreview";

interface TemplateCardProps {
  template: TemplateListItem;
  onPreview: (id: TemplateListItem["id"]) => void;
}

export function TemplateCard({ template, onPreview }: TemplateCardProps) {
  return (
    <article className="group">
      <button
        type="button"
        onClick={() => onPreview(template.id)}
        aria-label={`Preview ${template.name}`}
        className="relative block w-full rounded-lg bg-muted p-6 text-left transition-colors hover:bg-border/70 sm:p-7 xl:p-5"
      >
        <div className="shadow-soft transition-transform duration-300 group-hover:-translate-y-1">
          <TemplatePreview id={template.id} />
        </div>
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-md bg-surface/90 px-2.5 py-1 text-xs opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 max-md:opacity-100">
          <Eye className="size-3.5" aria-hidden="true" /> Preview
        </span>
      </button>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-medium leading-tight">{template.name}</h2>
          <p className="mt-1 text-sm capitalize text-muted-foreground">{template.category}</p>
        </div>
        <AccessBadge isPremium={template.isPremium} className="mt-1.5" />
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{template.description}</p>
      <Button asChild variant="secondary" className="mt-4 w-full sm:w-auto">
        <Link to={templateEditorPath(template.id)}>Use template</Link>
      </Button>
    </article>
  );
}
