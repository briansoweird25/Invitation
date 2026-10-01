import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const Sheet = DialogPrimitive.Root;
export const SheetTitle = DialogPrimitive.Title;

/**
 * Bottom sheet. Used non-modally in the editor so the live preview above stays visible,
 * so there is no overlay and outside interaction does not close it.
 */
export function SheetContent({ className, children, ...props }: ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Content
        aria-describedby={undefined}
        onInteractOutside={(e) => e.preventDefault()}
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 max-h-[45dvh] overflow-y-auto rounded-t-xl border-t bg-surface shadow-soft data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          aria-label="Close panel"
          className="absolute right-3 top-3 grid size-9 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="size-4" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
