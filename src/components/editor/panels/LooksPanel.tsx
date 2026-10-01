import { Lock } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { InvitationRenderer } from "@/components/invitation/InvitationRenderer";
import { getTemplate } from "@/components/invitation/templateCatalog";
import { UnlockPremiumDialog } from "@/components/premium/UnlockPremiumDialog";
import { lookIsLocked, lookIsPremiumOnFreeTemplate } from "@/lib/premium";
import { cn } from "@/lib/utils";
import { usePremiumAccess } from "@/stores/accessStore";
import { useInvitationStore } from "@/stores/invitationStore";
import { PanelSection } from "../PanelSection";

/** The template's presets as thumbnails of the invitation itself, drawn with the current content. */
export function LooksPanel() {
  const templateId = useInvitationStore((s) => s.templateId);
  const content = useInvitationStore((s) => s.content);
  const design = useInvitationStore((s) => s.design);
  const setDesign = useInvitationStore((s) => s.setDesign);
  const presets = getTemplate(templateId)?.presets ?? [];
  const { hasPremium } = usePremiumAccess();
  const location = useLocation();
  const [unlockOpen, setUnlockOpen] = useState(false);

  if (presets.length < 2) return null;

  return (
    <PanelSection id="looks" title="Looks">
      <div role="group" aria-label="Looks" className="grid grid-cols-3 gap-2">
        {presets.map((preset) => {
          const active = design.presetId === preset.id;
          // Premium Looks on a free template are marked. A premium template's Looks are all Premium, so only the template is marked.
          const premium = lookIsPremiumOnFreeTemplate(templateId, preset.id);
          const locked = lookIsLocked(hasPremium, templateId, preset.id);
          return (
            <button
              key={preset.id}
              type="button"
              aria-pressed={active}
              aria-label={preset.name}
              aria-description={premium ? (locked ? "Premium Look, locked" : "Premium Look") : undefined}
              onClick={() => {
                // Locked Looks can be seen in the thumbnail but not applied. The database refuses them as well.
                if (locked) return setUnlockOpen(true);
                setDesign({ ...preset.design, presetId: preset.id, backgroundImage: design.backgroundImage });
              }}
              className="text-left"
            >
              <span aria-hidden="true" className={cn("pointer-events-none relative block overflow-hidden rounded-sm border", active ? "border-foreground ring-1 ring-foreground" : "")}>
                <InvitationRenderer templateId={templateId} content={content} design={preset.design} />
                {locked && (
                  <span className="absolute right-1 top-1 grid size-5 place-items-center rounded-full bg-surface/90 text-foreground">
                    <Lock className="size-3" />
                  </span>
                )}
              </span>
              <span className="mt-1.5 block truncate text-xs text-muted-foreground">
                {preset.name}
                {premium && <span className="text-accent"> · Premium</span>}
              </span>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">A look sets the colors, fonts and decorations. You can change anything afterwards.</p>
      <UnlockPremiumDialog open={unlockOpen} onOpenChange={setUnlockOpen} returnTo={`${location.pathname}${location.search}`} reason="This Look is part of Premium. Unlock it to use it on your invitation." />
    </PanelSection>
  );
}
