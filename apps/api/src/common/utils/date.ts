export function getMonthRange(date: Date = new Date()): {
  start: Date;
  end: Date;
} {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  return { start, end };
}

export function getNextNDaysRange(
  days: number,
  from: Date = new Date(),
): { start: Date; end: Date } {
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const end = new Date(start);
  end.setDate(end.getDate() + days);
  return { start, end };
}
