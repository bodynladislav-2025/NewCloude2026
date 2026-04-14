/**
 * @fileoverview JSDoc type definitions for the Call Quality Dashboard.
 * These types describe the shape of data parsed from CSV/XLSX files and
 * the enriched joined records used throughout the UI.
 */

/**
 * @typedef {Object} AktivitaRow
 * Represents one row from aktivity.csv (Windows-1250 encoded, semicolon-separated).
 * @property {string} id_aktivity       - Unique activity identifier
 * @property {string} cas_zacatku       - ISO datetime string (start time)
 * @property {string} cas_konce         - ISO datetime string (end time)
 * @property {string} typ_aktivity      - Activity type: EMP | EMO | EMAIL | INCALL | OUTCALL
 * @property {string} predmet           - Subject / description of the activity
 * @property {string} zakaznik          - Customer / company name
 * @property {string} cislo_zakazky     - Order number
 * @property {string} cislo_dokladu     - Document number
 * @property {string} obchodnik         - Sales rep name (last name)
 * @property {string} kontakt_zakaznik  - Customer contact name
 * @property {string} datum             - Date string (DD.MM.YYYY)
 * @property {string|null} na_cislo     - NA-number extracted from [NAxxxxxxx] pattern in predmet;
 *                                        null when predmet contains no such pattern
 * @property {number} delka_minut       - Duration of the activity in minutes
 */

/**
 * @typedef {Object} HodnoceniRow
 * Represents one row from hodnoceni.xlsx – a call quality evaluation record.
 * @property {string} na_cislo                  - NA-number linking to an activity (e.g. "NA2603001")
 * @property {string} datum                     - Date of the call (DD.MM.YYYY)
 * @property {string} obchodnik                 - Sales rep last name
 * @property {string} zakaznik                  - Customer / company name
 * @property {string} typ_hovoru                - Call type: Akvizice | Péče | Reklamace | Uzavírání
 * @property {string} segment                   - Customer segment: Enterprise | Mid-market | SME
 * @property {string} essence                   - Short one-sentence summary of the call
 * @property {number} profesionalita            - Professionalism score 1–5 (to 1 decimal)
 * @property {number} obchodni_dovednosti       - Sales skills score 1–5 (to 1 decimal)
 * @property {number} zjistovani_potreb         - Needs discovery score 1–5 (to 1 decimal)
 * @property {number} closing                   - Closing score 1–5 (to 1 decimal)
 * @property {number} nalada_zakaznika_start    - Customer mood at call start 1–5
 * @property {number} nalada_zakaznika_end      - Customer mood at call end 1–5
 * @property {string} riziko                    - Risk flag: none | zakázka | zákazník | zakázka+zákazník
 * @property {number} hodnota_dealu             - Deal value in CZK
 * @property {boolean} upsell_mozny             - Upsell opportunity identified
 * @property {boolean} upsell_realizovan        - Upsell actually executed during this call
 * @property {boolean} crosssell_mozny          - Cross-sell opportunity identified
 * @property {boolean} crosssell_realizovan     - Cross-sell actually executed during this call
 * @property {boolean} terminovany_prislib      - Timed commitment / next-step promise made
 * @property {boolean} soft_close               - Soft close attempted during this call
 * @property {boolean} dotaz_konkurence         - Competitor enquiry raised / noted
 * @property {boolean} dotaz_rozhodovatel       - Decision-maker enquiry noted
 * @property {string} silne_stranky             - Strong points observed (pipe-separated list)
 * @property {string} oblasti_zlepseni          - Areas for improvement (pipe-separated list)
 * @property {string} pochvala                  - Praise / positive coaching note from manager
 * @property {string} doporuceni                - Recommendation / coaching instruction
 * @property {string} poznamka_managera         - Manager's free-text note
 */

/**
 * @typedef {Object} ObchodnikRow
 * Represents one row from obchodnici.xlsx – a sales-rep master record.
 * @property {string} prijmeni           - Last name (used as join key)
 * @property {string} jmeno_cele         - Full name "First Last"
 * @property {string} inicials           - Initials, e.g. "OT"
 * @property {string} barva              - Brand colour as hex string, e.g. "#E8308A"
 * @property {string} role               - Job role label, e.g. "KAM Enterprise"
 * @property {number} roky_v_tymu        - Years in the team (integer)
 * @property {number} aktivni_klienti    - Number of active clients (integer)
 * @property {number} cil_profesionalita - Target professionalism score, typically 4.0–4.5
 * @property {number} cil_obchodni       - Target sales-skills score, typically 4.0–4.5
 */

/**
 * @typedef {Object} HovorEnriched
 * A call evaluation row enriched with matching activity data and computed KPIs.
 * Contains every field from {@link HodnoceniRow} plus the following additions:
 * @property {string|null} cas_zacatku  - Call start time from the matching INCALL/OUTCALL
 *                                        activity (ISO string), or null when no match found
 * @property {string|null} cas_konce    - Call end time from the matching activity, or null
 * @property {number} delka_minut       - Call duration in minutes (0 when no activity match)
 * @property {string|null} typ_aktivity - "INCALL" or "OUTCALL" from the matching activity,
 *                                        null when no match found
 * @property {number} celkove_skore     - Average of profesionalita, obchodni_dovednosti,
 *                                        zjistovani_potreb, and closing; rounded to 2 decimals
 * @property {number} zmena_nalady      - Mood delta: nalada_zakaznika_end − nalada_zakaznika_start
 */

// Sentinel export so bundlers and linters recognise this module as having exports.
export const TYPES_DEFINED = true;
