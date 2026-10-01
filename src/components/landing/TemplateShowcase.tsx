import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { templates } from "@/data/templates";
import { SampleInvitation } from "@/components/templates/SampleInvitations";
import { SectionHeading } from "./SectionHeading";

export function TemplateShowcase() {
  return (
    <section id="templates" className="border-t bg-surface py-20 sm:py-28">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Templates"
            title="Designs with a point of view"
            description="Each template has its own layout and character, not just a different color."
          />
          <Link
            to="/templates"
            className="inline-flex items-center gap-2 text-sm font-medium underline-offset-4 hover:underline"
          >
            View all templates <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4 lg:gap-x-8">
          {templates.map((t) => (
            <li key={t.id}>
              <Link to={`/templates/${t.category}`} className="group block">
                <div className="rounded-lg bg-muted p-4 transition-colors group-hover:bg-border/70 sm:p-6">
                  <div className="shadow-soft transition-transform duration-300 group-hover:-translate-y-1">
                    <SampleInvitation id={t.id} />
                  </div>
                </div>
                <div className="mt-4 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-medium">{t.name}</h3>
                    <p className="mt-0.5 text-sm capitalize text-muted-foreground">{t.category}</p>
                  </div>
                  <span className="mt-0.5 rounded-sm border px-1.5 py-0.5 text-xs text-muted-foreground">
                    {t.isPremium ? "Premium" : "Free"}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
