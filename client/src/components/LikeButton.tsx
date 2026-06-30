// Botão de like/apoio para histórias e comentários
// Design: Animação suave com coração que pulsa

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface LikeButtonProps {
  likes: number;
  isLiked: boolean;
  onToggle: () => void;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
}

export default function LikeButton({
  likes,
  isLiked,
  onToggle,
  size = "md",
  showCount = true,
}: LikeButtonProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className="flex items-center gap-2">
      <motion.button
        onClick={onToggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center transition-all duration-200 ${
          isLiked
            ? "bg-rose-100 text-rose-500"
            : "bg-gray-100 text-gray-400 hover:bg-rose-50 hover:text-rose-400"
        }`}
      >
        <motion.div
          animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Heart
            className={`${iconSizes[size]} ${isLiked ? "fill-current" : ""}`}
          />
        </motion.div>
      </motion.button>

      {showCount && (
        <motion.span
          key={likes}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`${textSizes[size]} font-medium ${
            isLiked ? "text-rose-500" : "text-gray-600"
          }`}
        >
          {likes > 0 ? likes : ""}
        </motion.span>
      )}
    </div>
  );
}
