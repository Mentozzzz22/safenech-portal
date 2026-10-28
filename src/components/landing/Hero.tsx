"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import Link from "next/link";
import { EASE } from "@/components/ui/motion";
import { DocumentStamp } from "./DocumentStamp";

const headline = [
  { text: "Лицензия", accent: false },
  { text: "без", accent: true },
  { text: "очередей", accent: true },
  { text: "и", accent: false },
  { text: "хождения", accent: false },
  { text: "по", accent: false },
  { text: "кабинетам", accent: false },
];

const facts = [
  { value: "26+", label: "видов разрешений" },
  { value: "1 мин", label: "до предварительной цены" },
  { value: "0", label: "визитов в госорганы" },
];

export function Hero() {
  const mx = useMotionValue(50);
  const my = useMotionValue(30);
  const x = useSpring(mx, { stiffness: 60, damping: 20 });
  const y = useSpring(my, { stiffness: 60, damping: 20 });
  const spotlight = useMotionTemplate`radial-gradient(600px circle at ${x}% ${y}%, rgb(255 178 36 / 0.14), transparent 60%)`;

  return (
    <section
      className="relative overflow-hidden pt-28 pb-20 sm:pt-36"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - rect.left) / rect.width) * 100);
        my.set(((e.clientY - rect.top) / rect.height) * 100);
      }}
    >
      <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <motion.div className="pointer-events-none absolute inset-0" style={{ background: spotlight }} />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="border-line-strong bg-surface/60 text-muted mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs backdrop-blur"
          >
            <Sparkles className="text-accent size-3.5" />
            Документы проверяет AI-агент, решение за менеджером
          </motion.div>

          <h1 className="text-[2.5rem] leading-[1.04] font-extrabold tracking-tight sm:text-6xl lg:text-[4rem] xl:text-7xl">
            {headline.map((word, i) => (
              <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
                <motion.span
                  className={`inline-block ${word.accent ? "text-accent" : ""}`}
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.15 + i * 0.07, ease: EASE }}
                >
                  {word.text}&nbsp;
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
            className="text-muted mt-6 max-w-lg text-lg"
          >
            Ответьте на несколько вопросов и узнайте цену и срок за минуту. Чего не хватает — оформим за вас.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85, ease: EASE }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <Link href="/calculator/scrap-metal" className="btn btn-primary group text-base">
              Рассчитать стоимость
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/#catalog" className="btn btn-ghost text-base">
              Все услуги
            </Link>
          </motion.div>

          <motion.dl
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: 1 } } }}
            className="mt-12 grid max-w-md grid-cols-3 gap-6"
          >
            {facts.map((f) => (
              <motion.div
                key={f.label}
                variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                className="border-line-strong border-l pl-3"
              >
                <dt className="text-2xl font-bold">{f.value}</dt>
                <dd className="text-muted mt-1 text-xs">{f.label}</dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: EASE }}
        >
          <DocumentStamp />
        </motion.div>
      </div>
    </section>
  );
}
