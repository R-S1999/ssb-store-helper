import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const TONES = {
  blue: "bg-[#dbeafe] text-[#1d4ed8]",
  green: "bg-[#d1fae5] text-[#047857]",
  violet: "bg-[#ede9fe] text-[#6d28d9]",
  amber: "bg-[#fef3c7] text-[#b45309]",
  slate: "bg-[#e2e8f0] text-[#475569]",
  red: "bg-[#fee2e2] text-[#b91c1c]",
  sky: "bg-[#e0f2fe] text-[#0369a1]",
} as const;

const SIZES = {
  xs: "h-8 w-8",
  sm: "h-9 w-9",
  md: "h-10 w-10",
  lg: "h-12 w-12",
  xl: "h-14 w-14",
} as const;

export function IconTile({
  children,
  tone = "blue",
  size = "md",
  shape = "square",
}: {
  children: ReactNode;
  tone?: keyof typeof TONES;
  size?: keyof typeof SIZES;
  shape?: "square" | "circle";
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center",
        shape === "circle" ? "rounded-full" : "rounded-[12px]",
        TONES[tone],
        SIZES[size],
      )}
    >
      {children}
    </div>
  );
}
