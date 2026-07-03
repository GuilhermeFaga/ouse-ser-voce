import { useApp } from "@/contexts/AppContext";

export function useAchievements() {
  const { state } = useApp();

  return {
    unlockedAchievements: state.unlockedAchievements,
  };
}
