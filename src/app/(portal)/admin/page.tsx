import type { Metadata } from "next";
import { CalculatorEditor } from "@/components/portal/CalculatorEditor";
import { calculators } from "@/data/calculators";
import { services } from "@/data/services";

export const metadata: Metadata = { title: "Админка — SafeNechExpert" };

export default function AdminPage() {
  return <CalculatorEditor initial={calculators} services={services} />;
}
