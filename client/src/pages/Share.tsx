import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle } from "lucide-react";
import { useApp } from "@/app/store";
import { achievements, DAY_COUNT, getDay } from "@/journey";
import ShareInstagramButton from "@/share/ShareInstagramButton";

type Tab = "dias" | "conquistas" | "progresso";

export default function Share() {
  const { state, completedDays, currentDay, progressPercent } = useApp();
  const mood = state.days[currentDay]?.mood ?? 3;
  const [tab, setTab] = useState<Tab>("dias");

  const unlocked = achievements.filter(achievement =>
    state.unlockedAchievements.includes(achievement.id)
  );
  const newestFirst = [...completedDays].sort((a, b) => b - a);

  const tabs: {
    id: Tab;
    label: string;
    short: string;
    icon: string;
    count: number;
  }[] = [
    {
      id: "dias",
      label: "Dias Completados",
      short: "Dias",
      icon: "📅",
      count: completedDays.length,
    },
    {
      id: "conquistas",
      label: "Conquistas",
      short: "Conquistas",
      icon: "🏆",
      count: unlocked.length,
    },
    {
      id: "progresso",
      label: "Progresso Geral",
      short: "Progresso",
      icon: "📊",
      count: 1,
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl text-[#2C1810] mb-1">
          Compartilhe sua jornada
        </h1>
        <p className="text-[#8B6E5A] text-sm">
          Inspire outras mulheres com sua transformação
        </p>
      </div>

      <div className="flex gap-1 sm:gap-2 border-b border-[#E8D5CC] overflow-x-auto scrollbar-hide">
        {tabs.map(item => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
              tab === item.id
                ? "border-[#C4856A] text-[#C4856A]"
                : "border-transparent text-[#B08070] hover:text-[#8B6E5A]"
            }`}
          >
            <span>{item.icon}</span>{" "}
            <span className="hidden sm:inline">{item.label}</span>
            <span className="sm:hidden">{item.short}</span>{" "}
            <span className="text-xs ml-1">({item.count})</span>
          </button>
        ))}
      </div>

      {tab === "dias" &&
        (newestFirst.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-[#F5EDE8] flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-7 h-7 text-[#C4856A]" />
            </div>
            <p className="font-serif text-lg text-[#2C1810] mb-2">
              Nenhum dia completado ainda
            </p>
            <p className="text-[#8B6E5A] text-sm">
              Complete um dia para começar a compartilhar
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {newestFirst.map((dayNumber, index) => {
              const day = getDay(dayNumber);
              return (
                <motion.div
                  key={dayNumber}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl border border-[#F0E4DC] p-4 shadow-sm flex items-center justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#2C1810] text-sm truncate">
                      Dia {dayNumber}
                    </p>
                    <p className="text-xs text-[#8B6E5A] truncate">
                      {day.theme}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <ShareInstagramButton
                      subject={{
                        kind: "day",
                        day: dayNumber,
                        mood: state.days[dayNumber]?.mood ?? 3,
                      }}
                      size="sm"
                      variant="primary"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        ))}

      {tab === "conquistas" &&
        (unlocked.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-[#F5EDE8] flex items-center justify-center mx-auto mb-4">
              <Heart className="w-7 h-7 text-[#C4856A]" />
            </div>
            <p className="font-serif text-lg text-[#2C1810] mb-2">
              Nenhuma conquista desbloqueada
            </p>
            <p className="text-[#8B6E5A] text-sm">
              Continue a jornada para desbloquear conquistas
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {unlocked.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl border border-[#F0E4DC] p-4 shadow-sm flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-[#F5EDE8] flex items-center justify-center text-xl flex-shrink-0">
                    {achievement.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-[#2C1810] text-sm truncate">
                      {achievement.title}
                    </p>
                    <p className="text-xs text-[#8B6E5A] truncate">
                      {achievement.description}
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <ShareInstagramButton
                    subject={{
                      kind: "achievement",
                      achievement: {
                        title: achievement.title,
                        description: achievement.description,
                      },
                    }}
                    size="sm"
                    variant="primary"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        ))}

      {tab === "progresso" && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="bg-white rounded-2xl border border-[#F0E4DC] p-4 text-center shadow-sm">
              <p className="text-2xl font-serif font-bold text-[#C4856A] mb-1">
                {completedDays.length}
              </p>
              <p className="text-xs text-[#8B6E5A]">Dias</p>
            </div>
            <div className="bg-white rounded-2xl border border-[#F0E4DC] p-4 text-center shadow-sm">
              <p className="text-2xl font-serif font-bold text-[#C4856A] mb-1">
                {progressPercent}%
              </p>
              <p className="text-xs text-[#8B6E5A]">Progresso</p>
            </div>
            <div className="bg-white rounded-2xl border border-[#F0E4DC] p-4 text-center shadow-sm">
              <p className="text-2xl font-serif font-bold text-[#C4856A] mb-1">
                {unlocked.length}
              </p>
              <p className="text-xs text-[#8B6E5A]">Conquistas</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#F5EDE8] to-[#FAF6F1] rounded-2xl border border-[#E8D5CC] p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-[#2C1810] mb-2">
                Compartilhe seu progresso
              </h3>
              <p className="text-sm text-[#8B6E5A] mb-4">
                Inspire outras mulheres com sua transformação
              </p>
            </div>

            <ShareInstagramButton
              subject={{ kind: "progress", completedDays }}
              variant="primary"
            />

            {completedDays.length >= DAY_COUNT && (
              <ShareInstagramButton
                subject={{ kind: "journey", mood }}
                variant="primary"
              />
            )}
          </div>

          <div className="bg-[#F5EDE8] rounded-xl p-4 border border-[#E8D5CC]">
            <p className="text-sm text-[#6B4C3B] leading-relaxed">
              💫 <strong>Cada compartilhamento é um ato de coragem.</strong>{" "}
              Quando você compartilha sua jornada, você não apenas celebra sua
              transformação — você também abre caminho para que outras mulheres
              encontrem sua própria força.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
