"use client";

import { useState } from "react";
import type { CustomerNeed } from "@/lib/types";
import { cn } from "@/lib/utils";

export function NeedRows({ needs }: { needs: CustomerNeed[] }) {
  const [open, setOpen] = useState<string | null>("cooling");
  return (
    <div className="space-y-2">
      {needs.map((need) => (
        <div key={need.id} className="overflow-hidden rounded-2xl border border-border bg-white">
          <button
            type="button"
            className="flex w-full items-center gap-4 px-4 py-3 text-left hover:bg-slate-50"
            onClick={() => setOpen(open === need.id ? null : need.id)}
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-ssb-navy">{need.label}</p>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                    need.status === "Covered" && "bg-emerald-50 text-ssb-green",
                    need.status === "Watch" && "bg-amber-50 text-ssb-amber",
                    need.status === "Gap" && "bg-red-50 text-ssb-red",
                  )}
                >
                  {need.status}
                </span>
              </div>
              <div className="relative mt-2 h-2 rounded-full bg-slate-100">
                <div className="absolute inset-y-0 left-0 rounded-full bg-slate-300" style={{ width: `${need.demand}%` }} />
                <div className="absolute inset-y-0 left-0 rounded-full bg-ssb-blue/80" style={{ width: `${need.coverage}%` }} />
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Demand {need.demand} · Coverage {need.coverage} · Top-peer median {need.topPeerMedian}
              </p>
            </div>
          </button>
          {open === need.id ? (
            <div className="grid gap-3 border-t border-border bg-slate-50 px-4 py-3 text-sm sm:grid-cols-4">
              <Meta label="Local demand" value={`${need.demand}`} />
              <Meta label="Assortment coverage" value={`${need.coverage}`} />
              <Meta label="Models / display" value={`${need.modelCount} / ${need.displayCount}`} />
              <Meta label="Top-peer median" value={`${need.topPeerMedian}`} />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="font-semibold text-ssb-navy">{value}</p>
    </div>
  );
}
