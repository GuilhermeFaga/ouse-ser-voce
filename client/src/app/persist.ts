import { nanoid } from "nanoid";
import {
  createDayRecord,
  type AppState,
  type Comment,
  type DayRecord,
} from "./state";

const STORAGE_KEY = "ouse-ser-voce-state";
const AUDIO_PROGRESS_KEY = "ouse-audio-progress";

const LEGACY_KEYS = {
  favorites: "ouse-ser-voce-favorite-audios",
  comments: "ouse-comments",
  storyLikes: "ouse-story-likes",
  userId: "ouse-user-id",
} as const;

export function createDefaultState(): AppState {
  return {
    version: 2,
    userId: nanoid(12),
    userName: "",
    onboardingComplete: false,
    startDate: null,
    days: {},
    notes: [],
    scanner: null,
    initialAssessment: null,
    finalAssessment: null,
    unlockedAchievements: [],
    favoriteAudioDays: [],
    storyLikes: {},
    comments: [],
  };
}

function readRaw(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function readJson<T>(key: string): T | null {
  const raw = readRaw(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

let legacyCleanupPending = false;

export function saveState(state: AppState): boolean {
  const saved = writeJson(STORAGE_KEY, state);
  if (saved && legacyCleanupPending) {
    legacyCleanupPending = false;
    pruneLegacyKeys();
  }
  return saved;
}

interface StoredCheckin {
  dayNumber?: number;
  completedAt?: string | null;
  mood?: number;
  notes?: string;
  prompts?: Record<string, string>;
  exerciseCompleted?: boolean;
  meditationListened?: boolean;
}

interface StoredJournalEntry {
  dayNumber: number;
  mood?: number;
  text?: string;
  prompts?: Record<string, string>;
}

interface StoredState {
  version?: number;
  userId?: string;
  userName?: string;
  onboardingComplete?: boolean;
  startDate?: string | null;
  days?: Record<number, DayRecord>;
  checkins?: Record<number, StoredCheckin>;
  journalEntries?: StoredJournalEntry[];
  completedDays?: number[];
  notes?: AppState["notes"];
  scanner?: AppState["scanner"];
  scannerResult?: { completedAt: string; answers?: Record<string, number> };
  initialAssessment?: AppState["initialAssessment"];
  finalAssessment?: AppState["finalAssessment"];
  unlockedAchievements?: string[];
  favoriteAudioDays?: number[];
  storyLikes?: Record<string, string[]>;
  comments?: Comment[];
}

interface LegacyFavorite {
  day: number;
}

interface LegacyStoryLike {
  storyId: string;
  likedBy: string[];
}

interface LegacyComment {
  id: string;
  storyId: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  createdAt: string;
  likedBy?: string[];
  parentCommentId?: string;
}

export function loadState(): AppState {
  const stored = readJson<StoredState>(STORAGE_KEY);
  // Legacy keys are only pruned once their contents are safely in the new key.
  legacyCleanupPending = !stored || stored.version !== 2;
  return fromStored(stored);
}

function fromStored(stored: StoredState | null): AppState {
  const state = createDefaultState();
  const saved = stored ?? {};

  const days: Record<number, DayRecord> = {};
  const dayAt = (dayNumber: number) =>
    (days[dayNumber] ??= createDayRecord(dayNumber));

  for (const [night, checkin] of Object.entries(saved.checkins ?? {})) {
    const dayNumber = Number(night);
    Object.assign(dayAt(dayNumber), {
      mood: checkin.mood ?? 3,
      notes: checkin.notes ?? "",
      exerciseCompleted: Boolean(checkin.exerciseCompleted),
      meditationListened: Boolean(checkin.meditationListened),
      completedAt: checkin.completedAt ?? null,
    });
  }

  // Builds before the rewrite tracked completion apart from the check-in record.
  for (const dayNumber of saved.completedDays ?? []) {
    const record = dayAt(dayNumber);
    record.completedAt ??= saved.startDate ?? new Date().toISOString();
  }

  // Journal entries and check-ins each held a copy of the day's free text. They are
  // the same field now, so keep both when they differ instead of dropping one.
  for (const entry of saved.journalEntries ?? []) {
    const record = dayAt(entry.dayNumber);
    if (entry.mood !== undefined) record.mood = entry.mood;
    const journalText = entry.text?.trim() ?? "";
    const checkinText = record.notes.trim();
    if (journalText) {
      record.notes =
        checkinText && checkinText !== journalText
          ? `${checkinText}\n\n${journalText}`
          : journalText;
    }
    if (entry.prompts) record.prompts = entry.prompts;
  }

  for (const [night, record] of Object.entries(saved.days ?? {})) {
    days[Number(night)] = { ...createDayRecord(Number(night)), ...record };
  }

  const legacyFavorites = readJson<LegacyFavorite[]>(LEGACY_KEYS.favorites);
  const legacyLikes = readJson<LegacyStoryLike[]>(LEGACY_KEYS.storyLikes);
  const legacyComments = readJson<LegacyComment[]>(LEGACY_KEYS.comments);

  const storyLikes: Record<string, string[]> = {};
  for (const story of legacyLikes ?? []) {
    if (story.likedBy?.length) storyLikes[story.storyId] = story.likedBy;
  }

  return {
    ...state,
    userId: saved.userId ?? readRaw(LEGACY_KEYS.userId) ?? state.userId,
    userName: saved.userName ?? state.userName,
    onboardingComplete: Boolean(saved.onboardingComplete),
    startDate: saved.startDate ?? null,
    days,
    notes: saved.notes ?? [],
    scanner:
      saved.scanner ??
      (saved.scannerResult
        ? {
            answers: saved.scannerResult.answers ?? {},
            completedAt: saved.scannerResult.completedAt,
          }
        : null),
    initialAssessment: saved.initialAssessment ?? null,
    finalAssessment: saved.finalAssessment ?? null,
    unlockedAchievements: saved.unlockedAchievements ?? [],
    favoriteAudioDays:
      saved.favoriteAudioDays ??
      (legacyFavorites ?? [])
        .map(favorite => favorite.day)
        .sort((a, b) => a - b),
    storyLikes: saved.storyLikes ?? storyLikes,
    comments:
      saved.comments ??
      (legacyComments ?? []).map(comment => ({
        id: comment.id,
        storyId: comment.storyId,
        authorName: comment.authorName,
        authorAvatar: comment.authorAvatar,
        text: comment.text,
        createdAt: comment.createdAt,
        likedBy: comment.likedBy ?? [],
        parentId: comment.parentCommentId ?? null,
      })),
  };
}

function pruneLegacyKeys() {
  for (const key of Object.values(LEGACY_KEYS)) {
    try {
      localStorage.removeItem(key);
    } catch {
      // Storage unavailable; the data is already in memory.
    }
  }
}

export function clearAllData() {
  const keys = [STORAGE_KEY, AUDIO_PROGRESS_KEY, ...Object.values(LEGACY_KEYS)];
  for (const key of keys) {
    try {
      localStorage.removeItem(key);
    } catch {
      // Storage unavailable; nothing else to do.
    }
  }
}

interface LegacyAudioProgress {
  dayNumber: number;
  currentTime: number;
}

export function readAudioProgress(): Record<number, number> {
  const stored = readJson<Record<number, number> | LegacyAudioProgress[]>(
    AUDIO_PROGRESS_KEY
  );
  if (!stored) return {};
  if (Array.isArray(stored)) {
    return Object.fromEntries(
      stored
        .filter(entry => entry.currentTime > 0)
        .map(entry => [entry.dayNumber, entry.currentTime])
    );
  }
  return stored;
}

export function writeAudioProgress(progress: Record<number, number>) {
  writeJson(AUDIO_PROGRESS_KEY, progress);
}
