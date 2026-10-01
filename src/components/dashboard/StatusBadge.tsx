import { cn } from "@/lib/utils";
import type { InvitationStatus } from "@/types/invitation";

/** Status as text plus a filled or hollow dot, so it never relies on color alone. */
export function StatusBadge({ status }: { status: InvitationStatus }) {
  const published = status === "published";
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-sm border px-1.5 py-0.5 text-xs", published ? "border-accent/50 text-accent" : "text-muted-foreground")}>
      <span aria-hidden="true" className={cn("size-1.5 rounded-full border", published ? "border-accent bg-accent" : "border-current")} />
      {published ? "Published" : "Draft"}
    </span>
  );
}
