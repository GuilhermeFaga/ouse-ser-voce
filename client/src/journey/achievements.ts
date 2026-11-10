import { DAY_COUNT, dailyContent, weekModules } from "./content";

export interface JourneyProgress {
  completedDays: number[];
  currentStreak: number;
  journalEntries: number;
  scannerCompleted: boolean;
  assessmentInitialDone: boolean;
  assessmentFinalDone: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (progress: JourneyProgress) => boolean;
}

const weekOfDay = new Map(dailyContent.map(day => [day.day, day.week]));
const weekSizes = new Map(
  weekModules.map(week => [
    week.week,
    dailyContent.filter(day => day.week === week.week).length,
  ])
);

const finishedWeek = (progress: JourneyProgress, week: number) =>
  progress.completedDays.filter(day => weekOfDay.get(day) === week).length ===
  weekSizes.get(week);

export const achievements: Achievement[] = [
  {
    id: "first-day",
    title: "Primeiro Passo",
    description: "Você completou o primeiro dia da jornada.",
    icon: "🌱",
    condition: p => p.completedDays.includes(1),
  },
  {
    id: "week-1",
    title: "Semana do Autoconhecimento",
    description: "Você completou a primeira semana.",
    icon: "🌸",
    condition: p => finishedWeek(p, 1),
  },
  {
    id: "week-2",
    title: "Semana do Desapego",
    description: "Você completou a segunda semana.",
    icon: "🦋",
    condition: p => finishedWeek(p, 2),
  },
  {
    id: "week-3",
    title: "Semana da Autoconfiança",
    description: "Você completou a terceira semana.",
    icon: "💪",
    condition: p => finishedWeek(p, 3),
  },
  {
    id: "week-4",
    title: "Semana da Transformação",
    description: "Você completou a quarta semana.",
    icon: "✨",
    condition: p => finishedWeek(p, 4),
  },
  {
    id: "all-30",
    title: "30 Dias Completos",
    description: "Você completou toda a jornada de 30 dias!",
    icon: "🏆",
    condition: p => p.completedDays.length >= DAY_COUNT,
  },
  {
    id: "streak-7",
    title: "7 Dias Seguidos",
    description: "Você manteve uma sequência de 7 dias na jornada.",
    icon: "🔥",
    condition: p => p.currentStreak >= 7,
  },
  {
    id: "streak-14",
    title: "14 Dias Seguidos",
    description: "Você manteve uma sequência de 14 dias na jornada.",
    icon: "⚡",
    condition: p => p.currentStreak >= 14,
  },
  {
    id: "journal-5",
    title: "Escritora de Si Mesma",
    description: "Você fez 5 entradas no diário emocional.",
    icon: "📖",
    condition: p => p.journalEntries >= 5,
  },
  {
    id: "journal-15",
    title: "Cronista da Alma",
    description: "Você fez 15 entradas no diário emocional.",
    icon: "✍️",
    condition: p => p.journalEntries >= 15,
  },
  {
    id: "scanner",
    title: "Autoconhecimento Profundo",
    description: "Você completou o Scanner de Essência.",
    icon: "🔮",
    condition: p => p.scannerCompleted,
  },
  {
    id: "assessment",
    title: "Ponto de Partida",
    description: "Você completou a avaliação inicial.",
    icon: "📋",
    condition: p => p.assessmentInitialDone,
  },
  {
    id: "final-assessment",
    title: "Transformação Registrada",
    description: "Você completou a avaliação final.",
    icon: "🌟",
    condition: p => p.assessmentFinalDone,
  },
  {
    id: "halfway",
    title: "Metade da Jornada",
    description: "Você chegou ao dia 15!",
    icon: "🎯",
    condition: p => p.completedDays.includes(15),
  },
];

export function evaluateAchievements(
  currentUnlocked: string[],
  progress: JourneyProgress
): string[] {
  return achievements
    .filter(a => !currentUnlocked.includes(a.id) && a.condition(progress))
    .map(a => a.id);
}

export function streakOf(completedDays: number[]): number {
  if (completedDays.length === 0) return 0;
  const sorted = [...completedDays].sort((a, b) => b - a);
  let streak = 1;
  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i] - sorted[i + 1] !== 1) break;
    streak++;
  }
  return streak;
}
