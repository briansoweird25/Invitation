import { useAutosave } from "@/hooks/useAutosave";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { UnlockPremiumDialog } from "@/components/premium/UnlockPremiumDialog";
import { useEditorStore } from "@/stores/editorStore";
import { useLocation } from "react-router-dom";
import { ContentSidebar } from "./ContentSidebar";
import { DesignSidebar } from "./DesignSidebar";
import { EditorHeader } from "./EditorHeader";
import { EditorPreview } from "./EditorPreview";
import { MobileSheetPanel, MobileToolbar } from "./MobileControls";

/**
 * Desktop: content | preview | design. Smaller screens: preview with a bottom toolbar and sheet.
 * Only one layout is mounted at a time, so field ids stay unique.
 */
export function EditorLayout() {
  useAutosave();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const sheetOpen = useEditorStore((s) => s.mobileSheet !== null);
  const premiumRequired = useEditorStore((s) => s.premiumRequired);
  const location = useLocation();

  return (
    <div className="flex h-dvh flex-col bg-background">
      <UnlockPremiumDialog
        open={premiumRequired}
        onOpenChange={(open) => !open && useEditorStore.getState().setPremiumRequired(false)}
        returnTo={`${location.pathname}${location.search}`}
        reason="This invitation uses a Premium template or Look, so it can't be saved without Premium. Your changes are still here."
      />
      <EditorHeader />
      {isDesktop ? (
        <div className="grid min-h-0 flex-1 grid-cols-[19rem_1fr_18rem] xl:grid-cols-[22rem_1fr_20rem]">
          <ContentSidebar />
          <EditorPreview />
          <DesignSidebar />
        </div>
      ) : (
        <>
          <EditorPreview sheetOpen={sheetOpen} />
          <MobileToolbar />
          <MobileSheetPanel />
        </>
      )}
    </div>
  );
}
