// OUSE SER VOCÊ – Instagram Share Button
// Botão elegante para compartilhar no Instagram

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useInstagramShare } from "@/hooks/useInstagramShare";
import { toast } from "sonner";

interface ShareInstagramButtonProps {
  type: "day" | "achievement" | "progress" | "week" | "journey";
  dayNumber?: number;
  theme?: string;
  mood?: number;
  achievementName?: string;
  achievementDescription?: string;
  completedDays?: number;
  totalDays?: number;
  currentWeek?: number;
  weekTheme?: string;
  daysCompleted?: number;
  finalMood?: number;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "ghost";
}

export default function ShareInstagramButton({
  type,
  dayNumber,
  theme,
  mood,
  achievementName,
  achievementDescription,
  completedDays,
  totalDays,
  currentWeek,
  weekTheme,
  daysCompleted,
  finalMood,
  size = "md",
  variant = "primary",
}: ShareInstagramButtonProps) {
  const {
    shareDayCompletion,
    shareAchievement,
    shareProgress,
    shareWeekCompletion,
    shareJourneyCompletion,
    openInstagram,
  } = useInstagramShare();

  const handleShare = () => {
    let message = "";

    switch (type) {
      case "day":
        if (dayNumber && theme && mood !== undefined) {
          const { text } = shareDayCompletion(dayNumber, theme, mood);
          message = text;
        }
        break;
      case "achievement":
        if (achievementName && achievementDescription) {
          const { text } = shareAchievement(
            achievementName,
            achievementDescription
          );
          message = text;
        }
        break;
      case "progress":
        if (
          completedDays !== undefined &&
          totalDays &&
          currentWeek &&
          weekTheme
        ) {
          const { text } = shareProgress(
            completedDays,
            totalDays,
            currentWeek,
            weekTheme
          );
          message = text;
        }
        break;
      case "week":
        if (currentWeek && weekTheme && daysCompleted) {
          const { text } = shareWeekCompletion(
            currentWeek,
            weekTheme,
            daysCompleted
          );
          message = text;
        }
        break;
      case "journey":
        if (finalMood !== undefined) {
          const { text } = shareJourneyCompletion(finalMood);
          message = text;
        }
        break;
    }

    if (message) {
      openInstagram(message);
      toast.success("Mensagem copiada! Cole no Instagram 📸");
    }
  };

  const sizeClasses = {
    sm: "h-8 px-2 sm:px-3 text-xs",
    md: "h-10 px-3 sm:px-4 text-sm",
    lg: "h-12 px-4 sm:px-5 text-base",
  };

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-[#F77737] to-[#FD1D1D] hover:from-[#E66626] hover:to-[#EC1C1C] text-white shadow-md",
    secondary:
      "bg-[#F0F0F0] hover:bg-[#E0E0E0] text-[#F77737] border border-[#E8D5CC]",
    ghost:
      "bg-transparent hover:bg-[#F5EDE8] text-[#F77737] border border-[#F77737]",
  };

  const labels = {
    day: "Compartilhar",
    achievement: "Compartilhar",
    progress: "Compartilhar progresso",
    week: "Compartilhar semana",
    journey: "Compartilhar jornada",
  };

  return (
    <motion.button
      onClick={handleShare}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${sizeClasses[size]} ${variantClasses[variant]}`}
    >
      <Heart className="w-4 h-4" />
      <span>{labels[type]}</span>
    </motion.button>
  );
}
