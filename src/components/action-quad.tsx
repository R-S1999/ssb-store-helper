import { IconTile } from "@/components/icon-tile";
import { Lightbulb, Target, Trophy, Users } from "lucide-react";
import type { ReactNode } from "react";
import type { Recommendation } from "@/lib/types";
import { EvidenceChip } from "@/components/evidence-chip";
import { cn } from "@/lib/utils";

export function ActionQuad({
  recommendation,
  intro,
  sourceLabel = "Insights from:",
  columns = 2,
}: {
  recommendation: Recommendation;
  intro?: string;
  sourceLabel?: string;
  columns?: 2 | 4;
}) {
  const steps = recommendation.whatToDo
    .split(/(?<=\.)\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <section className="flex min-h-0 flex-1 flex-col rounded-[18px] border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <IconTile tone="blue" size="sm">
            <Lightbulb className="h-3.5 w-3.5" />
          </IconTile>
          <div>
            <h3 className="text-[16px] font-semibold leading-snug text-ssb-navy">{recommendation.action}</h3>
            {intro ? <p className="mt-0.5 text-[12px] leading-snug text-slate-500">{intro}</p> : null}
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-ssb-red">
          {recommendation.priority} Priority
        </span>
      </div>

      <div className={cn("mt-3 grid min-h-0 flex-1 gap-2", columns === 4 ? "grid-cols-4" : "grid-cols-2")}>
        <Quad icon={<Target className="h-3.5 w-3.5" />} title="Why you need it">
          {recommendation.why}
        </Quad>
        <Quad icon={<Users className="h-3.5 w-3.5" />} title="Top peer stores">
          {recommendation.topPeer}
        </Quad>
        <Quad icon={<Trophy className="h-3.5 w-3.5" />} title="Leading competitors">
          {recommendation.competitor}
        </Quad>
        <Quad icon={<Target className="h-3.5 w-3.5" />} title="What to do">
          {steps.length > 1 ? (
            <ul className="list-disc space-y-0.5 pl-3.5">
              {steps.map((step) => (
                <li key={step}>{step.replace(/\.$/, "")}</li>
              ))}
            </ul>
          ) : (
            recommendation.whatToDo
          )}
        </Quad>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] text-slate-400">{sourceLabel}</span>
        {recommendation.sources.map((source) => (
          <EvidenceChip key={source.label} source={source} />
        ))}
      </div>
    </section>
  );
}

function Quad({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl bg-[#f6f9fc] p-2.5">
      <p className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-ssb-navy">
        <span className="text-ssb-blue">{icon}</span>
        {title}
      </p>
      <div className="text-[11px] leading-snug text-slate-600">{children}</div>
    </div>
  );
}
