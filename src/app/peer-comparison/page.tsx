import { AppShell, ColorLegend, PageHeader } from "@/components/app-shell";
import { PeerRankStrip } from "@/components/peer-rank-strip";
import { CLUSTER } from "@/lib/data";
import { getStore, insightStrip, storeRank } from "@/lib/selectors";
import Link from "next/link";

export default async function PeerComparisonPage({
  searchParams,
}: {
  searchParams: Promise<{ store?: string }>;
}) {
  const { store: storeId } = await searchParams;
  const store = getStore(storeId);
  const rank = storeRank(store.id);
  const identity = store.identity;

  return (
    <AppShell store={store} pathname="/peer-comparison">
      <PageHeader
        title="Peer Comparison"
        subtitle="See how your store performs against comparable stores in its cluster."
        question="How do I perform against stores that genuinely resemble mine?"
      />
      <div className="mb-4">
        <ColorLegend />
      </div>
      <section className="mb-4 grid gap-4 rounded-3xl border border-border bg-white p-5 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ssb-blue">Your store</p>
          <h3 className="mt-1 text-2xl font-semibold text-ssb-navy">
            {store.name} – {store.city}, {store.state}
          </h3>
          <p className="mt-4 text-6xl font-semibold tracking-tight text-ssb-navy">
            #{rank.rank}
            <span className="text-2xl font-medium text-muted-foreground"> of {rank.of}</span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Top {rank.percentile}% of the lookalike cluster</p>
        </div>
        <div className="flex flex-col justify-between rounded-2xl bg-ssb-blue-soft p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ssb-blue">
            Overall store effectiveness
          </p>
          <p className="text-6xl font-semibold text-ssb-navy">
            {store.overallScore}
            <span className="text-2xl text-muted-foreground">/100</span>
          </p>
          <Link href={`/store-identity?store=${store.id}`} className="text-sm font-medium text-ssb-blue hover:underline">
            View store identity
          </Link>
        </div>
      </section>
      <p className="mb-4 rounded-2xl bg-[#dcebff] px-4 py-3 text-sm text-ssb-navy">
        {insightStrip(store)}
      </p>
      <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
        <PeerRankStrip current={store} />
        <aside className="rounded-3xl border border-border bg-white p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ssb-blue">Why these peers?</p>
          <h3 className="mt-1 text-lg font-semibold text-ssb-navy">{CLUSTER.name}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{CLUSTER.description}</p>
          <dl className="mt-4 space-y-2 text-sm">
            <Row label="Trade area" value={identity.tradeArea} />
            <Row label="Selling space" value={`${identity.sellingSpaceSqFt.toLocaleString("en-US")} sq ft`} />
            <Row label="Household base" value={identity.householdBase.toLocaleString("en-US")} />
            <Row label="Median income" value={`$${identity.medianIncome.toLocaleString("en-US")}`} />
            <Row label="Display slots" value={`${identity.displaySlots}`} />
            <Row label="Price positioning" value={identity.pricePosition} />
          </dl>
          <p className="mt-4 text-xs text-muted-foreground">
            Performance is not used to create this peer group. Open Sources & Methodology for clustering inputs.
          </p>
        </aside>
      </div>
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border/80 py-1.5">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium text-ssb-navy">{value}</dd>
    </div>
  );
}
