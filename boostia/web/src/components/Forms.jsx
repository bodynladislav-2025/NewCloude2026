import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Play } from 'lucide-react'
import { Button, Card, Placeholder } from './ui'
import { SCORE, scoreLead, submitLead } from '../lib/leadconnector'
import { track } from '../lib/tracking'

const inputCls = 'min-h-[50px] w-full rounded-[12px] border border-line bg-bg px-4 text-[16px] outline-none transition-colors placeholder:text-muted/50 focus:border-accent aria-[invalid=true]:border-warn'

export function Field({ label, name, error, hint, as = 'input', ...p }) {
  const Tag = as
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-[15px]">{label}{p.required ? '' : <span className="text-muted"> (nepovinné)</span>}</label>
      <Tag id={name} name={name} aria-invalid={!!error} aria-describedby={error ? `${name}-err` : hint ? `${name}-hint` : undefined}
        className={`${inputCls} ${as === 'textarea' ? 'min-h-[120px] py-3' : ''}`} {...p} />
      {hint && !error && <p id={`${name}-hint`} className="mt-1 text-[13px] text-muted">{hint}</p>}
      {error && <p id={`${name}-err`} className="mt-1 text-[14px] text-warn">{error}</p>}
    </div>
  )
}

function Honeypot({ value, onChange }) {
  return <input type="text" name="website" tabIndex={-1} autoComplete="off" value={value} onChange={onChange} className="absolute left-[-9999px] h-0 w-0 opacity-0" aria-hidden="true" />
}

export function Success({ title, children }) {
  return (
    <div className="rounded-[14px] border border-accent/40 bg-accent/5 p-6" role="status">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accentink"><Check size={20} /></div>
      <p className="font-display text-[22px] font-semibold">{title}</p>
      <div className="mt-2 text-muted">{children}</div>
    </div>
  )
}

function FallbackContact() {
  return <p className="mt-3 rounded-[12px] border border-warn/40 bg-warn/5 p-4 text-[15px]">Odeslání se teď nepovedlo, nejspíš kvůli připojení. Údaje jsme uložili a zkusíme to znovu. Nechcete čekat? Zavolejte nebo napište: <Placeholder>telefon, e-mail</Placeholder></p>
}

const validEmail = (s) => /^\S+@\S+\.\S+$/.test(s)
const validPhone = (s) => s.replace(/\D/g, '').length >= 9

// ---------- Video: náhled, přehrávač se načte až po kliknutí ----------
export function VslFacade({ url, title, eventPrefix = 'vsl', length = '4 min' }) {
  const [on, setOn] = useState(false)
  return (
    <div className="relative aspect-video overflow-hidden rounded-[14px] border border-line bg-surface">
      {on && url ? (
        <iframe src={url + (url.includes('?') ? '&' : '?') + 'autoplay=1'} title={title} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen className="absolute inset-0 h-full w-full" />
      ) : (
        <button onClick={() => { setOn(true); track(`${eventPrefix}_play`) }} className="group absolute inset-0 flex flex-col items-center justify-center gap-4 text-center" aria-label={`Přehrát video: ${title}`}>
          <svg viewBox="0 0 100 56" preserveAspectRatio="none" aria-hidden="true" className="absolute inset-0 h-full w-full opacity-60">
            {[8, 18, 28, 38, 48].map((y, i) => <path key={i} d={`M0 ${y} C 30 ${y}, 40 28, 50 28`} fill="none" stroke="var(--color-flow)" strokeOpacity=".25" strokeWidth="1" vectorEffect="non-scaling-stroke" />)}
            <path d="M50 28 H100" stroke="var(--color-accent)" strokeOpacity=".5" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          </svg>
          <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-accent text-accentink transition-transform duration-200 group-hover:scale-105"><Play size={30} fill="currentColor" className="ml-1" /></span>
          <span className="relative font-display text-[20px] font-semibold">{title}</span>
          <span className="relative num text-[13px] text-muted">{length} · s titulky</span>
          {on && !url && <span className="relative"><Placeholder>natočit video a vložit jeho adresu do .env</Placeholder></span>}
        </button>
      )}
    </div>
  )
}

