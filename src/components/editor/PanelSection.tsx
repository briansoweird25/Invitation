import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { useEditorStore, type EditorPanel } from "@/stores/editorStore";
import { cn } from "@/lib/utils";

interface PanelSectionProps {
  id: EditorPanel;
  title: string;
  children: ReactNode;
}

/** Collapsible editor section. Open state lives in the editor store. */
export function PanelSection({ id, title, children }: PanelSectionProps) {
  const isOpen = useEditorStore((s) => s.openPanels.includes(id));
  const toggle = useEditorStore((s) => s.togglePanel);

  return (
    <section className="border-b">
      <h2>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={`panel-${id}`}
          onClick={() => toggle(id)}
          className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium hover:bg-muted/60"
        >
          {title}
          <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", isOpen && "rotate-180")} aria-hidden="true" />
        </button>
      </h2>
      {isOpen && (
        <div id={`panel-${id}`} className="space-y-4 px-5 pb-6">
          {children}
        </div>
      )}
    </section>
  );
}
