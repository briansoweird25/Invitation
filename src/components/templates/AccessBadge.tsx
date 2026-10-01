import { cn } from "@/lib/utils";

/** Free / Premium label. Text carries the meaning; color is only reinforcement. */
export function AccessBadge({ isPremium, className }: { isPremium: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "rounded-sm border px-1.5 py-0.5 text-xs",
        isPremium ? "border-accent/50 text-accent" : "text-muted-foreground",
        className,
      )}
    >
      {isPremium ? "Premium" : "Free"}
    </span>
  );
}
