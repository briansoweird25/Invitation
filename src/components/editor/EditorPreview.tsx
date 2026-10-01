import { Minus, Plus } from "lucide-react";
import { InvitationRenderer } from "@/components/invitation/InvitationRenderer";
import { Button } from "@/components/ui/button";
import { useEditorStore, ZOOM_MAX, ZOOM_MIN, ZOOM_STEP } from "@/stores/editorStore";
import { useInvitationStore } from "@/stores/invitationStore";

const BASE_WIDTH_REM = 28;

export function EditorPreview({ sheetOpen = false }: { sheetOpen?: boolean }) {
  const templateId = useInvitationStore((s) => s.templateId);
  const content = useInvitationStore((s) => s.content);
  const design = useInvitationStore((s) => s.design);
  const zoom = useEditorStore((s) => s.zoom);
  const setZoom = useEditorStore((s) => s.setZoom);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col bg-muted">
      <div className="flex-1 overflow-auto p-5 sm:p-10">
        <div
          className="mx-auto w-full shadow-[0_24px_60px_-20px_rgb(29_29_27/0.35)]"
          style={{
            // With the sheet open, shrink the card so the whole invitation stays visible above it.
            maxWidth: sheetOpen
              ? `min(${BASE_WIDTH_REM * zoom}rem, calc((55dvh - 10.5rem) * 0.8))`
              : `${BASE_WIDTH_REM * zoom}rem`,
          }}
          aria-label="Invitation preview"
          role="img"
        >
          <InvitationRenderer templateId={templateId} content={content} design={design} />
        </div>
      </div>

      <div className="flex items-center justify-center gap-1 border-t bg-surface/80 py-2 text-sm">
        <Button variant="ghost" size="icon" className="size-8" aria-label="Zoom out" disabled={zoom <= ZOOM_MIN} onClick={() => setZoom(zoom - ZOOM_STEP)}>
          <Minus />
        </Button>
        <span className="w-12 text-center tabular-nums text-muted-foreground" aria-live="polite">
          {Math.round(zoom * 100)}%
        </span>
        <Button variant="ghost" size="icon" className="size-8" aria-label="Zoom in" disabled={zoom >= ZOOM_MAX} onClick={() => setZoom(zoom + ZOOM_STEP)}>
          <Plus />
        </Button>
      </div>
    </div>
  );
}
