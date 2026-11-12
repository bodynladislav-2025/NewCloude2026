import { useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const STEPS = [
  ['8:00', 'Příprava na schůzku', 'Hledá na webu, v e-mailech a v CRM. 40 minut.', 'Brief za 10 minut. Zbytek času volá klientovi.'],
  ['10:00', 'Schůzka', 'Píše si poznámky a nestíhá poslouchat.', 'Nahrává se souhlasem klienta a soustředí se na rozhovor.'],
  ['11:30', 'Po schůzce', 'Zápis si nechá „na večer“.', 'Zápis, úkoly a CRM hotové v autě před odjezdem.'],
  ['13:00', 'Follow-up', 'Odejde pozítří.', 'Odešel v 11:45.'],
  ['14:00', 'Nabídka', 'Skládá ji tři dny z loňské.', 'Návrh do hodiny, kontrola a odeslání týž den.'],
  ['16:00', 'Stávající klienti', 'Nezbyl čas.', 'Dva telefonáty podle seznamu příležitostí.'],
]

function StepCard({ s }) {
  return (
    <div className="rounded-[14px] border border-line bg-surface p-5">
      <p className="num text-[13px] text-muted">{s[0]}</p>
      <h3 className="mt-1 text-[22px]">{s[1]}</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[10px] border border-warn/30 bg-warn/5 p-4"><p className="mb-1 font-mono text-[11px] uppercase tracking-wider text-warn">Bez AI</p><p className="text-[15px]">{s[2]}</p></div>
        <div className="rounded-[10px] border border-accent/30 bg-accent/5 p-4"><p className="mb-1 font-mono text-[11px] uppercase tracking-wider text-accent">S AI</p><p className="text-[15px]">{s[3]}</p></div>
      </div>
    </div>
  )
}

// „Úterý obchodníka": na desktopu připnutá sekce řízená scrollem, na mobilu a při omezeném pohybu karty pod sebou.
export default function DayScrolly() {
  const wrap = useRef(null)
  const [active, setActive] = useState(0)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const st = ScrollTrigger.create({
        trigger: wrap.current, pin: true, start: 'top top', end: '+=300%', scrub: 0.6,
        onUpdate: (self) => setActive(Math.min(STEPS.length - 1, Math.floor(self.progress * STEPS.length))),
      })
      gsap.to('.scrolly-progress', { scaleY: 1, ease: 'none', scrollTrigger: { trigger: wrap.current, start: 'top top', end: '+=300%', scrub: 0.6 } })
      return () => st.kill()
    })
    return () => mm.revert()
  }, { scope: wrap })

  const pct = active / (STEPS.length - 1)
  return (
    <>
      {/* Mobil a reduced motion */}
      <div className="space-y-4 lg:hidden motion-reduce:!block">
        {STEPS.map((s) => <StepCard key={s[0]} s={s} />)}
      </div>

      {/* Desktop */}
      <div ref={wrap} className="hidden h-screen items-center lg:flex motion-reduce:!hidden">
        <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-10">
          <div className="text-right">
            <p className="mb-3 font-mono text-[12px] uppercase tracking-wider text-warn">Bez AI</p>
            <div className="relative min-h-[150px]">
              {STEPS.map((s, i) => (
                <p key={i} aria-hidden={active !== i} className={`absolute inset-x-0 top-0 font-display text-[clamp(1.5rem,2.4vw,2.2rem)] font-semibold leading-tight transition-all duration-500 ${active === i ? 'opacity-100' : 'translate-y-3 opacity-0'}`}>{s[2]}</p>
              ))}
            </div>
            <svg viewBox="0 0 300 120" className="ml-auto mt-4 h-28 w-full max-w-[340px]" aria-hidden="true">
              {[10, 30, 50, 70, 90, 110].map((y, i) => {
                const mess = (1 - pct) * ((i % 2 ? 1 : -1) * (18 + i * 5))
                return <path key={i} d={`M0 ${y + mess} C 100 ${y - mess}, 200 ${y + mess * 0.6}, 300 ${60 + (y - 60) * (1 - pct)}`} fill="none" stroke="#FF8A4C" strokeOpacity={0.25 + (1 - pct) * 0.4} strokeWidth="1.2" style={{ transition: 'd .6s ease, stroke-opacity .6s' }} />
              })}
            </svg>
          </div>

          <div className="flex flex-col items-center">
            <div className="relative h-[52vh] w-px bg-line">
              <div className="scrolly-progress absolute inset-0 origin-top scale-y-0 bg-accent" />
              {STEPS.map((s, i) => (
                <div key={i} className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ top: `${(i / (STEPS.length - 1)) * 100}%` }}>
                  <div className={`flex h-12 w-[92px] items-center justify-center rounded-full border text-[14px] transition-colors duration-300 num ${i <= active ? 'border-accent bg-accent text-accentink' : 'border-line bg-surface text-muted'}`}>{s[0]}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 font-mono text-[12px] uppercase tracking-wider text-accent">S AI</p>
            <div className="relative min-h-[150px]">
              {STEPS.map((s, i) => (
                <p key={i} aria-hidden={active !== i} className={`absolute inset-x-0 top-0 font-display text-[clamp(1.5rem,2.4vw,2.2rem)] font-semibold leading-tight text-accent transition-all duration-500 ${active === i ? 'opacity-100' : 'translate-y-3 opacity-0'}`}>{s[3]}</p>
              ))}
            </div>
            <p className="mt-4 text-[17px] text-muted"><span className="num text-ink">{STEPS[active][0]}</span> · {STEPS[active][1]}</p>
          </div>
        </div>
      </div>
    </>
  )
}
