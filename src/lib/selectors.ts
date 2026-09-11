import {
  ATTRIBUTE_META,
  CLUSTER_BENCHMARKS,
  DEFAULT_STORE_ID,
  PLANO_CAPABILITIES,
  PLANO_INVENTORY,
  PLANO_MARKET,
  PLANO_NEEDS,
  PLANO_PRICING,
  PLANO_SKUS,
  PLANO_SLOTS,
  RECOMMENDATIONS,
  STORES,
} from "@/lib/data";
import type {
  AttributeKey,
  Capability,
  CustomerNeed,
  DisplaySlot,
  InventoryMetric,
  MarketProfile,
  PricingMetric,
  StatusTone,
  StoreRecord,
} from "@/lib/types";

export function getStore(id?: string | null): StoreRecord {
  return STORES.find((s) => s.id === id) ?? STORES.find((s) => s.id === DEFAULT_STORE_ID)!;
}

export function rankedStores() {
  return [...STORES].sort((a, b) => b.overallScore - a.overallScore);
}

export function clusterBenchmarks() {
  return CLUSTER_BENCHMARKS;
}

export function storeRank(storeId: string) {
  const ranked = rankedStores();
  const index = ranked.findIndex((s) => s.id === storeId);
  return { rank: index + 1, of: ranked.length, percentile: Math.round(((index + 1) / ranked.length) * 100) };
}

export function displayName(store: StoreRecord, asPeer = false) {
  if (store.revealName && !asPeer) return `${store.name} – ${store.city}, ${store.state}`;
  if (store.revealName) return `${store.name} – ${store.city}, ${store.state}`;
  return store.alias;
}

export function attributeStatus(store: number, cluster: number, top: number): StatusTone {
  if (store >= top - 4) return "strong";
  if (store >= cluster) return "above";
  if (store >= cluster - 6) return "opportunity";
  return "attention";
}

export function statusLabel(tone: StatusTone) {
  switch (tone) {
    case "strong":
      return "Strong";
    case "above":
      return "Above Average";
    case "opportunity":
      return "Opportunity";
    case "attention":
      return "Needs Attention";
  }
}

function scale(value: number, from: number, to: number) {
  const factor = to / Math.max(from, 1);
  return Math.min(99, Math.max(20, Math.round(value * factor)));
}

export function capabilitiesFor(store: StoreRecord): Capability[] {
  const factorStore = store.attributes.salesAssociate;
  return PLANO_CAPABILITIES.map((cap) => ({
    ...cap,
    store: store.id === "plano" ? cap.store : scale(cap.store, 64, factorStore),
  }));
}

export function needsFor(store: StoreRecord): CustomerNeed[] {
  const delta = store.attributes.customerAlignment - 82;
  return PLANO_NEEDS.map((need) => {
    const coverage = Math.min(98, Math.max(35, need.coverage + delta));
    let status = need.status;
    if (coverage >= 80) status = "Covered";
    else if (coverage >= 68) status = "Watch";
    else status = "Gap";
    return { ...need, coverage, status };
  });
}

export function slotsFor(store: StoreRecord): DisplaySlot[] {
  const factor = store.attributes.displayAssortment / 68;
  return PLANO_SLOTS.map((slot) => ({
    ...slot,
    monthlyRevenue: Math.round(slot.monthlyRevenue * factor),
  }));
}

export function pricingFor(store: StoreRecord): PricingMetric[] {
  const factor = store.attributes.pricingPromotion / 76;
  return PLANO_PRICING.map((m) => ({
    ...m,
    storeNumeric: Math.round(m.storeNumeric * factor * 10) / 10,
    storeValue:
      m.format === "currency"
        ? `$${Math.round(m.storeNumeric * factor).toLocaleString("en-US")}`
        : `${Math.round(m.storeNumeric * factor)}%`,
  }));
}

