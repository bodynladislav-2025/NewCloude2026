import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronDown } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { animate } from 'motion'
import { prefersReducedMotion } from '../lib/motion'
import { track, trackCta } from '../lib/tracking'
import { fmt } from '../lib/calc'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export const SHOW_PLACEHOLDERS = import.meta.env.VITE_SHOW_PLACEHOLDERS !== 'false'

export function Container({ className = '', children, ...p }) {
  return <div className={`mx-auto w-full max-w-[1200px] px-6 lg:px-12 ${className}`} {...p}>{children}</div>
}

export function Section({ id, className = '', children, tight }) {
  return (
    <section id={id} className={`${tight ? 'py-16 lg:py-24' : 'py-24 lg:py-36'} ${className}`}>
      <Container>{children}</Container>
    </section>
  )
}

export function Badge({ children, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 font-mono text-[12px] uppercase tracking-wider text-muted ${className}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />{children}
    </span>
  )
}

export function Button({ to, href, onClick, variant = 'primary', children, ctaId, section, className = '', type, disabled, arrow = true }) {
  const base = 'group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full px-6 py-3 text-[16px] font-medium leading-tight transition-[transform,background-color,border-color] duration-200 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none'
  const styles = {
    primary: 'bg-accent text-accentink hover:bg-[#d6ff6a]',
    secondary: 'border border-line bg-surface text-ink hover:border-muted',
    ghost: 'text-ink underline decoration-line underline-offset-4 hover:decoration-accent px-0',
  }[variant]
  const inner = (
    <>
      <span>{children}</span>
      {arrow && variant !== 'ghost' && <ArrowRight size={18} aria-hidden="true" className="shrink-0 transition-transform duration-200 group-hover:translate-x-1" />}
    </>
  )
  const handle = (e) => { if (ctaId) trackCta(ctaId, typeof children === 'string' ? children : ctaId, section); onClick?.(e) }
  const cls = `${base} ${styles} ${className}`
  if (to) return <Link to={to} onClick={handle} className={cls}>{inner}</Link>
  if (href) return <a href={href} onClick={handle} className={cls}>{inner}</a>
  return <button type={type || 'button'} onClick={handle} disabled={disabled} className={cls}>{inner}</button>
}

// Tlačítko se na desktopu jemně přitahuje ke kurzoru.
export function Magnetic({ children, strength = 8 }) {
  const ref = useRef(null)
  const onMove = (e) => {
    if (!window.matchMedia('(pointer: fine)').matches || prefersReducedMotion()) return
    const r = ref.current.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width - 0.5) * 2 * strength
    const y = ((e.clientY - r.top) / r.height - 0.5) * 2 * strength
    ref.current.style.transform = `translate(${x}px, ${y}px)`
  }
  const reset = () => { if (ref.current) ref.current.style.transform = '' }
  return <span ref={ref} onMouseMove={onMove} onMouseLeave={reset} className="inline-block transition-transform duration-300 ease-out">{children}</span>
}

// Nadpis odhalený po slovech. Text je v HTML hned, animace je čisté CSS.
export function SplitHeadline({ as: Tag = 'h1', parts, className = '' }) {
  const label = parts.map((p) => p.t).join('')
  let i = 0
  return (
    <Tag className={className} aria-label={label}>
      <span aria-hidden="true">
        {parts.map((p, pi) =>
          p.t.split(/(\s+)/).map((w, wi) =>
            /^\s+$/.test(w) || w === '' ? (w === '' ? null : ' ') : (
              <span key={`${pi}-${wi}`} className="split-word">
                <span style={{ '--i': i++ }} className={p.hl ? 'text-accent' : ''}>{w}</span>
              </span>
            )
          )
        )}
      </span>
    </Tag>
  )
}

// Vysunutí obsahu sekce při scrollu.
export function Reveal({ children, className = '', stagger = 0.08, as: Tag = 'div' }) {
  const ref = useRef(null)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const els = ref.current.querySelectorAll(':scope > *')
      gsap.from(els.length ? els : ref.current, {
        y: 32, opacity: 0, duration: 0.7, ease: 'power3.out', stagger,
        scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
      })
    })
    return () => mm.revert()
  }, { scope: ref })
  return <Tag ref={ref} className={className}>{children}</Tag>
}

// Číslo, které naběhne při vstupu do viewportu.
export function NumberTicker({ value, decimals = 0, suffix = '', prefix = '', className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    const final = prefix + fmt(value, decimals) + suffix
    if (prefersReducedMotion()) { el.textContent = final; return }
    let controls
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      controls = animate(0, value, { duration: 1.2, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => { el.textContent = prefix + fmt(v, decimals) + suffix } })
    }, { threshold: 0.4 })
    io.observe(el)
    return () => { io.disconnect(); controls?.stop() }
  }, [value, decimals, suffix, prefix])
  return <span ref={ref} className={`num ${className}`}>{prefix + fmt(value, decimals) + suffix}</span>
}

