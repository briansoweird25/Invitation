import { Container } from "@/components/layout/Container";
import { features } from "@/data/landing";
import { SectionHeading } from "./SectionHeading";

export function Features() {
  return (
    <section className="border-t bg-surface py-20 sm:py-28">
      <Container className="grid gap-14 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <SectionHeading
          eyebrow="Features"
          title="Everything you need, nothing you don't"
          description="A focused set of tools so the invitation stays the center of attention."
        />
        <dl className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
          {features.map(({ icon: Icon, title, body }) => (
            <div key={title}>
              <Icon className="size-5 text-accent" strokeWidth={1.5} aria-hidden="true" />
              <dt className="mt-4 text-base font-medium">{title}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
