import type { Comment } from "@/community/types";

export type { Comment };

export interface DayRecord {
  day: number;
  mood: number;
  notes: string;
  prompts: Record<string, string>;
  exerciseCompleted: boolean;
  meditationListened: boolean;
  completedAt: string | null;
  /**
   * Last local change to this day. Cloud sync uses it to decide which copy of a
   * day is newer when this device and the cloud both have records.
   */
  updatedAt?: string;
}

export type DayPatch = Partial<Omit<DayRecord, "day">>;

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScannerAnswers {
  answers: Record<string, number>;
  completedAt: string;
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
  version: 2;
  userId: string;
  userName: string;
  onboardingComplete: boolean;
  startDate: string | null;
  days: Record<number, DayRecord>;
  notes: Note[];
  scanner: ScannerAnswers | null;
  initialAssessment: InitialAssessment | null;
  finalAssessment: FinalAssessment | null;
  unlockedAchievements: string[];
  favoriteAudioDays: number[];
  storyLikes: Record<string, string[]>;
  comments: Comment[];
  /**
   * Set on every local change. It is the checkpoint cloud sync compares with
   * the last copy it saved, so a clean cache is not merged again on reload.
   */
  updatedAt?: string;
}

export function createDayRecord(day: number): DayRecord {
  return {
    day,
    mood: 3,
    notes: "",
    prompts: {},
    exerciseCompleted: false,
    meditationListened: false,
    completedAt: null,
  };
}

export function completedDaysOf(state: AppState): number[] {
  return Object.values(state.days)
    .filter(record => record.completedAt !== null)
    .map(record => record.day)
    .sort((a, b) => a - b);
}

export function hasWriting(record: DayRecord): boolean {
  return (
    record.notes.trim() !== "" ||
    Object.values(record.prompts).some(answer => answer.trim() !== "")
  );
}

export function writtenDaysOf(state: AppState): DayRecord[] {
  return Object.values(state.days)
    .filter(hasWriting)
    .sort((a, b) => a.day - b.day);
}
