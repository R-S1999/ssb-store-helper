import { AppShell, PageHeader } from "@/components/app-shell";
import { ActionQuad } from "@/components/action-quad";
import { AttributeScoreHeader } from "@/components/attribute-score-header";
import { IconTile } from "@/components/icon-tile";
import { InventoryScreen } from "@/components/inventory-screen";
import { ShowroomFloor } from "@/components/showroom-floor";
import {
  capabilitiesFor,
  clusterBenchmarks,
  getStore,
  inventoryFor,
  needsFor,
  pricingFor,
  problemSkus,
  recommendation,
} from "@/lib/selectors";
import type { AttributeKey } from "@/lib/types";
import {
  AlertTriangle,
  BedDouble,
  Megaphone,
  Puzzle,
  Truck,
  Users,
} from "lucide-react";
import { notFound } from "next/navigation";

const SLUGS: Record<string, AttributeKey> = {
  "sales-associate": "salesAssociate",
  "customer-alignment": "customerAlignment",
  "display-assortment": "displayAssortment",
  "pricing-promotion": "pricingPromotion",
  "inventory-fulfillment": "inventoryFulfillment",
};

const COPY: Record<AttributeKey, { title: string; subtitle: string }> = {
  salesAssociate: {
    title: "Sales Associate Effectiveness",
    subtitle: "What behaviors separate my sales associates from high-performing stores?",
  },
  customerAlignment: {
    title: "Customer Alignment",
    subtitle: "Does the assortment reflect what shoppers in this market actually need?",
  },
  displayAssortment: {
    title: "Display & Assortment",
    subtitle: "Explore your showroom layout, display productivity, and opportunities to better meet customer needs.",
  },
  pricingPromotion: {
    title: "Pricing & Promotion",
    subtitle: "Are we creating enough customer value while protecting revenue and margin?",
  },
  inventoryFulfillment: {
    title: "Inventory & Fulfillment",
    subtitle: "Strengthen availability and delivery to capture more demand.",
  },
};

export function generateStaticParams() {
  return Object.keys(SLUGS).map((attribute) => ({ attribute }));
}

