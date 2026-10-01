import { useEffect, useLayoutEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { EditorLayout } from "@/components/editor/EditorLayout";
import { Container } from "@/components/layout/Container";
import { RouteFallback } from "@/components/layout/RouteFallback";
import { Button } from "@/components/ui/button";
import { useSelectedTemplate } from "@/hooks/useSelectedTemplate";
import { getOwnInvitation, LOAD_ERROR_MESSAGE } from "@/lib/invitationApi";
import { useAuthStore } from "@/stores/authStore";
import { useInvitationStore } from "@/stores/invitationStore";

type LoadFailure = { id: string; reason: "notfound" | "error" };

export default function Editor() {
  const { invitationId } = useParams();
  const { templateId, presetId } = useSelectedTemplate();
  const userId = useAuthStore((s) => s.user?.id);
  const init = useInvitationStore((s) => s.init);
  const load = useInvitationStore((s) => s.load);
  const storeId = useInvitationStore((s) => s.id);
  const [failure, setFailure] = useState<LoadFailure>();

  // New invitation: start a fresh draft from the chosen template before the first paint.
  useLayoutEffect(() => {
    if (!invitationId) init(templateId, presetId);
  }, [invitationId, templateId, presetId, init]);

  // Existing invitation: fetch it, unless the store already holds it (just created by autosave).
  useEffect(() => {
    if (!invitationId || !userId) return;
    if (useInvitationStore.getState().id === invitationId) return;

    let cancelled = false;
    getOwnInvitation(invitationId, userId)
      .then((invitation) => {
        if (cancelled) return;
        if (invitation) load(invitation);
        else setFailure({ id: invitationId, reason: "notfound" });
      })
      .catch(() => !cancelled && setFailure({ id: invitationId, reason: "error" }));
    return () => {
      cancelled = true;
    };
  }, [invitationId, userId, load]);

  if (!invitationId || storeId === invitationId) return <EditorLayout />;
  const reason = failure?.id === invitationId ? failure.reason : undefined;
  if (!reason) return <RouteFallback label="Loading your invitation…" />;

  return (
    <Container className="py-24">
      <h1 className="font-serif text-4xl font-medium tracking-tight">
        {reason === "notfound" ? "We couldn't find that invitation" : "We couldn't open that invitation"}
      </h1>
      <p className="mt-3 text-muted-foreground">
        {reason === "notfound" ? "It may have been deleted, or it belongs to another account." : LOAD_ERROR_MESSAGE}
      </p>
      <div className="mt-6 flex gap-3">
        {reason === "error" && <Button onClick={() => window.location.reload()}>Try again</Button>}
        <Button asChild variant={reason === "error" ? "secondary" : "primary"}>
          <Link to="/templates">Start a new invitation</Link>
        </Button>
      </div>
    </Container>
  );
}
