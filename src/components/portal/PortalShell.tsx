"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";

const roles = [
  { href: "/cabinet", label: "Клиент" },
  { href: "/manager", label: "Менеджер" },
  { href: "/admin", label: "Админ" },
];

export function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-dvh">
      <header className="border-line bg-bg/80 sticky top-0 z-40 border-b backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Logo compact />
          <nav className="border-line bg-surface flex rounded-full border p-1 text-sm" aria-label="Роль">
            {roles.map((role) => {
              const active = pathname.startsWith(role.href);
              return (
                <Link
                  key={role.href}
                  href={role.href}
                  className={`relative rounded-full px-3 py-1.5 transition-colors sm:px-4 ${active ? "text-black" : "text-muted hover:text-fg"}`}
                >
                  {active && (
                    <motion.span
                      layoutId="role-pill"
                      className="bg-accent absolute inset-0 rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative font-medium">{role.label}</span>
                </Link>
              );
            })}
          </nav>
          <span className="border-line text-muted hidden rounded-full border px-3 py-1 text-xs sm:inline">Демо-режим</span>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>
    </div>
  );
}
