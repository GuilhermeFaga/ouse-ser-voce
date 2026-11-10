import {
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

interface FieldProps {
  label: string;
  /** Must match the `id` of the control inside. */
  htmlFor: string;
  hint?: string;
  error?: string | null;
  optional?: boolean;
  /** Marks the control as required for assistive tech. */
  required?: boolean;
  children: ReactNode;
  className?: string;
}

type ControlProps = {
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  "aria-required"?: boolean;
};

/**
 * Labelled form field: one place for label / hint / error and the matching
 * `aria-describedby`, `aria-invalid` and `aria-required` on the control.
 */
export function Field({
  label,
  htmlFor,
  hint,
  error,
  optional = false,
  required = false,
  children,
  className,
}: FieldProps) {
  const describedBy = [
    hint ? `${htmlFor}-hint` : null,
    error ? `${htmlFor}-error` : null,
  ]
    .filter(Boolean)
    .join(" ");

  let control = children;
  if (isValidElement(children)) {
    const element = children as ReactElement<ControlProps>;
    control = cloneElement(element, {
      "aria-describedby":
        [element.props["aria-describedby"], describedBy]
          .filter(Boolean)
          .join(" ") || undefined,
      "aria-invalid": error ? true : element.props["aria-invalid"],
      "aria-required": required ? true : element.props["aria-required"],
    });
  }

  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-ink">
        {label}
        {optional && (
          <span className="ml-1 text-xs font-normal text-ink-muted">
            (opcional)
          </span>
        )}
      </label>
      {control}
      {hint && (
        <p
          id={`${htmlFor}-hint`}
          className="text-xs leading-relaxed text-ink-muted"
        >
          {hint}
        </p>
      )}
      {error && (
        <p
          id={`${htmlFor}-error`}
          role="alert"
          className="text-xs font-medium text-destructive"
        >
          {error}
        </p>
      )}
    </div>
  );
}

/** Class string for inputs/textareas/selects so they match the kit. */
export function fieldInputClass(hasError = false) {
  return cn(
    "w-full rounded-xl border bg-white px-4 text-base text-ink transition-colors",
    "placeholder:text-ink-muted",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
    hasError ? "border-destructive" : "border-line-strong"
  );
}
