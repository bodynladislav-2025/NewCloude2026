import { BookOpen, FileText, Inbox, Mic, Sparkles, Users } from 'lucide-react'
import Seo, { faqSchema } from '../components/Seo'
import { Button, Card, CheckList, Faq, NumberTicker, Placeholder, Reveal, Section, SectionHead, SplitHeadline } from '../components/ui'
import { FinalCta, PageHero } from '../components/blocks'
import { FAQ_AGENTI, PRICE } from '../content'

const AGENTS = [
  [Inbox, 'Agent Poptávka', 'Roztřídí příchozí poptávky, doplní údaje o firmě, navrhne odpověď. Obchodník jen schvaluje.', ['e-mail, formulář', 'odpověď ke schválení']],
  [FileText, 'Agent Nabídka', 'Z poptávky a ceníku složí nabídku ve vaší šabloně.', ['poptávka + ceník', 'nabídka ke schválení']],
  [Mic, 'Agent Zápis', 'Z nahrávky schůzky udělá zápis, úkoly a vyplní CRM.', ['nahrávka', 'zápis + pole v CRM']],
  [Users, 'Agent Portfolio', 'Každé pondělí pošle obchodníkům seznam klientů, kteří mohou kupovat víc, s důvodem a návrhem oslovení.', ['data z CRM', 'seznam příležitostí']],
  [BookOpen, 'Agent Znalosti', 'Odpovídá obchodníkům z ceníků, technických listů a smluv. S odkazem na zdroj.', ['interní dokumenty', 'odpověď se zdrojem']],
  [Sparkles, 'Něco jiného?', 'Na Mapě automatizace najdeme proces, kde se to vyplatí nejvíc.', ['váš proces', 'návrh s návratností']],
]
const STEPS = [
  ['Mapa automatizace', '2 týdny · ' + PRICE.map, 'Projdeme tři procesy, spočítáme objem a návratnost, navrhneme řešení s pevnou cenou. Když nenajdeme proces s návratností do 12 měsíců, peníze vrátíme. Když půjdete do stavby, částku odečteme.'],
  ['Pilot', 'do 3 týdnů', 'První verze na vašich skutečných datech.'],
  ['Ostrý provoz', 'do 6–8 týdnů', 'Napojení, testy, zaškolení lidí.'],
  ['Ladění a provoz', '60 dní v ceně', 'Potom Boostia Provoz od ' + PRICE.provoz + ' měsíčně, nebo předání vašemu IT.'],
]

