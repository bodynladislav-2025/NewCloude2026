import { Suspense, useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Menu, X } from 'lucide-react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Button, Container, FlowDivider, Placeholder } from './ui'
import { EASE, isTouch, prefersReducedMotion } from '../lib/motion'
import { applyConsent, getConsent, initConsentDefaults, track, watchScrollDepth } from '../lib/tracking'
import { captureUtm, flushQueue } from '../lib/leadconnector'

const NAV = [
  ['/', 'AI školení pro obchod'],
  ['/ai-agenti', 'AI agenti'],
  ['/jak-to-funguje', 'Jak to funguje'],
  ['/dotace', 'Dotace'],
  ['/materialy-zdarma', 'Materiály zdarma'],
  ['/pripadove-studie', 'Případové studie'],
  ['/o-nas', 'O nás'],
]
const BARE = ['/audit', '/dekujeme', '/dekujeme-prompty'] // stránky bez navigace

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 font-display text-[21px] font-bold tracking-tight" aria-label="Boostia, úvodní stránka">
      <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden="true"><path d="M3 8c9 0 9 8 16 8M3 16h16M3 24c9 0 9-8 16-8" stroke="#4DA3FF" strokeWidth="1.8" fill="none" opacity=".75" /><path d="M18 16h10m-4-4 4 4-4 4" stroke="#C8FF3E" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
      Boostia
    </Link>
  )
}

