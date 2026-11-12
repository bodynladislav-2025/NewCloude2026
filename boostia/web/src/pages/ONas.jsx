import Seo, { ORG } from '../components/Seo'
import { Card, Placeholder, Reveal, Section, SectionHead, SplitHeadline } from '../components/ui'
import { FinalCta, PageHero } from '../components/blocks'

export default function ONas() {
  return (
    <>
      <Seo title="O nás: školicí a technologická firma pro obchod · Boostia" path="/o-nas"
        description="Učíme obchodníky pracovat s AI a stavíme systémy, které jim berou rutinu. Vedeno lidmi, kteří obchod sami řídili." schema={[ORG]} />
      <PageHero badge="O nás"
        parts={<SplitHeadline className="max-w-[18ch] text-[clamp(2.2rem,5.4vw,4rem)]" parts={[{ t: 'Školicí a technologická firma ' }, { t: 'pro obchodní týmy', hl: true }]} />}
        sub="Učíme obchodníky pracovat s AI a stavíme systémy, které jim berou rutinu." />

      <Section tight>
        <Reveal className="max-w-[900px]">
          <p className="font-mono text-[12px] uppercase tracking-wider text-muted">Proč Boostia vznikla</p>
          <p className="mt-5 font-display text-[clamp(1.5rem,3vw,2.3rem)] font-semibold leading-[1.25]">Obchod se dvacet let zrychloval nákupem softwaru. Výsledek: obchodníci obsluhují systémy místo klientů.</p>
          <p className="mt-6 text-[19px] text-muted">AI to umí obrátit, jenže většina školení končí u ukázky nástroje. My jsme chtěli program, po kterém se dá výsledek změřit.</p>
        </Reveal>
      </Section>

      <Section tight className="border-y border-line bg-surface/40">
        <SectionHead title="Jak pracujeme" />
        <Reveal className="grid gap-4 md:grid-cols-2">
          {[['Měříme, co slibujeme', 'Stopky na začátku a na konci.'], ['Učíme na skutečné práci', 'Vaše nabídky, vaši klienti.'], ['Říkáme, když se to nevyplatí', 'Tým tří lidí program nepotřebuje. Řekneme to na auditu.'], ['Bezpečnost napřed', 'Pravidla pro data jsou první den, ne poslední.']].map(([h, t], i) => (
            <Card key={h}><p className="num text-[13px] text-accent">0{i + 1}</p><h3 className="mt-4 text-[24px]">{h}</h3><p className="mt-2 text-muted">{t}</p></Card>
          ))}
        </Reveal>
      </Section>

      <Section>
        <SectionHead title="Tým" />
        <Reveal className="grid gap-4 lg:grid-cols-3">
          <Card>
            <div className="flex aspect-[4/3] items-center justify-center rounded-[10px] border border-dashed border-line bg-bg text-[13px] text-muted">Fotografie ze školení</div>
            <h3 className="mt-5 text-[22px]"><Placeholder>jméno</Placeholder></h3>
            <p className="text-[15px] text-accent">Vedoucí lektor a zakladatel</p>
            <p className="mt-3 text-muted">17 let v obchodě, vedl týmy od 5 do 80 obchodníků, CSO ve firmách s obratem přes 400 mil. Kč. Certifikovaný kouč a lektor.</p>
          </Card>
          <Card>
            <div className="flex aspect-[4/3] items-center justify-center rounded-[10px] border border-dashed border-line bg-bg text-[13px] text-muted">Vývojový tým</div>
            <h3 className="mt-5 text-[22px]">Vývojový tým</h3>
            <p className="text-[15px] text-accent">AI agenti a automatizace</p>
            <p className="mt-3 text-muted">Staví a provozuje AI agenty napojené na CRM, e-mail a firemní systémy.</p>
            <Placeholder block>jak technického partnera prezentovat (jméno, nebo jen role)</Placeholder>
          </Card>
          <Card>
            <div className="flex aspect-[4/3] items-center justify-center rounded-[10px] border border-dashed border-line bg-bg text-[13px] text-muted">Druhý lektor</div>
            <h3 className="mt-5 text-[22px]">Lektorský tým</h3>
            <p className="text-[15px] text-accent">Rozšiřujeme</p>
            <p className="mt-3 text-muted">Každý lektor Boostie má za sebou praxi ve vedení obchodu a prochází stejnou metodikou a měřením.</p>
            <Placeholder block>druhý lektor (od 2. pololetí)</Placeholder>
          </Card>
        </Reveal>
        <p className="mt-10 text-muted">Boostia s.r.o.<Placeholder>IČO, sídlo, rok založení</Placeholder></p>
      </Section>
      <FinalCta />
    </>
  )
}
