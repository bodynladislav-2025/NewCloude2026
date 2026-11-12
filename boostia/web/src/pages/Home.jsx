import { lazy, Suspense } from 'react'
import { CalendarCheck, Receipt, Ruler, Scale, ShieldCheck, Target, Wallet, Wrench, X } from 'lucide-react'
import Seo, { ORG, faqSchema } from '../components/Seo'
import HeroBackground from '../components/HeroBackground'
import SubsidyCalc from '../components/SubsidyCalc'
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Badge, Button, Card, CheckList, Container, Faq, Magnetic, Marquee, NumberTicker, Placeholder, Reveal, Section, SectionHead, SHOW_PLACEHOLDERS } from '../components/ui'
import { FinalCta, FoundingBanner, GuaranteeBlock } from '../components/blocks'
import { FAQ_HOME, MODULES, PRICE, TOOLS } from '../content'
import { MATERIALS, MaterialsGrid } from './Materialy'

const AgentDemo = lazy(() => import('../components/AgentDemo'))

const BEFORE_AFTER = [
  ['Příprava na schůzku', '40 minut', '10 minut'],
  ['Zápis a CRM', 'druhý den', 'do 15 minut'],
  ['Nabídka', 'týden', 'do 24 hodin'],
  ['Cross-sell', 'když si někdo vzpomene', 'každý týden seznam'],
]

const COURSE = {
  '@context': 'https://schema.org', '@type': 'Course', name: 'AI Obchod 50',
  description: 'Měřený AI trénink pro obchodní týmy v devíti školicích dnech: příprava schůzek, zápisy, nabídky, prospecting a práce se stávajícími klienty.',
  provider: { '@type': 'Organization', name: 'Boostia' }, inLanguage: 'cs',
  hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'onsite', courseWorkload: 'PT50H' },
  offers: { '@type': 'Offer', price: '23900', priceCurrency: 'CZK', category: 'Paid' },
}

// Linka, která se při scrollu vykreslí nad čtyřmi kroky
function StepsLine() {
  const ref = useRef(null)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(ref.current.firstChild, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top 85%', end: 'top 35%', scrub: 0.6 } })
    })
    return () => mm.revert()
  }, { scope: ref })
  return <div ref={ref} aria-hidden="true" className="mb-6 hidden h-px bg-line lg:block"><div className="h-px origin-left bg-accent" /></div>
}

