import { AppShell, PageHeader } from "@/components/app-shell";
import { ActionQuad } from "@/components/action-quad";
import { AttributeScoreHeader, AttributeScoreStrip } from "@/components/attribute-score-header";
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
  DollarSign,
  Megaphone,
  Puzzle,
  Tag,
  Truck,
  Users,
} from "lucide-react";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";

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
          <PageHeader title={copy.title} subtitle={copy.subtitle} />
          <AttributeScoreStrip
            storeLabel={storeLabel}
            storeScore={score}
            clusterScore={bench.cluster}
            topScore={bench.top}
            callout={
              <div className="flex max-w-[290px] items-start gap-2.5">
                <Megaphone className="mt-0.5 h-5 w-5 shrink-0 text-ssb-blue" />
                <p className="text-[13px] leading-snug text-slate-600">
                  <span className="text-[15px] font-semibold text-ssb-blue">5 of 31 display positions</span>
                  <br />
                  materially underperform top-peer productivity.
                </p>
              </div>
            }
          />
          <div className="my-3 grid shrink-0 grid-cols-4 gap-3">
            <MiniKpi icon={<BedDouble className="h-5 w-5" />} tone="blue" value="31" label="Display Slots" />
            <MiniKpi icon={<DollarSign className="h-5 w-5" />} tone="green" value="$24.8K" label="Revenue / Slot" />
            <MiniKpi icon={<AlertTriangle className="h-5 w-5" />} tone="amber" value="5" label="Underproductive Slots" />
            <MiniKpi icon={<Puzzle className="h-5 w-5" />} tone="violet" value="2" label="Customer-Need Gaps" />
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
          <div className="mb-3 flex shrink-0 items-end justify-between gap-4">
            <PageHeader title={copy.title} subtitle={copy.subtitle} />
            <AttributeScoreHeader
              storeLabel={storeLabel}
              storeScore={score}
              clusterScore={bench.cluster}
              topScore={bench.top}
            />
          </div>
          <div className="mb-3 flex shrink-0 items-start gap-3 rounded-[16px] bg-[#eaf3ff] px-4 py-3">
            <IconTile tone="blue" size="md">
              <Truck className="h-5 w-5" />
            </IconTile>
            <p className="text-[13.5px] leading-snug text-ssb-navy">
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
        <div className="mb-3 flex shrink-0 items-end justify-between gap-4">
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
    <div className="flex items-center gap-3.5 rounded-[16px] border border-slate-200 bg-white px-5 py-2.5">
      <IconTile tone={tone} size="md">
        {icon}
      </IconTile>
      <div>
        <p className="text-[24px] font-bold leading-none text-ssb-navy">{value}</p>
        <p className="mt-1 text-[12.5px] text-slate-500">{label}</p>
      </div>
    </div>
  );
}

