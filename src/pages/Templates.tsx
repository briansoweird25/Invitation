import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getTemplate, templateList, type TemplateId } from "@/components/invitation/templateCatalog";
import { Container } from "@/components/layout/Container";
import { AccessFilter } from "@/components/templates/AccessFilter";
import { CategoryNav } from "@/components/templates/CategoryNav";
import { StyleFilter } from "@/components/templates/StyleFilter";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { TemplatePreviewDialog } from "@/components/templates/TemplatePreviewDialog";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { isTemplateCategory } from "@/data/templates";
import {
  filterBase,
  filterByStyles,
  parseAccess,
  parseSort,
  parseStyles,
  sortOptions,
  sortTemplates,
  stylesInUse,
  type Access,
  type SortKey,
} from "@/lib/templateFilters";
import type { TemplateStyle } from "@/data/taxonomy";
import NotFound from "./NotFound";

export default function Templates() {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [previewId, setPreviewId] = useState<TemplateId | null>(null);

  if (category && !isTemplateCategory(category)) return <NotFound />;

  const access = parseAccess(searchParams.get("access"));
  const sort = parseSort(searchParams.get("sort"));
  const selectedStyles = parseStyles(searchParams.get("style"));

  const base = filterBase(templateList, { category: category && isTemplateCategory(category) ? category : undefined, access });
  const visible = sortTemplates(filterByStyles(base, selectedStyles), sort);

  // Filters live in the URL so a filtered gallery can be shared and survives a reload.
  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next, { replace: true });
  };
  const setAccess = (value: Access) => setParam("access", value === "all" ? null : value);
  const setSort = (value: SortKey) => setParam("sort", value === "featured" ? null : value);
  const toggleStyle = (style: TemplateStyle) => {
    const next = selectedStyles.includes(style) ? selectedStyles.filter((s) => s !== style) : [...selectedStyles, style];
    setParam("style", next.length > 0 ? next.join(",") : null);
  };
  const clearFilters = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("style");
    next.delete("access");
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

      <div className="mt-12">
        <CategoryNav search={searchParams.toString() ? `?${searchParams.toString()}` : ""} />
      </div>

      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
        <StyleFilter styles={stylesInUse(base)} selected={selectedStyles} onToggle={toggleStyle} onClear={() => setParam("style", null)} />
        <div className="flex shrink-0 flex-wrap items-center gap-4">
          <AccessFilter value={access} onChange={setAccess} />
          <div className="flex items-center gap-2">
            <label htmlFor="template-sort" className="text-sm text-muted-foreground">
              Sort
            </label>
            <Select id="template-sort" className="h-9 w-32" value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      {visible.length > 0 ? (
        <>
          <p className="mt-8 text-sm text-muted-foreground" aria-live="polite">
            {visible.length} {visible.length === 1 ? "template" : "templates"}
          </p>
          <ul className="mt-6 grid gap-x-6 gap-y-14 min-[560px]:grid-cols-2 xl:grid-cols-4">
            {visible.map((t, i) => (
              <li
                key={t.id}
                className="animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both"
                style={{ animationDelay: `${Math.min(i, 7) * 60}ms` }}
              >
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
          <Button variant="secondary" className="mt-6" onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      )}

      <TemplatePreviewDialog template={getTemplate(previewId)} onClose={() => setPreviewId(null)} />
    </Container>
  );
}
