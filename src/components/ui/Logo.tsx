import Link from "next/link";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2.5 font-bold tracking-tight" aria-label="SafeNechExpert">
      <span className="bg-accent grid size-8 place-items-center rounded-lg text-sm font-extrabold text-black">S</span>
      <span className={compact ? "hidden sm:inline" : undefined}>
        SafeNech<span className="text-muted">Expert</span>
      </span>
    </Link>
  );
}
