import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const TONES = {
  blue: "bg-[#e8f1ff] text-ssb-blue",
  green: "bg-emerald-50 text-emerald-600",
  violet: "bg-violet-50 text-violet-600",
  amber: "bg-amber-50 text-amber-600",
  slate: "bg-slate-100 text-slate-500",
  red: "bg-rose-50 text-ssb-red",
  sky: "bg-sky-50 text-sky-600",
} as const;

export function IconTile({
  children,
  tone = "blue",
  size = "md",
}: {
  children: ReactNode;
  tone?: keyof typeof TONES;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full",
        TONES[tone],
        size === "sm" && "h-7 w-7",
        size === "md" && "h-10 w-10",
        size === "lg" && "h-12 w-12",
      )}
    >
      {children}
    </div>
  );
}
