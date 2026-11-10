import { createDefaultState } from "./persist";
import type {
  AppState,
  Comment,
  DayRecord,
  FinalAssessment,
  InitialAssessment,
  Note,
  ScannerAnswers,
} from "./state";

/**
 * Version of the Firestore document payload. Bump it only together with a
 * migration: a document from another version is ignored instead of guessed at.
 */
export const CLOUD_SCHEMA_VERSION = 1;

type Dict = Record<string, unknown>;

const isDict = (value: unknown): value is Dict =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const asString = (value: unknown): string =>
  typeof value === "string" ? value : "";

const asStringOrNull = (value: unknown): string | null =>
  typeof value === "string" && value !== "" ? value : null;

const asNumber = (value: unknown, fallback: number): number =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

const asBoolean = (value: unknown): boolean => value === true;

const timeOf = (iso: string | null | undefined): number => {
  if (!iso) return 0;
  const time = Date.parse(iso);
  return Number.isNaN(time) ? 0 : time;
};

const clampMood = (mood: number): number =>
  Math.min(5, Math.max(1, Math.round(mood)));

function readStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const unique = new Set<string>();
  for (const item of value) {
    if (typeof item === "string" && item !== "") unique.add(item);
  }
  return [...unique];
}

/**
 * Whether the record holds anything worth keeping. A default state is empty;
 * this is what decides between "restore the cloud copy" and "merge both".
 */
export function hasRecord(state: AppState): boolean {
  return (
    state.onboardingComplete ||
    Object.keys(state.days).length > 0 ||
    state.notes.length > 0 ||
    state.scanner !== null ||
    state.initialAssessment !== null ||
    state.finalAssessment !== null ||
    state.unlockedAchievements.length > 0 ||
    state.favoriteAudioDays.length > 0 ||
    state.comments.length > 0 ||
    Object.keys(state.storyLikes).length > 0
  );
}

/**
 * The exact object written to Firestore. A JSON round-trip drops optional
 * `undefined` fields, which Firestore rejects as unsupported values.
 */
export function cloudStateFor(state: AppState): AppState {
  return JSON.parse(JSON.stringify(state)) as AppState;
}

function readDay(value: unknown, key: string): DayRecord | null {
  if (!isDict(value)) return null;

  // Firestore map keys are strings; the day number in the value is a fallback.
  const keyDay = Number(key);
  const day =
    Number.isInteger(keyDay) && keyDay > 0 ? keyDay : asNumber(value.day, 0);
  if (!Number.isInteger(day) || day < 1) return null;

  const prompts: Record<string, string> = {};
  if (isDict(value.prompts)) {
    for (const [prompt, answer] of Object.entries(value.prompts)) {
      if (typeof answer === "string") prompts[prompt] = answer;
    }
  }

  const updatedAt = asStringOrNull(value.updatedAt);
  return {
    day,
    mood: clampMood(asNumber(value.mood, 3)),
    notes: asString(value.notes),
    prompts,
    exerciseCompleted: asBoolean(value.exerciseCompleted),
    meditationListened: asBoolean(value.meditationListened),
    completedAt: asStringOrNull(value.completedAt),
    ...(updatedAt ? { updatedAt } : {}),
  };
}

function readNotes(value: unknown): Note[] {
  if (!Array.isArray(value)) return [];
  const notes: Note[] = [];
  for (const item of value) {
    if (!isDict(item) || typeof item.id !== "string" || item.id === "") {
      continue;
    }
    notes.push({
      id: item.id,
      title: asString(item.title),
      content: asString(item.content),
      createdAt: asString(item.createdAt),
      updatedAt: asString(item.updatedAt),
    });
  }
  return notes;
}

function readScanner(value: unknown): ScannerAnswers | null {
  if (!isDict(value) || typeof value.completedAt !== "string") return null;
  const answers: Record<string, number> = {};
  if (isDict(value.answers)) {
    for (const [id, answer] of Object.entries(value.answers)) {
      if (typeof answer === "number" && Number.isFinite(answer)) {
        answers[id] = answer;
      }
    }
  }
  return { answers, completedAt: value.completedAt };
}

function readInitialAssessment(value: unknown): InitialAssessment | null {
  if (!isDict(value) || typeof value.completedAt !== "string") return null;
  return {
    completedAt: value.completedAt,
    mainChallenge: asString(value.mainChallenge),
    currentFeeling: asNumber(value.currentFeeling, 3),
    mainGoal: asString(value.mainGoal),
    biggestFear: asString(value.biggestFear),
    selfDescription: asString(value.selfDescription),
  };
}

function readFinalAssessment(value: unknown): FinalAssessment | null {
  if (!isDict(value) || typeof value.completedAt !== "string") return null;
  return {
    completedAt: value.completedAt,
    mainTransformation: asString(value.mainTransformation),
    currentFeeling: asNumber(value.currentFeeling, 3),
    biggestLesson: asString(value.biggestLesson),
    nextCommitment: asString(value.nextCommitment),
    messageToSelf: asString(value.messageToSelf),
  };
}

