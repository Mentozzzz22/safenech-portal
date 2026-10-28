import { AgentShowcase } from "@/components/landing/AgentShowcase";
import { Catalog } from "@/components/landing/Catalog";
import { FinalCta } from "@/components/landing/FinalCta";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Marquee } from "@/components/landing/Marquee";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <HowItWorks />
      <Catalog />
      <AgentShowcase />
      <FinalCta />
    </>
  );
}
