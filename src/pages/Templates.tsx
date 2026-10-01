import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { AccessFilter, type Access } from "@/components/templates/AccessFilter";
import { CategoryNav } from "@/components/templates/CategoryNav";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { TemplatePreviewDialog } from "@/components/templates/TemplatePreviewDialog";
import { Button } from "@/components/ui/button";
import { getTemplate, templateList, type TemplateId } from "@/components/invitation/templateCatalog";
import { isTemplateCategory } from "@/data/templates";
import NotFound from "./NotFound";

function parseAccess(value: string | null): Access {
  return value === "free" || value === "premium" ? value : "all";
}

export default function Templates() {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [previewId, setPreviewId] = useState<TemplateId | null>(null);

  if (category && !isTemplateCategory(category)) return <NotFound />;

  const access = parseAccess(searchParams.get("access"));
  const visible = templateList.filter(
    (t) =>
      (!category || t.category === category) &&
      (access === "all" || (access === "premium") === t.isPremium),
  );

  const setAccess = (value: Access) => {
    const next = new URLSearchParams(searchParams);
    if (value === "all") next.delete("access");
    else next.set("access", value);
    setSearchParams(next, { replace: true });
  };

  return (
    <Container className="py-14 sm:py-20">
      <header className="max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">Templates</p>
        <h1 className="mt-3 font-serif text-5xl font-medium leading-[1.05] tracking-tight sm:text-6xl">
          Find the invitation that feels like your event.
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          Every design is fully customizable. Pick one to start and make it yours.
        </p>
      </header>

      <div className="mt-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
        <div className="lg:flex-1">
          <CategoryNav search={searchParams.toString() ? `?${searchParams.toString()}` : ""} />
        </div>
        <AccessFilter value={access} onChange={setAccess} />
      </div>

      {visible.length > 0 ? (
        <>
          <p className="mt-8 text-sm text-muted-foreground" aria-live="polite">
            {visible.length} {visible.length === 1 ? "template" : "templates"}
          </p>
          <ul className="mt-6 grid gap-x-6 gap-y-14 min-[560px]:grid-cols-2 xl:grid-cols-4">
            {visible.map((t) => (
              <li key={t.id}>
                <TemplateCard template={t} onPreview={setPreviewId} />
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="mt-16 border-t py-20 text-center">
          <h2 className="font-serif text-3xl font-medium">No templates here yet</h2>
          <p className="mx-auto mt-3 max-w-sm text-muted-foreground">
            Nothing matches these filters. More designs are on the way.
          </p>
          <Button variant="secondary" className="mt-6" onClick={() => setAccess("all")}>
            Clear filter
          </Button>
        </div>
      )}

      <TemplatePreviewDialog template={getTemplate(previewId)} onClose={() => setPreviewId(null)} />
    </Container>
  );
}
