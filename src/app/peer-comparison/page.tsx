import { AppShell, PageHeader } from "@/components/app-shell";
import { IconTile } from "@/components/icon-tile";
import { PeerRankStrip, StorefrontGlyph } from "@/components/peer-rank-strip";
import { MethodologyDrawer } from "@/components/methodology-drawer";
import { CLUSTER, CLUSTER_BENCHMARKS } from "@/lib/data";
import { getStore, insightStrip, rankedStores, storeRank } from "@/lib/selectors";
import { ArrowRight, BarChart3, Home, LayoutGrid, Lightbulb, MapPin, Tag, Trophy, Users } from "lucide-react";
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
        <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1.72fr)_330px] gap-4">
          <section className="flex min-h-0 flex-col rounded-[20px] border border-slate-200 bg-white p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <IconTile tone="slate" size="xl" shape="circle">
                  <StorefrontGlyph className="h-8 w-8" />
                </IconTile>
                <div>
                  <h3 className="text-[21px] font-semibold text-ssb-navy">
                    {store.name} – {store.city}, {store.state}
                  </h3>
                  <p className="mt-1 text-[42px] font-bold leading-none tracking-tight text-ssb-blue">
                    #{rank.rank} <span className="text-[26px] font-semibold text-ssb-navy">of {rank.of}</span>
                  </p>
                  <p className="mt-1.5 text-[13.5px] text-slate-500">Top {rank.percentile}% of Comparable Stores</p>
                </div>
              </div>
              <div className="flex items-center gap-3.5 rounded-[16px] bg-[#e8f2ff] px-7 py-4">
                <BarChart3 className="h-7 w-7 shrink-0 text-ssb-blue" />
                <div>
                  <p className="text-[13px] font-medium text-slate-500">Overall Store Effectiveness Score</p>
                  <p className="mt-1 text-[38px] font-bold leading-none text-ssb-blue">
                    {store.overallScore} <span className="text-[19px] font-semibold text-ssb-navy">/ 100</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-[16px] bg-[#eaf3ff] px-5 py-3.5 text-[14px] leading-relaxed text-ssb-navy">
              <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-ssb-blue" />
              <p>{insightStrip(store)}</p>
            </div>

            <div className="flex min-h-0 flex-1 items-end pb-2">
              <div className="w-full">
                <PeerRankStrip current={store} />
              </div>
            </div>

            <div className="mt-4 grid shrink-0 grid-cols-3 gap-4 border-t border-slate-100 pt-4">
              <StatChip tone="blue" icon={<Users className="h-5 w-5" />} value={`${CLUSTER.peerCount}`} label="Comparable Stores" />
              <StatChip
                tone="blue"
                icon={<BarChart3 className="h-5 w-5" />}
                inlineLabel="Cluster Score Avg:"
                value={`${CLUSTER_BENCHMARKS.overallCluster}`}
              />
              <StatChip
                tone="amber"
                icon={<Trophy className="h-5 w-5" />}
                inlineLabel="Top Store Score:"
                value={`${topScore}`}
              />
            </div>
          </section>

          <aside className="flex min-h-0 flex-col rounded-[20px] border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-2.5">
              <IconTile tone="blue" size="sm">
                <Users className="h-5 w-5" />
              </IconTile>
              <h3 className="text-[18px] font-semibold text-ssb-navy">Why these peers?</h3>
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-slate-500">
              These stores are most similar to your store based on location, size, market and retail model.
            </p>
            <p className="mt-5 text-[12.5px] font-medium text-slate-400">Peer Cluster:</p>
            <p className="text-[16px] font-semibold leading-snug text-ssb-navy">{CLUSTER.name}</p>
            <dl className="mt-4 space-y-3.5 text-[14px]">
              <Meta icon={<MapPin className="h-4.5 w-4.5" />} label="Trade Area" value="Suburban" />
              <Meta icon={<LayoutGrid className="h-4.5 w-4.5" />} label="Selling Space" value={`${identity.sellingSpaceSqFt.toLocaleString("en-US")} sq ft`} />
              <Meta icon={<Users className="h-4.5 w-4.5" />} label="Household Base" value={`${Math.round(identity.householdBase / 1000)}K`} />
              <Meta icon={<BarChart3 className="h-4.5 w-4.5" />} label="Median HH Income" value={`$${Math.round(identity.medianIncome / 1000)}K`} />
              <Meta icon={<Tag className="h-4.5 w-4.5" />} label="Display Slots" value={`${identity.displaySlots}`} />
              <Meta icon={<Home className="h-4.5 w-4.5" />} label="Price Positioning" value={identity.pricePosition.replace("-", " – ")} />
            </dl>
            <p className="mt-5 text-[12px] leading-relaxed text-slate-400">
              Clusters are based on store and market context, not sales performance.
            </p>
            <MethodologyDrawer
              trigger={
                <button
                  type="button"
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-[12px] border border-ssb-blue/40 bg-white py-3 text-[14px] font-medium text-ssb-blue hover:bg-ssb-blue-soft"
                >
                  View full methodology
                  <ArrowRight className="h-4 w-4" />
                </button>
              }
            />
            <Link
              href={`/store-identity?store=${store.id}`}
              className="mt-3 text-center text-[12.5px] text-slate-400 hover:text-ssb-blue"
            >
              View store profile
            </Link>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}

function StatChip({
  icon,
  tone,
  value,
  label,
  inlineLabel,
}: {
  icon: ReactNode;
  tone: "blue" | "amber";
  value: string;
  label?: string;
  inlineLabel?: string;
}) {
  return (
    <div className="flex items-center gap-3.5 rounded-[16px] bg-[#eef5ff] px-5 py-4">
      <IconTile tone={tone} size="md">
        {icon}
      </IconTile>
      {inlineLabel ? (
        <p className="text-[15px] text-slate-600">
          {inlineLabel} <span className="ml-1 text-[19px] font-bold text-ssb-navy">{value}</span>
        </p>
      ) : (
        <div>
          <p className="text-[24px] font-bold leading-none text-ssb-navy">{value}</p>
          <p className="mt-1 text-[13.5px] text-slate-500">{label}</p>
        </div>
      )}
    </div>
  );
}

function Meta({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
      <dt className="flex items-center gap-2.5 text-slate-500">
        <span className="text-ssb-blue">{icon}</span>
        {label}
      </dt>
      <dd className="font-semibold text-ssb-navy">{value}</dd>
    </div>
  );
}
