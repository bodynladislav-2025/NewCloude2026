/**
 * Calculations and aggregations for the Call Quality Dashboard
 */

// --- Helpers ---

export function avg(arr) {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

export function formatScore(n) {
  if (n == null || isNaN(n)) return '—';
  return n.toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

export function formatCurrency(n) {
  if (n == null || isNaN(n)) return '—';
  if (n >= 1_000_000) {
    return (n / 1_000_000).toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' mio Kč';
  }
  return new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(n);
}

export function formatPct(n) {
  if (n == null || isNaN(n)) return '—';
  return Math.round(n) + ' %';
}

export function getObchodnikStatus(score) {
  if (score >= 4.5) return { label: '🏆', color: 'green' };
  if (score >= 4.0) return { label: '✓', color: 'blue' };
  if (score >= 3.5) return { label: '○', color: 'amber' };
  return { label: '⚠️', color: 'red' };
}

export function getInitials(prijmeni) {
  if (!prijmeni) return '??';
  return prijmeni.slice(0, 2).toUpperCase();
}

// Default gradient palette for obchodnici without custom color
const GRADIENT_PALETTE = [
  'linear-gradient(135deg,#E8308A,#7B3FF2)',
  'linear-gradient(135deg,#7B3FF2,#3B7BE8)',
  'linear-gradient(135deg,#3B7BE8,#10B981)',
  'linear-gradient(135deg,#F59E0B,#E8308A)',
  'linear-gradient(135deg,#10B981,#3B7BE8)',
  'linear-gradient(135deg,#EF4444,#F59E0B)',
  'linear-gradient(135deg,#8B5CF6,#3B7BE8)',
  'linear-gradient(135deg,#06B6D4,#10B981)',
  'linear-gradient(135deg,#F97316,#EF4444)',
  'linear-gradient(135deg,#EC4899,#8B5CF6)',
  'linear-gradient(135deg,#14B8A6,#06B6D4)',
  'linear-gradient(135deg,#A855F7,#EC4899)',
];

// --- Team-level aggregates ---

/**
 * Compute team-wide KPIs from enriched hovory
 * @param {import('./sampleData').HovorEnriched[]} hovory
 * @param {import('./sampleData').AktivitaRow[]} aktivity
 * @param {import('./sampleData').ObchodnikRow[]} obchodnici
 */
export function computeTeamStats(hovory, aktivity, obchodnici) {
  if (!hovory.length) return null;

  const scores = {
    profesionalita: avg(hovory.map(h => h.profesionalita).filter(Boolean)),
    obchodni: avg(hovory.map(h => h.obchodni_dovednosti).filter(Boolean)),
    zjistovani: avg(hovory.map(h => h.zjistovani_potreb).filter(Boolean)),
    closing: avg(hovory.map(h => h.closing).filter(Boolean)),
  };
  scores.celkove = avg([scores.profesionalita, scores.obchodni, scores.zjistovani, scores.closing]);

  const rizikove = hovory.filter(h => h.riziko && h.riziko !== 'none');
  const risikovaHodnota = rizikove.reduce((s, h) => s + (h.hodnota_dealu || 0), 0);

  const unikatniZakaznici = new Set(hovory.map(h => h.zakaznik)).size;

  // Opportunity rates
  const opportunity = computeOpportunityRates(hovory);

  // Activity stats
  const activityStats = computeActivityStats(aktivity);

  // Distribution of scores by bands
  const distribution = computeScoreDistribution(hovory);

  // Mood change
  const moodChanges = hovory.map(h => h.zmena_nalady || 0);
  const avgMoodChange = avg(moodChanges);

  return {
    scores,
    totalHovory: hovory.length,
    rizikoveCount: rizikove.length,
    rizikovePercent: hovory.length ? (rizikove.length / hovory.length) * 100 : 0,
    risikovaHodnota,
    unikatniZakaznici,
    opportunity,
    activityStats,
    distribution,
    avgMoodChange,
  };
}

export function computeOpportunityRates(hovory) {
  const calc = (mozny, realizovan) => {
    const possible = hovory.filter(h => h[mozny]).length;
    const done = hovory.filter(h => h[realizovan]).length;
    return { possible, done, rate: possible ? (done / possible) * 100 : 0 };
  };

  return {
    upsell: calc('upsell_mozny', 'upsell_realizovan'),
    crosssell: calc('crosssell_mozny', 'crosssell_realizovan'),
    terminovany: { possible: hovory.length, done: hovory.filter(h => h.terminovany_prislib).length, rate: hovory.length ? (hovory.filter(h => h.terminovany_prislib).length / hovory.length) * 100 : 0 },
    softClose: { possible: hovory.length, done: hovory.filter(h => h.soft_close).length, rate: hovory.length ? (hovory.filter(h => h.soft_close).length / hovory.length) * 100 : 0 },
  };
}

export function computeActivityStats(aktivity) {
  const byType = { EMP: 0, EMO: 0, INCALL: 0, OUTCALL: 0, EMAIL: 0 };
  aktivity.forEach(a => { if (byType[a.typ_aktivity] !== undefined) byType[a.typ_aktivity]++; });

  const calls = aktivity.filter(a => a.typ_aktivity === 'INCALL' || a.typ_aktivity === 'OUTCALL');
  const avgCallDuration = avg(calls.map(c => c.delka_minut).filter(Boolean));

  const uniqueZakaznici = new Set(aktivity.map(a => a.zakaznik).filter(Boolean)).size;
  const uniqueNA = new Set(aktivity.map(a => a.na_cislo).filter(Boolean)).size;

  return { byType, avgCallDuration, uniqueZakaznici, uniqueNA };
}

export function computeScoreDistribution(hovory) {
  const bands = [
    { label: '<3.0', min: 0, max: 3.0, count: 0 },
    { label: '3.0–3.4', min: 3.0, max: 3.5, count: 0 },
    { label: '3.5–3.9', min: 3.5, max: 4.0, count: 0 },
    { label: '4.0–4.4', min: 4.0, max: 4.5, count: 0 },
    { label: '4.5–5.0', min: 4.5, max: 5.1, count: 0 },
  ];

  // Get unique obchodnici and their avg score
  const byObchodnik = groupByObchodnik(hovory);
  Object.values(byObchodnik).forEach(({ stats }) => {
    const score = stats.celkove;
    const band = bands.find(b => score >= b.min && score < b.max);
    if (band) band.count++;
  });

  return bands;
}

// --- Per-obchodnik aggregates ---

export function groupByObchodnik(hovory) {
  const groups = {};
  hovory.forEach(h => {
    if (!groups[h.obchodnik]) groups[h.obchodnik] = [];
    groups[h.obchodnik].push(h);
  });

  const result = {};
  Object.entries(groups).forEach(([obchodnik, rows]) => {
    result[obchodnik] = {
      obchodnik,
      hovory: rows,
      stats: computeObchodnikStats(rows, obchodnik),
    };
  });

  return result;
}

export function computeObchodnikStats(hovory, prijmeni) {
  const s = (field) => avg(hovory.map(h => h[field]).filter(v => v != null && !isNaN(v)));

  const profesionalita = s('profesionalita');
  const obchodni = s('obchodni_dovednosti');
  const zjistovani = s('zjistovani_potreb');
  const closing = s('closing');
  const celkove = avg([profesionalita, obchodni, zjistovani, closing].filter(Boolean));

  const rizikove = hovory.filter(h => h.riziko && h.riziko !== 'none');
  const hodnotaDealu = avg(hovory.map(h => h.hodnota_dealu).filter(Boolean));

  const opportunity = computeOpportunityRates(hovory);
  const overallOpportunity = avg([opportunity.upsell.rate, opportunity.crosssell.rate, opportunity.softClose.rate].filter(v => !isNaN(v)));

  const avgMoodChange = avg(hovory.map(h => h.zmena_nalady || 0));

  // Aggregate silne_stranky and oblasti_zlepseni
  const silneMap = {};
  const zlepseniMap = {};
  hovory.forEach(h => {
    (h.silne_stranky || '').split('|').forEach(s => {
      const t = s.trim();
      if (t) silneMap[t] = (silneMap[t] || 0) + 1;
    });
    (h.oblasti_zlepseni || '').split('|').forEach(s => {
      const t = s.trim();
      if (t) zlepseniMap[t] = (zlepseniMap[t] || 0) + 1;
    });
  });

  const topSilne = Object.entries(silneMap).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([t]) => t);
  const topZlepseni = Object.entries(zlepseniMap).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([t]) => t);

  return {
    prijmeni,
    profesionalita,
    obchodni,
    zjistovani,
    closing,
    celkove,
    pocetHovoru: hovory.length,
    rizikoveCount: rizikove.length,
    hodnotaDealu,
    opportunity,
    overallOpportunity,
    avgMoodChange,
    topSilne,
    topZlepseni,
    status: getObchodnikStatus(celkove),
  };
}

