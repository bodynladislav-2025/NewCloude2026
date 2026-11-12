import { Timer } from 'lucide-react'
import Seo from '../components/Seo'
import DayScrolly from '../components/DayScrolly'
import { Card, CheckList, Container, Placeholder, Reveal, Section, SectionHead, SplitHeadline } from '../components/ui'
import { FinalCta, PageHero } from '../components/blocks'
import { WEEKS } from '../content'

export default function JakToFunguje() {
  return (
    <>
      <Seo title="Jak probíhá program AI Obchod 50 · Boostia" path="/jak-to-funguje"
        description="Týden po týdnu: měření, šest tréninkových dní na vašich zakázkách a závěrečný report úspor v hodinách a korunách." />
      <PageHero badge="Jak to funguje"
        parts={<SplitHeadline className="max-w-[16ch] text-[clamp(2.2rem,5.4vw,4rem)]" parts={[{ t: 'Osm týdnů ' }, { t: 'od stopek ke stopkám', hl: true }]} />}
        sub="Přesně víte, co se děje který týden, co potřebujeme od vás a co vám zůstane." />

      <section className="border-y border-line bg-surface/40">
        <Container className="pt-16 lg:pt-24">
          <SectionHead badge="Úterý obchodníka" title="Jeden den, dvakrát. Bez AI a s AI." />
        </Container>
        <Container className="pb-16 lg:pb-0"><DayScrolly /></Container>
        <Container className="pb-16 lg:pb-24">
          <Card className="text-center">
            <p className="text-muted">Součet za týden</p>
            <p className="mt-2 font-display text-[clamp(2rem,5vw,3.2rem)] font-semibold text-accent">12 hodin měsíčně navíc na prodej</p>
            <p className="mt-2 text-muted">Cíl programu na jednoho obchodníka. Vaše číslo změříme.<Placeholder kind="PROOF">průměr z pilotu</Placeholder></p>
          </Card>
        </Container>
      </section>

      <Section>
        <SectionHead title="Týden po týdnu" />
        <Reveal className="space-y-3" stagger={0.05}>
          {WEEKS.map(([w, format, content, out]) => (
            <div key={w} className="grid gap-3 rounded-[14px] border border-line bg-surface p-5 md:grid-cols-[90px_170px_1fr_1fr] md:items-center md:gap-6">
              <p className="num text-[14px] text-accent">Týden {w}</p>
              <p className="num text-[14px] text-muted">{format}</p>
              <p className="font-medium">{content}</p>
              <p className="text-[15px] text-muted"><span className="md:hidden">Zůstane vám: </span>{out}</p>
            </div>
          ))}
        </Reveal>
      </Section>

      <Section tight className="border-y border-line bg-surface/40">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHead title="Co potřebujeme od vás" />
            <Reveal><CheckList items={['Místnost a projektor', 'Účast obchodního ředitele první a poslední den', 'Pět vašich nejlepších nabídek a export z CRM', 'Hodinu týdně na úkol mezi setkáními', 'Jednoho AI šampiona z týmu']} /></Reveal>
          </div>
          <div>
            <SectionHead title="Co vám zůstane" />
            <Reveal><CheckList items={['Report úspor v hodinách a Kč', 'Playbook AI obchodu vaší firmy', '4 týmoví asistenti nastavení na vaše podklady', 'AI směrnice a semafor dat', 'Osvědčení pro každého účastníka', 'Kontrolní měření po 60 dnech']} /></Reveal>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <SectionHead badge="Měření" title="Jak měříme">
            <p>Pět činností, stopky, každý účastník, první a osmý týden. Průměr za tým, ne nejlepší jednotlivec. Metodiku pošleme předem.</p>
            <p><a className="underline decoration-line underline-offset-4 hover:decoration-accent" href="/materialy/metodika-mereni.pdf">Stáhnout metodiku měření (PDF)</a></p>
          </SectionHead>
          <Reveal>
            <Card>
              <Timer size={26} className="text-accent" aria-hidden="true" />
              <ol className="mt-5 space-y-3">
                {['Příprava na jednu schůzku', 'Zápis ze schůzky a CRM', 'Follow-up e-mail', 'Jedna nabídka', 'Dohledání informace o klientovi'].map((t, i) => (
                  <li key={t} className="flex items-center gap-4 border-b border-line pb-3 last:border-0 last:pb-0"><span className="num text-[13px] text-muted">0{i + 1}</span>{t}</li>
                ))}
              </ol>
            </Card>
          </Reveal>
        </div>
      </Section>
      <FinalCta />
    </>
  )
}
