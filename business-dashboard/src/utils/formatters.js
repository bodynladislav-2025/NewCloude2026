/**
 * Format number as Czech currency (e.g. 1 200 000 Kč)
 */
export function formatCZK(value) {
  if (value == null || isNaN(value)) return '—';
  const n = Math.round(Number(value));
  return n.toLocaleString('cs-CZ').replace(/\s/g, '\u00a0') + '\u00a0Kč';
}

/**
 * Format number as Czech currency in millions (e.g. 1,2 M Kč)
 */
export function formatCZKShort(value) {
  if (value == null || isNaN(value)) return '—';
  const n = Number(value);
  if (Math.abs(n) >= 1_000_000) {
    return (n / 1_000_000).toLocaleString('cs-CZ', { maximumFractionDigits: 1 }) + '\u00a0M\u00a0Kč';
  }
  if (Math.abs(n) >= 1_000) {
    return (n / 1_000).toLocaleString('cs-CZ', { maximumFractionDigits: 1 }) + '\u00a0tis.\u00a0Kč';
  }
  return formatCZK(n);
}

/**
 * Format percentage (e.g. 87,3 %)
 */
export function formatPct(value, decimals = 1) {
  if (value == null || isNaN(value)) return '—';
  return Number(value).toLocaleString('cs-CZ', { maximumFractionDigits: decimals, minimumFractionDigits: decimals }) + '\u00a0%';
}

/**
 * Format integer with spaces as thousand separator
 */
export function formatInt(value) {
  if (value == null || isNaN(value)) return '—';
  return Math.round(Number(value)).toLocaleString('cs-CZ');
}

/**
 * Czech month names
 */
export const MESICE = [
  'Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen',
  'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec',
];

export const MESICE_SHORT = [
  'Led', 'Úno', 'Bře', 'Dub', 'Kvě', 'Čvn',
  'Čvc', 'Srp', 'Zář', 'Říj', 'Lis', 'Pro',
];

export function formatPeriod(year, month) {
  return `${MESICE[month - 1]} ${year}`;
}

export function formatDate(dateOrStr) {
  if (!dateOrStr) return '—';
  // Accept both Date objects and strings
  const d = dateOrStr instanceof Date ? dateOrStr : new Date(dateOrStr);
  if (isNaN(d.getTime())) return '—';
  // Use local date parts to avoid UTC offset shifting
  return `${d.getDate()}. ${d.getMonth() + 1}. ${d.getFullYear()}`;
}
