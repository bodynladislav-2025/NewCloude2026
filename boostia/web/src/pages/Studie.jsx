import Seo from '../components/Seo'
import { Card, Reveal, Section, SplitHeadline } from '../components/ui'
import { FinalCta, FoundingBanner, PageHero } from '../components/blocks'
import { PRICE } from '../content'

// Případové studie: doplňte objekty do pole, sekce se pak sama zobrazí. Nic nevymýšlejte.
// { industry, team, quote, author, notWorked, metrics: [{ label, before, after }] }
export const CASE_STUDIES = []

function CaseStudyCard({ c }) {
  return (
    <Card>
      <p className="font-mono text-[12px] uppercase tracking-wider text-muted">{c.industry} · tým {c.team} lidí</p>
      <dl className="mt-5 space-y-3">
        {c.metrics.map((m) => (
          <div key={m.label} className="grid grid-cols-[1fr_auto_auto] items-baseline gap-4 border-b border-line pb-3"><dt className="text-muted">{m.label}</dt><dd className="num text-warn line-through">{m.before}</dd><dd className="num text-accent">{m.after}</dd></div>
        ))}
      </dl>
      {c.quote && <blockquote className="mt-6 text-[19px]">„{c.quote}“<footer className="mt-2 text-[14px] text-muted">{c.author}</footer></blockquote>}
      {c.notWorked && <p className="mt-5 text-[15px] text-muted"><strong className="text-ink">Co nefungovalo:</strong> {c.notWorked}</p>}
    </Card>
  )
}

export default function Studie() {
  return (
    <>
      <Seo title="Výsledky AI tréninku obchodních týmů · Boostia" path="/pripadove-studie"
        description="Změřené výsledky týmů po osmi týdnech: čas na přípravu schůzky, zápis a nabídku před a po." />
      <PageHero badge="Případové studie"
        parts={<SplitHeadline className="max-w-[16ch] text-[clamp(2.2rem,5.4vw,4rem)]" parts={[{ t: 'Výsledky, které jsme ' }, { t: 'změřili', hl: true }]} />}
        sub="U každého týmu uvádíme výchozí stav, výsledek po osmi týdnech a jak jsme měřili." />
      <Section tight>
        {CASE_STUDIES.length > 0
          ? <Reveal className="grid gap-4 lg:grid-cols-2">{CASE_STUDIES.map((c, i) => <CaseStudyCard key={i} c={c} />)}</Reveal>
          : (
            <>
              <FoundingBanner />
              <Reveal className="mt-4 grid gap-4 md:grid-cols-3">
                <Card><h3 className="text-[21px]">Metodika měření</h3><p className="mt-3 text-muted">Pět činností, stopky, každý účastník, první a osmý týden. Můžete si ji projít předem.</p></Card>
                <Card><h3 className="text-[21px]">Bez rizika</h3><p className="mt-3 text-muted">První den na naše riziko. Bez schválené dotace neplatíte. Když tým AI nepoužívá, doučíme zdarma.</p></Card>
                <Card><h3 className="text-[21px]">Jedna cena</h3><p className="mt-3 text-muted">{PRICE.program} pro celý tým. Při 16 účastnících ji pokryje dotace Úřadu práce.</p></Card>
              </Reveal>
            </>
          )}
      </Section>
      <FinalCta />
    </>
  )
}
