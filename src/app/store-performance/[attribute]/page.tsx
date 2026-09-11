import { AppShell, ColorLegend, PageHeader } from "@/components/app-shell";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CapabilityList } from "@/components/capability-list";
import { DisplayGrid } from "@/components/display-grid";
import { EvidenceBlock, EvidenceChip } from "@/components/evidence-chip";
import { KpiBlock } from "@/components/kpi-block";
import { NeedRows } from "@/components/need-rows";
import { RecommendationCard } from "@/components/recommendation-card";
import { BenchmarkRow } from "@/components/benchmark-row";
import { DISPLAY_AUDIT } from "@/lib/data";
import {
  capabilitiesFor,
  clusterBenchmarks,
  getStore,
  inventoryFor,
  needsFor,
  pricingFor,
  problemSkus,
  recommendation,
  slotsFor,
} from "@/lib/selectors";
import type { AttributeKey } from "@/lib/types";
import { notFound } from "next/navigation";
import { Check, X } from "lucide-react";

const SLUGS: Record<string, AttributeKey> = {
  "sales-associate": "salesAssociate",
  "customer-alignment": "customerAlignment",
  "display-assortment": "displayAssortment",
  "pricing-promotion": "pricingPromotion",
  "inventory-fulfillment": "inventoryFulfillment",
};

const COPY: Record<
  AttributeKey,
  { title: string; question: string; header: (store: number, cluster: number, top: number) => string }
> = {
  salesAssociate: {
    title: "Sales Associate Effectiveness",
    question: "What behaviors separate my sales associates from high-performing stores?",
    header: (s, c, t) =>
      `${s}/100 · Cluster ${c} · Top ${t}. Product knowledge is relatively strong; customer discovery and objection handling are largest gaps.`,
  },
  customerAlignment: {
    title: "Customer Alignment",
    question: "Does the assortment reflect what shoppers in this market actually need?",
    header: (s) => `${s}/100 — Strong. Most major needs covered; Cooling and Value show identifiable gaps.`,
  },
  displayAssortment: {
    title: "Display & Assortment",
    question: "Are scarce showroom positions occupied by the right products?",
    header: (s) => `${s}/100. 5 of 31 display positions materially underperform top-peer productivity.`,
  },
  pricingPromotion: {
    title: "Pricing & Promotion",
    question: "Are we creating enough customer value while protecting revenue and margin?",
    header: (s) => `${s}/100 — Above Average. Largest gap is premium step-up conversion.`,
  },
  inventoryFulfillment: {
    title: "Inventory & Fulfillment",
    question: "Can the store deliver what the shopper wants, when the shopper wants it?",
    header: (s) => `${s}/100 — Needs Attention. Availability and delivery are the biggest operational constraints.`,
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
  const q = `?store=${store.id}`;

  return (
    <AppShell store={store} pathname="/store-performance">
      <Breadcrumbs
        items={[
          { label: "Peer Comparison", href: `/peer-comparison${q}` },
          { label: "Store Performance", href: `/store-performance${q}` },
          { label: copy.title },
        ]}
      />
      <PageHeader title={copy.title} subtitle={copy.header(score, bench.cluster, bench.top)} question={copy.question} />
      <div className="mb-5">
        <ColorLegend />
      </div>
      {key === "salesAssociate" ? <SalesBody storeId={store.id} /> : null}
      {key === "customerAlignment" ? <AlignmentBody storeId={store.id} /> : null}
      {key === "displayAssortment" ? <DisplayBody storeId={store.id} /> : null}
      {key === "pricingPromotion" ? <PricingBody storeId={store.id} /> : null}
      {key === "inventoryFulfillment" ? <InventoryBody storeId={store.id} /> : null}
    </AppShell>
  );
}

function SalesBody({ storeId }: { storeId: string }) {
  const store = getStore(storeId);
  const caps = capabilitiesFor(store);
  return (
    <div className="space-y-5">
      <CapabilityList capabilities={caps} />
      <EvidenceBlock kind="peer" title="Top-peer evidence">
        Top peer stores consistently identify more sleep needs before recommending product.
      </EvidenceBlock>
      <EvidenceBlock kind="competitor" title="Competitor evidence">
        Mattress Firm BedEd trains Sleep Experts around mattress type, features and sleep preferences. Tempur-Pedic
        flagship stores use one-on-one trained guidance as part of the buying experience.
      </EvidenceBlock>
      <RecommendationCard recommendation={recommendation("salesAssociate")} />
    </div>
  );
}

function AlignmentBody({ storeId }: { storeId: string }) {
  const store = getStore(storeId);
  return (
    <div className="space-y-5">
      <NeedRows needs={needsFor(store)} />
      <div className="flex flex-wrap gap-1.5">
        <EvidenceChip source={{ label: "Customer survey", kind: "store" }} />
        <EvidenceChip source={{ label: "Local search / site behavior", kind: "store" }} />
        <EvidenceChip source={{ label: "Sales", kind: "store" }} />
        <EvidenceChip source={{ label: "Product master", kind: "store" }} />
        <EvidenceChip source={{ label: "Assortment", kind: "store" }} />
      </div>
      <EvidenceBlock kind="peer" title="Top-peer proof">
        Top stores carry and display more cooling options across price bands.
      </EvidenceBlock>
      <EvidenceBlock kind="competitor" title="Competitor proof">
        Leading retailers treat cooling, pressure relief and motion isolation as guided sleep benefits, not just
        construction features.
      </EvidenceBlock>
      <RecommendationCard recommendation={recommendation("customerAlignment")} />
    </div>
  );
}

function DisplayBody({ storeId }: { storeId: string }) {
  const store = getStore(storeId);
  const slots = slotsFor(store);
  const under = slots.filter((s) => s.tone === "underproductive").length;
  const revenuePerSlot = Math.round(slots.reduce((a, s) => a + s.monthlyRevenue, 0) / slots.length);
  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiBlock label="Display slots" value={`${slots.length}`} />
        <KpiBlock label="Revenue / slot" value={`$${(revenuePerSlot / 1000).toFixed(1)}K`} tone="blue" />
        <KpiBlock label="Underproductive slots" value={`${under}`} tone="red" />
        <KpiBlock label="Customer-need gaps" value="2" tone="amber" hint="Cooling and Value" />
      </div>
      <DisplayGrid slots={slots} />
      <details className="rounded-2xl border border-border bg-white p-4">
        <summary className="cursor-pointer font-semibold text-ssb-navy">Secondary merchandising metrics</summary>
        <ul className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          <li>Revenue / slot vs top-peer median</li>
          <li>Margin / slot</li>
          <li>Unit velocity</li>
          <li>Trial-to-sale conversion</li>
          <li>Price-point coverage</li>
          <li>Need coverage and duplicate coverage</li>
          <li>Display age</li>
        </ul>
      </details>
      <div className="rounded-2xl border border-border bg-white p-4">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Qualitative showroom audit
        </p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {DISPLAY_AUDIT.map((item) => (
            <li key={item.label} className="flex items-center gap-2 text-sm">
              {item.pass ? <Check className="h-4 w-4 text-ssb-green" /> : <X className="h-4 w-4 text-ssb-red" />}
              {item.label}
            </li>
          ))}
        </ul>
      </div>
      <EvidenceBlock kind="competitor" title="Competitor proof">
        Tempur-Pedic flagship stores emphasize tactile product trial, bedroom-like presentation and guided benefit
        merchandising rather than undifferentiated rows of similar pillow-tops.
      </EvidenceBlock>
      <RecommendationCard recommendation={recommendation("displayAssortment")} />
    </div>
  );
}

