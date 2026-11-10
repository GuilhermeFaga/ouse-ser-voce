import { useEffect, useRef, type RefObject } from "react";
import { readAudioProgress, writeAudioProgress } from "@/app/persist";

const SAVE_EVERY_SECONDS = 5;
const FINISHED_TOLERANCE_SECONDS = 0.5;

export function useAudioProgress(
  dayNumber: number,
  audioRef: RefObject<HTMLAudioElement | null>
) {
  const lastSavedAt = useRef(0);
  const ready = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    ready.current = false;

    const persist = () => {
      if (!ready.current) return;
      const progress = readAudioProgress();
      const finished =
        audio.duration > 0 &&
        audio.currentTime >= audio.duration - FINISHED_TOLERANCE_SECONDS;
      if (audio.currentTime > 0 && !finished) {
        progress[dayNumber] = audio.currentTime;
      } else {
        delete progress[dayNumber];
      }
      writeAudioProgress(progress);
      lastSavedAt.current = audio.currentTime;
    };

    const handleLoadedMetadata = () => {
      const savedSeconds = readAudioProgress()[dayNumber] ?? 0;
      const resumable =
        savedSeconds > 0 &&
        audio.duration > 0 &&
        savedSeconds < audio.duration - FINISHED_TOLERANCE_SECONDS;
      if (resumable) audio.currentTime = savedSeconds;
      ready.current = true;
      lastSavedAt.current = audio.currentTime;
    };

    const handleTimeUpdate = () => {
      if (
        Math.abs(audio.currentTime - lastSavedAt.current) < SAVE_EVERY_SECONDS
      )
        return;
      persist();
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("pause", persist);
    audio.addEventListener("seeked", persist);
    audio.addEventListener("ended", persist);

    if (audio.readyState >= HTMLMediaElement.HAVE_METADATA) {
      handleLoadedMetadata();
    }

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("pause", persist);
      audio.removeEventListener("seeked", persist);
      audio.removeEventListener("ended", persist);
      persist();
    };
  }, [audioRef, dayNumber]);
}
