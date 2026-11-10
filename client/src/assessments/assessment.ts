import { MOOD_SCALE } from "@/journey";

export const FEELING_LABELS = [
  "Muito mal",
  "Mal",
  "Regular",
  "Bem",
  "Muito bem",
];

export const FEELING_SCALE = MOOD_SCALE.map((step, index) => ({
  ...step,
  label: FEELING_LABELS[index],
}));

export const FINAL_ASSESSMENT_MIN_DAYS = 28;

export function finalAssessmentUnlocked(completedDays: number[]): boolean {
  return completedDays.length >= FINAL_ASSESSMENT_MIN_DAYS;
}

export function feelingLabel(value: number): string {
  return FEELING_LABELS[value - 1] ?? FEELING_LABELS[FEELING_LABELS.length - 1];
}
