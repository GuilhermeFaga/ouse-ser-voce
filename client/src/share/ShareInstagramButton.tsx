import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  buildShareMessage,
  copyToClipboard,
  openInstagram,
  type ShareSubject,
} from "./messages";

interface ShareInstagramButtonProps {
  subject: ShareSubject;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  /** Accessible name when the visible label is generic (e.g. a row of "Compartilhar"). */
  label?: string;
}

const sizeClasses = {
  sm: "h-11 px-3 text-xs gap-1.5",
  md: "h-11 px-4 text-sm gap-2",
  lg: "h-12 px-5 text-base gap-2",
};

const variantClasses = {
  primary:
    "bg-brand text-ink hover:bg-brand-hover shadow-[0_1px_2px_rgba(44,24,16,0.12)]",
  secondary:
    "bg-white text-ink border border-line-strong hover:bg-surface-soft",
  ghost: "bg-transparent text-brand-ink hover:bg-brand-soft",
};

const labels: Record<ShareSubject["kind"], string> = {
  day: "Compartilhar",
  achievement: "Compartilhar",
  progress: "Compartilhar progresso",
  journey: "Compartilhar jornada",
  story: "Compartilhar história",
};

export default function ShareInstagramButton({
  subject,
  size = "md",
  variant = "primary",
  className,
  label,
}: ShareInstagramButtonProps) {
  const handleShare = async () => {
    const message = buildShareMessage(subject);
    const copied = await copyToClipboard(message);
    if (!copied) {
      toast.error("Não foi possível copiar a mensagem.");
      return;
    }
    openInstagram();
    toast.success("Mensagem copiada. Cole no Instagram.");
  };

  return (
    <button
      onClick={handleShare}
      aria-label={label}
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      <Share2 className="h-4 w-4" aria-hidden />
      <span>{labels[subject.kind]}</span>
    </button>
  );
}
