import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

interface SwitchProps extends Omit<ComponentProps<"button">, "onChange"> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function Switch({ checked, onCheckedChange, className, ...props }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-10 shrink-0 items-center rounded-full border transition-colors",
        checked ? "border-foreground bg-foreground" : "bg-muted",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "block size-4 rounded-full transition-transform",
          checked ? "translate-x-5 bg-background" : "translate-x-1 bg-subtle-foreground",
        )}
      />
    </button>
  );
}
