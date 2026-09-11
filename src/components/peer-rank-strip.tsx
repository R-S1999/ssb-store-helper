"use client";

import { useState } from "react";
import Link from "next/link";
import { Store } from "lucide-react";
import { CLUSTER, STORES } from "@/lib/data";
import type { StoreRecord } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PeerRankStrip({ current }: { current: StoreRecord }) {
  const [activeId, setActiveId] = useState(current.id);
  const ranked = [...STORES].sort((a, b) => b.overallScore - a.overallScore);
  const active = ranked.find((s) => s.id === activeId) ?? current;

  return (
    <div className="rounded-3xl border border-border bg-white p-5">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Peer ranking
          </p>
          <p className="text-sm text-muted-foreground">High to low overall store effectiveness. Hover a storefront to inspect scores. Peer names stay masked.</p>
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-3">
        {ranked.map((store, i) => {
          const isYou = store.id === current.id;
          const isActive = store.id === activeId;
          return (
            <button
              key={store.id}
              type="button"
              onMouseEnter={() => setActiveId(store.id)}
              onFocus={() => setActiveId(store.id)}
              onClick={() => setActiveId(store.id)}
              className={cn(
                "flex min-w-[52px] flex-col items-center rounded-2xl border px-2 py-3 transition",
                isYou
                  ? "min-w-[72px] border-ssb-blue bg-ssb-blue text-white shadow-md"
                  : "border-transparent bg-slate-100 text-slate-500 hover:bg-slate-200",
                isActive && !isYou && "ring-2 ring-ssb-blue/30",
              )}
            >
              <Store className={cn("mb-1", isYou ? "h-7 w-7" : "h-5 w-5")} />
              <span className="text-[10px] font-semibold">#{i + 1}</span>
              <span className="text-[11px] tabular-nums">{store.overallScore}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-2 grid gap-4 rounded-2xl bg-slate-50 p-4 md:grid-cols-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ssb-blue">
            {active.id === current.id ? "Your store" : "Peer store"}
          </p>
          <p className="text-lg font-semibold text-ssb-navy">
            {active.id === current.id ? `${active.name} – ${active.city}, ${active.state}` : active.alias}
          </p>
          <p className="text-sm text-muted-foreground">
            Overall {active.overallScore}/100
            {active.id !== current.id ? " · name hidden unless permitted" : ""}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {(
            [
              ["Sales Associate", active.attributes.salesAssociate],
              ["Customer Alignment", active.attributes.customerAlignment],
              ["Display & Assortment", active.attributes.displayAssortment],
              ["Pricing & Promotion", active.attributes.pricingPromotion],
              ["Inventory & Fulfillment", active.attributes.inventoryFulfillment],
            ] as const
          ).map(([label, value]) => (
            <div key={label} className="flex items-center justify-between rounded-xl bg-white px-3 py-2">
              <span className="text-xs text-muted-foreground">{label}</span>
              <span className="font-semibold tabular-nums text-ssb-navy">{value}</span>
            </div>
          ))}
        </div>
      </div>
      {active.id === current.id ? (
        <Link
          href={`/store-performance?store=${current.id}`}
          className="mt-4 inline-flex rounded-full bg-ssb-blue px-4 py-2 text-sm font-medium text-white hover:bg-ssb-blue/90"
        >
          Open {CLUSTER.peerCount ? "your store performance" : "store performance"}
        </Link>
      ) : null}
    </div>
  );
}
