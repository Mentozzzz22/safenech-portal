"use client";

import { ArrowLeft, ArrowRight, Check, Info, Wrench, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatedNumber, EASE } from "@/components/ui/motion";
import type { Service } from "@/data/services";
import { formatKzt, formatWorkDays } from "@/lib/format";
import { LEAD_STORAGE_KEY } from "@/lib/lead";
import { calculateQuote, type Answers, type CalculatorConfig } from "@/lib/pricing";

interface Props {
  service: Service;
  config: CalculatorConfig;
}

export function Calculator({ service, config }: Props) {
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const quote = calculateQuote(config, answers);
  const total = config.questions.length;
  const isResult = step >= total;

  // Bound to the question index, not the current step: an exiting card can still receive clicks.
  const answer = (index: number, value: boolean) => {
    setAnswers((prev) => ({ ...prev, [config.questions[index].id]: value }));
    setDirection(1);
    setStep(index + 1);
  };
  const question = config.questions[step];

  const back = () => {
    setDirection(-1);
    setStep((s) => Math.max(0, s - 1));
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pt-28 pb-24 sm:px-6 sm:pt-32">
      <p className="text-accent text-sm font-semibold">Калькулятор</p>
      <h1 className="mt-2 max-w-3xl text-2xl font-bold tracking-tight sm:text-4xl">{service.title}</h1>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="text-muted mb-4 flex items-center justify-between text-sm">
            <span>{isResult ? "Готово" : `Вопрос ${step + 1} из ${total}`}</span>
            {step > 0 && (
              <button onClick={back} className="hover:text-fg flex items-center gap-1">
                <ArrowLeft className="size-4" /> Назад
              </button>
            )}
          </div>
          <div className="mb-6 flex gap-1.5">
            {config.questions.map((q, i) => (
              <span key={q.id} className="bg-surface-2 h-1 flex-1 overflow-hidden rounded-full">
                <motion.span
                  className="bg-accent block h-full"
                  initial={false}
                  animate={{ width: i < step ? "100%" : "0%" }}
                  transition={{ duration: 0.4, ease: EASE }}
                />
              </span>
            ))}
          </div>

          <AnimatePresence mode="wait" custom={direction}>
            {isResult ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <LeadForm service={service} config={config} answers={answers} />
              </motion.div>
            ) : (
              <motion.div
                key={question.id}
                custom={direction}
                variants={{
                  enter: (d: number) => ({ opacity: 0, x: d * 60 }),
                  center: { opacity: 1, x: 0 },
                  exit: (d: number) => ({ opacity: 0, x: d * -60 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: EASE }}
                className="card p-6 sm:p-10"
              >
                <h2 className="text-2xl leading-snug font-bold sm:text-3xl">{question.text}</h2>
                <p className="text-muted mt-4 flex gap-2">
                  <Info className="mt-0.5 size-4 shrink-0" />
                  {question.hint}
                </p>
                <div className="mt-10 grid gap-3 sm:grid-cols-2">
                  <AnswerButton
                    active={answers[question.id] === true}
                    onClick={() => answer(step, true)}
                    icon={<Check className="size-5" />}
                  >
                    Да, есть
                  </AnswerButton>
                  <AnswerButton active={answers[question.id] === false} onClick={() => answer(step, false)} icon={<X className="size-5" />}>
                    Нет
                  </AnswerButton>
                </div>
                <p className="text-muted mt-5 text-sm">
                  Если нет: {question.fix.toLowerCase()}, +{formatKzt(question.surcharge)}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6">
            <p className="text-muted text-sm">{quote.isComplete ? "Предварительная стоимость" : "Предварительно, от и до"}</p>
            <p className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              <AnimatedNumber value={quote.min} />
            </p>
            <AnimatePresence>
              {!quote.isComplete && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-muted overflow-hidden text-lg"
                >
                  до <AnimatedNumber value={quote.max} />
                </motion.p>
              )}
            </AnimatePresence>
            <p className="mt-4 text-sm">
              Срок:{" "}
              <span className="font-semibold">
                {quote.isComplete ? formatWorkDays(quote.minDays) : `${quote.minDays}–${formatWorkDays(quote.maxDays)}`}
              </span>
            </p>
            <p className="text-muted mt-1 text-xs">Включая госпошлину {formatKzt(config.govFee)}</p>

            <div className="border-line mt-6 border-t pt-5">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <Wrench className="text-accent size-4" /> Закроем за вас
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                <AnimatePresence initial={false}>
                  {quote.missing.length === 0 && (
                    <motion.li key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-muted">
                      Пока ничего
                    </motion.li>
                  )}
                  {quote.missing.map((q) => (
                    <motion.li
                      key={q.id}
                      layout
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 16 }}
                      className="flex justify-between gap-3"
                    >
                      <span className="text-fg/85">{q.fix}</span>
                      <span className="text-muted shrink-0 tabular-nums">+{formatKzt(q.surcharge)}</span>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function AnswerButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-2xl border px-6 py-5 text-lg font-semibold transition-colors ${
        active ? "border-accent bg-accent-soft text-accent" : "border-line-strong hover:border-accent/60 hover:bg-white/[0.03]"
      }`}
    >
      {icon}
      {children}
    </motion.button>
  );
}

function LeadForm({ service, config, answers }: Props & { answers: Answers }) {
  const router = useRouter();
  const quote = calculateQuote(config, answers);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+7 ");
  const [company, setCompany] = useState("");
  const phoneValid = phone.replace(/\D/g, "").length === 11;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      sessionStorage.setItem(LEAD_STORAGE_KEY, JSON.stringify({ name: name.trim(), company: company.trim() }));
    } catch {
      // Storage may be unavailable (private mode); the demo works without the name.
    }
    const has = quote.present.map((q) => q.id).join(",");
    router.push(`/demo/whatsapp?service=${service.slug}&has=${has}`);
  };

  return (
    <div className="card p-6 sm:p-10">
      <h2 className="text-2xl font-bold sm:text-3xl">Расчёт готов</h2>
      <table className="mt-6 w-full text-sm">
        <tbody className="divide-line divide-y">
          <tr>
            <td className="text-muted py-2.5">Услуги компании</td>
            <td className="py-2.5 text-right tabular-nums">{formatKzt(config.serviceFee)}</td>
          </tr>
          {quote.missing.map((q) => (
            <tr key={q.id}>
              <td className="text-muted py-2.5">{q.fix}</td>
              <td className="py-2.5 text-right tabular-nums">+{formatKzt(q.surcharge)}</td>
            </tr>
          ))}
          <tr>
            <td className="text-muted py-2.5">Госпошлина</td>
            <td className="py-2.5 text-right tabular-nums">{formatKzt(config.govFee)}</td>
          </tr>
          <tr className="text-base font-bold">
            <td className="pt-4">Итого, предварительно</td>
            <td className="text-accent pt-4 text-right tabular-nums">{formatKzt(quote.min)}</td>
          </tr>
        </tbody>
      </table>

      <form onSubmit={submit} className="border-line mt-8 space-y-3 border-t pt-8">
        <p className="font-semibold">Куда прислать документы на проверку?</p>
        <p className="text-muted text-sm">AI-агент напишет в WhatsApp в течение минуты.</p>
        <div className="grid gap-3 pt-2 sm:grid-cols-2">
          <input
            className="input"
            placeholder="Имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="given-name"
          />
          <input
            className="input"
            placeholder="+7 700 000 00 00"
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/[^\d+ ]/g, ""))}
            required
          />
        </div>
        <input
          className="input"
          placeholder="Компания или БИН (необязательно)"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <button type="submit" disabled={!phoneValid || !name.trim()} className="btn btn-primary group mt-2 w-full text-base">
          Отправить заявку
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </button>
        <p className="text-muted text-center text-xs">Итоговую цену подтвердит менеджер после проверки документов.</p>
      </form>
    </div>
  );
}
