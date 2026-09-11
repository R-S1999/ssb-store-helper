import { BarChart3, Home, Lightbulb, Trophy } from "lucide-react";
import { IconTile } from "@/components/icon-tile";

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
    <div className="flex shrink-0 items-center gap-2">
      <div className="flex items-center gap-2 rounded-[16px] border border-slate-200 bg-white px-3 py-2">
        <IconTile tone="slate" size="sm">
          <Home className="h-3.5 w-3.5" />
        </IconTile>
        <p className="text-[13px] font-semibold text-ssb-navy">{storeLabel}</p>
      </div>
      <ScorePill icon={<Lightbulb className="h-3.5 w-3.5 text-ssb-blue" />} label="Your Store Score" value={storeScore} />
      <ScorePill icon={<BarChart3 className="h-3.5 w-3.5 text-emerald-500" />} label="Cluster Average" value={clusterScore} />
      <ScorePill icon={<Trophy className="h-3.5 w-3.5 text-emerald-500" />} label="Top Stores" value={topScore} />
    </div>
  );
}

function ScorePill({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-[16px] border border-slate-200 bg-white px-3 py-1.5">
      <p className="flex items-center gap-1.5 text-[10px] text-slate-500">
        {icon}
        {label}
      </p>
      <p className="text-[20px] font-semibold leading-tight tabular-nums text-ssb-navy">
        {value} <span className="text-[12px] font-medium text-slate-400">/ 100</span>
      </p>
    </div>
  );
}