// Číslo, které plynule dobíhá na novou hodnotu (kalkulačka).
export function SpringNumber({ value, format = (v) => fmt(v), className = '' }) {
  const ref = useRef(null)
  const prev = useRef(value)
  useEffect(() => {
    const el = ref.current
    if (prefersReducedMotion()) { el.textContent = format(value); prev.current = value; return }
    const c = animate(prev.current, value, { type: 'spring', stiffness: 120, damping: 20, onUpdate: (v) => { el.textContent = format(v) } })
    prev.current = value
    return () => c.stop()
  }, [value]) // eslint-disable-line react-hooks/exhaustive-deps
  return <span ref={ref} className={`num ${className}`}>{format(value)}</span>
}

export function Card({ children, className = '', spotlight = false, ...p }) {
  const onMove = (e) => {
    if (!spotlight) return
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  return (
    <div onMouseMove={onMove} className={`rounded-[14px] border border-line bg-surface p-6 lg:p-8 ${spotlight ? 'spot' : ''} ${className}`} {...p}>
      {children}
    </div>
  )
}

// Viditelný štítek pro místa, kde chybí důkaz nebo údaj. Před spuštěním vypněte VITE_SHOW_PLACEHOLDERS.
export function Placeholder({ kind = 'DOPLNIT', children, block = false }) {
  if (!SHOW_PLACEHOLDERS) return null
  const Tag = block ? 'div' : 'span'
  return (
    <Tag className={`${block ? 'my-4 block p-4' : 'mx-1 inline-block px-2 py-0.5 align-middle'} rounded-md border border-dashed border-warn/70 bg-warn/5 text-[13px] leading-snug text-warn`}>
      <span className="font-mono text-[11px] uppercase tracking-wider">{kind}</span>{children ? <>: {children}</> : null}
    </Tag>
  )
}

export function Faq({ items, id = 'faq' }) {
  const [open, setOpen] = useState(0)
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((it, i) => {
        const isOpen = open === i
        return (
          <div key={i}>
            <h3 className="font-sans text-[17px] font-medium tracking-normal">
              <button
                className="flex min-h-[56px] w-full items-center justify-between gap-6 py-5 text-left"
                aria-expanded={isOpen} aria-controls={`${id}-${i}`}
                onClick={() => { setOpen(isOpen ? -1 : i); if (!isOpen) track('faq_open', { question_id: `${id}-${i}` }) }}
              >
                <span>{it.q}</span>
                <ChevronDown size={20} aria-hidden="true" className={`shrink-0 text-muted transition-transform duration-300 ${isOpen ? 'rotate-180 text-accent' : ''}`} />
              </button>
            </h3>
            <div id={`${id}-${i}`} hidden={!isOpen} className="max-w-[68ch] pb-6 text-muted">{it.a}</div>
          </div>
        )
      })}
    </div>
  )
}

export function Marquee({ items }) {
  const row = [...items, ...items]
  return (
    <div className="marquee overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
      <ul className="sr-only">{items.map((t) => <li key={t}>{t}</li>)}</ul>
      <div className="marquee-track flex w-max gap-3" aria-hidden="true">
        {row.map((t, i) => (
          <span key={i} className="whitespace-nowrap rounded-full border border-line bg-surface px-5 py-2 font-mono text-[14px] text-muted">{t}</span>
        ))}
      </div>
    </div>
  )
}

// Motiv značky: rozptýlené linky se sbíhají do jedné a míří k výsledku.
export function FlowDivider({ className = '' }) {
  return (
    <svg viewBox="0 0 1200 80" preserveAspectRatio="none" aria-hidden="true" className={`h-16 w-full ${className}`}>
      {[6, 22, 40, 58, 74].map((y, i) => (
        <path key={i} d={`M0 ${y} C 400 ${y}, 620 40, 900 40`} fill="none" stroke="#4DA3FF" strokeOpacity={0.18 + i * 0.04} strokeWidth="1" />
      ))}
      <path d="M900 40 H1200" stroke="#C8FF3E" strokeWidth="1.5" strokeOpacity=".8" />
    </svg>
  )
}

export function SectionHead({ badge, title, children, center = false }) {
  return (
    <Reveal className={`mb-12 max-w-[760px] lg:mb-16 ${center ? 'mx-auto text-center' : ''}`}>
      {badge && <div className="mb-5"><Badge>{badge}</Badge></div>}
      <h2 className="text-[clamp(1.9rem,4.2vw,3.1rem)]">{title}</h2>
      {children && <div className="mt-5 space-y-4 text-[18px] text-muted">{children}</div>}
    </Reveal>
  )
}

export function CheckList({ items, className = '' }) {
  return (
    <ul className={`space-y-3 ${className}`}>
      {items.map((t, i) => (
        <li key={i} className="flex gap-3">
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" className="mt-1 shrink-0"><circle cx="10" cy="10" r="10" fill="#C8FF3E" fillOpacity=".12" /><path d="m6 10.5 2.6 2.6L14 7.6" stroke="#C8FF3E" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <span>{t}</span>
        </li>
      ))}
    </ul>
  )
}
