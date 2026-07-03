import { useApp } from "@/contexts/AppContext";

export function useJournal() {
  const { state, addJournalEntry, updateJournalEntry, deleteJournalEntry } =
    useApp();

  return {
    journalEntries: state.journalEntries,
    addJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
  };
}
