// Výpočet kalkulačky ztraceného času. Čistá funkce, stejná logika jako ve fázi 8.
export const SAVING_RATE = 0.4 // opatrný pracovní odhad, po pilotu nahradit změřeným průměrem
export const WEEKS = 46

export const DEFAULTS = { reps: 10, meetings: 5, prepMin: 40, notesMin: 40, offers: 1.5, offerHours: 2, hourCost: 600 }

export function calculate(v) {
  const prepHours = (v.reps * v.meetings * v.prepMin) / 60
  const notesHours = (v.reps * v.meetings * v.notesMin) / 60
  const offerHrs = v.reps * v.offers * v.offerHours
  const nonSelling = prepHours + notesHours + offerHrs
  const saved = nonSelling * SAVING_RATE
  const savedPerRep = v.reps ? saved / v.reps : 0
  const czkYear = saved * v.hourCost * WEEKS
  const meetingsGained = saved / 1.5
  const biggest = [['pripravy', prepHours], ['zapisy', notesHours], ['nabidky', offerHrs]].sort((a, b) => b[1] - a[1])[0][0]
  return { prepHours, notesHours, offerHrs, nonSelling, saved, savedPerRep, czkYear, meetingsGained, biggest }
}

export const fmt = (n, d = 0) => new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: d, minimumFractionDigits: d }).format(n)
export const fmtCzk = (n) => fmt(Math.round(n / 1000) * 1000) + ' Kč'
