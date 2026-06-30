// OUSE SER VOCÊ – Conquistas
import { useState } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/contexts/AppContext";
import { achievements } from "@/lib/journeyData";
import { Trophy, Download } from "lucide-react";
import ShareInstagramButton from "@/components/ShareInstagramButton";
import AchievementImageModal from "@/components/AchievementImageModal";

export default function Achievements() {
  const { state } = useApp();
  const [selectedAchievement, setSelectedAchievement] = useState<string | null>(null);
  const unlocked = state.unlockedAchievements;

  const unlockedList = achievements.filter(a => unlocked.includes(a.id));
  const lockedList = achievements.filter(a => !unlocked.includes(a.id));

  const selectedAchievementData = selectedAchievement
    ? achievements.find(a => a.id === selectedAchievement)
    : null;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl text-[#2C1810] mb-1">Conquistas</h1>
        <p className="text-[#8B6E5A] text-sm">{unlocked.length} de {achievements.length} desbloqueadas</p>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-[#F0E4DC] p-3 sm:p-5 shadow-sm">
        <div className="flex justify-between text-sm text-[#8B6E5A] mb-2">
          <span>Progresso</span>
          <span className="font-medium text-[#C4856A]">{unlocked.length}/{achievements.length}</span>
        </div>
        <div className="h-2 bg-[#F0E4DC] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#C4856A] to-[#E8A090] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(unlocked.length / achievements.length) * 100}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Unlocked */}
      {unlockedList.length > 0 && (
        <div>
          <h2 className="font-semibold text-[#2C1810] mb-3">Desbloqueadas</h2>
          <div className="space-y-3">
            {unlockedList.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-white rounded-xl sm:rounded-2xl border border-[#F0E4DC] p-3 sm:p-5 shadow-sm flex items-center gap-3 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-[#F5EDE8] flex items-center justify-center text-2xl flex-shrink-0">
                  {a.icon}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[#2C1810] text-sm">{a.title}</p>
                  <p className="text-xs text-[#8B6E5A] mt-0.5 leading-relaxed">{a.description}</p>
                </div>
                <div className="flex-shrink-0 flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={() => setSelectedAchievement(a.id)}
                    className="p-2 hover:bg-[#F5EDE8] rounded-lg transition-colors text-[#C4856A]"
                    title="Gerar imagem para Stories"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <div className="hidden sm:block">
                    <ShareInstagramButton
                      type="achievement"
                      achievementName={a.title}
                      achievementDescription={a.description}
                      size="sm"
                      variant="secondary"
                    />
                  </div>
                  <div className="w-6 h-6 rounded-full bg-[#C4856A] flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Locked */}
      {lockedList.length > 0 && (
        <div>
          <h2 className="font-semibold text-[#2C1810] mb-3">Ainda por desbloquear</h2>
          <div className="space-y-3">
            {lockedList.map(a => (
              <div
                key={a.id}
                className="bg-white rounded-2xl border border-[#F0E4DC] p-5 flex items-center gap-4 opacity-50"
              >
                <div className="w-12 h-12 rounded-xl bg-[#F0E4DC] flex items-center justify-center text-2xl flex-shrink-0 grayscale">
                  {a.icon}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[#6B4C3B] text-sm">{a.title}</p>
                  <p className="text-xs text-[#B08070] mt-0.5 leading-relaxed">{a.description}</p>
                </div>
                <div className="ml-auto flex-shrink-0">
                  <div className="w-6 h-6 rounded-full bg-[#F0E4DC] flex items-center justify-center">
                    <span className="text-[#B08070] text-xs">🔒</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {unlockedList.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-[#F5EDE8] flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-7 h-7 text-[#C4856A]" />
          </div>
          <p className="font-serif text-lg text-[#2C1810] mb-2">Suas conquistas aparecem aqui</p>
          <p className="text-[#8B6E5A] text-sm max-w-xs mx-auto">
            Complete os dias da jornada para desbloquear conquistas.
          </p>
        </div>
      )}

      {/* Achievement Image Modal */}
      {selectedAchievementData && (
        <AchievementImageModal
          isOpen={!!selectedAchievement}
          onClose={() => setSelectedAchievement(null)}
          achievement={selectedAchievementData}
          accentColor="#C4856A"
        />
      )}
    </div>
  );
}