function readComments(value: unknown): Comment[] {
  if (!Array.isArray(value)) return [];
  const comments: Comment[] = [];
  for (const item of value) {
    if (!isDict(item) || typeof item.id !== "string" || item.id === "") {
      continue;
    }
    comments.push({
      id: item.id,
      storyId: asString(item.storyId),
      authorName: asString(item.authorName),
      authorAvatar: asString(item.authorAvatar),
      text: asString(item.text),
      createdAt: asString(item.createdAt),
      likedBy: readStringArray(item.likedBy),
      authorId: typeof item.authorId === "string" ? item.authorId : null,
      parentId: typeof item.parentId === "string" ? item.parentId : null,
    });
  }
  return comments;
}

function readStoryLikes(value: unknown): Record<string, string[]> {
  if (!isDict(value)) return {};
  const likes: Record<string, string[]> = {};
  for (const [storyId, ids] of Object.entries(value)) {
    const unique = readStringArray(ids);
    if (unique.length > 0) likes[storyId] = unique;
  }
  return likes;
}

function readFavoriteDays(value: unknown): number[] {
  if (!Array.isArray(value)) return [];
  const days = new Set<number>();
  for (const item of value) {
    if (typeof item === "number" && Number.isInteger(item) && item > 0) {
      days.add(item);
    }
  }
  return [...days].sort((a, b) => a - b);
}

/**
 * Turns a Firestore document into a safe AppState. Returns null for a missing,
 * foreign or corrupt document so the caller never merges with garbage.
 */
export function readCloudState(data: unknown): AppState | null {
  if (!isDict(data)) return null;
  if (
    typeof data.schemaVersion === "number" &&
    data.schemaVersion !== CLOUD_SCHEMA_VERSION
  ) {
    return null;
  }

  const raw = isDict(data.state) ? data.state : null;
  if (!raw || raw.version !== 2) return null;

  const defaults = createDefaultState();
  const days: Record<number, DayRecord> = {};
  if (isDict(raw.days)) {
    for (const [key, value] of Object.entries(raw.days)) {
      const day = readDay(value, key);
      if (day) days[day.day] = day;
    }
  }

  const updatedAt = asStringOrNull(raw.updatedAt);
  return {
    version: 2,
    userId: asString(raw.userId) || defaults.userId,
    userName: asString(raw.userName).slice(0, 80),
    onboardingComplete: asBoolean(raw.onboardingComplete),
    startDate: asStringOrNull(raw.startDate),
    days,
    notes: readNotes(raw.notes),
    scanner: readScanner(raw.scanner),
    initialAssessment: readInitialAssessment(raw.initialAssessment),
    finalAssessment: readFinalAssessment(raw.finalAssessment),
    unlockedAchievements: readStringArray(raw.unlockedAchievements),
    favoriteAudioDays: readFavoriteDays(raw.favoriteAudioDays),
    storyLikes: readStoryLikes(raw.storyLikes),
    comments: readComments(raw.comments),
    ...(updatedAt ? { updatedAt } : {}),
  };
}

export type LinkPlan =
  | { kind: "idle" }
  | { kind: "adopt"; state: AppState }
  | { kind: "push"; state: AppState }
  | { kind: "merge"; state: AppState };

/**
 * What the first connection between this device and the account should do.
 * Kept pure so the decision that can lose a journal is tested directly.
 */
export function planLink(
  local: AppState,
  remote: AppState | null,
  options: { cleanCache: boolean; clearPending: boolean }
): LinkPlan {
  if (!remote) {
    // A fresh account waits for the first real record before creating a doc.
    return hasRecord(local) || options.clearPending
      ? { kind: "push", state: local }
      : { kind: "idle" };
  }
  if (options.cleanCache) return { kind: "adopt", state: remote };
  // "Apagar meus dados" was pressed while signed in: the empty record wins.
  // Pressed while signed out, it never sets this flag and the account comes back.
  if (options.clearPending) return { kind: "push", state: local };
  if (!hasRecord(local)) return { kind: "adopt", state: remote };
  return { kind: "merge", state: mergeStates(local, remote) };
}

function earliest(a: string | null, b: string | null): string | null {
  if (!a) return b;
  if (!b) return a;
  return timeOf(b) < timeOf(a) ? b : a;
}

function pickNewest<T extends { completedAt: string }>(
  a: T | null,
  b: T | null
): T | null {
  if (!a) return b;
  if (!b) return a;
  return timeOf(b.completedAt) > timeOf(a.completedAt) ? b : a;
}

/**
 * Merges two copies of the same day. Text is never dropped in favour of an
 * empty field, completion is monotonic (once done, done), and the newer copy
 * provides mood and prompts.
 */
