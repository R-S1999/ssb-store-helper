import { AppShell, PageHeader } from "@/components/app-shell";
import { TradeAreaMap } from "@/components/trade-area-map";
import { IconTile } from "@/components/icon-tile";
import { getStore, marketFor } from "@/lib/selectors";
import {
  ArrowRight,
  BarChart3,
  Calculator,
  CalendarClock,
  ChevronRight,
  Crown,
  DollarSign,
  Home,
  PieChart,
  Snowflake,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

const NEED_ICONS: Record<string, ReactNode> = {
  Cooling: <Snowflake className="h-4 w-4 text-sky-500" />,
  "Pressure Relief": <Sparkles className="h-4 w-4 text-violet-500" />,
  Value: <DollarSign className="h-4 w-4 text-emerald-600" />,
  Couples: <UsersRound className="h-4 w-4 text-ssb-blue" />,
  Premium: <Crown className="h-4 w-4 text-amber-500" />,
};

const FORMULA = [
  "Household base",
  "Replacement propensity",
  "New household formation",
  "Recent movers",
  "Local demand adjustment",
];

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

        <div className="grid min-h-0 flex-1 grid-cols-[1.06fr_0.94fr] gap-3">
          <TradeAreaMap market={market} />
          <div className="flex min-h-0 flex-col gap-3">
            <Card>
              <div className="mb-3 flex items-center justify-between">
                <CardTitle icon={<BarChart3 className="h-5 w-5" />}>Estimated Annual Mattress Opportunity</CardTitle>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">
                  Illustrative Estimate
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Opp
                  value={`$${(market.annualOpportunity / 1_000_000).toFixed(1)}M`}
                  label="Total Market Opportunity"
                  note="Estimated annual mattress category demand in trade area"
                />
                <Opp
                  value={`${(market.currentShare * 100).toFixed(1)}%`}
                  label="Current Estimated Share"
                  note="This store’s estimated share of trade area demand"
                />
                <Opp
                  value={`$${(market.remainingOpportunity / 1_000_000).toFixed(1)}M`}
                  label="Remaining Opportunity"
                  note="Estimated unmet demand in trade area"
                  accent
                />
              </div>
            </Card>
            <Card className="min-h-0 flex-1">
              <CardTitle icon={<Users className="h-5 w-5" />}>Trade Area Demographics</CardTitle>
              <div className="mt-3 grid grid-cols-6 gap-2">
                <Demo tone="blue" icon={<Home className="h-5 w-5" />} value={market.households.toLocaleString("en-US")} label="Households" />
                <Demo tone="green" icon={<DollarSign className="h-5 w-5" />} value={`$${(market.medianIncome / 1000).toFixed(0)}K`} label="Median Household Income" />
                <Demo tone="violet" icon={<Home className="h-5 w-5" />} value={market.avgHouseholdSize.toFixed(1)} label="Avg Household Size" />
                <Demo tone="sky" icon={<UsersRound className="h-5 w-5" />} value={`${market.medianAge} yrs`} label="Median Householder Age" />
                <Demo tone="amber" icon={<TrendingUp className="h-5 w-5" />} value={`+${(market.householdGrowth * 100).toFixed(1)}%`} label="Household Growth" />
                <Demo tone="slate" icon={<CalendarClock className="h-5 w-5" />} value={market.newResidentialUnits.toLocaleString("en-US")} label="New Residential Units / Year" />
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-3 grid h-[250px] shrink-0 grid-cols-[0.9fr_0.95fr_1.15fr] gap-3">
          <Card className="flex flex-col">
            <CardTitle icon={<PieChart className="h-5 w-5" />}>Demand Composition</CardTitle>
            <p className="mt-1 mb-2 text-[11.5px] text-slate-500">
              Estimated share of annual mattress demand in trade area
            </p>
            <div className="flex flex-1 flex-col justify-around">
              {market.demandDrivers.map((driver) => (
                <div key={driver.label} className="grid grid-cols-[1fr_120px_34px] items-center gap-2.5">
                  <span className="text-[12.5px] text-ssb-navy">{driver.label}</span>
                  <div className="h-2.5 rounded-full bg-slate-100">
                    <div className="h-2.5 rounded-full bg-ssb-blue" style={{ width: `${driver.share}%` }} />
                  </div>
                  <span className="text-right text-[12.5px] font-semibold tabular-nums text-slate-600">
                    {driver.share}%
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="flex flex-col">
            <CardTitle icon={<Target className="h-5 w-5" />}>Local Customer Needs</CardTitle>
            <p className="mt-1 mb-2 text-[11.5px] text-slate-500">Relative demand in this trade area</p>
            <div className="grid flex-1 grid-cols-2 content-around gap-x-3 gap-y-2">
              {market.needProfile.map((need) => (
                <div
                  key={need.label}
                  className="flex items-center justify-between gap-2 rounded-[10px] bg-[#f4f8fd] px-2.5 py-1.5"
                >
                  <span className="flex min-w-0 items-center gap-1.5 text-[12.5px] font-medium text-ssb-navy">
                    {NEED_ICONS[need.label]}
                    <span className="truncate">{need.label}</span>
                  </span>
                  <span
                    className={
                      need.intensity === "High"
                        ? "shrink-0 rounded-full bg-[#dbeafe] px-2 py-0.5 text-[11px] font-semibold text-[#1d4ed8]"
                        : "shrink-0 rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-600"
                    }
                  >
                    {need.intensity}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <div className="flex min-h-0 flex-col gap-3">
            <Card className="shrink-0 !p-3.5">
              <CardTitle icon={<Calculator className="h-5 w-5" />}>How demand is derived</CardTitle>
              <p className="mt-1 mb-2 text-[11.5px] text-slate-500">Simplified methodology (illustrative)</p>
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1.5">
                {FORMULA.map((chip, i) => (
                  <span key={chip} className="flex items-center gap-1.5">
                    {i > 0 ? (
                      <span className="text-[13px] font-semibold text-slate-400">{i === 1 ? "×" : "+"}</span>
                    ) : null}
                    <span className="rounded-[8px] border border-slate-200 bg-[#f6f8fb] px-2 py-1 text-[11px] font-medium text-ssb-navy">
                      {chip}
                    </span>
                  </span>
                ))}
                <span className="text-[13px] font-semibold text-slate-400">=</span>
                <span className="rounded-[8px] border border-ssb-blue/40 bg-[#dbeafe] px-2 py-1 text-[11px] font-semibold text-[#1d4ed8]">
                  Estimated mattress opportunity
                </span>
              </div>
            </Card>
            <Link
              href={`/store-performance/display-assortment${q}`}
              className="flex min-h-0 flex-1 items-start gap-3 overflow-hidden rounded-[18px] border border-emerald-200 bg-[#ecfdf5] px-3.5 py-2.5"
            >
              <IconTile tone="green" size="sm">
                <Target className="h-4 w-4" />
              </IconTile>
              <div className="min-w-0">
                <p className="text-[13.5px] font-semibold text-ssb-navy">Strategic Recommendation</p>
                <p className="mt-0.5 text-[11.5px] leading-snug text-slate-600">
                  <span className="font-semibold text-ssb-navy">Expand cooling coverage in the $1,500 – $2,500 range.</span>{" "}
                  Market demand for cooling is high in this trade area, current assortment is below top peers, and
                  leading competitors actively position cooling as a distinct sleep benefit.
                </p>
              </div>
              <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-emerald-600" />
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-[18px] border border-slate-200 bg-white p-4 ${className}`}>{children}</section>;
}

function CardTitle({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-center gap-2.5">
      <IconTile tone="blue" size="sm">
        {icon}
      </IconTile>
      <h3 className="text-[17px] font-semibold text-ssb-navy">{children}</h3>
    </div>
  );
}

function Opp({ value, label, note, accent }: { value: string; label: string; note: string; accent?: boolean }) {
  return (
    <div>
      <p className={`text-[30px] font-bold leading-none ${accent ? "text-emerald-600" : "text-ssb-blue"}`}>{value}</p>
      <p className="mt-1.5 text-[13px] font-semibold text-ssb-navy">{label}</p>
      <p className="mt-0.5 text-[11px] leading-snug text-slate-500">{note}</p>
    </div>
  );
}

function Demo({
  icon,
  tone,
  value,
  label,
}: {
  icon: ReactNode;
  tone: "blue" | "green" | "violet" | "sky" | "amber" | "slate";
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <IconTile tone={tone} size="md">
        {icon}
      </IconTile>
      <p className="mt-2 text-[19px] font-bold leading-none tabular-nums text-ssb-navy">{value}</p>
      <p className="mt-1 text-[10.5px] leading-tight text-slate-500">{label}</p>
    </div>
  );
}
