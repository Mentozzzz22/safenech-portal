"use client";

import { Bot, Check, CheckCheck, FileText, MapPin, TriangleAlert } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/lib/agent-script";

interface ChatPhoneProps {
  messages: ChatMessage[];
  playing: boolean;
  speed?: number;
  onProgress?: (shown: number) => void;
}

const delayFor = (m: ChatMessage) => (m.kind === "report" ? 2600 : m.from === "agent" ? 1500 : 800);

export function ChatPhone({ messages, playing, speed = 1, onProgress }: ChatPhoneProps) {
  const [shown, setShown] = useState(0);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!playing || shown >= messages.length) return;
    const next = messages[shown];
    setTyping(next.from === "agent");
    const id = setTimeout(
      () => {
        setTyping(false);
        setShown((n) => n + 1);
      },
      delayFor(next) / speed,
    );
    return () => clearTimeout(id);
  }, [playing, shown, messages, speed]);

  useEffect(() => {
    onProgress?.(shown);
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [shown, typing, onProgress]);

  return (
    <div className="border-line-strong relative mx-auto w-full max-w-[360px] rounded-[2.6rem] border bg-black p-2.5 shadow-2xl shadow-black">
      <div className="overflow-hidden rounded-[2.1rem] bg-[#0b141a]">
        <div className="flex items-center gap-3 bg-[#202c33] px-4 pt-5 pb-3">
          <span className="bg-accent grid size-9 place-items-center rounded-full text-black">
            <Bot className="size-5" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold">SafeNechExpert</p>
            <p className="text-[11px] text-[#8696a0]">{typing ? "печатает…" : "AI-ассистент · онлайн"}</p>
          </div>
        </div>

        <div ref={scrollRef} data-lenis-prevent className="h-[520px] space-y-2 overflow-y-auto px-3 py-4 text-[13.5px]">
          <AnimatePresence initial={false}>
            {messages.slice(0, shown).map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
                className={`flex ${m.from === "client" ? "justify-end" : "justify-start"}`}
              >
                <Bubble message={m} />
              </motion.div>
            ))}
            {typing && (
              <motion.div key="typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex">
                <div className="flex gap-1 rounded-2xl rounded-tl-sm bg-[#202c33] px-3.5 py-3">
                  {[0, 1, 2].map((d) => (
                    <motion.span
                      key={d}
                      className="size-1.5 rounded-full bg-[#8696a0]"
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: d * 0.15 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Bubble({ message: m }: { message: ChatMessage }) {
  const own = m.from === "client";
  const base = `max-w-[85%] rounded-2xl px-3 py-2 ${own ? "rounded-tr-sm bg-[#005c4b]" : "rounded-tl-sm bg-[#202c33]"}`;
  const ticks = own && <CheckCheck className="mt-0.5 ml-auto size-3.5 text-[#53bdeb]" />;

  switch (m.kind) {
    case "text":
      return (
        <div className={base}>
          <p className="whitespace-pre-line">{m.text}</p>
          {ticks}
        </div>
      );
    case "file":
      return (
        <div className={`${base} flex items-center gap-3`}>
          <FileText className="text-bad size-8 shrink-0" />
          <div className="min-w-0">
            <p className="truncate font-medium">{m.name}</p>
            <p className="text-[11px] text-white/60">PDF · {m.size}</p>
          </div>
        </div>
      );
    case "location":
      return (
        <div className={`${base} w-56 p-1.5`}>
          <div className="bg-grid relative grid h-24 place-items-center rounded-xl bg-[#1d3b34]">
            <MapPin className="fill-bad text-bad size-7" />
          </div>
          <p className="px-1.5 pt-1.5 font-medium">{m.label}</p>
          <p className="px-1.5 text-[11px] text-white/60">{m.coords}</p>
        </div>
      );
    case "report":
      return (
        <div className={`${base} w-[85%]`}>
          <p className="mb-2 font-semibold">Проверил документы:</p>
          <ul className="space-y-1.5">
            {m.items.map((item) => (
              <li key={item.doc} className="flex gap-2">
                {item.ok ? (
                  <Check className="text-ok mt-0.5 size-4 shrink-0" />
                ) : (
                  <TriangleAlert className="text-accent mt-0.5 size-4 shrink-0" />
                )}
                <span>
                  {item.doc}
                  <span className="block text-[11px] text-white/60">{item.note}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      );
  }
}
