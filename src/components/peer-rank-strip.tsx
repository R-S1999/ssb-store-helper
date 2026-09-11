"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { STORES } from "@/lib/data";
import type { StoreRecord } from "@/lib/types";
import { cn } from "@/lib/utils";

const VISIBLE = 12;

function HouseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z" />
    </svg>
  );
}

export function PeerRankStrip({ current }: { current: StoreRecord }) {
  const ranked = useMemo(
    () => [...STORES].sort((a, b) => b.overallScore - a.overallScore),
    [],
  );
  const youIndex = ranked.findIndex((s) => s.id === current.id);
  const [start, setStart] = useState(() => Math.max(0, Math.min(youIndex - 6, ranked.length - VISIBLE)));
  const [hovered, setHovered] = useState<string | null>(null);

  const slice = ranked.slice(start, start + VISIBLE);
  const hoveredStore = ranked.find((s) => s.id === hovered);

  return (
    <div className="relative">
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={start === 0}
          onClick={() => setStart((s) => Math.max(0, s - 1))}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 disabled:opacity-30"
          aria-label="Previous peers"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex min-w-0 flex-1 justify-between px-1">
          {slice.map((store, local) => {
            const rank = start + local + 1;
            const isYou = store.id === current.id;
            const isHot = hovered === store.id && !isYou;
            return (
              <div
                key={store.id}
                className="relative flex flex-1 flex-col items-center"
                onMouseEnter={() => setHovered(store.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <span className="mb-1 text-[10px] font-medium text-slate-400">#{rank}</span>
                <button type="button" className="flex flex-col items-center">
                  <HouseIcon
                    className={cn(
                      "h-8 w-8",
                      isYou ? "text-ssb-blue" : isHot ? "text-emerald-500" : "text-slate-300",
                    )}
                  />
                  {isYou ? (
                    <>
                      <span className="mt-1 rounded-full bg-ssb-blue px-2 py-[1px] text-[9px] font-bold tracking-wide text-white">
                        YOU
                      </span>
                      <span className="text-[12px] font-semibold tabular-nums text-ssb-blue">{store.overallScore}</span>
                    </>
                  ) : (
                    <span className="mt-1 text-[12px] font-semibold tabular-nums text-slate-500">
                      {store.overallScore}
                    </span>
                  )}
                </button>
                {hoveredStore && hovered === store.id && !isYou ? (
                  <PeerHoverCard store={hoveredStore} rank={rank} />
                ) : null}
              </div>
            );
          })}
        </div>
        <button
          type="button"
          disabled={start + VISIBLE >= ranked.length}
          onClick={() => setStart((s) => Math.min(ranked.length - VISIBLE, s + 1))}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 disabled:opacity-30"
          aria-label="Next peers"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function PeerHoverCard({ store, rank }: { store: StoreRecord; rank: number }) {
  return (
                <div className="absolute bottom-[78px] left-1/2 z-20 w-[230px] -translate-x-1/2 rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-[0_12px_30px_rgba(11,35,64,0.12)]">
      <div className="mb-2 flex items-center gap-2">
        <HouseIcon className="h-4 w-4 text-emerald-500" />
        <div>
          <p className="text-sm font-semibold text-ssb-navy">Peer Store {String(rank).padStart(2, "0")}</p>
          <p className="text-[11px] text-slate-500">
            Overall Score: <span className="font-semibold text-emerald-600">{store.overallScore}</span>
          </p>
        </div>
      </div>
      <dl className="space-y-1 text-[11px]">
        <HoverRow label="Sales Associate Effectiveness" value={store.attributes.salesAssociate} />
        <HoverRow label="Customer Alignment" value={store.attributes.customerAlignment} />
        <HoverRow label="Display & Assortment" value={store.attributes.displayAssortment} />
        <HoverRow label="Pricing & Promotion" value={store.attributes.pricingPromotion} />
        <HoverRow label="Inventory & Fulfillment" value={store.attributes.inventoryFulfillment} />
      </dl>
      <p className="mt-2 border-t border-slate-100 pt-2 text-[10px] leading-snug text-slate-500">
        <span className="font-semibold text-ssb-navy">Comparable because:</span> Suburban market • 8,000–12,000 sq. ft. • Similar household income • Mid-premium assortment
      </p>
    </div>
  );
}

function HoverRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-semibold tabular-nums text-ssb-navy">{value}</dd>
    </div>
  );
}
