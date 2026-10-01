import { CategoryShowcase } from "@/components/landing/CategoryShowcase";
import { FinalCta } from "@/components/landing/FinalCta";
import { Features } from "@/components/landing/Features";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { TemplateShowcase } from "@/components/landing/TemplateShowcase";

export default function Landing() {
  return (
    <>
      <Hero />
      <TemplateShowcase />
      <CategoryShowcase />
      <HowItWorks />
      <Features />
      <FinalCta />
    </>
  );
}
