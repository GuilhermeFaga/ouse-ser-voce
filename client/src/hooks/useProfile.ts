import { useApp } from "@/contexts/AppContext";

export function useProfile() {
  const { state, completeOnboarding, updateSettings } = useApp();

  return {
    userName: state.userName,
    onboardingComplete: state.onboardingComplete,
    startDate: state.startDate,
    reminderTime: state.reminderTime,
    reminderEnabled: state.reminderEnabled,
    completeOnboarding,
    updateSettings,
  };
}
