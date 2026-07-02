import { useState, useEffect, useCallback } from "react";
import { achievements, type AppProgress } from "@/lib/journeyData";

export interface JournalEntry {
  id: string;
  date: string;
  dayNumber: number;
  mood: number;
  text: string;
  prompts: Record<string, string>;
  createdAt: string;
}

export interface DayCheckin {
  dayNumber: number;
  completedAt: string;
  mood: number;
  exerciseCompleted: boolean;
  meditationListened: boolean;
  notes: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScannerResult {
  completedAt: string;
  answers: Record<string, number>;
  percentages: Record<string, number>;
  totalScore: number;
  abandonmentLevel: number;
  abandonmentLabel: string;
  criticalArea: string;
  criticalAreaName: string;
  explanation: string;
  recommendation: string;
}

export interface InitialAssessment {
  completedAt: string;
  mainChallenge: string;
  currentFeeling: number;
  mainGoal: string;
  biggestFear: string;
  selfDescription: string;
}

export interface FinalAssessment {
  completedAt: string;
  mainTransformation: string;
  currentFeeling: number;
  biggestLesson: string;
  nextCommitment: string;
  messageToSelf: string;
}

export interface AppState {
  userName: string;
  onboardingComplete: boolean;
  currentDay: number;
  startDate: string | null;
  completedDays: number[];
  checkins: Record<number, DayCheckin>;
  journalEntries: JournalEntry[];
  notes: Note[];
  scannerResult: ScannerResult | null;
  initialAssessment: InitialAssessment | null;
  finalAssessment: FinalAssessment | null;
  unlockedAchievements: string[];
  reminderTime: string;
  reminderEnabled: boolean;
}

const defaultState: AppState = {
  userName: "",
  onboardingComplete: false,
  currentDay: 1,
  startDate: null,
  completedDays: [],
  checkins: {},
  journalEntries: [],
  notes: [],
  scannerResult: null,
  initialAssessment: null,
  finalAssessment: null,
  unlockedAchievements: [],
  reminderTime: "08:00",
  reminderEnabled: false,
};

const STORAGE_KEY = "ouse-ser-voce-state";

function loadState(): AppState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultState, ...JSON.parse(stored) };
    }
  } catch {
    // ignore
  }
  return defaultState;
}

