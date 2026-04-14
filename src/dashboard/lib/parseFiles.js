/**
 * @fileoverview File-parsing utilities for the Call Quality Dashboard.
 *
 * Three source-file formats are supported:
 *
 *   1. aktivity.csv   – semicolon-separated, no header row, Windows-1250 encoding.
 *   2. hodnoceni.xlsx – Excel workbook, first row is a header.
 *   3. obchodnici.xlsx – Excel workbook, first row is a header.
 *
 * Parsed data can then be joined via `joinData` which performs a left-join of
 * hodnoceni onto aktivity on the `na_cislo` field and computes derived KPIs.
 *
 * @typedef {import('../types/index.js').AktivitaRow}   AktivitaRow
 * @typedef {import('../types/index.js').HodnoceniRow}  HodnoceniRow
 * @typedef {import('../types/index.js').ObchodnikRow}  ObchodnikRow
 * @typedef {import('../types/index.js').HovorEnriched} HovorEnriched
 */

import * as XLSX from 'xlsx';

// ─────────────────────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse a Czech-format datetime string "D.MM.YYYY H:mm:ss" into a JS Date.
 * The day and hour components are NOT zero-padded in source data.
 * Returns null if the string cannot be parsed.
 * @param {string} s
 * @returns {Date|null}
 */
function parseCzechDT(s) {
  if (!s || typeof s !== 'string') return null;
  const trimmed = s.trim();
  // Match "D.MM.YYYY H:mm:ss" or "DD.MM.YYYY HH:mm:ss"
  const m = trimmed.match(
    /^(\d{1,2})\.(\d{1,2})\.(\d{4})\s+(\d{1,2}):(\d{2}):(\d{2})$/
  );
  if (!m) return null;
  const [, day, month, year, hour, min, sec] = m.map(Number);
  const d = new Date(year, month - 1, day, hour, min, sec, 0);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Format a Date to an ISO-like string without timezone offset,
 * e.g. "2026-03-15T09:45:00".
 * @param {Date} d
 * @returns {string}
 */
function toISO(d) {
  if (!d || isNaN(d.getTime())) return null;
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

/**
 * Split a single CSV line by semicolons, honouring double-quoted fields.
 * Handles the common Windows-1250 CSV style produced by Czech CRM exports.
 * @param {string} line
 * @returns {string[]}
 */
function splitCSVLine(line) {
  const fields = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped double-quote inside a quoted field
        field += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ';' && !inQuotes) {
      fields.push(field.trim());
      field = '';
    } else {
      field += ch;
    }
  }
  fields.push(field.trim());
  return fields;
}

/**
 * Normalise a cell value to a boolean.
 * Accepts: true/false (JS), 1/0 (number or string), "ano"/"ne", "yes"/"no",
 *          "true"/"false" (case-insensitive).
 * @param {unknown} v
 * @returns {boolean}
 */
function normBool(v) {
  if (typeof v === 'boolean') return v;
  if (v === 1 || v === '1') return true;
  if (v === 0 || v === '0') return false;
  if (typeof v === 'string') {
    const lower = v.trim().toLowerCase();
    if (lower === 'ano' || lower === 'yes' || lower === 'true') return true;
    if (lower === 'ne'  || lower === 'no'  || lower === 'false') return false;
  }
  return Boolean(v);
}

/**
 * Normalise a NA-number value:
 *   - Strip enclosing square brackets: "[NA2603001]" → "NA2603001"
 *   - Ensure "NA" prefix (uppercase): "2603001" → "NA2603001"
 *   - Return null for empty / falsy values.
 * @param {unknown} v
 * @returns {string|null}
 */
function normNaNumber(v) {
  if (v == null || v === '') return null;
  let s = String(v).trim();
  // Strip brackets
  s = s.replace(/^\[|\]$/g, '').trim();
  if (!s) return null;
  // Ensure NA prefix (case-insensitive match first)
  if (/^na\d+$/i.test(s)) {
    return 'NA' + s.slice(2); // normalise to uppercase NA
  }
  if (/^\d+$/.test(s)) {
    return 'NA' + s;
  }
  return s.toUpperCase();
}

/**
 * Parse a numeric cell to a float, returning 0 on failure.
 * @param {unknown} v
 * @returns {number}
 */
function normNum(v) {
  if (typeof v === 'number') return v;
  const n = parseFloat(String(v).replace(',', '.'));
  return isNaN(n) ? 0 : n;
}

