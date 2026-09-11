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
  { n: 2, tone: "expected" },
  { n: 3, tone: "productive" },
  { n: 4, tone: "below" },
  { n: 5, tone: "expected" },
  { n: 6, tone: "expected" },
  { n: 7, tone: "expected" },
  { n: 8, tone: "expected" },
  { n: 9, tone: "below" },
  { n: 10, tone: "productive" },
  { n: 11, tone: "underproductive" },
  { n: 12, tone: "expected" },
  { n: 13, tone: "productive" },
  { n: 14, tone: "underproductive" },
  { n: 15, tone: "expected" },
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
    <div className="grid min-h-0 flex-1 grid-cols-[1.05fr_0.95fr] gap-4">
      <section className="flex min-h-0 flex-col rounded-[18px] border border-slate-200 bg-white p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="shrink-0 whitespace-nowrap">
            <p className="text-[17px] font-semibold text-ssb-navy">Display Slot Map</p>
            <p className="mt-0.5 text-[12.5px] text-slate-500">15 display slots · Mattress World – Plano, TX</p>
          </div>
          <div className="flex min-w-0 flex-wrap justify-end gap-x-3 gap-y-1 text-[9.5px] whitespace-nowrap">
            {(Object.keys(TONE) as FloorTone[]).map((tone) => (
              <span key={tone} className="flex items-center gap-1">
                <i className="h-2 w-2 rounded-full" style={{ background: TONE[tone].mattress }} />
                <span className="font-semibold text-ssb-navy">{TONE[tone].label}</span>
                <span className="text-slate-400">{TONE[tone].hint}</span>
              </span>
            ))}
          </div>
        </div>

        <FloorPlan selected={selected} onSelect={setSelected} />
      </section>

      <div className="flex min-h-0 flex-col gap-4">
        <section className="shrink-0 rounded-[18px] border border-slate-200 bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <IconTile tone="blue" size="md">
                <BedDouble className="h-5 w-5" />
              </IconTile>
              <div>
                <p className="text-[17px] font-semibold leading-tight text-ssb-navy">Display {selected}</p>
                <p className="text-[15px] leading-tight text-slate-600">
                  {selected === 14 ? "Beautyrest Premium Hybrid" : `Floor model ${selected}`}
                </p>
              </div>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#fee2e2] px-3 py-1.5 text-[12.5px] font-semibold text-[#b91c1c]">
              <span className="h-2 w-2 rounded-full bg-[#dc2626]" />
              {TONE[bed.tone].label}
            </span>
          </div>
          <div className="mt-3 grid grid-cols-6">
            <Metric label="Monthly Revenue" value="$9.8K" first />
            <Metric label="Top Peer Median" value="$14.1K" />
            <Metric label="Revenue Percentile" value="31st" />
            <Metric label="Days on Display" value="212" />
            <Metric label="Trial Rate" value="Low" />
            <Metric label="Customer Need" value="Premium Comfort" />
          </div>
          <div className="mt-3 flex items-start gap-2.5 rounded-[14px] bg-[#fef2f2] px-4 py-2.5 text-[13px] leading-snug text-[#b91c1c]">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              <span className="font-semibold">This display is underperforming</span> while Cooling demand is
              under-covered in your assortment.
            </span>
          </div>
        </section>
        <ActionQuad
          accent
          recommendation={rec}
          intro="Leading mattress retailers use showroom space to clearly differentiate sleep benefits and encourage guided in-store trial."
          sourceLabel="Supporting evidence:"
          columns={4}
        />
      </div>
    </div>
  );
}

