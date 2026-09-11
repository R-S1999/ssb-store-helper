import { AppShell, PageHeader } from "@/components/app-shell";
import { IconTile } from "@/components/icon-tile";
import { PeerRankStrip } from "@/components/peer-rank-strip";
import { MethodologyDrawer } from "@/components/methodology-drawer";
import { CLUSTER, CLUSTER_BENCHMARKS } from "@/lib/data";
import { getStore, insightStrip, rankedStores, storeRank } from "@/lib/selectors";
import { ArrowRight, BarChart3, Home, LayoutGrid, Lightbulb, MapPin, Trophy, Users } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export default async function PeerComparisonPage({
  searchParams,
}: {
  searchParams: Promise<{ store?: string }>;
}) {
  const { store: storeId } = await searchParams;
  const store = getStore(storeId);
  const rank = storeRank(store.id);
  const identity = store.identity;
  const topScore = rankedStores()[0]?.overallScore ?? CLUSTER_BENCHMARKS.overallTop;

  return (
    <AppShell store={store} pathname="/peer-comparison" fill>
      <div className="flex h-full min-h-0 flex-col">
        <PageHeader
          title="Peer Comparison"
          subtitle="See how your store performs against comparable stores in its cluster."
        />
        <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1.72fr)_300px] gap-3">
          <section className="flex min-h-0 flex-col rounded-[18px] border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <IconTile tone="slate" size="lg">
                  <Home className="h-6 w-6" />
                </IconTile>
                <div>
                  <h3 className="text-[18px] font-semibold text-ssb-navy">
                    {store.name} – {store.city}, {store.state}
                  </h3>
                  <p className="mt-0.5 text-[34px] font-semibold leading-none tracking-tight text-ssb-navy">
                    #{rank.rank} <span className="text-[18px] font-medium text-slate-400">of {rank.of}</span>
                  </p>
                  <p className="mt-1 text-[12px] text-slate-500">Top {rank.percentile}% of Comparable Stores</p>
                </div>
              </div>
              <div className="rounded-[16px] bg-[#e8f2ff] px-5 py-3 text-right">
                <p className="flex items-center justify-end gap-1.5 text-[11px] font-medium text-slate-500">
                  <BarChart3 className="h-3.5 w-3.5 text-ssb-blue" />
                  Overall Store Effectiveness Score
                </p>
                <p className="mt-1 text-[34px] font-semibold leading-none text-ssb-navy">
                  {store.overallScore} <span className="text-[16px] font-medium text-slate-400">/ 100</span>
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-[16px] bg-[#eaf3ff] px-4 py-2.5 text-[13px] text-ssb-navy">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-ssb-blue" />
              <p>{insightStrip(store)}</p>
            </div>

            <div className="mt-6 flex-1">
              <PeerRankStrip current={store} />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <StatChip
                icon={
                  <IconTile tone="blue" size="sm">
                    <Users className="h-3.5 w-3.5" />
                  </IconTile>
                }
                label={`${CLUSTER.peerCount} Comparable Stores`}
              />
              <StatChip
                icon={
                  <IconTile tone="blue" size="sm">
                    <BarChart3 className="h-3.5 w-3.5" />
                  </IconTile>
                }
                label={`Cluster Store Avg:  ${CLUSTER_BENCHMARKS.overallCluster}`}
              />
              <StatChip
                icon={
                  <IconTile tone="amber" size="sm">
                    <Trophy className="h-3.5 w-3.5" />
                  </IconTile>
                }
                label={`Top Store Score:  ${topScore}`}
              />
            </div>
          </section>

          <aside className="flex min-h-0 flex-col rounded-[18px] border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-2">
              <IconTile tone="blue" size="sm">
                <Users className="h-4 w-4" />
              </IconTile>
              <h3 className="text-[17px] font-semibold text-ssb-navy">Why these peers?</h3>
            </div>
            <p className="mt-2 text-[12px] leading-relaxed text-slate-500">
              These stores are most similar to your store based on location, size, market and retail model.
            </p>
            <p className="mt-4 text-[11px] font-medium text-slate-400">Peer Cluster:</p>
            <p className="text-[15px] font-semibold leading-snug text-ssb-navy">{CLUSTER.name}</p>
            <dl className="mt-4 space-y-2.5 text-[13px]">
              <Meta icon={<MapPin className="h-4 w-4" />} label="Trade Area" value="Suburban" />
              <Meta icon={<LayoutGrid className="h-4 w-4" />} label="Selling Space" value={`${identity.sellingSpaceSqFt.toLocaleString("en-US")} sq ft`} />
              <Meta icon={<Home className="h-4 w-4" />} label="Household Base" value={`${Math.round(identity.householdBase / 1000)}K`} />
              <Meta icon={<BarChart3 className="h-4 w-4" />} label="Median HH Income" value={`$${Math.round(identity.medianIncome / 1000)}K`} />
              <Meta icon={<LayoutGrid className="h-4 w-4" />} label="Display Slots" value={`${identity.displaySlots}`} />
              <Meta icon={<BarChart3 className="h-4 w-4" />} label="Price Positioning" value={identity.pricePosition.replace("-", " – ")} />
            </dl>
            <p className="mt-auto pt-4 text-[11px] text-slate-400">
              Clusters are based on store and market context, not sales performance.
            </p>
            <MethodologyDrawer
              trigger={
                <button
                  type="button"
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-ssb-blue/40 bg-white py-2 text-[13px] font-medium text-ssb-blue hover:bg-ssb-blue-soft"
                >
                  View full methodology
                  <ArrowRight className="h-4 w-4" />
                </button>
              }
            />
            <Link href={`/store-identity?store=${store.id}`} className="mt-2 text-center text-[11px] text-slate-400 hover:text-ssb-blue">
              View store profile
            </Link>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}

function StatChip({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-[16px] bg-[#eef5ff] px-3 py-2.5 text-[13px] font-medium text-ssb-navy">
      {icon}
      {label}
    </div>
  );
}

function Meta({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="flex items-center gap-2 text-slate-500">
        <span className="text-ssb-blue">{icon}</span>
        {label}
      </dt>
      <dd className="font-medium text-ssb-navy">{value}</dd>
    </div>
  );
}
