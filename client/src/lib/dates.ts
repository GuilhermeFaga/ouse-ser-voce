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
