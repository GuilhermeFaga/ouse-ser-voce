import {
  DAY_COUNT,
  dailyContent,
  weekModules,
  type DayContent,
  type WeekModule,
} from "./content";

export { DAY_COUNT, dailyContent, dailyQuotes, weekModules } from "./content";
export type { DayContent, WeekModule } from "./content";
export { PALETTE } from "./palette";
export type { Palette } from "./palette";
export {
  averageMood,
  MOOD_MAX,
  MOOD_MIN,
  MOOD_SCALE,
  moodEmoji,
  moodLabel,
  moodStep,
  moodTrend,
  type MoodStep,
  type MoodTrend,
} from "./mood";
export {
  achievements,
  evaluateAchievements,
  streakOf,
  type Achievement,
  type JourneyProgress,
} from "./achievements";

const daysByNumber = new Map(dailyContent.map(day => [day.day, day]));
const weeksByNumber = new Map(weekModules.map(week => [week.week, week]));

export function getDay(day: number): DayContent {
  return daysByNumber.get(day) ?? dailyContent[0];
}

export function getWeek(week: number): WeekModule {
  return weeksByNumber.get(week) ?? weekModules[0];
}

export function weekOfDay(day: number): WeekModule {
  return getWeek(getDay(day).week);
}

export function daysOfWeek(week: number): DayContent[] {
  return dailyContent.filter(day => day.week === week);
}

export function weekProgress(
  week: number,
  completedDays: number[]
): { completed: number; total: number; percent: number } {
  const days = daysOfWeek(week);
  const completed = days.filter(day => completedDays.includes(day.day)).length;
  return {
    completed,
    total: days.length,
    percent: days.length ? Math.round((completed / days.length) * 100) : 0,
  };
}

export function isDayAccessible(day: number, currentDay: number): boolean {
  return day >= 1 && day <= currentDay;
}

export function currentDayOf(completedDays: number[]): number {
  if (completedDays.length === 0) return 1;
  return Math.min(Math.max(...completedDays) + 1, DAY_COUNT);
}

export function progressPercent(completedDays: number[]): number {
  return Math.round((completedDays.length / DAY_COUNT) * 100);
}
