import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { templateList } from "@/components/invitation/templateCatalog";
import { Container } from "@/components/layout/Container";
import { UnlockPremiumPanel } from "@/components/premium/UnlockPremiumPanel";
import { Button } from "@/components/ui/button";
import { isPremiumPreset } from "@/lib/premium";

const FREE = ["Every free template and Look", "Customize colors, fonts and decoration", "Publish and share by link", "Collect RSVPs and see your guest list", "Download PNG and PDF"];

export default function Pricing() {
  // Counted from the catalog, so the page stays true as templates are added.
  const premiumTemplates = templateList.filter((t) => t.isPremium).length;
  const premiumLooks = templateList.filter((t) => !t.isPremium).flatMap((t) => t.presets.filter((p) => isPremiumPreset(t, p))).length;
  const premium = [`${premiumTemplates} Premium templates, with all their Looks`, `${premiumLooks} extra Looks on free templates`, "Everything in Free", "One payment, yours to keep. No subscription."];

  return (
    <Container className="py-14 sm:py-20">
      <header className="max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">Pricing</p>
        <h1 className="mt-3 font-serif text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl">Start free. Unlock Premium once.</h1>
        <p className="mt-4 text-muted-foreground">Free templates are complete: you can design, publish, share and collect replies without paying. Premium adds the most decorative designs.</p>
      </header>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <section aria-labelledby="plan-free" className="rounded-lg border bg-surface p-7">
          <h2 id="plan-free" className="font-serif text-2xl font-medium">
            Free
          </h2>
          <ul className="mt-5 space-y-2 text-sm">
            {FREE.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" /> {item}
              </li>
            ))}
          </ul>
          <Button asChild variant="secondary" className="mt-7">
            <Link to="/templates?access=free">Browse free templates</Link>
          </Button>
        </section>

        <section aria-labelledby="plan-premium" className="rounded-lg border border-foreground/40 bg-surface p-7">
          <h2 id="plan-premium" className="font-serif text-2xl font-medium">
            Premium
          </h2>
          <ul className="mt-5 space-y-2 text-sm">
            {premium.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" /> {item}
              </li>
            ))}
          </ul>
          <div className="mt-7">
            <UnlockPremiumPanel returnTo="/pricing" compact />
          </div>
          <Button asChild variant="ghost" className="mt-3 -ml-3">
            <Link to="/templates?access=premium">Preview Premium templates</Link>
          </Button>
        </section>
      </div>
    </Container>
  );
}