export function inventoryFor(store: StoreRecord): InventoryMetric[] {
  const better = store.attributes.inventoryFulfillment - 61;
  return PLANO_INVENTORY.map((m) => {
    const invert = m.id === "stockout" || m.id === "lead" || m.id === "slow";
    const numeric = invert
      ? Math.max(1, Math.round((m.storeNumeric - better * 0.15) * 10) / 10)
      : Math.min(99, Math.round((m.storeNumeric + better * 0.2) * 10) / 10);
    let storeValue = `${numeric}${m.id === "turns" ? "x" : m.id === "lead" ? " days" : "%"}`;
    if (m.id === "lead") storeValue = `${numeric} days`;
    return { ...m, storeNumeric: numeric, storeValue };
  });
}

export function marketFor(store: StoreRecord): MarketProfile {
  const hh = store.identity.householdBase;
  const annual = Math.round((hh * 0.11 * 1840) / 1000) * 1000;
  const share = store.id === "plano" ? 0.087 : Math.min(0.16, 0.05 + store.overallScore / 1000);
  return {
    ...PLANO_MARKET,
    households: hh,
    medianIncome: store.identity.medianIncome,
    annualOpportunity: store.id === "plano" ? PLANO_MARKET.annualOpportunity : annual,
    currentShare: share,
    remainingOpportunity: Math.round((store.id === "plano" ? PLANO_MARKET.annualOpportunity : annual) * (1 - share)),
  };
}

export function insightStrip(store: StoreRecord) {
  const bench = clusterBenchmarks();
  const ahead = (Object.keys(ATTRIBUTE_META) as AttributeKey[])
    .filter((k) => store.attributes[k] >= bench.attributes[k].cluster)
    .sort((a, b) => store.attributes[b] - bench.attributes[b].cluster - (store.attributes[a] - bench.attributes[a].cluster));
  const behind = (Object.keys(ATTRIBUTE_META) as AttributeKey[])
    .filter((k) => store.attributes[k] < bench.attributes[k].cluster)
    .sort((a, b) => store.attributes[a] - store.attributes[b]);
  const aheadLabel = ATTRIBUTE_META[ahead[0]]?.label.replace(" Effectiveness", "");
  const behindLabel = behind
    .slice(0, 2)
    .map((k) => ATTRIBUTE_META[k].label)
    .join(" and ");
  if (ahead.length && behind.length) {
    return `You outperform peers on ${aheadLabel} but trail leading stores on ${behindLabel}.`;
  }
  if (behind.length) return `Largest gaps vs. the cluster are ${behindLabel}.`;
  return `You outperform the cluster across the five store-effectiveness attributes.`;
}

export function attributeInsight(key: AttributeKey, store: StoreRecord) {
  const map: Record<AttributeKey, string> = {
    salesAssociate: "Top stores outperform on needs discovery and objection handling.",
    customerAlignment: "Assortment aligns with dominant customer needs.",
    displayAssortment: "Underproductive display positions and underrepresented needs.",
    pricingPromotion: "Good promotional execution; premium step-up trails top stores.",
    inventoryFulfillment: "Availability and delivery limit demand capture.",
  };
  if (store.id === "plano") return map[key];
  const bench = clusterBenchmarks().attributes[key];
  const tone = attributeStatus(store.attributes[key], bench.cluster, bench.top);
  if (tone === "attention") return `Largest gap versus lookalike stores on ${ATTRIBUTE_META[key].label.toLowerCase()}.`;
  if (tone === "opportunity") return `Trails top stores; a focused change can close the gap.`;
  if (tone === "above") return `Ahead of the cluster average; still room versus top stores.`;
  return `Among the stronger stores in this cluster.`;
}

export function problemSkus() {
  return PLANO_SKUS;
}

export function recommendation(key: AttributeKey | "market") {
  return RECOMMENDATIONS[key];
}

export function storeHref(pathname: string, storeId: string) {
  const params = new URLSearchParams({ store: storeId });
  return `${pathname}?${params.toString()}`;
}
