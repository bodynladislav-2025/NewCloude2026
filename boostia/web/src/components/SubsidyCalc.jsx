import { useMemo, useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { Button, Card, Placeholder, SpringNumber } from './ui'
import { fmt, fmtMil, WEEKS, SELLING_SHARE } from '../lib/calc'
import { track } from '../lib/tracking'

// Jednoduchá kalkulačka: kolik z ceny pokryje dotace a kolik může vrácený čas vydělat.
export const PROGRAM_PRICE = 197000
export const HOURS = 50
export const RATE = 260.73 // Kč / hodina / účastník, projekt Vzdělávání pro firmy. OVĚŘIT před zveřejněním.
export const MAX_TEAM = 16
export const HOURS_PER_MONTH = 12 // cíl programu: hodin měsíčně navíc na obchodníka
const SELLING_HOURS_WEEK = 12 // kolik hodin týdně dnes obchodník jedná s klienty (modelový předpoklad)

export function subsidyCalc(people, revenueMil) {
  const subsidy = Math.min(PROGRAM_PRICE, people * HOURS * RATE)
  const pay = PROGRAM_PRICE - subsidy
  const hoursYear = people * HOURS_PER_MONTH * 12
  const perSellingHour = (revenueMil * 1e6) / (SELLING_HOURS_WEEK * WEEKS)
  const revenue = hoursYear * SELLING_SHARE * perSellingHour
  return { subsidy, pay, pct: (subsidy / PROGRAM_PRICE) * 100, hoursYear, revenue, full: pay <= 0 }
}

function Row({ id, label, value, set, min, max, step, unit, hint }) {
  const fill = ((value - min) / (max - min)) * 100
  const text = fmt(value) + unit
  const bump = (d) => set(Math.min(max, Math.max(min, value + d * step)))
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4"><label htmlFor={id} className="text-[16px]">{label}</label><output className="num shrink-0 text-[19px] font-medium text-accent">{text}</output></div>
      <div className="mt-1 flex items-center gap-2">
        <button type="button" aria-label={`Snížit: ${label}`} onClick={() => bump(-1)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-muted hover:text-ink"><Minus size={16} /></button>
        <input id={id} type="range" min={min} max={max} step={step} value={value} style={{ '--fill': fill + '%' }} aria-valuetext={text} onChange={(e) => set(+e.target.value)} />
        <button type="button" aria-label={`Zvýšit: ${label}`} onClick={() => bump(1)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-muted hover:text-ink"><Plus size={16} /></button>
      </div>
      {hint && <p className="mt-0.5 text-[13px] text-muted">{hint}</p>}
    </div>
  )
}

export default function SubsidyCalc({ id = 'dotacni-kalkulacka' }) {
  const [people, setPeople] = useState(12)
  const [rev, setRev] = useState(10)
  const [used, setUsed] = useState(false)
  const r = useMemo(() => subsidyCalc(people, rev), [people, rev])
  const touch = (fn) => (v) => { if (!used) { setUsed(true); track('subsidy_calc_start') } fn(v) }

  return (
    <Card id={id} className="scroll-mt-24 !p-0">
      <div className="grid lg:grid-cols-[1fr_1.15fr]">
        <div className="space-y-7 p-6 lg:p-8">
          <div>
            <p className="font-mono text-[12px] uppercase tracking-wider text-accent">Kalkulačka</p>
            <h3 className="mt-3 text-[26px]">Kolik zaplatíte vy a kolik to může vydělat</h3>
          </div>
          <Row id={id + '-people'} label="Kolik lidí pošlete na školení?" value={people} set={touch(setPeople)} min={4} max={MAX_TEAM} step={1} unit="" hint={`Jedna cena pro tým až ${MAX_TEAM} lidí.`} />
          <Row id={id + '-rev'} label="Roční tržby na jednoho obchodníka" value={rev} set={touch(setRev)} min={1} max={60} step={1} unit=" mil. Kč" hint="Průměr za tým. Opatrněji: zadejte hrubou marži." />
        </div>

        <div className="border-t border-line bg-surface2 p-6 lg:rounded-r-[14px] lg:border-l lg:border-t-0 lg:p-8" aria-live="polite">
          <dl className="space-y-3 text-[16px]">
            <div className="flex justify-between gap-4"><dt className="text-muted">Cena programu</dt><dd className="num">{fmt(PROGRAM_PRICE)} Kč</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted">Příspěvek Úřadu práce ({fmt(people)} × {HOURS} h × {fmt(RATE, 2)} Kč)</dt><dd className="num whitespace-nowrap text-flow">−<SpringNumber value={r.subsidy} format={(x) => fmt(Math.round(x))} /> Kč</dd></div>
          </dl>
          <div className="mt-5 rounded-[12px] border border-line bg-bg p-5">
            <p className="text-[14px] text-muted">Doplatíte z vlastního</p>
            <p className={`mt-1 whitespace-nowrap font-display text-[clamp(1.9rem,4.4vw,2.6rem)] font-semibold leading-none ${r.full ? 'text-accent' : ''}`}><SpringNumber value={r.pay} format={(x) => fmt(Math.round(x))} /> Kč</p>
            <p className="mt-2 text-[14px] text-muted">{r.full ? 'Příspěvek pokryje celou cenu programu.' : <>Příspěvek pokryje <span className="text-ink">{fmt(r.pct)} %</span> ceny. Celou cenu pokryje od {MAX_TEAM} účastníků.</>}</p>
          </div>
          <div className="mt-3 rounded-[12px] border border-accent/50 bg-accent/[0.06] p-5">
            <p className="text-[14px] text-muted">Co to může obchodu přinést navíc</p>
            <p className="mt-1 whitespace-nowrap font-display text-[clamp(1.9rem,4.4vw,2.6rem)] font-semibold leading-none text-accent"><SpringNumber value={r.revenue} format={fmtMil} /> <span className="text-[16px] font-normal text-muted">tržeb ročně</span></p>
            <p className="mt-2 text-[14px] text-muted"><SpringNumber className="text-ink" value={r.hoursYear} format={(x) => fmt(x)} /> hodin ročně navíc pro obchod ({HOURS_PER_MONTH} hodin měsíčně na člověka).</p>
          </div>
          <details className="mt-4 text-[13px] text-muted">
            <summary className="min-h-[32px] cursor-pointer underline decoration-line underline-offset-4">Jak to počítáme a co je potřeba vědět</summary>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Příspěvek na vzdělávání {fmt(RATE, 2)} Kč za hodinu a účastníka, {HOURS} hodin, projekt Vzdělávání pro firmy.<Placeholder kind="OVĚŘIT">sazba a podmínky</Placeholder></li>
              <li>K tomu stát přispívá i na mzdy za dobu školení. Do výpočtu je nezahrnujeme.</li>
              <li>O dotaci žádá vaše firma a rozhoduje Úřad práce. Program nejdřív uhradíte, příspěvek přijde po dokončení.</li>
              <li>Tržby: {HOURS_PER_MONTH} hodin měsíčně na člověka, z toho polovinu počítáme jako prodejní čas, který vynáší stejně jako dnes (při {SELLING_HOURS_WEEK} hodinách jednání s klienty týdně). Je to odhad podle vašich čísel, ne slib.</li>
            </ul>
          </details>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button to="/dotace#overit" ctaId="subsidycalc_verify" section="dotacni-kalkulacka">Ověřit nárok na dotaci</Button>
            <Button to="/audit" variant="secondary" ctaId="subsidycalc_audit" section="dotacni-kalkulacka" arrow={false}>Audit zdarma</Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
