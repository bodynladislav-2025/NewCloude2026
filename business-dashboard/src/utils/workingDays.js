import { getCzechHolidaySet, localDateKey } from './czechHolidays';

/**
 * Check if a date is a working day (Mon–Fri, not a holiday).
 * Uses local date key to avoid UTC offset issues.
 */
export function isWorkingDay(date, holidaySet) {
  const dow = date.getDay(); // 0=Sun, 6=Sat
  if (dow === 0 || dow === 6) return false;
  return !holidaySet.has(localDateKey(date));
}

/**
 * Count working days in a given month.
 */
export function workingDaysInMonth(year, month) {
  const holidays = getCzechHolidaySet(year);
  let count = 0;
  const daysInMonth = new Date(year, month, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month - 1, d);
    if (isWorkingDay(date, holidays)) count++;
  }
  return count;
}

/**
 * Count working days from the 1st to the given date (inclusive).
 */
export function workingDaysUpTo(year, month, dayOfMonth) {
  const holidays = getCzechHolidaySet(year);
  let count = 0;
  for (let d = 1; d <= dayOfMonth; d++) {
    const date = new Date(year, month - 1, d);
    if (isWorkingDay(date, holidays)) count++;
  }
  return count;
}

/**
 * Calculate expected plan fulfillment % based on today's position in the month.
 * Returns object: { expectedPct, workingDaysTotal, workingDaysSoFar }
 */
export function calcExpectedFulfillment(year, month, today = new Date()) {
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() + 1 === month;
  const total = workingDaysInMonth(year, month);

  let soFar;
  if (isCurrentMonth) {
    soFar = workingDaysUpTo(year, month, today.getDate());
  } else {
    // Past month: fully elapsed; future month: 0
    const firstOfMonth = new Date(year, month - 1, 1);
    soFar = today >= firstOfMonth ? total : 0;
  }

  const expectedPct = total > 0 ? (soFar / total) * 100 : 0;
  return { expectedPct, workingDaysTotal: total, workingDaysSoFar: soFar };
}

/**
 * Determine traffic-light status comparing actual % vs expected %.
 * Returns 'green' | 'yellow' | 'red'
 */
export function getPlanStatus(actualPct, expectedPct, threshold = 85) {
  if (expectedPct === 0) return 'green';
  const ratio = (actualPct / expectedPct) * 100;
  if (ratio >= 100) return 'green';
  if (ratio >= threshold) return 'yellow';
  return 'red';
}

/**
 * Calculate month-end forecast: if current pace continues.
 * Returns { forecastValue }
 */
export function calcForecast(actualValue, workingDaysSoFar, workingDaysTotal) {
  if (workingDaysSoFar === 0) return { forecastValue: null };
  const forecastValue = (actualValue / workingDaysSoFar) * workingDaysTotal;
  return { forecastValue };
}
