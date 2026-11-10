import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "brand" | "warm" | "success" | "warning" | "danger";

const tones: Record<Tone, string> = {
  neutral: "bg-surface-soft text-ink-muted",
  brand: "bg-brand text-ink",
  warm: "bg-brand-soft text-ink-soft",
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-destructive/10 text-destructive",
};

interface PillProps {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}

export function Pill({ children, tone = "neutral", className }: PillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