/**
 * Return a string or empty string for a cell value.
 * @param {unknown} v
 * @returns {string}
 */
function normStr(v) {
  return v == null ? '' : String(v).trim();
}

/** Lowercase a string, treating null/undefined as ''. */
const low = (s) => normStr(s).toLowerCase();

// ─────────────────────────────────────────────────────────────────────────────
// Excluded obchodnik values (filtered during CSV parse)
// ─────────────────────────────────────────────────────────────────────────────

const EXCLUDED_OBCHODNICI = new Set(['K2', 'Inetprint', 'Obchod - Sales', '']);

// ─────────────────────────────────────────────────────────────────────────────
// 1. parseAktivityCSV
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse an aktivity.csv file.
 *
 * The file is semicolon-separated with NO header row and Windows-1250 encoding.
 * Column positions (0-indexed):
 *   0  – ignored
 *   1  – status (ignored)
 *   2  – flag (ignored)
 *   3  – cas_konce  "D.MM.YYYY H:mm:ss"
 *   4  – cas_zacatku "D.MM.YYYY H:mm:ss"
 *   5  – typ_aktivity
 *   6  – id_aktivity
 *   7  – ignored
 *   8  – predmet
 *   9  – zakaznik
 *   10-12 – ignored
 *   13 – cislo_zakazky
 *   14 – cislo_dokladu
 *   15 – obchodnik
 *   16 – kontakt_zakaznik
 *   17 – ignored
 *   18 – datum "D.MM.YYYY"
 *
 * Rows where obchodnik is "K2", "Inetprint", "Obchod - Sales", or empty
 * are discarded.
 *
 * na_cislo is extracted from [NAxxxxxxx] in predmet via /\[NA(\d+)\]/i.
 * delka_minut is calculated from cas_konce − cas_zacatku.
 *
 * @param {File} file
 * @returns {Promise<AktivitaRow[]>}
 */
