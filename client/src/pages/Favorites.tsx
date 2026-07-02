// OUSE SER VOCÊ – Página de Áudios Favoritos
// Design: Lista de áudios salvos com acesso rápido para reprodução

import { Bookmark, Play, Trash2, Headphones } from "lucide-react";
import { useFavoriteAudios } from "@/hooks/useFavoriteAudios";
import { useApp } from "@/contexts/AppContext";
import { meditationAudios } from "@/lib/meditationAudios";
import { dailyContent } from "@/lib/journeyData";

interface FavoritesProps {
  onNavigate?: (
    page:
      | "day"
      | "home"
      | "journey"
      | "journal"
      | "notes"
      | "calendar"
      | "achievements"
      | "scanner"
      | "assessment"
      | "settings"
      | "share"
      | "community"
      | "favorites",
    extra?: unknown
  ) => void;
}

export default function Favorites({ onNavigate }: FavoritesProps) {
  const { favorites, removeFavorite } = useFavoriteAudios();
  const { updateState } = useApp();

  const handlePlayAudio = (day: number) => {
    updateState({ currentDay: day });
    if (onNavigate) onNavigate("day", day);
  };

  const sortedFavorites = [...favorites].sort((a, b) => a.day - b.day);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Bookmark className="w-5 h-5 text-[#C4856A] fill-[#C4856A]" />
          <h1 className="font-serif text-2xl text-[#2C1810]">Meus Favoritos</h1>
        </div>
        <p className="text-sm text-[#8B6E5A]">
          Seus áudios salvos para ouvir quando quiser
        </p>
      </div>

      {/* Favorites List */}
      {sortedFavorites.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-[#F5EDE8] flex items-center justify-center mx-auto mb-4">
            <Headphones className="w-7 h-7 text-[#D4C4BC]" />
          </div>
          <p className="text-[#8B6E5A] font-medium mb-1">
            Nenhum favorito ainda
          </p>
          <p className="text-xs text-[#B08070] max-w-xs mx-auto">
            Ao ouvir os áudios diários, toque no ícone de marcador para salvar
            seus favoritos aqui.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Counter */}
          <p className="text-xs text-[#B08070] font-medium">
            {sortedFavorites.length}{" "}
            {sortedFavorites.length === 1 ? "áudio salvo" : "áudios salvos"}
          </p>

          {sortedFavorites.map(fav => {
            const dayData = dailyContent[fav.day - 1];
            const audioUrl = meditationAudios[fav.day];
            const weekNumber = Math.ceil(fav.day / 7);
            const weekColors: Record<number, string> = {
              1: "#E8A090",
              2: "#D4956A",
              3: "#C4856A",
              4: "#A06040",
            };
            const weekColor = weekColors[weekNumber] || "#C4856A";

            return (
              <div
                key={fav.day}
                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[#F0E4DC] shadow-sm hover:shadow-md transition-all duration-200 group"
              >
                {/* Day indicator */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm"
                  style={{ backgroundColor: weekColor }}
                >
                  {fav.day}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#2C1810] text-sm truncate">
                    {dayData?.title || fav.title}
                  </p>
                  <p className="text-xs text-[#B08070] mt-0.5">
                    Semana {weekNumber} ·{" "}
                    {dayData?.meditationDuration || "5-10 min"}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {audioUrl && (
                    <button
                      onClick={() => handlePlayAudio(fav.day)}
                      className="w-9 h-9 rounded-full bg-[#C4856A] hover:bg-[#B07055] text-white flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm"
                      title="Ouvir áudio"
                    >
                      <Play className="w-4 h-4 ml-0.5" />
                    </button>
                  )}
                  <button
                    onClick={() => removeFavorite(fav.day)}
                    className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-500 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
                    title="Remover dos favoritos"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tip */}
      {sortedFavorites.length > 0 && (
        <div className="p-4 bg-[#F5EDE8] rounded-xl border border-[#E8D5CC]">
          <p className="text-xs text-[#6B4C3B] leading-relaxed">
            <strong>Dica:</strong> Ouça seus áudios favoritos em momentos de
            pausa durante o dia — no café da manhã, antes de dormir ou durante
            uma caminhada. A repetição aprofunda a transformação.
          </p>
        </div>
      )}
    </div>
  );
}
