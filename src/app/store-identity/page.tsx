import { AppShell, PageHeader } from "@/components/app-shell";
import { IconTile } from "@/components/icon-tile";
import { StorefrontGlyph } from "@/components/peer-rank-strip";
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
    { icon: <Building2 className="h-5 w-5" />, label: "Store Type", value: id.storeType },
    { icon: <MapPin className="h-5 w-5" />, label: "Trade Area", value: id.tradeArea },
    { icon: <Home className="h-5 w-5" />, label: "Total Selling Space", value: `${id.sellingSpaceSqFt.toLocaleString("en-US")} sq. ft.` },
    { icon: <BedDouble className="h-5 w-5" />, label: "Mattress Selling Space", value: `${id.mattressSellingSpaceSqFt.toLocaleString("en-US")} sq. ft.` },
    { icon: <LayoutGrid className="h-5 w-5" />, label: "Display Slots", value: `${id.displaySlots}` },
    { icon: <Tag className="h-5 w-5" />, label: "Price Position", value: id.pricePosition },
    { icon: <Package className="h-5 w-5" />, label: "Brands Carried", value: `${id.brands.length}` },
    { icon: <Store className="h-5 w-5" />, label: "SSB Models", value: `${id.ssbModels}` },
  ];

  return (
    <AppShell store={store} pathname="/store-identity" fill>
      <div className="flex h-full min-h-0 flex-col">
        <PageHeader
          title="Store Profile"
          subtitle="View key details about this store, including its physical characteristics, team, and profile attributes."
        />

        {/* single strip card with internal dividers */}
        <div className="mb-3 flex shrink-0 items-stretch gap-6 rounded-[18px] border border-slate-200 bg-white px-6 py-4">
          <div className="flex items-center gap-3.5">
            <IconTile tone="slate" size="xl" shape="circle">
              <StorefrontGlyph className="h-7 w-7" />
            </IconTile>
            <div>
              <p className="text-[19px] font-semibold text-ssb-navy">
                {store.name} – {store.city}, {store.state}
              </p>
              <p className="mt-0.5 text-[13px] text-slate-500">Suburban Growth – Mid-Size Full-Line Retailer</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5 border-l border-slate-200 pl-6">
            <IconTile tone="blue" size="lg">
              <BarChart3 className="h-6 w-6" />
            </IconTile>
            <div>
              <p className="text-[13px] text-slate-500">Overall Store Effectiveness Score</p>
              <p className="mt-0.5 text-[30px] font-bold leading-none text-ssb-blue">
                {store.overallScore} <span className="text-[16px] font-semibold text-ssb-navy">/ 100</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3.5 border-l border-slate-200 pl-6">
            <IconTile tone="blue" size="lg">
              <Users className="h-6 w-6" />
            </IconTile>
            <div>
              <p className="text-[13px] text-slate-500">Peer Rank</p>
              <p className="mt-0.5 text-[30px] font-bold leading-none text-ssb-blue">
                #{rank.rank} <span className="text-[16px] font-semibold text-ssb-navy">of {rank.of}</span>
              </p>
              <p className="mt-1 text-[12px] text-slate-400">Top {rank.percentile}% of Comparable Stores</p>
            </div>
          </div>
          <div className="ml-auto flex max-w-[330px] items-start gap-3 self-center rounded-[14px] bg-[#eaf3ff] px-4 py-3">
            <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-ssb-blue" />
            <p className="text-[13px] leading-snug text-ssb-navy">
              This store profile summarizes the key characteristics used to determine its peer cluster and opportunity
              areas.
            </p>
          </div>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-2 gap-3">
          <section className="flex min-h-0 flex-col rounded-[18px] border border-slate-200 bg-white p-5">
            <div className="mb-2 flex items-center gap-3">
              <IconTile tone="blue" size="md">
                <Building2 className="h-5 w-5" />
              </IconTile>
              <div>
                <h3 className="text-[17px] font-semibold text-ssb-navy">Physical &amp; Commercial</h3>
                <p className="text-[12.5px] text-slate-500">Key physical and commercial attributes for this store.</p>
              </div>
            </div>
            <dl className="flex min-h-0 flex-1 flex-col">
              {physical.map((row) => (
                <div
                  key={row.label}
                  className="grid flex-1 grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] items-center border-b border-slate-100 last:border-0"
                >
                  <dt className="flex items-center gap-3 text-[14px] text-slate-500">
                    <span className="text-ssb-blue">{row.icon}</span>
                    {row.label}
                  </dt>
                  <dd className="text-[14.5px] font-semibold text-ssb-navy">{row.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="flex min-h-0 flex-col rounded-[18px] border border-slate-200 bg-white p-5">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <IconTile tone="blue" size="md">
                  <Users className="h-5 w-5" />
                </IconTile>
                <div>
                  <h3 className="text-[17px] font-semibold text-ssb-navy">People &amp; Team</h3>
                  <p className="text-[12.5px] text-slate-500">Sales team composition and training completion.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-[14px] bg-[#eaf3ff] px-4 py-2.5">
                <IconTile tone="blue" size="sm">
                  <Users className="h-4 w-4" />
                </IconTile>
                <div>
                  <p className="text-[12px] text-slate-500">Sales Associates</p>
                  <p className="text-[22px] font-bold leading-none text-ssb-navy">{id.associates.length}</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-[1.15fr_1.35fr_0.6fr] border-b border-slate-200 pb-2 text-[12.5px] font-medium text-slate-500">
              <span>Associate Name</span>
              <span>Training Completion</span>
              <span className="text-right">Tenure</span>
            </div>
            <ul className="flex min-h-0 flex-1 flex-col">
              {id.associates.map((person) => (
                <li
                  key={person.name}
                  className="grid flex-1 grid-cols-[1.15fr_1.35fr_0.6fr] items-center gap-3 border-b border-slate-100 last:border-0"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dbeafe] text-[12px] font-bold text-[#1d4ed8]">
                      {person.initials}
                    </span>
                    <span className="text-[14.5px] font-semibold text-ssb-navy">{person.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-3 rounded-full bg-ssb-blue" style={{ width: `${person.trainingPct}%` }} />
                    </div>
                    <span className="w-9 text-right text-[13px] font-semibold tabular-nums text-slate-600">
                      {person.trainingPct}%
                    </span>
                  </div>
                  <span className="text-right text-[13.5px] tabular-nums text-slate-600">
                    {person.tenureYears.toFixed(1)} years
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-3 flex shrink-0 flex-wrap items-center justify-between gap-3 rounded-[18px] border border-slate-200 bg-white px-5 py-3">
          <div className="flex max-w-[560px] items-center gap-3 text-[13px] text-slate-500">
            <IconTile tone="blue" size="sm">
              <Database className="h-4 w-4" />
            </IconTile>
            <p>
              These store characteristics are used to determine the peer cluster and contextualize recommendations
              across the Retailer Relationship Improvement Engine.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="text-[12.5px] text-slate-500">Data sources:</span>
            <SourceChip icon={<Database className="h-3.5 w-3.5" />} label="Retailer Master" />
            <SourceChip icon={<FileText className="h-3.5 w-3.5" />} label="Store Survey" />
            <SourceChip icon={<Package className="h-3.5 w-3.5" />} label="Product Master" />
            <Link
              href={`/peer-comparison${q}`}
              className="inline-flex items-center gap-2 rounded-[12px] border border-ssb-blue px-4 py-2 text-[13.5px] font-medium text-ssb-blue hover:bg-ssb-blue-soft"
            >
              View cluster context
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function SourceChip({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-[#f4f8fd] px-3 py-1.5 text-[12.5px] font-medium text-slate-600">
      <span className="text-ssb-blue">{icon}</span>
      {label}
    </span>
  );
}