// ---------- Kalendář LeadConnector ----------
export function LcCalendar({ url, prefill = {}, note }) {
  const ref = useRef(null)
  const [near, setNear] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); io.disconnect() } }, { rootMargin: '400px' })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  const qs = new URLSearchParams(Object.fromEntries(Object.entries(prefill).filter(([, v]) => v))).toString()
  return (
    <div ref={ref} className="min-h-[680px] overflow-hidden rounded-[14px] border border-line bg-surface">
      {note && <p className="border-b border-line px-5 py-3 text-[15px] text-muted">{note}</p>}
      {url ? (near && <iframe src={`${url}${url.includes('?') ? '&' : '?'}${qs}`} title="Výběr termínu" className="h-[680px] w-full" loading="lazy" />) : (
        <div className="flex min-h-[620px] flex-col items-center justify-center gap-3 p-8 text-center">
          <p className="font-display text-[22px] font-semibold">Sem přijde kalendář</p>
          <p className="max-w-[44ch] text-muted">Údaje máme uložené. Ozveme se vám do jednoho pracovního dne s návrhem termínu.</p>
          <Placeholder>vložit adresu kalendáře LeadConnector do .env</Placeholder>
        </div>
      )}
    </div>
  )
}

// ---------- Kvalifikační formulář auditu (2 kroky) ----------
const QUESTIONS = [
  ['teamSize', 'Kolik lidí u vás obchoduje?', 'Včetně key accountů a obchodní podpory.'],
  ['role', 'Jaká je vaše role?'],
  ['crm', 'Jaké CRM používáte?'],
  ['decision', 'Kdo rozhoduje o investici do vzdělávání obchodu?'],
  ['timeline', 'Kdy byste chtěli začít?'],
  ['subsidy', 'Chcete ověřit nárok na dotaci?'],
]

