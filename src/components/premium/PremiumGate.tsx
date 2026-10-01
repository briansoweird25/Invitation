import { Link, useLocation } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { TemplatePreview } from "@/components/templates/TemplatePreview";
import { getTemplate } from "@/components/invitation/templateCatalog";
import { templateEditorPath } from "@/data/templates";
import { lookIsPremiumOnFreeTemplate } from "@/lib/premium";
import { UnlockPremiumPanel } from "./UnlockPremiumPanel";

interface PremiumGateProps {
  templateId: string;
  presetId?: string;
  category?: string;
}

/**
 * Shown instead of the editor when a new invitation would start from a Premium template or Look the account does
 * not own. The template can be seen but not used. The database refuses the invitation as well, so this page is
 * a courtesy and the explanation, not the lock.
 */
export function PremiumGate({ templateId, presetId, category }: PremiumGateProps) {
  const location = useLocation();
  const template = getTemplate(templateId);
  const onlyTheLook = lookIsPremiumOnFreeTemplate(templateId, presetId);
  const returnTo = `${location.pathname}${location.search}`;

  return (
    <Container className="py-14 sm:py-20">
      <div className="grid items-center gap-10 md:grid-cols-[minmax(0,20rem)_1fr] md:gap-16">
        <div className="mx-auto w-full max-w-xs shadow-soft">
          <TemplatePreview id={templateId} presetId={presetId} category={category} />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">Premium</p>
          <h1 className="mt-3 font-serif text-4xl font-medium leading-[1.05] tracking-tight">
            {onlyTheLook ? "This Look is part of Premium" : `${template?.name ?? "This template"} is part of Premium`}
          </h1>
          <p className="mt-4 max-w-md text-muted-foreground">You can preview it here. Unlock Premium to start an invitation with it.</p>
          <div className="mt-8">
            <UnlockPremiumPanel returnTo={returnTo} />
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {onlyTheLook && (
              <Link to={templateEditorPath(templateId, undefined, category && category !== template?.category ? (category as never) : undefined)} className="underline underline-offset-4">
                Use this template's free Look
              </Link>
            )}
            <Link to="/templates?access=free" className="underline underline-offset-4">
              Browse free templates
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
