import { useApp } from "@/contexts/AppContext";

export function useNotes() {
  const { state, addNote, updateNote, deleteNote } = useApp();

  return {
    notes: state.notes,
    addNote,
    updateNote,
    deleteNote,
  };
}
