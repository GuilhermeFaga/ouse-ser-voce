import { Bookmark, Headphones, Play, Trash2 } from "lucide-react";
import { useApp } from "@/app/store";
import { useNavigation } from "@/app/navigation";
import { getDay, isDayAccessible, weekOfDay } from "@/journey";

export default function Favorites() {
  const { state, currentDay, toggleFavoriteDay } = useApp();
  const { openDay } = useNavigation();

  const favorites = [...state.favoriteAudioDays].sort((a, b) => a - b);
  const playLabel = favorites.length === 1 ? "áudio salvo" : "áudios salvos";

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Bookmark className="w-5 h-5 text-[#C4856A] fill-[#C4856A]" />
          <h1 className="font-serif text-2xl text-[#2C1810]">Meus Favoritos</h1>
        </div>
        <p className="text-sm text-[#8B6E5A]">
          Seus áudios salvos para ouvir quando quiser
        </p>
      </div>

      {favorites.length === 0 ? (
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
          <p className="text-xs text-[#B08070] font-medium">
            {favorites.length} {playLabel}
          </p>

          {favorites.map(dayNumber => {
            const day = getDay(dayNumber);
            const week = weekOfDay(dayNumber);
            const accessible = isDayAccessible(dayNumber, currentDay);
            return (
              <div
                key={dayNumber}
                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[#F0E4DC] shadow-sm hover:shadow-md transition-all duration-200 group"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm ${week.palette.dot}`}
                >
                  {dayNumber}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#2C1810] text-sm truncate">
                    {day.title}
                  </p>
                  <p className="text-xs text-[#B08070] mt-0.5">
                    {week.subtitle} · {day.meditationDuration}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openDay(dayNumber)}
                    disabled={!accessible}
                    className="w-9 h-9 rounded-full bg-[#C4856A] hover:bg-[#B07055] text-white flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                    title={
                      accessible
                        ? "Ouvir áudio"
                        : `Disponível ao chegar no dia ${dayNumber}`
                    }
                  >
                    <Play className="w-4 h-4 ml-0.5" />
                  </button>
                  <button
                    onClick={() => toggleFavoriteDay(dayNumber)}
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

      {favorites.length > 0 && (
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