function mergeDay(a: DayRecord, b: DayRecord): DayRecord {
  const aTime = timeOf(a.updatedAt ?? a.completedAt);
  const bTime = timeOf(b.updatedAt ?? b.completedAt);
  const newest = bTime > aTime ? b : a;
  const oldest = newest === a ? b : a;

  const prompts: Record<string, string> = {};
  const promptKeys = new Set([
    ...Object.keys(oldest.prompts),
    ...Object.keys(newest.prompts),
  ]);
  for (const prompt of promptKeys) {
    const answer = newest.prompts[prompt]?.trim()
      ? newest.prompts[prompt]
      : oldest.prompts[prompt];
    if (answer?.trim()) prompts[prompt] = answer;
  }

  return {
    day: newest.day,
    mood: newest.mood,
    notes: newest.notes.trim() ? newest.notes : oldest.notes,
    prompts,
    exerciseCompleted: a.exerciseCompleted || b.exerciseCompleted,
    meditationListened: a.meditationListened || b.meditationListened,
    completedAt: earliest(a.completedAt, b.completedAt),
    updatedAt: newest.updatedAt ?? oldest.updatedAt,
  };
}

function mergeNotes(local: Note[], remote: Note[]): Note[] {
  const byId = new Map<string, Note>();
  for (const note of [...local, ...remote]) {
    const existing = byId.get(note.id);
    if (!existing || timeOf(note.updatedAt) > timeOf(existing.updatedAt)) {
      byId.set(note.id, note);
    }
  }
  return [...byId.values()].sort(
    (a, b) =>
      timeOf(a.createdAt) - timeOf(b.createdAt) || a.id.localeCompare(b.id)
  );
}

function mergeComments(local: Comment[], remote: Comment[]): Comment[] {
  const byId = new Map<string, Comment>();
  for (const comment of [...local, ...remote]) {
    const existing = byId.get(comment.id);
    if (!existing) {
      byId.set(comment.id, comment);
      continue;
    }
    // The author's device keeps the text; likes from both sides are kept.
    byId.set(comment.id, {
      ...existing,
      likedBy: [...new Set([...existing.likedBy, ...comment.likedBy])],
    });
  }
  return [...byId.values()].sort(
    (a, b) =>
      timeOf(a.createdAt) - timeOf(b.createdAt) || a.id.localeCompare(b.id)
  );
}

function mergeStoryLikes(
  local: Record<string, string[]>,
  remote: Record<string, string[]>
): Record<string, string[]> {
  const merged: Record<string, string[]> = {};
  for (const [storyId, ids] of [
    ...Object.entries(local),
    ...Object.entries(remote),
  ]) {
    const unique = new Set([...(merged[storyId] ?? []), ...ids]);
    if (unique.size > 0) merged[storyId] = [...unique].sort();
  }
  return merged;
}

/**
 * One-time merge when this device and the account both already have a record.
 * It is intentionally generous: union where the domain allows it, newest wins
 * for values that can only have one answer, and a written field is never
 * replaced by an empty one.
 */
export function mergeStates(local: AppState, remote: AppState): AppState {
  // The account's identity (used for comment ownership and likes) is the
  // remote one once the account has a record; local content authored before
  // signing in is remapped to it instead of becoming orphaned.
  const userId = hasRecord(remote) ? remote.userId : local.userId;
  const remap = (id: string | null) => (id === local.userId ? userId : id);

  const localComments =
    userId === local.userId
      ? local.comments
      : local.comments.map(comment => ({
          ...comment,
          authorId: remap(comment.authorId),
          likedBy: comment.likedBy
            .map(remap)
            .filter((id): id is string => id !== null),
        }));
  const localStoryLikes =
    userId === local.userId
      ? local.storyLikes
      : Object.fromEntries(
          Object.entries(local.storyLikes).map(([storyId, ids]) => [
            storyId,
            ids.map(remap).filter((id): id is string => id !== null),
          ])
        );

  const days: Record<number, DayRecord> = {};
  const dayKeys = new Set([
    ...Object.keys(local.days),
    ...Object.keys(remote.days),
  ]);
  for (const key of dayKeys) {
    const day = Number(key);
    const localDay = local.days[day];
    const remoteDay = remote.days[day];
    if (localDay && remoteDay) days[day] = mergeDay(localDay, remoteDay);
    else if (localDay ?? remoteDay) days[day] = (localDay ?? remoteDay)!;
  }

  return {
    version: 2,
    userId,
    // The name on this device is the one she just saw and edited.
    userName: local.userName.trim() ? local.userName : remote.userName,
    onboardingComplete: local.onboardingComplete || remote.onboardingComplete,
    startDate: earliest(local.startDate, remote.startDate),
    days,
    notes: mergeNotes(local.notes, remote.notes),
    scanner: pickNewest(local.scanner, remote.scanner),
    initialAssessment: pickNewest(
      local.initialAssessment,
      remote.initialAssessment
    ),
    finalAssessment: pickNewest(local.finalAssessment, remote.finalAssessment),
    unlockedAchievements: [
      ...new Set([
        ...local.unlockedAchievements,
        ...remote.unlockedAchievements,
      ]),
    ],
    favoriteAudioDays: [
      ...new Set([...local.favoriteAudioDays, ...remote.favoriteAudioDays]),
    ].sort((a, b) => a - b),
    storyLikes: mergeStoryLikes(localStoryLikes, remote.storyLikes),
    comments: mergeComments(localComments, remote.comments),
    updatedAt: new Date().toISOString(),
  };
}
