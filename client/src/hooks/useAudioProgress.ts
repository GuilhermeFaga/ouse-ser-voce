// Hook para gerenciar salvamento automático do progresso de áudio no localStorage
// Permite que a usuária retome a escuta de onde parou

import { useEffect, useRef } from "react";

interface AudioProgress {
  dayNumber: number;
  currentTime: number;
  duration: number;
  lastUpdated: number;
}

const STORAGE_KEY = "ouse-audio-progress";

export function useAudioProgress(dayNumber: number, audioRef: React.RefObject<HTMLAudioElement | null>) {
  const saveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Carregar progresso salvo ao montar o componente
  useEffect(() => {
    const loadProgress = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const progress: AudioProgress[] = JSON.parse(stored);
          const dayProgress = progress.find((p) => p.dayNumber === dayNumber);

          if (dayProgress && audioRef.current) {
            // Restaurar posição do áudio com um pequeno delay para garantir que o áudio carregou
            setTimeout(() => {
              if (audioRef.current && dayProgress.currentTime > 0) {
                audioRef.current.currentTime = dayProgress.currentTime;
              }
            }, 500);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar progresso de áudio:", error);
      }
    };

    loadProgress();
  }, [dayNumber, audioRef]);

  // Salvar progresso automaticamente a cada 5 segundos durante a reprodução
  useEffect(() => {
    const saveProgress = () => {
      if (!audioRef.current) return;

      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        let progress: AudioProgress[] = [];

        if (stored) {
          progress = JSON.parse(stored);
        }

        // Remover entrada antiga do mesmo dia
        progress = progress.filter((p) => p.dayNumber !== dayNumber);

        // Adicionar nova entrada
        if (audioRef.current.currentTime > 0) {
          progress.push({
            dayNumber,
            currentTime: audioRef.current.currentTime,
            duration: audioRef.current.duration,
            lastUpdated: Date.now(),
          });
        }

        // Manter apenas os últimos 30 dias de progresso
        if (progress.length > 30) {
          progress = progress.sort((a, b) => b.lastUpdated - a.lastUpdated).slice(0, 30);
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      } catch (error) {
        console.error("Erro ao salvar progresso de áudio:", error);
      }
    };

    // Configurar salvamento automático a cada 5 segundos
    saveIntervalRef.current = setInterval(saveProgress, 5000);

    return () => {
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
      }
    };
  }, [dayNumber, audioRef]);

  // Salvar progresso quando o áudio termina ou é pausado
  useEffect(() => {
    const handleAudioEvent = () => {
      if (!audioRef.current) return;

      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        let progress: AudioProgress[] = [];

        if (stored) {
          progress = JSON.parse(stored);
        }

        progress = progress.filter((p) => p.dayNumber !== dayNumber);

        if (audioRef.current.currentTime > 0) {
          progress.push({
            dayNumber,
            currentTime: audioRef.current.currentTime,
            duration: audioRef.current.duration,
            lastUpdated: Date.now(),
          });
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      } catch (error) {
        console.error("Erro ao salvar progresso de áudio:", error);
      }
    };

    const audio = audioRef.current;
    if (!audio) return;

    audio.addEventListener("pause", handleAudioEvent);
    audio.addEventListener("ended", handleAudioEvent);

    return () => {
      audio.removeEventListener("pause", handleAudioEvent);
      audio.removeEventListener("ended", handleAudioEvent);
    };
  }, [dayNumber, audioRef]);

  // Limpar progresso quando o áudio termina completamente
  const clearProgress = (dayNum?: number) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        let progress: AudioProgress[] = JSON.parse(stored);
        progress = progress.filter((p) => p.dayNumber !== (dayNum || dayNumber));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      }
    } catch (error) {
      console.error("Erro ao limpar progresso de áudio:", error);
    }
  };

  return { clearProgress };
}
