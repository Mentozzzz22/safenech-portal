"use client";

import { ArrowRight, Check, RotateCcw } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import type { Service } from "@/data/services";
import { buildAgentScript, type ChatMessage } from "@/lib/agent-script";
import { LEAD_STORAGE_KEY } from "@/lib/lead";
import type { CalculatorConfig } from "@/lib/pricing";
import { ChatPhone } from "./ChatPhone";

interface Props {
  service: Service;
  config?: CalculatorConfig;
  presentIds: string[];
}

const readLeadName = () => {
  try {
    const raw = sessionStorage.getItem(LEAD_STORAGE_KEY);
    return raw ? ((JSON.parse(raw) as { name?: string }).name ?? "") : "";
  } catch {
    return "";
  }
};

const noopSubscribe = () => () => {};

function stagesFor(messages: ChatMessage[]) {
  const firstFile = messages.findIndex((m) => m.kind === "file" || m.kind === "location");
  const report = messages.findIndex((m) => m.kind === "report");
  return [
    { title: "Заявка получена", at: 1 },
    { title: "Агент запросил документы", at: 2 },
    { title: "Клиент прислал файлы и геолокацию", at: firstFile + 1 },
    { title: "AI проверил документы", at: report === -1 ? messages.length : report + 1 },
    { title: "Заявка передана менеджеру", at: messages.length },
  ];
}

export function WhatsAppDemo({ service, config, presentIds }: Props) {
  const clientName = useSyncExternalStore(noopSubscribe, readLeadName, () => "");
  const [run, setRun] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [shown, setShown] = useState(0);
  const onProgress = useCallback((n: number) => setShown(n), []);

  const messages = useMemo(
    () =>
      buildAgentScript({
        serviceTitle: service.title,
        config,
        presentIds,
        fallbackDocs: service.requirements.slice(0, 3),
        clientName: clientName || undefined,
      }),
    [service, config, presentIds, clientName],
  );
  const stages = stagesFor(messages);
  const done = shown >= messages.length;

  return (
    <div className="mx-auto max-w-6xl px-4 pt-28 pb-24 sm:px-6 sm:pt-32">
      <div className="grid items-start gap-12 lg:grid-cols-[1fr_400px]">
        <div>
          <p className="text-accent text-sm font-semibold">Демо</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Так клиент общается с AI-агентом</h1>
          <p className="text-muted mt-4 max-w-lg">
            В продукте это настоящий WhatsApp: агент работает через WhatsApp Business API, файлы сохраняются в заявку.
          </p>

          <ol className="mt-10 space-y-4">
            {stages.map((stage) => {
              const reached = shown >= stage.at;
              return (
                <li key={stage.title} className="flex items-center gap-4">
                  <motion.span
                    animate={{
                      backgroundColor: reached ? "#3ddc97" : "rgba(255,255,255,0)",
                      borderColor: reached ? "#3ddc97" : "rgba(255,255,255,0.16)",
                      scale: reached ? [1, 1.25, 1] : 1,
                    }}
                    transition={{ duration: 0.4 }}
                    className="grid size-7 shrink-0 place-items-center rounded-full border text-black"
                  >
                    {reached && <Check className="size-4" strokeWidth={3} />}
                  </motion.span>
                  <span className={reached ? "text-fg" : "text-muted"}>{stage.title}</span>
                </li>
              );
            })}
          </ol>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <button onClick={() => setRun((r) => r + 1)} className="btn btn-ghost">
              <RotateCcw className="size-4" /> Заново
            </button>
            <button onClick={() => setSpeed((s) => (s === 1 ? 2 : 1))} className="btn btn-ghost tabular-nums">
              Скорость ×{speed}
            </button>
          </div>

          <motion.div
            initial={false}
            animate={{ opacity: done ? 1 : 0.35 }}
            className="card mt-10 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-semibold">Что дальше</p>
              <p className="text-muted text-sm">Менеджер видит отчёт агента и отправляет КП. Клиент следит за статусом в кабинете.</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Link href="/manager/APP-1042" className="btn btn-primary">
                Менеджер <ArrowRight className="size-4" />
              </Link>
              <Link href="/cabinet" className="btn btn-ghost">
                Кабинет
              </Link>
            </div>
          </motion.div>
        </div>

        <ChatPhone key={`${run}-${clientName}`} messages={messages} playing speed={speed} onProgress={onProgress} />
      </div>
    </div>
  );
}
