import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { DeleteInvitationDialog } from "@/components/dashboard/DeleteInvitationDialog";
import { InvitationCard } from "@/components/dashboard/InvitationCard";
import { InvitationSkeletons, InvitationsEmpty, InvitationsError } from "@/components/dashboard/InvitationGridStates";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { useInvitationExport } from "@/hooks/useInvitationExport";
import { useInvitationList } from "@/hooks/useInvitationList";
import {
  deleteInvitation,
  LIST_ERROR_MESSAGE,
  publishInvitation,
  unpublishInvitation,
} from "@/lib/invitationApi";
import { displayName, useAuthStore } from "@/stores/authStore";
import type { ExportFormat } from "@/lib/exportName";
import type { Invitation } from "@/types/invitation";

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const { status, invitations, reload, replaceOne, removeOne } = useInvitationList(user?.id);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Invitation | null>(null);
  const { active: exportActive, run: runExport } = useInvitationExport();
  const [exportingId, setExportingId] = useState<string | null>(null);

  async function exportOne(invitation: Invitation, format: ExportFormat) {
    setExportingId(invitation.id);
    await runExport(format, { templateId: invitation.templateId, content: invitation.content, design: invitation.design, title: invitation.title });
    setExportingId(null);
  }

  async function togglePublish(invitation: Invitation) {
    const publishing = invitation.status !== "published";
    setBusyId(invitation.id);
    try {
      replaceOne(await (publishing ? publishInvitation(invitation) : unpublishInvitation(invitation)));
      toast.success(publishing ? "Invitation published" : "Invitation unpublished");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

  async function confirmDelete() {
    if (!pendingDelete || !user) return;
    setBusyId(pendingDelete.id);
    try {
      await deleteInvitation(user.id, pendingDelete);
      removeOne(pendingDelete.id);
      setPendingDelete(null);
      toast.success("Invitation deleted");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <Container className="py-14 sm:py-20">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">Dashboard</p>
          <h1 className="mt-3 font-serif text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl">
            Welcome back, {displayName(user)}
          </h1>
        </div>
        <Button asChild size="lg" className="self-start sm:self-auto">
          <Link to="/templates">Create Invitation</Link>
        </Button>
      </header>

      <section aria-labelledby="your-invitations" className="mt-14">
        <h2 id="your-invitations" className="text-sm font-medium">
          Your invitations
          {status === "ready" && invitations.length > 0 && <span className="ml-1.5 text-subtle-foreground">{invitations.length}</span>}
        </h2>
        <div className="mt-6" aria-busy={status === "loading"}>
          {status === "loading" && <InvitationSkeletons />}
          {status === "error" && <InvitationsError message={LIST_ERROR_MESSAGE} onRetry={() => void reload()} />}
          {status === "ready" && invitations.length === 0 && <InvitationsEmpty />}
          {status === "ready" && invitations.length > 0 && (
            <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {invitations.map((invitation) => (
                <li key={invitation.id}>
                  <InvitationCard
                    invitation={invitation}
                    busy={busyId === invitation.id}
                    onTogglePublish={(i) => void togglePublish(i)}
                    onDelete={setPendingDelete}
                    onExport={(i, format) => void exportOne(i, format)}
                    exporting={exportingId === invitation.id ? exportActive : null}
                    exportLocked={exportActive !== null}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <DeleteInvitationDialog
        invitation={pendingDelete}
        deleting={busyId !== null && busyId === pendingDelete?.id}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => void confirmDelete()}
      />
    </Container>
  );
}
