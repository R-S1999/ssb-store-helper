"use client";

import { useState } from "react";
import { BenchmarkRow } from "@/components/benchmark-row";
import { EvidenceChip } from "@/components/evidence-chip";
import type { Capability } from "@/lib/types";

export function CapabilityList({ capabilities }: { capabilities: Capability[] }) {
  const [open, setOpen] = useState<string | null>("need-recognition");
  return (
    <div className="space-y-3">
      {capabilities.map((cap) => (
        <div key={cap.id}>
          <button type="button" className="w-full" onClick={() => setOpen(open === cap.id ? null : cap.id)}>
            <BenchmarkRow
              label={cap.label}
              store={cap.store}
              cluster={cap.cluster}
              top={cap.top}
              insight={cap.insight}
              open={open === cap.id}
            />
          </button>
          {open === cap.id ? (
            <div className="mt-2 rounded-2xl border border-border bg-white p-4">
              <p className="text-sm text-muted-foreground">{cap.insight}</p>
              {cap.checklist ? (
                <ul className="mt-3 grid gap-1 text-sm text-ssb-navy sm:grid-cols-2">
                  {cap.checklist.map((item) => (
                    <li key={item} className="rounded-lg bg-ssb-blue-soft/70 px-3 py-1.5">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
              <div className="mt-3 flex flex-wrap gap-1.5">
                <EvidenceChip source={{ label: "Mystery Shop", kind: "store" }} />
                <EvidenceChip source={{ label: "Associate Assessment", kind: "store" }} />
                <EvidenceChip source={{ label: "POS Conversion", kind: "store" }} />
              </div>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
