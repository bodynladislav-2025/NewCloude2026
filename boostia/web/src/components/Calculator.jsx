import { useMemo, useRef, useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { Button, Card, SpringNumber } from './ui'
import { calculate, DEFAULTS, fmt, fmtCzk, fmtMil } from '../lib/calc'
import { track } from '../lib/tracking'
import { submitLead } from '../lib/leadconnector'

const FIELDS = [
  { k: 'reps', label: 'Kolik lidí u vás obchoduje?', min: 2, max: 60, step: 1, unit: '', hint: 'Včetně key account manažerů.' },
  { k: 'meetings', label: 'Schůzek nebo delších hovorů týdně na obchodníka', min: 1, max: 15, step: 1, unit: '', hint: 'Osobních i online.' },
  { k: 'prepMin', label: 'Minut na přípravu jedné schůzky', min: 5, max: 120, step: 5, unit: ' min', hint: 'Hledání informací, podklady, prezentace.' },
  { k: 'notesMin', label: 'Minut na zápis, CRM a follow-up po schůzce', min: 5, max: 120, step: 5, unit: ' min', hint: 'Dohromady.' },
  { k: 'offers', label: 'Nabídek týdně na obchodníka', min: 0, max: 10, step: 0.5, unit: '', hint: 'Průměr.', more: true },
  { k: 'offerHours', label: 'Hodin na jednu nabídku', min: 0.5, max: 10, step: 0.5, unit: ' h', hint: 'Čistý čas od poptávky po odeslání.', more: true },
  { k: 'hourCost', label: 'Plný náklad na hodinu obchodníka', min: 300, max: 1500, step: 50, unit: ' Kč', hint: 'Mzda s odvody, auto, režie. Nevíte? Roční náklad vydělte 1 700.', more: true },
  { k: 'revenuePerRep', label: 'Roční tržby na jednoho obchodníka', min: 1, max: 60, step: 1, unit: ' mil. Kč', hint: 'Průměr za tým. Chcete počítat opatrněji? Zadejte místo tržeb hrubou marži.', more: true },
  { k: 'sellingHours', label: 'Hodin týdně, kdy obchodník opravdu jedná s klienty', min: 4, max: 30, step: 1, unit: ' h', hint: 'Schůzky a obchodní hovory. Bez cest, příprav a administrativy.', more: true },
]

function Slider({ f, value, onChange }) {
  const fill = ((value - f.min) / (f.max - f.min)) * 100
  const text = fmt(value, f.step < 1 ? 1 : 0) + f.unit
  const bump = (d) => onChange(Math.min(f.max, Math.max(f.min, +(value + d * f.step).toFixed(2))))
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={`calc-${f.k}`} className="text-[15px]">{f.label}</label>
        <output className="num shrink-0 text-[17px] font-medium text-accent">{text}</output>
      </div>
      <div className="mt-1 flex items-center gap-2">
        <button type="button" aria-label={`Snížit: ${f.label}`} onClick={() => bump(-1)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-muted hover:text-ink"><Minus size={16} /></button>
        <input id={`calc-${f.k}`} type="range" min={f.min} max={f.max} step={f.step} value={value} style={{ '--fill': fill + '%' }}
          aria-valuetext={text} onChange={(e) => onChange(+e.target.value)} />
        <button type="button" aria-label={`Zvýšit: ${f.label}`} onClick={() => bump(1)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-muted hover:text-ink"><Plus size={16} /></button>
      </div>
      <p className="mt-0.5 text-[13px] text-muted">{f.hint}</p>
    </div>
  )
}

export default function Calculator() {
  const [v, setV] = useState(DEFAULTS)
  const [touched, setTouched] = useState(false)
  const [more, setMore] = useState(false)
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [state, setState] = useState('idle') // idle | sending | done | error
  const r = useMemo(() => calculate(v), [v])
  const deb = useRef()

  const set = (k) => (val) => {
    if (!touched) { setTouched(true); track('calc_start') }
    setV((p) => ({ ...p, [k]: val }))
    clearTimeout(deb.current)
    deb.current = setTimeout(() => track('calc_change', { field: k }), 1000)
  }

  const send = async (e) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) return setState('error')
    setState('sending')
    const res = await submitLead('calc', {
      email, consentMarketing: consent,
      calc_reps: v.reps, calc_meetings: v.meetings, calc_prep_min: v.prepMin, calc_notes_min: v.notesMin,
      calc_offers: v.offers, calc_offer_hours: v.offerHours, calc_hour_cost: v.hourCost,
      calc_revenue_per_rep_mil: v.revenuePerRep, calc_selling_hours: v.sellingHours,
      calc_hours_week: Math.round(r.saved), calc_hours_year: Math.round(r.savedYear), calc_czk_year: Math.round(r.czkYear / 1000) * 1000,
      calc_revenue_year: Math.round(r.revenueYear / 1000) * 1000, calc_biggest: r.biggest,
    })
    track('calc_email_submit', { czk_year: Math.round(r.czkYear) })
    setState(res.ok ? 'done' : 'queued')
  }

  const verdict = r.savedPerRep < 1.5
    ? 'U vašeho týmu je prostor menší. Pomůže spíš jednodenní AI Start než celý program.'
    : r.savedPerRep > 4 ? 'To je hodně. Vyplatí se podívat na to podrobně.' : null

  return (
    <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr]">
      <Card className="space-y-6">
        {FIELDS.filter((f) => !f.more).map((f) => <Slider key={f.k} f={f} value={v[f.k]} onChange={set(f.k)} />)}
        <div className={more ? 'space-y-6' : 'hidden space-y-6 lg:block'}>
          {FIELDS.filter((f) => f.more).map((f) => <Slider key={f.k} f={f} value={v[f.k]} onChange={set(f.k)} />)}
        </div>
        {!more && <button type="button" onClick={() => setMore(true)} className="min-h-[44px] text-[15px] text-muted underline lg:hidden">Upřesnit nabídky, náklady a tržby</button>}
      </Card>

      <Card className={`flex flex-col !bg-surface2 ${touched ? 'beam' : ''}`} aria-live="polite">
        <p className="font-mono text-[12px] uppercase tracking-wider text-muted">Váš výsledek za rok</p>
        <p className="mt-4 text-[17px] text-muted">Opatrným odhadem vrátí AI vašemu týmu</p>
        <p className="mt-1 font-display text-[clamp(2.6rem,6vw,3.4rem)] font-semibold leading-none text-accent"><SpringNumber value={r.savedYear} format={(x) => fmt(x)} /> <span className="text-[20px] font-normal text-muted">hodin ročně</span></p>
        <p className="mt-3 text-[15px] text-muted">To je <SpringNumber className="text-ink" value={r.savedYearPerRep} format={(x) => fmt(x)} /> hodin na obchodníka za rok, tedy <SpringNumber className="text-ink" value={r.savedPerRep} format={(x) => fmt(x, 1)} /> hodiny týdně. Dnes tým přípravami, zápisy a nabídkami tráví <SpringNumber className="text-ink" value={r.nonSelling} format={(x) => fmt(x)} /> hodin týdně.</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-[12px] border border-line bg-bg p-5">
            <p className="text-[14px] text-muted">Ušetřené náklady</p>
            <p className="mt-1 whitespace-nowrap font-display text-[clamp(1.35rem,2.3vw,1.6rem)] font-semibold leading-tight"><SpringNumber value={r.czkYear} format={fmtMil} /></p>
            <p className="mt-1 text-[12px] text-muted">ročně, v ceně práce obchodníků</p>
          </div>
          <div className="rounded-[12px] border border-accent/50 bg-accent/[0.06] p-5">
            <p className="text-[14px] text-muted">Potenciál tržeb navíc</p>
            <p className="mt-1 whitespace-nowrap font-display text-[clamp(1.35rem,2.3vw,1.6rem)] font-semibold leading-tight text-accent"><SpringNumber value={r.revenueYear} format={fmtMil} /></p>
            <p className="mt-1 text-[12px] text-muted">ročně, když půlku toho času prodávají</p>
          </div>
        </div>
        {verdict && <p className="mt-4 text-[15px] text-ink">{verdict}</p>}
        <details className="mt-4 text-[13px] text-muted">
          <summary className="min-h-[32px] cursor-pointer underline decoration-line underline-offset-4">Jak to počítáme</summary>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Úspora 40 % času na přípravách, zápisech a nabídkách, 46 pracovních týdnů.</li>
            <li>Náklady: ušetřené hodiny × náklad na hodinu obchodníka.</li>
            <li>Tržby: dnes obchodník za hodinu jednání s klienty udělá zhruba <SpringNumber className="text-ink" value={r.revenuePerSellingHour} format={fmtCzk} />. Počítáme, že jen polovinu vráceného času stráví prodejem a že ten čas vynáší stejně jako dnes.</li>
            <li>Tržby nejsou slib. Je to odhad podle vašich čísel. Garantujeme ušetřený čas, který změříme stopkami.</li>
          </ul>
        </details>

        <div className="mt-auto pt-6">
          {state === 'done' || state === 'queued' ? (
            <p className="rounded-[12px] border border-accent/40 bg-accent/5 p-4 text-[15px]">{state === 'done' ? 'Hotovo. Podrobný výpočet a tři kroky, jak začít, vám právě odcházejí e-mailem.' : 'Teď se nám to nepodařilo odeslat. Zkusíme to znovu, jakmile budete online.'}</p>
          ) : (
            <form onSubmit={send} noValidate className="space-y-3">
              <label htmlFor="calc-email" className="block text-[15px]">Poslat mi podrobný výpočet a tři kroky, jak začít</label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input id="calc-email" type="email" autoComplete="email" inputMode="email" required placeholder="vas@email.cz" value={email}
                  onChange={(e) => { setEmail(e.target.value); if (state === 'error') setState('idle') }}
                  aria-invalid={state === 'error'} aria-describedby={state === 'error' ? 'calc-email-err' : undefined}
                  className="min-h-[48px] flex-1 rounded-full border border-line bg-bg px-5 text-[16px] outline-none placeholder:text-muted/60 focus:border-accent" />
                <Button type="submit" disabled={state === 'sending'} ctaId="calc_email" section="kalkulacka" arrow={false} className="whitespace-nowrap">{state === 'sending' ? 'Odesílám…' : 'Poslat výpočet'}</Button>
              </div>
              {state === 'error' && <p id="calc-email-err" className="text-[14px] text-warn">Zkontrolujte prosím e-mail.</p>}
              <label className="flex items-start gap-2 text-[13px] text-muted"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-4 w-4 accent-[#C8FF3E]" /> Chci jednou za 14 dní dostávat praktický tip pro obchod s AI. Odhlásit se dá kdykoli.</label>
            </form>
          )}
          <Button to="/audit" variant="secondary" ctaId="calc_audit" section="kalkulacka" className="mt-3 w-full">Probrat to na auditu zdarma</Button>
        </div>
      </Card>
    </div>
  )
}
