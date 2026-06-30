// OUSE SER VOCÊ – Página de Compartilhamento
// Histórico de compartilhamentos e estatísticas de engajamento

import { useState } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/contexts/AppContext";
import { dailyContent, weekModules, achievements } from "@/lib/journeyData";
import { MessageCircle, Share2, TrendingUp, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShareWhatsAppButton from "@/components/ShareWhatsAppButton";
import type { AppPage } from "@/components/AppLayout";

interface SharePageProps {
  onNavigate: (page: AppPage, extra?: unknown) => void;
}

export default function Share({ onNavigate }: SharePageProps) {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState<"dias" | "conquistas" | "progresso">("dias");

  const completedDays = state.completedDays.sort((a, b) => b - a);
  const unlockedAchievements = achievements.filter(a => state.unlockedAchievements.includes(a.id));

  const tabs = [
    { id: "dias", label: "Dias Completados", icon: "📅", count: completedDays.length },
    { id: "conquistas", label: "Conquistas", icon: "🏆", count: unlockedAchievements.length },
    { id: "progresso", label: "Progresso Geral", icon: "📊", count: 1 },
  ];

  const progressPercent = Math.round((state.completedDays.length / 30) * 100);
  const currentWeek = weekModules.find(w => {
    const weekDays = dailyContent.filter(d => d.week === w.week);
    return weekDays.some(d => d.day === state.currentDay);
  });

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl lg:text-3xl text-[#2C1810] mb-1">Compartilhe sua jornada</h1>
        <p className="text-[#8B6E5A] text-sm">Inspire outras mulheres com sua transformação</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#E8D5CC] overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
              activeTab === tab.id
                ? "border-[#C4856A] text-[#C4856A]"
                : "border-transparent text-[#B08070] hover:text-[#8B6E5A]"
            }`}
          >
            <span>{tab.icon}</span> {tab.label} <span className="text-xs ml-1">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Dias Completados */}
      {activeTab === "dias" && (
        <div className="space-y-3">
          {completedDays.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-[#F5EDE8] flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-7 h-7 text-[#C4856A]" />
              </div>
              <p className="font-serif text-lg text-[#2C1810] mb-2">Nenhum dia completado ainda</p>
              <p className="text-[#8B6E5A] text-sm">Complete um dia para começar a compartilhar</p>
            </div>
          ) : (
            completedDays.map((dayNum, idx) => {
              const day = dailyContent.find(d => d.day === dayNum);
              if (!day) return null;
              return (
                <motion.div
                  key={dayNum}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-2xl border border-[#F0E4DC] p-4 shadow-sm flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-[#2C1810] text-sm">Dia {dayNum}</p>
                    <p className="text-xs text-[#8B6E5A]">{day.theme}</p>
                  </div>
                  <ShareWhatsAppButton
                    type="day"
                    dayNumber={dayNum}
                    theme={day.theme}
                    mood={3}
                    size="sm"
                    variant="primary"
                  />
                </motion.div>
              );
            })
          )}
        </div>
      )}

      {/* Conquistas */}
      {activeTab === "conquistas" && (
        <div className="space-y-3">
          {unlockedAchievements.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-[#F5EDE8] flex items-center justify-center mx-auto mb-4">
                <Heart className="w-7 h-7 text-[#C4856A]" />
              </div>
              <p className="font-serif text-lg text-[#2C1810] mb-2">Nenhuma conquista desbloqueada</p>
              <p className="text-[#8B6E5A] text-sm">Continue a jornada para desbloquear conquistas</p>
            </div>
          ) : (
            unlockedAchievements.map((achievement, idx) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-2xl border border-[#F0E4DC] p-4 shadow-sm flex items-center justify-between"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-[#F5EDE8] flex items-center justify-center text-xl flex-shrink-0">
                    {achievement.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-[#2C1810] text-sm">{achievement.title}</p>
                    <p className="text-xs text-[#8B6E5A]">{achievement.description}</p>
                  </div>
                </div>
                <ShareWhatsAppButton
                  type="achievement"
                  achievementName={achievement.title}
                  achievementDescription={achievement.description}
                  size="sm"
                  variant="primary"
                />
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Progresso Geral */}
      {activeTab === "progresso" && (
        <div className="space-y-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-2xl border border-[#F0E4DC] p-4 text-center shadow-sm">
              <p className="text-2xl font-serif font-bold text-[#C4856A] mb-1">{state.completedDays.length}</p>
              <p className="text-xs text-[#8B6E5A]">Dias</p>
            </div>
            <div className="bg-white rounded-2xl border border-[#F0E4DC] p-4 text-center shadow-sm">
              <p className="text-2xl font-serif font-bold text-[#C4856A] mb-1">{progressPercent}%</p>
              <p className="text-xs text-[#8B6E5A]">Progresso</p>
            </div>
            <div className="bg-white rounded-2xl border border-[#F0E4DC] p-4 text-center shadow-sm">
              <p className="text-2xl font-serif font-bold text-[#C4856A] mb-1">{unlockedAchievements.length}</p>
              <p className="text-xs text-[#8B6E5A]">Conquistas</p>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="bg-gradient-to-br from-[#F5EDE8] to-[#FAF6F1] rounded-2xl border border-[#E8D5CC] p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-[#2C1810] mb-2">Compartilhe seu progresso</h3>
              <p className="text-sm text-[#8B6E5A] mb-4">Inspire outras mulheres com sua transformação</p>
            </div>

            {currentWeek && (
              <ShareWhatsAppButton
                type="progress"
                completedDays={state.completedDays.length}
                totalDays={30}
                currentWeek={currentWeek.week}
                weekTheme={currentWeek.theme}
                variant="primary"
              />
            )}

            {state.completedDays.length === 30 && (
              <ShareWhatsAppButton
                type="journey"
                finalMood={3}
                variant="primary"
              />
            )}
          </div>

          {/* Motivational Message */}
          <div className="bg-[#F5EDE8] rounded-xl p-4 border border-[#E8D5CC]">
            <p className="text-sm text-[#6B4C3B] leading-relaxed">
              💫 <strong>Cada compartilhamento é um ato de coragem.</strong> Quando você compartilha sua jornada, você não apenas celebra sua transformação — você também abre caminho para que outras mulheres encontrem sua própria força.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