export default function Home() {
  return (
    <>
      <Seo title="AI školení pro obchodní týmy s měřeným výsledkem · Boostia" path="/"
        description="12 hodin měsíčně navíc na prodej pro každého obchodníka. AI školení obchodního týmu v 9 dnech. Celé ho proplatí Úřad práce."
        schema={[ORG, COURSE, faqSchema(FAQ_HOME)]} />

      {/* 1 – Hero: slib, dotace a kalkulačka hned nahoře */}
      <section className="relative overflow-hidden pb-14 pt-[104px] lg:pb-20 lg:pt-[128px]">
        <HeroBackground />
        <Container className="relative grid items-start gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12">
          <div className="lg:pt-6">
            <Badge>AI školení pro obchodní týmy · až 15 lidí</Badge>
            <h1 className="mt-6 text-[clamp(1.9rem,7.4vw,2.6rem)] font-bold leading-[1.08] lg:text-[clamp(2.2rem,3.35vw,2.95rem)] lg:[&_.rise]:whitespace-nowrap" aria-label="Každý obchodník získá 12 hodin měsíčně navíc na prodej. Školení vám proplatí Úřad práce.">
              <span aria-hidden="true">
                <span className="rise" style={{ '--i': 0 }}>Každý obchodník získá</span>
                <span className="rise" style={{ '--i': 1 }}><span className="marker">12 hodin měsíčně</span></span>
                <span className="rise" style={{ '--i': 2 }}>navíc na prodej. Školení</span>
                <span className="rise" style={{ '--i': 3 }}>vám proplatí Úřad práce.</span>
              </span>
            </h1>
            <p className="mt-6 max-w-[54ch] text-[18px] text-muted">Až <span className="text-ink">23 909 Kč</span> za každého zaměstnance, který kurz dokončí. To pokryje celou cenu kurzu. Za 9 školicích dní u vás ve firmě naučíme obchodní tým pracovat s AI na vlastních zakázkách.</p>
            <p className="mt-3 flex items-center gap-2 text-[16px] font-medium"><ShieldCheck size={18} className="shrink-0 text-accent" aria-hidden="true" />Když Úřad práce žádost neschválí, neplatíte nic.</p>
            <div className="mt-7 flex flex-wrap items-center gap-3 lg:hidden">
              <Button href="#kalkulacka" ctaId="hero_calc" section="hero" shine>Spočítat příspěvek a přínos</Button>
            </div>
            <ul className="mt-8 flex flex-wrap gap-2 text-[14px] text-muted">
              {['9 školicích dní u vás', 'max. 15 lidí', '50 hodin', 'měřený výsledek', 'vede obchodník se 17 lety praxe'].map((t) => <li key={t} className="rounded-full border border-line bg-surface/70 px-3 py-1.5">{t}</li>)}
            </ul>
            <dl className="mt-8 grid max-w-[640px] grid-cols-3 gap-3">
              {[[144, ' h', 'ročně navíc na obchodníka'], [2160, ' h', 'ročně u týmu 15 lidí'], [0, ' Kč', 'doplatek při plné docházce']].map(([n, u, l]) => (
                <div key={l} className="rounded-[14px] border border-line bg-surface/80 p-4 backdrop-blur-sm">
                  <dt className="sr-only">{l}</dt>
                  <dd><span className="text-[clamp(1.25rem,2.6vw,1.6rem)] font-medium leading-none text-accent"><NumberTicker value={n} suffix={u} /></span><span className="mt-2 block text-[13px] leading-snug text-muted">{l}</span></dd>
                </div>
              ))}
            </dl>
          </div>
          <SubsidyCalc />
        </Container>
      </section>

      {/* Důkaz: lidé, lektor, hodnocení */}
      <Section tight className="border-y border-line bg-surface/40">
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <Reveal>
            <figure className="relative overflow-hidden rounded-[18px] border border-line">
              <img src="/img/skoleni.jpg" srcSet="/img/skoleni-800.jpg 800w, /img/skoleni.jpg 1600w" sizes="(min-width: 1024px) 600px, 100vw" width="1600" height="893" loading="lazy" decoding="async" alt="Školicí den: lektor u plátna a obchodní tým u notebooků" className="block h-auto w-full" />
              <figcaption className="absolute bottom-3 left-3 rounded-full bg-bg/80 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-muted backdrop-blur">Ilustrační foto</figcaption>
            </figure>
          </Reveal>
          <Reveal>
            <Badge>Kdo vás bude učit</Badge>
            <h2 className="mt-5 text-[clamp(1.7rem,3.4vw,2.4rem)]">Učí vás obchodník, ne lektor z IT</h2>
            <p className="mt-4 text-muted">Program vede<Placeholder>jméno a fotografie</Placeholder>. Sedmnáct let v obchodě, týmy od 5 do 80 obchodníků, obchodní ředitel ve firmách s obratem přes 400 milionů korun. AI nástroje sám staví a zavádí do obchodní praxe.</p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[[17, '', 'let v obchodě'], [80, '', 'lidí v největším týmu'], [400, '+', 'mil. Kč obrat řízených firem']].map(([n, u, l]) => (
                <div key={l} className="rounded-[14px] border border-line bg-surface p-4"><p className="text-[28px] font-medium leading-none text-accent"><NumberTicker value={n} suffix={u} /></p><p className="mt-2 text-[13px] leading-snug text-muted">{l}</p></div>
              ))}
            </div>
            {SHOW_PLACEHOLDERS && (
              <div className="mt-6 rounded-[14px] border border-dashed border-warn/60 bg-warn/5 p-4">
                <p className="font-mono text-[11px] uppercase tracking-wider text-warn">Hodnocení účastníků · doplnit</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {[1, 2].map((i) => <div key={i} className="rounded-[10px] border border-line bg-surface p-3 text-[14px] text-muted">„Citace účastníka.“<span className="mt-2 block text-[12px]">Jméno, pozice, firma</span></div>)}
                </div>
              </div>
            )}
          </Reveal>
        </div>
      </Section>

      {/* 2 – Problém */}
      <Section>
        <SectionHead badge="Obchodník úředníkem" title="Platíte obchodníky za prodej. Většinu týdne ale dělají něco jiného.">
          <p>Hledají informace o klientovi. Přepisují poznámky ze schůzky. Skládají nabídku z pěti souborů. V pátek odpoledne dohánějí CRM. Na samotné jednání s klienty jim zbývá zlomek týdne.</p>
          <p>Není to jejich chyba. Tak se obchod dělal dvacet let. Jenže dnes tu práci zvládne AI za zlomek času a vaši konkurenti se to právě učí.</p>
        </SectionHead>
        <Reveal className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BEFORE_AFTER.map(([label, before, after]) => (
            <Card key={label}>
              <p className="text-[15px] text-muted">{label}</p>
              <p className="mt-5 num text-[17px] text-warn"><span className="strike">{before}</span></p>
              <p className="after-pop mt-1 font-display text-[28px] font-semibold leading-tight text-accent">{after}</p>
            </Card>
          ))}
        </Reveal>
        <p className="mt-5 text-[14px] text-muted">Cílové hodnoty programu. Vaše skutečná čísla změříme první den.<Placeholder kind="PROOF">nahradit průměry z pilotních týmů</Placeholder></p>
      </Section>

      {/* 4 – Řešení */}
      <Section>
        <SectionHead badge="AI Obchod 50" title="9 dní, po kterých tým pracuje jinak">
          <p>Žádná přednáška o umělé inteligenci. Devět školicích dní u vás ve firmě, na vašich klientech a vašich nabídkách. Každý den jedna dovednost, kterou obchodník hned použije.</p>
        </SectionHead>
        <Reveal className="grid gap-4 lg:grid-cols-3">
          {[[Ruler, 'Měříme', 'První den stopujeme pět běžných činností. Devátý den znovu. Vedení dostane rozdíl v hodinách a korunách.'],
            [Target, 'Trénujeme na vaší práci', 'Příprava na skutečnou zítřejší schůzku. Skutečná nabídka. Skutečný zápis do vašeho CRM.'],
            [Wrench, 'Necháme vám nástroje', 'Čtyři asistenti nastavení na vaše podklady a Playbook AI obchodu vaší firmy.']].map(([I, h, t]) => (
            <Card key={h}><I size={26} className="text-accent" aria-hidden="true" /><h3 className="mt-5 text-[24px]">{h}</h3><p className="mt-3 text-muted">{t}</p></Card>
          ))}
        </Reveal>
      </Section>

      {/* 5 – Moduly */}
      <Section tight>
        <SectionHead title="Co se tým naučí" />
        <Reveal className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
          {MODULES.map(([n, h, t]) => (
            <Card key={n} spotlight tilt>
              <p className="num text-[13px] text-accent">{n}</p>
              <h3 className="mt-4 text-[22px]">{h}</h3>
              <p className="mt-3 text-muted">{t}</p>
            </Card>
          ))}
        </Reveal>
      </Section>

      {/* 6 – Živá ukázka */}
      <Section className="border-y border-line bg-surface/40">
        <div className="grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHead badge="Ukázka" title="Podívejte se, jak to vypadá v praxi">
            <p>Ukázka je simulovaná, postup je skutečný. Tohle se tým naučí třetí, čtvrtý a pátý den.</p>
            <p className="pt-2"><Button to="/audit" ctaId="demo_audit" section="demo">Chci tohle pro svůj tým</Button></p>
          </SectionHead>
          <Suspense fallback={<div className="min-h-[640px] rounded-[14px] border border-line bg-surface" />}><AgentDemo /></Suspense>
        </div>
      </Section>

      {/* Proč to zaplatí Úřad práce */}
      <Section id="dotace" className="scroll-mt-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <SectionHead badge="Dotace" title="Proč vám školení zaplatí Úřad práce?">
            <p>Úřad práce teď z evropských peněz platí firmám vzdělávání zaměstnanců. Projekt se jmenuje Vzdělávání pro firmy a práce s nástroji AI do něj patří.</p>
            <p>Za každou hodinu výuky vrátí <span className="text-ink">478,19 Kč na účastníka</span>. Náš program má 50 hodin, tedy až 23 909 Kč na člověka. Program stojí 23 900 Kč za účastníka, takže ho příspěvek pokryje celý. U plné skupiny 15 lidí je cena 358 500 Kč a příspěvek až 358 643 Kč.</p>
            <p className="text-[14px]">Projekt Úřadu práce ČR Vzdělávání pro firmy, reg. č. CZ.03.01.03/00/23_048/0006351, Operační program Zaměstnanost plus. Podmínky najdete na up.gov.cz/vzdelavani-pro-firmy.</p>
          </SectionHead>
          <Reveal className="space-y-3">
            <div className="rounded-[14px] border border-line bg-surface p-6">
              <dl className="space-y-3 text-[16px]">
                <div className="flex justify-between gap-4"><dt className="text-muted">Cena programu pro 15 lidí (15 × 23 900 Kč)</dt><dd className="num whitespace-nowrap">358 500 Kč</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-muted">Příspěvek za 15 lidí (15 × 50 h × 478,19 Kč)</dt><dd className="num whitespace-nowrap text-flow">až 358 643 Kč</dd></div>
                <div className="flex justify-between gap-4 border-t border-line pt-3"><dt>Doplatíte</dt><dd className="num text-[22px] font-medium text-accent">0 Kč</dd></div>
              </dl>
            </div>
            <p className="text-[13px] text-muted">Ceny bez DPH. Počítáme se zaměstnanci v pracovním poměru. Příspěvek přijde zpětně po skončení kurzu a není nárokový.</p>
            <Button href="#kalkulacka" ctaId="dotace_calc" section="dotace">Spočítat pro náš počet lidí</Button>
          </Reveal>
        </div>
      </Section>

      {/* Kde je háček */}
      <Section tight className="border-y border-line bg-surface/40">
        <SectionHead title="Kde je háček? Řekneme vám to rovnou." />
        <Reveal className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" stagger={0.06}>
          {[[Wallet, 'Kurz předfinancujete', 'Program nejdřív uhradíte. Příspěvek přijde na účet po skončení kurzu a doložení docházky.'],
            [CalendarCheck, 'Rozhoduje docházka', 'Každý musí odchodit aspoň 80 % výuky. Za každý zameškaný den klesne příspěvek o 2 869 Kč za člověka a rozdíl doplácíte.'],
            [Receipt, 'Něco příspěvek nepokryje', 'DPH (plátci si ho odečtou) a licence AI nástrojů pro účastníky.'],
            [Scale, 'Příspěvek není nárokový', 'Rozhoduje Úřad práce. Proto s vámi podmínky projdeme dřív, než žádost podáte.']].map(([I, h, t]) => (
            <Card key={h} tilt><I size={24} className="text-warn" aria-hidden="true" /><h3 className="mt-5 text-[20px]">{h}</h3><p className="mt-2 text-[15px] text-muted">{t}</p></Card>
          ))}
        </Reveal>
        <Reveal className="mt-4">
          <div className="flex flex-wrap items-center gap-4 rounded-[14px] border border-accent/50 bg-accent/[0.06] p-6">
            <ShieldCheck size={28} className="shrink-0 text-accent" aria-hidden="true" />
            <p className="max-w-[80ch] flex-1"><strong>Bez rizika.</strong> Když Úřad práce žádost neschválí, neplatíte nám nic. Smlouva s námi začne platit až ve chvíli, kdy začne platit vaše dohoda s úřadem.</p>
          </div>
        </Reveal>
      </Section>

      {/* Pro koho */}
      <Section tight>
        <SectionHead title="Pro koho program je?" />
        <Reveal className="grid gap-4 lg:grid-cols-2">
          <Card className="!border-accent/40">
            <h3 className="text-[22px]">Je pro vás, když</h3>
            <CheckList className="mt-5 text-muted" items={[
              'Máte obchodní tým. Skupinu do 15 lidí můžete doplnit obchodní podporou, marketingem nebo vedením.',
              'Vaši lidé jsou v pracovním poměru, ne na dohodu.',
              'Dokážete je uvolnit na devět dní během zhruba dvou až tří měsíců.',
              'Chcete, aby AI používali bezpečně a na skutečné práci, ne jako lepší vyhledávač.',
            ]} />
          </Card>
          <Card>
            <h3 className="text-[22px]">Není pro vás, když</h3>
            <ul className="mt-5 space-y-3 text-muted">
              {['Jste nezisková organizace, škola, obec nebo veřejná správa. Ty projekt nepodporuje.', 'Vaši lidé pracují jen na DPP nebo DPČ.', 'Hledáte jednu přednášku, ne práci na vlastních zakázkách.', 'Máte dva nebo tři obchodníky. Pro ně stačí jednodenní AI Start.'].map((t) => (
                <li key={t} className="flex gap-3"><X size={18} className="mt-1 shrink-0 text-warn" aria-hidden="true" /><span>{t}</span></li>
              ))}
            </ul>
          </Card>
        </Reveal>
      </Section>

      {/* Jak to probíhá */}
      <Section tight className="border-y border-line bg-surface/40">
        <SectionHead title="Od ověření po proplacení v pěti krocích" />
        <StepsLine />
        <Reveal as="ol" className="relative grid gap-4 md:grid-cols-2 lg:grid-cols-5" stagger={0.06}>
          {[['Ověření nároku', 'Pošlete IČO a počet lidí. Do 2 pracovních dnů víte, s čím můžete počítat.'],
            ['Žádost na Úřad práce', 'Podáváte vy, online, klidně s dotačním poradcem. Dodáme osnovu, harmonogram a podklady ke kurzu.'],
            ['Schválení', 'Obvykle do 30 dní. Úřad s vámi uzavře dohodu a můžeme začít.'],
            ['9 školicích dní u vás', 'Obvykle jeden den týdně. Měření na začátku a na konci.'],
            ['Proplacení', 'Doložíte docházku a příspěvek přijde na účet.']].map(([h, t], i) => (
            <li key={h} className="rounded-[14px] border border-line bg-surface p-5">
              <span className="num text-[13px] text-accent">0{i + 1}</span>
              <h3 className="mt-4 text-[19px]">{h}</h3><p className="mt-2 text-[15px] text-muted">{t}</p>
            </li>
          ))}
        </Reveal>
        <p className="mt-6 text-[14px] text-muted">Od prvního kontaktu po první školicí den počítejte s rezervou dvou až tří měsíců.</p>
        <p className="mt-6"><Button to="/jak-to-funguje" variant="ghost" ctaId="home_how" section="jak">Celý průběh den po dni</Button></p>
      </Section>

      {/* 8 – Garance */}
      <Section tight><GuaranteeBlock /></Section>

      {/* Cena */}
      <Section id="cena" className="scroll-mt-20">
        <SectionHead title="Kolik to stojí">
          <p>Cena je za účastníka a je nastavená tak, aby ji příspěvek Úřadu práce pokryl celou.</p>
        </SectionHead>
        <Reveal className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
          <Card className="!border-accent/60 !bg-surface2">
            <p className="font-mono text-[12px] uppercase tracking-wider text-accent">AI Obchod 50</p>
            <p className="mt-4 text-[clamp(2.6rem,6vw,3.6rem)] font-medium leading-none"><NumberTicker value={23900} suffix=" Kč" /></p>
            <p className="mt-3 text-[15px] text-muted">za účastníka, bez DPH · 50 hodin v 9 dnech u vás ve firmě</p>
            <p className="mt-2 text-[15px] text-muted">Plná skupina 15 lidí: <span className="num whitespace-nowrap text-ink">358 500 Kč</span> · účtujeme nejméně 9 míst (<span className="num whitespace-nowrap text-ink">215 100 Kč</span>)</p>
            <ul className="mt-6 grid gap-2 text-[15px] text-muted sm:grid-cols-2"><li>Měření před a po, report pro vedení</li><li>Playbook a 4 týmoví asistenti</li><li>AI směrnice a semafor dat</li><li>Podklady ke kurzu pro žádost</li><li>Osvědčení pro každého účastníka</li><li>3 měsíce Boostia Klubu</li></ul>
          </Card>
          <Card className="flex flex-col justify-center !border-flow/50">
            <p className="font-mono text-[12px] uppercase tracking-wider text-flow">S příspěvkem Úřadu práce</p>
            <p className="mt-4 font-display text-[clamp(1.6rem,3.4vw,2.2rem)] font-semibold leading-tight">Při plné docházce <span className="marker">doplatíte 0 Kč</span>.</p>
            <p className="mt-4 text-muted">Úřad práce vrací až 23 909 Kč za každého, kdo kurz absolvuje. Platí od 9 účastníků. Každý zameškaný den sníží příspěvek o 2 869 Kč za člověka, proto termíny plánujeme s vámi předem.</p>
            <div className="mt-6"><Button href="#kalkulacka" ctaId="price_calc" section="cena">Spočítat pro náš počet lidí</Button></div>
          </Card>
        </Reveal>
        <p className="mt-5 max-w-[84ch] text-[14px] text-muted">Chcete to nejdřív vyzkoušet? AI Start den s celým týmem stojí {PRICE.startDay}. O dotaci žádá vaše firma a rozhoduje Úřad práce.</p>
      </Section>

      {/* 11 – Proof */}
      <Section tight>
        <SectionHead title="Výsledky" />
        <FoundingBanner />
      </Section>

      {/* Materiály zdarma */}
      <Section tight className="border-y border-line bg-surface/40">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[720px]">
            <Badge>Materiály zdarma</Badge>
            <h2 className="mt-5 text-[clamp(1.9rem,4.2vw,3.1rem)]">Řešíte AI školení z pozice HR? Začněte těmito podklady.</h2>
            <p className="mt-4 text-[18px] text-muted">Jak vybrat dodavatele, jak na dotaci, vzor pravidel pro AI a podklad pro vedení. Pro obchodníky 25 promptů k okamžitému použití.</p>
          </div>
          <Button to="/materialy-zdarma" variant="secondary" ctaId="home_materials" section="materialy">Všechny materiály</Button>
        </div>
        <MaterialsGrid group="hr" items={MATERIALS.hr.slice(0, 2)} />
      </Section>

      {/* 12 – Nástroje */}
      <section className="pb-8">
        <Container><p className="mb-5 text-center font-mono text-[12px] uppercase tracking-wider text-muted">Pracujeme s tím, co už máte</p></Container>
        <Marquee items={TOOLS} />
      </section>

      {/* 13 – FAQ */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <SectionHead title="Na co se ptáte nejčastěji" />
          <Faq items={FAQ_HOME} id="faq-home" />
        </div>
      </Section>

      <FinalCta />
    </>
  )
}
