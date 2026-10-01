import { InvitationRenderer } from "@/components/invitation/InvitationRenderer";
import { getTemplate } from "@/components/invitation/templateCatalog";
import { cn } from "@/lib/utils";
import { useInvitationStore } from "@/stores/invitationStore";
import { PanelSection } from "../PanelSection";

/** The template's presets as thumbnails of the invitation itself, drawn with the current content. */
export function LooksPanel() {
  const templateId = useInvitationStore((s) => s.templateId);
  const content = useInvitationStore((s) => s.content);
  const design = useInvitationStore((s) => s.design);
  const setDesign = useInvitationStore((s) => s.setDesign);
  const presets = getTemplate(templateId)?.presets ?? [];

  if (presets.length < 2) return null;

  return (
    <PanelSection id="looks" title="Looks">
      <div role="group" aria-label="Looks" className="grid grid-cols-3 gap-2">
        {presets.map((preset) => {
          const active = design.presetId === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              aria-pressed={active}
              aria-label={preset.name}
              onClick={() => setDesign({ ...preset.design, presetId: preset.id, backgroundImage: design.backgroundImage })}
              className="text-left"
            >
              <span aria-hidden="true" className={cn("pointer-events-none block overflow-hidden rounded-sm border", active ? "border-foreground ring-1 ring-foreground" : "")}>
                <InvitationRenderer templateId={templateId} content={content} design={preset.design} />
              </span>
              <span className="mt-1.5 block truncate text-xs text-muted-foreground">{preset.name}</span>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">A look sets the colors, fonts and decorations. You can change anything afterwards.</p>
    </PanelSection>
  );
}
