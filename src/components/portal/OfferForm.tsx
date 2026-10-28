"use client";

import { Check, Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { formatKzt } from "@/lib/format";

export function OfferForm({ estimate }: { estimate: number }) {
  const [price, setPrice] = useState(estimate ? String(Math.ceil(estimate / 50_000) * 50_000) : "");
  const [days, setDays] = useState("25");
  const [comment, setComment] = useState("");
  const [sent, setSent] = useState(false);
  const priceValue = Number(price.replace(/\D/g, ""));

  return (
    <section className="card p-6 lg:sticky lg:top-24 lg:self-start">
      <p className="text-muted text-sm">Предварительная оценка калькулятора</p>
      <p className="mt-1 text-2xl font-bold tabular-nums">{estimate ? formatKzt(estimate) : "—"}</p>

      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-ok/10 mt-6 rounded-xl p-4 text-sm"
          >
            <p className="text-ok flex items-center gap-2 font-semibold">
              <Check className="size-4" /> КП отправлено в WhatsApp
            </p>
            <p className="text-muted mt-1">
              {formatKzt(priceValue)}, {days} р.д. Сделка в Bitrix24 переведена в «КП отправлено».
            </p>
            <button onClick={() => setSent(false)} className="text-muted hover:text-fg mt-3 text-xs underline">
              Изменить
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            exit={{ opacity: 0 }}
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="border-line mt-6 space-y-3 border-t pt-6"
          >
            <p className="font-semibold">Коммерческое предложение</p>
            <label className="block text-sm">
              <span className="text-muted">Итоговая цена, ₸</span>
              <input
                className="input mt-1 tabular-nums"
                inputMode="numeric"
                value={price}
                onChange={(e) => setPrice(e.target.value.replace(/\D/g, ""))}
                required
              />
            </label>
            <label className="block text-sm">
              <span className="text-muted">Срок, рабочих дней</span>
              <input
                className="input mt-1"
                inputMode="numeric"
                value={days}
                onChange={(e) => setDays(e.target.value.replace(/\D/g, ""))}
                required
              />
            </label>
            <label className="block text-sm">
              <span className="text-muted">Комментарий клиенту</span>
              <textarea
                className="input mt-1 min-h-20 resize-y"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Что входит в стоимость"
              />
            </label>
            <button type="submit" disabled={!priceValue || !days} className="btn btn-primary w-full">
              <Send className="size-4" /> Отправить КП
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </section>
  );
}
