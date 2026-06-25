import React, { createContext, useContext } from "react";
import { useAppState } from "@/hooks/useAppState";
import type { AppState, JournalEntry, DayCheckin, Note, ScannerResult, InitialAssessment, FinalAssessment } from "@/hooks/useAppState";

type AppContextType = ReturnType<typeof useAppState>;

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const appState = useAppState();
  return <AppContext.Provider value={appState}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export type { AppState, JournalEntry, DayCheckin, Note, ScannerResult, InitialAssessment, FinalAssessment };