export async function parseAktivityCSV(file) {
  try {
    const buffer = await file.arrayBuffer();

    // Decode Windows-1250 encoded text
    let text;
    try {
      const decoder = new TextDecoder('windows-1250');
      text = decoder.decode(buffer);
    } catch {
      // Fallback: some environments don't support windows-1250 label; try cp1250
      try {
        const decoder = new TextDecoder('cp1250');
        text = decoder.decode(buffer);
      } catch {
        const decoder = new TextDecoder('utf-8');
        text = decoder.decode(buffer);
      }
    }

    const lines = text.split(/\r?\n/);
    /** @type {AktivitaRow[]} */
    const rows = [];

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;

      const cols = splitCSVLine(line);

      // Minimum column count check
      if (cols.length < 16) continue;

      const obchodnik = normStr(cols[15]);
      if (EXCLUDED_OBCHODNICI.has(obchodnik)) continue;

      const predmet  = normStr(cols[8]);
      const endStr   = normStr(cols[3]);
      const startStr = normStr(cols[4]);

      // Extract NA number from predmet, e.g. "[NA2603001]"
      const naMatch = predmet.match(/\[NA(\d+)\]/i);
      const na_cislo = naMatch ? `NA${naMatch[1]}` : null;

      // Parse datetimes
      const startDT = parseCzechDT(startStr);
      const endDT   = parseCzechDT(endStr);

      // Duration in minutes (floor); guard against missing/malformed times
      let delka_minut = 0;
      if (startDT && endDT && endDT > startDT) {
        delka_minut = Math.floor((endDT.getTime() - startDT.getTime()) / 60_000);
      }

      rows.push({
        id_aktivity:       normStr(cols[6]),
        cas_zacatku:       startDT ? toISO(startDT) : startStr,
        cas_konce:         endDT   ? toISO(endDT)   : endStr,
        typ_aktivity:      normStr(cols[5]).toUpperCase(),
        predmet,
        zakaznik:          normStr(cols[9]),
        cislo_zakazky:     normStr(cols[13]),
        cislo_dokladu:     normStr(cols[14]),
        obchodnik,
        kontakt_zakaznik:  normStr(cols[16]),
        datum:             cols.length > 18 ? normStr(cols[18]) : '',
        na_cislo,
        delka_minut,
      });
    }

    return rows;
  } catch (err) {
    console.error('[parseAktivityCSV] Error:', err);
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. parseHodnoceniSheet
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Column-name synonyms for case-insensitive header matching in hodnoceni.xlsx.
 * Keys are the canonical field names; values are arrays of acceptable header strings.
 */
const HODNOCENI_HEADER_MAP = {
  na_cislo:               ['na_cislo', 'na číslo', 'na cislo', 'na'],
  datum:                  ['datum', 'date'],
  obchodnik:              ['obchodnik', 'obchodník', 'sales rep', 'prodejce'],
  zakaznik:               ['zakaznik', 'zákazník', 'customer', 'firma'],
  typ_hovoru:             ['typ_hovoru', 'typ hovoru', 'call type', 'typ'],
  segment:                ['segment'],
  essence:                ['essence', 'podstata', 'shrnutí', 'shrnuti'],
  profesionalita:         ['profesionalita', 'professionalism', 'prof'],
  obchodni_dovednosti:    ['obchodni_dovednosti', 'obchodní dovednosti', 'sales skills'],
  zjistovani_potreb:      ['zjistovani_potreb', 'zjišťování potřeb', 'needs discovery'],
  closing:                ['closing', 'uzavírání', 'uzavirani'],
  nalada_zakaznika_start: ['nalada_zakaznika_start', 'nálada start', 'nalada start', 'mood start'],
  nalada_zakaznika_end:   ['nalada_zakaznika_end',   'nálada end',   'nalada end',   'mood end'],
  riziko:                 ['riziko', 'risk'],
  hodnota_dealu:          ['hodnota_dealu', 'hodnota dealu', 'deal value', 'deal'],
  upsell_mozny:           ['upsell_mozny',        'upsell možný',   'upsell mozny'],
  upsell_realizovan:      ['upsell_realizovan',   'upsell realizován', 'upsell realizovan'],
  crosssell_mozny:        ['crosssell_mozny',     'cross-sell možný', 'crosssell mozny'],
  crosssell_realizovan:   ['crosssell_realizovan','cross-sell realizován', 'crosssell realizovan'],
  terminovany_prislib:    ['terminovany_prislib', 'terminovaný příslib', 'terminovany prislib'],
  soft_close:             ['soft_close', 'soft close'],
  dotaz_konkurence:       ['dotaz_konkurence',    'dotaz konkurence', 'competitor inquiry'],
  dotaz_rozhodovatel:     ['dotaz_rozhodovatel',  'dotaz rozhodovatel', 'decision maker'],
  silne_stranky:          ['silne_stranky', 'silné stránky', 'strengths'],
  oblasti_zlepseni:       ['oblasti_zlepseni', 'oblasti zlepšení', 'improvement areas'],
  pochvala:               ['pochvala', 'praise'],
  doporuceni:             ['doporuceni', 'doporučení', 'recommendation'],
  poznamka_managera:      ['poznamka_managera', 'poznámka manažera', 'manager note'],
};

/**
 * Build a mapping { lowercaseHeaderCell → canonicalFieldName } from HODNOCENI_HEADER_MAP.
 * @returns {Map<string, string>}
 */
function buildHodnoceniHeaderLookup() {
  const map = new Map();
  for (const [field, synonyms] of Object.entries(HODNOCENI_HEADER_MAP)) {
    for (const s of synonyms) {
      map.set(s.toLowerCase(), field);
    }
  }
  return map;
}

const HODNOCENI_LOOKUP = buildHodnoceniHeaderLookup();

/**
 * Parse a hodnoceni.xlsx file.
 *
 * The first row is treated as a header; remaining rows are data.
 * Column matching is case-insensitive with synonym support.
 *
 * @param {File} file
 * @returns {Promise<HodnoceniRow[]>}
 */
export async function parseHodnoceniSheet(file) {
  try {
    const buffer = await file.arrayBuffer();
    const uint8  = new Uint8Array(buffer);

    const wb = XLSX.read(uint8, { type: 'array', cellDates: true });
    const wsName = wb.SheetNames[0];
    if (!wsName) return [];

    const ws = wb.Sheets[wsName];
    // header:1 → array-of-arrays; no coercion so we control type conversion
    const raw = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

    if (raw.length < 2) return [];

    // Map header cells → canonical field names
    const headerRow = raw[0];
    /** @type {Array<string|null>} colToField – index i → canonical field name or null */
    const colToField = headerRow.map((cell) => {
      const key = normStr(cell).toLowerCase();
      return HODNOCENI_LOOKUP.get(key) ?? null;
    });

    /** @type {HodnoceniRow[]} */
    const rows = [];

    for (let r = 1; r < raw.length; r++) {
      const dataRow = raw[r];

      // Build an intermediate object from the row
      /** @type {Record<string, unknown>} */
      const obj = {};
      for (let c = 0; c < colToField.length; c++) {
        const field = colToField[c];
        if (field) obj[field] = dataRow[c] ?? '';
      }

      // Skip completely empty rows
      if (!obj['na_cislo'] && !obj['obchodnik'] && !obj['datum']) continue;

      rows.push({
        na_cislo:               normNaNumber(obj['na_cislo']),
        datum:                  normStr(obj['datum']),
        obchodnik:              normStr(obj['obchodnik']),
        zakaznik:               normStr(obj['zakaznik']),
        typ_hovoru:             normStr(obj['typ_hovoru']),
        segment:                normStr(obj['segment']),
        essence:                normStr(obj['essence']),
        profesionalita:         normNum(obj['profesionalita']),
        obchodni_dovednosti:    normNum(obj['obchodni_dovednosti']),
        zjistovani_potreb:      normNum(obj['zjistovani_potreb']),
        closing:                normNum(obj['closing']),
        nalada_zakaznika_start: normNum(obj['nalada_zakaznika_start']),
        nalada_zakaznika_end:   normNum(obj['nalada_zakaznika_end']),
        riziko:                 normStr(obj['riziko']) || 'none',
        hodnota_dealu:          normNum(obj['hodnota_dealu']),
        upsell_mozny:           normBool(obj['upsell_mozny']),
        upsell_realizovan:      normBool(obj['upsell_realizovan']),
        crosssell_mozny:        normBool(obj['crosssell_mozny']),
        crosssell_realizovan:   normBool(obj['crosssell_realizovan']),
        terminovany_prislib:    normBool(obj['terminovany_prislib']),
        soft_close:             normBool(obj['soft_close']),
        dotaz_konkurence:       normBool(obj['dotaz_konkurence']),
        dotaz_rozhodovatel:     normBool(obj['dotaz_rozhodovatel']),
        silne_stranky:          normStr(obj['silne_stranky']),
        oblasti_zlepseni:       normStr(obj['oblasti_zlepseni']),
        pochvala:               normStr(obj['pochvala']),
        doporuceni:             normStr(obj['doporuceni']),
        poznamka_managera:      normStr(obj['poznamka_managera']),
      });
    }

    return rows;
  } catch (err) {
    console.error('[parseHodnoceniSheet] Error:', err);
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. parseObchodniciSheet
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Column-name synonyms for obchodnici.xlsx (case-insensitive).
 */
const OBCHODNICI_HEADER_MAP = {
  prijmeni:          ['prijmeni', 'příjmení', 'last name', 'surname'],
  jmeno_cele:        ['jmeno_cele', 'jméno celé', 'full name', 'jmeno'],
  inicials:          ['inicials', 'inicials', 'initials', 'zkratka'],
  barva:             ['barva', 'color', 'colour', 'hex'],
  role:              ['role', 'pozice', 'position'],
  roky_v_tymu:       ['roky_v_tymu', 'roky v týmu', 'years in team', 'years'],
  aktivni_klienti:   ['aktivni_klienti', 'aktivní klienti', 'active clients', 'klienti'],
  cil_profesionalita:['cil_profesionalita', 'cíl profesionalita', 'target prof'],
  cil_obchodni:      ['cil_obchodni', 'cíl obchodní', 'target sales'],
};

/**
 * @returns {Map<string, string>}
 */
function buildObchodniciHeaderLookup() {
  const map = new Map();
  for (const [field, synonyms] of Object.entries(OBCHODNICI_HEADER_MAP)) {
    for (const s of synonyms) {
      map.set(s.toLowerCase(), field);
    }
  }
  return map;
}

const OBCHODNICI_LOOKUP = buildObchodniciHeaderLookup();

/**
 * Parse an obchodnici.xlsx file.
 *
 * The first row is treated as a header; remaining rows are data.
 *
 * @param {File} file
 * @returns {Promise<ObchodnikRow[]>}
 */
export async function parseObchodniciSheet(file) {
  try {
    const buffer = await file.arrayBuffer();
    const uint8  = new Uint8Array(buffer);

    const wb = XLSX.read(uint8, { type: 'array' });
    const wsName = wb.SheetNames[0];
    if (!wsName) return [];

    const ws = wb.Sheets[wsName];
    const raw = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

    if (raw.length < 2) return [];

    const headerRow = raw[0];
    const colToField = headerRow.map((cell) => {
      const key = normStr(cell).toLowerCase();
      return OBCHODNICI_LOOKUP.get(key) ?? null;
    });

    /** @type {ObchodnikRow[]} */
    const rows = [];

    for (let r = 1; r < raw.length; r++) {
      const dataRow = raw[r];
      const obj = {};
      for (let c = 0; c < colToField.length; c++) {
        const field = colToField[c];
        if (field) obj[field] = dataRow[c] ?? '';
      }

      if (!obj['prijmeni'] && !obj['jmeno_cele']) continue;

      rows.push({
        prijmeni:          normStr(obj['prijmeni']),
        jmeno_cele:        normStr(obj['jmeno_cele']),
        inicials:          normStr(obj['inicials']),
        barva:             normStr(obj['barva']),
        role:              normStr(obj['role']),
        roky_v_tymu:       normNum(obj['roky_v_tymu']),
        aktivni_klienti:   normNum(obj['aktivni_klienti']),
        cil_profesionalita: normNum(obj['cil_profesionalita']),
        cil_obchodni:      normNum(obj['cil_obchodni']),
      });
    }

    return rows;
  } catch (err) {
    console.error('[parseObchodniciSheet] Error:', err);
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. joinData
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Join hodnoceni records with the best matching activity record.
 *
 * Matching strategy (left join – hodnoceni is the primary table):
 *   1. Build an index of INCALL/OUTCALL activities keyed by na_cislo.
 *   2. For each hodnoceni row look up its na_cislo in the index.
 *   3. When multiple activities share the same na_cislo (edge case), prefer
 *      the one whose `obchodnik` matches the hodnoceni row; otherwise take
 *      the first hit.
 *   4. Rows with no matching activity still appear in the output with nulls
 *      for the activity-derived fields and 0 for delka_minut.
 *
 * Computed KPIs added to each enriched row:
 *   - celkove_skore: average of profesionalita, obchodni_dovednosti,
 *                    zjistovani_potreb, closing  (rounded to 2 decimals)
 *   - zmena_nalady:  nalada_zakaznika_end − nalada_zakaznika_start
 *
 * @param {AktivitaRow[]}  aktivity
 * @param {HodnoceniRow[]} hodnoceni
 * @returns {HovorEnriched[]}
 */
export function joinData(aktivity, hodnoceni) {
  // Build index: na_cislo → AktivitaRow[] (only INCALL/OUTCALL)
  /** @type {Map<string, AktivitaRow[]>} */
  const actIndex = new Map();
  for (const act of aktivity) {
    if (act.typ_aktivity !== 'INCALL' && act.typ_aktivity !== 'OUTCALL') continue;
    if (!act.na_cislo) continue;
    const key = act.na_cislo.toUpperCase();
    if (!actIndex.has(key)) actIndex.set(key, []);
    actIndex.get(key).push(act);
  }

  return hodnoceni.map((hod) => {
    const key = hod.na_cislo ? hod.na_cislo.toUpperCase() : null;
    const candidates = key ? (actIndex.get(key) ?? []) : [];

    // Prefer a candidate whose obchodnik matches (last-name comparison, case-insensitive)
    let act = null;
    if (candidates.length === 1) {
      act = candidates[0];
    } else if (candidates.length > 1) {
      const hodObch = low(hod.obchodnik);
      act =
        candidates.find((c) => low(c.obchodnik) === hodObch) ??
        candidates[0];
    }

    // Activity-derived fields
    const cas_zacatku  = act ? normStr(act.cas_zacatku)  || null : null;
    const cas_konce    = act ? normStr(act.cas_konce)    || null : null;
    const delka_minut  = act ? (act.delka_minut ?? 0) : 0;
    const typ_aktivity = act ? (act.typ_aktivity ?? null) : null;

    // celkove_skore: average of 4 skill scores
    const scores = [
      hod.profesionalita,
      hod.obchodni_dovednosti,
      hod.zjistovani_potreb,
      hod.closing,
    ];
    const celkove_skore = Math.round(
      (scores.reduce((a, b) => a + b, 0) / scores.length) * 100
    ) / 100;

    // zmena_nalady: mood delta
    const zmena_nalady = hod.nalada_zakaznika_end - hod.nalada_zakaznika_start;

    return {
      // Spread all HodnoceniRow fields first
      ...hod,
      // Activity enrichment
      cas_zacatku,
      cas_konce,
      delka_minut,
      typ_aktivity,
      // Computed KPIs
      celkove_skore,
      zmena_nalady,
    };
  });
}
