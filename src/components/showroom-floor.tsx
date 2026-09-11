"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ActionQuad } from "@/components/action-quad";
import { IconTile } from "@/components/icon-tile";
import { recommendation } from "@/lib/selectors";
import { AlertTriangle, BedDouble } from "lucide-react";

type FloorTone = "productive" | "expected" | "below" | "underproductive";

const BEDS: { n: number; tone: FloorTone }[] = [
  { n: 1, tone: "productive" },
  { n: 2, tone: "productive" },
  { n: 3, tone: "expected" },
  { n: 4, tone: "below" },
  { n: 5, tone: "productive" },
  { n: 6, tone: "below" },
  { n: 7, tone: "productive" },
  { n: 8, tone: "productive" },
  { n: 9, tone: "productive" },
  { n: 10, tone: "productive" },
  { n: 11, tone: "below" },
  { n: 12, tone: "productive" },
  { n: 13, tone: "productive" },
  { n: 14, tone: "underproductive" },
  { n: 15, tone: "productive" },
];

const TONE: Record<FloorTone, { mattress: string; pillow: string; label: string; hint: string }> = {
  productive: { mattress: "#34d399", pillow: "#a7f3d0", label: "Productive", hint: "≥ 120% of top peer" },
  expected: { mattress: "#94a3b8", pillow: "#cbd5e1", label: "Expected", hint: "80–120% of top peer" },
  below: { mattress: "#fbbf24", pillow: "#fde68a", label: "Below Benchmark", hint: "50–80% of top peer" },
  underproductive: { mattress: "#f43f5e", pillow: "#fda4af", label: "Underproductive", hint: "< 50% of top peer" },
};

export function ShowroomFloor() {
  const [selected, setSelected] = useState(14);
  const rec = recommendation("displayAssortment");
  const bed = BEDS.find((b) => b.n === selected)!;

  return (
    <div className="grid min-h-0 flex-1 grid-cols-[1.12fr_0.88fr] gap-3">
      <section className="flex min-h-0 flex-col rounded-[18px] border border-slate-200 bg-white p-3.5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[14px] font-semibold text-ssb-navy">Display Slot Map</p>
            <p className="text-[11px] text-slate-400">15 display slots · Mattress World – Plano, TX</p>
          </div>
          <div className="flex flex-wrap justify-end gap-x-3 gap-y-1 text-[10px] text-slate-500">
            {(Object.keys(TONE) as FloorTone[]).map((tone) => (
              <span key={tone} className="flex items-center gap-1.5">
                <i className="h-2 w-2 rounded-[2px]" style={{ background: TONE[tone].mattress }} />
                <span className="font-medium text-ssb-navy">{TONE[tone].label}</span>
                <span className="text-slate-400">{TONE[tone].hint}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="relative mt-2 min-h-0 flex-1 rounded-[14px] border border-slate-200 bg-[#f4f7fa]">
          <div className="absolute inset-2 grid grid-cols-[70px_minmax(0,1fr)_78px] gap-2">
            <div className="flex flex-col items-center justify-center rounded-lg border border-slate-200 bg-white">
              <div className="mb-2 h-8 w-14 rounded-sm bg-slate-200" />
              <div className="h-3 w-10 rounded-sm bg-slate-300" />
              <p className="mt-3 text-center text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                Customer
                <br />
                Service
              </p>
            </div>
            <div className="grid grid-cols-5 content-center gap-x-3 gap-y-4 px-2">
              {BEDS.map((b) => (
                <button
                  key={b.n}
                  type="button"
                  onClick={() => setSelected(b.n)}
                  className="relative flex flex-col items-center"
                >
                  <BedSlot tone={b.tone} active={selected === b.n} />
                  <span className="mt-1 text-[11px] font-semibold text-ssb-navy">{b.n}</span>
                  {b.n === 14 ? (
                    <span className="absolute -bottom-1 rounded-full bg-ssb-blue px-1.5 text-[8px] font-bold tracking-wide text-white">
                      YOU
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
            <div className="flex flex-col justify-between py-3">
              <Plant />
              <div className="space-y-1.5">
                <div className="h-10 rounded-md bg-slate-300/80" />
                <div className="h-10 rounded-md bg-slate-300/70" />
              </div>
              <Plant />
            </div>
          </div>
          <div className="absolute bottom-1 left-1/2 flex -translate-x-1/2 flex-col items-center">
            <span className="text-[10px] text-slate-400">↑</span>
            <span className="rounded-md border border-slate-200 bg-white px-3 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-slate-400">
              Entrance
            </span>
          </div>
        </div>
      </section>

      <div className="flex min-h-0 flex-col gap-2.5">
        <section className="rounded-[18px] border border-slate-200 bg-white p-3.5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <IconTile tone="blue" size="sm">
                <BedDouble className="h-3.5 w-3.5" />
              </IconTile>
              <div>
                <p className="text-[11px] font-semibold text-slate-400">Display {selected}</p>
                <h3 className="text-[16px] font-semibold leading-tight text-ssb-navy">
                  {selected === 14 ? "Beautyrest Premium Hybrid" : `Floor model ${selected}`}
                </h3>
              </div>
            </div>
            <span className="rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-ssb-red">
              {TONE[bed.tone].label === "Underproductive" ? "Underproductive" : TONE[bed.tone].label}
            </span>
          </div>
          <div className="mt-3 grid grid-cols-6 gap-2 text-center">
            <Metric label="Monthly Revenue" value="$9.8K" />
            <Metric label="Top Peer Median" value="$14.1K" />
            <Metric label="Revenue Percentile" value="31st" />
            <Metric label="Days on Display" value="212" />
            <Metric label="Trial Rate" value="Low" />
            <Metric label="Customer Need" value="Premium Comfort" />
          </div>
          <div className="mt-2.5 flex items-start gap-2 rounded-xl bg-rose-50 px-3 py-2 text-[12px] text-ssb-red">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>
              <span className="font-semibold">This display is underperforming</span> while Cooling demand is
              under-covered in your assortment.
            </span>
          </div>
        </section>
        <ActionQuad
          recommendation={rec}
          intro="Leading mattress retailers use showroom space to clearly differentiate sleep benefits and encourage guided in-store trial."
          sourceLabel="Supporting evidence:"
          columns={4}
        />
      </div>
    </div>
  );
}

function BedSlot({ tone, active }: { tone: FloorTone; active: boolean }) {
  const t = TONE[tone];
  return (
    <span
      className={cn(
        "relative block h-[52px] w-[38px] rounded-[4px] shadow-sm",
        active && "ring-2 ring-ssb-blue ring-offset-2",
      )}
      style={{ background: t.mattress }}
    >
      <span className="absolute top-0.5 right-1 left-1 h-2 rounded-sm" style={{ background: t.pillow }} />
    </span>
  );
}

function Plant() {
  return (
    <svg viewBox="0 0 40 40" className="mx-auto h-10 w-10 text-emerald-400" aria-hidden>
      <ellipse cx="20" cy="32" rx="10" ry="4" fill="#cbd5e1" />
      <path d="M20 30 C12 18 18 8 20 6 C22 8 28 18 20 30Z" fill="currentColor" />
      <path d="M20 28 C24 20 32 18 34 12" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[9px] leading-tight text-slate-400">{label}</p>
      <p className="text-[12px] font-semibold text-ssb-navy">{value}</p>
    </div>
  );
}
