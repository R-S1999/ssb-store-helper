"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { MethodologyDrawer } from "@/components/methodology-drawer";
import { StoreSelector } from "@/components/store-selector";
import { cn } from "@/lib/utils";
import type { StoreRecord } from "@/lib/types";

const NAV = [
  { n: "01", label: "Peer Comparison", href: "/peer-comparison", id: "peer" },
  { n: "02", label: "Opportunity Areas", href: "/store-performance", id: "opp" },
  { n: "03", label: "Action Plan", href: "/market-opportunity", id: "plan" },
];

function activeId(pathname: string) {
  if (pathname === "/store-identity") return "profile";
  if (pathname === "/peer-comparison") return "peer";
  if (pathname.startsWith("/store-performance")) return "opp";
  if (pathname === "/market-opportunity") return "plan";
  return "";
}

export function AppShell({
  store,
  pathname,
  children,
  fill = false,
}: {
  store: StoreRecord;
  pathname: string;
  children: React.ReactNode;
  fill?: boolean;
}) {
  const q = `?store=${store.id}`;
  const current = activeId(pathname);
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#f3f7fb] text-foreground" suppressHydrationWarning>
      <header className="shrink-0 border-b border-slate-200/80 bg-white">
        <div className="mx-auto flex h-[56px] max-w-[1440px] items-center justify-between gap-4 px-6">
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold leading-tight text-ssb-navy">
              Retailer Relationship Improvement Engine
            </p>
            <p className="text-[11px] text-slate-500">Serta Simmons Retailers PoC</p>
          </div>
          <div className="flex items-center gap-2">
            <StoreSelector current={store} />
            <MethodologyDrawer
              trigger={
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-[15px] font-medium text-slate-500 hover:bg-slate-50"
                  aria-label="Help and methodology"
                >
                  ?
                </button>
              }
            />
            <button type="button" className="ml-1 flex items-center gap-2 rounded-full py-1 pl-1 pr-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ssb-blue text-[11px] font-semibold text-white">
                JD
              </span>
              <span className="hidden text-sm font-medium text-ssb-navy sm:inline">Jamie Davis</span>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>
          </div>
        </div>
      </header>
      <div className="mx-auto flex min-h-0 w-full max-w-[1440px] flex-1 flex-col px-6 pt-2.5 pb-3">
        <nav className="mb-1.5 flex shrink-0 flex-wrap items-center gap-x-1 text-[13px]">
          {NAV.map((item, i) => (
            <span key={item.href} className="flex items-center gap-1">
              {i > 0 ? <span className="px-1 text-slate-300">›</span> : null}
              <Link
                href={`${item.href}${q}`}
                className={cn("font-medium", current === item.id ? "text-ssb-blue" : "text-slate-400 hover:text-ssb-navy")}
              >
                {item.n}. {item.label}
              </Link>
            </span>
          ))}
          {pathname === "/store-identity" ? (
            <span className="flex items-center gap-1">
              <span className="px-1 text-slate-300">›</span>
              <span className="font-medium text-ssb-blue">08. Store Profile</span>
            </span>
          ) : null}
        </nav>
        <main className={cn("min-h-0 flex-1", fill ? "overflow-hidden" : "overflow-y-auto")}>{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
  question?: string;
}) {
  return (
    <div className="mb-2 shrink-0">
      <h2 className="text-[26px] font-semibold leading-tight tracking-tight text-ssb-navy">{title}</h2>
      <p className="mt-0.5 text-[13px] text-slate-500">{subtitle}</p>
    </div>
  );
}
