import { ArrowRight, Building2, CheckCircle2, Clock, Receipt } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/ui/motion";
import { getCalculator } from "@/data/calculators";
import { categories, getService, services } from "@/data/services";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const service = getService((await params).slug);
  return { title: service ? `${service.title} — SafeNechExpert` : "Услуга не найдена" };
}

export default async function ServicePage({ params }: { params: Params }) {
  const service = getService((await params).slug);
  if (!service) notFound();
  const hasCalc = Boolean(getCalculator(service.slug));
  const category = categories.find((c) => c.id === service.category)?.title;

  const meta = [
    { icon: Building2, label: "Выдаёт", value: service.issuer },
    { icon: Clock, label: "Срок госоргана", value: service.govTerm },
    { icon: Receipt, label: "Госпошлина", value: service.govFee },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 pt-32 pb-24 sm:px-6">
      <Reveal>
        <Link href="/#catalog" className="text-muted hover:text-fg text-sm">
          ← Каталог
        </Link>
        <p className="text-accent mt-8 text-sm font-semibold">{category}</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">{service.title}</h1>
      </Reveal>

      <Reveal delay={0.1} className="mt-10 grid gap-4 sm:grid-cols-3">
        {meta.map((m) => (
          <div key={m.label} className="card p-5">
            <m.icon className="text-accent size-5" />
            <p className="text-muted mt-3 text-xs">{m.label}</p>
            <p className="mt-1 font-semibold">{m.value}</p>
          </div>
        ))}
      </Reveal>

      <Reveal delay={0.2} className="card mt-6 p-6 sm:p-8">
        <h2 className="text-xl font-bold">Основные требования</h2>
        <ul className="mt-5 space-y-3">
          {service.requirements.map((r) => (
            <li key={r} className="flex gap-3">
              <CheckCircle2 className="text-ok mt-0.5 size-5 shrink-0" />
              <span>{r}</span>
            </li>
          ))}
        </ul>
        <p className="text-muted mt-6 text-sm">
          Чего нет — подготовим за вас. Сведения о регистрации и оплате сбора госорган получает сам.
        </p>
      </Reveal>

      <Reveal delay={0.3} className="mt-8 flex flex-wrap gap-3">
        {hasCalc ? (
          <Link href={`/calculator/${service.slug}`} className="btn btn-primary group text-base">
            Рассчитать стоимость
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        ) : (
          <Link href={`/demo/whatsapp?service=${service.slug}`} className="btn btn-primary group text-base">
            Оставить заявку
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </Reveal>
    </div>
  );
}