function FloorPlan({ selected, onSelect }: { selected: number; onSelect: (n: number) => void }) {
  return (
    <div className="relative mt-4 min-h-0 flex-1">
      <div className="absolute inset-0 rounded-[10px] border-[7px] border-[#8f9bab] bg-[#fbfcfd]">
        {/* left wall: customer service desk */}
        <div className="absolute top-[22%] bottom-[24%] left-0 flex w-[74px] flex-col items-center justify-center gap-2 px-1.5">
          <div className="h-[46%] w-[26px] rounded-[3px] bg-[#d8cfc2]" />
          <div className="h-[15px] w-[22px] rounded-[5px] bg-[#5b6675]" />
          <p className="mt-1 text-center text-[8.5px] font-semibold uppercase tracking-wide text-slate-500">
            Customer
            <br />
            Service
          </p>
        </div>

        {/* right wall: shelving unit */}
        <div className="absolute top-[26%] right-[10px] flex h-[34%] w-[30px] flex-col justify-evenly rounded-[4px] border border-[#c3ccd7] bg-[#e8edf3] px-[3px]">
          <i className="h-[2px] w-full bg-[#c3ccd7]" />
          <i className="h-[2px] w-full bg-[#c3ccd7]" />
          <i className="h-[2px] w-full bg-[#c3ccd7]" />
        </div>

        {/* greenery along the walls */}
        <Plant className="absolute top-[4%] left-[12px] h-8 w-8" />
        <Plant className="absolute top-[8%] right-[16px] h-9 w-9" />
        <Plant className="absolute top-[45%] right-[52px] h-8 w-8" />
        <Plant className="absolute bottom-[8%] right-[18px] h-9 w-9" />
        <Plant className="absolute bottom-[6%] left-[14px] h-8 w-8" />

        {/* bed grid */}
        <div className="absolute inset-y-[7%] right-[54px] left-[84px] grid grid-cols-5 grid-rows-3 gap-x-3 gap-y-2">
          {BEDS.map((b) => (
            <BedCard key={b.n} n={b.n} tone={b.tone} active={selected === b.n} onSelect={onSelect} />
          ))}
        </div>

        {/* entrance doorway cut into the bottom wall */}
        <div className="absolute bottom-[-7px] left-1/2 h-[7px] w-[92px] -translate-x-1/2 bg-[#fbfcfd]" />
      </div>
      <div className="absolute bottom-[-4px] left-1/2 flex -translate-x-1/2 flex-col items-center">
        <span className="text-[11px] leading-none text-slate-400">↑</span>
        <span className="text-[9.5px] font-semibold uppercase tracking-wide text-slate-500">Entrance</span>
      </div>
    </div>
  );
}

function BedCard({
  n,
  tone,
  active,
  onSelect,
}: {
  n: number;
  tone: FloorTone;
  active: boolean;
  onSelect: (n: number) => void;
}) {
  const t = TONE[tone];
  return (
    <button
      type="button"
      onClick={() => onSelect(n)}
      className={cn(
        "relative flex flex-col items-center justify-center gap-1 rounded-[7px] bg-[#f1f5f9] px-1 py-1.5",
        active && "bg-white ring-2 ring-ssb-blue",
      )}
    >
      {/* mattress seen from above: pillow strip along the top edge */}
      <span
        className="relative block h-[62%] w-[74%] min-h-[20px] rounded-[3px]"
        style={{ background: t.mattress }}
      >
        <span
          className="absolute top-[3px] right-[4px] left-[4px] h-[26%] min-h-[4px] rounded-[2px]"
          style={{ background: t.pillow }}
        />
      </span>
      <span className="text-[11px] font-semibold leading-none text-ssb-navy">{n}</span>
      {active ? (
        <span className="absolute -bottom-[11px] left-1/2 -translate-x-1/2 rounded-[4px] bg-ssb-blue px-2 py-[2px] text-[9px] font-bold leading-none tracking-wide text-white">
          YOU
        </span>
      ) : null}
    </button>
  );
}

function Plant({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 44" className={className} aria-hidden>
      <circle cx="20" cy="14" r="8.5" fill="#2f7d54" />
      <circle cx="12" cy="19" r="7" fill="#3f9c6b" />
      <circle cx="28" cy="19" r="7" fill="#3f9c6b" />
      <circle cx="20" cy="23" r="7.5" fill="#256b46" />
      <path d="M14 29h12l-1.8 10h-8.4z" fill="#c3ccd7" />
    </svg>
  );
}

function Metric({ label, value, first = false }: { label: string; value: string; first?: boolean }) {
  return (
    <div className={cn("px-2.5", !first && "border-l border-slate-200")}>
      <p className="text-[10.5px] leading-tight text-slate-500">{label}</p>
      <p className="mt-1 text-[13.5px] font-bold leading-tight text-ssb-navy">{value}</p>
    </div>
  );
}
