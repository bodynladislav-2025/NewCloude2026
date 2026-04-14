/**
 * @fileoverview Realistic Czech B2B sales-call quality sample data for development and demo.
 *
 * All data is fully deterministic (no Math.random()) so Hot Module Replacement and
 * snapshot tests remain stable across reloads.
 *
 * Exports:
 *   sampleObchodnici  – 12 {@link ObchodnikRow} records
 *   sampleAktivity    – 180 {@link AktivitaRow} records spanning Jan–Apr 2026
 *   sampleHodnoceni   – 40 {@link HodnoceniRow} records
 *
 * @typedef {import('../types/index.js').AktivitaRow}   AktivitaRow
 * @typedef {import('../types/index.js').HodnoceniRow}  HodnoceniRow
 * @typedef {import('../types/index.js').ObchodnikRow}  ObchodnikRow
 */

// ─────────────────────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Zero-pad a number to two digits. */
const pad2 = (n) => String(n).padStart(2, '0');

/**
 * Format a Date as "D.MM.YYYY H:mm:ss" matching the Czech CRM export format.
 * Note: day is NOT zero-padded (matches real exports), hours are not zero-padded.
 * @param {Date} d
 * @returns {string}
 */
function fmtDT(d) {
  return `${d.getDate()}.${pad2(d.getMonth() + 1)}.${d.getFullYear()} ${d.getHours()}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
}

/**
 * Format a Date as "D.MM.YYYY".
 * @param {Date} d
 * @returns {string}
 */
function fmtD(d) {
  return `${d.getDate()}.${pad2(d.getMonth() + 1)}.${d.getFullYear()}`;
}

/** Round to one decimal place. */
const r1 = (n) => Math.round(n * 10) / 10;

/**
 * Simple deterministic pseudo-random float in [0,1) from a seed integer.
 * Uses a linear-congruential generator.
 * @param {number} seed
 * @returns {number} value in [0,1)
 */
function lcg(seed) {
  const s = (seed * 1664525 + 1013904223) & 0xffffffff;
  return (s >>> 0) / 0x100000000;
}

/**
 * Pick element from array using a deterministic seed.
 * @template T
 * @param {T[]} arr
 * @param {number} seed
 * @returns {T}
 */
const dpick = (arr, seed) => arr[Math.abs(seed) % arr.length];

/**
 * Deterministic integer in [min, max] inclusive.
 * @param {number} min
 * @param {number} max
 * @param {number} seed
 * @returns {number}
 */
const dint = (min, max, seed) => min + (Math.abs(seed) % (max - min + 1));

/**
 * Build a Date for a workday in Jan–Apr 2026.
 * dayIndex runs 0–99; skips Sat/Sun.
 * hour is an integer business hour 8–16.
 * @param {number} dayIndex
 * @param {number} hour
 * @param {number} minute
 * @param {number} second
 * @returns {Date}
 */
function workDay(dayIndex, hour, minute, second) {
  // Start: Monday 5 Jan 2026
  const base = new Date(2026, 0, 5); // month is 0-indexed
  let d = new Date(base);
  let added = 0;
  let checked = 0;
  while (added <= dayIndex) {
    d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + checked);
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) added++;
    checked++;
  }
  d.setHours(hour, minute, second, 0);
  return d;
}

// ─────────────────────────────────────────────────────────────────────────────
// Reference lookup tables
// ─────────────────────────────────────────────────────────────────────────────

const LAST_NAMES = [
  'Tarasyuk', 'Hofmann', 'Smutná', 'Candrová', 'Kalista', 'Slavík',
  'Kaucká', 'Loskotová', 'Šimková', 'Machová', 'Rákosníková', 'Königová',
];

const FIRST_NAMES = [
  'Olena', 'Tomáš', 'Petra', 'Markéta', 'Pavel', 'Jan',
  'Lucie', 'Hana', 'Veronika', 'Zuzana', 'Jana', 'Alena',
];

const ROLES = [
  'Senior KAM', 'KAM Enterprise', 'Inside Sales', 'Junior KAM',
  'Senior KAM', 'KAM Enterprise', 'Inside Sales', 'Junior KAM',
  'Senior KAM', 'Inside Sales', 'KAM Enterprise', 'Junior KAM',
];

const COLORS = [
  '#E8308A', '#7B3FF2', '#3B7BE8', '#10B981',
  '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4',
  '#F97316', '#84CC16', '#EC4899', '#14B8A6',
];

/** @type {number[]} – years in team, index-aligned to LAST_NAMES */
const YEARS   = [6, 8, 3, 1, 7, 5, 2, 1, 6, 4, 5, 2];
/** @type {number[]} – active clients */
const CLIENTS = [52, 38, 60, 22, 45, 33, 55, 18, 48, 58, 28, 25];
/** @type {number[]} – target professionalism score */
const T_PROF  = [4.5, 4.5, 4.0, 4.0, 4.5, 4.3, 4.0, 4.0, 4.5, 4.0, 4.3, 4.0];
/** @type {number[]} – target sales-skills score */
const T_OBCH  = [4.3, 4.5, 4.0, 4.0, 4.3, 4.3, 4.0, 4.0, 4.5, 4.0, 4.3, 4.0];

const COMPANIES = [
  'Alfa s.r.o.',            'Beta Group a.s.',       'Gamma Tech s.r.o.',
  'Delta Systémy a.s.',     'Epsilon Consulting s.r.o.', 'Zeta Logistics a.s.',
  'Eta Solutions s.r.o.',   'Theta Industries a.s.', 'Iota Services s.r.o.',
  'Kappa Manufacturing a.s.', 'Lambda Digital s.r.o.', 'Mu Finance a.s.',
  'Nu Pharma s.r.o.',       'Xi Automotive a.s.',    'Omikron Steel s.r.o.',
  'Pi Energy a.s.',         'Rho Construction s.r.o.', 'Sigma Media a.s.',
  'Tau Retail s.r.o.',      'Upsilon IT a.s.',       'Phi Medical s.r.o.',
  'Chi Agro a.s.',          'Psi Transport s.r.o.',  'Omega Real Estate a.s.',
  'Novák a partneři s.r.o.', 'CzechTech Innovations a.s.', 'Praga Soft s.r.o.',
  'Moravia Industrial a.s.', 'Bohemia Trade s.r.o.', 'Silesia Group a.s.',
];

const CONTACTS = [
  'Ing. Pavel Novák',          'Mgr. Jana Horáčková',    'Bc. Martin Dvořák',
  'PhDr. Lucie Procházková',   'Ing. Tomáš Krejčí',      'Mgr. Eva Nováková',
  'Ing. Jakub Pokorný',        'Bc. Tereza Marková',      'Ing. Ondřej Veselý',
  'Mgr. Zuzana Blažková',      'Ing. Radek Fiala',        'Mgr. Alena Kopecká',
  'Bc. Stanislav Horak',       'Ing. Simona Havlíčková',  'Mgr. Ondřej Pospíšil',
];

/** Activity type distribution: ~38% OUTCALL, 22% INCALL, 20% EMP, 12% EMO, 8% EMAIL */
const TYP_DIST = [
  'OUTCALL','OUTCALL','OUTCALL','OUTCALL','OUTCALL','OUTCALL','OUTCALL','OUTCALL',
  'INCALL', 'INCALL', 'INCALL', 'INCALL', 'INCALL',
  'EMP',    'EMP',    'EMP',    'EMP',    'EMP',
  'EMO',    'EMO',    'EMO',
  'EMAIL',  'EMAIL',
];

const PREDMET_CALL = [
  (na) => `Hovor se zákazníkem [${na}] - rozšíření smlouvy`,
  (na) => `Telefonická konzultace produktového portfolia [${na}]`,
  (na) => `Follow-up nabídky Q1 2026 [${na}]`,
  (na) => `Řešení reklamace – expedice [${na}]`,
  (na) => `Prezentace nového řešení [${na}]`,
  (na) => `Prodloužení servisní smlouvy [${na}]`,
  (na) => `Upsell – cloudová platforma [${na}]`,
  (na) => `Cross-sell – bezpečnostní audit [${na}]`,
  (na) => `Zpracování poptávky [${na}]`,
  (na) => `Revize podmínek rámcové smlouvy [${na}]`,
  (na) => `Onboarding nového zákazníka [${na}]`,
  (na) => `Výroční hodnocení spolupráce [${na}]`,
];

const PREDMET_EMP = [
  'Porada týmu – Q1 review', 'Pipeline review', 'Forecast meeting Q1',
  'Týmová schůzka', 'Koučink 1:1', 'Sales standup', 'Obchodní porada',
];

const PREDMET_EMO = [
  'Školení: Produktové znalosti', 'Školení: Obchodní dovednosti',
  'Workshop: CRM systém', 'Školení: Technika prodeje', 'E-learningový kurz',
];

const PREDMET_EMAIL = [
  'Email: Nabídka – follow-up', 'Email: Potvrzení objednávky',
  'Email: Informace o novinkách', 'Email: Poptávkový formulář',
];

// ─────────────────────────────────────────────────────────────────────────────
// 1. sampleObchodnici  (12 records)
// ─────────────────────────────────────────────────────────────────────────────

/** @type {ObchodnikRow[]} */
export const sampleObchodnici = LAST_NAMES.map((prijmeni, i) => ({
  prijmeni,
  jmeno_cele:          `${FIRST_NAMES[i]} ${prijmeni}`,
  inicials:            `${FIRST_NAMES[i][0]}${prijmeni[0]}`,
  barva:               COLORS[i],
  role:                ROLES[i],
  roky_v_tymu:         YEARS[i],
  aktivni_klienti:     CLIENTS[i],
  cil_profesionalita:  T_PROF[i],
  cil_obchodni:        T_OBCH[i],
}));

// ─────────────────────────────────────────────────────────────────────────────
// 2. sampleAktivity  (180 records spanning Jan–Apr 2026)
// ─────────────────────────────────────────────────────────────────────────────

// Build a pool of 120 NA numbers; each call activity consumes one.
/** @type {string[]} */
const NA_POOL = Array.from({ length: 120 }, (_, i) =>
  `NA${String(2603001 + i * 3).padStart(7, '0')}`
);

/** @type {AktivitaRow[]} */
export const sampleAktivity = (() => {
  /** @type {AktivitaRow[]} */
  const rows = [];
  let actCounter = 100001;
  let naIdx = 0;
  let dayIdx = 0;

  // Each of the 12 obchodnici gets exactly 15 activities → 180 total
  sampleObchodnici.forEach((ob, oIdx) => {
    for (let j = 0; j < 15; j++) {
      const seed = oIdx * 100 + j * 7 + 13;
      const typ  = dpick(TYP_DIST, seed + oIdx + j);

      // Spread workdays: each record advances ~0.5 workdays
      const myDay = Math.floor((oIdx * 15 + j) * 0.55) % 88;
      const hour  = dint(8, 16, seed + 3);
      const min   = dint(0, 59, seed + 5);
      const sec   = dint(0, 59, seed + 9);
      const start = workDay(myDay, hour, min, sec);

      // Duration: calls 5–45 min, meetings 20–90 min, emails 1–4 min
      let deltaMins;
      if (typ === 'INCALL' || typ === 'OUTCALL') {
        deltaMins = dint(5, 45, seed + 17);
      } else if (typ === 'EMP' || typ === 'EMO') {
        deltaMins = dint(20, 90, seed + 23);
      } else {
        deltaMins = dint(1, 4, seed + 29);
      }
      const end = new Date(start.getTime() + deltaMins * 60_000);

      const isCall = typ === 'INCALL' || typ === 'OUTCALL';
      const naNum  = isCall ? NA_POOL[naIdx++ % NA_POOL.length] : null;

      const company = dpick(COMPANIES, seed + oIdx * 3);
      const contact = dpick(CONTACTS, seed + j * 3);

      let predmet;
      if (isCall && naNum) {
        predmet = dpick(PREDMET_CALL, seed + j)(naNum) + ` – ${company}`;
      } else if (typ === 'EMP') {
        predmet = dpick(PREDMET_EMP, seed + j);
      } else if (typ === 'EMO') {
        predmet = dpick(PREDMET_EMO, seed + j);
      } else {
        predmet = dpick(PREDMET_EMAIL, seed + j) + ` – ${company}`;
      }

      rows.push({
        id_aktivity:       `ACT${String(actCounter++).padStart(6, '0')}`,
        cas_zacatku:       fmtDT(start),
        cas_konce:         fmtDT(end),
        typ_aktivity:      typ,
        predmet,
        zakaznik:          isCall ? company : (typ === 'EMAIL' ? company : ''),
        cislo_zakazky:     `ZAK-26-${String(10000 + dint(0, 9999, seed + 31)).padStart(5, '0')}`,
        cislo_dokladu:     `DOK-${String(20000 + dint(0, 9999, seed + 37)).padStart(5, '0')}`,
        obchodnik:         ob.prijmeni,
        kontakt_zakaznik:  isCall ? contact : '',
        datum:             fmtD(start),
        na_cislo:          naNum,
        delka_minut:       deltaMins,
      });
    }
  });

  return rows;
})();

// ─────────────────────────────────────────────────────────────────────────────
// 3. sampleHodnoceni  (40 records)
// ─────────────────────────────────────────────────────────────────────────────

const TYP_HOVORU  = ['Akvizice', 'Péče', 'Reklamace', 'Uzavírání'];
const SEGMENTY    = ['Enterprise', 'Mid-market', 'SME'];
/** Risk distribution: ~78 % none, rest split across 3 risk levels */
const RIZIKA      = [
  'none','none','none','none','none','none','none','none','none','none',
  'none','none','none',
  'zakázka', 'zakázka',
  'zákazník', 'zákazník',
  'zakázka+zákazník',
];

const SILNE_STRANKY_POOL = [
  'Aktivní naslouchání',          'Jasná argumentace benefitů',
  'Empatie se zákazníkem',        'Znalost produktového portfolia',
  'Profesionální zahájení hovoru','Efektivní zjišťování potřeb',
  'Přesvědčivý closing',          'Orientace na zákazníka',
  'Rychlá reakce na námitky',     'Budování vztahu se zákazníkem',
  'Správné tempo řeči',           'Konzistentnost sdělení',
];

const OBLASTI_POOL = [
  'Hlubší zjišťování potřeb',       'Práce s námitkami',
  'Silnější closing technique',      'Větší sebejistota v prezentaci ceny',
  'Kratší úvodní monolog',           'Konkrétnější follow-up kroky',
  'Aktivnější dotazování',           'Lepší time management hovoru',
  'Více prostoru pro zákazníka',     'Ověření porozumění na konci hovoru',
  'Systematičtější pipeline follow-up', 'Mapování rozhodovatelů',
];

const POCHVALY = [
  'Skvěle jsi zvládl(a) námitku ohledně ceny – zákazník byl po tvé odpovědi zjevně uklidněn.',
  'Velmi přirozený a přátelský tón hovoru, zákazník se cítil komfortně celou dobu.',
  'Výborná práce s referencemi – konkrétní příklady výrazně zvýšily důvěryhodnost.',
  'Profesionální reakce na eskalaci reklamace, zákazník ocenil rychlé řešení.',
  'Dobrý rytmus hovoru, nenechal(a) ses vyvést z míry ani při překvapivé otázce.',
  'Výběr správného momentu pro nabídku upsell byl přesný a přirozený.',
  'Skvělé shrnutí na konci hovoru – zákazník přesně věděl, co bude následovat.',
  'Citlivý přístup k situaci zákazníka, který procházel interní reorganizací.',
  'Obchodník skvěle zvládl náročného zákazníka a dokázal elegantně otočit negativní náladu.',
  'Výborná příprava na hovor, znalost zákaznické situace na velmi vysoké úrovni.',
];

const DOPORUCENI = [
  'Zkus v příštím hovoru otevřít téma rozpočtu dříve – ušetříš čas oběma stranám.',
  'Doporučuji procvičit techniku „tie-down" otázek pro pevnější closing.',
  'Při příštím volání zkus shrnout dohodnuté kroky ve formě jasného e-mailového follow-upu.',
  'Zaměř se na kratší věty a více pauz – zákazník pak lépe vstřebá sdělení.',
  'Vyzkoušej SPIN Selling strukturu v prvních 5 minutách rozhovoru.',
  'Pro reklamační hovory připrav si 2–3 standardní fráze pro deeskalaci napětí.',
  'Přidej do hovoru ověřovací otázku: „Je to přesně to, co jste hledal(a)?"',
  'Snaž se méně používat pasivní fráze jako „pokusíme se" – nahraď je konkrétními závazky.',
  'Procvičit zvládání cenových námitek – připravit si 3 varianty odpovědi.',
  'Posílit dovednost mapování rozhodovacího procesu u zákazníka.',
];

const ESSENCE_POOL = [
  'Zákazník ověřoval možnost rozšíření licence na dalších 20 uživatelů.',
  'Řešení stížnosti na zpoždění dodávky – zákazník požadoval kompenzaci.',
  'Prezentace nové modulární platformy, zákazník má zájem o demo.',
  'Follow-up po zaslané nabídce – zákazník váhá mezi dvěma variantami.',
  'Prodloužení roční smlouvy, zákazník vyjednal lepší podmínky SLA.',
  'První kontakt s novou kontaktní osobou po odchodu původního nákupčího.',
  'Projednání podmínek rámcové smlouvy na rok 2026.',
  'Zákazník informoval o plánované akvizici – potenciál 3× větší smlouvy.',
  'Řešení technické integrace s jejich ERP systémem.',
  'Zákazník zvažuje konkurenční řešení – klíčové udržovací volání.',
  'Cross-sell příležitost identifikována, zákazník otevřený dalšímu produktu.',
  'Výroční review – zákazník velmi spokojen, hodnotí spolupráci 9/10.',
];

const POZNAMKY_MANAGERA = [
  'Hovor proběhl v náročném období pro zákazníka, výsledek je solidní.',
  'Zákazník signalizoval zájem o rozšíření spolupráce – sledovat v CRM.',
  'Pipeline pro tento zákazník vypadá dobře, doporučuji prioritizovat.',
  'Projekt byl v ohrožení, obchodník situaci stabilizoval.',
  'Zákazník byl zpočátku odmítavý, ale obchodník situaci zvládl.',
  'Výborný výsledek, zákazník přislíbil rozhodnutí do konce měsíce.',
  'Doporučuji sdílet jako best practice v týmu.',
  '',
  '',
  '',
];

// Select call activities (INCALL or OUTCALL with a NA number)
const CALL_ACTS = sampleAktivity.filter(
  (a) => (a.typ_aktivity === 'INCALL' || a.typ_aktivity === 'OUTCALL') && a.na_cislo
);

// Available deal value buckets (CZK)
const DEAL_VALUES = [5000, 12000, 25000, 48000, 75000, 120000, 200000, 350000, 500000];

/**
 * Build a pipe-separated string of k distinct items from pool starting at offset.
 * @param {string[]} pool
 * @param {number} k
 * @param {number} offset
 * @returns {string}
 */
function piped(pool, k, offset) {
  const result = [];
  for (let i = 0; i < k; i++) {
    result.push(pool[(offset + i * 5) % pool.length]);
  }
  // Deduplicate while preserving order
  return [...new Set(result)].join('|');
}

/** @type {HodnoceniRow[]} */
export const sampleHodnoceni = Array.from({ length: 40 }, (_, i) => {
  const seed = i * 19 + 7;
  const act  = CALL_ACTS[i % CALL_ACTS.length];

  // Base score drifts across 2.8–4.9 depending on record index (realistic spread)
  const base = r1(2.8 + (lcg(seed) * 2.1));
  const prof  = r1(Math.min(5.0, Math.max(1.0, base + (lcg(seed + 1) - 0.5) * 0.8)));
  const obch  = r1(Math.min(5.0, Math.max(1.0, base + (lcg(seed + 2) - 0.5) * 0.8)));
  const zjist = r1(Math.min(5.0, Math.max(1.0, base + (lcg(seed + 3) - 0.5) * 0.8)));
  const clos  = r1(Math.min(5.0, Math.max(1.0, base + (lcg(seed + 4) - 0.5) * 0.8)));

  // Mood 2–5 (integer-ish for readability)
  const nalaStart = 2 + dint(0, 2, seed + 5);
  const nalaEnd   = Math.min(5, Math.max(1, nalaStart + dint(0, 2, seed + 6) - 1));

  const upsellMozny    = lcg(seed + 7) > 0.42;
  const crossMozny     = lcg(seed + 9) > 0.48;
  const terminovany    = lcg(seed + 11) > 0.50;
  const softClose      = lcg(seed + 13) > 0.38;
  const dotazKonk      = lcg(seed + 15) > 0.62;
  const dotazRozh      = lcg(seed + 17) > 0.48;

  return {
    na_cislo:               act.na_cislo,
    datum:                  act.datum,
    obchodnik:              act.obchodnik,
    zakaznik:               act.zakaznik || dpick(COMPANIES, seed),
    typ_hovoru:             dpick(TYP_HOVORU, seed + 1),
    segment:                dpick(SEGMENTY, seed + 3),
    essence:                dpick(ESSENCE_POOL, seed + 5),
    profesionalita:         prof,
    obchodni_dovednosti:    obch,
    zjistovani_potreb:      zjist,
    closing:                clos,
    nalada_zakaznika_start: nalaStart,
    nalada_zakaznika_end:   nalaEnd,
    riziko:                 dpick(RIZIKA, seed + 7),
    hodnota_dealu:          dpick(DEAL_VALUES, seed + 9),
    upsell_mozny:           upsellMozny,
    upsell_realizovan:      upsellMozny && lcg(seed + 19) > 0.55,
    crosssell_mozny:        crossMozny,
    crosssell_realizovan:   crossMozny && lcg(seed + 21) > 0.60,
    terminovany_prislib:    terminovany,
    soft_close:             softClose,
    dotaz_konkurence:       dotazKonk,
    dotaz_rozhodovatel:     dotazRozh,
    silne_stranky:          piped(SILNE_STRANKY_POOL, 2 + dint(0, 2, seed + 23), seed),
    oblasti_zlepseni:       piped(OBLASTI_POOL,       1 + dint(0, 2, seed + 25), seed + 6),
    pochvala:               dpick(POCHVALY, seed + 27),
    doporuceni:             dpick(DOPORUCENI, seed + 29),
    poznamka_managera:      dpick(POZNAMKY_MANAGERA, seed + 31),
  };
});
