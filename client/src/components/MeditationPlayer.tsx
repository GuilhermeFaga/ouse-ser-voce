// OUSE SER VOCÊ – Meditation Player Avançado
// Design: Controles de velocidade, progresso, conclusão e visual sofisticado
// Com salvamento automático do progresso no localStorage

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, Zap, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAudioProgress } from "@/hooks/useAudioProgress";

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

  // Usar hook para salvar progresso automaticamente
  useAudioProgress(dayNumber, audioRef);

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
      <div className="bg-gradient-to-br from-[#F5EDE8] to-[#FAF6F1] rounded-2xl border border-[#E8D5CC] p-6 shadow-sm">
        {/* Title */}
        <div className="mb-4">
          <h3 className="font-semibold text-[#2C1810] mb-1">{title}</h3>
          <p className="text-xs text-[#B08070]">Dia {dayNumber} · {duration}</p>
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
        <div className="flex items-center justify-between gap-3 mb-4">
          {/* Playback Speed */}
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-[#C4856A]" />
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
              Meditação concluída
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
