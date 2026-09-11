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
import { cn } from "@/lib/utils";
import { ArrowRight, BarChart3, Boxes, LayoutGrid, Lightbulb, Tag, Target, Users, UsersRound } from "lucide-react";
import { StorefrontGlyph } from "@/components/peer-rank-strip";
import Link from "next/link";
import type { ReactNode } from "react";

const ICONS: Record<AttributeKey, { node: ReactNode; className: string }> = {
  salesAssociate: { node: <Users className="h-5 w-5" />, className: "bg-[#dbeafe] text-[#1d4ed8]" },
  customerAlignment: { node: <UsersRound className="h-5 w-5" />, className: "bg-[#d1fae5] text-[#047857]" },
  displayAssortment: { node: <LayoutGrid className="h-5 w-5" />, className: "bg-[#e2e8f0] text-[#475569]" },
  pricingPromotion: { node: <Tag className="h-5 w-5" />, className: "bg-[#ede9fe] text-[#6d28d9]" },
  inventoryFulfillment: { node: <Boxes className="h-5 w-5" />, className: "bg-[#e0f2fe] text-[#0369a1]" },
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
        <div className="mb-3 grid shrink-0 grid-cols-[1.15fr_0.85fr_0.9fr_1.35fr] gap-3">
          <SummaryCard>
            <div className="flex items-center gap-3.5">
              <IconTile tone="slate" size="lg">
                <StorefrontGlyph className="h-6 w-6" />
              </IconTile>
              <div className="min-w-0">
                <p className="text-[12.5px] text-slate-500">Current Store</p>
                <p className="truncate text-[16px] font-semibold text-ssb-navy">
                  {store.name} – {store.city}, {store.state}
                </p>
                <p className="truncate text-[12px] text-slate-400">{CLUSTER.name}</p>
              </div>
            </div>
          </SummaryCard>
          <SummaryCard>
            <div className="flex items-center gap-3.5">
              <IconTile tone="blue" size="lg">
                <BarChart3 className="h-6 w-6" />
              </IconTile>
              <div>
                <p className="text-[12.5px] text-slate-500">Overall Store Effectiveness Score</p>
                <p className="mt-0.5 text-[32px] font-bold leading-none text-ssb-blue">
                  {store.overallScore} <span className="text-[17px] font-semibold text-ssb-navy">/ 100</span>
                </p>
              </div>
            </div>
          </SummaryCard>
          <SummaryCard>
            <div className="flex items-center gap-3.5">
              <IconTile tone="blue" size="lg">
                <Users className="h-6 w-6" />
              </IconTile>
              <div>
                <p className="text-[12.5px] text-slate-500">Peer Rank</p>
                <p className="mt-0.5 text-[32px] font-bold leading-none text-ssb-blue">
                  #{rank.rank} <span className="text-[17px] font-semibold text-ssb-navy">of {rank.of}</span>
                </p>
                <p className="mt-1 text-[12px] text-slate-400">Top {rank.percentile}% of Comparable Stores</p>
              </div>
            </div>
          </SummaryCard>
          <SummaryCard tone="blue">
            <div className="flex gap-3">
              <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-ssb-blue" />
              <p className="text-[13px] leading-snug text-ssb-navy">{insightStrip(store)}</p>
            </div>
          </SummaryCard>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-3">
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

        <div className="mt-3 flex shrink-0 items-center justify-between gap-4 rounded-[16px] border border-slate-200 bg-white px-5 py-3.5">
          <div className="flex items-center gap-3 text-[14px] text-ssb-navy">
            <IconTile tone="blue" size="md">
              <Target className="h-5 w-5" />
            </IconTile>
            <span>
              <span className="font-semibold">Biggest opportunity:</span> improving{" "}
              {weak.map((k) => ATTRIBUTE_META[k].label).join(" and ") || "remaining gaps versus top stores"} could
              close the largest gap to top stores.
            </span>
          </div>
          <Link
            href={`${ATTRIBUTE_META[firstGap].href}?store=${store.id}`}
            className="inline-flex shrink-0 items-center gap-2 rounded-[12px] border border-ssb-blue/40 bg-white px-5 py-2.5 text-[14px] font-medium text-ssb-blue hover:bg-ssb-blue-soft"
          >
            View attribute details
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </AppShell>
  );
}

function SummaryCard({ children, tone }: { children: ReactNode; tone?: "blue" }) {
  return (
    <div
      className={cn(
        "flex items-center rounded-[16px] border border-slate-200 px-5 py-4",
        tone === "blue" ? "bg-[#eaf3ff]" : "bg-white",
      )}
    >
      {children}
    </div>
  );
}
