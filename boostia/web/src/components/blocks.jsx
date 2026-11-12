// Bloky, které se opakují na více stránkách.
import { ShieldCheck } from 'lucide-react'
import { Button, Card, Container, Magnetic, Placeholder, Reveal } from './ui'
import { COHORT } from '../content'

export function GuaranteeBlock() {
  return (
    <Reveal>
      <div className="rounded-[14px] border border-accent/50 bg-gradient-to-br from-accent/[0.07] to-transparent p-7 lg:p-12">
        <div className="grid gap-8 lg:grid-cols-[auto_1fr]">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accentink"><ShieldCheck size={30} /></div>
          <div>
            <h2 className="text-[clamp(1.9rem,4.2vw,3.1rem)]">Jdete do toho bez rizika</h2>
            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              <div>
                <h3 className="text-[21px]">První den na naše riziko</h3>
                <p className="mt-2 text-muted">Když po prvním dni řeknete, že to není ono, rozejdeme se a neplatíte nic.</p>
              </div>
              <div>
                <h3 className="text-[21px]">Bez dotace neplatíte</h3>
                <p className="mt-2 text-muted">Když Úřad práce vaši žádost zamítne, můžete od smlouvy odstoupit bez sankce. Rozhodujete se, až znáte výsledek.</p>
              </div>
              <div>
                <h3 className="text-[21px]">Doučíme zdarma</h3>
                <p className="mt-2 text-muted">Když vedoucí týmu po devíti dnech programu řekne, že lidé AI v denní práci nepoužívají, pokračujeme zdarma, až 20 hodin.</p>
              </div>
            </div>
            <p className="mt-6 text-[14px] text-muted">Doučení platí pro týmy s účastí aspoň 80 % a splněnými týdenními úkoly.</p>
          </div>
        </div>
      </div>
    </Reveal>
  )
}

export function CohortLine({ className = '' }) {
  return (
    <p className={`num text-[14px] text-muted ${className}`}>
      {COHORT.set
        ? <>Nejbližší kohorta: <span className="text-ink">{COHORT.date}</span> · volná místa: <span className="text-accent">{COHORT.spots} ze {COHORT.of}</span></>
        : <>Bereme nejvýš 3 nové týmy za čtvrtletí. <Placeholder>termín nejbližší kohorty</Placeholder></>}
    </p>
  )
}

export function FoundingBanner() {
  return (
    <Card className="!border-flow/40">
      <p className="font-mono text-[12px] uppercase tracking-wider text-flow">Poctivě: první týmy právě měříme</p>
      <h3 className="mt-3 text-[26px]">Výsledky zveřejníme tady. I ty, které nedopadnou podle plánu.</h3>
      <p className="mt-3 max-w-[64ch] text-muted">Boostia je nová firma a nechceme vám ukazovat čísla, která nemáme. Do té doby si můžete projít metodiku měření a spočítat vlastní čísla v kalkulačce. Prvním týmům věnujeme víc času výměnou za souhlas s případovou studií.</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button to="/audit" ctaId="founding_audit" section="proof">Chci být mezi prvními</Button>
        <Button href="/materialy/metodika-mereni.pdf" variant="secondary" ctaId="metodika_pdf" section="proof" arrow={false}>Stáhnout metodiku měření (PDF)</Button>
      </div>
    </Card>
  )
}

export function FinalCta({ title = 'Začněte číslem', text = 'Za 30 minut budete vědět, kolik hodin a korun váš obchod každý týden ztrácí. Co s tím uděláte, je na vás.', cta = 'Rezervovat audit zdarma', to = '/audit', id = 'final_audit' }) {
  return (
    <section className="pb-24 lg:pb-36">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[20px] border border-line bg-surface px-6 py-16 text-center lg:py-24">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" className="flowlines absolute inset-0 h-full w-full opacity-70">
              {[5, 20, 35, 65, 80, 95].map((y, i) => <path key={i} d={`M0 ${y} C 25 ${y}, 30 50, 38 50`} fill="none" stroke="var(--color-flow)" strokeOpacity=".22" strokeWidth="1" vectorEffect="non-scaling-stroke" />)}
              {[5, 20, 35, 65, 80, 95].map((y, i) => <path key={'r' + i} d={`M100 ${y} C 75 ${y}, 70 50, 62 50`} fill="none" stroke="var(--color-flow)" strokeOpacity=".22" strokeWidth="1" vectorEffect="non-scaling-stroke" />)}
            </svg>
            <div className="relative">
              <h2 className="text-[clamp(2.1rem,5vw,3.6rem)]">{title}</h2>
              <p className="mx-auto mt-5 max-w-[54ch] text-[18px] text-muted">{text}</p>
              <div className="mt-8"><Magnetic><Button to={to} ctaId={id} section="final" shine>{cta}</Button></Magnetic></div>
              <CohortLine className="mt-6" />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

export function PageHero({ badge, parts, sub, children }) {
  return (
    <section className="relative overflow-hidden pb-16 pt-[140px] lg:pb-24 lg:pt-[190px]">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" className="flowlines pointer-events-none absolute inset-y-0 right-0 h-full w-2/3 opacity-60 [mask-image:linear-gradient(to_right,transparent,#000)]">
        {[10, 25, 40, 60, 75, 90].map((y, i) => <path key={i} d={`M0 ${y} C 40 ${y}, 60 ${50 + (y - 50) * 0.2}, 85 50`} fill="none" stroke="var(--color-flow)" strokeOpacity=".2" strokeWidth="1" vectorEffect="non-scaling-stroke" />)}
        <path className="out" d="M85 50 H100" stroke="var(--color-accent)" strokeOpacity=".6" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </svg>
      <Container className="relative">
        {badge && <div className="mb-6"><span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 font-mono text-[12px] uppercase tracking-wider text-muted"><span className="h-1.5 w-1.5 rounded-full bg-accent" />{badge}</span></div>}
        {parts}
        {sub && <p className="mt-6 max-w-[62ch] text-[19px] text-muted">{sub}</p>}
        {children && <div className="mt-9 flex flex-wrap items-center gap-3">{children}</div>}
      </Container>
    </section>
  )
}
