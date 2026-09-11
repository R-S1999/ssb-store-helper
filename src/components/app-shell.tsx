import Link from "next/link";
import { MethodologyDrawer } from "@/components/methodology-drawer";
import { StoreSelector } from "@/components/store-selector";
import { cn } from "@/lib/utils";
import type { StoreRecord } from "@/lib/types";

const NAV = [
  { n: "01", label: "Peer Comparison", href: "/peer-comparison" },
  { n: "02", label: "Store Performance", href: "/store-performance" },
  { n: "03", label: "Store & Market Opportunity", href: "/market-opportunity" },
];

export function AppShell({
  store,
  pathname,
  children,
}: {
  store: StoreRecord;
  pathname: string;
  children: React.ReactNode;
}) {
  const q = `?store=${store.id}`;
  return (
    <div className="min-h-full bg-background text-foreground">
      <header className="border-b border-border bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ssb-blue">
              Serta Simmons Bedding
            </p>
            <h1 className="text-base font-semibold text-ssb-navy">
              Retailer Relationship Improvement Engine
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StoreSelector current={store} />
            <MethodologyDrawer />
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 px-4 pb-2">
          {NAV.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/peer-comparison" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={`${item.href}${q}`}
                className={cn(
                  "whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition",
                  active
                    ? "bg-ssb-blue text-white"
                    : "text-ssb-navy hover:bg-ssb-blue-soft",
                )}
              >
                <span className="mr-1.5 text-[10px] opacity-70">{item.n}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      <footer className="mx-auto max-w-6xl px-4 pb-8 text-xs text-muted-foreground">
        PoC for independent retailer performance partnership. Peer names are masked unless the retailer is the selected store.
      </footer>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  question,
}: {
  title: string;
  subtitle: string;
  question: string;
}) {
  return (
    <div className="mb-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ssb-blue">{question}</p>
      <h2 className="mt-1 text-3xl font-semibold tracking-tight text-ssb-navy">{title}</h2>
      <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}

export function ColorLegend() {
  return (
    <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">
      <span className="flex items-center gap-1.5"><i className="inline-block h-2.5 w-2.5 rounded-full bg-ssb-blue" /> Your store</span>
      <span className="flex items-center gap-1.5"><i className="inline-block h-2.5 w-2.5 rounded-full bg-ssb-grey" /> Cluster average</span>
      <span className="flex items-center gap-1.5"><i className="inline-block h-2.5 w-2.5 rounded-full bg-ssb-green" /> Top stores</span>
      <span className="flex items-center gap-1.5"><i className="inline-block h-2.5 w-2.5 rounded-full bg-ssb-amber" /> Opportunity</span>
      <span className="flex items-center gap-1.5"><i className="inline-block h-2.5 w-2.5 rounded-full bg-ssb-red" /> Needs attention</span>
    </div>
  );
}
