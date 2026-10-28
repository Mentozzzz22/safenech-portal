"use client";

import { ArrowUpRight, Calculator } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { Reveal } from "@/components/ui/motion";
import { calculators } from "@/data/calculators";
import { categories, services, type CategoryId } from "@/data/services";

type Filter = CategoryId | "all";

const withCalculator = new Set(calculators.map((c) => c.serviceSlug));

export function Catalog() {
  const [filter, setFilter] = useState<Filter>("all");
  const visible = filter === "all" ? services : services.filter((s) => s.category === filter);
  const tabs: { id: Filter; title: string }[] = [{ id: "all", title: "Все" }, ...categories];

  return (
    <section id="catalog" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p className="text-accent text-sm font-semibold">Каталог</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">Что оформляем</h2>
        </div>
        <p className="text-muted max-w-sm">Госпошлина и сроки госоргана. Наши услуги считает калькулятор.</p>
      </Reveal>

      <LayoutGroup>
        <div className="-mx-4 mt-10 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`relative shrink-0 rounded-full px-4 py-2 text-sm transition-colors ${
                filter === tab.id ? "text-black" : "text-muted hover:text-fg"
              }`}
            >
              {filter === tab.id && (
                <motion.span
                  layoutId="catalog-tab"
                  className="bg-accent absolute inset-0 rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative font-medium">{tab.title}</span>
            </button>
          ))}
        </div>

        <motion.ul layout className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((service) => {
              const hasCalc = withCalculator.has(service.slug);
              return (
                <motion.li
                  key={service.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    href={hasCalc ? `/calculator/${service.slug}` : `/services/${service.slug}`}
                    className="card group hover:border-accent/40 flex h-full flex-col p-5 transition-all hover:-translate-y-1"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-muted text-xs">{categories.find((c) => c.id === service.category)?.title}</span>
                      {hasCalc ? (
                        <span className="bg-accent-soft text-accent flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold">
                          <Calculator className="size-3" /> Калькулятор
                        </span>
                      ) : (
                        <ArrowUpRight className="text-muted group-hover:text-accent size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      )}
                    </div>
                    <h3 className="mt-3 flex-1 leading-snug font-semibold">{service.title}</h3>
                    <dl className="border-line mt-5 grid grid-cols-2 gap-3 border-t pt-4 text-xs">
                      <div>
                        <dt className="text-muted">Срок госоргана</dt>
                        <dd className="mt-0.5 font-medium">{service.govTerm}</dd>
                      </div>
                      <div>
                        <dt className="text-muted">Госпошлина</dt>
                        <dd className="mt-0.5 font-medium">{service.govFee}</dd>
                      </div>
                    </dl>
                  </Link>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </motion.ul>
      </LayoutGroup>
    </section>
  );
}