function PanelHeading({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="mb-2 flex items-center gap-2.5">
      <IconTile tone="blue" size="sm">
        {icon}
      </IconTile>
      <div>
        <h3 className="text-[17px] font-semibold text-ssb-navy">{title}</h3>
        <p className="text-[12.5px] text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}

function ColumnHeader({ cols }: { cols: string[] }) {
  return (
    <div className="grid grid-cols-[1fr_70px_70px_70px] gap-x-2 px-3 pb-1.5 text-[12px] font-medium text-slate-500">
      <span />
      {cols.map((c) => (
        <span key={c} className="text-right">
          {c}
        </span>
      ))}
    </div>
  );
}

function SalesFill({ storeId }: { storeId: string }) {
  const store = getStore(storeId);
  const caps = capabilitiesFor(store);
  return (
    <div className="grid min-h-0 flex-1 grid-cols-[1.05fr_0.95fr] gap-3">
      <section className="flex min-h-0 flex-col rounded-[18px] border border-slate-200 bg-white p-4">
        <PanelHeading
          icon={<Users className="h-5 w-5" />}
          title="Capability Benchmark"
          subtitle="Selling capabilities scored against the cluster and top stores."
        />
        <ColumnHeader cols={["Your Store", "Cluster Avg.", "Top Stores"]} />
        <ul className="flex min-h-0 flex-1 flex-col">
          {caps.map((cap, i) => (
            <li
              key={cap.id}
              className={cn(
                "grid flex-1 grid-cols-[1fr_70px_70px_70px] items-center gap-2 rounded-[10px] px-3",
                i % 2 === 0 ? "bg-[#f4f8fd]" : "bg-white",
              )}
            >
              <div>
                <p className="text-[14px] font-semibold text-ssb-navy">{cap.label}</p>
                <p className="text-[11.5px] leading-tight text-slate-500">{cap.insight}</p>
              </div>
              <p className="text-right text-[20px] font-bold tabular-nums text-ssb-navy">{cap.store}</p>
              <p className="text-right text-[16px] tabular-nums text-slate-500">{cap.cluster}</p>
              <p className="text-right text-[16px] tabular-nums text-slate-500">{cap.top}</p>
            </li>
          ))}
        </ul>
      </section>
      <ActionQuad
        accent
        recommendation={recommendation("salesAssociate")}
        intro="Close the gap on needs discovery and objection handling."
      />
    </div>
  );
}

function AlignmentFill({ storeId }: { storeId: string }) {
  const store = getStore(storeId);
  const needs = needsFor(store);
  return (
    <div className="grid min-h-0 flex-1 grid-cols-[1.05fr_0.95fr] gap-3">
      <section className="flex min-h-0 flex-col rounded-[18px] border border-slate-200 bg-white p-4">
        <PanelHeading
          icon={<Puzzle className="h-5 w-5" />}
          title="Need Coverage vs Local Demand"
          subtitle="How well the assortment covers each dominant local sleep need."
        />
        <ul className="flex min-h-0 flex-1 flex-col gap-2">
          {needs.map((need) => (
            <li key={need.id} className="flex flex-1 flex-col justify-center rounded-[12px] bg-[#f4f8fd] px-4 py-2">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[14px] font-semibold text-ssb-navy">{need.label}</span>
                <span
                  className={
                    need.status === "Covered"
                      ? "rounded-full bg-[#d1fae5] px-2.5 py-0.5 text-[12px] font-semibold text-[#047857]"
                      : need.status === "Watch"
                        ? "rounded-full bg-[#fef3c7] px-2.5 py-0.5 text-[12px] font-semibold text-[#b45309]"
                        : "rounded-full bg-[#fee2e2] px-2.5 py-0.5 text-[12px] font-semibold text-[#b91c1c]"
                  }
                >
                  {need.status}
                </span>
              </div>
              <div className="relative h-2.5 rounded-full bg-slate-200">
                <div className="absolute inset-y-0 left-0 rounded-full bg-slate-300" style={{ width: `${need.demand}%` }} />
                <div className="absolute inset-y-0 left-0 rounded-full bg-ssb-blue" style={{ width: `${need.coverage}%` }} />
              </div>
              <p className="mt-1 text-[12px] text-slate-500">
                Demand {need.demand} · Coverage {need.coverage} · Top peer {need.topPeerMedian}
              </p>
            </li>
          ))}
        </ul>
      </section>
      <ActionQuad
        accent
        recommendation={recommendation("customerAlignment")}
        intro="Expand cooling where local demand is high and coverage is thin."
      />
    </div>
  );
}

function PricingFill({ storeId }: { storeId: string }) {
  const store = getStore(storeId);
  const metrics = pricingFor(store);
  return (
    <div className="grid min-h-0 flex-1 grid-cols-[1.05fr_0.95fr] gap-3">
      <section className="flex min-h-0 flex-col rounded-[18px] border border-slate-200 bg-white p-4">
        <PanelHeading
          icon={<Tag className="h-5 w-5" />}
          title="Pricing Benchmark"
          subtitle="Price realization and step-up performance versus comparable stores."
        />
        <ColumnHeader cols={["Your Store", "Cluster Avg.", "Top Stores"]} />
        <ul className="flex min-h-0 flex-1 flex-col">
          {metrics.map((m, i) => (
            <li
              key={m.id}
              className={cn(
                "grid flex-1 grid-cols-[1fr_70px_70px_70px] items-center gap-2 rounded-[10px] px-3",
                i % 2 === 0 ? "bg-[#f4f8fd]" : "bg-white",
              )}
            >
              <p className="text-[14px] font-semibold text-ssb-navy">{m.label}</p>
              <p className="text-right text-[20px] font-bold tabular-nums text-ssb-navy">{m.storeValue}</p>
              <p className="text-right text-[16px] tabular-nums text-slate-500">
                {m.format === "currency" ? `$${m.peerNumeric.toLocaleString("en-US")}` : `${m.peerNumeric}%`}
              </p>
              <p className="text-right text-[16px] tabular-nums text-slate-500">
                {m.format === "currency" ? `$${m.topNumeric.toLocaleString("en-US")}` : `${m.topNumeric}%`}
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex shrink-0 items-start gap-2.5 rounded-[12px] bg-[#fef3c7] px-4 py-3 text-[13px] text-ssb-navy">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#b45309]" />
          <span>
            <span className="font-semibold">Biggest gap: </span>Premium step-up. Customers often buy within the first
            tier shown.
          </span>
        </div>
      </section>
      <ActionQuad
        accent
        recommendation={recommendation("pricingPromotion")}
        intro="Standardize Good / Better / Best after needs discovery."
      />
    </div>
  );
}
