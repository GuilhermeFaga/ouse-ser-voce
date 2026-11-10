import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Flame,
  Sparkles,
  Star,
} from "lucide-react";
import { useApp } from "@/app/store";
import { useNavigation } from "@/app/navigation";
import { IMAGES } from "@/app/assets";
import {
  achievements,
  DAY_COUNT,
  dailyQuotes,
  getDay,
  weekModules,
  weekOfDay,
  weekProgress,
} from "@/journey";
import { writtenDaysOf } from "@/app/state";
import ShareInstagramButton from "@/share/ShareInstagramButton";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" as const, delay },
});

function getGreeting() {
  const hours = new Date().getHours();
  if (hours < 12) return "Bom dia";
  if (hours < 18) return "Boa tarde";
  return "Boa noite";
}

export default function Dashboard() {
  const { state, completedDays, currentDay, currentStreak, progressPercent } =
    useApp();
  const { navigate, openDay } = useNavigation();
  const { scanner, unlockedAchievements } = state;

  const day = getDay(currentDay);
  const week = weekOfDay(currentDay);
  const quote = dailyQuotes[(currentDay - 1) % dailyQuotes.length];
  const todayCompleted = completedDays.includes(currentDay);
  const unlocked = unlockedAchievements;

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <motion.div {...fadeUp()}>
        <p className="text-[#B08070] text-sm mb-1">
          {getGreeting()}, {state.userName}
        </p>
        <h1 className="font-serif text-2xl lg:text-3xl text-[#2C1810] leading-tight">
          {todayCompleted
            ? "Você completou o dia de hoje."
            : "Como está seu coração hoje?"}
        </h1>
      </motion.div>

      <motion.div
        {...fadeUp(0.05)}
        className="relative overflow-hidden rounded-2xl"
      >
        <div className="absolute inset-0">
          <img
            src={IMAGES.meditation}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2C1810]/80 to-[#2C1810]/40" />
        </div>
        <div className="relative p-6 lg:p-8">
          <p className="text-[#F5EDE8] text-xs uppercase tracking-widest mb-3 font-medium">
            Frase do dia
          </p>
          <p className="font-serif text-xl lg:text-2xl text-white leading-relaxed italic">
            "{quote}"
          </p>
          <p className="text-[#E8D5CC] text-sm mt-3">— Soraya Farias</p>
        </div>
      </motion.div>

      <motion.div
        {...fadeUp(0.1)}
        className="bg-white rounded-2xl border border-[#F0E4DC] shadow-sm overflow-hidden"
      >
        <div
          className={`px-6 py-3 ${week.palette.bg} border-b ${week.palette.border} flex items-center gap-2`}
        >
          <div className={`w-2 h-2 rounded-full ${week.palette.dot}`} />
          <span className={`text-xs font-medium ${week.palette.text}`}>
            {week.subtitle} — {week.title}
          </span>
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-[#B08070] font-medium uppercase tracking-wide">
                  Dia {day.day}
                </span>
                <span className="text-[#E8D5CC]">·</span>
                <span className="text-xs text-[#B08070]">{day.theme}</span>
              </div>
              <h2 className="font-serif text-lg lg:text-xl text-[#2C1810] leading-snug mb-2">
                {day.title}
              </h2>
              <p className="text-[#8B6E5A] text-sm leading-relaxed line-clamp-2">
                {day.soraiaMessage}
              </p>
            </div>
            {todayCompleted && (
              <div className="flex-shrink-0">
                <CheckCircle2 className="w-8 h-8 text-[#C4856A]" />
              </div>
            )}
          </div>
          <button
            onClick={() => openDay(currentDay)}
            className="mt-4 w-full flex items-center justify-center gap-2 h-11 bg-[#C4856A] hover:bg-[#B07055] text-white rounded-xl font-medium text-sm transition-all duration-200 active:scale-[0.97] shadow-sm"
          >
            {todayCompleted ? "Revisar o dia" : "Começar o dia"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      <motion.div {...fadeUp(0.15)} className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-[#F0E4DC] p-4 text-center shadow-sm">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Flame className="w-4 h-4 text-[#C4856A]" />
          </div>
          <p className="font-serif text-2xl font-bold text-[#C4856A]">
            {currentStreak}
          </p>
          <p className="text-xs text-[#8B6E5A] mt-0.5">Dias seguidos</p>
        </div>
        <div className="bg-white rounded-xl border border-[#F0E4DC] p-4 text-center shadow-sm">
          <div className="flex items-center justify-center gap-1 mb-1">
            <BookOpen className="w-4 h-4 text-[#C4856A]" />
          </div>
          <p className="font-serif text-2xl font-bold text-[#C4856A]">
            {writtenDaysOf(state).length}
          </p>
          <p className="text-xs text-[#8B6E5A] mt-0.5">Entradas no diário</p>
        </div>
        <div className="bg-white rounded-xl border border-[#F0E4DC] p-4 text-center shadow-sm">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Star className="w-4 h-4 text-[#C4856A]" />
          </div>
          <p className="font-serif text-2xl font-bold text-[#C4856A]">
            {unlocked.length}
          </p>
          <p className="text-xs text-[#8B6E5A] mt-0.5">Conquistas</p>
        </div>
      </motion.div>

      <motion.div
        {...fadeUp(0.2)}
        className="bg-white rounded-2xl border border-[#F0E4DC] p-6 shadow-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[#2C1810]">Sua jornada</h3>
          <div className="flex items-center gap-2">
            <ShareInstagramButton
              subject={{ kind: "progress", completedDays }}
              size="sm"
              variant="secondary"
            />
            <span className="text-sm text-[#C4856A] font-medium">
              {completedDays.length}/{DAY_COUNT} dias
            </span>
          </div>
        </div>
        <div className="h-2 bg-[#F0E4DC] rounded-full overflow-hidden mb-4">
          <motion.div
            className="h-full bg-gradient-to-r from-[#C4856A] to-[#E8A090] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {weekModules.map(module => {
            const progress = weekProgress(module.week, completedDays);
            return (
              <div key={module.week} className="text-center">
                <div
                  className={`h-1.5 rounded-full ${module.palette.bg} border ${module.palette.border} overflow-hidden mb-1`}
                >
                  <div
                    className={`h-full ${module.palette.dot} rounded-full transition-all duration-700`}
                    style={{ width: `${progress.percent}%` }}
                  />
                </div>
                <p className="text-[10px] text-[#B08070]">
                  S{module.week} · {module.shortTitle}
                </p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {!scanner && (
        <motion.div
          {...fadeUp(0.25)}
          className="bg-gradient-to-br from-[#F5EDE8] to-[#FAF6F1] rounded-2xl border border-[#E8D5CC] p-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#C4856A]/10 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-[#C4856A]" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[#2C1810] mb-1">
                Scanner de Essência
              </h3>
              <p className="text-sm text-[#8B6E5A] leading-relaxed">
                Descubra seu nível de autoabandono e a área mais crítica para
                trabalhar agora.
              </p>
              <button
                onClick={() => navigate("scanner")}
                className="mt-3 text-sm text-[#C4856A] font-semibold flex items-center gap-1 hover:gap-2 transition-all"
              >
                Fazer o diagnóstico <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {recentAchievements(unlocked).length > 0 && (
        <motion.div
          {...fadeUp(0.3)}
          className="bg-white rounded-2xl border border-[#F0E4DC] p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#2C1810]">
              Conquistas recentes
            </h3>
            <button
              onClick={() => navigate("achievements")}
              className="text-xs text-[#C4856A] font-medium"
            >
              Ver todas
            </button>
          </div>
          <div className="space-y-3">
            {recentAchievements(unlocked).map(achievement => (
              <div key={achievement.id} className="flex items-center gap-3">
                <span className="text-2xl">{achievement.icon}</span>
                <div>
                  <p className="text-sm font-medium text-[#2C1810]">
                    {achievement.title}
                  </p>
                  <p className="text-xs text-[#8B6E5A]">
                    {achievement.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function recentAchievements(unlocked: string[]) {
  return achievements.filter(a => unlocked.includes(a.id)).slice(-3);
}
