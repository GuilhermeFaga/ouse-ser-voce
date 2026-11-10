import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { nanoid } from "nanoid";
import { toast } from "sonner";
import {
  currentDayOf,
  evaluateAchievements,
  progressPercent as percentOf,
  streakOf,
  type JourneyProgress,
} from "@/journey";
import { commentSubtreeIds } from "@/community/comments";
import {
  completedDaysOf,
  createDayRecord,
  writtenDaysOf,
  type AppState,
  type Comment,
  type DayPatch,
  type DayRecord,
  type FinalAssessment,
  type InitialAssessment,
  type Note,
} from "./state";
import {
  clearAllData,
  createDefaultState,
  loadState,
  saveState,
} from "./persist";

export interface CommentDraft {
  storyId: string;
  text: string;
  authorName: string;
  authorAvatar: string;
  parentId?: string | null;
}

export interface AppApi {
  state: AppState;
  completedDays: number[];
  currentDay: number;
  currentStreak: number;
  progressPercent: number;
  completeOnboarding(name: string): void;
  updateName(name: string): void;
  saveDay(day: number, patch: DayPatch): void;
  completeDay(day: number, patch: DayPatch): void;
  clearDayWriting(day: number): void;
  addNote(note: { title: string; content: string }): void;
  updateNote(
    id: string,
    updates: Partial<Pick<Note, "title" | "content">>
  ): void;
  deleteNote(id: string): void;
  saveScanner(answers: Record<string, number>): void;
  saveInitialAssessment(data: Omit<InitialAssessment, "completedAt">): void;
  saveFinalAssessment(data: Omit<FinalAssessment, "completedAt">): void;
  toggleFavoriteDay(day: number): void;
  toggleStoryLike(storyId: string): void;
  addComment(draft: CommentDraft): void;
  removeComment(id: string): void;
  toggleCommentLike(id: string): void;
  resetAll(): void;
}

const AppContext = createContext<AppApi | null>(null);

function journeyProgressOf(state: AppState): JourneyProgress {
  const completedDays = completedDaysOf(state);
  return {
    completedDays,
    currentStreak: streakOf(completedDays),
    journalEntries: writtenDaysOf(state).length,
    scannerCompleted: state.scanner !== null,
    assessmentInitialDone: state.initialAssessment !== null,
    assessmentFinalDone: state.finalAssessment !== null,
  };
}

function withAchievements(state: AppState): AppState {
  const unlocked = evaluateAchievements(
    state.unlockedAchievements,
    journeyProgressOf(state)
  );
  if (unlocked.length === 0) return state;
  return {
    ...state,
    unlockedAchievements: [...state.unlockedAchievements, ...unlocked],
  };
}

