import { Bot } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { applications, stages } from "@/data/applications";
import { getService } from "@/data/services";
import { formatKzt } from "@/lib/format";

export const metadata: Metadata = { title: "Заявки — SafeNechExpert" };

export default function ManagerBoardPage() {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Заявки</h1>
          <p className="text-muted mt-1 text-sm">{applications.length} активных · синхронизируются с Bitrix24</p>
        </div>
      </div>

      <div className="-mx-4 mt-8 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6">
        <div className="grid min-w-[1200px] grid-cols-6 gap-4">
          {stages.map((stage) => {
            const items = applications.filter((a) => a.stage === stage.id);
            return (
              <section key={stage.id} className="bg-surface/60 rounded-2xl p-3">
                <h2 className="flex items-center justify-between px-1 pb-3 text-sm font-semibold">
                  {stage.title}
                  <span className="bg-surface-2 text-muted rounded-full px-2 text-xs">{items.length}</span>
                </h2>
                <ul className="space-y-3">
                  {items.map((a) => {
                    const warnings = a.checks.filter((c) => c.status !== "ok").length;
                    return (
                      <li key={a.id}>
                        <Link
                          href={`/manager/${a.id}`}
                          className="card hover:border-accent/40 block p-4 transition-all hover:-translate-y-0.5"
                        >
                          <p className="text-muted text-xs">
                            {a.id} · {a.createdAt}
                          </p>
                          <p className="mt-1.5 leading-snug font-semibold">{a.company}</p>
                          <p className="text-muted mt-1 line-clamp-2 text-xs">{getService(a.serviceSlug)?.title}</p>
                          <div className="mt-3 flex items-center justify-between text-xs">
                            <span className="tabular-nums">{a.estimate ? formatKzt(a.estimate) : "Без расчёта"}</span>
                            {a.checks.length > 0 && (
                              <span className={`flex items-center gap-1 ${warnings ? "text-accent" : "text-ok"}`}>
                                <Bot className="size-3.5" />
                                {warnings ? `${warnings} замеч.` : "OK"}
                              </span>
                            )}
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
