import { MailCheck, Palette, PenLine, type LucideIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useEditorStore, type MobileSheet } from "@/stores/editorStore";
import { DesignPanels } from "./DesignSidebar";
import { EventDetailsPanel } from "./panels/EventDetailsPanel";
import { MessagePanel } from "./panels/MessagePanel";
import { RSVPPanel } from "./panels/RSVPPanel";

const tabs: { id: MobileSheet; label: string; icon: LucideIcon }[] = [
  { id: "details", label: "Details", icon: PenLine },
  { id: "design", label: "Design", icon: Palette },
  { id: "rsvp", label: "RSVP", icon: MailCheck },
];

export function MobileToolbar() {
  const active = useEditorStore((s) => s.mobileSheet);
  const setSheet = useEditorStore((s) => s.setMobileSheet);

  return (
    <nav aria-label="Editor tools" className="flex shrink-0 border-t bg-surface">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          aria-expanded={active === id}
          onClick={() => setSheet(active === id ? null : id)}
          className={cn(
            "flex flex-1 flex-col items-center gap-1 py-2.5 text-xs",
            active === id ? "font-medium text-foreground" : "text-muted-foreground",
          )}
        >
          <Icon className="size-5" strokeWidth={1.5} aria-hidden="true" />
          {label}
        </button>
      ))}
    </nav>
  );
}

const titles: Record<MobileSheet, string> = { details: "Details", design: "Design", rsvp: "RSVP" };

export function MobileSheetPanel() {
  const active = useEditorStore((s) => s.mobileSheet);
  const setSheet = useEditorStore((s) => s.setMobileSheet);

  return (
    <Sheet modal={false} open={active !== null} onOpenChange={(open) => !open && setSheet(null)}>
      <SheetContent className="bottom-[3.9rem]">
        <SheetTitle className="sr-only">{active ? titles[active] : ""}</SheetTitle>
        {active === "details" && (
          <>
            <EventDetailsPanel />
            <MessagePanel />
          </>
        )}
        {active === "design" && <DesignPanels />}
        {active === "rsvp" && <RSVPPanel />}
      </SheetContent>
    </Sheet>
  );
}
