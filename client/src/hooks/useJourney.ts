import { useApp } from "@/contexts/AppContext";

export function useJourney() {
  const { state, completeDay, updateDayCheckin, currentStreak, progressPercent } = useApp();

  return {
    currentDay: state.currentDay,
    completedDays: state.completedDays,
    checkins: state.checkins,
    currentStreak,
    progressPercent,
    completeDay,
    updateDayCheckin,
  };
}
