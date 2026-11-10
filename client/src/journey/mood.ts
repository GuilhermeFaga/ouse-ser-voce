export interface MoodStep {
  value: number;
  emoji: string;
  label: string;
}

export const MOOD_SCALE: MoodStep[] = [
  { value: 1, emoji: "😔", label: "Muito pesado" },
  { value: 2, emoji: "😕", label: "Pesado" },
  { value: 3, emoji: "😐", label: "Neutro" },
  { value: 4, emoji: "🙂", label: "Leve" },
  { value: 5, emoji: "😊", label: "Muito leve" },
];

const byValue = new Map(MOOD_SCALE.map(step => [step.value, step]));

export const MOOD_MIN = MOOD_SCALE[0].value;
export const MOOD_MAX = MOOD_SCALE[MOOD_SCALE.length - 1].value;

export function moodStep(value: number): MoodStep {
  return byValue.get(value) ?? MOOD_SCALE[2];
}

export function moodEmoji(value: number): string {
  return moodStep(value).emoji;
}

export function moodLabel(value: number): string {
  return moodStep(value).label;
}

export type MoodTrend = "improving" | "declining" | "steady";

export function moodTrend(moods: number[]): MoodTrend {
  if (moods.length < 2) return "steady";
  const first = moods[0];
  const last = moods[moods.length - 1];
  if (last > first) return "improving";
  if (last < first) return "declining";
  return "steady";
}

export function averageMood(moods: number[]): number {
  if (moods.length === 0) return 0;
  return moods.reduce((sum, mood) => sum + mood, 0) / moods.length;
}
