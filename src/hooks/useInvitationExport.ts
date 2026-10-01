import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { FORMAT_LABEL, type ExportFormat } from "@/lib/exportName";
import type { ExportSource } from "@/lib/exportInvitation";

const GENERIC_ERROR = "We couldn't create your file. Please try again.";

/**
 * Runs one export at a time and reports it with a toast. The export code is loaded on first use, so the editor and
 * dashboard do not carry it until someone exports. `active` names the format being prepared, for button states.
 */
export function useInvitationExport() {
  const [active, setActive] = useState<ExportFormat | null>(null);
  const running = useRef(false);

  const run = useCallback(async (format: ExportFormat, source: ExportSource) => {
    if (running.current) return;
    running.current = true;
    setActive(format);
    try {
      const { exportInvitation, downloadBlob, ExportError } = await import("@/lib/exportInvitation");
      try {
        const result = await exportInvitation(format, source);
        downloadBlob(result.blob, result.filename);
        toast.success(`${FORMAT_LABEL[format]} ready`, { description: result.filename });
      } catch (e) {
        toast.error(e instanceof ExportError ? e.message : GENERIC_ERROR);
      }
    } catch {
      // The export code itself could not be loaded, for example because the connection dropped.
      toast.error(GENERIC_ERROR);
    } finally {
      running.current = false;
      setActive(null);
    }
  }, []);

  return { active, run };
}
