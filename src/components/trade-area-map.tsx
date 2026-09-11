"use client";

import { useState } from "react";
import type { MarketProfile } from "@/lib/types";
import { cn } from "@/lib/utils";

export function TradeAreaMap({ market }: { market: MarketProfile }) {
  const [minutes, setMinutes] = useState<10 | 15 | 20>(15);
  const scale = minutes === 10 ? 0.62 : minutes === 15 ? 1 : 1.35;
  const hh = Math.round(market.households * scale);
  const opp = Math.round(market.annualOpportunity * scale);

  return (
    <div className="rounded-3xl border border-border bg-white p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Trade area
        </p>
        <div className="flex rounded-full bg-slate-100 p-1 text-xs">
          {([10, 15, 20] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMinutes(m)}
              className={cn(
                "rounded-full px-3 py-1 font-medium",
                minutes === m ? "bg-ssb-blue text-white" : "text-ssb-navy",
              )}
            >
              {m} min
            </button>
          ))}
        </div>
      </div>
      <div className="relative mx-auto aspect-square max-w-md overflow-hidden rounded-3xl bg-[#d9e8f6]">
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, #fff 1px, transparent 1px), radial-gradient(circle at 70% 60%, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div
          className="absolute left-1/2 top-1/2 h-[78%] w-[78%] rounded-full border border-ssb-blue/20 bg-ssb-blue/5"
          style={{ transform: `translate(-50%, -50%) scale(${minutes === 20 ? 1 : minutes === 15 ? 0.82 : 0.62})` }}
        />
        <div className="absolute left-1/2 top-1/2 h-[58%] w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-ssb-blue/30 bg-ssb-blue/10" />
        <div className="absolute left-1/2 top-1/2 h-[38%] w-[38%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-ssb-blue/40 bg-ssb-blue/20" />
        <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ssb-blue shadow-md ring-4 ring-white" />
        <p className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2 py-1 text-[11px] text-ssb-navy">
          Store pin · {minutes}-minute drive time · {hh.toLocaleString("en-US")} households
        </p>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Schematic trade-area rings for the PoC — not a live isochrone. Opportunity scales with selected drive time (${opp.toLocaleString("en-US")} illustrative).
      </p>
    </div>
  );
}
