import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Screen({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-5 pb-24 sm:space-y-6 lg:pb-0", className)}>
      {children}
    </div>
  );
}

interface ScreenHeaderProps {
  /** Small line above the title that names the screen's job. */
  kicker?: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  /** "display" for the two or three screens that carry the product promise. */
  size?: "page" | "display";
}

export function ScreenHeader({
  kicker,
  title,
  description,
  actions,
  size = "page",
}: ScreenHeaderProps) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        {kicker && (
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
            {kicker}
          </p>
        )}
        <h1
          className={cn(
            "font-serif text-ink",
            size === "display"
              ? "text-[30px] leading-[1.12] tracking-[-0.01em] sm:text-[38px]"
              : "text-[26px] leading-[1.18] sm:text-[30px]"
          )}
        >
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink-muted">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      )}
    </header>
  );
}
