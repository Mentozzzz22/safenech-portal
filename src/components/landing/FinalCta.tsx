"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { Reveal } from "@/components/ui/motion";

export function FinalCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
      <Reveal>
        <div className="card relative overflow-hidden px-6 py-16 text-center sm:px-16 sm:py-24">
          <motion.div
            aria-hidden
            className="bg-accent/20 absolute -top-1/2 left-1/2 size-[640px] -translate-x-1/2 rounded-full blur-[120px]"
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">Узнайте цену своей лицензии за минуту</h2>
            <p className="text-muted mx-auto mt-5 max-w-md">Без регистрации. Отвечаете на вопросы и сразу видите сумму и срок.</p>
            <Link href="/calculator/scrap-metal" className="btn btn-primary group mt-9 text-base">
              Начать расчёт
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
