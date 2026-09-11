import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { statusLabel } from "@/lib/selectors";
import type { StatusTone } from "@/lib/types";

export function BenchmarkBar({
  store,
  cluster,
  top,
  max = 100,
}: {
  store: number;
  cluster: number;
  top: number;
  max?: number;
}) {
  const pct = (n: number) => `${Math.min(100, (n / max) * 100)}%`;
  return (
    <div className="relative mt-3 h-2.5 rounded-full bg-slate-100">
      <div className="absolute inset-y-0 left-0 rounded-full bg-ssb-blue" style={{ width: pct(store) }} />
      <span
        className="absolute top-1/2 h-4 w-0.5 -translate-y-1/2 bg-ssb-grey"
        style={{ left: pct(cluster) }}
        title={`Cluster ${cluster}`}
      />
      <span
        className="absolute top-1/2 h-4 w-0.5 -translate-y-1/2 bg-ssb-green"
        style={{ left: pct(top) }}
        title={`Top stores ${top}`}
      />
    </div>
  );
}

const toneClass: Record<StatusTone, string> = {
  strong: "bg-emerald-50 text-ssb-green",
  above: "bg-ssb-blue-soft text-ssb-blue",
  opportunity: "bg-amber-50 text-ssb-amber",
  attention: "bg-red-50 text-ssb-red",
};

export function StatusPill({ tone }: { tone: StatusTone }) {
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold", toneClass[tone])}>
      {statusLabel(tone)}
    </span>
  );
}

export function BenchmarkRow({
  icon,
  label,
  store,
  cluster,
  top,
  insight,
  href,
  open,
  max = 100,
  invert = false,
  unit = "/100",
}: {
  icon?: React.ReactNode;
  label: string;
  store: number;
  cluster: number;
  top: number;
  insight?: string;
  href?: string;
  open?: boolean;
  max?: number;
  invert?: boolean;
  unit?: string;
}) {
  const better = invert ? store <= cluster : store >= cluster;
  const nearTop = invert ? store <= top + 0.2 : store >= top - 4;
  const close = invert ? store <= cluster + 0.6 : store >= cluster - 6;
  const tone: StatusTone = nearTop ? "strong" : better ? "above" : close ? "opportunity" : "attention";
  const inner = (
    <div
      className={cn(
        "group flex w-full items-center gap-4 rounded-2xl border border-border bg-white px-4 py-4 text-left shadow-[0_4px_18px_rgba(11,35,64,0.03)] transition hover:border-ssb-blue/40 hover:shadow-[0_8px_24px_rgba(31,111,235,0.08)]",
        open && "border-ssb-blue/50",
      )}
    >
      {icon ? (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ssb-blue-soft text-ssb-blue">
          {icon}
        </div>
      ) : null}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-semibold text-ssb-navy">{label}</p>
          <div className="flex items-center gap-2">
            <StatusPill tone={tone} />
            <p className="text-lg font-semibold tabular-nums text-ssb-navy">
              {Number.isInteger(store) ? store : store.toFixed(1)}
              <span className="text-sm font-medium text-muted-foreground">{unit}</span>
            </p>
          </div>
        </div>
        <BenchmarkBar store={store} cluster={cluster} top={top} max={max} />
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-muted-foreground">
          <span>
            <span className="font-medium text-ssb-blue">Your store {store}</span>
          </span>
          <span>
            <span className="font-medium text-ssb-grey">Cluster {cluster}</span>
          </span>
          <span>
            <span className="font-medium text-ssb-green">Top {top}</span>
          </span>
        </div>
        {insight ? <p className="mt-2 text-sm text-muted-foreground">{insight}</p> : null}
      </div>
      {href ? (
        <ChevronRight className="h-5 w-5 shrink-0 text-slate-300 transition group-hover:text-ssb-blue" />
      ) : null}
    </div>
  );

  if (href) {
    return <Link href={href}>{inner}</Link>;
  }
  return inner;
}