function saveState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function useAppState() {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const updateState = useCallback((updates: Partial<AppState>) => {
    setState(prev => {
      const newState = { ...prev, ...updates };
      return newState;
    });
  }, []);

  const completeOnboarding = useCallback((name: string) => {
    setState(prev => ({
      ...prev,
      userName: name,
      onboardingComplete: true,
      startDate: new Date().toISOString(),
      currentDay: 1,
    }));
  }, []);

  const completeDay = useCallback(
    (
      dayNumber: number,
      checkin: Omit<DayCheckin, "dayNumber" | "completedAt">
    ) => {
      setState(prev => {
        const newCompletedDays = prev.completedDays.includes(dayNumber)
          ? prev.completedDays
          : [...prev.completedDays, dayNumber].sort((a, b) => a - b);

        const newCheckin: DayCheckin = {
          ...checkin,
          dayNumber,
          completedAt: new Date().toISOString(),
        };

        const newState = {
          ...prev,
          completedDays: newCompletedDays,
          checkins: { ...prev.checkins, [dayNumber]: newCheckin },
          currentDay: Math.max(
            prev.currentDay,
            dayNumber + 1 <= 30 ? dayNumber + 1 : 30
          ),
        };

        // Check achievements
        const progress: AppProgress = {
          completedDays: newCompletedDays,
          scannerCompleted: !!prev.scannerResult,
          journalEntries: prev.journalEntries.length,
          checkinsCompleted: Object.keys(newState.checkins).length,
          currentStreak: calculateStreak(newCompletedDays),
          assessmentInitialDone: !!prev.initialAssessment,
          assessmentFinalDone: !!prev.finalAssessment,
        };

        const newUnlocked = achievements
          .filter(
            a =>
              !prev.unlockedAchievements.includes(a.id) && a.condition(progress)
          )
          .map(a => a.id);

        return {
          ...newState,
          unlockedAchievements: [...prev.unlockedAchievements, ...newUnlocked],
        };
      });
    },
    []
  );

  const addJournalEntry = useCallback(
    (entry: Omit<JournalEntry, "id" | "createdAt">) => {
      setState(prev => {
        const newEntry: JournalEntry = {
          ...entry,
          id: `journal-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };

        const newEntries = [...prev.journalEntries, newEntry];
        const progress: AppProgress = {
          completedDays: prev.completedDays,
          scannerCompleted: !!prev.scannerResult,
          journalEntries: newEntries.length,
          checkinsCompleted: Object.keys(prev.checkins).length,
          currentStreak: calculateStreak(prev.completedDays),
          assessmentInitialDone: !!prev.initialAssessment,
          assessmentFinalDone: !!prev.finalAssessment,
        };

        const newUnlocked = achievements
          .filter(
            a =>
              !prev.unlockedAchievements.includes(a.id) && a.condition(progress)
          )
          .map(a => a.id);

        return {
          ...prev,
          journalEntries: newEntries,
          unlockedAchievements: [...prev.unlockedAchievements, ...newUnlocked],
        };
      });
    },
    []
  );

  const updateJournalEntry = useCallback(
    (id: string, updates: Partial<JournalEntry>) => {
      setState(prev => ({
        ...prev,
        journalEntries: prev.journalEntries.map(e =>
          e.id === id ? { ...e, ...updates } : e
        ),
      }));
    },
    []
  );

  const deleteJournalEntry = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      journalEntries: prev.journalEntries.filter(e => e.id !== id),
    }));
  }, []);

  const addNote = useCallback(
    (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => {
      setState(prev => ({
        ...prev,
        notes: [
          ...prev.notes,
          {
            ...note,
            id: `note-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      }));
    },
    []
  );

  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    setState(prev => ({
      ...prev,
      notes: prev.notes.map(n =>
        n.id === id
          ? { ...n, ...updates, updatedAt: new Date().toISOString() }
          : n
      ),
    }));
  }, []);

  const deleteNote = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      notes: prev.notes.filter(n => n.id !== id),
    }));
  }, []);

  const saveScannerResult = useCallback(
    (result: Omit<ScannerResult, "completedAt">) => {
      setState(prev => {
        const scannerResult = {
          ...result,
          completedAt: new Date().toISOString(),
        };
        const progress: AppProgress = {
          completedDays: prev.completedDays,
          scannerCompleted: true,
          journalEntries: prev.journalEntries.length,
          checkinsCompleted: Object.keys(prev.checkins).length,
          currentStreak: calculateStreak(prev.completedDays),
          assessmentInitialDone: !!prev.initialAssessment,
          assessmentFinalDone: !!prev.finalAssessment,
        };

        const newUnlocked = achievements
          .filter(
            a =>
              !prev.unlockedAchievements.includes(a.id) && a.condition(progress)
          )
          .map(a => a.id);

        return {
          ...prev,
          scannerResult,
          unlockedAchievements: [...prev.unlockedAchievements, ...newUnlocked],
        };
      });
    },
    []
  );

  const saveInitialAssessment = useCallback(
    (assessment: Omit<InitialAssessment, "completedAt">) => {
      setState(prev => {
        const newState = {
          ...prev,
          initialAssessment: {
            ...assessment,
            completedAt: new Date().toISOString(),
          },
        };
        const progress: AppProgress = {
          completedDays: newState.completedDays,
          currentStreak: calculateStreak(newState.completedDays),
          journalEntries: newState.journalEntries.length,
          checkinsCompleted: newState.completedDays.length,
          scannerCompleted: !!newState.scannerResult,
          assessmentInitialDone: true,
          assessmentFinalDone: !!newState.finalAssessment,
        };
        const newUnlocked = achievements
          .filter(
            a =>
              !newState.unlockedAchievements.includes(a.id) &&
              a.condition(progress)
          )
          .map(a => a.id);
        return {
          ...newState,
          unlockedAchievements: [
            ...newState.unlockedAchievements,
            ...newUnlocked,
          ],
        };
      });
    },
    []
  );

  const saveFinalAssessment = useCallback(
    (assessment: Omit<FinalAssessment, "completedAt">) => {
      setState(prev => {
        const newState = {
          ...prev,
          finalAssessment: {
            ...assessment,
            completedAt: new Date().toISOString(),
          },
        };
        const progress: AppProgress = {
          completedDays: newState.completedDays,
          currentStreak: calculateStreak(newState.completedDays),
          journalEntries: newState.journalEntries.length,
          checkinsCompleted: newState.completedDays.length,
          scannerCompleted: !!newState.scannerResult,
          assessmentInitialDone: !!newState.initialAssessment,
          assessmentFinalDone: true,
        };
        const newUnlocked = achievements
          .filter(
            a =>
              !newState.unlockedAchievements.includes(a.id) &&
              a.condition(progress)
          )
          .map(a => a.id);
        return {
          ...newState,
          unlockedAchievements: [
            ...newState.unlockedAchievements,
            ...newUnlocked,
          ],
        };
      });
    },
    []
  );

  const updateSettings = useCallback(
    (settings: { reminderTime?: string; reminderEnabled?: boolean }) => {
      setState(prev => ({ ...prev, ...settings }));
    },
    []
  );

  const currentStreak = calculateStreak(state.completedDays);
  const progressPercent = Math.round((state.completedDays.length / 30) * 100);

  return {
    state,
    updateState,
    completeOnboarding,
    completeDay,
    addJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    addNote,
    updateNote,
    deleteNote,
    saveScannerResult,
    saveInitialAssessment,
    saveFinalAssessment,
    updateSettings,
    currentStreak,
    progressPercent,
  };
}

function calculateStreak(completedDays: number[]): number {
  if (completedDays.length === 0) return 0;
  const sorted = [...completedDays].sort((a, b) => b - a);
  let streak = 1;
  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i] - sorted[i + 1] === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}
