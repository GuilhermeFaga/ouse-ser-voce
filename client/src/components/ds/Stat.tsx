import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatProps {
  label: string;
  value: ReactNode;
  /** Unit shown smaller next to the value, e.g. "/30" or "dias". */
  unit?: string;
  hint?: ReactNode;
  /** The one number that should win the screen's hierarchy. */
  emphasis?: boolean;
  className?: string;
}

export function Stat({
  label,
  value,
  unit,
  hint,
  emphasis = false,
  className,
}: StatProps) {
  return (
    <div className={cn("min-w-0", className)}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 flex items-baseline gap-1 font-serif tabular-nums text-ink",
          emphasis ? "text-[34px] leading-none" : "text-[24px] leading-none"
        )}
      >
        {value}
        {unit && (
          <span className="font-sans text-xs font-medium text-ink-subtle">
            {unit}
          </span>
        )}
      </p>
      {hint && <p className="mt-1.5 text-xs text-ink-muted">{hint}</p>}
    </div>
  );
}
