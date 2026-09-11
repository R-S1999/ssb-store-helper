"use client";

import { usePathname, useRouter } from "next/navigation";
import { STORES } from "@/lib/data";
import type { StoreRecord } from "@/lib/types";
import { Search } from "lucide-react";

export function StoreSelector({ current }: { current: StoreRecord }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <label className="flex h-9 w-[340px] items-center gap-2 rounded-full border border-slate-200 bg-[#f7fafc] px-3.5 text-sm">
      <Search className="h-4 w-4 shrink-0 text-slate-400" />
      <select
        className="w-full appearance-none bg-transparent text-[13px] text-slate-500 outline-none"
        value={current.id}
        onChange={(e) => router.push(`${pathname}?store=${e.target.value}`)}
        aria-label="Search stores"
      >
        <option disabled value="">
          Search stores, regions, or insights...
        </option>
        {STORES.map((store) => (
          <option key={store.id} value={store.id}>
            {store.revealName
              ? `${store.name} – ${store.city}, ${store.state}`
              : `${store.alias} · ${store.city}`}
          </option>
        ))}
      </select>
    </label>
  );
}
