import { BarChart3, Trophy, Users } from "lucide-react";
import type { ReactNode } from "react";
import { IconTile } from "@/components/icon-tile";
import { StorefrontGlyph } from "@/components/peer-rank-strip";

/** Compact inline variant used in the page header of the simpler attribute screens. */
export function AttributeScoreHeader({
  storeLabel,
  storeScore,
  clusterScore,
  topScore,
}: {
  storeLabel: string;
  storeScore: number;
  clusterScore: number;
  topScore: number;
}) {
  return (
    <div className="flex shrink-0 items-stretch gap-3">
      <div className="flex items-center gap-3 rounded-[16px] border border-slate-200 bg-white px-4 py-3">
        <IconTile tone="slate" size="md" shape="circle">
          <StorefrontGlyph className="h-5 w-5" />
        </IconTile>
        <p className="text-[15px] font-semibold text-ssb-navy">{storeLabel}</p>
      </div>
      <ScorePill tone="blue" icon={<BarChart3 className="h-5 w-5" />} label="Your Store Score" value={storeScore} />
      <ScorePill tone="blue" icon={<Users className="h-5 w-5" />} label="Cluster Average" value={clusterScore} />
      <ScorePill tone="green" icon={<Trophy className="h-5 w-5" />} label="Top Stores" value={topScore} />
    </div>
  );
}

/**
 * Full-width strip card: store identity, then three divided score blocks, then
 * an optional callout pinned to the right.
 */
export function AttributeScoreStrip({
  storeLabel,
  storeScore,
  clusterScore,
  topScore,
  callout,
}: {
  storeLabel: string;
  storeScore: number;
  clusterScore: number;
  topScore: number;
  callout?: ReactNode;
}) {
  return (
    <div className="flex shrink-0 items-stretch gap-6 rounded-[18px] border border-slate-200 bg-white px-6 py-4">
      <div className="flex items-center gap-3.5">
        <IconTile tone="slate" size="xl" shape="circle">
          <StorefrontGlyph className="h-7 w-7" />
        </IconTile>
        <p className="text-[19px] font-semibold text-ssb-navy">{storeLabel}</p>
      </div>
      <ScoreBlock tone="blue" icon={<BarChart3 className="h-6 w-6" />} label="Your Store Score" value={storeScore} />
      <ScoreBlock tone="blue" icon={<Users className="h-6 w-6" />} label="Cluster Average" value={clusterScore} />
      <ScoreBlock tone="green" icon={<Trophy className="h-6 w-6" />} label="Top Stores" value={topScore} />
      {callout ? <div className="ml-auto flex items-center border-l border-slate-200 pl-6">{callout}</div> : null}
    </div>
  );
}

function ScoreBlock({
  icon,
  tone,
  label,
  value,
}: {
  icon: ReactNode;
  tone: "blue" | "green";
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-3.5 border-l border-slate-200 pl-6">
      <IconTile tone={tone} size="lg">
        {icon}
      </IconTile>
      <div>
        <p className="text-[13px] text-slate-500">{label}</p>
        <p className="text-[30px] font-bold leading-none tabular-nums text-ssb-blue">
          {value} <span className="text-[16px] font-semibold text-ssb-navy">/ 100</span>
        </p>
      </div>
    </div>
  );
}

function ScorePill({
  icon,
  tone,
  label,
  value,
}: {
  icon: ReactNode;
  tone: "blue" | "green";
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-3 rounded-[16px] border border-slate-200 bg-white px-4 py-3">
      <IconTile tone={tone} size="md">
        {icon}
      </IconTile>
      <div>
        <p className="text-[12.5px] text-slate-500">{label}</p>
        <p className="text-[24px] font-bold leading-none tabular-nums text-ssb-blue">
          {value} <span className="text-[14px] font-semibold text-ssb-navy">/ 100</span>
        </p>
      </div>
    </div>
  );
}
