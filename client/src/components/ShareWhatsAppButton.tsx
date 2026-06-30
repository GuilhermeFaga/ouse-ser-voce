// OUSE SER VOCÊ – WhatsApp Share Button
// Botão elegante para compartilhar no WhatsApp

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useWhatsAppShare } from "@/hooks/useWhatsAppShare";

interface ShareWhatsAppButtonProps {
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

export default function ShareWhatsAppButton({
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
}: ShareWhatsAppButtonProps) {
  const { shareDayCompletion, shareAchievement, shareProgress, shareWeekCompletion, shareJourneyCompletion, openWhatsApp } = useWhatsAppShare();

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
          const { text } = shareAchievement(achievementName, achievementDescription);
          message = text;
        }
        break;
      case "progress":
        if (completedDays !== undefined && totalDays && currentWeek && weekTheme) {
          const { text } = shareProgress(completedDays, totalDays, currentWeek, weekTheme);
          message = text;
        }
        break;
      case "week":
        if (currentWeek && weekTheme && daysCompleted) {
          const { text } = shareWeekCompletion(currentWeek, weekTheme, daysCompleted);
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
      openWhatsApp(message);
    }
  };

  const sizeClasses = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-5 text-base",
  };

  const variantClasses = {
    primary: "bg-[#25D366] hover:bg-[#1FAD56] text-white shadow-md",
    secondary: "bg-[#F0F0F0] hover:bg-[#E0E0E0] text-[#25D366] border border-[#E8D5CC]",
    ghost: "bg-transparent hover:bg-[#F5EDE8] text-[#25D366] border border-[#25D366]",
  };

  const labels = {
    day: "Compartilhar dia",
    achievement: "Compartilhar conquista",
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
      <MessageCircle className="w-4 h-4" />
      <span>{labels[type]}</span>
    </motion.button>
  );
}