// --- Monthly time series ---

export function computeMonthlyTrend(hovory) {
  const byMonth = {};
  hovory.forEach(h => {
    const d = parseDate(h.datum);
    if (!d) return;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!byMonth[key]) byMonth[key] = [];
    byMonth[key].push(h);
  });

  return Object.entries(byMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, rows]) => ({
      month,
      label: formatMonthLabel(month),
      profesionalita: avg(rows.map(h => h.profesionalita).filter(Boolean)),
      obchodni: avg(rows.map(h => h.obchodni_dovednosti).filter(Boolean)),
      zjistovani: avg(rows.map(h => h.zjistovani_potreb).filter(Boolean)),
      closing: avg(rows.map(h => h.closing).filter(Boolean)),
      celkove: avg(rows.map(h => h.celkove_skore).filter(Boolean)),
      rizikove: rows.filter(h => h.riziko && h.riziko !== 'none').length,
      rizikove_zakazka: rows.filter(h => h.riziko === 'zakázka').length,
      rizikove_zakaznik: rows.filter(h => h.riziko === 'zákazník').length,
      rizikove_oba: rows.filter(h => h.riziko === 'zakázka+zákazník').length,
      pocet: rows.length,
    }));
}

export function computeMonthlyActivityTrend(aktivity) {
  const byMonth = {};
  aktivity.forEach(a => {
    const d = parseDate(a.datum);
    if (!d) return;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!byMonth[key]) byMonth[key] = { EMP: 0, EMO: 0, INCALL: 0, OUTCALL: 0 };
    if (byMonth[key][a.typ_aktivity] !== undefined) byMonth[key][a.typ_aktivity]++;
  });

  return Object.entries(byMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, counts]) => ({ month, label: formatMonthLabel(month), ...counts }));
}

