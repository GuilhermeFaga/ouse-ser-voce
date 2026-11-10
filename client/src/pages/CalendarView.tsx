import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useApp } from "@/app/store";
import {
  DAY_COUNT,
  daysOfWeek,
  getDay,
  moodEmoji,
  moodLabel,
  weekModules,
} from "@/journey";
import { dateOfDay } from "@/lib/dates";

export default function CalendarView() {
  const { state, currentDay, completedDays } = useApp();
  const [selectedDay, setSelectedDay] = useState<number | null>(currentDay);

  const selected = selectedDay ? state.days[selectedDay] : undefined;
  const selectedContent = selectedDay ? getDay(selectedDay) : null;

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="font-serif text-2xl lg:text-3xl text-[#2C1810] mb-1">
          Calendário de Evolução
        </h1>
        <p className="text-[#8B6E5A] text-sm">
          {completedDays.length} dias concluídos
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#F0E4DC] shadow-sm overflow-hidden">
        {weekModules.map(module => (
          <div key={module.week}>
            <div className="px-4 py-2 bg-[#FAF6F1] border-b border-[#F0E4DC]">
              <p className="text-xs font-medium text-[#8B6E5A]">
                S{module.week} · {module.shortTitle}
              </p>
            </div>
            <div className="grid grid-cols-7 divide-x divide-[#F0E4DC]">
              {daysOfWeek(module.week).map(content => {
                const date = dateOfDay(state.startDate, content.day);
                const record = state.days[content.day];
                const completed = record?.completedAt != null;
                return (
                  <button
                    key={content.day}
                    onClick={() =>
                      setSelectedDay(
                        content.day === selectedDay ? null : content.day
                      )
                    }
                    className={`p-2 flex flex-col items-center gap-1 transition-colors min-h-[64px] ${
                      selectedDay === content.day
                        ? "bg-[#F5EDE8]"
                        : "hover:bg-[#FAF6F1]"
                    } ${content.day > currentDay ? "opacity-40" : ""}`}
                  >
                    <span className="text-[10px] text-[#B08070]">
                      {date
                        .toLocaleDateString("pt-BR", { weekday: "short" })
                        .slice(0, 3)}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        completed
                          ? "bg-[#C4856A] text-white"
                          : content.day === currentDay
                            ? "border-2 border-[#C4856A] text-[#C4856A]"
                            : "text-[#6B4C3B]"
                      }`}
                    >
                      {content.day}
                    </div>
                    {completed && record && (
                      <span className="text-base leading-none">
                        {moodEmoji(record.mood)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-[#C4856A]" />
          <span className="text-xs text-[#8B6E5A]">Concluído</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full border-2 border-[#C4856A]" />
          <span className="text-xs text-[#8B6E5A]">Hoje</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-base">😊</span>
          <span className="text-xs text-[#8B6E5A]">Humor registrado</span>
        </div>
      </div>

      {selectedDay && selectedContent && (
        <motion.div
          key={selectedDay}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-[#F0E4DC] p-6 shadow-sm"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs text-[#B08070] mb-1">
                Dia {selectedDay} · {selectedContent.theme}
              </p>
              <h3 className="font-serif text-lg text-[#2C1810]">
                {selectedContent.title}
              </h3>
            </div>
            {completedDays.includes(selectedDay) && (
              <CheckCircle2 className="w-6 h-6 text-[#C4856A] flex-shrink-0" />
            )}
          </div>

          {selected?.completedAt ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{moodEmoji(selected.mood)}</span>
                <div>
                  <p className="text-xs text-[#B08070]">Humor neste dia</p>
                  <p className="text-sm font-medium text-[#4A3728]">
                    {moodLabel(selected.mood)}
                  </p>
                </div>
              </div>
              {selected.notes.trim() && (
                <div className="bg-[#FAF6F1] rounded-xl p-3">
                  <p className="text-sm text-[#4A3728] leading-relaxed">
                    {selected.notes}
                  </p>
                </div>
              )}
              <div className="flex gap-4 text-xs text-[#8B6E5A]">
                {selected.exerciseCompleted && <span>✓ Exercício feito</span>}
                {selected.meditationListened && <span>✓ Meditação ouvida</span>}
              </div>
            </div>
          ) : (
            <p className="text-sm text-[#8B6E5A]">
              {selectedDay < currentDay
                ? "Dia não registrado."
                : selectedDay === currentDay
                  ? "Você ainda não concluiu este dia."
                  : "Este dia ainda não chegou."}
            </p>
          )}
        </motion.div>
      )}

      {completedDays.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#F0E4DC] p-6 shadow-sm">
          <h3 className="font-semibold text-[#2C1810] mb-4">
            Evolução do humor
          </h3>
          <div className="flex items-end gap-1 h-16">
            {Array.from({ length: DAY_COUNT }, (_, index) => {
              const record = state.days[index + 1];
              const completed = record?.completedAt != null;
              const height = completed ? (record.mood / 5) * 100 : 0;
              return (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center justify-end"
                  title={`Dia ${index + 1}`}
                >
                  <div
                    className="w-full rounded-t-sm transition-all bg-[#C4856A]"
                    style={{
                      height: `${completed ? Math.max(height, 20) : 8}%`,
                      opacity: completed ? 0.4 + (record.mood / 5) * 0.6 : 0.15,
                    }}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-xs text-[#B08070] mt-1">
            <span>Dia 1</span>
            <span>Dia {DAY_COUNT}</span>
          </div>
        </div>
      )}
    </div>
  );
}
