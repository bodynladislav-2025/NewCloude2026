import { Info } from 'lucide-react'
import Seo, { faqSchema } from '../components/Seo'
import { SubsidyForm } from '../components/Forms'
import { Button, Card, CheckList, Faq, NumberTicker, Placeholder, Reveal, Section, SectionHead, SplitHeadline } from '../components/ui'
import { PageHero } from '../components/blocks'
import { FAQ_DOTACE } from '../content'

// Výpočet ze sazby 260,73 Kč / hodina / účastník a 50 hodin. OVĚŘIT před zveřejněním.
const ROWS = [[8, 104292, 185708], [10, 130365, 159635], [12, 156438, 133562]]
const STEPS = [
  ['Ověření', '2 dny', 'Pošlete IČO a počet účastníků. Řekneme, jestli a z čeho můžete čerpat.'],
  ['Žádost', '1–2 týdny', 'Dodáme osnovu, harmonogram, hodinovou dotaci a profil lektora. Žádost s vaším HR předvyplníme. Podáváte vy.'],
  ['Schválení', null, 'Rozhoduje Úřad práce.'],
  ['Program', '8 týdnů', 'Vedeme prezenční listiny a vystavíme osvědčení.'],
  ['Vyúčtování', null, 'Připravíme podklady. Příspěvek dostáváte zpětně po dokončení.'],
]

export default function Dotace() {
  return (
    <>
      <Seo title="Dotace na AI školení zaměstnanců · Boostia" path="/dotace"
        description="Program má 50 hodin a lze na něj čerpat příspěvek Úřadu práce. Nárok ověříme do 2 dnů a žádost připravíme s vaším HR." schema={[faqSchema(FAQ_DOTACE)]} />
      <PageHero badge="Dotace"
        parts={<SplitHeadline className="max-w-[20ch] text-[clamp(2.2rem,5.4vw,4rem)]" parts={[{ t: 'Na AI Obchod 50 můžete čerpat dotaci. ' }, { t: 'Papíry připravíme s vámi.', hl: true }]} />}
        sub={<>Program má 50 hodin, což je minimální rozsah pro projekt Vzdělávání pro firmy Úřadu práce. Pro tým deseti lidí jde o příspěvek přes 130 000 Kč na školení a k tomu příspěvek na mzdy.<Placeholder kind="OVĚŘIT" /></>}>
        <Button href="#overit" ctaId="dotace_hero" section="hero">Ověřit nárok do 2 pracovních dnů</Button>
      </PageHero>

      <Section tight>
        <SectionHead title="Kolik to dělá" />
        <Reveal className="grid gap-4 md:grid-cols-3">
          {ROWS.map(([n, sub, after]) => (
            <Card key={n} className={n === 10 ? '!border-accent/60 !bg-surface2' : ''}>
              <p className="font-mono text-[12px] uppercase tracking-wider text-muted">Tým {n} lidí</p>
              <dl className="mt-5 space-y-3 text-[15px]">
                <div className="flex justify-between gap-4"><dt className="text-muted">Cena programu</dt><dd className="num">290 000 Kč</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-muted">Příspěvek na vzdělávání</dt><dd className="num text-flow">−<NumberTicker value={sub} suffix=" Kč" /></dd></div>
              </dl>
              <div className="mt-5 border-t border-line pt-5">
                <p className="text-[14px] text-muted">Cena po dotaci</p>
                <p className="text-[34px] font-medium leading-tight text-accent"><NumberTicker value={after} suffix=" Kč" /></p>
              </div>
            </Card>
          ))}
        </Reveal>
        <p className="mt-5 max-w-[84ch] text-[14px] text-muted">Výpočet vychází ze sazby 260,73 Kč za hodinu a účastníka<Placeholder kind="OVĚŘIT">sazba a datum platnosti</Placeholder>. K tomu stát přispívá na mzdy za dobu školení. Konečnou výši určuje Úřad práce. Ceny bez DPH.</p>
      </Section>

      <Section tight className="border-y border-line bg-surface/40">
        <SectionHead title="Jak to probíhá" />
        <Reveal as="ol" className="grid gap-4 md:grid-cols-2 lg:grid-cols-5" stagger={0.06}>
          {STEPS.map(([h, meta, t], i) => (
            <li key={h} className="rounded-[14px] border border-line bg-surface p-5">
              <div className="flex items-baseline justify-between"><span className="num text-[13px] text-muted">0{i + 1}</span>{meta ? <span className="num text-[13px] text-accent">{meta}</span> : <Placeholder>lhůta</Placeholder>}</div>
              <h3 className="mt-4 text-[20px]">{h}</h3><p className="mt-2 text-[15px] text-muted">{t}</p>
            </li>
          ))}
        </Reveal>
      </Section>

      <Section>
        <div className="grid gap-5 lg:grid-cols-2">
          <Reveal>
            <Card className="h-full !border-flow/40">
              <Info size={24} className="text-flow" aria-hidden="true" />
              <h2 className="mt-4 text-[26px]">Co je dobré vědět předem</h2>
              <CheckList className="mt-5 text-muted" items={['Žádost musí být podaná a schválená před zahájením.', 'Program nejdřív zaplatíte, příspěvek přijde po dokončení.', 'Účastníci musí kurz dokončit.', 'Schválení nemůžeme zaručit. Můžeme zaručit, že podklady budou úplné a včas.']} />
            </Card>
          </Reveal>
          <Reveal>
            <Card className="h-full">
              <h2 className="text-[26px]">Když dotace nevyjde</h2>
              <p className="mt-4 text-muted">Když Úřad práce žádost zamítne, můžete od smlouvy odstoupit bez sankce. Rozhodujete se tedy až ve chvíli, kdy znáte výsledek.</p>
              <h3 className="mt-8 text-[20px]">Pomoc s dotací je v ceně</h3>
              <p className="mt-2 text-muted">Žádá vždy vaše firma. My dodáme podklady, předvyplníme žádost a vedeme docházku.</p>
            </Card>
          </Reveal>
        </div>
      </Section>

      <Section tight id="overit" className="scroll-mt-20 border-t border-line bg-surface/40">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHead title="Ověříme to za vás do dvou pracovních dnů"><p>Stačí IČO a počet lidí, které chcete školit. Projdeme aktuální podmínky a pošleme vám, s čím můžete počítat.</p></SectionHead>
            <Faq items={FAQ_DOTACE} id="faq-dotace" />
          </div>
          <SubsidyForm />
        </div>
      </Section>
    </>
  )
}
