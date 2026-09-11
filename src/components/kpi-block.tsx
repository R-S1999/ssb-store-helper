export function KpiBlock({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "blue" | "amber" | "green" | "red";
}) {
  const tones = {
    default: "bg-white",
    blue: "bg-ssb-blue-soft/80",
    amber: "bg-amber-50",
    green: "bg-emerald-50",
    red: "bg-red-50",
  };
  return (
    <div className={`rounded-2xl border border-border p-4 ${tones[tone]}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-ssb-navy">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