export function AuditForm() {
  const nav = useNavigate()
  const [step, setStep] = useState(1)
  const [f, setF] = useState({ firstName: '', lastName: '', email: '', phone: '+420 ', company: '', website: '' })
  const [a, setA] = useState({})
  const [pain, setPain] = useState('')
  const [err, setErr] = useState({})
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState(false)
  const [route, setRoute] = useState(null)
  const started = useRef(false)
  const t0 = useRef(Date.now())
  const top = useRef(null)

  const on = (k) => (e) => {
    if (!started.current) { started.current = true; track('form_start', { form_id: 'audit' }) }
    setF({ ...f, [k]: e.target.value }); if (err[k]) setErr({ ...err, [k]: null })
  }

  const next = async (e) => {
    e.preventDefault()
    const er = {}
    if (!f.firstName.trim()) er.firstName = 'Vyplňte jméno.'
    if (!f.lastName.trim()) er.lastName = 'Vyplňte příjmení.'
    if (!validEmail(f.email)) er.email = 'Zkontrolujte e-mail.'
    if (!validPhone(f.phone)) er.phone = 'Zkontrolujte telefon.'
    if (!f.company.trim()) er.company = 'Vyplňte firmu.'
    setErr(er)
    if (Object.keys(er).length) return
    if (f.website || Date.now() - t0.current < 2500) return // robot
    // Kontakt ukládáme hned po prvním kroku, aby se neztratil.
    const { website, ...clean } = f // eslint-disable-line no-unused-vars
    submitLead('audit', { ...clean, stage: 'step1' })
    track('form_step1', { form_id: 'audit' })
    setStep(2)
    top.current?.scrollIntoView({ block: 'start', behavior: 'auto' })
  }

  const finish = async (e) => {
    e.preventDefault()
    const missing = QUESTIONS.filter(([k]) => !a[k]).map(([k]) => k)
    if (missing.length) { setErr({ q: 'Zbývá odpovědět na všechny otázky.', missing }); return }
    setBusy(true); setFailed(false)
    const { score, route } = scoreLead(a)
    const { website, ...clean } = f // eslint-disable-line no-unused-vars
    const res = await submitLead('audit', {
      ...clean, stage: 'complete', salesTeamSize: a.teamSize, role: a.role, crm: a.crm, decisionMaker: a.decision,
      timeline: a.timeline, subsidyInterest: a.subsidy, biggestPain: pain, score, route,
    })
    setBusy(false)
    track('form_submit', { form_id: 'audit', route, score })
    if (!res.ok) setFailed(true)
    if (route === 'nurture') { nav('/dekujeme-prompty'); return }
    setRoute(route); setStep(3)
    top.current?.scrollIntoView({ block: 'start', behavior: 'auto' })
  }

  return (
    <div ref={top} id="formular" className="scroll-mt-24">
      {step < 3 && (
        <div className="mb-5 flex items-center gap-3" aria-label={`Krok ${step} ze 2`}>
          {[1, 2].map((s) => <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${s <= step ? 'bg-accent' : 'bg-line'}`} />)}
          <span className="num text-[13px] text-muted">{step}/2</span>
        </div>
      )}

      {step === 1 && (
        <Card>
          <form onSubmit={next} noValidate className="relative space-y-4">
            <h3 className="text-[24px]">Kam vám máme poslat výsledek auditu?</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Jméno" name="firstName" required autoComplete="given-name" value={f.firstName} onChange={on('firstName')} error={err.firstName} />
              <Field label="Příjmení" name="lastName" required autoComplete="family-name" value={f.lastName} onChange={on('lastName')} error={err.lastName} />
            </div>
            <Field label="Pracovní e-mail" name="email" type="email" inputMode="email" required autoComplete="email" value={f.email} onChange={on('email')} error={err.email} />
            <Field label="Telefon" name="phone" type="tel" inputMode="tel" required autoComplete="tel" value={f.phone} onChange={on('phone')} error={err.phone} hint="Pošleme vám na něj připomínku termínu." />
            <Field label="Firma" name="company" required autoComplete="organization" value={f.company} onChange={on('company')} error={err.company} />
            <Honeypot value={f.website} onChange={on('website')} />
            <Button type="submit" ctaId="audit_step1" section="formular" className="w-full">Pokračovat</Button>
            <p className="text-center text-[13px] text-muted">Údaje použijeme jen k přípravě auditu. Žádný spam.</p>
          </form>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <form onSubmit={finish} noValidate className="space-y-7">
            <h3 className="text-[24px]">Šest rychlých otázek, ať je audit k věci</h3>
            {QUESTIONS.map(([k, q, hint]) => (
              <fieldset key={k}>
                <legend className={`mb-2 text-[16px] font-medium ${err.missing?.includes(k) ? 'text-warn' : ''}`}>{q}</legend>
                {hint && <p className="-mt-1 mb-2 text-[13px] text-muted">{hint}</p>}
                <div className="flex flex-wrap gap-2">
                  {Object.keys(SCORE[k]).map((opt) => (
                    <label key={opt} className={`flex min-h-[46px] cursor-pointer items-center rounded-full border px-4 text-[15px] transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent ${a[k] === opt ? 'border-accent bg-accent text-accentink' : 'border-line bg-bg hover:border-muted'}`}>
                      <input type="radio" name={k} value={opt} checked={a[k] === opt} onChange={() => { setA({ ...a, [k]: opt }); setErr({}) }} className="sr-only" />
                      {opt}
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
            <Field label="Co vaše obchodníky nejvíc zdržuje od prodeje?" name="pain" as="textarea" value={pain} onChange={(e) => setPain(e.target.value)} />
            {err.q && <p className="text-[15px] text-warn" role="alert">{err.q}</p>}
            <Button type="submit" disabled={busy} ctaId="audit_step2" section="formular" className="w-full">{busy ? 'Odesílám…' : 'Vybrat termín'}</Button>
            <button type="button" onClick={() => setStep(1)} className="mx-auto block min-h-[44px] text-[15px] text-muted underline">Zpět</button>
          </form>
        </Card>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <Success title={route === 'audit' ? 'Díky. Teď si vyberte termín.' : 'Díky. Začneme krátkým 15minutovým hovorem.'}>
            {route === 'audit' ? 'Audit trvá 30 minut a probíhá přes Google Meet.' : 'Projdeme, jestli a jak vám umíme pomoct, a domluvíme další krok.'}
          </Success>
          {failed && <FallbackContact />}
          <LcCalendar url={route === 'audit' ? import.meta.env.VITE_LC_CALENDAR_AUDIT : import.meta.env.VITE_LC_CALENDAR_INTRO}
            prefill={{ first_name: f.firstName, last_name: f.lastName, email: f.email, phone: f.phone.replace(/\s/g, '') }} />
        </div>
      )}
    </div>
  )
}

// ---------- Jednoduché formuláře ----------
function useSimpleForm(kind, initial, validate, extra = {}) {
  const [f, setF] = useState({ ...initial, website: '' })
  const [err, setErr] = useState({})
  const [state, setState] = useState('idle')
  const on = (k) => (e) => { setF({ ...f, [k]: e.target.value }); if (err[k]) setErr({ ...err, [k]: null }) }
  const submit = async (e) => {
    e.preventDefault()
    const er = validate(f); setErr(er)
    if (Object.keys(er).length || f.website) return
    setState('sending')
    const { website, ...clean } = f // eslint-disable-line no-unused-vars
    const res = await submitLead(kind, { ...clean, ...extra })
    track('form_submit', { form_id: extra.source || kind })
    setState(res.ok ? 'done' : 'queued')
  }
  return { f, err, state, on, submit }
}

export function ContactForm({ presetMessage = '' }) {
  const { f, err, state, on, submit } = useSimpleForm('contact', { name: '', company: '', email: '', phone: '', message: presetMessage }, (f) => {
    const er = {}
    if (!f.name.trim()) er.name = 'Vyplňte jméno.'
    if (!validEmail(f.email)) er.email = 'Zkontrolujte e-mail.'
    if (!f.message.trim()) er.message = 'Napište nám pár slov.'
    return er
  }, { source: 'kontakt' })
  if (state === 'done') return <Success title="Díky, zpráva dorazila.">Ozveme se do jednoho pracovního dne.</Success>
  return (
    <Card>
      <form onSubmit={submit} noValidate className="relative space-y-4">
        <Field label="Jméno a příjmení" name="name" required autoComplete="name" value={f.name} onChange={on('name')} error={err.name} />
        <Field label="Firma" name="company" autoComplete="organization" value={f.company} onChange={on('company')} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="E-mail" name="email" type="email" inputMode="email" required autoComplete="email" value={f.email} onChange={on('email')} error={err.email} />
          <Field label="Telefon" name="phone" type="tel" inputMode="tel" autoComplete="tel" value={f.phone} onChange={on('phone')} />
        </div>
        <Field label="S čím vám můžeme pomoct?" name="message" as="textarea" required value={f.message} onChange={on('message')} error={err.message} />
        <Honeypot value={f.website} onChange={on('website')} />
        <Button type="submit" disabled={state === 'sending'} ctaId="contact_submit" section="kontakt">{state === 'sending' ? 'Odesílám…' : 'Odeslat'}</Button>
        {state === 'queued' && <FallbackContact />}
      </form>
    </Card>
  )
}

export function SubsidyForm() {
  const { f, err, state, on, submit } = useSimpleForm('audit', { name: '', email: '', phone: '+420 ', company: '', ico: '', participants: '' }, (f) => {
    const er = {}
    if (!f.name.trim()) er.name = 'Vyplňte jméno.'
    if (!validEmail(f.email)) er.email = 'Zkontrolujte e-mail.'
    if (!f.company.trim()) er.company = 'Vyplňte firmu.'
    if (!/^\d{8}$/.test(f.ico.replace(/\s/g, ''))) er.ico = 'IČO má 8 číslic.'
    if (!(+f.participants > 0)) er.participants = 'Zadejte počet účastníků.'
    return er
  }, { source: 'dotace', subsidyInterest: 'Ano', stage: 'dotace' })
  if (state === 'done') return (
    <Success title="Díky. Do dvou pracovních dnů se ozveme s výsledkem.">
      Mezitím si můžete rezervovat audit, na kterém spočítáme, kolik času váš obchod ztrácí.
      <div className="mt-4"><Button to="/audit" ctaId="dotace_to_audit" section="dotace">Rezervovat audit zdarma</Button></div>
    </Success>
  )
  return (
    <Card>
      <form onSubmit={submit} noValidate className="relative space-y-4">
        <h3 className="text-[24px]">Ověřit nárok na dotaci</h3>
        <Field label="Jméno a příjmení" name="name" required autoComplete="name" value={f.name} onChange={on('name')} error={err.name} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="E-mail" name="email" type="email" inputMode="email" required autoComplete="email" value={f.email} onChange={on('email')} error={err.email} />
          <Field label="Telefon" name="phone" type="tel" inputMode="tel" autoComplete="tel" value={f.phone} onChange={on('phone')} />
        </div>
        <Field label="Firma" name="company" required autoComplete="organization" value={f.company} onChange={on('company')} error={err.company} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="IČO" name="ico" required inputMode="numeric" value={f.ico} onChange={on('ico')} error={err.ico} />
          <Field label="Počet účastníků" name="participants" required type="number" min="1" inputMode="numeric" value={f.participants} onChange={on('participants')} error={err.participants} />
        </div>
        <Honeypot value={f.website} onChange={on('website')} />
        <Button type="submit" disabled={state === 'sending'} ctaId="subsidy_submit" section="dotace" className="w-full">{state === 'sending' ? 'Odesílám…' : 'Ověřit nárok'}</Button>
        <p className="text-[13px] text-muted">Ověření je zdarma a k ničemu vás nezavazuje.</p>
        {state === 'queued' && <FallbackContact />}
      </form>
    </Card>
  )
}

// Tříminutová příprava na děkovné stránce
export function PrepForm({ email }) {
  const [f, setF] = useState({ prep_minutes_meeting: '', prep_minutes_notes: '', prep_hours_offer: '', prep_meetings_week: '' })
  const [state, setState] = useState('idle')
  const Q = [
    ['prep_minutes_meeting', 'Kolik minut zabere příprava na jednu schůzku?', 'min'],
    ['prep_minutes_notes', 'Kolik minut zabere zápis, CRM a follow-up po schůzce?', 'min'],
    ['prep_hours_offer', 'Kolik hodin zabere jedna nabídka?', 'h'],
    ['prep_meetings_week', 'Kolik schůzek týdně má jeden obchodník?', ''],
  ]
  const submit = async (e) => {
    e.preventDefault(); setState('sending')
    const res = await submitLead('prep', { email, ...f })
    track('prep_submit'); setState(res.ok ? 'done' : 'queued')
  }
  if (state === 'done') return <p className="flex items-center gap-3 rounded-[12px] border border-accent/40 bg-accent/5 p-4"><Check size={20} className="text-accent" /> Díky, máme to. Na auditu rovnou počítáme.</p>
  return (
    <form onSubmit={submit} className="space-y-3">
      {Q.map(([k, label, unit]) => (
        <div key={k} className="flex items-center justify-between gap-4">
          <label htmlFor={k} className="text-[15px]">{label}</label>
          <div className="flex shrink-0 items-center gap-2">
            <input id={k} type="number" min="0" step="any" inputMode="decimal" value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} className={`${inputCls} !min-h-[44px] !w-[84px] text-right num`} />
            <span className="w-7 text-[14px] text-muted">{unit}</span>
          </div>
        </div>
      ))}
      <Button type="submit" variant="secondary" disabled={state === 'sending'} ctaId="prep_submit" section="dekujeme" arrow={false}>{state === 'sending' ? 'Odesílám…' : 'Odeslat přípravu'}</Button>
      {state === 'queued' && <p className="text-[14px] text-warn">Nepodařilo se odeslat. Čísla si prosím poznamenejte, projdeme je na auditu.</p>}
    </form>
  )
}

export function InviteForm({ email }) {
  const [v, setV] = useState('')
  const [state, setState] = useState('idle')
  const submit = async (e) => {
    e.preventDefault()
    if (!validEmail(v)) return setState('error')
    setState('sending')
    await submitLead('prep', { email, inviteEmail: v })
    setState('done')
  }
  if (state === 'done') return <p className="flex items-center gap-3 text-[15px]"><Check size={18} className="text-accent" /> Pozvánku posíláme.</p>
  return (
    <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row">
      <label htmlFor="invite" className="sr-only">E-mail kolegy</label>
      <input id="invite" type="email" inputMode="email" placeholder="kolega@firma.cz" value={v} onChange={(e) => { setV(e.target.value); setState('idle') }} aria-invalid={state === 'error'} className={`${inputCls} !rounded-full`} />
      <Button type="submit" variant="secondary" arrow={false} disabled={state === 'sending'}>Poslat pozvánku</Button>
    </form>
  )
}
