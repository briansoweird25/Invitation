import { useState } from "react";
import { Link } from "react-router-dom";
import type { TemplateListItem } from "@/components/invitation/templateCatalog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { getCategoryConfig } from "@/data/categories";
import { templateEditorPath } from "@/data/templates";
import { styleLabel } from "@/lib/templateFilters";
import { cn } from "@/lib/utils";
import { AccessBadge } from "./AccessBadge";
import { tintFor } from "./TemplateCard";
import { TemplatePreview } from "./TemplatePreview";

interface TemplatePreviewDialogProps {
  template: TemplateListItem | undefined;
  onClose: () => void;
}

function PreviewBody({ template, onClose }: { template: TemplateListItem; onClose: () => void }) {
  const [presetId, setPresetId] = useState(template.presets[0].id);
  const preset = template.presets.find((p) => p.id === presetId) ?? template.presets[0];
  const meta = [getCategoryConfig(template.category).label, ...template.styles.map(styleLabel)].join(" · ");

  return (
    <div className="grid md:grid-cols-[1.1fr_1fr]">
      <div className="p-8 transition-colors duration-300 sm:p-10" style={{ backgroundColor: tintFor(preset.design.backgroundColor) }}>
        <div className="mx-auto max-w-xs shadow-soft md:max-w-none">
          <TemplatePreview id={template.id} presetId={preset.id} />
        </div>
      </div>
      <div className="flex flex-col justify-center p-8 sm:p-10">
        <AccessBadge isPremium={template.isPremium} className="self-start" />
        <DialogTitle className="mt-4 font-serif text-3xl font-medium leading-tight">{template.name}</DialogTitle>
        <p className="mt-1 text-sm text-muted-foreground">{meta}</p>
        <DialogDescription className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {template.description} Your own names, date and venue replace the sample text.
        </DialogDescription>

        {template.presets.length > 1 && (
          <div role="group" aria-label="Variations" className="mt-6">
            <p className="text-sm font-medium">
              Variations <span className="font-normal text-muted-foreground">· {preset.name}</span>
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {template.presets.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  aria-label={p.name}
                  title={p.name}
                  aria-pressed={p.id === preset.id}
                  onClick={() => setPresetId(p.id)}
                  className={cn("flex h-9 overflow-hidden rounded-md border", p.id === preset.id ? "border-foreground ring-1 ring-foreground" : "hover:border-subtle-foreground")}
                >
                  <span className="w-5" style={{ backgroundColor: p.design.backgroundColor }} />
                  <span className="w-3" style={{ backgroundColor: p.design.accentColor }} />
                  <span className="w-3" style={{ backgroundColor: p.design.textColor }} />
                </button>
              ))}
            </div>
          </div>
        )}

        <Button asChild size="lg" className="mt-8">
          <Link to={templateEditorPath(template.id, preset.id)}>Use this template</Link>
        </Button>
        <Button variant="ghost" className="mt-2" onClick={onClose}>
          Keep browsing
        </Button>
      </div>
    </div>
  );
}

export function TemplatePreviewDialog({ template, onClose }: TemplatePreviewDialogProps) {
  return (
    <Dialog open={Boolean(template)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl p-0">{template && <PreviewBody key={template.id} template={template} onClose={onClose} />}</DialogContent>
    </Dialog>
  );
}
