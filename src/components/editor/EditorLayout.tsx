import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useEditorStore } from "@/stores/editorStore";
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
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const sheetOpen = useEditorStore((s) => s.mobileSheet !== null);

  return (
    <div className="flex h-dvh flex-col bg-background">
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
