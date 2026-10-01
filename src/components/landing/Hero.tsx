import { Link } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { SampleInvitation } from "@/components/templates/SampleInvitations";

export function Hero() {
  return (
    <section className="overflow-hidden">
      <Container className="grid items-center gap-14 py-16 sm:py-20 lg:grid-cols-[1.15fr_1fr] lg:gap-8 lg:py-28">
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">Digital invitations</p>
          <h1 className="mt-5 font-serif text-5xl font-medium leading-[1.02] tracking-tight sm:text-6xl">
            Create an invitation
            <br />
            worth remembering.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
            Beautiful digital invitations for life&apos;s special moments. Choose a design, add your details and share
            it in minutes.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/editor/new">Create an Invitation</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link to="/templates">Browse Templates</Link>
            </Button>
          </div>
          <p className="mt-5 text-sm text-subtle-foreground">Free to start. No design experience needed.</p>
        </div>

        <div
          className="relative mx-auto w-full max-w-md animate-in fade-in duration-1000 sm:max-w-lg lg:max-w-none"
          aria-label="Example invitations"
        >
          <div className="relative mx-auto w-[68%] sm:w-[62%] lg:ml-[18%]">
            <div className="shadow-[0_24px_60px_-20px_rgb(29_29_27/0.35)]">
              <SampleInvitation id="elegant-wedding" />
            </div>
          </div>
          <div className="absolute -left-1 bottom-[-6%] hidden w-[34%] -rotate-3 shadow-[0_16px_40px_-16px_rgb(29_29_27/0.35)] sm:block lg:left-0">
            <SampleInvitation id="modern-birthday" />
          </div>
          <div className="absolute -right-1 top-[8%] hidden w-[30%] rotate-3 shadow-[0_16px_40px_-16px_rgb(29_29_27/0.3)] sm:block">
            <SampleInvitation id="floral-wedding" />
          </div>
        </div>
      </Container>
    </section>
  );
}