function withDay(
  state: AppState,
  day: number,
  patch: DayPatch,
  completedAt?: string
): AppState {
  const existing = state.days[day] ?? createDayRecord(day);
  const next: DayRecord = {
    ...existing,
    ...patch,
    day,
    completedAt: existing.completedAt ?? completedAt ?? null,
  };
  return { ...state, days: { ...state.days, [day]: next } };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() =>
    withAchievements(loadState())
  );
  const saveFailed = useRef(false);

  useEffect(() => {
    const saved = saveState(state);
    if (!saved && !saveFailed.current) {
      toast.error(
        "Não foi possível salvar seus dados. Libere espaço no navegador."
      );
    }
    saveFailed.current = !saved;
  }, [state]);

  const commit = useCallback((update: (state: AppState) => AppState) => {
    setState(previous => withAchievements(update(previous)));
  }, []);

  const completeOnboarding = useCallback(
    (name: string) => {
      commit(previous => ({
        ...previous,
        userName: name,
        onboardingComplete: true,
        startDate: previous.startDate ?? new Date().toISOString(),
      }));
    },
    [commit]
  );

  const updateName = useCallback(
    (name: string) => {
      commit(previous => ({ ...previous, userName: name }));
    },
    [commit]
  );

  const saveDay = useCallback(
    (day: number, patch: DayPatch) => {
      commit(previous => withDay(previous, day, patch));
    },
    [commit]
  );

  const completeDay = useCallback(
    (day: number, patch: DayPatch) => {
      commit(previous =>
        withDay(previous, day, patch, new Date().toISOString())
      );
    },
    [commit]
  );

  const clearDayWriting = useCallback(
    (day: number) => {
      commit(previous => withDay(previous, day, { notes: "", prompts: {} }));
    },
    [commit]
  );

  const addNote = useCallback(
    (note: { title: string; content: string }) => {
      commit(previous => {
        const now = new Date().toISOString();
        return {
          ...previous,
          notes: [
            ...previous.notes,
            {
              id: `note-${nanoid(8)}`,
              title: note.title,
              content: note.content,
              createdAt: now,
              updatedAt: now,
            },
          ],
        };
      });
    },
    [commit]
  );

  const updateNote = useCallback(
    (id: string, updates: Partial<Pick<Note, "title" | "content">>) => {
      commit(previous => ({
        ...previous,
        notes: previous.notes.map(note =>
          note.id === id
            ? { ...note, ...updates, updatedAt: new Date().toISOString() }
            : note
        ),
      }));
    },
    [commit]
  );

  const deleteNote = useCallback(
    (id: string) => {
      commit(previous => ({
        ...previous,
        notes: previous.notes.filter(note => note.id !== id),
      }));
    },
    [commit]
  );

  const saveScanner = useCallback(
    (answers: Record<string, number>) => {
      commit(previous => ({
        ...previous,
        scanner: { answers, completedAt: new Date().toISOString() },
      }));
    },
    [commit]
  );

  const saveInitialAssessment = useCallback(
    (data: Omit<InitialAssessment, "completedAt">) => {
      commit(previous => ({
        ...previous,
        initialAssessment: { ...data, completedAt: new Date().toISOString() },
      }));
    },
    [commit]
  );

  const saveFinalAssessment = useCallback(
    (data: Omit<FinalAssessment, "completedAt">) => {
      commit(previous => ({
        ...previous,
        finalAssessment: { ...data, completedAt: new Date().toISOString() },
      }));
    },
    [commit]
  );

  const toggleFavoriteDay = useCallback(
    (day: number) => {
      commit(previous => ({
        ...previous,
        favoriteAudioDays: previous.favoriteAudioDays.includes(day)
          ? previous.favoriteAudioDays.filter(item => item !== day)
          : [...previous.favoriteAudioDays, day].sort((a, b) => a - b),
      }));
    },
    [commit]
  );

  const toggleStoryLike = useCallback(
    (storyId: string) => {
      commit(previous => {
        const likedBy = previous.storyLikes[storyId] ?? [];
        const next = likedBy.includes(previous.userId)
          ? likedBy.filter(id => id !== previous.userId)
          : [...likedBy, previous.userId];
        const storyLikes = { ...previous.storyLikes };
        if (next.length) storyLikes[storyId] = next;
        else delete storyLikes[storyId];
        return { ...previous, storyLikes };
      });
    },
    [commit]
  );

  const addComment = useCallback(
    (draft: CommentDraft) => {
      commit(previous => {
        const comment: Comment = {
          id: `comment-${nanoid(8)}`,
          storyId: draft.storyId,
          authorName: draft.authorName,
          authorAvatar: draft.authorAvatar,
          text: draft.text.trim(),
          createdAt: new Date().toISOString(),
          likedBy: [],
          parentId: draft.parentId ?? null,
        };
        return { ...previous, comments: [...previous.comments, comment] };
      });
    },
    [commit]
  );

  const removeComment = useCallback(
    (id: string) => {
      commit(previous => {
        const doomed = commentSubtreeIds(previous.comments, id);
        return {
          ...previous,
          comments: previous.comments.filter(
            comment => !doomed.has(comment.id)
          ),
        };
      });
    },
    [commit]
  );

  const toggleCommentLike = useCallback(
    (id: string) => {
      commit(previous => ({
        ...previous,
        comments: previous.comments.map(comment => {
          if (comment.id !== id) return comment;
          const likedBy = comment.likedBy.includes(previous.userId)
            ? comment.likedBy.filter(user => user !== previous.userId)
            : [...comment.likedBy, previous.userId];
          return { ...comment, likedBy };
        }),
      }));
    },
    [commit]
  );

  const resetAll = useCallback(() => {
    clearAllData();
    setState(createDefaultState());
  }, []);

  const completedDays = useMemo(() => completedDaysOf(state), [state]);
  const currentDay = useMemo(
    () => currentDayOf(completedDays),
    [completedDays]
  );
  const currentStreak = useMemo(() => streakOf(completedDays), [completedDays]);
  const progressPercent = useMemo(
    () => percentOf(completedDays),
    [completedDays]
  );

  const value = useMemo<AppApi>(
    () => ({
      state,
      completedDays,
      currentDay,
      currentStreak,
      progressPercent,
      completeOnboarding,
      updateName,
      saveDay,
      completeDay,
      clearDayWriting,
      addNote,
      updateNote,
      deleteNote,
      saveScanner,
      saveInitialAssessment,
      saveFinalAssessment,
      toggleFavoriteDay,
      toggleStoryLike,
      addComment,
      removeComment,
      toggleCommentLike,
      resetAll,
    }),
    [
      state,
      completedDays,
      currentDay,
      currentStreak,
      progressPercent,
      completeOnboarding,
      updateName,
      saveDay,
      completeDay,
      clearDayWriting,
      addNote,
      updateNote,
      deleteNote,
      saveScanner,
      saveInitialAssessment,
      saveFinalAssessment,
      toggleFavoriteDay,
      toggleStoryLike,
      addComment,
      removeComment,
      toggleCommentLike,
      resetAll,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppApi {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
