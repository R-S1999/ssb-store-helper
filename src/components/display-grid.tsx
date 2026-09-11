"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { DisplaySlot } from "@/lib/types";

const toneClass = {
  productive: "bg-emerald-500",
  expected: "bg-slate-300",
  below: "bg-amber-400",
  underproductive: "bg-ssb-red",
};

export function DisplayGrid({ slots }: { slots: DisplaySlot[] }) {
  const [selected, setSelected] = useState<DisplaySlot | null>(slots.find((s) => s.tone === "underproductive") ?? slots[0]);
  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-3xl border border-border bg-white p-5">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Showroom slot schematic
        </p>
        <div className="grid grid-cols-7 gap-2">
          {slots.map((slot) => (
            <button
              key={slot.id}
              type="button"
              onClick={() => setSelected(slot)}
              className={cn(
                "aspect-square rounded-lg transition hover:scale-[1.04]",
                toneClass[slot.tone],
                selected?.id === slot.id && "ring-2 ring-ssb-navy ring-offset-2",
              )}
              title={slot.product}
            />
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm bg-emerald-500" /> Productive</span>
          <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm bg-slate-300" /> Expected</span>
          <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm bg-amber-400" /> Below benchmark</span>
          <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm bg-ssb-red" /> Underproductive</span>
        </div>
      </div>
      {selected ? (
        <div className="rounded-3xl border border-border bg-white p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ssb-blue">{selected.id.replace("-", " ")}</p>
          <h3 className="mt-1 text-lg font-semibold text-ssb-navy">{selected.product}</h3>
          <p className="text-sm text-muted-foreground">{selected.need}</p>
          <dl className="mt-4 space-y-2 text-sm">
            <Row label="Monthly revenue" value={`$${selected.monthlyRevenue.toLocaleString("en-US")}`} />
            <Row label="Top-peer median" value={`$${selected.topPeerMedian.toLocaleString("en-US")}`} />
            <Row label="Revenue percentile" value={`${selected.percentile}th`} />
            <Row label="Days on display" value={`${selected.daysOnDisplay}`} />
            <Row label="Trial rate" value={`${Math.round(selected.trialRate * 100)}%`} />
          </dl>
        </div>
      ) : null}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/70 py-1.5">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium tabular-nums text-ssb-navy">{value}</dd>
    </div>
  );
}
