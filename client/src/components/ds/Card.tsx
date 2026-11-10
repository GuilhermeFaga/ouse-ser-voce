import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "plain" | "warm" | "brand" | "outline";

const toneClasses: Record<Tone, string> = {
  plain: "bg-white border-line",
  warm: "bg-surface-soft border-line-strong",
  brand: "bg-brand text-ink border-transparent",
  outline: "bg-transparent border-line-strong",
};

interface CardProps {
  children: ReactNode;
  className?: string;
  tone?: Tone;
  as?: ElementType;
  padding?: "sm" | "md" | "none";
  /** Clips children to the rounded corners (headers, images, edge-to-edge rows). */
  clip?: boolean;
  /** Adds the soft 1px lift used on primary surfaces. */
  elevated?: boolean;
}

export function Card({
  children,
  className,
  tone = "plain",
  as: Component = "section",
  padding = "md",
  clip = false,
  elevated = true,
}: CardProps) {
  return (
    <Component
      className={cn(
        "rounded-2xl border",
        toneClasses[tone],
        padding === "md" && "p-5 sm:p-6",
        padding === "sm" && "p-4",
        padding === "none" && "p-0",
        clip && "overflow-hidden",
        elevated && "shadow-[0_1px_2px_rgba(44,24,16,0.04)]",
        className
      )}
    >
      {children}
    </Component>
  );
}

interface CardTitleProps {
  children: ReactNode;
  hint?: ReactNode;
  id?: string;
  className?: string;
}

export function CardTitle({ children, hint, id, className }: CardTitleProps) {
  return (
    <div
      className={cn("mb-3 flex items-center justify-between gap-3", className)}
    >
      <h2 id={id} className="font-serif text-lg leading-tight text-ink">
        {children}
      </h2>
      {/* A 44px control here would inflate the row and centre the title in dead space;
          the negative margin keeps the tap target while the row stays title height. */}
      {hint && (
        <div className="-my-2.5 flex shrink-0 items-center text-xs">{hint}</div>
      )}
    </div>
  );
}
