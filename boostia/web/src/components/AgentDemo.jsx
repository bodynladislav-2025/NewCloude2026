import { useEffect, useRef, useState } from 'react'
import { RotateCcw, SkipForward } from 'lucide-react'
import { prefersReducedMotion } from '../lib/motion'
import { track } from '../lib/tracking'

// Simulovaná ukázka: obecné scénáře bez jmen firem a bez vymyšlených výsledků.
const SCENARIOS = [
  {
    id: 'priprava', tab: 'Příprava schůzky', manual: 'Ručně: 40 minut',
    user: 'Zítra v 10:00 mám první schůzku s výrobním ředitelem firmy na obráběcí stroje, 120 zaměstnanců. Vkládám text z jejich webu a poslední aktuality. Připrav mi brief.',
    ai: [
      ['Brief na schůzku', ''],
      ['1) Co o firmě víme', 'Rodinná strojírenská firma, zakázková výroba, většina produkce jde na export. V aktualitách zmiňují novou halu a nábor obsluhy strojů.'],
      ['2) Pravděpodobné priority výrobního ředitele', 'Vytížení nové kapacity. Nedostatek kvalifikovaných lidí. Dodací lhůty a prostoje.'],
      ['3) Otázky, které otevřou potřebu', 'Co se pro vás změnilo spuštěním nové haly? Kde dnes vzniká nejvíc prostojů? Jak řešíte zaučení nových lidí? Podle čeho se rozhodujete u dodavatelů? Kdo další se k tomu vyjadřuje?'],
      ['4) Co z naší nabídky dává smysl', 'Začít tím, co zkracuje prostoje. Rozšíření nechat na druhou schůzku.'],
      ['5) Na co si dát pozor', 'Údaje z webu mohou být starší. Ověřte si počet směn a kdo o nákupu rozhoduje.'],
    ],
  },
  {
    id: 'zapis', tab: 'Zápis ze schůzky', manual: 'Ručně: druhý den, pokud vůbec',
    user: 'Tady je přepis dnešní schůzky. Udělej zápis, úkoly a návrh follow-up e-mailu.',
    ai: [
      ['Zápis ze schůzky', ''],
      ['Současný stav klienta', 'Nová hala běží na jednu směnu. Prostoje vznikají hlavně při přestavbách strojů.'],
      ['Potřeby a námitky', 'Chtějí zkrátit přestavby. Obava: zaučení obsluhy a termín dodání.'],
      ['Úkoly', 'Já: poslat nabídku se dvěma variantami do pátku. Klient: dodat data o prostojích za poslední kvartál.'],
      ['Pole do CRM', 'Fáze: nabídka. Rozhodovatel: výrobní ředitel + jednatel. Termín rozhodnutí: do konce měsíce.'],
      ['Návrh follow-upu', 'Dobrý den, děkuji za dnešní schůzku. Shodli jsme se na třech bodech… Do pátku posílám nabídku ve dvou variantách. Hodí se vám krátký hovor v úterý v 9:00, nebo ve středu ve 14:00?'],
    ],
  },
  {
    id: 'nabidka', tab: 'Návrh nabídky', manual: 'Ručně: několik dní',
    user: 'Ze zápisu výše připrav strukturu nabídky v naší šabloně. Ceny doplním sám.',
    ai: [
      ['Návrh nabídky', ''],
      ['Situace klienta jeho slovy', '„Nová hala běží, ale přestavby nám berou kapacitu.“'],
      ['Cíl', 'Zkrátit přestavby a zvýšit vytížení nové haly.'],
      ['Tři varianty', 'Základní: jeden stroj, zaškolení obsluhy. Doporučená: celá linka, zaškolení a podpora při náběhu. Rozšířená: navíc servisní smlouva.'],
      ['Harmonogram a další krok', 'Dodání a zaškolení po týdnech. Další krok: společné projití nabídky s jednatelem.'],
      ['Ke kontrole člověkem', 'Ceny, dodací termíny a technické parametry doplňte a ověřte. AI píše návrh, za nabídku ručí obchodník.'],
    ],
  },
]

