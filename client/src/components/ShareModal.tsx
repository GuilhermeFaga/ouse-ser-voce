// OUSE SER VOCÊ – Share Modal com Preview
// Modal elegante para visualizar e compartilhar mensagens

import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWhatsAppShare } from "@/hooks/useWhatsAppShare";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
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
}

export default function ShareModal({
  isOpen,
  onClose,
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
}: ShareModalProps) {
  const { shareDayCompletion, shareAchievement, shareProgress, shareWeekCompletion, shareJourneyCompletion, openWhatsApp } = useWhatsAppShare();

  const getMessage = (): string => {
    switch (type) {
      case "day":
        if (dayNumber && theme && mood !== undefined) {
          return shareDayCompletion(dayNumber, theme, mood).text;
        }
        break;
      case "achievement":
        if (achievementName && achievementDescription) {
          return shareAchievement(achievementName, achievementDescription).text;
        }
        break;
      case "progress":
        if (completedDays !== undefined && totalDays && currentWeek && weekTheme) {
          return shareProgress(completedDays, totalDays, currentWeek, weekTheme).text;
        }
        break;
      case "week":
        if (currentWeek && weekTheme && daysCompleted) {
          return shareWeekCompletion(currentWeek, weekTheme, daysCompleted).text;
        }
        break;
      case "journey":
        if (finalMood !== undefined) {
          return shareJourneyCompletion(finalMood).text;
        }
        break;
    }
    return "";
  };

  const message = getMessage();

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
  };

  const handleShare = () => {
    openWhatsApp(message);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto z-50 bg-white rounded-2xl border border-[#F0E4DC] shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#F5EDE8] to-[#FAF6F1] border-b border-[#E8D5CC] px-6 py-4 flex items-center justify-between">
              <h2 className="font-semibold text-[#2C1810]">Compartilhar no WhatsApp</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg hover:bg-[#E8D5CC] flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-[#8B6E5A]" />
              </button>
            </div>

            {/* Message Preview */}
            <div className="px-6 py-4 space-y-4">
              <div className="bg-[#F5EDE8] rounded-xl p-4 border border-[#E8D5CC] max-h-48 overflow-y-auto">
                <p className="text-sm text-[#2C1810] leading-relaxed whitespace-pre-wrap font-mono text-xs">
                  {message}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  className="flex-1 border-[#E8D5CC] text-[#6B4C3B] rounded-xl hover:bg-[#F5EDE8]"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar
                </Button>
                <Button
                  onClick={handleShare}
                  className="flex-1 bg-[#25D366] hover:bg-[#1FAD56] text-white rounded-xl"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Compartilhar
                </Button>
              </div>

              <p className="text-xs text-[#B08070] text-center">
                A mensagem será aberta no WhatsApp para você enviar
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
