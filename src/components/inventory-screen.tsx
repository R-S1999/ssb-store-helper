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

const ICONS: Record<string, ReactNode> = {
  instock: <Package className="h-4 w-4" />,
  stockout: <AlertTriangle className="h-4 w-4" />,
  fill: <CheckCircle2 className="h-4 w-4" />,
  lead: <Truck className="h-4 w-4" />,
  turns: <RefreshCw className="h-4 w-4" />,
  slow: <Clock className="h-4 w-4" />,
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
    <div className="grid min-h-0 flex-1 grid-cols-[1.02fr_0.98fr] gap-3">
      <ActionQuad
        recommendation={rec}
        intro="Improve in-stock levels and delivery reliability for key models to capture more demand."
      />
      <div className="flex min-h-0 flex-col gap-2.5">
        <section className="rounded-[18px] border border-rose-200 bg-white p-3.5">
          <div className="mb-2 flex items-start gap-2">
            <IconTile tone="red" size="sm">
              <AlertTriangle className="h-3.5 w-3.5" />
            </IconTile>
            <div>
              <p className="text-[11px] font-semibold text-ssb-red">Biggest Issue</p>
              <h3 className="text-[15px] font-semibold text-ssb-navy">High-Demand SKU Availability</h3>
              <p className="text-[11px] leading-snug text-slate-500">
                A small number of high-demand models drive a disproportionate share of lost availability, limiting
                your ability to capture ready-to-buy customers.
              </p>
            </div>
          </div>
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] text-slate-400">
                <th className="py-1.5 font-medium">SKU / Model</th>
                <th className="py-1.5 font-medium">Stock-Outs (Last 90 Days)</th>
                <th className="py-1.5 font-medium">Share of Lost Sales</th>
              </tr>
            </thead>
            <tbody>
              {skus.map((sku) => (
                <tr key={sku.name} className="border-b border-slate-50">
                  <td className="py-1.5 font-medium text-ssb-navy">{sku.name}</td>
                  <td className="py-1.5 tabular-nums text-slate-600">{sku.stockOuts}</td>
                  <td className="py-1.5 tabular-nums text-slate-600">{sku.lostSalesShare}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="flex min-h-0 flex-1 flex-col rounded-[18px] border border-slate-200 bg-white p-3.5">
          <p className="flex items-center gap-2 text-[14px] font-semibold text-ssb-navy">
            <IconTile tone="blue" size="sm">
              <BarChart3 className="h-3.5 w-3.5" />
            </IconTile>
            Operational Benchmark
          </p>
          <p className="mb-1 text-[11px] text-slate-500">
            See how your store performs on key inventory and fulfillment metrics.
          </p>
          <div className="grid grid-cols-[1fr_70px_70px_70px] gap-x-2 text-[10px] text-slate-400">
            <span />
            <span className="text-right">Your Store</span>
            <span className="text-right">Cluster Avg.</span>
            <span className="text-right">Top Stores</span>
          </div>
          <ul className="mt-1 min-h-0 flex-1 space-y-1">
            {metrics.map((m) => (
              <li
                key={m.id}
                className="grid grid-cols-[1fr_70px_70px_70px] items-center gap-x-2 rounded-xl bg-[#f6f9fc] px-3 py-1.5"
              >
                <div className="flex items-center gap-2">
                  <span className={m.id === "stockout" ? "text-ssb-red" : "text-ssb-blue"}>{ICONS[m.id]}</span>
                  <div>
                    <p className="text-[12px] font-semibold text-ssb-navy">{m.label}</p>
                    <p className="text-[10px] leading-tight text-slate-400">{BLURB[m.id]}</p>
                  </div>
                </div>
                <p className="text-right text-[14px] font-semibold tabular-nums text-ssb-navy">{m.storeValue}</p>
                <p className="text-right text-[12px] tabular-nums text-slate-400">{formatPeer(m, m.peerNumeric)}</p>
                <p className="text-right text-[12px] tabular-nums text-slate-400">{formatPeer(m, m.topNumeric)}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
