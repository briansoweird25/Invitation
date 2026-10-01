import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { categoriesWithTemplates, templatesForCategory } from "@/components/invitation/templateCatalog";
import { Container } from "@/components/layout/Container";
import { TemplatePreview } from "@/components/templates/TemplatePreview";
import { tintFor } from "@/components/templates/TemplateCard";
import { categoryConfigs } from "@/data/categories";
import { categories } from "@/data/taxonomy";
import { SectionHeading } from "./SectionHeading";

/** One card per occasion that has templates, with a real preview. Other occasions are listed as coming soon. */
export function CategoryShowcase() {
  const available = categoriesWithTemplates();
  const soon = categories.filter((c) => !available.includes(c));

  return (
    <section id="categories" className="border-t py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow="Occasions" title="An invitation for every celebration" description="Start with the occasion and find designs made for it." />

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {available.map((id) => {
            const config = categoryConfigs[id];
            const inCategory = templatesForCategory(id);
            // Prefer a template whose primary category this is, so the preview shows what the category is best known for.
            const primary = inCategory.filter((t) => t.category === id);
            const lead = primary.find((t) => t.featured) ?? primary[0] ?? inCategory[0];
            return (
              <li key={id}>
                <Link to={`/templates/${id}`} className="group grid h-full grid-cols-[7.5rem_1fr] items-center gap-5 rounded-lg border p-4 transition-colors hover:border-subtle-foreground sm:grid-cols-[9rem_1fr]">
                  <span className="block rounded-md p-3" style={{ backgroundColor: tintFor(lead.presets[0].design.backgroundColor) }}>
                    <span className="block shadow-soft transition-transform duration-300 group-hover:-translate-y-0.5">
                      <TemplatePreview id={lead.id} category={id} />
                    </span>
                  </span>
                  <span>
                    <config.icon className="size-5 text-accent" strokeWidth={1.5} aria-hidden="true" />
                    <span className="mt-2 block font-serif text-2xl font-medium leading-tight">{config.label}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{config.description}</span>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium">
                      {inCategory.length} {inCategory.length === 1 ? "design" : "designs"} <ArrowRight className="size-4" aria-hidden="true" />
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {soon.length > 0 && (
          <p className="mt-10 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">On the way:</span> {soon.map((id) => categoryConfigs[id].label).join(", ")}.
          </p>
        )}
      </Container>
    </section>
  );
}
