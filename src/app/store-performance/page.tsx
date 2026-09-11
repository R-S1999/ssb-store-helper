import { AppShell, PageHeader } from "@/components/app-shell";
import { AttributeProfileRow } from "@/components/attribute-profile-row";
import { IconTile } from "@/components/icon-tile";
import { ATTRIBUTE_META, CLUSTER } from "@/lib/data";
import {
  attributeStatus,
  clusterBenchmarks,
  getStore,
  insightStrip,
  storeRank,
} from "@/lib/selectors";
import type { AttributeKey } from "@/lib/types";
import { ArrowRight, BarChart3, Boxes, Home, Lightbulb, Tag, Target, Users } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

const ICONS: Record<AttributeKey, { node: ReactNode; className: string }> = {
  salesAssociate: { node: <Users className="h-5 w-5" />, className: "bg-[#e8f1ff] text-ssb-blue" },
  customerAlignment: { node: <Users className="h-5 w-5" />, className: "bg-emerald-50 text-emerald-600" },
  displayAssortment: { node: <Home className="h-5 w-5" />, className: "bg-slate-100 text-slate-500" },
  pricingPromotion: { node: <Tag className="h-5 w-5" />, className: "bg-violet-50 text-violet-600" },
  inventoryFulfillment: { node: <Boxes className="h-5 w-5" />, className: "bg-sky-50 text-sky-600" },
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
  const weak = keys.filter(
    (k) => attributeStatus(store.attributes[k], bench.attributes[k].cluster, bench.attributes[k].top) === "attention",
  );
  const firstGap = weak[0] ?? keys[0];

  return (
    <AppShell store={store} pathname="/store-performance" fill>
      <div className="flex h-full min-h-0 flex-col">
        <PageHeader
          title="Store Performance Profile"
          subtitle="See how your current store attributes compare with top stores in your cluster."
        />
        <div className="mb-2.5 grid shrink-0 grid-cols-4 gap-2.5">
          <SummaryCard>
            <div className="flex items-center gap-3">
              <IconTile tone="slate">
                <Home className="h-5 w-5" />
              </IconTile>
              <div>
                <p className="text-[11px] text-slate-500">Current Store</p>
                <p className="text-sm font-semibold text-ssb-navy">
                  {store.name} – {store.city}, {store.state}
                </p>
                <p className="text-[11px] text-slate-400">{CLUSTER.name}</p>
              </div>
            </div>
          </SummaryCard>
          <SummaryCard>
            <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <BarChart3 className="h-3.5 w-3.5 text-ssb-blue" />
              Overall Store Effectiveness Score
            </p>
            <p className="mt-1 text-[28px] font-semibold leading-none text-ssb-navy">
              {store.overallScore} <span className="text-base font-medium text-slate-400">/ 100</span>
            </p>
          </SummaryCard>
          <SummaryCard>
            <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <Users className="h-3.5 w-3.5 text-ssb-blue" />
              Peer Rank
            </p>
            <p className="mt-1 text-[28px] font-semibold leading-none text-ssb-navy">
              #{rank.rank} <span className="text-base font-medium text-slate-400">of {rank.of}</span>
            </p>
            <p className="mt-1 text-[11px] text-slate-400">Top {rank.percentile}% of Comparable Stores</p>
          </SummaryCard>
          <SummaryCard>
            <div className="flex gap-2">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-ssb-blue" />
              <p className="text-[12px] leading-snug text-ssb-navy">{insightStrip(store)}</p>
            </div>
          </SummaryCard>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-2">
          {keys.map((key) => {
            const tone = attributeStatus(
              store.attributes[key],
              bench.attributes[key].cluster,
              bench.attributes[key].top,
            );
            return (
              <AttributeProfileRow
                key={key}
                icon={ICONS[key].node}
                iconClass={ICONS[key].className}
                label={ATTRIBUTE_META[key].label}
                blurb={ATTRIBUTE_META[key].blurb}
                store={store.attributes[key]}
                cluster={bench.attributes[key].cluster}
                top={bench.attributes[key].top}
                tone={tone}
                insight={ATTRIBUTE_META[key].profileInsight}
                href={`${ATTRIBUTE_META[key].href}?store=${store.id}`}
              />
            );
          })}
        </div>

        <div className="mt-2.5 flex shrink-0 items-center justify-between gap-3 rounded-[16px] bg-[#eaf3ff] px-4 py-2.5">
          <p className="flex items-center gap-2 text-[13px] text-ssb-navy">
            <IconTile tone="blue" size="sm">
              <Target className="h-3.5 w-3.5" />
            </IconTile>
            <span>
              <span className="font-semibold">Biggest opportunity:</span> improving{" "}
              {weak.map((k) => ATTRIBUTE_META[k].label).join(" and ") || "remaining gaps versus top stores"} could
              close the largest gap to top stores.
            </span>
          </p>
          <Link
            href={`${ATTRIBUTE_META[firstGap].href}?store=${store.id}`}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-ssb-blue/40 bg-white px-4 py-2 text-[13px] font-medium text-ssb-blue hover:bg-white/80"
          >
            View attribute details
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </AppShell>
  );
}

function SummaryCard({ children }: { children: ReactNode }) {
  return <div className="rounded-[16px] border border-slate-200 bg-white px-4 py-3">{children}</div>;
}
