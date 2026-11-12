import { useMemo, useState } from 'react'
import { Check, Minus, Plus } from 'lucide-react'
import { Button, SpringNumber } from './ui'
import { fmt, fmtMil, WEEKS, SELLING_SHARE } from '../lib/calc'
import { track } from '../lib/tracking'
import { submitLead } from '../lib/leadconnector'

// Jediná kalkulačka na webu: kolik zaplatí Úřad práce, kolik doplatíte a co to může vydělat.
// Parametry podle podmínek projektu Vzdělávání pro firmy (reg. č. CZ.03.01.03/00/23_048/0006351).
export const PROGRAM_PRICE = 197000
export const HOURS = 50
export const RATE = 478.19 // Kč za hodinu výuky a účastníka
export const MAX_TEAM = 15 // nejvýš 15 lidí v jednom běhu (pravidlo projektu)
export const MIN_ATTENDANCE = 0.8
export const HOURS_PER_MONTH = 12 // cíl programu: hodin měsíčně navíc na obchodníka
const SELLING_HOURS_WEEK = 12
export const PER_PERSON = HOURS * RATE // 23 909,50 Kč
export const FULL_FROM = Math.ceil(PROGRAM_PRICE / PER_PERSON) // od kolika lidí pokryje příspěvek celou cenu

export function subsidyCalc(people, revenueMil) {
  const subsidy = people * PER_PERSON
  const pay = Math.max(0, PROGRAM_PRICE - subsidy)
  const payMin = Math.max(0, PROGRAM_PRICE - subsidy * MIN_ATTENDANCE)
  const hoursYear = people * HOURS_PER_MONTH * 12
  const perSellingHour = (revenueMil * 1e6) / (SELLING_HOURS_WEEK * WEEKS)
  const revenue = hoursYear * SELLING_SHARE * perSellingHour
  return { subsidy, covered: Math.min(subsidy, PROGRAM_PRICE), pay, payMin, hoursYear, revenue }
}

