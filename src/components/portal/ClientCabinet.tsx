"use client";

import { Check, CreditCard, FileText, Wallet } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Application } from "@/data/applications";
import { formatKzt } from "@/lib/format";
import { StatusBadge } from "./StatusBadge";

const timeline = ["Заявка", "Документы", "AI-проверка", "КП", "Оплата", "В работе", "Подано в госорган", "Выдано"];
const OFFER_STEP = 3;

const offer = { price: 1_650_000, days: 25, comment: "Включили продление поверки весов и договор дозиметрии." };

export function ClientCabinet({ application, serviceTitle }: { application: Application; serviceTitle: string }) {
  const [current, setCurrent] = useState(OFFER_STEP);
  const paid = current > OFFER_STEP + 1;

  const pay = () => setCurrent(OFFER_STEP + 2);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-muted text-sm">
          Заявка {application.id} · {application.company}
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{serviceTitle}</h1>
      </div>

      <section className="card overflow-x-auto p-6">
        <ol className="flex min-w-[720px] items-start">
          {timeline.map((step, i) => {
            const done = i < current;
            const active = i === current;
            return (
              <li key={step} className="relative flex flex-1 flex-col items-center text-center">
                {i > 0 && (
                  <span className="bg-line absolute top-3.5 right-1/2 h-px w-full">
                    <motion.span
                      className="bg-ok block h-full origin-left"
                      initial={false}
                      animate={{ scaleX: i <= current ? 1 : 0 }}
                      transition={{ duration: 0.5, delay: 0.05 * i }}
                    />
                  </span>
                )}
                <motion.span
                  initial={false}
                  animate={{ scale: active ? 1.15 : 1 }}
                  className={`relative z-10 grid size-7 place-items-center rounded-full border text-xs font-bold ${
                    done
                      ? "border-ok bg-ok text-black"
                      : active
                        ? "border-accent bg-accent-soft text-accent"
                        : "border-line-strong bg-bg text-muted"
                  }`}
                >
                  {done ? <Check className="size-4" strokeWidth={3} /> : i + 1}
                </motion.span>
                <span className={`mt-2 px-1 text-xs ${active ? "text-fg font-semibold" : "text-muted"}`}>{step}</span>
              </li>
            );
          })}
        </ol>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <section className="card p-6">
          <h2 className="font-bold">Документы</h2>
          <p className="text-muted mt-1 text-sm">Проверены AI-агентом, присланы в WhatsApp</p>
          <ul className="divide-line mt-5 divide-y">
            {application.checks.map((c) => (
              <li key={c.doc} className="flex items-start gap-3 py-3.5">
                <FileText className="text-muted mt-0.5 size-5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{c.doc}</p>
                  <p className="text-muted text-sm">{c.note}</p>
                </div>
                <StatusBadge status={c.status} />
              </li>
            ))}
          </ul>
        </section>

        <section className="card relative overflow-hidden p-6 lg:self-start">
          <AnimatePresence mode="wait">
            {paid ? (
              <motion.div key="paid" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-6 text-center">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 14, delay: 0.1 }}
                  className="bg-ok mx-auto grid size-16 place-items-center rounded-full text-black"
                >
                  <Check className="size-8" strokeWidth={3} />
                </motion.span>
                <h2 className="mt-5 text-xl font-bold">Оплата получена</h2>
                <p className="text-muted mt-2 text-sm">Команда приступила к работе. Срок: {offer.days} рабочих дней.</p>
              </motion.div>
            ) : (
              <motion.div key="offer" exit={{ opacity: 0, scale: 0.95 }}>
                <p className="text-muted text-sm">Коммерческое предложение от менеджера</p>
                <p className="mt-2 text-3xl font-extrabold tracking-tight tabular-nums">{formatKzt(offer.price)}</p>
                <p className="mt-1 text-sm">
                  Срок: <b>{offer.days} рабочих дней</b> после оплаты
                </p>
                <p className="bg-surface-2 text-muted mt-4 rounded-xl p-3 text-sm">{offer.comment}</p>
                <div className="mt-6 grid gap-2">
                  <button onClick={pay} className="btn btn-primary">
                    <Wallet className="size-4" /> Оплатить через Kaspi
                  </button>
                  <button onClick={pay} className="btn btn-ghost">
                    <CreditCard className="size-4" /> Картой
                  </button>
                </div>
                <p className="text-muted mt-3 text-center text-xs">Демо: оплата не проводится</p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
}