const SPEED = 22 // ms na znak

export default function AgentDemo() {
  const [tab, setTab] = useState(0)
  const [chars, setChars] = useState(0)
  const [started, setStarted] = useState(false)
  const box = useRef(null)
  const sc = SCENARIOS[tab]
  const full = sc.ai.map(([h, t]) => h + '\n' + t).join('\n')
  const total = full.length
  const done = chars >= total

  // Spustit, až je ukázka z poloviny vidět
  useEffect(() => {
    if (prefersReducedMotion()) { setStarted(true); return }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStarted(true); io.disconnect() } }, { threshold: 0.5 })
    io.observe(box.current)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return
    if (prefersReducedMotion()) { setChars(total); return }
    if (chars === 0) track('demo_play', { scenario: sc.id })
    if (done) { track('demo_complete', { scenario: sc.id }); return }
    const t = setTimeout(() => setChars((c) => Math.min(total, c + 3)), SPEED * 3)
    return () => clearTimeout(t)
  }, [started, chars, total, done, sc.id])

  const pick = (i) => { setTab(i); setChars(0); setStarted(true) }

  // Vykreslení jen tolik znaků, kolik už „dopsal"
  let left = chars
  const blocks = sc.ai.map(([h, t]) => {
    const hs = h.slice(0, Math.max(0, left)); left -= h.length + 1
    const ts = t.slice(0, Math.max(0, left)); left -= t.length + 1
    return [hs, ts]
  })

  return (
    <div ref={box} className="overflow-hidden rounded-[14px] border border-line bg-surface">
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <div role="tablist" aria-label="Scénáře ukázky" className="flex gap-1 overflow-x-auto">
          {SCENARIOS.map((s, i) => (
            <button key={s.id} role="tab" aria-selected={tab === i} onClick={() => pick(i)}
              className={`min-h-[40px] whitespace-nowrap rounded-full px-4 text-[14px] transition-colors ${tab === i ? 'bg-accent text-accentink' : 'text-muted hover:text-ink'}`}>{s.tab}</button>
          ))}
        </div>
        <span className="hidden shrink-0 font-mono text-[11px] uppercase tracking-wider text-muted sm:block">Simulovaná ukázka</span>
      </div>

      <div className="space-y-5 p-5 lg:p-8" role="tabpanel">
        <div className="ml-auto max-w-[85%] rounded-[14px] rounded-br-sm bg-surface2 px-4 py-3 text-[15px] lg:max-w-[70%]">
          <p className="mb-1 font-mono text-[11px] uppercase tracking-wider text-muted">Obchodník</p>{sc.user}
        </div>
        <div className="min-h-[420px] max-w-[92%] rounded-[14px] rounded-bl-sm border border-line bg-bg px-4 py-4 text-[15px] lg:min-h-[360px] lg:max-w-[80%]" aria-label={full}>
          <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-accent">AI asistent</p>
          <div aria-hidden="true" className="space-y-3">
            {blocks.map(([h, t], i) => (h || t) && (
              <div key={i}>
                <p className={i === 0 ? 'font-display text-[19px] font-semibold' : 'font-medium text-ink'}>{h}</p>
                {t && <p className="text-muted">{t}</p>}
              </div>
            ))}
            {!done && <span className="caret" />}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-3">
        <p className="num text-[13px] text-muted">{done ? <>Hotovo za necelou minutu. <span className="text-warn">{sc.manual}</span></> : 'Píše…'}</p>
        <div className="flex gap-2">
          {!done && <button onClick={() => setChars(total)} className="flex min-h-[40px] items-center gap-2 rounded-full border border-line px-4 text-[14px] text-muted hover:text-ink"><SkipForward size={14} /> Přeskočit</button>}
          <button onClick={() => setChars(0)} className="flex min-h-[40px] items-center gap-2 rounded-full border border-line px-4 text-[14px] text-muted hover:text-ink"><RotateCcw size={14} /> Přehrát znovu</button>
        </div>
      </div>
    </div>
  )
}
