import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { focusRing } from "@/components/ds";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  likes: number;
  isLiked: boolean;
  onToggle: () => void;
  /** Accessible name — says whose content is being liked. */
  label: string;
  size?: "sm" | "md" | "lg";
}

export default function LikeButton({
  likes,
  isLiked,
  onToggle,
  label,
  size = "md",
}: LikeButtonProps) {
  // Every size keeps the 44px target floor.
  const targetClasses = {
    sm: "h-11 w-11",
    md: "h-11 w-11",
    lg: "h-12 w-12",
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <div className="flex items-center gap-2">
      <motion.button
        type="button"
        onClick={onToggle}
        aria-pressed={isLiked}
        aria-label={label}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        className={cn(
          "flex items-center justify-center rounded-full transition-colors",
          targetClasses[size],
          focusRing,
          isLiked
            ? "bg-brand-soft text-brand-ink"
            : "bg-surface-soft text-ink-muted hover:bg-brand-wash hover:text-brand-ink"
        )}
      >
        <motion.span
          animate={isLiked ? { scale: [1, 1.25, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Heart
            className={cn(iconSizes[size], isLiked && "fill-current")}
            aria-hidden
          />
        </motion.span>
      </motion.button>

      <span
        className={cn(
          "min-w-4 text-xs font-medium tabular-nums",
          isLiked ? "text-brand-ink" : "text-ink-muted"
        )}
        aria-hidden
      >
        {likes > 0 ? likes : ""}
      </span>
    </div>
  );
}