function Row({ id, label, value, set, min, max, step, unit, hint }) {
  const fill = ((value - min) / (max - min)) * 100
  const text = fmt(value) + unit
  const bump = (d) => set(Math.min(max, Math.max(min, value + d * step)))
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4"><label htmlFor={id} className="text-[15px]">{label}</label><output className="num shrink-0 text-[18px] font-medium text-accent">{text}</output></div>
      <div className="mt-1 flex items-center gap-2">
        <button type="button" aria-label={`Snížit: ${label}`} onClick={() => bump(-1)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-muted hover:text-ink"><Minus size={16} /></button>
        <input id={id} type="range" min={min} max={max} step={step} value={value} style={{ '--fill': fill + '%' }} aria-valuetext={text} onChange={(e) => set(+e.target.value)} />
        <button type="button" aria-label={`Zvýšit: ${label}`} onClick={() => bump(1)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-muted hover:text-ink"><Plus size={16} /></button>
      </div>
      {hint && <p className="mt-0.5 text-[13px] text-muted">{hint}</p>}
    </div>
  )
}

const inputCls = 'min-h-[48px] w-full rounded-[12px] border border-line bg-bg px-4 text-[16px] outline-none placeholder:text-muted/60 focus:border-accent aria-[invalid=true]:border-warn'

// Hlavní výzva webu: ověření nároku na dotaci. Tři pole, žádný hovor.
function VerifyForm({ people, revenue, result }) {
  const [f, setF] = useState({ ico: '', email: '', website: '' })
  const [err, setErr] = useState({})
  const [state, setState] = useState('idle')
  const on = (k) => (e) => { setF({ ...f, [k]: e.target.value }); if (err[k]) setErr({ ...err, [k]: null }) }
  const submit = async (e) => {
    e.preventDefault()
    const er = {}
    if (!/^\d{8}$/.test(f.ico.replace(/\s/g, ''))) er.ico = 'IČO má 8 číslic.'
    if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = 'Zkontrolujte e-mail.'
    setErr(er)
    if (Object.keys(er).length || f.website) return
    setState('sending')
    const res = await submitLead('audit', {
      stage: 'overeni-dotace', source: 'kalkulacka', subsidyInterest: 'Ano', ico: f.ico.replace(/\s/g, ''), email: f.email, participants: people,
      calc_revenue_per_rep_mil: revenue, calc_subsidy: Math.round(result.subsidy), calc_pay: Math.round(result.pay), calc_revenue_year: Math.round(result.revenue / 1000) * 1000,
    })
    track('form_submit', { form_id: 'overeni-dotace', participants: people })
    setState(res.ok ? 'done' : 'queued')
  }
  if (state === 'done' || state === 'queued') {
    return (
      <div className="rounded-[12px] border border-accent/50 bg-accent/[0.06] p-5" role="status">
        <p className="flex items-center gap-2 font-display text-[19px] font-semibold"><Check size={20} className="text-accent" />{state === 'done' ? 'Máme to. Ozveme se do 2 pracovních dnů.' : 'Uložili jsme to, odešleme po obnovení připojení.'}</p>
        <p className="mt-2 text-[14px] text-muted">Pošleme vám výpočet příspěvku pro vaši firmu, seznam podmínek a osnovu kurzu. Chcete to probrat hned?</p>
        <div className="mt-3"><Button to="/audit" variant="secondary" ctaId="verify_to_audit" section="kalkulacka" arrow={false}>Domluvit 30minutový hovor</Button></div>
      </div>
    )
  }
  return (
    <form onSubmit={submit} noValidate className="relative">
      <p className="font-display text-[19px] font-semibold leading-snug">Zjistěte, kolik zaplatí Úřad práce právě vám</p>
      <p className="mt-1 text-[13px] text-muted">Ověříme podmínky pro vaši firmu a do 2 pracovních dnů pošleme přesný výpočet. Zdarma, bez hovoru.</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-[0.8fr_1.2fr]">
        <div>
          <label htmlFor="v-ico" className="sr-only">IČO</label>
          <input id="v-ico" inputMode="numeric" autoComplete="off" placeholder="IČO firmy" value={f.ico} onChange={on('ico')} aria-invalid={!!err.ico} className={inputCls} />
        </div>
        <div>
          <label htmlFor="v-email" className="sr-only">Pracovní e-mail</label>
          <input id="v-email" type="email" inputMode="email" autoComplete="email" placeholder="Pracovní e-mail" value={f.email} onChange={on('email')} aria-invalid={!!err.email} className={inputCls} />
        </div>
      </div>
      {(err.ico || err.email) && <p className="mt-1 text-[13px] text-warn" role="alert">{err.ico || err.email}</p>}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" value={f.website} onChange={on('website')} className="absolute left-[-9999px] h-0 w-0 opacity-0" aria-hidden="true" />
      <Button type="submit" disabled={state === 'sending'} ctaId="verify_submit" section="kalkulacka" shine className="mt-3 w-full">{state === 'sending' ? 'Odesílám…' : `Ověřit nárok pro ${people} lidí`}</Button>
    </form>
  )
}

export default function SubsidyCalc({ id = 'kalkulacka', className = '' }) {
  const [people, setPeople] = useState(15)
  const [rev, setRev] = useState(10)
  const [used, setUsed] = useState(false)
  const r = useMemo(() => subsidyCalc(people, rev), [people, rev])
  const touch = (fn) => (v) => { if (!used) { setUsed(true); track('calc_start') } fn(v) }
  const free = r.pay <= 0

  return (
    <div id={id} className={`scroll-mt-24 rounded-[18px] border border-line bg-surface/95 p-5 shadow-[0_30px_80px_-40px_rgba(0,0,0,.6)] backdrop-blur-sm sm:p-6 ${used ? 'beam' : ''} ${className}`}>
      <p className="font-mono text-[12px] uppercase tracking-wider text-accent">Kalkulačka · 2 posuvníky</p>
      <div className="mt-4 space-y-5">
        <Row id={id + '-people'} label="Kolik lidí pošlete na školení?" value={people} set={touch(setPeople)} min={4} max={MAX_TEAM} step={1} unit="" hint={`V jednom běhu nejvýš ${MAX_TEAM} lidí.`} />
        <Row id={id + '-rev'} label="Roční tržby na jednoho obchodníka" value={rev} set={touch(setRev)} min={1} max={60} step={1} unit=" mil. Kč" />
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2" aria-live="polite">
        <div className={`rounded-[12px] border p-4 ${free ? 'border-accent/60 bg-accent/[0.07]' : 'border-line bg-bg'}`}>
          <p className="text-[13px] text-muted">Doplatíte za školení</p>
          <p className={`mt-1 whitespace-nowrap font-display text-[clamp(1.45rem,2.3vw,1.75rem)] font-semibold leading-none ${free ? 'text-accent' : ''}`}><SpringNumber value={r.pay} format={(x) => fmt(Math.round(x))} /> Kč</p>
          <p className="mt-2 text-[12px] leading-snug text-muted">Cena {fmt(PROGRAM_PRICE)} Kč, příspěvek až <SpringNumber className="text-ink" value={r.subsidy} format={(x) => fmt(Math.round(x))} /> Kč.{r.payMin > 0 ? <> Při docházce jen 80 % doplatíte <span className="text-ink">{fmt(Math.round(r.payMin))} Kč</span>.</> : ' Platí i při docházce 80 %.'}</p>
        </div>
        <div className="rounded-[12px] border border-line bg-bg p-4">
          <p className="text-[13px] text-muted">Co to může vydělat navíc</p>
          <p className="mt-1 whitespace-nowrap font-display text-[clamp(1.45rem,2.3vw,1.75rem)] font-semibold leading-none text-accent"><SpringNumber value={r.revenue} format={fmtMil} /></p>
          <p className="mt-2 text-[12px] leading-snug text-muted">tržeb ročně. <SpringNumber className="text-ink" value={r.hoursYear} format={(x) => fmt(x)} /> hodin navíc pro obchod.</p>
        </div>
      </div>

      <details className="mt-3 text-[12px] text-muted">
        <summary className="min-h-[28px] cursor-pointer underline decoration-line underline-offset-4">Jak to počítáme</summary>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Příspěvek {fmt(RATE, 2)} Kč za hodinu výuky a účastníka, {HOURS} hodin = {fmt(PER_PERSON, 2)} Kč na člověka. Od {FULL_FROM} lidí pokryje celou cenu.</li>
          <li>Počítá se z hodin, které člověk opravdu odseděl. Pod 80 % docházky příspěvek za něj propadá.</li>
          <li>Příspěvek není nárokový, rozhoduje Úřad práce. Nepokrývá DPH a licence AI nástrojů.</li>
          <li>Tržby: {HOURS_PER_MONTH} hodin měsíčně na člověka, polovinu počítáme jako prodejní čas, který vynáší jako dnes (při {SELLING_HOURS_WEEK} hodinách jednání s klienty týdně). Odhad podle vašich čísel, ne slib.</li>
        </ul>
      </details>

      <div className="mt-4 border-t border-line pt-4"><VerifyForm people={people} revenue={rev} result={r} /></div>
    </div>
  )
}
