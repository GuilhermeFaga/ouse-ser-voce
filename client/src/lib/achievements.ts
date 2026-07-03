export interface AppProgress {
  completedDays: number[];
  scannerCompleted: boolean;
  journalEntries: number;
  checkinsCompleted: number;
  currentStreak: number;
  assessmentInitialDone: boolean;
  assessmentFinalDone: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (progress: AppProgress) => boolean;
}

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
    condition: p => p.completedDays.filter(d => d <= 7).length >= 7,
  },
  {
    id: "week-2",
    title: "Semana do Desapego",
    description: "Você completou a segunda semana.",
    icon: "🦋",
    condition: p => p.completedDays.filter(d => d >= 8 && d <= 14).length >= 7,
  },
  {
    id: "week-3",
    title: "Semana da Autoconfiança",
    description: "Você completou a terceira semana.",
    icon: "💪",
    condition: p => p.completedDays.filter(d => d >= 15 && d <= 21).length >= 7,
  },
  {
    id: "week-4",
    title: "Semana da Transformação",
    description: "Você completou a quarta semana.",
    icon: "✨",
    condition: p => p.completedDays.filter(d => d >= 22 && d <= 28).length >= 7,
  },
  {
    id: "all-30",
    title: "30 Dias Completos",
    description: "Você completou toda a jornada de 30 dias!",
    icon: "🏆",
    condition: p => p.completedDays.length >= 30,
  },
  {
    id: "streak-7",
    title: "7 Dias Seguidos",
    description: "Você manteve 7 dias consecutivos na jornada.",
    icon: "🔥",
    condition: p => p.currentStreak >= 7,
  },
  {
    id: "streak-14",
    title: "14 Dias Seguidos",
    description: "Você manteve 14 dias consecutivos na jornada.",
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
  progress: AppProgress
): string[] {
  return achievements
    .filter(
      a =>
        !currentUnlocked.includes(a.id) && a.condition(progress)
    )
    .map(a => a.id);
}
