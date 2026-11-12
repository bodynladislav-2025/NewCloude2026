// Výpočet kalkulačky ztraceného času. Čistá funkce, stejná logika jako ve fázi 8.
export const SAVING_RATE = 0.4 // opatrný pracovní odhad, po pilotu nahradit změřeným průměrem
export const WEEKS = 46

// Jen polovinu uvolněného času počítáme jako skutečný prodejní čas (zbytek spolkne provoz).
export const SELLING_SHARE = 0.5

export const DEFAULTS = { reps: 10, meetings: 5, prepMin: 40, notesMin: 40, offers: 1.5, offerHours: 2, hourCost: 600, revenuePerRep: 10, sellingHours: 12 }

export function calculate(v) {
  const prepHours = (v.reps * v.meetings * v.prepMin) / 60
  const notesHours = (v.reps * v.meetings * v.notesMin) / 60
  const offerHrs = v.reps * v.offers * v.offerHours
  const nonSelling = prepHours + notesHours + offerHrs
  const saved = nonSelling * SAVING_RATE
  const savedPerRep = v.reps ? saved / v.reps : 0
  const czkYear = saved * v.hourCost * WEEKS
  const meetingsGained = saved / 1.5
  // Roční pohled
  const savedYear = saved * WEEKS
  const savedYearPerRep = savedPerRep * WEEKS
  // Kolik tržeb dnes obchodník udělá za hodinu jednání s klienty
  const revenuePerSellingHour = v.sellingHours > 0 ? (v.revenuePerRep * 1e6) / (v.sellingHours * WEEKS) : 0
  const revenueYear = savedYear * SELLING_SHARE * revenuePerSellingHour
  const biggest = [['pripravy', prepHours], ['zapisy', notesHours], ['nabidky', offerHrs]].sort((a, b) => b[1] - a[1])[0][0]
  return { prepHours, notesHours, offerHrs, nonSelling, saved, savedPerRep, czkYear, meetingsGained, biggest, savedYear, savedYearPerRep, revenuePerSellingHour, revenueYear }
}

export const fmt = (n, d = 0) => new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: d, minimumFractionDigits: d }).format(n)
export const fmtCzk = (n) => fmt(Math.round(n / 1000) * 1000) + ' Kč'
export const fmtMil = (n) => (n >= 1e6 ? fmt(n / 1e6, n >= 1e7 ? 0 : 1) + ' mil. Kč' : fmtCzk(n))
