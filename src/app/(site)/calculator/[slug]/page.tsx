import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Calculator } from "@/components/calculator/Calculator";
import { calculators, getCalculator } from "@/data/calculators";
import { getService } from "@/data/services";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return calculators.map((c) => ({ slug: c.serviceSlug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const service = getService((await params).slug);
  return { title: service ? `Калькулятор: ${service.title}` : "Калькулятор" };
}

export default async function CalculatorPage({ params }: { params: Params }) {
  const { slug } = await params;
  const service = getService(slug);
  const config = getCalculator(slug);
  if (!service || !config) notFound();

  return <Calculator service={service} config={config} />;
}
