import { cn } from "@/lib/utils";
import type { Source, SourceKind } from "@/lib/types";

const kindClass: Record<SourceKind, string> = {
  store: "bg-ssb-blue-soft text-ssb-blue border-blue-200",
  peer: "bg-emerald-50 text-ssb-green border-emerald-200",
  competitor: "bg-[#f3eefc] text-ssb-competitor border-violet-200",
  method: "bg-slate-100 text-slate-600 border-slate-200",
};

export function EvidenceChip({
  source,
  className,
}: {
  source: Source;
  className?: string;
}) {
  const classes = cn(
    "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-1 text-[11px] font-medium",
    kindClass[source.kind],
    className,
  );
  if (source.href) {
    return (
      <a href={source.href} target="_blank" rel="noreferrer" className={cn(classes, "hover:underline")}>
        {source.label}
      </a>
    );
  }
  return <span className={classes}>{source.label}</span>;
}

export function EvidenceBlock({
  kind,
  title,
  children,
}: {
  kind: "store" | "peer" | "competitor";
  title: string;
  children: React.ReactNode;
}) {
  const styles = {
    store: "border-blue-200 bg-ssb-blue-soft/70",
    peer: "border-emerald-200 bg-emerald-50",
    competitor: "border-violet-300 bg-[#2b1b4a] text-white",
  }[kind];
  const titleColor = kind === "competitor" ? "text-violet-200" : kind === "peer" ? "text-ssb-green" : "text-ssb-blue";
  return (
    <div className={cn("rounded-2xl border p-4", styles)}>
      <p className={cn("mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em]", titleColor)}>
        {title}
      </p>
      <div className={cn("text-sm leading-relaxed", kind === "competitor" ? "text-violet-50" : "text-ssb-navy")}>
        {children}
      </div>
    </div>
  );
}
