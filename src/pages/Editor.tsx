import { useLayoutEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { EditorLayout } from "@/components/editor/EditorLayout";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { useSelectedTemplate } from "@/hooks/useSelectedTemplate";
import { useInvitationStore } from "@/stores/invitationStore";

export default function Editor() {
  const { invitationId } = useParams();
  const templateId = useSelectedTemplate();
  const init = useInvitationStore((s) => s.init);

  // Start a fresh draft from the chosen template before the first paint.
  useLayoutEffect(() => {
    if (!invitationId) init(templateId);
  }, [invitationId, templateId, init]);

  // Saved invitations load here once persistence exists (Phase 7).
  if (invitationId) {
    return (
      <Container className="py-24">
        <h1 className="font-serif text-4xl font-medium tracking-tight">We couldn&apos;t find that invitation</h1>
        <p className="mt-3 text-muted-foreground">Saved invitations will open here once accounts are connected.</p>
        <Button asChild className="mt-6">
          <Link to="/templates">Start a new invitation</Link>
        </Button>
      </Container>
    );
  }

  return <EditorLayout />;
}
