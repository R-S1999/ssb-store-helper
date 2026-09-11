import { AppShell, PageHeader } from "@/components/app-shell";
import { TradeAreaMap } from "@/components/trade-area-map";
import { IconTile } from "@/components/icon-tile";
import { getStore, marketFor } from "@/lib/selectors";
import {
  ArrowRight,
  Baby,
  BarChart3,
  Calculator,
  Home,
  Snowflake,
  Target,
  Users,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

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
    <AppShell store={store} pathname="/market-opportunity" fill>
      <div className="flex h-full min-h-0 flex-col">
        <PageHeader
          title="Store & Market Opportunity"
          subtitle="How large is the opportunity surrounding this store, and what kind of demand exists?"
        />

        <div className="grid min-h-0 flex-1 grid-cols-[1.08fr_0.92fr] gap-2.5">
          <TradeAreaMap market={market} />
          <div className="flex min-h-0 flex-col gap-2.5">
            <section className="rounded-[18px] border border-slate-200 bg-white p-3.5">
              <div className="mb-2 flex items-center justify-between">
                <p className="flex items-center gap-2 text-[13px] font-semibold text-ssb-navy">
                  <IconTile tone="blue" size="sm">
                    <BarChart3 className="h-3.5 w-3.5" />
                  </IconTile>
                  Estimated Annual Mattress Opportunity
                </p>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                  Illustrative Estimate
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Opp value={`$${(market.annualOpportunity / 1_000_000).toFixed(1)}M`} label="Total Market Opportunity" note="Estimated annual mattress category demand in trade area" />
                <Opp value={`${(market.currentShare * 100).toFixed(1)}%`} label="Current Estimated Share" note="This store’s estimated share of trade area demand" />
                <Opp value={`$${(market.remainingOpportunity / 1_000_000).toFixed(1)}M`} label="Remaining Opportunity" note="Estimated unmet demand in trade area" accent />
              </div>
            </section>
            <section className="min-h-0 flex-1 rounded-[18px] border border-slate-200 bg-white p-3.5">
              <p className="mb-3 flex items-center gap-2 text-[13px] font-semibold text-ssb-navy">
                <IconTile tone="blue" size="sm">
                  <Users className="h-3.5 w-3.5" />
                </IconTile>
                Trade Area Demographics
              </p>
              <div className="grid grid-cols-6 gap-2">
                <Demo icon={<Home className="h-4 w-4" />} value={market.households.toLocaleString("en-US")} label="Households" />
                <Demo icon={<BarChart3 className="h-4 w-4" />} value={`$${(market.medianIncome / 1000).toFixed(0)}K`} label="Median Household Income" />
                <Demo icon={<Users className="h-4 w-4" />} value={market.avgHouseholdSize.toFixed(1)} label="Avg Household Size" />
                <Demo icon={<Users className="h-4 w-4" />} value={`${market.medianAge} yrs`} label="Median Householder Age" />
                <Demo icon={<BarChart3 className="h-4 w-4" />} value={`+${(market.householdGrowth * 100).toFixed(1)}%`} label="Household Growth" />
                <Demo icon={<Home className="h-4 w-4" />} value={market.newResidentialUnits.toLocaleString("en-US")} label="New Residential Units / Year" />
              </div>
            </section>
          </div>
        </div>

        <div className="mt-2.5 grid shrink-0 grid-cols-3 gap-2.5">
          <section className="rounded-[18px] border border-slate-200 bg-white p-3.5">
            <p className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-ssb-navy">
              <IconTile tone="blue" size="sm">
                <BarChart3 className="h-3.5 w-3.5" />
              </IconTile>
              Demand Composition
            </p>
            <p className="mb-2 text-[10px] text-slate-400">Estimated share of annual mattress demand in trade area</p>
            <div className="space-y-1.5">
              {market.demandDrivers.map((driver) => (
                <div key={driver.label} className="grid grid-cols-[1fr_90px_28px] items-center gap-2">
                  <span className="text-[11px] text-ssb-navy">{driver.label}</span>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-ssb-blue" style={{ width: `${driver.share}%` }} />
                  </div>
                  <span className="text-right text-[11px] tabular-nums text-slate-500">{driver.share}%</span>
                </div>
              ))}
            </div>
          </section>
          <section className="rounded-[18px] border border-slate-200 bg-white p-3.5">
            <p className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-ssb-navy">
              <IconTile tone="blue" size="sm">
                <Target className="h-3.5 w-3.5" />
              </IconTile>
              Local Customer Needs
            </p>
            <p className="mb-2 text-[10px] text-slate-400">Relative demand in this trade area</p>
            <div className="flex flex-wrap gap-2">
              {market.needProfile.map((need) => (
                <span
                  key={need.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-ssb-navy"
                >
                  {need.label === "Cooling" ? <Snowflake className="h-3 w-3 text-sky-500" /> : <Baby className="h-3 w-3 text-ssb-blue" />}
                  {need.label}
                  <span
                    className={
                      need.intensity === "High"
                        ? "rounded-full bg-sky-50 px-1.5 text-[10px] text-sky-700"
                        : "rounded-full bg-slate-100 px-1.5 text-[10px] text-slate-500"
                    }
                  >
                    {need.intensity}
                  </span>
                </span>
              ))}
            </div>
          </section>
          <div className="flex min-h-0 flex-col gap-2">
            <section className="rounded-[18px] border border-slate-200 bg-white p-3">
              <p className="mb-2 flex items-center gap-2 text-[12px] font-semibold text-ssb-navy">
                <IconTile tone="blue" size="sm">
                  <Calculator className="h-3.5 w-3.5" />
                </IconTile>
                How demand is derived
              </p>
              <p className="mb-2 text-[10px] text-slate-400">Simplified methodology (illustrative)</p>
              <div className="flex flex-wrap items-center gap-1 text-[10px]">
                {["Household base", "Replacement propensity", "New household formation", "Recent movers", "Local demand adjustment"].map(
                  (chip, i) => (
                    <span key={chip} className="flex items-center gap-1">
                      {i > 0 ? <span className="text-slate-300">{i === 1 ? "×" : "+"}</span> : null}
                      <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-ssb-navy">{chip}</span>
                    </span>
                  ),
                )}
                <span className="text-slate-300">=</span>
                <span className="rounded-md bg-ssb-blue-soft px-1.5 py-0.5 font-medium text-ssb-blue">
                  Estimated mattress opportunity
                </span>
              </div>
            </section>
            <Link
              href={`/store-performance/display-assortment${q}`}
              className="flex min-h-0 flex-1 items-start gap-2 rounded-[16px] bg-emerald-50 px-3 py-2.5"
            >
              <IconTile tone="green" size="sm">
                <Target className="h-3.5 w-3.5" />
              </IconTile>
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-ssb-navy">Strategic Recommendation</p>
                <p className="text-[11px] leading-snug text-slate-600">
                  Expand cooling coverage in the $1,500 – $2,500 range. Market demand for cooling is high in this
                  trade area; current assortment is below top peers, and leading competitors actively position cooling
                  as a distinct sleep benefit.
                </p>
              </div>
              <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Opp({ value, label, note, accent }: { value: string; label: string; note: string; accent?: boolean }) {
  return (
    <div>
      <p className={`text-[26px] font-semibold leading-none ${accent ? "text-emerald-600" : "text-ssb-navy"}`}>{value}</p>
      <p className="mt-1 text-[11px] font-medium text-ssb-navy">{label}</p>
      <p className="text-[10px] leading-snug text-slate-400">{note}</p>
    </div>
  );
}

function Demo({ icon, value, label }: { icon: ReactNode; value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-1 flex justify-center text-ssb-blue">{icon}</div>
      <p className="text-[16px] font-semibold tabular-nums text-ssb-navy">{value}</p>
      <p className="text-[9px] leading-tight text-slate-400">{label}</p>
    </div>
  );
}
