import type { Metadata } from "next";
import { ClientCabinet } from "@/components/portal/ClientCabinet";
import { getApplication } from "@/data/applications";
import { getService } from "@/data/services";

export const metadata: Metadata = { title: "Кабинет клиента — SafeNechExpert" };

export default function CabinetPage() {
  const application = getApplication("APP-1042")!;
  const service = getService(application.serviceSlug)!;
  return <ClientCabinet application={application} serviceTitle={service.title} />;
}
