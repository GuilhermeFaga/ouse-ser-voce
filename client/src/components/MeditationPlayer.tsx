// OUSE SER VOCÊ – Meditation Player Avançado
// Design: Controles de velocidade, progresso, conclusão, favoritos e visual sofisticado
// Com salvamento automático do progresso no localStorage

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, Zap, CheckCircle2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAudioProgress } from "@/hooks/useAudioProgress";
import { useFavoriteAudios } from "@/hooks/useFavoriteAudios";

interface MeditationPlayerProps {
  title: string;
  duration: string;
  audioUrl: string;
  dayNumber: number;
  onComplete?: () => void;
}

export default function MeditationPlayer({
  title,
  duration,
  audioUrl,
  dayNumber,
  onComplete,
}: MeditationPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showFavToast, setShowFavToast] = useState(false);

  // Usar hook para salvar progresso automaticamente
  useAudioProgress(dayNumber, audioRef);

  // Hook de favoritos
  const { isFavorite, toggleFavorite } = useFavoriteAudios();
  const favorited = isFavorite(dayNumber);

  const handleToggleFavorite = () => {
    toggleFavorite(dayNumber, title);
    if (!favorited) {
      setShowFavToast(true);
      setTimeout(() => setShowFavToast(false), 2000);
    }
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setTotalDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleComplete = () => {
    setIsCompleted(true);
    setIsPlaying(false);
    if (onComplete) {
      onComplete();
    }
  };

  const handleEnded = () => {
    handleComplete();
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercent = totalDuration ? (currentTime / totalDuration) * 100 : 0;

  return (
    <div className="space-y-4">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* Player Card */}
      <div className="bg-gradient-to-br from-[#F5EDE8] to-[#FAF6F1] rounded-2xl border border-[#E8D5CC] p-5 sm:p-6 shadow-sm relative">
        {/* Favorite Toast */}
        {showFavToast && (
          <div className="absolute top-3 right-3 bg-[#C4856A] text-white text-xs px-3 py-1.5 rounded-lg shadow-md animate-in fade-in slide-in-from-top-2 duration-200">
            Salvo nos favoritos!
          </div>
        )}

        {/* Title + Favorite */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[#2C1810] mb-1 truncate">{title}</h3>
            <p className="text-xs text-[#B08070]">Dia {dayNumber} · {duration}</p>
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

        {/* Play Button */}
        <div className="flex items-center justify-center mb-5">
          <motion.button
            onClick={handlePlayPause}
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

        {/* Progress Bar */}
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

        {/* Controls Row */}
        <div className="flex items-center justify-between gap-2 sm:gap-3 mb-4 flex-wrap">
          {/* Playback Speed */}
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-[#C4856A] hidden sm:block" />
            <div className="flex gap-1">
              {[0.75, 1, 1.25, 1.5].map(rate => (
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

          {/* Volume */}
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-[#C4856A]" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              defaultValue="1"
              onChange={e => {
                if (audioRef.current) {
                  audioRef.current.volume = parseFloat(e.target.value);
                }
              }}
              className="w-16 h-1 bg-[#E8D5CC] rounded-full appearance-none cursor-pointer accent-[#C4856A]"
            />
          </div>
        </div>

        {/* Complete Button */}
        <Button
          onClick={handleComplete}
          disabled={isCompleted}
          className={`w-full h-11 rounded-xl font-medium text-sm transition-all ${
            isCompleted
              ? "bg-green-100 text-green-700 cursor-default"
              : "bg-[#C4856A] hover:bg-[#B07055] text-white active:scale-[0.97]"
          }`}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Prática concluída
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Marcar como concluída
            </>
          )}
        </Button>
      </div>

      {/* Info */}
      <p className="text-xs text-[#B08070] text-center">
        Dica: Use a velocidade 1.25x para uma experiência mais dinâmica, ou 0.75x para aprofundar.
        <br />
        <span className="text-[#A0705F]">Seu progresso é salvo automaticamente.</span>
      </p>
    </div>
  );
}
