"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { STORES } from "@/lib/data";
import type { StoreRecord } from "@/lib/types";
import { cn } from "@/lib/utils";

const VISIBLE = 12;

export function StorefrontGlyph({ className, filled = false }: { className?: string; filled?: boolean }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      {/* awning */}
      <path
        d="M5 9h30l3 7H2z"
        fill="currentColor"
        opacity={filled ? 1 : 0.85}
      />
      <path
        d="M2 16h36v2.2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z"
        fill="currentColor"
        opacity={filled ? 0.75 : 0.55}
      />
      {/* body */}
      <path d="M5 20.2h30V35a1.6 1.6 0 0 1-1.6 1.6H6.6A1.6 1.6 0 0 1 5 35z" fill="currentColor" opacity={filled ? 0.9 : 0.62} />
      {/* door */}
      <rect x="16" y="26" width="8" height="10.6" rx="1" fill="#ffffff" opacity="0.92" />
      {/* window */}
      <rect x="8" y="24" width="5" height="4.5" rx="0.8" fill="#ffffff" opacity="0.72" />
      <rect x="27" y="24" width="5" height="4.5" rx="0.8" fill="#ffffff" opacity="0.72" />
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
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={start === 0}
          onClick={() => setStart((s) => Math.max(0, s - 1))}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 disabled:opacity-30"
          aria-label="Previous peers"
        >
          <ChevronLeft className="h-4.5 w-4.5" />
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
                {isYou ? (
                  <span className="mb-1.5 rounded-full bg-ssb-blue px-2.5 py-[3px] text-[11px] font-bold leading-none text-white">
                    #{rank}
                  </span>
                ) : (
                  <span className="mb-1.5 py-[3px] text-[12px] font-semibold leading-none text-slate-400">#{rank}</span>
                )}
                <button type="button" className="flex flex-col items-center">
                  <StorefrontGlyph
                    filled={isYou}
                    className={cn(
                      "h-11 w-11",
                      isYou ? "text-ssb-blue" : isHot ? "text-emerald-500" : "text-slate-400",
                    )}
                  />
                  {isYou ? (
                    <span className="-mt-1 rounded-md bg-ssb-blue px-2 py-[2px] text-[10px] font-bold tracking-wide text-white">
                      YOU
                    </span>
                  ) : null}
                  <span
                    className={cn(
                      "mt-1 text-[15px] font-semibold tabular-nums",
                      isYou ? "text-ssb-blue" : "text-slate-500",
                    )}
                  >
                    {store.overallScore}
                  </span>
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
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 disabled:opacity-30"
          aria-label="Next peers"
        >
          <ChevronRight className="h-4.5 w-4.5" />
        </button>
      </div>
    </div>
  );
}

function PeerHoverCard({ store, rank }: { store: StoreRecord; rank: number }) {
  return (
    <div className="absolute bottom-[96px] left-1/2 z-20 w-[250px] -translate-x-1/2 rounded-2xl border border-slate-200 bg-white p-3.5 text-left shadow-[0_12px_30px_rgba(11,35,64,0.14)]">
      <div className="mb-2.5 flex items-center gap-2.5">
        <StorefrontGlyph className="h-7 w-7 text-emerald-500" />
        <div>
          <p className="text-[14px] font-semibold text-ssb-navy">Peer Store {String(rank).padStart(2, "0")}</p>
          <p className="text-[12px] text-slate-500">
            Overall Score: <span className="font-semibold text-emerald-600">{store.overallScore}</span>
          </p>
        </div>
      </div>
      <dl className="space-y-1 text-[12px]">
        <HoverRow label="Sales Associate Effectiveness" value={store.attributes.salesAssociate} />
        <HoverRow label="Customer Alignment" value={store.attributes.customerAlignment} />
        <HoverRow label="Display & Assortment" value={store.attributes.displayAssortment} />
        <HoverRow label="Pricing & Promotion" value={store.attributes.pricingPromotion} />
        <HoverRow label="Inventory & Fulfillment" value={store.attributes.inventoryFulfillment} />
      </dl>
      <p className="mt-2.5 border-t border-slate-100 pt-2 text-[11px] leading-snug text-slate-500">
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
