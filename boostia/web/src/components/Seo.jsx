import { useEffect } from 'react'

const SITE = (import.meta.env.VITE_SITE_URL || 'https://www.boostia.cz').replace(/\/$/, '')

function setMeta(sel, attr, key, content) {
  let el = document.head.querySelector(sel)
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el) }
  el.setAttribute('content', content)
}

export const ORG = {
  '@context': 'https://schema.org', '@type': 'Organization', name: 'Boostia', url: SITE, logo: SITE + '/favicon.svg',
  description: 'Měřený AI trénink pro obchodní týmy a AI agenti na míru.',
}

export const faqSchema = (items) => ({
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: items.map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: typeof i.a === 'string' ? i.a : i.text || '' } })),
})

// Title, description, canonical, OG a JSON-LD pro každou stránku.
export default function Seo({ title, description, path = '/', noindex = false, schema = [] }) {
  useEffect(() => {
    document.title = title
    setMeta('meta[name="description"]', 'name', 'description', description)
    setMeta('meta[property="og:title"]', 'property', 'og:title', title)
    setMeta('meta[property="og:description"]', 'property', 'og:description', description)
    setMeta('meta[property="og:url"]', 'property', 'og:url', SITE + path)
    setMeta('meta[name="robots"]', 'name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')
    let link = document.head.querySelector('link[rel="canonical"]')
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link) }
    link.href = SITE + path
    document.head.querySelectorAll('script[data-seo]').forEach((s) => s.remove())
    for (const obj of schema) {
      const s = document.createElement('script')
      s.type = 'application/ld+json'; s.dataset.seo = '1'; s.textContent = JSON.stringify(obj)
      document.head.appendChild(s)
    }
  }, [title, description, path, noindex]) // eslint-disable-line react-hooks/exhaustive-deps
  return null
}
