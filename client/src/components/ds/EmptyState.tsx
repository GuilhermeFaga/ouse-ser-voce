import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: ElementType;
  title: string;
  body?: ReactNode;
  action?: ReactNode;
  /** "warm" inside cards, "plain" on the page background. */
  tone?: "plain" | "warm";
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  body,
  action,
  tone = "plain",
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed border-line-strong px-6 py-10 text-center",
        tone === "warm" && "bg-brand-wash",
        className
      )}
    >
      {Icon && (
        <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft text-brand-ink">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
      )}
      <p className="font-serif text-lg text-ink">{title}</p>
      {body && (
        <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-ink-muted">
          {body}
        </p>
      )}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}
