import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { statusLabel } from "@/lib/selectors";
import type { StatusTone } from "@/lib/types";
import { AlertCircle, ArrowUpRight, CheckCircle2, CircleDot } from "lucide-react";
import Link from "next/link";

/**
 * Three evenly spaced stops (your store / cluster average / top stores) so the
 * labels never collide, regardless of how close the underlying values are.
 */
export function MarkerTrack({
  store,
  cluster,
  top,
}: {
  store: number;
  cluster: number;
  top: number;
}) {
  const stops = [
    { value: store, label: "Your Store", dot: "bg-ssb-blue" },
    { value: cluster, label: "Cluster Avg", dot: "bg-slate-400" },
    { value: top, label: "Top Stores", dot: "bg-emerald-500" },
  ];
  return (
    <div className="w-full">
      <div className="relative h-4">
        <div className="absolute top-1/2 right-[16.6%] left-[16.6%] h-[3px] -translate-y-1/2 rounded-full bg-slate-200" />
        <div className="relative grid h-full grid-cols-3">
          {stops.map((s) => (
            <span key={s.label} className="flex items-center justify-center">
              <span className={cn("h-3.5 w-3.5 rounded-full ring-[3px] ring-white", s.dot)} />
            </span>
          ))}
        </div>
      </div>
      <div className="mt-1.5 grid grid-cols-3 text-center">
        {stops.map((s) => (
          <div key={s.label}>
            <p className="text-[15px] font-bold leading-none tabular-nums text-ssb-navy">{s.value}</p>
            <p className="mt-1 text-[11.5px] leading-none text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const toneStyle: Record<StatusTone, { pill: string; icon: string }> = {
  attention: { pill: "bg-[#fee2e2] text-[#b91c1c]", icon: "text-[#dc2626]" },
  opportunity: { pill: "bg-[#fef3c7] text-[#b45309]", icon: "text-[#d97706]" },
  above: { pill: "bg-[#dbeafe] text-[#1d4ed8]", icon: "text-[#2563eb]" },
  strong: { pill: "bg-[#d1fae5] text-[#047857]", icon: "text-[#059669]" },
};

export function StatusBadge({ tone }: { tone: StatusTone }) {
  const style = toneStyle[tone];
  return (
    <span
      className={cn(
        "inline-flex w-full max-w-[168px] items-center justify-center gap-2 rounded-full px-3.5 py-2 text-[13px] font-semibold",
        style.pill,
      )}
    >
      {tone === "attention" ? <AlertCircle className={cn("h-4.5 w-4.5", style.icon)} /> : null}
      {tone === "strong" ? <CheckCircle2 className={cn("h-4.5 w-4.5", style.icon)} /> : null}
      {tone === "above" ? <ArrowUpRight className={cn("h-4.5 w-4.5", style.icon)} /> : null}
      {tone === "opportunity" ? <CircleDot className={cn("h-4.5 w-4.5", style.icon)} /> : null}
      {statusLabel(tone)}
    </span>
  );
}

export function AttributeProfileRow({
  icon,
  iconClass,
  label,
  blurb,
  store,
  cluster,
  top,
  tone,
  insight,
  href,
}: {
  icon: ReactNode;
  iconClass: string;
  label: string;
  blurb: string;
  store: number;
  cluster: number;
  top: number;
  tone: StatusTone;
  insight: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="grid min-h-0 flex-1 grid-cols-[1.15fr_84px_300px_180px_1.05fr] items-center gap-4 rounded-[16px] border border-slate-200 bg-white px-5 transition hover:border-ssb-blue/40 hover:shadow-[0_6px_18px_rgba(31,111,235,0.07)]"
    >
      <div className="flex min-w-0 items-center gap-3.5">
        <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px]", iconClass)}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="truncate text-[16px] font-semibold text-ssb-navy">{label}</p>
          <p className="truncate text-[12.5px] text-slate-500">{blurb}</p>
        </div>
      </div>
      <div>
        <p className="text-[12.5px] text-slate-500">Your Store</p>
        <p className="text-[30px] font-bold leading-none tabular-nums text-ssb-navy">{store}</p>
      </div>
      <MarkerTrack store={store} cluster={cluster} top={top} />
      <div className="justify-self-start">
        <StatusBadge tone={tone} />
      </div>
      <p className="text-[13px] leading-snug text-slate-600">{insight}</p>
    </Link>
  );
}
