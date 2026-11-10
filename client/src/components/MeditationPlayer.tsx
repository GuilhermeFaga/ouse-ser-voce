import { useCallback, useRef, useState } from "react";
import { Bookmark, Check, Pause, Play, Volume2, Zap } from "lucide-react";
import { toast } from "sonner";
import { Action } from "@/components/ds";
import { useAudioProgress } from "@/hooks/useAudioProgress";
import { useApp } from "@/app/store";
import { cn } from "@/lib/utils";

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

function formatRate(rate: number) {
  return `${rate.toString().replace(".", ",")}x`;
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
    if (!favorited) toast.success("Áudio salvo nos favoritos.");
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
    <div className="space-y-3">
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

      <div className="rounded-2xl border border-line-strong bg-gradient-to-br from-surface-soft to-brand-wash p-5 shadow-[0_1px_2px_rgba(44,24,16,0.04)] sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-serif text-lg leading-tight text-ink">
              {title}
            </h3>
            <p className="mt-1 text-xs text-ink-subtle">
              Dia {dayNumber} · {duration}
            </p>
          </div>
          <button
            type="button"
            onClick={handleToggleFavorite}
            aria-pressed={favorited}
            aria-label={
              favorited
                ? `Remover o áudio do dia ${dayNumber} dos favoritos`
                : `Salvar o áudio do dia ${dayNumber} nos favoritos`
            }
            title={
              favorited
                ? "Remover dos favoritos"
                : "Salvar o áudio nos favoritos"
            }
            className={cn(
              "ml-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
              favorited
                ? "border-brand/30 bg-brand-soft text-brand-ink"
                : "border-line-strong bg-white text-ink-faint hover:bg-brand-soft hover:text-brand-ink"
            )}
          >
            <Bookmark
              className={cn("h-4 w-4", favorited && "fill-current")}
              aria-hidden
            />
          </button>
        </div>

        <div className="mb-5 flex items-center justify-center">
          <button
            type="button"
            onClick={() => {
              const audio = audioRef.current;
              if (!audio) return;
              if (audio.paused) void audio.play();
              else audio.pause();
            }}
            aria-label={isPlaying ? "Pausar o áudio" : "Ouvir o áudio"}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-[0_1px_2px_rgba(44,24,16,0.12)] transition-colors hover:bg-brand-strong active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" aria-hidden />
            ) : (
              <Play className="ml-0.5 h-6 w-6" aria-hidden />
            )}
          </button>
        </div>

        <div className="space-y-1">
          <div className="relative flex h-11 items-center rounded-full has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand/40 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-surface">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 overflow-hidden rounded-full bg-line-strong"
            >
              <div
                className="h-full rounded-full bg-brand"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-brand bg-white"
              style={{ left: `${progressPercent}%` }}
            />
            <input
              type="range"
              min="0"
              max={totalDuration || 0}
              step="0.1"
              value={currentTime}
              onChange={handleSeek}
              aria-label="Posição do áudio"
              aria-valuetext={`${formatTime(currentTime)} de ${formatTime(totalDuration)}`}
              className="relative h-11 w-full cursor-pointer appearance-none bg-transparent opacity-0"
            />
          </div>
          <div className="flex items-center justify-between text-xs font-medium tabular-nums text-ink-muted">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(totalDuration)}</span>
          </div>
        </div>

        <div className="mb-4 mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <Zap
              className="hidden h-4 w-4 text-brand-ink sm:block"
              aria-hidden
            />
            <div
              role="group"
              aria-label="Velocidade do áudio"
              className="flex gap-1"
            >
              {PLAYBACK_RATES.map(rate => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => handlePlaybackRateChange(rate)}
                  aria-pressed={playbackRate === rate}
                  className={cn(
                    "min-h-11 min-w-11 rounded-lg border px-2 text-xs font-medium tabular-nums transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
                    playbackRate === rate
                      ? "border-brand bg-brand text-ink"
                      : "border-line-strong bg-white text-ink-muted hover:border-brand hover:text-ink"
                  )}
                >
                  {formatRate(rate)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-brand-ink" aria-hidden />
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
              aria-label="Volume do áudio"
              className="h-11 w-20 cursor-pointer accent-brand"
            />
          </div>
        </div>

        <Action
          variant="secondary"
          block
          aria-pressed={completed}
          disabled={completed}
          onClick={() => onComplete?.()}
          icon={<Check className="h-4 w-4" aria-hidden />}
          className={cn(completed && "border-brand/40 bg-brand-soft text-ink")}
        >
          {completed ? "Áudio do dia concluído" : "Marcar áudio como ouvido"}
        </Action>
      </div>

      <p className="px-1 text-center text-xs leading-relaxed text-ink-muted">
        Você pode ouvir em 1,25x para acompanhar melhor, ou em 0,75x para
        aprofundar. Seu progresso é salvo automaticamente.
      </p>
    </div>
  );
}
