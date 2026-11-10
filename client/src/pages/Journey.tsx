import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Lock } from "lucide-react";
import { useApp } from "@/app/store";
import { useNavigation } from "@/app/navigation";
import {
  DAY_COUNT,
  daysOfWeek,
  isDayAccessible,
  weekModules,
  weekOfDay,
  weekProgress,
} from "@/journey";

export default function Journey() {
  const { currentDay, completedDays, progressPercent } = useApp();
  const { openDay } = useNavigation();
  const [expandedWeek, setExpandedWeek] = useState<number>(
    weekOfDay(currentDay).week
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl text-[#2C1810] mb-1">
          Sua Jornada
        </h1>
        <p className="text-[#8B6E5A] text-sm">
          {completedDays.length} de {DAY_COUNT} dias concluídos
        </p>
      </div>

      <div className="bg-white rounded-xl sm:rounded-2xl border border-[#F0E4DC] p-3 sm:p-5 shadow-sm">
        <div className="flex justify-between text-sm text-[#8B6E5A] mb-2">
          <span>Progresso total</span>
          <span className="font-medium text-[#C4856A]">{progressPercent}%</span>
        </div>
        <div className="h-2 bg-[#F0E4DC] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#C4856A] to-[#E8A090] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <div className="mt-3 sm:mt-4 grid grid-cols-10 gap-0.5 sm:gap-1">
          {Array.from({ length: DAY_COUNT }, (_, index) => index + 1).map(
            day => (
              <div
                key={day}
                className={`w-5 h-5 sm:w-6 sm:h-6 mx-auto rounded-full flex items-center justify-center text-[9px] sm:text-[10px] font-bold transition-all ${
                  completedDays.includes(day)
                    ? "bg-[#C4856A] text-white"
                    : day === currentDay
                      ? "bg-[#F5EDE8] border-2 border-[#C4856A] text-[#C4856A]"
                      : day < currentDay
                        ? "bg-[#F0E4DC] text-[#B08070]"
                        : "bg-[#FAF6F1] text-[#D4C4BC]"
                }`}
              >
                {day}
              </div>
            )
          )}
        </div>
      </div>

      {weekModules.map(module => {
        const weekDays = daysOfWeek(module.week);
        const progress = weekProgress(module.week, completedDays);
        const isExpanded = expandedWeek === module.week;
        return (
          <motion.div
            key={module.week}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (module.week - 1) * 0.08 }}
            className="bg-white rounded-xl sm:rounded-2xl border border-[#F0E4DC] shadow-sm overflow-hidden"
          >
            <button
              onClick={() => setExpandedWeek(isExpanded ? 0 : module.week)}
              className={`w-full flex items-center justify-between p-3 sm:p-5 ${module.palette.header} transition-colors`}
            >
              <div className="flex items-center gap-2 sm:gap-3 text-left">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full ${module.palette.dot} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                >
                  {module.week}
                </div>
                <div>
                  <p className={`font-semibold text-sm ${module.palette.text}`}>
                    {module.subtitle}
                  </p>
                  <p className="font-serif text-base text-[#2C1810]">
                    {module.title}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-medium ${module.palette.text}`}>
                  {progress.completed}/{progress.total}
                </span>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className={`w-5 h-5 ${module.palette.text}`}
                >
                  ↓
                </motion.div>
              </div>
            </button>

            <div className="h-1 bg-[#F0E4DC]">
              <div
                className={`h-full ${module.palette.dot} transition-all duration-700`}
                style={{ width: `${progress.percent}%` }}
              />
            </div>

            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.25 }}
              >
                <div
                  className={`px-5 py-3 ${module.palette.bg} border-b border-[#F0E4DC]`}
                >
                  <p className="text-sm text-[#6B4C3B] leading-relaxed">
                    {module.description}
                  </p>
                </div>

                <div className="divide-y divide-[#F0E4DC]">
                  {weekDays.map(day => {
                    const isCompleted = completedDays.includes(day.day);
                    const isCurrent = day.day === currentDay;
                    const isAccessible = isDayAccessible(day.day, currentDay);

                    return (
                      <button
                        key={day.day}
                        onClick={() => openDay(day.day)}
                        disabled={!isAccessible}
                        className={`w-full flex items-center gap-3 sm:gap-4 px-3 sm:px-5 py-3 sm:py-4 text-left transition-colors ${
                          isAccessible
                            ? "hover:bg-[#FAF6F1]"
                            : "opacity-50 cursor-not-allowed"
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
                            <span className="text-xs text-[#B08070] font-medium">
                              Dia {day.day}
                            </span>
                            <span className="text-[#E8D5CC]">·</span>
                            <span className="text-xs text-[#B08070]">
                              {day.theme}
                            </span>
                            {isCurrent && (
                              <span className="text-[10px] bg-[#C4856A] text-white px-2 py-0.5 rounded-full font-medium">
                                Hoje
                              </span>
                            )}
                          </div>
                          <p
                            className={`text-sm font-medium truncate ${
                              isAccessible ? "text-[#2C1810]" : "text-[#B08070]"
                            }`}
                          >
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
