import { AppShell, PageHeader } from "@/components/app-shell";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { KpiBlock } from "@/components/kpi-block";
import { RecommendationCard } from "@/components/recommendation-card";
import { TradeAreaMap } from "@/components/trade-area-map";
import { CLUSTER } from "@/lib/data";
import { getStore, marketFor, recommendation } from "@/lib/selectors";

export default async function MarketPage({
  searchParams,
}: {
  searchParams: Promise<{ store?: string }>;
}) {
  const { store: storeId } = await searchParams;
  const store = getStore(storeId);
  const market = marketFor(store);
  const q = `?store=${store.id}`;

  return (
    <AppShell store={store} pathname="/market-opportunity">
      <Breadcrumbs
        items={[
          { label: "Peer Comparison", href: `/peer-comparison${q}` },
          { label: "Store Performance", href: `/store-performance${q}` },
          { label: "Store & Market Opportunity" },
        ]}
      />
      <PageHeader
        title="Store & Market Opportunity"
        subtitle="Understand the size, composition and needs of potential mattress demand within the trade area."
        question="How large is the opportunity surrounding this store, and what kind of demand exists?"
      />
      <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <TradeAreaMap market={market} />
        <section className="rounded-3xl border border-border bg-white p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ssb-amber">
            Illustrative estimate
          </p>
          <p className="mt-2 text-sm text-muted-foreground">Estimated annual mattress opportunity</p>
          <p className="text-5xl font-semibold tracking-tight text-ssb-navy">
            ${(market.annualOpportunity / 1_000_000).toFixed(1)}M
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <KpiBlock
              label="Current estimated share"
              value={`${(market.currentShare * 100).toFixed(1)}%`}
              tone="blue"
            />
            <KpiBlock
              label="Remaining opportunity"
              value={`$${(market.remainingOpportunity / 1_000_000).toFixed(1)}M`}
              tone="amber"
            />
          </div>
        </section>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <KpiBlock label="Households" value={market.households.toLocaleString("en-US")} />
        <KpiBlock label="Median household income" value={`$${(market.medianIncome / 1000).toFixed(0)}K`} />
        <KpiBlock label="Avg household size" value={market.avgHouseholdSize.toFixed(1)} />
        <KpiBlock label="Median householder age" value={`${market.medianAge}`} />
        <KpiBlock label="Household growth" value={`+${(market.householdGrowth * 100).toFixed(1)}%`} tone="green" />
        <KpiBlock label="New residential units / year" value={market.newResidentialUnits.toLocaleString("en-US")} />
      </div>
      <section className="mt-4 rounded-3xl border border-border bg-white p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Demand drivers · illustrative until calibrated
        </p>
        <div className="mt-4 space-y-3">
          {market.demandDrivers.map((driver) => (
            <div key={driver.label}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-ssb-navy">{driver.label}</span>
                <span className="tabular-nums text-muted-foreground">{driver.share}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div className="h-2 rounded-full bg-ssb-blue" style={{ width: `${driver.share}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {market.needProfile.map((need) => (
            <span
              key={need.label}
              className="rounded-full bg-ssb-blue-soft px-3 py-1 text-sm font-medium text-ssb-navy"
            >
              {need.label} · {need.intensity}
            </span>
          ))}
        </div>
      </section>
      <details className="mt-4 rounded-2xl border border-border bg-white p-4">
        <summary className="cursor-pointer font-semibold text-ssb-navy">Opportunity methodology</summary>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Household base × replacement propensity + new household formation + recent movers + local demand adjustment
          = estimated mattress opportunity. Period {CLUSTER.methodology.period}. Confidence {CLUSTER.methodology.confidence}.
          Figures are labelled illustrative until live Serta / retailer calibration.
        </p>
      </details>
      <div className="mt-5">
        <RecommendationCard recommendation={recommendation("market")} />
      </div>
    </AppShell>
  );
}
