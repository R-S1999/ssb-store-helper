import { AppShell, PageHeader } from "@/components/app-shell";
import { getStore, storeRank } from "@/lib/selectors";
import {
  ArrowRight,
  BarChart3,
  BedDouble,
  Building2,
  Database,
  FileText,
  Home,
  LayoutGrid,
  Lightbulb,
  MapPin,
  Package,
  Store,
  Tag,
  Users,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export default async function StoreIdentityPage({
  searchParams,
}: {
  searchParams: Promise<{ store?: string }>;
}) {
  const { store: storeId } = await searchParams;
  const store = getStore(storeId);
  const id = store.identity;
  const rank = storeRank(store.id);
  const q = `?store=${store.id}`;

  const physical = [
    { icon: <Building2 className="h-4 w-4" />, label: "Store Type", value: id.storeType },
    { icon: <MapPin className="h-4 w-4" />, label: "Trade Area", value: id.tradeArea },
    { icon: <Home className="h-4 w-4" />, label: "Total Selling Space", value: `${id.sellingSpaceSqFt.toLocaleString("en-US")} sq. ft.` },
    { icon: <BedDouble className="h-4 w-4" />, label: "Mattress Selling Space", value: `${id.mattressSellingSpaceSqFt.toLocaleString("en-US")} sq. ft.` },
    { icon: <LayoutGrid className="h-4 w-4" />, label: "Display Slots", value: `${id.displaySlots}` },
    { icon: <Tag className="h-4 w-4" />, label: "Price Position", value: id.pricePosition },
    { icon: <Package className="h-4 w-4" />, label: "Brands Carried", value: `${id.brands.length}` },
    { icon: <Store className="h-4 w-4" />, label: "SSB Models", value: `${id.ssbModels}` },
  ];

  return (
    <AppShell store={store} pathname="/store-identity" fill>
      <div className="flex h-full min-h-0 flex-col">
        <PageHeader
          title="Store Profile"
          subtitle="View key details about this store, including its physical characteristics, team, and profile attributes."
        />

        <div className="mb-3 grid shrink-0 grid-cols-4 gap-3">
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <Home className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-ssb-navy">
                  {store.name} – {store.city}, {store.state}
                </p>
                <p className="text-[11px] text-slate-400">Suburban Growth – Mid-Size Full-Line Retailer</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-[#e8f2ff] px-4 py-3">
            <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <BarChart3 className="h-3.5 w-3.5 text-ssb-blue" />
              Overall Store Effectiveness Score
            </p>
            <p className="mt-1 text-3xl font-semibold text-ssb-navy">
              {store.overallScore} <span className="text-base font-medium text-slate-400">/ 100</span>
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <Users className="h-3.5 w-3.5 text-ssb-blue" />
              Peer Rank
            </p>
            <p className="mt-1 text-3xl font-semibold text-ssb-navy">
              #{rank.rank} <span className="text-base font-medium text-slate-400">of {rank.of}</span>
            </p>
            <p className="text-[11px] text-slate-400">Top {rank.percentile}% of Comparable Stores</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-[#eaf3ff] px-4 py-3">
            <div className="flex gap-2">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-ssb-blue" />
              <p className="text-[12px] leading-snug text-ssb-navy">
                This store profile summarizes the key characteristics used to determine its peer cluster and
                opportunity areas.
              </p>
            </div>
          </div>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-2 gap-3">
          <section className="flex min-h-0 flex-col rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ssb-blue-soft text-ssb-blue">
                <Building2 className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-ssb-navy">Physical & Commercial</h3>
                <p className="text-[11px] text-slate-400">Key physical and commercial attributes for this store.</p>
              </div>
            </div>
            <dl className="min-h-0 flex-1">
              {physical.map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between gap-3 border-b border-slate-100 py-2.5 last:border-0"
                >
                  <dt className="flex items-center gap-2 text-[13px] text-slate-500">
                    <span className="text-ssb-blue">{row.icon}</span>
                    {row.label}
                  </dt>
                  <dd className="text-[13px] font-semibold text-ssb-navy">{row.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="flex min-h-0 flex-col rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ssb-blue-soft text-ssb-blue">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-ssb-navy">People & Team</h3>
                  <p className="text-[11px] text-slate-400">Sales team composition and training completion.</p>
                </div>
              </div>
              <div className="rounded-xl bg-[#eaf3ff] px-3 py-1.5 text-center">
                <p className="text-[10px] text-slate-500">Sales Associates</p>
                <p className="text-lg font-semibold leading-none text-ssb-navy">{id.associates.length}</p>
              </div>
            </div>
            <div className="grid grid-cols-[1.2fr_1fr_0.7fr] px-1 pb-1 text-[10px] uppercase tracking-wide text-slate-400">
              <span>Associate Name</span>
              <span>Training Completion</span>
              <span className="text-right">Tenure</span>
            </div>
            <ul className="min-h-0 flex-1 space-y-2">
              {id.associates.map((person) => (
                <li key={person.name} className="grid grid-cols-[1.2fr_1fr_0.7fr] items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-ssb-navy">
                      {person.initials}
                    </span>
                    <span className="text-[13px] font-medium text-ssb-navy">{person.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-2 rounded-full bg-ssb-blue" style={{ width: `${person.trainingPct}%` }} />
                    </div>
                    <span className="w-8 text-right text-[11px] tabular-nums text-slate-500">{person.trainingPct}%</span>
                  </div>
                  <span className="text-right text-[12px] tabular-nums text-slate-500">
                    {person.tenureYears.toFixed(1)} years
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-3 flex shrink-0 flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2.5">
          <p className="max-w-[520px] flex items-center gap-2 text-[12px] text-slate-500">
            <Database className="h-4 w-4 text-ssb-blue" />
            These store characteristics are used to determine the peer cluster and contextualize recommendations
            across the Retailer Relationship Improvement Engine.
          </p>
          <div className="flex shrink-0 items-center gap-3">
            <span className="text-[11px] text-slate-400">Data sources:</span>
            <SourceChip icon={<Database className="h-3 w-3" />} label="Retailer Master" />
            <SourceChip icon={<FileText className="h-3 w-3" />} label="Store Survey" />
            <SourceChip icon={<Package className="h-3 w-3" />} label="Product Master" />
            <Link
              href={`/peer-comparison${q}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-ssb-blue px-3 py-1.5 text-[12px] font-medium text-ssb-blue hover:bg-ssb-blue-soft"
            >
              View cluster context
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function SourceChip({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-600">
      {icon}
      {label}
    </span>
  );
}