export default function Agenti() {
  return (
    <>
      <Seo title="AI agenti a automatizace obchodu na míru · Boostia" path="/ai-agenti"
        description="Navrhneme, postavíme a provozujeme AI agenty napojené na vaše CRM. Pevná cena a návratnost předem, platba po milnících."
        schema={[{ '@context': 'https://schema.org', '@type': 'Service', name: 'AI Agent na klíč', provider: { '@type': 'Organization', name: 'Boostia' }, areaServed: 'CZ', serviceType: 'Implementace AI agentů a automatizací' }, faqSchema(FAQ_AGENTI)]} />
      <PageHero badge="AI agenti a automatizace"
        parts={<SplitHeadline className="max-w-[20ch] text-[clamp(2.2rem,5.4vw,4rem)]" parts={[{ t: 'AI agenti, kteří za váš obchod ' }, { t: 'udělají rutinu', hl: true }, { t: '. Na míru, napojení na vaše systémy.' }]} />}
        sub="Poptávka přijde v noci, ráno má obchodník v CRM připravenou nabídku ke schválení. Navrhneme, postavíme a provozujeme. Jednáte jen s námi.">
        <Button to="/kontakt?tema=mapa" ctaId="agenti_hero_mapa" section="hero">Chci Mapu automatizace</Button>
        <Button to="/audit" variant="secondary" ctaId="agenti_hero_audit" section="hero" arrow={false}>Probrat to na auditu</Button>
      </PageHero>

      <Section tight>
        <SectionHead title="Tohle není „naučíme vás ChatGPT“">
          <p>Agent je systém, který sám provede sérii kroků: přečte e-mail, dohledá klienta v CRM, sáhne do ceníku, připraví dokument a pošle ho člověku ke schválení. Běží na pozadí, má pravidla, záznamy a někoho, kdo za něj odpovídá.</p>
        </SectionHead>
      </Section>

      <Section tight className="border-y border-line bg-surface/40">
        <SectionHead title="Co obvykle stavíme" />
        <Reveal className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
          {AGENTS.map(([I, h, t, flow]) => (
            <Card key={h} spotlight className="flex flex-col">
              <I size={24} className="text-accent" aria-hidden="true" />
              <h3 className="mt-5 text-[22px]">{h}</h3>
              <p className="mt-3 flex-1 text-muted">{t}</p>
              <p className="mt-6 flex items-center gap-2 border-t border-line pt-4 num text-[12px] text-muted"><span>{flow[0]}</span><span className="h-px flex-1 bg-flow/50" aria-hidden="true" /><span className="text-accent">{flow[1]}</span></p>
            </Card>
          ))}
        </Reveal>
      </Section>

      <Section>
        <SectionHead title="Jak postupujeme" />
        <Reveal as="ol" className="relative space-y-4 border-l border-line pl-8">
          {STEPS.map(([h, meta, t], i) => (
            <li key={h} className="relative">
              <span className="absolute -left-[49px] flex h-8 w-8 items-center justify-center rounded-full border border-accent bg-bg num text-[13px] text-accent">{i + 1}</span>
              <Card><div className="flex flex-wrap items-baseline justify-between gap-2"><h3 className="text-[22px]">{h}</h3><span className="num text-[14px] text-accent">{meta}</span></div><p className="mt-3 max-w-[70ch] text-muted">{t}</p></Card>
            </li>
          ))}
        </Reveal>
      </Section>

      <Section tight className="border-y border-line bg-surface/40">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHead title="Cena">
              <p>První agent obvykle 240 000–450 000 Kč podle rozsahu a počtu napojených systémů. Jednodušší od 180 000 Kč. Pevnou cenu znáte z Mapy dřív, než cokoli podepíšete.</p>
            </SectionHead>
          </div>
          <div>
            <h3 className="text-[26px]">Platíte po milnících</h3>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[[40, 'při startu'], [40, 'po předvedení na vašich datech'], [20, 'po akceptaci']].map(([n, l], i) => (
                <div key={i} className="rounded-[14px] border border-line bg-surface p-5"><p className="text-[34px] font-medium leading-none text-accent"><NumberTicker value={n} suffix=" %" /></p><p className="mt-3 text-[13px] leading-snug text-muted">{l}</p></div>
              ))}
            </div>
            <p className="mt-5 text-muted">Kritéria přijetí sepíšeme předem. Když je nesplníme, vracíme vše zaplacené za stavbu.</p>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <SectionHead title="Bezpečnost" />
          <Reveal>
            <CheckList items={['Popíšeme, kudy data tečou a kde jsou uložená.', 'Zpracovatelská smlouva a dohoda o mlčenlivosti.', 'Záznamy o každém kroku agenta.', 'Agent nikdy neodesílá nic klientovi bez schválení člověkem, dokud to sami nepovolíte.', 'Dokumentace a přístupy jsou vaše.']} />
            <Placeholder kind="PROOF" block>první realizovaný agent: proces, objem, ušetřené hodiny, doba návratnosti</Placeholder>
          </Reveal>
        </div>
      </Section>

      <Section tight>
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]"><SectionHead title="Časté otázky" /><Faq items={FAQ_AGENTI} id="faq-agenti" /></div>
      </Section>
      <FinalCta title="Najděte proces, který se vyplatí automatizovat" text="Mapa automatizace za dva týdny ukáže, kde je návratnost a kolik to bude stát. Když návratnost nevyjde, peníze vrátíme." cta="Chci Mapu automatizace" to="/kontakt?tema=mapa" id="agenti_final" />
    </>
  )
}