// --- AI Insights (computed) ---

export function computeInsights(teamStats, byObchodnik) {
  const insights = [];

  if (!teamStats) return insights;

  // Improvement insight
  const over4 = Object.values(byObchodnik).filter(o => o.stats.celkove >= 4.0).length;
  const total = Object.values(byObchodnik).length;
  insights.push({
    type: 'improvement',
    label: 'ZLEPŠENÍ',
    color: 'green',
    title: `${over4} z ${total} obchodníků nad 4,0`,
    text: `${formatPct((over4 / total) * 100)} týmu dosáhlo cílového skóre kvality.`,
  });

  // Worst opportunity
  const opp = teamStats.opportunity;
  const oppEntries = [
    { label: 'Upsell', rate: opp.upsell.rate },
    { label: 'Crosssell', rate: opp.crosssell.rate },
    { label: 'Terminovaný příslib', rate: opp.terminovany.rate },
    { label: 'Soft close', rate: opp.softClose.rate },
  ];
  const worstOpp = oppEntries.sort((a, b) => a.rate - b.rate)[0];
  insights.push({
    type: 'weakness',
    label: 'SYSTÉMOVÁ SLABINA',
    color: 'amber',
    title: `${worstOpp.label}: ${formatPct(worstOpp.rate)} conversion`,
    text: `Nejnižší míra realizace příležitostí v týmu. Doporučujeme zaměřit koučink.`,
  });

  // Risk action
  insights.push({
    type: 'action',
    label: 'VYŽADUJE AKCI',
    color: 'red',
    title: `${teamStats.rizikoveCount} hovorů at-risk (${formatCurrency(teamStats.risikovaHodnota)})`,
    text: `Ohrožená hodnota zakázek vyžaduje eskalaci nebo manager review.`,
  });

  return insights;
}

