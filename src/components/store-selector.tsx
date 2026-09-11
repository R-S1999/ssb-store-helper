"use client";

import { usePathname, useRouter } from "next/navigation";
import { STORES } from "@/lib/data";
import type { StoreRecord } from "@/lib/types";

export function StoreSelector({ current }: { current: StoreRecord }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <label className="flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-sm">
      <span className="hidden text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:inline">
        Store
      </span>
      <select
        className="max-w-[240px] bg-transparent text-sm font-medium text-ssb-navy outline-none"
        value={current.id}
        onChange={(e) => router.push(`${pathname}?store=${e.target.value}`)}
      >
        {STORES.map((store) => (
          <option key={store.id} value={store.id}>
            {store.revealName ? `${store.name} – ${store.city}, ${store.state}` : `${store.alias} · score ${store.overallScore}`}
          </option>
        ))}
      </select>
    </label>
  );
}
