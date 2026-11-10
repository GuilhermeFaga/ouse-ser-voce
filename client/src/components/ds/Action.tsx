import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "quiet" | "danger";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand text-ink hover:bg-brand-hover active:scale-[0.99] shadow-[0_1px_2px_rgba(44,24,16,0.12)]",
  secondary:
    "bg-white text-ink border border-line-strong hover:bg-surface-soft",
  ghost: "text-brand-ink hover:bg-brand-soft",
  quiet: "text-ink-muted underline underline-offset-4 hover:text-ink",
  danger: "text-destructive hover:bg-destructive/5",
};

const sizes: Record<Size, string> = {
  sm: "h-11 px-3 text-xs gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
};

interface ActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  /** Renders the action on its own line, full width (mobile default for primary CTAs). */
  block?: boolean;
}

export const Action = forwardRef<HTMLButtonElement, ActionProps>(
  function Action(
    {
      variant = "primary",
      size = "md",
      icon,
      block = false,
      className,
      children,
      ...props
    },
    ref
  ) {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
          "disabled:cursor-not-allowed disabled:opacity-50",
          variants[variant],
          sizes[size],
          block && "w-full",
          className
        )}
        {...props}
      >
        {icon}
        {children}
      </button>
    );
  }
);
