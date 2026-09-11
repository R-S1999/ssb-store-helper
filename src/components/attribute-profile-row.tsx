import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { statusLabel } from "@/lib/selectors";
import type { StatusTone } from "@/lib/types";
import { AlertCircle, ArrowUpRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function MarkerTrack({
  store,
  cluster,
  top,
}: {
  store: number;
  cluster: number;
  top: number;
}) {
  const pos = (n: number) => `${Math.min(96, Math.max(4, n))}%`;
  const liftCluster = Math.abs(store - cluster) < 8;
  const liftTop = Math.abs(top - cluster) < 8 || Math.abs(top - store) < 8;
  return (
    <div className="w-[200px] shrink-0">
      <div className="relative h-8">
        <div className="absolute top-[11px] right-1 left-1 h-0.5 rounded-full bg-slate-200" />
        <Marker left={pos(store)} color="bg-ssb-blue" label={String(store)} />
        <Marker left={pos(cluster)} color="bg-slate-400" label={String(cluster)} lift={liftCluster} />
        <Marker left={pos(top)} color="bg-emerald-500" label={String(top)} lift={liftTop && !liftCluster} />
      </div>
      <div className="mt-0.5 flex justify-between text-[9px] text-slate-400">
        <span>Your Store</span>
        <span>Cluster Avg</span>
        <span>Top Stores</span>
      </div>
    </div>
  );
}

function Marker({ left, color, label, lift = false }: { left: string; color: string; label: string; lift?: boolean }) {
  return (
    <span className={cn("absolute -translate-x-1/2", lift ? "-top-1.5" : "top-0")} style={{ left }}>
      <span className="block text-center text-[9px] font-semibold tabular-nums text-slate-500">{label}</span>
      <span className={cn("mx-auto mt-0.5 block h-2.5 w-2.5 rounded-full ring-2 ring-white", color)} />
    </span>
  );
}

const toneStyle: Record<StatusTone, string> = {
  attention: "bg-red-50 text-ssb-red",
  opportunity: "bg-amber-50 text-ssb-amber",
  above: "bg-blue-50 text-ssb-blue",
  strong: "bg-emerald-50 text-ssb-green",
};

export function StatusBadge({ tone }: { tone: StatusTone }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold", toneStyle[tone])}>
      {tone === "attention" ? <AlertCircle className="h-3.5 w-3.5" /> : null}
      {tone === "strong" ? <CheckCircle2 className="h-3.5 w-3.5" /> : null}
      {tone === "above" ? <ArrowUpRight className="h-3.5 w-3.5" /> : null}
      {tone === "opportunity" ? <span className="text-[10px]">●</span> : null}
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
      className="grid grid-cols-[minmax(220px,1.15fr)_52px_210px_140px_minmax(180px,1.2fr)] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 transition hover:border-ssb-blue/30 hover:shadow-[0_6px_18px_rgba(31,111,235,0.06)]"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", iconClass)}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ssb-navy">{label}</p>
          <p className="truncate text-[11px] text-slate-500">{blurb}</p>
        </div>
      </div>
      <div>
        <p className="text-[9px] font-medium uppercase tracking-wide text-slate-400">Your Store</p>
        <p className="text-xl font-semibold leading-none tabular-nums text-ssb-navy">{store}</p>
      </div>
      <MarkerTrack store={store} cluster={cluster} top={top} />
      <div className="justify-self-start">
        <StatusBadge tone={tone} />
      </div>
      <p className="text-[12px] leading-snug text-slate-500">{insight}</p>
    </Link>
  );
}
