// Odesílání formulářů do LeadConnectoru (GoHighLevel) přes Inbound Webhook.
import { track } from './tracking'

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid', 'li_fat_id']
const UTM_STORE = 'boostia_utm'
const QUEUE = 'boostia_lead_queue'

export const WEBHOOKS = {
  audit: import.meta.env.VITE_LC_WEBHOOK_AUDIT,
  calc: import.meta.env.VITE_LC_WEBHOOK_CALC,
  prep: import.meta.env.VITE_LC_WEBHOOK_PREP,
  contact: import.meta.env.VITE_LC_WEBHOOK_CONTACT,
}

// UTM parametry si pamatujeme od první návštěvy.
export function captureUtm() {
  try {
    const p = new URLSearchParams(window.location.search)
    const stored = JSON.parse(sessionStorage.getItem(UTM_STORE) || '{}')
    let changed = false
    for (const k of UTM_KEYS) if (p.get(k)) { stored[k] = p.get(k); changed = true }
    if (!stored.landing_page) { stored.landing_page = window.location.pathname; stored.referrer = document.referrer || ''; changed = true }
    if (changed) sessionStorage.setItem(UTM_STORE, JSON.stringify(stored))
  } catch { /* bez úložiště */ }
}
function utm() { try { return JSON.parse(sessionStorage.getItem(UTM_STORE) || '{}') } catch { return {} } }

async function post(url, payload) {
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
  if (!res.ok) throw new Error('HTTP ' + res.status)
}

/**
 * @param {'audit'|'calc'|'prep'|'contact'} kind
 * @returns {Promise<{ok: boolean, queued?: boolean, demo?: boolean}>}
 */
export async function submitLead(kind, data) {
  const payload = { ...data, ...utm(), pageUrl: window.location.href, submittedAt: new Date().toISOString(), form: kind }
  const url = WEBHOOKS[kind]
  if (!url) {
    // Webhook ještě není nastaven (.env). Web funguje dál, data se jen vypíší do konzole.
    console.warn(`[leadconnector] Chybí VITE_LC_WEBHOOK_${kind.toUpperCase()}. Payload:`, payload)
    return { ok: true, demo: true }
  }
  try {
    await post(url, payload)
    return { ok: true }
  } catch (err) {
    track('form_error', { form_id: kind, message: String(err.message || err) })
    try {
      const q = JSON.parse(localStorage.getItem(QUEUE) || '[]')
      q.push({ kind, payload })
      localStorage.setItem(QUEUE, JSON.stringify(q))
    } catch { /* bez úložiště */ }
    return { ok: false, queued: true }
  }
}

// Po návratu signálu zkusíme odeslat, co se nepovedlo.
export async function flushQueue() {
  let q
  try { q = JSON.parse(localStorage.getItem(QUEUE) || '[]') } catch { return }
  if (!q.length) return
  const rest = []
  for (const item of q) {
    const url = WEBHOOKS[item.kind]
    if (!url) continue
    try { await post(url, item.payload) } catch { rest.push(item) }
  }
  try { localStorage.setItem(QUEUE, JSON.stringify(rest)) } catch { /* nic */ }
}

// Bodování kvalifikačního formuláře. Zdroj pravdy je workflow v LeadConnectoru, tady jen kvůli směrování na webu.
export const SCORE = {
  teamSize: { '1–3': 0, '4–7': 2, '8–15': 3, '16–40': 3, '41+': 2 },
  role: { 'Jednatel / majitel': 3, 'Obchodní ředitel / vedoucí obchodu': 3, 'HR / vzdělávání': 2, 'Obchodník': 0, 'Jiná': 0 },
  crm: { 'Raynet': 1, 'Pipedrive': 1, 'HubSpot': 1, 'Salesforce': 1, 'eWay-CRM': 1, 'Jiné': 1, 'Excel': 1, 'Žádné': 0 },
  decision: { 'Já': 2, 'Já s někým dalším': 2, 'Někdo jiný': 0 },
  timeline: { 'Do 2 měsíců': 3, 'Do půl roku': 2, 'Zatím jen zjišťuji': 0 },
  subsidy: { 'Ano': 1, 'Ne': 0, 'Nevím, co to obnáší': 1 },
}

export function scoreLead(a) {
  const score = Object.keys(SCORE).reduce((s, k) => s + (SCORE[k][a[k]] ?? 0), 0)
  const small = a.teamSize === '1–3'
  let route = 'nurture'
  if (score >= 6 && !small) route = 'audit'
  else if (score >= 3 && !small) route = 'uvodni'
  return { score, route }
}
