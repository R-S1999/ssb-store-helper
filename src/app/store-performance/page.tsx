import { AppShell, ColorLegend, PageHeader } from "@/components/app-shell";
import { BenchmarkRow } from "@/components/benchmark-row";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ATTRIBUTE_META } from "@/lib/data";
import {
  attributeInsight,
  attributeStatus,
  clusterBenchmarks,
  getStore,
  storeRank,
} from "@/lib/selectors";
import type { AttributeKey } from "@/lib/types";
import { LayoutGrid, Store, Tag, Target, Truck, Users } from "lucide-react";
import type { ReactNode } from "react";

const ICONS: Record<AttributeKey, ReactNode> = {
  salesAssociate: <Users className="h-5 w-5" />,
  customerAlignment: <Target className="h-5 w-5" />,
  displayAssortment: <LayoutGrid className="h-5 w-5" />,
  pricingPromotion: <Tag className="h-5 w-5" />,
  inventoryFulfillment: <Truck className="h-5 w-5" />,
};

export default async function StorePerformancePage({
  searchParams,
}: {
  searchParams: Promise<{ store?: string }>;
}) {
  const { store: storeId } = await searchParams;
  const store = getStore(storeId);
  const rank = storeRank(store.id);
  const bench = clusterBenchmarks();
  const keys = Object.keys(ATTRIBUTE_META) as AttributeKey[];
  const weak = keys
    .filter((k) => attributeStatus(store.attributes[k], bench.attributes[k].cluster, bench.attributes[k].top) === "attention")
    .map((k) => ATTRIBUTE_META[k].label);

  return (
    <AppShell store={store} pathname="/store-performance">
      <Breadcrumbs
        items={[
          { label: "Peer Comparison", href: `/peer-comparison?store=${store.id}` },
          { label: "Store Performance" },
        ]}
      />
      <PageHeader
        title="Store Performance Profile"
        subtitle="Which store characteristics explain my overall performance?"
        question="Which store characteristics explain my overall performance?"
      />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-white px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-ssb-navy">
          <Store className="h-4 w-4 text-ssb-blue" />
          <span className="font-semibold">
            {store.name} – {store.city}, {store.state}
          </span>
        </div>
        <div className="flex gap-4 text-sm">
          <span>
            Overall <strong>{store.overallScore}</strong>/100
          </span>
          <span>
            Rank <strong>#{rank.rank}/{rank.of}</strong>
          </span>
        </div>
      </div>
      <div className="mb-4">
        <ColorLegend />
      </div>
      <div className="space-y-3">
        {keys.map((key) => (
          <BenchmarkRow
            key={key}
            icon={ICONS[key]}
            label={ATTRIBUTE_META[key].label}
            store={store.attributes[key]}
            cluster={bench.attributes[key].cluster}
            top={bench.attributes[key].top}
            insight={attributeInsight(key, store)}
            href={`${ATTRIBUTE_META[key].href}?store=${store.id}`}
          />
        ))}
      </div>
      <p className="mt-5 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-ssb-navy">
        Biggest opportunity: {weak.length ? weak.join(" and ") : "closing remaining gaps versus top stores"}.
      </p>
    </AppShell>
  );
}
