"use client";

import { Check, FileText, ScanLine } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useState } from "react";

const checklist = ["Договор аренды базы", "Акт на земельный участок", "Поверка весов", "Договор дозиметрии", "Сведения о персонале"];

const CYCLE_MS = 7500;
const ITEM_STEP = 0.55;

/** Hero visual: a permit fills its checklist and gets stamped, on a loop. */
export function DocumentStamp() {
  const [cycle, setCycle] = useState(0);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(
    useTransform(rx, (v) => v * -8),
    { stiffness: 120, damping: 14 },
  );
  const rotateY = useSpring(
    useTransform(ry, (v) => v * 10),
    { stiffness: 120, damping: 14 },
  );

  useEffect(() => {
    const id = setInterval(() => setCycle((c) => c + 1), CYCLE_MS);
    return () => clearInterval(id);
  }, []);

  const stampDelay = 0.6 + checklist.length * ITEM_STEP + 0.3;

  return (
    <div
      className="relative mx-auto w-full max-w-sm [perspective:1200px]"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        rx.set((e.clientY - r.top) / r.height - 0.5);
        ry.set((e.clientX - r.left) / r.width - 0.5);
      }}
      onMouseLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      <div className="bg-accent/10 absolute -inset-10 rounded-full blur-3xl" />
      <motion.div style={{ rotateX, rotateY }} className="card relative overflow-hidden p-6 shadow-2xl shadow-black/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="bg-accent-soft text-accent grid size-10 place-items-center rounded-xl">
              <FileText className="size-5" />
            </span>
            <div>
              <p className="text-muted text-xs">Разрешение</p>
              <p className="text-sm font-semibold">Лом черных и цветных металлов</p>
            </div>
          </div>
          <span className="text-muted text-xs tabular-nums">KZ-0471</span>
        </div>

        <div key={cycle} className="relative mt-6">
          <motion.div
            className="text-accent pointer-events-none absolute inset-x-0 z-10 flex items-center gap-2"
            initial={{ top: 0, opacity: 0 }}
            animate={{ top: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
            transition={{ duration: checklist.length * ITEM_STEP + 0.4, delay: 0.4, ease: "linear" }}
          >
            <ScanLine className="size-4" />
            <span className="from-accent h-px flex-1 bg-gradient-to-r to-transparent" />
          </motion.div>

          <ul className="space-y-2.5">
            {checklist.map((item, i) => (
              <li key={item} className="border-line bg-surface-2 flex items-center justify-between rounded-xl border px-3 py-2.5 text-sm">
                <span className="text-fg/85">{item}</span>
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.6 + i * ITEM_STEP }}
                  className="bg-ok/15 text-ok grid size-5 place-items-center rounded-full"
                >
                  <Check className="size-3" strokeWidth={3} />
                </motion.span>
              </li>
            ))}
          </ul>

          <div className="bg-surface-2 mt-5 h-1.5 overflow-hidden rounded-full">
            <motion.div
              className="bg-accent h-full rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: checklist.length * ITEM_STEP, delay: 0.6, ease: "easeInOut" }}
            />
          </div>

          <motion.div
            initial={{ scale: 2.6, opacity: 0, rotate: -24 }}
            animate={{ scale: 1, opacity: 1, rotate: -12 }}
            transition={{ type: "spring", stiffness: 500, damping: 22, delay: stampDelay }}
            className="border-ok bg-surface/80 text-ok pointer-events-none absolute right-2 bottom-6 rounded-xl border-[3px] px-4 py-1.5 text-2xl font-black tracking-widest uppercase backdrop-blur-sm"
          >
            Выдано
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        key={`chip-${cycle}`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: stampDelay + 0.3, duration: 0.5 }}
        className="card absolute -right-2 -bottom-6 px-4 py-3 text-xs shadow-xl sm:-right-8"
      >
        <p className="text-muted">Срок</p>
        <p className="text-base font-bold">25 рабочих дней</p>
      </motion.div>
    </div>
  );
}