export default async function AttributePage({
  params,
  searchParams,
}: {
  params: Promise<{ attribute: string }>;
  searchParams: Promise<{ store?: string }>;
}) {
  const { attribute } = await params;
  const { store: storeId } = await searchParams;
  const key = SLUGS[attribute];
  if (!key) notFound();
  const store = getStore(storeId);
  const bench = clusterBenchmarks().attributes[key];
  const score = store.attributes[key];
  const copy = COPY[key];
  const storeLabel = `${store.name} – ${store.city}, ${store.state}`;

  if (key === "displayAssortment") {
    return (
      <AppShell store={store} pathname="/store-performance" fill>
        <div className="flex h-full min-h-0 flex-col">
          <div className="mb-2 flex shrink-0 items-start justify-between gap-3">
            <PageHeader title={copy.title} subtitle={copy.subtitle} />
            <div className="flex items-center gap-2 pt-1">
              <AttributeScoreHeader
                storeLabel={storeLabel}
                storeScore={score}
                clusterScore={bench.cluster}
                topScore={bench.top}
              />
              <div className="max-w-[220px] rounded-[16px] bg-[#eaf3ff] px-3 py-2">
                <p className="flex items-start gap-1.5 text-[11px] leading-snug text-ssb-navy">
                  <Megaphone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ssb-blue" />
                  <span>
                    <span className="font-semibold">5 of 31 display positions</span> materially underperform top-peer
                    productivity.
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className="mb-2.5 grid shrink-0 grid-cols-4 gap-2.5">
            <MiniKpi icon={<BedDouble className="h-4 w-4" />} tone="blue" value="31" label="Display Slots" />
            <MiniKpi icon={<span className="text-sm font-bold">$</span>} tone="green" value="$24.8K" label="Revenue / Slot" />
            <MiniKpi icon={<AlertTriangle className="h-4 w-4" />} tone="amber" value="5" label="Underproductive Slots" />
            <MiniKpi icon={<Puzzle className="h-4 w-4" />} tone="violet" value="2" label="Customer-Need Gaps" />
          </div>
          <ShowroomFloor />
        </div>
      </AppShell>
    );
  }

  if (key === "inventoryFulfillment") {
    return (
      <AppShell store={store} pathname="/store-performance" fill>
        <div className="flex h-full min-h-0 flex-col">
          <div className="mb-2 flex shrink-0 items-end justify-between gap-4">
            <PageHeader title={copy.title} subtitle={copy.subtitle} />
            <AttributeScoreHeader
              storeLabel={storeLabel}
              storeScore={score}
              clusterScore={bench.cluster}
              topScore={bench.top}
            />
          </div>
          <div className="mb-2.5 flex shrink-0 items-start gap-2 rounded-[16px] bg-[#eaf3ff] px-4 py-2">
            <IconTile tone="blue" size="sm">
              <Truck className="h-3.5 w-3.5" />
            </IconTile>
            <p className="text-[13px] leading-snug text-ssb-navy">
              <span className="font-semibold">Availability and delivery are the biggest operational constraints on demand capture. </span>
              Improving in-stock levels and delivery performance helps you convert more shoppers and reduce lost sales.
            </p>
          </div>
          <InventoryScreen metrics={inventoryFor(store)} skus={problemSkus()} rec={recommendation(key)} />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell store={store} pathname="/store-performance" fill>
      <div className="flex h-full min-h-0 flex-col">
        <div className="mb-2 flex shrink-0 items-end justify-between gap-4">
          <PageHeader title={copy.title} subtitle={copy.subtitle} />
          <AttributeScoreHeader
            storeLabel={storeLabel}
            storeScore={score}
            clusterScore={bench.cluster}
            topScore={bench.top}
          />
        </div>
        {key === "salesAssociate" ? <SalesFill storeId={store.id} /> : null}
        {key === "customerAlignment" ? <AlignmentFill storeId={store.id} /> : null}
        {key === "pricingPromotion" ? <PricingFill storeId={store.id} /> : null}
      </div>
    </AppShell>
  );
}

function MiniKpi({
  icon,
  tone,
  value,
  label,
}: {
  icon: React.ReactNode;
  tone: "blue" | "green" | "amber" | "violet";
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-[16px] border border-slate-200 bg-white px-4 py-2.5">
      <IconTile tone={tone} size="sm">
        {icon}
      </IconTile>
      <div>
        <p className="text-[22px] font-semibold leading-none text-ssb-navy">{value}</p>
        <p className="text-[11px] text-slate-400">{label}</p>
      </div>
    </div>
  );
}

function SalesFill({ storeId }: { storeId: string }) {
  const store = getStore(storeId);
  const caps = capabilitiesFor(store);
  return (
    <div className="grid min-h-0 flex-1 grid-cols-[1.15fr_0.85fr] gap-3">
      <section className="flex min-h-0 flex-col rounded-[18px] border border-slate-200 bg-white p-4">
        <p className="mb-2 flex items-center gap-2 text-[14px] font-semibold text-ssb-navy">
          <IconTile tone="blue" size="sm">
            <Users className="h-3.5 w-3.5" />
          </IconTile>
          Capability Benchmark
        </p>
        <ul className="min-h-0 flex-1 space-y-1.5 overflow-hidden">
          {caps.map((cap) => (
            <li key={cap.id} className="grid grid-cols-[1fr_44px_44px_44px] items-center gap-2 rounded-xl bg-[#f6f9fc] px-3 py-1.5">
              <div>
                <p className="text-[12px] font-semibold text-ssb-navy">{cap.label}</p>
                <p className="text-[10px] leading-tight text-slate-400">{cap.insight}</p>
              </div>
              <p className="text-right text-[13px] font-semibold tabular-nums text-ssb-navy">{cap.store}</p>
              <p className="text-right text-[12px] tabular-nums text-slate-400">{cap.cluster}</p>
              <p className="text-right text-[12px] tabular-nums text-slate-400">{cap.top}</p>
            </li>
          ))}
        </ul>
      </section>
      <ActionQuad recommendation={recommendation("salesAssociate")} intro="Close the gap on needs discovery and objection handling." />
    </div>
  );
}

function AlignmentFill({ storeId }: { storeId: string }) {
  const store = getStore(storeId);
  const needs = needsFor(store);
  return (
    <div className="grid min-h-0 flex-1 grid-cols-[1.15fr_0.85fr] gap-3">
      <section className="flex min-h-0 flex-col rounded-[18px] border border-slate-200 bg-white p-4">
        <p className="mb-2 text-[14px] font-semibold text-ssb-navy">Need Coverage vs Local Demand</p>
        <ul className="min-h-0 flex-1 space-y-1.5">
          {needs.map((need) => (
            <li key={need.id} className="rounded-xl bg-[#f6f9fc] px-3 py-1.5">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[12px] font-semibold text-ssb-navy">{need.label}</span>
                <span
                  className={
                    need.status === "Covered"
                      ? "rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-ssb-green"
                      : need.status === "Watch"
                        ? "rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-ssb-amber"
                        : "rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-ssb-red"
                  }
                >
                  {need.status}
                </span>
              </div>
              <div className="relative h-1.5 rounded-full bg-slate-200">
                <div className="absolute inset-y-0 left-0 rounded-full bg-slate-300" style={{ width: `${need.demand}%` }} />
                <div className="absolute inset-y-0 left-0 rounded-full bg-ssb-blue" style={{ width: `${need.coverage}%` }} />
              </div>
              <p className="mt-0.5 text-[10px] text-slate-400">
                Demand {need.demand} · Coverage {need.coverage} · Top peer {need.topPeerMedian}
              </p>
            </li>
          ))}
        </ul>
      </section>
      <ActionQuad recommendation={recommendation("customerAlignment")} intro="Expand cooling where local demand is high and coverage is thin." />
    </div>
  );
}

function PricingFill({ storeId }: { storeId: string }) {
  const store = getStore(storeId);
  const metrics = pricingFor(store);
  return (
    <div className="grid min-h-0 flex-1 grid-cols-[1.15fr_0.85fr] gap-3">
      <section className="flex min-h-0 flex-col rounded-[18px] border border-slate-200 bg-white p-4">
        <p className="mb-2 text-[14px] font-semibold text-ssb-navy">Pricing Benchmark</p>
        <ul className="space-y-1.5">
          {metrics.map((m) => (
            <li key={m.id} className="grid grid-cols-[1fr_70px_70px_70px] items-center gap-2 rounded-xl bg-[#f6f9fc] px-3 py-2">
              <p className="text-[12px] font-semibold text-ssb-navy">{m.label}</p>
              <p className="text-right text-[13px] font-semibold tabular-nums text-ssb-navy">{m.storeValue}</p>
              <p className="text-right text-[12px] tabular-nums text-slate-400">
                {m.format === "currency" ? `$${m.peerNumeric.toLocaleString("en-US")}` : `${m.peerNumeric}%`}
              </p>
              <p className="text-right text-[12px] tabular-nums text-slate-400">
                {m.format === "currency" ? `$${m.topNumeric.toLocaleString("en-US")}` : `${m.topNumeric}%`}
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-[12px] text-ssb-navy">
          <span className="font-semibold">Biggest gap: </span>Premium step-up. Customers often buy within the first tier shown.
        </div>
      </section>
      <ActionQuad recommendation={recommendation("pricingPromotion")} intro="Standardize Good / Better / Best after needs discovery." />
    </div>
  );
}