// --- Obchodnik enrichment with obchodnici.xlsx data ---

export function enrichObchodnikData(prijmeni, obchodnici, index = 0) {
  const found = obchodnici.find(o => o.prijmeni === prijmeni);
  if (found) return found;

  return {
    prijmeni,
    jmeno_cele: prijmeni,
    inicials: getInitials(prijmeni),
    barva: GRADIENT_PALETTE[index % GRADIENT_PALETTE.length],
    role: '',
    roky_v_tymu: null,
    aktivni_klienti: null,
    cil_profesionalita: 4.0,
    cil_obchodni: 4.0,
  };
}

// --- Utilities ---

export function parseDate(str) {
  if (!str) return null;
  // Try ISO
  if (str.includes('T') || str.includes('-')) {
    const d = new Date(str);
    return isNaN(d) ? null : d;
  }
  // Try DD.MM.YYYY or DD.MM.YYYY H:mm:ss
  const m = str.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})/);
  if (!m) return null;
  const [, dd, mm, yyyy] = m;
  const timePart = str.slice(m[0].length).trim();
  const timeStr = timePart || '0:00:00';
  return new Date(`${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}T${timeStr}`);
}

function formatMonthLabel(key) {
  const [year, month] = key.split('-');
  const months = ['Led', 'Úno', 'Bře', 'Dub', 'Kvě', 'Čvn', 'Čvc', 'Srp', 'Zář', 'Říj', 'Lis', 'Pro'];
  return `${months[parseInt(month) - 1]} ${year}`;
}

export function getPeriodFilter(filterPeriod) {
  const now = new Date('2026-04-14');
  const map = {
    '7d': 7,
    '30d': 30,
    '90d': 90,
    quarter: 90,
    year: 365,
  };
  const days = map[filterPeriod] || 90;
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - days);
  return cutoff;
}

export function filterByPeriod(hovory, filterPeriod) {
  const cutoff = getPeriodFilter(filterPeriod);
  return hovory.filter(h => {
    const d = parseDate(h.datum);
    return d && d >= cutoff;
  });
}

export function filterAktivityByPeriod(aktivity, filterPeriod) {
  const cutoff = getPeriodFilter(filterPeriod);
  return aktivity.filter(a => {
    const d = parseDate(a.datum);
    return d && d >= cutoff;
  });
}

// Compare two periods for trend
export function computeTrend(current, previous) {
  if (!previous) return null;
  const diff = current - previous;
  return { diff, positive: diff > 0, label: (diff > 0 ? '+' : '') + formatScore(diff) };
}

export function computeObchodnikTrend(hovory, prijmeni) {
  const now = new Date('2026-04-14');
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  const myHovory = hovory.filter(h => h.obchodnik === prijmeni);

  const current = myHovory.filter(h => {
    const d = parseDate(h.datum);
    return d && d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });

  const prev = myHovory.filter(h => {
    const d = parseDate(h.datum);
    const prevMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const prevYear = thisMonth === 0 ? thisYear - 1 : thisYear;
    return d && d.getMonth() === prevMonth && d.getFullYear() === prevYear;
  });

  if (!current.length || !prev.length) return null;
  const cScore = avg(current.map(h => h.celkove_skore).filter(Boolean));
  const pScore = avg(prev.map(h => h.celkove_skore).filter(Boolean));
  return computeTrend(cScore, pScore);
}
