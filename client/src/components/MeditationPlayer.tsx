import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Bookmark,
  CheckCircle2,
  Pause,
  Play,
  Volume2,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAudioProgress } from "@/hooks/useAudioProgress";
import { useApp } from "@/app/store";

const PLAYBACK_RATES = [0.75, 1, 1.25, 1.5];

interface MeditationPlayerProps {
  title: string;
  duration: string;
  audioUrl: string;
  dayNumber: number;
  completed: boolean;
  onComplete?: () => void;
}

function formatTime(seconds: number) {
  if (!seconds || Number.isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function MeditationPlayer({
  title,
  duration,
  audioUrl,
  dayNumber,
  completed,
  onComplete,
}: MeditationPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  useAudioProgress(dayNumber, audioRef);
  const { state, toggleFavoriteDay } = useApp();
  const favorited = state.favoriteAudioDays.includes(dayNumber);

  const handleToggleFavorite = useCallback(() => {
    if (!favorited) toast.success("Salvo nos favoritos!");
    toggleFavoriteDay(dayNumber);
  }, [favorited, toggleFavoriteDay, dayNumber]);

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(event.target.value);
    if (!audioRef.current) return;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handlePlaybackRateChange = (rate: number) => {
    if (!audioRef.current) return;
    audioRef.current.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const progressPercent = totalDuration
    ? (currentTime / totalDuration) * 100
    : 0;

  return (
    <div className="space-y-4">
      <audio
        ref={audioRef}
        src={audioUrl}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime ?? 0)}
        onLoadedMetadata={() =>
          setTotalDuration(audioRef.current?.duration ?? 0)
        }
        onEnded={() => onComplete?.()}
      />

      <div className="bg-gradient-to-br from-[#F5EDE8] to-[#FAF6F1] rounded-2xl border border-[#E8D5CC] p-5 sm:p-6 shadow-sm relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[#2C1810] mb-1 truncate">
              {title}
            </h3>
            <p className="text-xs text-[#B08070]">
              Dia {dayNumber} · {duration}
            </p>
          </div>
          <motion.button
            onClick={handleToggleFavorite}
            whileTap={{ scale: 0.85 }}
            className={`ml-3 p-2 rounded-full transition-all duration-200 ${
              favorited
                ? "bg-[#C4856A]/15 text-[#C4856A]"
                : "bg-white text-[#D4C4BC] hover:text-[#C4856A] hover:bg-[#F5EDE8]"
            } border ${favorited ? "border-[#C4856A]/30" : "border-[#E8D5CC]"}`}
            title={favorited ? "Remover dos favoritos" : "Salvar nos favoritos"}
          >
            <Bookmark
              className={`w-4 h-4 transition-all duration-200 ${favorited ? "fill-[#C4856A]" : ""}`}
            />
          </motion.button>
        </div>

        <div className="flex items-center justify-center mb-5">
          <motion.button
            onClick={() => {
              const audio = audioRef.current;
              if (!audio) return;
              if (audio.paused) void audio.play();
              else audio.pause();
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-14 h-14 rounded-full bg-[#C4856A] hover:bg-[#B07055] text-white flex items-center justify-center shadow-lg transition-all duration-200"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-0.5" />
            )}
          </motion.button>
        </div>

        <div className="space-y-2 mb-4">
          <input
            type="range"
            min="0"
            max={totalDuration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-[#E8D5CC] rounded-full appearance-none cursor-pointer accent-[#C4856A]"
            style={{
              background: `linear-gradient(to right, #C4856A 0%, #C4856A ${progressPercent}%, #E8D5CC ${progressPercent}%, #E8D5CC 100%)`,
            }}
          />
          <div className="flex items-center justify-between text-xs text-[#B08070] font-medium">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(totalDuration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 sm:gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-[#C4856A] hidden sm:block" />
            <div className="flex gap-1">
              {PLAYBACK_RATES.map(rate => (
                <button
                  key={rate}
                  onClick={() => handlePlaybackRateChange(rate)}
                  className={`px-2 py-1 text-xs font-medium rounded transition-all ${
                    playbackRate === rate
                      ? "bg-[#C4856A] text-white"
                      : "bg-white text-[#B08070] border border-[#E8D5CC] hover:border-[#C4856A]"
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-[#C4856A]" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              defaultValue="1"
              onChange={event => {
                if (audioRef.current) {
                  audioRef.current.volume = Number(event.target.value);
                }
              }}
              className="w-16 h-1 bg-[#E8D5CC] rounded-full appearance-none cursor-pointer accent-[#C4856A]"
            />
          </div>
        </div>

        <Button
          onClick={() => onComplete?.()}
          disabled={completed}
          className={`w-full h-11 rounded-xl font-medium text-sm transition-all ${
            completed
              ? "bg-green-100 text-green-700 cursor-default"
              : "bg-[#C4856A] hover:bg-[#B07055] text-white active:scale-[0.97]"
          }`}
        >
          <CheckCircle2 className="w-4 h-4 mr-2" />
          {completed ? "Prática concluída" : "Marcar como concluída"}
        </Button>
      </div>

      <p className="text-xs text-[#B08070] text-center">
        Dica: Use a velocidade 1.25x para uma experiência mais dinâmica, ou
        0.75x para aprofundar.
        <br />
        <span className="text-[#A0705F]">
          Seu progresso é salvo automaticamente.
        </span>
      </p>
    </div>
  );
}
