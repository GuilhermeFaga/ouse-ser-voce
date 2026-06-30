// OUSE SER VOCÊ – Jornada Completa
// Design: Clínica Emocional Sofisticada | Visão geral dos 30 dias

import { useState } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/contexts/AppContext";
import { dailyContent, weekModules } from "@/lib/journeyData";
import { CheckCircle2, Lock, Circle } from "lucide-react";
import type { AppPage } from "@/components/AppLayout";

interface JourneyProps {
  onNavigate: (page: AppPage, extra?: unknown) => void;
}

const weekColors = {
  1: { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-700", dot: "bg-rose-400", header: "bg-rose-100" },
  2: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", dot: "bg-amber-400", header: "bg-amber-100" },
  3: { bg: "bg-teal-50", border: "border-teal-200", text: "text-teal-700", dot: "bg-teal-400", header: "bg-teal-100" },
  4: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", dot: "bg-purple-400", header: "bg-purple-100" },
};

export default function Journey({ onNavigate }: JourneyProps) {
  const { state } = useApp();
  const [expandedWeek, setExpandedWeek] = useState<number>(
    weekModules.find(w => {
      const days = dailyContent.filter(d => d.week === w.week);
      return days.some(d => d.day === state.currentDay);
    })?.week || 1
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl text-[#2C1810] mb-1">Sua Jornada</h1>
        <p className="text-[#8B6E5A] text-sm">
          {state.completedDays.length} de 30 dias concluídos
        </p>
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-[#F0E4DC] p-3 sm:p-5 shadow-sm">
        <div className="flex justify-between text-sm text-[#8B6E5A] mb-2">
          <span>Progresso total</span>
          <span className="font-medium text-[#C4856A]">{Math.round((state.completedDays.length / 30) * 100)}%</span>
        </div>
        <div className="h-2 bg-[#F0E4DC] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#C4856A] to-[#E8A090] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(state.completedDays.length / 30) * 100}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        {/* Day dots */}
        <div className="mt-3 sm:mt-4 grid grid-cols-10 gap-0.5 sm:gap-1">
          {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
            <div
              key={day}
              className={`w-5 h-5 sm:w-6 sm:h-6 mx-auto rounded-full flex items-center justify-center text-[9px] sm:text-[10px] font-bold transition-all ${
                state.completedDays.includes(day)
                  ? "bg-[#C4856A] text-white"
                  : day === state.currentDay
                  ? "bg-[#F5EDE8] border-2 border-[#C4856A] text-[#C4856A]"
                  : day < state.currentDay
                  ? "bg-[#F0E4DC] text-[#B08070]"
                  : "bg-[#FAF6F1] text-[#D4C4BC]"
              }`}
            >
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* Weeks */}
      {weekModules.map(week => {
        const weekDays = dailyContent.filter(d => d.week === week.week);
        const completedCount = weekDays.filter(d => state.completedDays.includes(d.day)).length;
        const isExpanded = expandedWeek === week.week;
        const wc = weekColors[week.week as keyof typeof weekColors];
        const isLocked = week.week > 1 && !weekDays.some(d => d.day <= state.currentDay);

        return (
          <motion.div
            key={week.week}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (week.week - 1) * 0.08 }}
            className="bg-white rounded-xl sm:rounded-2xl border border-[#F0E4DC] shadow-sm overflow-hidden"
          >
            {/* Week Header */}
            <button
              onClick={() => setExpandedWeek(isExpanded ? 0 : week.week)}
              className={`w-full flex items-center justify-between p-3 sm:p-5 ${wc.header} transition-colors`}
            >
              <div className="flex items-center gap-2 sm:gap-3 text-left">
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full ${wc.dot} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                  {week.week}
                </div>
                <div>
                  <p className={`font-semibold text-sm ${wc.text}`}>{week.subtitle}</p>
                  <p className="font-serif text-base text-[#2C1810]">{week.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-medium ${wc.text}`}>{completedCount}/{weekDays.length}</span>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className={`w-5 h-5 ${wc.text}`}
                >
                  ↓
                </motion.div>
              </div>
            </button>

            {/* Week progress bar */}
            <div className="h-1 bg-[#F0E4DC]">
              <div
                className={`h-full ${wc.dot} transition-all duration-700`}
                style={{ width: `${(completedCount / weekDays.length) * 100}%` }}
              />
            </div>

            {/* Week description */}
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div className={`px-5 py-3 ${wc.bg} border-b border-[#F0E4DC]`}>
                  <p className="text-sm text-[#6B4C3B] leading-relaxed">{week.description}</p>
                </div>

                {/* Days list */}
                <div className="divide-y divide-[#F0E4DC]">
                  {weekDays.map(day => {
                    const isCompleted = state.completedDays.includes(day.day);
                    const isCurrent = day.day === state.currentDay;
                    const isAccessible = day.day <= state.currentDay;

                    return (
                      <button
                        key={day.day}
                        onClick={() => isAccessible && onNavigate("day", day.day)}
                        disabled={!isAccessible}
                        className={`w-full flex items-center gap-3 sm:gap-4 px-3 sm:px-5 py-3 sm:py-4 text-left transition-colors ${
                          isAccessible ? "hover:bg-[#FAF6F1]" : "opacity-50 cursor-not-allowed"
                        } ${isCurrent ? "bg-[#FAF6F1]" : ""}`}
                      >
                        <div className="flex-shrink-0">
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-[#C4856A]" />
                          ) : isCurrent ? (
                            <div className="w-5 h-5 rounded-full border-2 border-[#C4856A] bg-[#F5EDE8]" />
                          ) : isAccessible ? (
                            <Circle className="w-5 h-5 text-[#D4C4BC]" />
                          ) : (
                            <Lock className="w-4 h-4 text-[#D4C4BC]" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs text-[#B08070] font-medium">Dia {day.day}</span>
                            <span className="text-[#E8D5CC]">·</span>
                            <span className="text-xs text-[#B08070]">{day.theme}</span>
                            {isCurrent && (
                              <span className="text-[10px] bg-[#C4856A] text-white px-2 py-0.5 rounded-full font-medium">
                                Hoje
                              </span>
                            )}
                          </div>
                          <p className={`text-sm font-medium truncate ${
                            isAccessible ? "text-[#2C1810]" : "text-[#B08070]"
                          }`}>
                            {day.title}
                          </p>
                        </div>
                        {isCurrent && (
                          <span className="text-[#C4856A] text-sm">→</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
