import { lazy, Suspense } from 'react'
import { CalendarCheck, FileCheck2, GraduationCap, Ruler, ShieldCheck, Target, Timer, Wrench } from 'lucide-react'
import Seo, { ORG, faqSchema } from '../components/Seo'
import HeroBackground from '../components/HeroBackground'
import Calculator from '../components/Calculator'
import SubsidyCalc from '../components/SubsidyCalc'
import { Badge, Button, Card, Container, Faq, Magnetic, Marquee, Placeholder, Reveal, Section, SectionHead, SplitHeadline } from '../components/ui'
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
  description: 'Osmitýdenní měřený AI trénink pro obchodní týmy: příprava schůzek, zápisy, nabídky, prospecting a práce se stávajícími klienty.',
  provider: { '@type': 'Organization', name: 'Boostia' }, inLanguage: 'cs',
  hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'onsite', courseWorkload: 'PT50H' },
  offers: { '@type': 'Offer', price: '197000', priceCurrency: 'CZK', category: 'Paid' },
}

export default function Home() {
  return (
    <>
      <Seo title="AI školení pro obchodní týmy s měřeným výsledkem · Boostia" path="/"
        description="12 hodin měsíčně navíc na prodej pro každého obchodníka. Osmitýdenní AI trénink obchodního týmu za 197 000 Kč, s dotací Úřadu práce a měřeným výsledkem."
        schema={[ORG, COURSE, faqSchema(FAQ_HOME)]} />

      {/* 1 – Hero */}
      <section className="relative flex min-h-[92svh] items-center overflow-hidden pb-16 pt-[120px]">
        <HeroBackground />
        <Container className="relative">
          <Badge>Měřený AI trénink pro obchodní týmy</Badge>
          <SplitHeadline className="mt-6 max-w-[18ch] text-[clamp(2.4rem,6.2vw,4.6rem)] leading-[1.03]"
            parts={[{ t: '12 hodin měsíčně', hl: true }, { t: ' navíc na prodej pro každého obchodníka. ' }, { t: 'Kolik vám vydělají?', hl: true }]} />
          <p className="mt-6 max-w-[60ch] text-[19px] text-muted">Čas, který dnes spolknou přípravy, zápisy a nabídky, vrátíme obchodu. Za 8 týdnů naučíme váš tým pracovat s AI bezpečně a na vlastních zakázkách. <span className="hidden sm:inline">Výsledek změříme v hodinách i v korunách.</span></p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Magnetic><Button href="#kalkulacka" ctaId="hero_calc" section="hero">Spočítat, kolik to vydělá</Button></Magnetic>
            <Button to="/audit" variant="secondary" ctaId="hero_audit" section="hero" arrow={false}>Audit zdarma (30 min)</Button>
          </div>
          <p className="mt-4 text-[14px] text-muted">Cena 197 000 Kč pro celý tým · při 16 účastnících ji pokryje dotace Úřadu práce</p>
          <dl className="mt-10 grid max-w-[900px] gap-3 sm:grid-cols-3">
            {[['144 hodin', 'ročně navíc na jednoho obchodníka', '12 hodin měsíčně, cíl programu'], ['1 440 hodin', 'ročně u týmu deseti lidí', 'skoro celý úvazek navíc pro obchod'], ['13 mil. Kč', 'tržeb ročně navíc, modelový tým', '10 lidí, 10 mil. Kč tržeb na obchodníka. Spočítejte si svoje.']].map(([n, l, s], i) => (
              <div key={n} className="rounded-[14px] border border-line bg-surface/80 p-5 backdrop-blur-sm">
                <dt className="sr-only">{l}</dt>
                <dd>
                  {i === 2
                    ? <a href="#kalkulacka" className="num text-[26px] font-medium leading-none text-accent underline decoration-accent/40 underline-offset-4">{n}</a>
                    : <span className="num text-[26px] font-medium leading-none text-accent">{n}</span>}
                  <span className="mt-2 block text-[15px] text-ink">{l}</span>
                  <span className="mt-1 block text-[13px] text-muted">{s}</span>
                </dd>
              </div>
            ))}
          </dl>
          <ul className="mt-8 grid max-w-[900px] gap-x-8 gap-y-3 text-[15px] text-muted sm:grid-cols-2 lg:grid-cols-4">
            {[[Timer, '50 hodin, 8 týdnů'], [ShieldCheck, 'První den na naše riziko'], [FileCheck2, 'Dotace Úřadu práce'], [GraduationCap, 'Vede obchodník se 17 lety praxe']].map(([I, t]) => (
              <li key={t} className="flex items-center gap-2.5"><I size={18} className="shrink-0 text-accent" aria-hidden="true" />{t}</li>
            ))}
          </ul>
        </Container>
      </section>

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
              <p className="mt-5 num text-[17px] text-warn line-through decoration-warn/70">{before}</p>
              <p className="mt-1 font-display text-[28px] font-semibold leading-tight text-accent">{after}</p>
            </Card>
          ))}
        </Reveal>
        <p className="mt-5 text-[14px] text-muted">Cílové hodnoty programu. Vaše skutečná čísla změříme první týden.<Placeholder kind="PROOF">nahradit průměry z pilotních týmů</Placeholder></p>
      </Section>

      {/* 3 – Kalkulačka */}
      <Section id="kalkulacka" className="scroll-mt-20 border-y border-line bg-surface/40">
        <SectionHead badge="Kalkulačka" title="Kolik hodin ročně vrátí AI vašemu obchodu? A kolik to dělá v korunách?">
          <p>Pár čísel, dvě minuty. Uvidíte, kolik hodin ročně tým získá zpět, kolik to dělá v nákladech a kolik tržeb může ten čas přinést. Bez registrace.</p>
        </SectionHead>
        <Calculator />
      </Section>

      {/* 4 – Řešení */}
      <Section>
        <SectionHead badge="AI Obchod 50" title="Osm týdnů, po kterých tým pracuje jinak">
          <p>Žádná přednáška o umělé inteligenci. Jeden den v týdnu u vás ve firmě, na vašich klientech a vašich nabídkách. Každý týden jedna dovednost, kterou obchodník druhý den použije.</p>
        </SectionHead>
        <Reveal className="grid gap-4 lg:grid-cols-3">
          {[[Ruler, 'Měříme', 'První týden stopujeme pět běžných činností. Osmý týden znovu. Vedení dostane rozdíl v hodinách a korunách.'],
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
          {MODULES.map(([n, h, t], i) => (
            <Card key={n} spotlight className={i === 0 || i === 5 ? 'lg:col-span-1' : ''}>
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
            <p>Ukázka je simulovaná, postup je skutečný. Tohle se tým naučí druhý, třetí a čtvrtý týden.</p>
            <p className="pt-2"><Button to="/audit" ctaId="demo_audit" section="demo">Chci tohle pro svůj tým</Button></p>
          </SectionHead>
          <Suspense fallback={<div className="min-h-[640px] rounded-[14px] border border-line bg-surface" />}><AgentDemo /></Suspense>
        </div>
      </Section>

      {/* 7 – Jak to funguje */}
      <Section>
        <SectionHead title="Od prvního hovoru k výsledku ve čtyřech krocích" />
        <Reveal as="ol" className="relative grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[[CalendarCheck, 'Audit (30 minut, zdarma)', 'Spočítáme, kolik času a peněz váš obchod ztrácí.'],
            [FileCheck2, 'Dotace', 'Ověříme nárok a žádost připravíme s vaším HR.'],
            [GraduationCap, 'Osm týdnů tréninku', 'Jeden den týdně u vás. Měření na začátku a na konci.'],
            [Target, 'Výsledek a co dál', 'Report pro vedení. Tým, který AI používá každý den. Když to dává smysl, postavíme vám AI agenty.']].map(([I, h, t], i) => (
            <li key={h} className="rounded-[14px] border border-line bg-surface p-6">
              <div className="flex items-center justify-between"><span className="num text-[13px] text-muted">0{i + 1}</span><I size={22} className="text-accent" aria-hidden="true" /></div>
              <h3 className="mt-6 text-[21px]">{h}</h3><p className="mt-2 text-muted">{t}</p>
            </li>
          ))}
        </Reveal>
        <p className="mt-8"><Button to="/jak-to-funguje" variant="ghost" ctaId="home_how" section="jak">Celý průběh týden po týdnu</Button></p>
      </Section>

      {/* 8 – Garance */}
      <Section tight><GuaranteeBlock /></Section>

      {/* 9 – Cena a dotace */}
      <Section id="cena" className="scroll-mt-20">
        <SectionHead title="Kolik to stojí">
          <p>Jedna cena pro celý tým. A většinu nebo celou částku může pokrýt dotace Úřadu práce.</p>
        </SectionHead>
        <Reveal className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
          <Card className="!border-accent/60 !bg-surface2">
            <p className="font-mono text-[12px] uppercase tracking-wider text-accent">AI Obchod 50</p>
            <p className="mt-4 num text-[clamp(2.6rem,6vw,3.6rem)] font-medium leading-none">{PRICE.program}</p>
            <p className="mt-3 text-[15px] text-muted">bez DPH · jedna cena pro tým až 16 lidí · 50 hodin u vás ve firmě</p>
            <ul className="mt-6 grid gap-2 text-[15px] text-muted sm:grid-cols-2"><li>Měření před a po, report pro vedení</li><li>Playbook a 4 týmoví asistenti</li><li>AI směrnice a semafor dat</li><li>Pomoc s dotací v ceně</li><li>Osvědčení pro každého účastníka</li><li>3 měsíce Boostia Klubu</li></ul>
          </Card>
          <Card className="flex flex-col justify-center !border-flow/50">
            <p className="font-mono text-[12px] uppercase tracking-wider text-flow">Dotace Úřadu práce</p>
            <p className="mt-4 font-display text-[clamp(1.6rem,3.4vw,2.2rem)] font-semibold leading-tight">Při 16 účastnících zaplatí <span className="text-accent">celých 197 000 Kč</span> Úřad práce.</p>
            <p className="mt-4 text-muted">U menšího týmu pokryje příspěvek většinu ceny: při 12 lidech zhruba 79 %, při 10 lidech 66 %. K tomu stát přispívá na mzdy za dobu školení. Žádost připravíme s vaším HR.<Placeholder kind="OVĚŘIT">sazba 260,73 Kč/h a podmínky</Placeholder></p>
          </Card>
        </Reveal>
        <div className="mt-4"><SubsidyCalc /></div>
        <p className="mt-5 max-w-[84ch] text-[14px] text-muted">Chcete to nejdřív vyzkoušet? AI Start den s celým týmem stojí {PRICE.startDay} a při pokračování do programu se odečte. O dotaci žádá vaše firma a rozhoduje Úřad práce; nárok vám ověříme do dvou pracovních dnů.</p>
      </Section>

      {/* 10 – Kdo vás bude učit */}
      <Section tight className="border-y border-line bg-surface/40">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.7fr]">
          <SectionHead title="Učí vás lidé, kteří obchod sami řídili">
            <p>Program vede<Placeholder>jméno</Placeholder>, vedoucí lektor Boostie. Sedmnáct let v obchodě, týmy od 5 do 80 obchodníků, obchodní ředitel ve firmách s obratem přes 400 milionů korun. AI nástroje sám staví a zavádí do obchodní praxe. Certifikovaný kouč a lektor.</p>
            <p>Technickou část a AI agenty dodává náš vývojový tým.</p>
          </SectionHead>
          <Reveal className="grid grid-cols-3 gap-3">
            {[['17', 'let v obchodě'], ['80', 'obchodníků v největším týmu'], ['400+', 'mil. Kč obrat řízených firem']].map(([n, l]) => (
              <div key={l} className="rounded-[14px] border border-line bg-surface p-5"><p className="num text-[34px] font-medium leading-none text-accent">{n}</p><p className="mt-3 text-[13px] leading-snug text-muted">{l}</p></div>
            ))}
          </Reveal>
        </div>
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
