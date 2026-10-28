"use client";

import { ArrowRight, FileSearch, ListChecks, MapPin, Send } from "lucide-react";
import { useInView } from "motion/react";
import Link from "next/link";
import { useMemo, useRef } from "react";
import { ChatPhone } from "@/components/chat/ChatPhone";
import { Reveal } from "@/components/ui/motion";
import { getCalculator } from "@/data/calculators";
import { buildAgentScript } from "@/lib/agent-script";

const abilities = [
  { icon: ListChecks, title: "Просит только нужное", text: "Список документов строится по ответам из калькулятора." },
  { icon: FileSearch, title: "Читает PDF и фото", text: "Достаёт даты поверки, реквизиты, сроки договоров." },
  { icon: MapPin, title: "Сверяет базу", text: "Геолокация и адрес из договора аренды должны совпасть." },
  { icon: Send, title: "Готовит отчёт менеджеру", text: "Что в порядке, что истекает, чего не хватает." },
];

export function AgentShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const script = useMemo(
    () =>
      buildAgentScript({
        serviceTitle: "Разрешение на лом черных и цветных металлов",
        config: getCalculator("scrap-metal"),
        presentIds: ["scales", "dosimeter"],
        fallbackDocs: [],
        clientName: "Ержан",
      }),
    [],
  );

  return (
    <section id="agent" className="border-line bg-surface/40 relative overflow-hidden border-y py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-2">
        <div>
          <Reveal>
            <p className="text-accent text-sm font-semibold">AI-агент</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
              Документы собирает и проверяет агент. Цену называет человек.
            </h2>
            <p className="text-muted mt-5 max-w-lg">
              Агент пишет в WhatsApp сразу после заявки. Менеджер подключается, когда пакет уже проверен.
            </p>
          </Reveal>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2">
            {abilities.map((a, i) => (
              <Reveal as="li" key={a.title} delay={i * 0.08} className="space-y-2">
                <a.icon className="text-accent size-6" />
                <h3 className="font-semibold">{a.title}</h3>
                <p className="text-muted text-sm">{a.text}</p>
              </Reveal>
            ))}
          </ul>
          <Reveal delay={0.3}>
            <Link href="/demo/whatsapp?service=scrap-metal&has=scales,dosimeter,base" className="btn btn-ghost group mt-10">
              Открыть полное демо
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
        <div ref={ref}>
          <ChatPhone messages={script} playing={inView} />
        </div>
      </div>
    </section>
  );
}
