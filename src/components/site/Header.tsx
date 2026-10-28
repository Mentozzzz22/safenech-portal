"use client";

import { motion, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/ui/Logo";

const nav = [
  { href: "/#how", label: "Как работаем" },
  { href: "/#catalog", label: "Услуги" },
  { href: "/#agent", label: "AI-агент" },
  { href: "/cabinet", label: "Кабинет" },
];

export function Header() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "border-line bg-bg/75 border-b backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="text-muted hidden items-center gap-7 text-sm md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-fg transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href="/calculator/scrap-metal" className="btn btn-primary !px-4 !py-2">
          Рассчитать
        </Link>
      </div>
    </motion.header>
  );
}
