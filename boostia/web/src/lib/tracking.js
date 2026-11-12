// Jednotné měření: vše jde do dataLayer, odkud si eventy bere GTM (GA4, Meta, LinkedIn).
export function track(event, params = {}) {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event, page: window.location.pathname, ...params })
  if (import.meta.env.DEV) console.debug('[track]', event, params)
}

export function trackCta(id, text, section) {
  track('cta_click', { cta_id: id, cta_text: text, section })
}

// Hloubka scrollu 25 / 50 / 75 / 90 %. Vrací funkci pro úklid.
export function watchScrollDepth() {
  const marks = [25, 50, 75, 90]
  const seen = new Set()
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    if (max <= 0) return
    const pct = (window.scrollY / max) * 100
    for (const m of marks) {
      if (pct >= m && !seen.has(m)) { seen.add(m); track('scroll_depth', { percent: m }) }
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  return () => window.removeEventListener('scroll', onScroll)
}

// Consent Mode v2 + líné načtení GTM až po souhlasu.
const KEY = 'boostia_consent_v1'
export function getConsent() {
  try { return JSON.parse(localStorage.getItem(KEY)) } catch { return null }
}
function gtag() { window.dataLayer = window.dataLayer || []; window.dataLayer.push(arguments) }

export function initConsentDefaults() {
  gtag('consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied', wait_for_update: 500,
  })
  const c = getConsent()
  if (c) applyConsent(c, false)
}

export function applyConsent(c, save = true) {
  if (save) { try { localStorage.setItem(KEY, JSON.stringify({ ...c, ts: Date.now() })) } catch { /* soukromý režim */ } }
  gtag('consent', 'update', {
    analytics_storage: c.analytics ? 'granted' : 'denied',
    ad_storage: c.marketing ? 'granted' : 'denied',
    ad_user_data: c.marketing ? 'granted' : 'denied',
    ad_personalization: c.marketing ? 'granted' : 'denied',
  })
  if (c.analytics || c.marketing) loadGtm()
}

let gtmLoaded = false
function loadGtm() {
  const id = import.meta.env.VITE_GTM_ID
  if (!id || gtmLoaded) return
  gtmLoaded = true
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })
  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtm.js?id=${id}`
  document.head.appendChild(s)
}
