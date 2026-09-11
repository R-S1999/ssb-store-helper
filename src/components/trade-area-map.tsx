"use client";

import { useState } from "react";
import type { MarketProfile } from "@/lib/types";
import { cn } from "@/lib/utils";
import { IconTile } from "@/components/icon-tile";
import { MapPin } from "lucide-react";

export function TradeAreaMap({ market }: { market: MarketProfile }) {
  const [minutes, setMinutes] = useState<10 | 15 | 20>(15);
  const iso =
    minutes === 10
      ? "M250 150 C280 130 310 145 318 175 C325 210 300 235 268 240 C230 244 205 220 200 188 C196 160 220 140 250 150Z"
      : minutes === 15
        ? "M248 118 C310 108 355 145 360 195 C362 250 320 292 268 300 C210 305 165 270 155 210 C148 155 190 122 248 118Z"
        : "M240 88 C330 78 400 130 408 205 C412 285 350 340 260 348 C170 352 108 295 98 205 C90 125 165 92 240 88Z";

  return (
    <section className="flex h-full min-h-0 flex-col rounded-[18px] border border-slate-200 bg-white p-3.5">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <IconTile tone="blue" size="sm">
            <MapPin className="h-3.5 w-3.5" />
          </IconTile>
          <div>
            <p className="text-[14px] font-semibold text-ssb-navy">Trade Area – {minutes} Minute Drive Time</p>
            <p className="text-[11px] text-slate-400">Mattress World – Plano, TX · {market.households.toLocaleString("en-US")} HH</p>
          </div>
        </div>
        <div className="flex rounded-full bg-slate-100 p-0.5 text-[12px]">
          {([10, 15, 20] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMinutes(m)}
              className={cn(
                "rounded-full px-3 py-1 font-medium",
                minutes === m ? "bg-ssb-blue text-white" : "text-ssb-navy",
              )}
            >
              {m} min
            </button>
          ))}
        </div>
      </div>
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-[14px] bg-[#cfe6d8]">
        <svg viewBox="0 0 520 320" className="h-full w-full" aria-label="Trade area map">
          <rect width="520" height="320" fill="#d9ecdd" />
          <path d="M0 40 C80 10 140 80 90 150 C40 200 0 120 0 40Z" fill="#7ec8e3" />
          <path d="M380 0 C480 20 530 90 500 160 C470 90 430 40 380 0Z" fill="#7ec8e3" />
          <path d="M60 250 C140 230 180 280 120 320 L0 320 L0 270Z" fill="#7ec8e3" />
          <path d="M40 210 L500 205" stroke="#f2d27a" strokeWidth="7" />
          <path d="M258 10 L262 310" stroke="#f2d27a" strokeWidth="7" />
          <rect x="248" y="168" width="18" height="18" rx="3" fill="#c44536" />
          <text x="257" y="181" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="700">
            75
          </text>
          <rect x="70" y="198" width="22" height="14" rx="3" fill="#c44536" />
          <text x="81" y="208" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700">
            121
          </text>
          <rect x="300" y="248" width="22" height="14" rx="7" fill="#1d4ed8" />
          <text x="311" y="258" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700">
            635
          </text>
          <path d={iso} fill="#1f6feb" opacity="0.28" />
          <path d={iso} fill="none" stroke="#1f6feb" strokeWidth="2.5" />
          <circle cx="268" cy="198" r="8" fill="#1f6feb" stroke="#fff" strokeWidth="3" />
          <City x={268} y={218} label="Plano" />
          <City x={210} y={125} label="Frisco" />
          <City x={318} y={95} label="McKinney" />
          <City x={352} y={155} label="Allen" />
          <City x={255} y={268} label="Richardson" />
          <City x={340} y={285} label="Garland" />
          <City x={145} y={168} label="The Colony" />
          <City x={125} y={238} label="Carrollton" />
        </svg>
        <div className="absolute bottom-2 left-2 rounded-lg bg-white/90 px-2 py-1.5 text-[10px] text-ssb-navy">
          <p className="flex items-center gap-1.5">
            <i className="h-2.5 w-2.5 rounded-sm bg-ssb-blue/40 ring-1 ring-ssb-blue" /> {minutes} minute drive time
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-slate-400">
            <i className="h-2.5 w-2.5 rounded-sm bg-ssb-blue/20" /> 10 / 20 minute drive time
          </p>
        </div>
        <div className="absolute right-2 bottom-2 flex items-end gap-2">
          <div className="rounded bg-white/90 px-1.5 py-1 text-center text-[9px] text-slate-500">
            N
            <div className="mx-auto h-4 w-px bg-slate-400" />
          </div>
          <div className="rounded bg-white/90 px-2 py-1 text-[9px] text-slate-500">0 · 5 · 10 Miles</div>
        </div>
      </div>
    </section>
  );
}

function City({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <text x={x} y={y} textAnchor="middle" fill="#0b2340" fontSize="11" fontWeight="600">
      {label}
    </text>
  );
}