function Header({ bare }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  useEffect(() => { setOpen(false) }, [loc.pathname])
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : '' }, [open])
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${scrolled || open ? 'border-b border-line bg-bg/85 backdrop-blur-md' : 'border-b border-transparent'}`}>
      <Container className="flex h-[68px] items-center justify-between gap-6">
        <Logo />
        {!bare && (
          <>
            <nav aria-label="Hlavní navigace" className="hidden items-center gap-6 xl:flex">
              {NAV.map(([to, label]) => (
                <NavLink key={to} to={to} end className={({ isActive }) => `whitespace-nowrap text-[14px] xl:text-[15px] transition-colors hover:text-ink ${isActive ? 'text-ink' : 'text-muted'}`}>{label}</NavLink>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <span className="hidden sm:block"><Button to="/audit" ctaId="header_audit" section="header" className="!min-h-[42px] !px-5 !py-2 !text-[15px]">Audit zdarma</Button></span>
              <button className="flex h-11 w-11 items-center justify-center rounded-full border border-line xl:hidden" aria-label={open ? 'Zavřít menu' : 'Otevřít menu'} aria-expanded={open} onClick={() => setOpen(!open)}>
                {open ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </>
        )}
        {bare && <a href="tel:+420000000000" className="text-[15px] text-muted hover:text-ink">Potřebujete poradit? Zavolejte</a>}
      </Container>
      {open && (
        <nav aria-label="Mobilní navigace" className="h-[calc(100dvh-68px)] overflow-y-auto border-t border-line bg-bg px-6 py-8 xl:hidden">
          <ul className="space-y-1">
            {NAV.map(([to, label]) => (
              <li key={to}><NavLink to={to} end className="block py-3 font-display text-[26px] font-semibold">{label}</NavLink></li>
            ))}
            <li><NavLink to="/kontakt" className="block py-3 font-display text-[26px] font-semibold">Kontakt</NavLink></li>
          </ul>
          <Button to="/audit" ctaId="mobilemenu_audit" section="menu" className="mt-8 w-full">Audit zdarma</Button>
        </nav>
      )}
    </header>
  )
}

function Footer() {
  return (
    <footer className="border-t border-line">
      <FlowDivider className="opacity-60" />
      <Container className="grid gap-10 pb-28 pt-8 md:grid-cols-[1.4fr_1fr_1fr] md:pb-12">
        <div>
          <Logo />
          <p className="mt-4 max-w-[38ch] text-[15px] text-muted">Měřený AI trénink pro obchodní týmy a AI agenti na míru.</p>
          <p className="mt-4 text-[14px] text-muted">Boostia s.r.o.<Placeholder>IČO, sídlo</Placeholder></p>
        </div>
        <div>
          <p className="mb-3 font-mono text-[12px] uppercase tracking-wider text-muted">Web</p>
          <ul className="space-y-2 text-[15px]">
            {NAV.map(([to, label]) => <li key={to}><Link className="text-muted hover:text-ink" to={to}>{label}</Link></li>)}
            <li><Link className="text-muted hover:text-ink" to="/audit">Audit zdarma</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 font-mono text-[12px] uppercase tracking-wider text-muted">Kontakt</p>
          <ul className="space-y-2 text-[15px] text-muted">
            <li><Link className="hover:text-ink" to="/kontakt">Napište nám</Link></li>
            <li><Placeholder>e-mail, telefon, LinkedIn</Placeholder></li>
            <li><Link className="hover:text-ink" to="/ochrana-osobnich-udaju">Ochrana osobních údajů</Link></li>
            <li><Link className="hover:text-ink" to="/obchodni-podminky">Obchodní podmínky</Link></li>
            <li><button className="hover:text-ink" onClick={() => window.dispatchEvent(new Event('boostia:consent'))}>Nastavení cookies</button></li>
          </ul>
        </div>
      </Container>
    </footer>
  )
}

function StickyCta() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const on = () => setShow(window.scrollY > window.innerHeight * 0.8)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ duration: 0.3, ease: EASE }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/95 p-3 backdrop-blur md:hidden">
          <Button to="/audit" ctaId="sticky_audit" section="sticky" className="w-full">Audit zdarma (30 min)</Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Consent() {
  const [open, setOpen] = useState(false)
  const [detail, setDetail] = useState(false)
  const [c, setC] = useState({ analytics: false, marketing: false })
  useEffect(() => {
    if (!getConsent()) setOpen(true)
    const reopen = () => { setDetail(true); setOpen(true) }
    window.addEventListener('boostia:consent', reopen)
    return () => window.removeEventListener('boostia:consent', reopen)
  }, [])
  if (!open) return null
  const save = (v) => { applyConsent(v); setOpen(false) }
  return (
    <div role="dialog" aria-label="Nastavení cookies" className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-[560px] rounded-[14px] border border-line bg-surface2 p-5 shadow-2xl md:bottom-6">
      <p className="text-[15px] text-muted"><strong className="text-ink">Cookies.</strong> Nezbytné používáme vždy. Analytické a marketingové jen s vaším souhlasem, pomáhají nám web zlepšovat. <Link to="/ochrana-osobnich-udaju" className="underline">Podrobnosti</Link></p>
      {detail && (
        <div className="mt-4 space-y-2 text-[15px]">
          <label className="flex items-center gap-3"><input type="checkbox" checked disabled className="h-4 w-4 accent-[#C8FF3E]" /> Nezbytné</label>
          <label className="flex items-center gap-3"><input type="checkbox" className="h-4 w-4 accent-[#C8FF3E]" checked={c.analytics} onChange={(e) => setC({ ...c, analytics: e.target.checked })} /> Analytické</label>
          <label className="flex items-center gap-3"><input type="checkbox" className="h-4 w-4 accent-[#C8FF3E]" checked={c.marketing} onChange={(e) => setC({ ...c, marketing: e.target.checked })} /> Marketingové</label>
        </div>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <Button arrow={false} className="!min-h-[42px] !px-4 !py-2 !text-[15px]" onClick={() => save({ analytics: true, marketing: true })}>Přijmout vše</Button>
        <Button arrow={false} variant="secondary" className="!min-h-[42px] !px-4 !py-2 !text-[15px]" onClick={() => save({ analytics: false, marketing: false })}>Jen nezbytné</Button>
        {detail
          ? <Button arrow={false} variant="secondary" className="!min-h-[42px] !px-4 !py-2 !text-[15px]" onClick={() => save(c)}>Uložit výběr</Button>
          : <button className="px-3 text-[15px] text-muted underline" onClick={() => setDetail(true)}>Nastavení</button>}
      </div>
    </div>
  )
}

export default function Layout() {
  const loc = useLocation()
  const bare = BARE.includes(loc.pathname)

  // Jednorázově: souhlas, UTM, fronta neodeslaných formulářů
  useEffect(() => {
    initConsentDefaults(); captureUtm(); flushQueue()
    window.addEventListener('online', flushQueue)
    return () => window.removeEventListener('online', flushQueue)
  }, [])

  // Plynulý scroll jen na desktopu s myší a bez omezení pohybu
  useEffect(() => {
    if (isTouch() || prefersReducedMotion()) return
    const lenis = new Lenis({ lerp: 0.1, autoRaf: false })
    window.__lenis = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t) => lenis.raf(t * 1000)
    gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0)
    return () => { gsap.ticker.remove(tick); lenis.destroy(); window.__lenis = null }
  }, [])

  // Nová stránka: nahoru (nebo na kotvu), měření, hloubka scrollu
  useEffect(() => {
    const go = () => {
      if (loc.hash) {
        const el = document.querySelector(loc.hash)
        if (el) { window.__lenis ? window.__lenis.scrollTo(el, { offset: -80, immediate: true }) : el.scrollIntoView(); return }
      }
      window.__lenis ? window.__lenis.scrollTo(0, { immediate: true }) : window.scrollTo(0, 0)
    }
    const t = setTimeout(go, 30)
    track('page_view', { path: loc.pathname })
    const off = watchScrollDepth()
    const r = setTimeout(() => ScrollTrigger.refresh(), 400)
    return () => { clearTimeout(t); clearTimeout(r); off() }
  }, [loc.pathname, loc.hash])

  return (
    <>
      <a href="#obsah" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-accentink">Přeskočit na obsah</a>
      <Header bare={bare} />
      <AnimatePresence mode="wait">
        <motion.main id="obsah" key={loc.pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          <Suspense fallback={<div className="min-h-screen" />}><Outlet /></Suspense>
        </motion.main>
      </AnimatePresence>
      {!bare && <Footer />}
      {bare && <div className="border-t border-line py-6 text-center text-[14px] text-muted"><Link className="underline" to="/ochrana-osobnich-udaju">Ochrana osobních údajů</Link> · Boostia s.r.o.</div>}
      {!bare && <StickyCta />}
      <Consent />
    </>
  )
}
