import { Bot, MapPin, RefreshCw } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OfferForm } from "@/components/portal/OfferForm";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { applications, getApplication, stages } from "@/data/applications";
import { getService } from "@/data/services";

type Params = Promise<{ id: string }>;

export function generateStaticParams() {
  return applications.map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  return { title: `${(await params).id} — SafeNechExpert` };
}

export default async function ApplicationPage({ params }: { params: Params }) {
  const application = getApplication((await params).id);
  if (!application) notFound();
  const service = getService(application.serviceSlug);
  const stage = stages.find((s) => s.id === application.stage)?.title;
  const issues = application.checks.filter((c) => c.status !== "ok").length;

  return (
    <div>
      <Link href="/manager" className="text-muted hover:text-fg text-sm">
        ← Все заявки
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-muted text-sm">
            {application.id} · {stage}
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{application.company}</h1>
          <p className="text-muted mt-1">{service?.title}</p>
        </div>
        <span className="border-line text-muted flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs">
          <RefreshCw className="text-ok size-3.5" /> Bitrix24: синхронизировано
        </span>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <section className="card p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 font-bold">
                <Bot className="text-accent size-5" /> Отчёт AI-агента
              </h2>
              {application.checks.length > 0 && (
                <span className="text-muted text-sm">
                  {application.checks.length} документов · {issues ? `${issues} требуют внимания` : "замечаний нет"}
                </span>
              )}
            </div>
            {application.checks.length === 0 ? (
              <p className="text-muted mt-5 text-sm">Агент ещё собирает документы в WhatsApp.</p>
            ) : (
              <ul className="divide-line mt-5 divide-y">
                {application.checks.map((c) => (
                  <li key={c.doc} className="flex items-start justify-between gap-4 py-3.5">
                    <div>
                      <p className="font-medium">{c.doc}</p>
                      <p className="text-muted text-sm">{c.note}</p>
                    </div>
                    <StatusBadge status={c.status} />
                  </li>
                ))}
              </ul>
            )}
          </section>

          {application.extracted.length > 0 && (
            <section className="card p-6">
              <h2 className="flex items-center gap-2 font-bold">
                <MapPin className="text-accent size-5" /> Извлечённые данные
              </h2>
              <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                {application.extracted.map((f) => (
                  <div key={f.label} className="bg-surface-2 rounded-xl p-4">
                    <dt className="text-muted text-xs">{f.label}</dt>
                    <dd className="mt-1 font-medium tabular-nums">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          <section className="card p-6">
            <h2 className="font-bold">Клиент</h2>
            <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-muted">Контакт</dt>
                <dd className="mt-1 font-medium">{application.contact}</dd>
              </div>
              <div>
                <dt className="text-muted">Город</dt>
                <dd className="mt-1 font-medium">{application.city}</dd>
              </div>
              <div>
                <dt className="text-muted">Канал</dt>
                <dd className="mt-1 font-medium">WhatsApp</dd>
              </div>
            </dl>
          </section>
        </div>

        <OfferForm estimate={application.estimate} />
      </div>
    </div>
  );
}
