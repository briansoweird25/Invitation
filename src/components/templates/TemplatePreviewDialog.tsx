import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import type { TemplateListItem } from "@/components/invitation/templateCatalog";
import { templateEditorPath } from "@/data/templates";
import { AccessBadge } from "./AccessBadge";
import { TemplatePreview } from "./TemplatePreview";

interface TemplatePreviewDialogProps {
  template: TemplateListItem | undefined;
  onClose: () => void;
}

export function TemplatePreviewDialog({ template, onClose }: TemplatePreviewDialogProps) {
  return (
    <Dialog open={Boolean(template)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl p-0">
        {template && (
          <div className="grid md:grid-cols-[1.1fr_1fr]">
            <div className="bg-muted p-8 sm:p-10">
              <div className="mx-auto max-w-xs shadow-soft md:max-w-none">
                <TemplatePreview id={template.id} />
              </div>
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-10">
              <AccessBadge isPremium={template.isPremium} className="self-start" />
              <DialogTitle className="mt-4 font-serif text-3xl font-medium leading-tight">{template.name}</DialogTitle>
              <p className="mt-1 text-sm capitalize text-muted-foreground">{template.category}</p>
              <DialogDescription className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {template.description} Your own names, date and venue replace the sample text.
              </DialogDescription>
              <Button asChild size="lg" className="mt-8">
                <Link to={templateEditorPath(template.id)}>Use this template</Link>
              </Button>
              <Button variant="ghost" className="mt-2" onClick={onClose}>
                Keep browsing
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
