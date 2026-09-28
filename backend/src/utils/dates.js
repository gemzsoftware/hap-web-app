/**
 * Adds whole months to a date without the rollover surprises of
 * `setMonth` (31 Jan + 1 month must not become 3 March).
 */
export function addMonths(date, months) {
  const source = new Date(date);
  const day = source.getDate();

  const result = new Date(source);
  result.setDate(1);
  result.setMonth(result.getMonth() + months);
  result.setDate(Math.min(day, daysInMonth(result.getFullYear(), result.getMonth())));

  return result;
}

export function daysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

export function startOfDay(date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

export function isPast(date) {
  return startOfDay(date).getTime() < startOfDay(new Date()).getTime();
}

export function daysBetween(from, to) {
  const ms = startOfDay(to).getTime() - startOfDay(from).getTime();
  return Math.round(ms / 86400000);
}

/**
 * Rounds a currency amount to two decimal places, avoiding the floating
 * point drift that accumulates when money is added repeatedly.
 */
export function toMoney(value) {
  return Math.round((Number(value) || 0) * 100) / 100;
}