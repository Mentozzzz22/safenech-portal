"use client";

import { Plus, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { AnimatedNumber } from "@/components/ui/motion";
import type { Service } from "@/data/services";
import { calculateQuote, type Answers, type CalcQuestion, type CalculatorConfig } from "@/lib/pricing";

interface Props {
  initial: CalculatorConfig[];
  services: Service[];
}

type NumericField = "serviceFee" | "govFee" | "prepDays" | "govDays";

const configFields: { key: NumericField; label: string }[] = [
  { key: "serviceFee", label: "Базовая цена услуг, ₸" },
  { key: "govFee", label: "Госпошлина, ₸" },
  { key: "prepDays", label: "Наша подготовка, р.д." },
  { key: "govDays", label: "Срок госоргана, р.д." },
];

const allAnswers = (config: CalculatorConfig, value: boolean): Answers => Object.fromEntries(config.questions.map((q) => [q.id, value]));

export function CalculatorEditor({ initial, services }: Props) {
  const [configs, setConfigs] = useState(initial);
  const [selected, setSelected] = useState(initial[0].serviceSlug);
  const config = configs.find((c) => c.serviceSlug === selected)!;
  const titleOf = (slug: string) => services.find((s) => s.slug === slug)?.title ?? slug;
  const best = calculateQuote(config, allAnswers(config, true));
  const worst = calculateQuote(config, allAnswers(config, false));

  const update = (patch: Partial<CalculatorConfig>) =>
    setConfigs((prev) => prev.map((c) => (c.serviceSlug === selected ? { ...c, ...patch } : c)));

  const updateQuestion = (id: string, patch: Partial<CalcQuestion>) =>
    update({ questions: config.questions.map((q) => (q.id === id ? { ...q, ...patch } : q)) });

  const addQuestion = () =>
    update({
      questions: [
        ...config.questions,
        { id: `q-${Date.now()}`, text: "Новый вопрос", hint: "", docs: [], fix: "Что сделаем за клиента", surcharge: 0, extraDays: 0 },
      ],
    });

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Калькуляторы</h1>
      <p className="text-muted mt-1 text-sm">Вопросы и цены по услугам. В демо изменения не сохраняются.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="card h-fit p-2">
          {configs.map((c) => (
            <button
              key={c.serviceSlug}
              onClick={() => setSelected(c.serviceSlug)}
              className={`w-full rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                c.serviceSlug === selected ? "bg-accent-soft text-accent" : "text-muted hover:text-fg hover:bg-white/5"
              }`}
            >
              {titleOf(c.serviceSlug)}
            </button>
          ))}
          <p className="text-muted px-3 pt-4 pb-2 text-xs">Без калькулятора: {services.length - configs.length} услуг</p>
        </aside>

        <div className="space-y-6">
          <section className="card p-6">
            <h2 className="font-bold">{titleOf(selected)}</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {configFields.map((f) => (
                <label key={f.key} className="block text-sm">
                  <span className="text-muted">{f.label}</span>
                  <input
                    className="input mt-1 tabular-nums"
                    inputMode="numeric"
                    value={config[f.key]}
                    onChange={(e) => update({ [f.key]: Number(e.target.value.replace(/\D/g, "")) })}
                  />
                </label>
              ))}
            </div>
            <div className="bg-surface-2 mt-6 grid gap-4 rounded-xl p-4 sm:grid-cols-2">
              <div>
                <p className="text-muted text-xs">Всё есть</p>
                <p className="text-xl font-bold">
                  <AnimatedNumber value={best.min} />
                </p>
                <p className="text-muted text-xs">{best.minDays} р.д.</p>
              </div>
              <div>
                <p className="text-muted text-xs">Ничего нет</p>
                <p className="text-xl font-bold">
                  <AnimatedNumber value={worst.min} />
                </p>
                <p className="text-muted text-xs">{worst.minDays} р.д.</p>
              </div>
            </div>
          </section>

          <section className="card p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-bold">Вопросы ({config.questions.length})</h2>
              <button onClick={addQuestion} className="btn btn-ghost !py-2">
                <Plus className="size-4" /> Добавить
              </button>
            </div>
            <ul className="mt-5 space-y-3">
              <AnimatePresence initial={false}>
                {config.questions.map((q, i) => (
                  <motion.li
                    key={q.id}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="border-line grid grid-cols-[1fr_1fr_40px] items-center gap-3 rounded-xl border p-4 xl:grid-cols-[24px_2fr_1.5fr_130px_80px_40px]">
                      <span className="text-muted hidden text-sm xl:block">{i + 1}</span>
                      <input
                        className="input col-span-3 xl:col-span-1"
                        value={q.text}
                        onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
                        aria-label="Вопрос"
                      />
                      <input
                        className="input col-span-3 xl:col-span-1"
                        value={q.fix}
                        onChange={(e) => updateQuestion(q.id, { fix: e.target.value })}
                        aria-label="Если нет"
                      />
                      <input
                        className="input tabular-nums"
                        inputMode="numeric"
                        value={q.surcharge}
                        onChange={(e) => updateQuestion(q.id, { surcharge: Number(e.target.value.replace(/\D/g, "")) })}
                        aria-label="Надбавка, ₸"
                      />
                      <input
                        className="input tabular-nums"
                        inputMode="numeric"
                        value={q.extraDays}
                        onChange={(e) => updateQuestion(q.id, { extraDays: Number(e.target.value.replace(/\D/g, "")) })}
                        aria-label="Доп. дни"
                      />
                      <button
                        onClick={() => update({ questions: config.questions.filter((x) => x.id !== q.id) })}
                        className="text-muted hover:bg-bad/10 hover:text-bad grid size-10 place-items-center rounded-xl"
                        aria-label="Удалить вопрос"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
            <p className="text-muted mt-4 text-xs">Колонки: вопрос · что делаем, если нет · надбавка, ₸ · доп. дни</p>
          </section>
        </div>
      </div>
    </div>
  );
}
