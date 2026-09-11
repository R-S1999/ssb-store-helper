import { AppShell, PageHeader } from "@/components/app-shell";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { EvidenceChip } from "@/components/evidence-chip";
import { getStore } from "@/lib/selectors";

export default async function StoreIdentityPage({
  searchParams,
}: {
  searchParams: Promise<{ store?: string }>;
}) {
  const { store: storeId } = await searchParams;
  const store = getStore(storeId);
  const id = store.identity;
  const q = `?store=${store.id}`;

  return (
    <AppShell store={store} pathname="/store-identity">
      <Breadcrumbs
        items={[
          { label: "Peer Comparison", href: `/peer-comparison${q}` },
          { label: "Store Identity" },
        ]}
      />
      <PageHeader
        title="Store Identity"
        subtitle="These store characteristics are used to determine the peer cluster and contextualize recommendations."
        question="What kind of retailer location are we analyzing?"
      />
      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-3xl border border-border bg-white p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ssb-blue">Physical / commercial</p>
          <h3 className="mt-1 text-xl font-semibold text-ssb-navy">
            {store.name} – {store.city}, {store.state}
          </h3>
          <dl className="mt-4 space-y-2 text-sm">
            <Row label="Store type" value={id.storeType} />
            <Row label="Trade area" value={id.tradeArea} />
            <Row label="Selling space" value={`${id.sellingSpaceSqFt.toLocaleString("en-US")} sq ft`} />
            <Row label="Mattress selling space" value={`${id.mattressSellingSpaceSqFt.toLocaleString("en-US")} sq ft`} />
            <Row label="Display slots" value={`${id.displaySlots}`} />
            <Row label="Price position" value={id.pricePosition} />
            <Row label="Brands" value={id.brands.join(", ")} />
            <Row label="SSB models" value={`${id.ssbModels}`} />
          </dl>
        </section>
        <section className="rounded-3xl border border-border bg-white p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ssb-blue">People</p>
          <h3 className="mt-1 text-xl font-semibold text-ssb-navy">Sales associates: {id.associates.length}</h3>
          <ul className="mt-4 space-y-3">
            {id.associates.map((person) => (
              <li key={person.name} className="rounded-2xl bg-slate-50 px-3 py-2">
                <p className="font-medium text-ssb-navy">{person.name}</p>
                <p className="text-xs text-muted-foreground">
                  {person.tenureYears.toFixed(1)} years tenure · Training {person.trainingComplete ? "complete" : "in progress"}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">
            Individual performance scores are withheld. Tenure and training are shown only as context.
          </p>
        </section>
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        <EvidenceChip source={{ label: "Retailer Master", kind: "method" }} />
        <EvidenceChip source={{ label: "Store Survey", kind: "store" }} />
        <EvidenceChip source={{ label: "Product Master", kind: "store" }} />
      </div>
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border/80 py-1.5">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="max-w-[60%] text-right font-medium text-ssb-navy">{value}</dd>
    </div>
  );
}
