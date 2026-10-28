"use client";

import { Calculator, CreditCard, MessageCircle, UserCheck } from "lucide-react";
import { motion, useScroll } from "motion/react";
import { useRef } from "react";
import { Reveal } from "@/components/ui/motion";

const steps = [
  {
    icon: Calculator,
    title: "Калькулятор",
    text: "Выбираете услугу и отвечаете «есть / нет» по требованиям. Сразу видите цену и срок.",
  },
  {
    icon: MessageCircle,
    title: "AI-агент в WhatsApp",
    text: "Запрашивает сертификаты, договоры и геолокацию базы. Проверяет сроки, реквизиты и соответствие требованиям.",
  },
  {
    icon: UserCheck,
    title: "Менеджер",
    text: "Получает проверенный пакет и называет итоговую цену и срок. Без повторных запросов.",
  },
  {
    icon: CreditCard,
    title: "Оплата и выдача",
    text: "Оплачиваете через Kaspi или картой. Мы подаём документы и передаём вам готовое разрешение.",
  },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });

  return (
    <section id="how" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
      <Reveal>
        <p className="text-accent text-sm font-semibold">Как это работает</p>
        <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">Четыре шага от заявки до разрешения</h2>
      </Reveal>

      <div ref={ref} className="relative mt-16 pl-10 sm:pl-16">
        <div className="bg-line absolute top-2 bottom-2 left-[15px] w-px sm:left-[23px]" />
        <motion.div
          style={{ scaleY: scrollYProgress }}
          className="bg-accent absolute top-2 bottom-2 left-[15px] w-px origin-top sm:left-[23px]"
        />
        <ol className="space-y-6">
          {steps.map((step, i) => (
            <Reveal
              as="li"
              key={step.title}
              delay={i * 0.05}
              className="card group hover:border-line-strong relative p-6 transition-colors sm:p-8"
            >
              <span className="border-line-strong bg-bg absolute top-7 -left-10 grid size-8 place-items-center rounded-full border text-xs font-bold sm:-left-16 sm:size-12 sm:text-sm">
                {i + 1}
              </span>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                <step.icon className="text-accent size-7 shrink-0" />
                <div>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="text-muted mt-2 max-w-xl">{step.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
