"use client";

import { useState } from "react";
import type { MarketProfile } from "@/lib/types";
import { cn } from "@/lib/utils";
import { IconTile } from "@/components/icon-tile";
import { MapPin } from "lucide-react";

const CX = 288;
const CY = 196;

/** Deterministic jitter so the isochrone reads as a jagged drive-time polygon, not a circle. */
const JITTER = [
  1.0, 0.9, 0.97, 0.86, 1.02, 0.88, 0.95, 0.84, 1.0, 0.91, 0.96, 0.85, 1.03, 0.89, 0.94, 0.83,
  1.01, 0.92, 0.95, 0.87, 0.99, 0.86, 0.98, 0.9, 1.02, 0.88, 0.96, 0.84, 1.0, 0.9, 0.97, 0.87,
];

function isochrone(radiusX: number, radiusY: number) {
  const pts = JITTER.map((j, i) => {
    const a = (i / JITTER.length) * Math.PI * 2 - Math.PI / 2;
    const x = CX + Math.cos(a) * radiusX * j;
    const y = CY + Math.sin(a) * radiusY * j;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return `M${pts.join("L")}Z`;
}

export function TradeAreaMap({ market }: { market: MarketProfile }) {
  const [minutes, setMinutes] = useState<10 | 15 | 20>(15);
  const scale = minutes === 10 ? 0.68 : minutes === 15 ? 1 : 1.34;
  const outer = isochrone(150 * scale, 122 * scale);
  const inner = isochrone(150 * scale * 0.62, 122 * scale * 0.62);

  return (
    <section className="flex h-full min-h-0 flex-col rounded-[18px] border border-slate-200 bg-white p-4">
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <IconTile tone="blue" size="md">
            <MapPin className="h-5 w-5" />
          </IconTile>
          <div>
            <p className="text-[17px] font-semibold text-ssb-navy">Trade Area – {minutes} Minute Drive Time</p>
            <p className="text-[12.5px] text-slate-500">
              Mattress World – Plano, TX · {market.households.toLocaleString("en-US")} HH
            </p>
          </div>
        </div>
        <div className="flex rounded-full bg-slate-100 p-1 text-[13px]">
          {([10, 15, 20] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMinutes(m)}
              className={cn(
                "rounded-full px-3.5 py-1.5 font-medium",
                minutes === m ? "bg-ssb-blue text-white" : "text-ssb-navy",
              )}
            >
              {m} min
            </button>
          ))}
        </div>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden rounded-[14px] border border-slate-200 bg-[#f6f7f9]">
        <svg viewBox="0 0 576 392" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-label="Trade area map">
          <rect width="576" height="392" fill="#f4f6f8" />

          {/* water */}
          <path d="M-10 40 C34 24 76 40 90 66 C102 90 68 106 34 102 C6 98 -10 78 -10 56Z" fill="#cfe4f5" />
          <path d="M470 300 C520 288 576 306 590 336 L590 392 L452 392 C440 360 442 314 470 300Z" fill="#cfe4f5" />
          <path
            d="M120 84 C160 108 176 150 210 176 C246 204 268 246 262 300 C258 340 244 366 236 392"
            fill="none"
            stroke="#cfe4f5"
            strokeWidth="4"
          />

          {/* road grid */}
          <g stroke="#e2e6eb" strokeWidth="1.6" fill="none">
            {[30, 76, 122, 168, 214, 260, 306, 352].map((y) => (
              <path key={`h${y}`} d={`M0 ${y}H576`} />
            ))}
            {[44, 108, 172, 236, 300, 364, 428, 492, 548].map((x) => (
              <path key={`v${x}`} d={`M${x} 0V392`} />
            ))}
          </g>

          {/* arterials + highways */}
          <g fill="none" strokeLinecap="round">
            <path d="M0 214H576" stroke="#dfe4ea" strokeWidth="5" />
            <path d="M300 0V392" stroke="#dfe4ea" strokeWidth="5" />
            <path d="M40 96 C160 70 300 84 420 40" stroke="#dfe4ea" strokeWidth="4.5" />
            <path d="M0 330 C140 306 320 344 576 306" stroke="#dfe4ea" strokeWidth="4.5" />
            <path d="M120 392 C190 280 250 190 340 0" stroke="#e6eaef" strokeWidth="3" />
          </g>

          <Shield x={300} y={120} label="75" tone="red" />
          <Shield x={128} y={88} label="121" tone="red" />
          <Shield x={104} y={316} label="635" tone="blue" />

          {/* drive-time isochrones */}
          <path d={outer} fill="#1f6feb" opacity="0.16" />
          <path d={outer} fill="none" stroke="#1f6feb" strokeWidth="2" strokeDasharray="7 5" />
          <path d={inner} fill="#1f6feb" opacity="0.16" />

          {/* city markers */}
          <City x={196} y={116} label="Frisco" />
          <City x={352} y={70} label="McKinney" />
          <City x={430} y={140} label="Allen" />
          <City x={148} y={162} label="The Colony" />
          <City x={120} y={266} label="Carrollton" />
          <City x={272} y={306} label="Richardson" />
          <City x={412} y={318} label="Garland" />
          <City x={288} y={238} label="Plano" muted={false} />

          <StorePin x={CX} y={CY} />
        </svg>

        <div className="absolute bottom-2.5 left-2.5 rounded-[10px] border border-slate-200 bg-white/95 px-2.5 py-2 text-[10.5px] text-ssb-navy">
          <p className="flex items-center gap-1.5">
            <i className="h-2.5 w-2.5 rounded-full bg-ssb-blue/35 ring-1 ring-ssb-blue" /> {minutes} minute drive time
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-slate-500">
            <i className="h-2.5 w-2.5 rounded-full bg-ssb-blue/15 ring-1 ring-ssb-blue/30" /> 10 / 20 minute drive time
          </p>
        </div>
        <div className="absolute right-2.5 bottom-2.5 flex items-end gap-2">
          <div className="rounded-[8px] border border-slate-200 bg-white/95 px-2 py-1 text-[10px] text-slate-600">
            0 · 5 · 10 Miles
            <div className="mt-1 flex h-1 w-[70px] overflow-hidden rounded-sm border border-slate-400">
              <i className="h-full w-1/2 bg-slate-500" />
              <i className="h-full w-1/2 bg-white" />
            </div>
          </div>
          <div className="rounded-[8px] border border-slate-200 bg-white/95 px-2 py-1 text-center text-[10px] font-semibold text-slate-600">
            N
            <svg viewBox="0 0 12 16" className="mx-auto h-4 w-3" aria-hidden>
              <path d="M6 1 10 14 6 11 2 14Z" fill="#64748b" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

function Shield({ x, y, label, tone }: { x: number; y: number; label: string; tone: "red" | "blue" }) {
  const fill = tone === "red" ? "#c0392b" : "#1d4ed8";
  const w = label.length > 2 ? 26 : 21;
  return (
    <g>
      <rect x={x - w / 2} y={y - 9} width={w} height={18} rx={4} fill={fill} />
      <text x={x} y={y + 4.5} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700">
        {label}
      </text>
    </g>
  );
}

function City({ x, y, label, muted = true }: { x: number; y: number; label: string; muted?: boolean }) {
  return (
    <g>
      <circle cx={x - label.length * 3.1 - 6} cy={y - 3.5} r="2.6" fill={muted ? "#94a3b8" : "#0b2340"} />
      <text
        x={x}
        y={y}
        textAnchor="middle"
        fill={muted ? "#64748b" : "#0b2340"}
        fontSize={muted ? "11.5" : "13"}
        fontWeight={muted ? "600" : "700"}
      >
        {label}
      </text>
    </g>
  );
}

function StorePin({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x - 15} ${y - 40})`}>
      <path
        d="M15 0C6.7 0 0 6.7 0 15c0 10.9 13.2 23.6 14.1 24.4a1.3 1.3 0 0 0 1.8 0C16.8 38.6 30 25.9 30 15 30 6.7 23.3 0 15 0Z"
        fill="#1f6feb"
        stroke="#ffffff"
        strokeWidth="2"
      />
      <g transform="translate(7.5 8)" fill="#ffffff">
        <path d="M0 2.4h15l1.2 3.2H-1.2z" />
        <path d="M1.4 6.6h12.2v7.6a.8.8 0 0 1-.8.8H2.2a.8.8 0 0 1-.8-.8z" />
      </g>
      <rect x="12.4" y="17.6" width="5.2" height="5.4" rx="0.6" fill="#1f6feb" />
    </g>
  );
}
