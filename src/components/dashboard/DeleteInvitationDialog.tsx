import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import type { Invitation } from "@/types/invitation";

interface DeleteInvitationDialogProps {
  invitation: Invitation | null;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteInvitationDialog({ invitation, deleting, onCancel, onConfirm }: DeleteInvitationDialogProps) {
  return (
    <Dialog open={invitation !== null} onOpenChange={(open) => !open && !deleting && onCancel()}>
      <DialogContent className="max-w-md p-8">
        <DialogTitle className="font-serif text-3xl font-medium leading-tight">Delete this invitation?</DialogTitle>
        <DialogDescription className="mt-3 text-sm leading-relaxed text-muted-foreground">
          &ldquo;{invitation?.title}&rdquo; and its uploaded image will be removed for good.
          {invitation?.status === "published" && " Its public link will stop working."}
        </DialogDescription>
        <div className="mt-8 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onCancel} disabled={deleting}>
            Keep it
          </Button>
          <Button onClick={onConfirm} disabled={deleting} className="bg-destructive text-white hover:bg-destructive/90">
            {deleting ? "Deleting…" : "Delete invitation"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
