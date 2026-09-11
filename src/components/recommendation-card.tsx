import { EvidenceBlock, EvidenceChip } from "@/components/evidence-chip";
import { Badge } from "@/components/ui/badge";
import type { Recommendation } from "@/lib/types";

export function RecommendationCard({ recommendation }: { recommendation: Recommendation }) {
  return (
    <section className="rounded-3xl border border-border bg-white p-5 shadow-[0_8px_30px_rgba(11,35,64,0.04)]">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ssb-blue">
          Recommended action
        </p>
        <Badge className="bg-amber-100 text-ssb-amber hover:bg-amber-100">{recommendation.priority} impact</Badge>
      </div>
      <h3 className="text-xl font-semibold tracking-tight text-ssb-navy">{recommendation.action}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{recommendation.why}</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <EvidenceBlock kind="peer" title="Top peer stores">
          {recommendation.topPeer}
        </EvidenceBlock>
        <EvidenceBlock kind="competitor" title="Leading competitor practice">
          {recommendation.competitor}
        </EvidenceBlock>
      </div>
      <div className="mt-4 rounded-2xl bg-ssb-blue-soft/80 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ssb-blue">What to do</p>
        <p className="mt-1 text-sm leading-relaxed text-ssb-navy">{recommendation.whatToDo}</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {recommendation.sources.map((source) => (
          <EvidenceChip key={source.label} source={source} />
        ))}
      </div>
    </section>
  );
}
