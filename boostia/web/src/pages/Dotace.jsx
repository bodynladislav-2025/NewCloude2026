import { Info } from 'lucide-react'
import Seo, { faqSchema } from '../components/Seo'
import SubsidyCalc from '../components/SubsidyCalc'
import { Button, Card, CheckList, Faq, Placeholder, Reveal, Section, SectionHead, SplitHeadline } from '../components/ui'
import { FinalCta, PageHero } from '../components/blocks'
import { FAQ_DOTACE } from '../content'

const STEPS = [
  ['Ověření', '2 dny', 'Pošlete IČO a počet účastníků. Projdeme s vámi podmínky a spočítáme příspěvek.'],
  ['Žádost', 'podáváte vy', 'Online v aplikaci Úřadu práce, klidně s dotačním poradcem. Dodáme osnovu, harmonogram a podklady ke kurzu.'],
  ['Schválení', 'obvykle do 30 dní', 'Úřad s vámi uzavře dohodu o příspěvku. Teprve potom smí výuka začít.'],
  ['Program', '9 dní', 'Vedeme prezenční listiny a vystavíme osvědčení.'],
  ['Proplacení', 'po skončení', 'Doložíte docházku a příspěvek přijde na účet.'],
]

export default function Dotace() {
  return (
    <>
      <Seo title="Dotace na AI školení zaměstnanců · Boostia" path="/dotace"
        description="Úřad práce vrací 478,19 Kč za hodinu výuky a účastníka. Od 9 lidí pokryje celou cenu programu. Nárok vám ověříme do 2 pracovních dnů." schema={[faqSchema(FAQ_DOTACE)]} />
      <PageHero badge="Dotace"
        parts={<SplitHeadline className="max-w-[20ch] text-[clamp(2.2rem,5.4vw,4rem)]" parts={[{ t: 'Školení obchodního týmu vám ' }, { t: 'proplatí Úřad práce', hl: true }, { t: '. Od 9 lidí celé.' }]} />}
        sub="Úřad práce vrací 478,19 Kč za každou hodinu výuky a účastníka. Náš program má 50 hodin, tedy až 23 909 Kč na člověka. Když žádost neschválí, neplatíte nic.">
        <Button href="#kalkulacka" ctaId="dotace_hero" section="hero">Spočítat a ověřit nárok</Button>
      </PageHero>

      <Section tight>
        <SectionHead title="Kolik to dělá">
          <p>Program stojí 197 000 Kč bez DPH pro tým až 15 lidí. Příspěvek je 478,19 Kč za hodinu výuky a účastníka. Posuňte počet lidí a uvidíte, kolik doplatíte.</p>
        </SectionHead>
        <div className="mx-auto max-w-[640px]"><SubsidyCalc /></div>
      </Section>

      <Section tight className="border-y border-line bg-surface/40">
        <SectionHead title="Jak to probíhá" />
        <Reveal as="ol" className="grid gap-4 md:grid-cols-2 lg:grid-cols-5" stagger={0.06}>
          {STEPS.map(([h, meta, t], i) => (
            <li key={h} className="rounded-[14px] border border-line bg-surface p-5">
              <div className="flex items-baseline justify-between"><span className="num text-[13px] text-muted">0{i + 1}</span><span className="num text-[13px] text-accent">{meta}</span></div>
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
              <CheckList className="mt-5 text-muted" items={['Výuka smí začít až po účinnosti dohody s Úřadem práce.', 'Program předfinancujete, příspěvek přijde po skončení a doložení docházky.', 'Každý účastník musí odchodit aspoň 80 % výuky. Příspěvek se počítá z odseděných hodin.', 'Příspěvek není nárokový a nepokrývá DPH ani licence AI nástrojů.', 'Účastníci musí být v pracovním poměru (ne DPP, DPČ).']} />
            </Card>
          </Reveal>
          <Reveal>
            <Card className="h-full">
              <h2 className="text-[26px]">Když dotace nevyjde</h2>
              <p className="mt-4 text-muted">Neplatíte nám nic. Smlouva s námi začne platit až ve chvíli, kdy začne platit vaše dohoda s Úřadem práce.</p>
              <h3 className="mt-8 text-[20px]">Co uděláme my a co vy</h3>
              <p className="mt-2 text-muted">Žádost podáváte vy. Podle pravidel projektu ji nesmí připravovat dodavatel kurzu. My dodáme podklady ke kurzu, projdeme s vámi podmínky a vedeme docházku.</p>
            </Card>
          </Reveal>
        </div>
      </Section>

      <Section tight className="border-t border-line bg-surface/40">
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]"><SectionHead title="Časté otázky k dotaci"><p>Podmínky podle projektu Vzdělávání pro firmy, reg. č. CZ.03.01.03/00/23_048/0006351.</p></SectionHead><Faq items={FAQ_DOTACE} id="faq-dotace" /></div>
      </Section>
      <FinalCta />
    </>
  )
}
