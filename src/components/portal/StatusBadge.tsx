import { Check, Minus, TriangleAlert } from "lucide-react";
import type { CheckStatus } from "@/data/applications";

const styles: Record<CheckStatus, { label: string; className: string; icon: typeof Check }> = {
  ok: { label: "Проверено", className: "bg-ok/12 text-ok", icon: Check },
  warn: { label: "Внимание", className: "bg-accent-soft text-accent", icon: TriangleAlert },
  missing: { label: "Нет файла", className: "bg-bad/12 text-bad", icon: Minus },
};

export function StatusBadge({ status }: { status: CheckStatus }) {
  const s = styles[status];
  return (
    <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${s.className}`}>
      <s.icon className="size-3" strokeWidth={3} />
      {s.label}
    </span>
  );
}
