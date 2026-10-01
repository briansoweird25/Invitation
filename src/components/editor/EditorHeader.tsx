import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ExportMenu } from "./ExportMenu";
import { useEditorStore } from "@/stores/editorStore";
import { useInvitationStore } from "@/stores/invitationStore";

export function EditorHeader() {
  const title = useInvitationStore((s) => s.title);
  const setTitle = useInvitationStore((s) => s.setTitle);
  const isDirty = useEditorStore((s) => s.isDirty);
  const isSaving = useEditorStore((s) => s.isSaving);
  const saveError = useEditorStore((s) => s.saveError);
  const isSaved = useInvitationStore((s) => s.id !== null);

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-surface px-3 sm:px-5">
      <Button asChild variant="ghost" size="sm" className="-ml-1 px-2">
        <Link to="/templates" aria-label="Back to templates">
          <ChevronLeft />
          <span className="hidden sm:inline">Templates</span>
        </Link>
      </Button>

      <label htmlFor="invitation-title" className="sr-only">
        Invitation name
      </label>
      <Input
        id="invitation-title"
        value={title}
        maxLength={80}
        onChange={(e) => setTitle(e.target.value)}
        className="h-9 min-w-0 max-w-xs flex-1 border-transparent bg-transparent font-medium hover:border-border focus:bg-surface"
      />

      <div className="ml-auto flex items-center gap-3">
        <p className={cn("text-xs sm:text-sm", saveError ? "text-destructive" : "text-muted-foreground")} role="status">
          {saveError ? "Couldn't save · retrying" : isSaving ? "Saving…" : isDirty ? "Unsaved changes" : isSaved ? "✓ Saved" : "Draft"}
        </p>
        <ExportMenu />
        <Button size="sm" disabled title="Publish from your dashboard.">
          Publish
        </Button>
      </div>
    </header>
  );
}
