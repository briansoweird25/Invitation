import { useMemo } from "react";
import { InvitationRenderer } from "@/components/invitation/InvitationRenderer";
import { getTemplate } from "@/components/invitation/templateRegistry";
import { Container } from "@/components/layout/Container";
import { useSelectedTemplate } from "@/hooks/useSelectedTemplate";
import { createInvitationDraft } from "@/lib/invitation";

/** Placeholder until Phase 5. It only proves the selected template reaches the renderer. */
export default function Editor() {
  const templateId = useSelectedTemplate();
  const draft = useMemo(() => createInvitationDraft(templateId), [templateId]);

  return (
    <Container className="py-16">
      <h1 className="font-serif text-4xl font-medium tracking-tight">Editor</h1>
      <p className="mt-3 text-muted-foreground">Selected template: {getTemplate(templateId)?.name}</p>
      <div className="mt-10 max-w-sm shadow-soft">
        <InvitationRenderer templateId={draft.templateId} content={draft.content} design={draft.design} />
      </div>
    </Container>
  );
}
