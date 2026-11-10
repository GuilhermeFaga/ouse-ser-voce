export function dateOfDay(startDate: string | null, dayNumber: number): Date {
  const start = startDate ? new Date(startDate) : new Date();
  const date = new Date(start);
  date.setDate(date.getDate() + (dayNumber - 1));
  return date;
}

export function formatLongDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatShortDate(iso: string | Date): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "short",
  });
}

/** "agora", "há 3 min", "ontem" — short enough for a one-line sync status. */
export function formatRelativeTime(date: Date, now: Date = new Date()): string {
  const minutes = Math.floor(
    Math.max(0, now.getTime() - date.getTime()) / 60_000
  );
  if (minutes < 1) return "agora";
  if (minutes < 60) return `há ${minutes} min`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `há ${hours} h`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "ontem";
  if (days < 7) return `há ${days} dias`;
  return `em ${formatShortDate(date)}`;
}
