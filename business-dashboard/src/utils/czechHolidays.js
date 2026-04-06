/**
 * Calculate Easter Monday date for a given year (Gaussian algorithm).
 */
function easterMonday(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // 1-based
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  const easter = new Date(year, month - 1, day);
  easter.setDate(easter.getDate() + 1); // Easter Monday
  return easter;
}

/**
 * Format a local Date to "YYYY-MM-DD" without UTC conversion.
 */
export function localDateKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Returns array of { date, name } objects for all Czech public holidays in given year.
 */
export function getCzechHolidaysWithNames(year) {
  const em = easterMonday(year);
  return [
    { date: new Date(year, 0, 1),   name: 'Nový rok' },
    { date: em,                      name: 'Velikonoční pondělí' },
    { date: new Date(year, 4, 1),   name: 'Svátek práce' },
    { date: new Date(year, 4, 8),   name: 'Den vítězství' },
    { date: new Date(year, 6, 5),   name: 'Cyril a Metoděj' },
    { date: new Date(year, 6, 6),   name: 'Jan Hus' },
    { date: new Date(year, 8, 28),  name: 'Den české státnosti' },
    { date: new Date(year, 9, 28),  name: 'Den vzniku Československa' },
    { date: new Date(year, 10, 17), name: 'Den boje za svobodu a demokracii' },
    { date: new Date(year, 11, 24), name: 'Štědrý den' },
    { date: new Date(year, 11, 25), name: '1. svátek vánoční' },
    { date: new Date(year, 11, 26), name: '2. svátek vánoční' },
  ];
}

/**
 * Returns array of Date objects for all Czech public holidays in given year.
 */
export function getCzechHolidays(year) {
  return getCzechHolidaysWithNames(year).map(h => h.date);
}

/**
 * Returns Set of local date strings "YYYY-MM-DD" for all holidays in given year.
 */
export function getCzechHolidaySet(year) {
  return new Set(getCzechHolidays(year).map(localDateKey));
}
