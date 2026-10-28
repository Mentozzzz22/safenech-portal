import { services } from "@/data/services";

export function Marquee() {
  const items = services.map((s) => s.title);
  return (
    <div className="border-line relative overflow-hidden border-y [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] py-5">
      <div className="animate-marquee text-muted flex w-max gap-10 text-sm whitespace-nowrap">
        {[...items, ...items].map((title, i) => (
          <span key={i} className="flex items-center gap-10">
            {title}
            <span className="bg-accent size-1 rounded-full" />
          </span>
        ))}
      </div>
    </div>
  );
}
