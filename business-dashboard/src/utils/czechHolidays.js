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
  // Easter Sunday
  const easter = new Date(year, month - 1, day);
  // Easter Monday = Sunday + 1
  easter.setDate(easter.getDate() + 1);
  return easter;
}

/**
 * Returns array of Date objects for all Czech public holidays in given year.
 */
export function getCzechHolidays(year) {
  const em = easterMonday(year);
  const holidays = [
    new Date(year, 0, 1),   // Nový rok
    em,                      // Velikonoční pondělí
    new Date(year, 4, 1),   // Svátek práce
    new Date(year, 4, 8),   // Den vítězství
    new Date(year, 6, 5),   // Cyril a Metoděj
    new Date(year, 6, 6),   // Jan Hus
    new Date(year, 8, 28),  // Den české státnosti
    new Date(year, 9, 28),  // Den vzniku Československa
    new Date(year, 10, 17), // Den boje za svobodu a demokracii
    new Date(year, 11, 24), // Štědrý den
    new Date(year, 11, 25), // 1. svátek vánoční
    new Date(year, 11, 26), // 2. svátek vánoční
  ];
  return holidays;
}

/**
 * Returns Set of date strings "YYYY-MM-DD" for all holidays in given year.
 */
export function getCzechHolidaySet(year) {
  return new Set(
    getCzechHolidays(year).map(d => d.toISOString().slice(0, 10))
  );
}

export const HOLIDAY_NAMES = {
  '01-01': 'Nový rok',
  '05-01': 'Svátek práce',
  '05-08': 'Den vítězství',
  '07-05': 'Cyril a Metoděj',
  '07-06': 'Jan Hus',
  '09-28': 'Den české státnosti',
  '10-28': 'Den vzniku Československa',
  '11-17': 'Den boje za svobodu a demokracii',
  '12-24': 'Štědrý den',
  '12-25': '1. svátek vánoční',
  '12-26': '2. svátek vánoční',
};
