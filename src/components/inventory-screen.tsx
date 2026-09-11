import { ActionQuad } from "@/components/action-quad";
import { IconTile } from "@/components/icon-tile";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Clock,
  Package,
  RefreshCw,
  Truck,
} from "lucide-react";
import type { InventoryMetric, ProblemSku, Recommendation } from "@/lib/types";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const ICONS: Record<string, { node: ReactNode; tone: "blue" | "red" | "green" | "sky" | "violet" | "amber" }> = {
  instock: { node: <Package className="h-5 w-5" />, tone: "blue" },
  stockout: { node: <AlertTriangle className="h-5 w-5" />, tone: "red" },
  fill: { node: <CheckCircle2 className="h-5 w-5" />, tone: "green" },
  lead: { node: <Truck className="h-5 w-5" />, tone: "sky" },
  turns: { node: <RefreshCw className="h-5 w-5" />, tone: "violet" },
  slow: { node: <Clock className="h-5 w-5" />, tone: "amber" },
};

const BLURB: Record<string, string> = {
  instock: "Share of SKUs available for purchase.",
  stockout: "Share of SKUs out of stock.",
  fill: "Share of customer orders filled in full.",
  lead: "Average days from order to customer delivery.",
  turns: "How many times inventory is sold and replaced.",
  slow: "Share of inventory with low sales velocity.",
};

function formatPeer(metric: InventoryMetric, n: number) {
  if (metric.id === "lead") return `${n} days`;
  if (metric.id === "turns") return `${n}x`;
  return `${n}%`;
}

export function InventoryScreen({
  metrics,
  skus,
  rec,
}: {
  metrics: InventoryMetric[];
  skus: ProblemSku[];
  rec: Recommendation;
}) {
  return (
    // Recommendations stay on the LEFT per the reviewed layout override.
    <div className="grid min-h-0 flex-1 grid-cols-[0.98fr_1.02fr] gap-3">
      <ActionQuad
        accent
        recommendation={rec}
        intro="Improve in-stock levels and delivery reliability for key models to capture more demand."
      />
      <div className="flex min-h-0 flex-col gap-3">
        <section className="shrink-0 rounded-[18px] border border-rose-200 bg-white p-4">
          <div className="mb-3 flex items-start gap-3">
            <IconTile tone="red" size="md">
              <AlertTriangle className="h-5 w-5" />
            </IconTile>
            <div>
              <p className="text-[12.5px] font-semibold text-[#b91c1c]">Biggest Issue</p>
              <h3 className="text-[17px] font-semibold text-ssb-navy">High-Demand SKU Availability</h3>
              <p className="mt-0.5 text-[12.5px] leading-snug text-slate-600">
                A small number of high-demand models drive a disproportionate share of lost availability, limiting
                your ability to capture ready-to-buy customers.
              </p>
            </div>
          </div>
          <table className="w-full border-collapse text-left text-[13px]">
            <thead>
              <tr className="bg-[#f4f8fd] text-[12px] font-semibold text-slate-600">
                <th className="border border-slate-200 px-3 py-2">SKU / Model</th>
                <th className="border border-slate-200 px-3 py-2">Stock-Outs (Last 90 Days)</th>
                <th className="border border-slate-200 px-3 py-2">Share of Lost Sales</th>
              </tr>
            </thead>
            <tbody>
              {skus.map((sku) => (
                <tr key={sku.name}>
                  <td className="border border-slate-200 px-3 py-2 font-semibold text-ssb-navy">{sku.name}</td>
                  <td className="border border-slate-200 px-3 py-2 tabular-nums text-slate-600">{sku.stockOuts}</td>
                  <td className="border border-slate-200 px-3 py-2 tabular-nums text-slate-600">
                    {sku.lostSalesShare}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="flex min-h-0 flex-1 flex-col rounded-[18px] border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2.5">
            <IconTile tone="blue" size="sm">
              <BarChart3 className="h-5 w-5" />
            </IconTile>
            <div>
              <h3 className="text-[17px] font-semibold text-ssb-navy">Operational Benchmark</h3>
              <p className="text-[12.5px] text-slate-500">
                See how your store performs on key inventory and fulfillment metrics.
              </p>
            </div>
          </div>
          <div className="mt-1.5 grid grid-cols-[1fr_86px_86px_86px] gap-x-2 px-3 text-[12px] font-medium text-slate-500">
            <span />
            <span className="text-right">Your Store</span>
            <span className="text-right">Cluster Avg.</span>
            <span className="text-right">Top Stores</span>
          </div>
          <ul className="mt-1 flex min-h-0 flex-1 flex-col">
            {metrics.map((m, i) => (
              <li
                key={m.id}
                className={cn(
                  "grid flex-1 grid-cols-[1fr_86px_86px_86px] items-center gap-x-2 rounded-[10px] px-3",
                  i % 2 === 0 ? "bg-[#f4f8fd]" : "bg-white",
                )}
              >
                <div className="flex items-center gap-3">
                  <IconTile tone={ICONS[m.id].tone} size="sm">
                    {ICONS[m.id].node}
                  </IconTile>
                  <div>
                    <p className="text-[14px] font-semibold text-ssb-navy">{m.label}</p>
                    <p className="text-[11.5px] leading-tight text-slate-500">{BLURB[m.id]}</p>
                  </div>
                </div>
                <p className="text-right text-[20px] font-bold tabular-nums text-ssb-navy">{m.storeValue}</p>
                <p className="text-right text-[16px] tabular-nums text-slate-500">{formatPeer(m, m.peerNumeric)}</p>
                <p className="text-right text-[16px] tabular-nums text-slate-500">{formatPeer(m, m.topNumeric)}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
