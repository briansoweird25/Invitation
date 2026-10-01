import { Link } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="bg-foreground text-background">
      <Container className="py-20 text-center sm:py-28">
        <h2 className="mx-auto max-w-2xl font-serif text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl">
          Your next celebration deserves a beautiful invitation.
        </h2>
        <p className="mx-auto mt-5 max-w-md text-background/70">Start with a template and have it ready to share today.</p>
        <Button asChild size="lg" variant="accent" className="mt-9">
          <Link to="/editor/new">Create an Invitation</Link>
        </Button>
      </Container>
    </section>
  );
}
