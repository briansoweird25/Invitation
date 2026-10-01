import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { UnlockPremiumPanel } from "./UnlockPremiumPanel";

interface UnlockPremiumDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  returnTo?: string;
  /** Why the dialog opened, such as "This Look is part of Premium." */
  reason?: string;
}

export function UnlockPremiumDialog({ open, onOpenChange, returnTo, reason = "This is part of Premium." }: UnlockPremiumDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-8">
        <DialogTitle className="font-serif text-3xl font-medium leading-tight">Unlock Premium</DialogTitle>
        <DialogDescription className="mt-2 text-sm text-muted-foreground">{reason}</DialogDescription>
        <div className="mt-6">
          <UnlockPremiumPanel returnTo={returnTo} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
