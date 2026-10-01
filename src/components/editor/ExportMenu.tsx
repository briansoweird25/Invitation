import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useInvitationExport } from "@/hooks/useInvitationExport";
import { FORMAT_LABEL, type ExportFormat } from "@/lib/exportName";
import { useInvitationStore } from "@/stores/invitationStore";

const FORMATS: { format: ExportFormat; label: string }[] = [
  { format: "png", label: "Download PNG image" },
  { format: "pdf", label: "Download PDF" },
];

/** Exports what is on screen right now, saved or not, from the same state the preview draws. */
export function ExportMenu() {
  const { active, run } = useInvitationExport();
  const busy = active !== null;

  const exportNow = (format: ExportFormat) => {
    const { templateId, content, design, title } = useInvitationStore.getState();
    void run(format, { templateId, content, design, title });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="sm" disabled={busy} aria-busy={busy} aria-label={busy ? `Preparing ${FORMAT_LABEL[active]}` : "Export"}>
          <Download />
          <span className="hidden sm:inline">{busy ? `Preparing ${FORMAT_LABEL[active]}…` : "Export"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {FORMATS.map(({ format, label }) => (
          <DropdownMenuItem key={format} onSelect={() => exportNow(format)}>
            <Download /> {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
