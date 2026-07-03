import { useApp } from "@/contexts/AppContext";

export function useAssessments() {
  const {
    state,
    saveScannerResult,
    saveInitialAssessment,
    saveFinalAssessment,
  } = useApp();

  return {
    scannerResult: state.scannerResult,
    initialAssessment: state.initialAssessment,
    finalAssessment: state.finalAssessment,
    saveScannerResult,
    saveInitialAssessment,
    saveFinalAssessment,
  };
}
