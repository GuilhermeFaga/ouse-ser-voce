// OUSE SER VOCÊ – Calendário de Evolução
import { useState } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/contexts/AppContext";
import { dailyContent } from "@/lib/journeyData";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

const moodEmojis = ["", "😔", "😕", "😐", "🙂", "😊"];
const moodColors = [
  "",
  "bg-red-100",
  "bg-orange-100",
  "bg-yellow-100",
  "bg-green-100",
  "bg-emerald-100",
];

export default function CalendarView() {
  const { state } = useApp();
  const [selectedDay, setSelectedDay] = useState<number | null>(
    state.currentDay
  );

  const selectedDayContent = selectedDay
    ? dailyContent.find(d => d.day === selectedDay)
    : null;
  const selectedCheckin = selectedDay ? state.checkins[selectedDay] : null;

  // Build 30-day grid
  const startDate = state.startDate ? new Date(state.startDate) : new Date();
  const days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    return {
      day: i + 1,
      date,
      completed: state.completedDays.includes(i + 1),
      isCurrent: i + 1 === state.currentDay,
      checkin: state.checkins[i + 1],
    };
  });

  // Group by weeks
  const weeks: (typeof days)[] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const weekLabels = [
    "S1 · Autoconhecimento",
    "S2 · Desapego",
    "S3 · Autoconfiança",
    "S4 · Transformação",
  ];

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="font-serif text-2xl lg:text-3xl text-[#2C1810] mb-1">
          Calendário de Evolução
        </h1>
        <p className="text-[#8B6E5A] text-sm">
          {state.completedDays.length} dias concluídos
        </p>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-2xl border border-[#F0E4DC] shadow-sm overflow-hidden">
        {weeks.map((week, wi) => (
          <div key={wi}>
            <div className="px-4 py-2 bg-[#FAF6F1] border-b border-[#F0E4DC]">
              <p className="text-xs font-medium text-[#8B6E5A]">
                {weekLabels[wi]}
              </p>
            </div>
            <div className="grid grid-cols-7 divide-x divide-[#F0E4DC]">
              {week.map(({ day, date, completed, isCurrent, checkin }) => (
                <button
                  key={day}
                  onClick={() =>
                    setSelectedDay(day === selectedDay ? null : day)
                  }
                  className={`p-2 flex flex-col items-center gap-1 transition-colors min-h-[64px] ${
                    selectedDay === day ? "bg-[#F5EDE8]" : "hover:bg-[#FAF6F1]"
                  } ${day > state.currentDay ? "opacity-40" : ""}`}
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
                        : isCurrent
                          ? "border-2 border-[#C4856A] text-[#C4856A]"
                          : "text-[#6B4C3B]"
                    }`}
                  >
                    {day}
                  </div>
                  {checkin && (
                    <span className="text-base leading-none">
                      {moodEmojis[checkin.mood]}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
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

      {/* Selected Day Detail */}
      {selectedDay && selectedDayContent && (
        <motion.div
          key={selectedDay}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-[#F0E4DC] p-6 shadow-sm"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs text-[#B08070] mb-1">
                Dia {selectedDay} · {selectedDayContent.theme}
              </p>
              <h3 className="font-serif text-lg text-[#2C1810]">
                {selectedDayContent.title}
              </h3>
            </div>
            {state.completedDays.includes(selectedDay) && (
              <CheckCircle2 className="w-6 h-6 text-[#C4856A] flex-shrink-0" />
            )}
          </div>

          {selectedCheckin ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {moodEmojis[selectedCheckin.mood]}
                </span>
                <div>
                  <p className="text-xs text-[#B08070]">Humor neste dia</p>
                  <p className="text-sm font-medium text-[#4A3728]">
                    {
                      [
                        "",
                        "Muito pesado",
                        "Pesado",
                        "Neutro",
                        "Leve",
                        "Muito leve",
                      ][selectedCheckin.mood]
                    }
                  </p>
                </div>
              </div>
              {selectedCheckin.notes && (
                <div className="bg-[#FAF6F1] rounded-xl p-3">
                  <p className="text-sm text-[#4A3728] leading-relaxed">
                    {selectedCheckin.notes}
                  </p>
                </div>
              )}
              <div className="flex gap-4 text-xs text-[#8B6E5A]">
                {selectedCheckin.exerciseCompleted && (
                  <span>✓ Exercício feito</span>
                )}
                {selectedCheckin.meditationListened && (
                  <span>✓ Meditação ouvida</span>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-[#8B6E5A]">
              {selectedDay < state.currentDay
                ? "Dia não registrado."
                : selectedDay === state.currentDay
                  ? "Você ainda não concluiu este dia."
                  : "Este dia ainda não chegou."}
            </p>
          )}
        </motion.div>
      )}

      {/* Mood Summary */}
      {Object.keys(state.checkins).length > 0 && (
        <div className="bg-white rounded-2xl border border-[#F0E4DC] p-6 shadow-sm">
          <h3 className="font-semibold text-[#2C1810] mb-4">
            Evolução do humor
          </h3>
          <div className="flex items-end gap-1 h-16">
            {Array.from({ length: 30 }, (_, i) => {
              const checkin = state.checkins[i + 1];
              const height = checkin ? (checkin.mood / 5) * 100 : 0;
              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center justify-end"
                >
                  <div
                    className={`w-full rounded-t-sm transition-all ${
                      checkin ? moodColors[checkin.mood] : "bg-[#F0E4DC]"
                    }`}
                    style={{ height: `${Math.max(height, checkin ? 20 : 8)}%` }}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-xs text-[#B08070] mt-1">
            <span>Dia 1</span>
            <span>Dia 30</span>
          </div>
        </div>
      )}
    </div>
  );
}
