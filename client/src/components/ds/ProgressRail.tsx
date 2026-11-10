import { cn } from "@/lib/utils";

interface ProgressRailProps {
  value: number;
  max?: number;
  label?: string;
  /** Right-hand value, e.g. "12/30". Defaults to the percentage. */
  valueLabel?: string;
  tone?: "brand" | "ink" | "success";
  size?: "sm" | "md";
  /** Hides the visible number while keeping the rail's accessible name. */
  hideValue?: boolean;
  ariaLabel?: string;
  className?: string;
}

export function ProgressRail({
  value,
  max = 100,
  label,
  valueLabel,
  tone = "brand",
  size = "md",
  hideValue = false,
  ariaLabel,
  className,
}: ProgressRailProps) {
  const percent = Math.max(0, Math.min(100, Math.round((value / max) * 100)));

  return (
    <div className={cn("w-full", className)}>
      {(label || (valueLabel && !hideValue)) && (
        <div className="mb-2 flex items-baseline justify-between gap-3">
          {label && (
            <p className="text-xs font-medium text-ink-muted">{label}</p>
          )}
          {!hideValue && (
            <p className="text-xs font-semibold tabular-nums text-ink">
              {valueLabel ?? `${percent}%`}
            </p>
          )}
        </div>
      )}
      <div
        className={cn(
          "overflow-hidden rounded-full bg-line",
          size === "md" ? "h-2" : "h-1.5"
        )}
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={ariaLabel ?? label ?? "Progresso"}
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-500",
            tone === "brand" && "bg-brand",
            tone === "ink" && "bg-ink",
            tone === "success" && "bg-emerald-600"
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
