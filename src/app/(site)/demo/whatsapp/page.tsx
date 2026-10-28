import type { Metadata } from "next";
import { WhatsAppDemo } from "@/components/chat/WhatsAppDemo";
import { getCalculator } from "@/data/calculators";
import { getService, services } from "@/data/services";

export const metadata: Metadata = { title: "Демо: AI-агент в WhatsApp" };

type SearchParams = Promise<{ service?: string; has?: string }>;

export default async function WhatsAppDemoPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const service = getService(params.service ?? "") ?? services[0];
  const presentIds = params.has ? params.has.split(",").filter(Boolean) : [];

  return <WhatsAppDemo service={service} config={getCalculator(service.slug)} presentIds={presentIds} />;
}
