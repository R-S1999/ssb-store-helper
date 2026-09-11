import { IconTile } from "@/components/icon-tile";
import { BarChart3, CheckCircle2, Lightbulb, Trophy, Users } from "lucide-react";
import type { ReactNode } from "react";
import type { Recommendation } from "@/lib/types";
import { EvidenceChip } from "@/components/evidence-chip";
import { cn } from "@/lib/utils";

export function ActionQuad({
  recommendation,
  intro,
  sourceLabel = "Insights from:",
  columns = 2,
  accent = false,
}: {
  recommendation: Recommendation;
  intro?: string;
  sourceLabel?: string;
  columns?: 2 | 4;
  accent?: boolean;
}) {
  const steps = recommendation.whatToDo
    .split(/(?<=\.)\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <section
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-hidden rounded-[18px] border bg-white p-4",
        accent ? "border-ssb-blue/35" : "border-slate-200",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <IconTile tone="blue" size="md">
            <Lightbulb className="h-5 w-5" />
          </IconTile>
          <div>
            <h3 className="text-[17px] font-semibold leading-snug text-ssb-blue">{recommendation.action}</h3>
            {intro ? <p className="mt-1 text-[12.5px] leading-snug text-slate-600">{intro}</p> : null}
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#fee2e2] px-3 py-1.5 text-[12.5px] font-semibold text-[#b91c1c]">
          <span className="h-2 w-2 rounded-full bg-[#dc2626]" />
          {recommendation.priority} Priority
        </span>
      </div>

      <div className={cn("mt-3 grid min-h-0 flex-1 gap-2.5", columns === 4 ? "grid-cols-4" : "grid-cols-2")}>
        <Quad wide={columns === 2} tone="blue" icon={<BarChart3 className="h-4 w-4" />} title="Why you need it">
          {recommendation.why}
        </Quad>
        <Quad wide={columns === 2} tone="violet" icon={<Users className="h-4 w-4" />} title="Top peer stores">
          {recommendation.topPeer}
        </Quad>
        <Quad wide={columns === 2} tone="amber" icon={<Trophy className="h-4 w-4" />} title="Leading competitors">
          {recommendation.competitor}
        </Quad>
        <Quad wide={columns === 2} tone="green" icon={<CheckCircle2 className="h-4 w-4" />} title="What to do">
          {steps.length > 1 ? (
            <ul className="list-disc space-y-1 pl-4">
              {steps.map((step) => (
                <li key={step}>{step.replace(/\.$/, "")}</li>
              ))}
            </ul>
          ) : (
            recommendation.whatToDo
          )}
        </Quad>
      </div>

      <div className="mt-3 flex shrink-0 flex-wrap items-center gap-x-2 gap-y-1.5">
        <span className="shrink-0 text-[12.5px] text-slate-500">{sourceLabel}</span>
        {recommendation.sources.map((source) => (
          <EvidenceChip key={source.label} source={source} />
        ))}
      </div>
    </section>
  );
}

function Quad({
  icon,
  tone,
  title,
  children,
  wide = false,
}: {
  icon: ReactNode;
  tone: "blue" | "violet" | "amber" | "green";
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-col overflow-hidden rounded-[14px] bg-[#eff6ff]",
        wide ? "justify-center p-4" : "p-3",
      )}
    >
      <div className={cn("flex items-center gap-2", wide ? "mb-2.5" : "mb-1.5")}>
        <IconTile tone={tone} size={wide ? "sm" : "xs"}>
          {icon}
        </IconTile>
        <p className={cn("font-semibold leading-tight text-ssb-navy", wide ? "text-[15px]" : "text-[13px]")}>
          {title}
        </p>
      </div>
      <div className={cn("text-slate-600", wide ? "text-[13.5px] leading-relaxed" : "text-[11px] leading-[1.3]")}>
        {children}
      </div>
    </div>
  );
}