function PricingBody({ storeId }: { storeId: string }) {
  const store = getStore(storeId);
  const metrics = pricingFor(store);
  return (
    <div className="space-y-5">
      <div className="space-y-3">
        {metrics.map((m) => (
          <BenchmarkRow
            key={m.id}
            label={m.label}
            store={m.storeNumeric}
            cluster={m.peerNumeric}
            top={m.topNumeric}
            max={m.format === "currency" ? 2200 : 100}
            unit=""
            invert={m.id === "discount"}
            insight={`${m.storeValue} vs peer / top benchmarks`}
          />
        ))}
      </div>
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ssb-amber">Biggest gap</p>
        <p className="mt-1 font-semibold text-ssb-navy">Premium step-up</p>
        <p className="text-sm text-muted-foreground">Customers often buy within the first tier shown.</p>
      </div>
      <EvidenceBlock kind="peer" title="Top-peer proof">
        Top stores convert more customers into premium propositions without materially higher discounting.
      </EvidenceBlock>
      <EvidenceBlock kind="competitor" title="Competitor proof">
        Guided consultation, complete sleep-system selling and financing communication are standard at Tempur-Pedic
        stores and Mattress Firm Sleep Expert programs.
      </EvidenceBlock>
      <RecommendationCard recommendation={recommendation("pricingPromotion")} />
    </div>
  );
}

function InventoryBody({ storeId }: { storeId: string }) {
  const store = getStore(storeId);
  const metrics = inventoryFor(store);
  const skus = problemSkus();
  return (
    <div className="space-y-5">
      <div className="space-y-3">
        {metrics.map((m) => (
          <BenchmarkRow
            key={m.id}
            label={m.label}
            store={m.storeNumeric}
            cluster={m.peerNumeric}
            top={m.topNumeric}
            max={m.id === "lead" ? 8 : m.id === "turns" ? 8 : 100}
            unit=""
            invert={m.id === "stockout" || m.id === "lead" || m.id === "slow"}
            insight={m.storeValue}
          />
        ))}
      </div>
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ssb-red">Primary constraint</p>
        <p className="mt-1 font-semibold text-ssb-navy">High-demand SKU availability</p>
      </div>
      <div className="rounded-2xl border border-border bg-white p-4">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Top 3 problem SKUs
        </p>
        <ul className="space-y-2">
          {skus.map((sku) => (
            <li key={sku.name} className="flex items-center justify-between text-sm">
              <span className="font-medium text-ssb-navy">{sku.name}</span>
              <span className="tabular-nums text-ssb-red">{sku.stockOuts} stock-outs</span>
            </li>
          ))}
        </ul>
      </div>
      <EvidenceBlock kind="peer" title="Top-peer proof">
        Top peers combine higher availability with faster turns.
      </EvidenceBlock>
      <EvidenceBlock kind="competitor" title="Competitor proof">
        Mattress Firm offers delivery tracking so customers can see fulfillment progress. Tempur-Pedic flagship
        experience includes white-glove setup.
      </EvidenceBlock>
      <RecommendationCard recommendation={recommendation("inventoryFulfillment")} />
    </div>
  );
}
