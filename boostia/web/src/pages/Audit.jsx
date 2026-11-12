import Seo, { faqSchema } from '../components/Seo'
import { AuditForm, VslFacade } from '../components/Forms'
import { Badge, Button, Card, CheckList, Container, Faq, Placeholder, Section, SplitHeadline } from '../components/ui'
import { FAQ_AUDIT } from '../content'

export default function Audit() {
  return (
    <>
      <Seo title="Bezplatný audit: kolik času ztrácí váš obchod · Boostia" path="/audit"
        description="Za 30 minut spočítáme, kolik hodin a korun váš obchodní tým týdně ztrácí neprodejní prací. Zdarma a bez závazku." schema={[faqSchema(FAQ_AUDIT)]} />
      <section className="pb-16 pt-[110px] lg:pb-24 lg:pt-[140px]">
        <Container className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div>
            <Badge>Bezplatný 30minutový audit</Badge>
            <SplitHeadline className="mt-6 text-[clamp(2rem,4.4vw,3.3rem)]" parts={[{ t: 'Kolik času vaši obchodníci ztrácí neproduktivní prací? Za 30 minut to budete vědět ' }, { t: 'v hodinách i korunách', hl: true }, { t: '.' }]} />
            <p className="mt-5 text-[18px] text-muted">Projdeme, jak váš tým připravuje schůzky, píše zápisy a skládá nabídky. Spočítáme, kolik z toho zvládne AI. Odnesete si číslo a tři konkrétní kroky.</p>
            <div className="mt-8"><VslFacade url={import.meta.env.VITE_VSL_URL} title="Jak audit probíhá a co si odnesete" /></div>
            <div className="mt-5 lg:hidden"><Button href="#formular" ctaId="audit_scroll_form" section="vsl" className="w-full">Vybrat termín auditu</Button></div>

            <h2 className="mt-12 text-[26px]">Co dostanete</h2>
            <CheckList className="mt-5" items={['Výpočet ztraceného času vašeho týmu v hodinách týdně a Kč ročně', 'Tři kroky, které můžete udělat hned, i bez nás', 'Ověření, jestli máte nárok na dotaci', 'Jednostránkový report do 24 hodin']} />

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <Card><h3 className="text-[19px]">Pro koho to je</h3><p className="mt-2 text-[15px] text-muted">Firmy se 4 a více obchodníky. Jednatelé, obchodní ředitelé, HR.</p></Card>
              <Card><h3 className="text-[19px]">Pro koho ne</h3><p className="mt-2 text-[15px] text-muted">Jednotlivci a týmy do 3 lidí. Pro vás máme <a className="underline" href="/materialy/25-promptu-pro-obchodnika.pdf">25 promptů zdarma</a>.</p></Card>
            </div>

            <Card className="mt-4">
              <h3 className="text-[19px]">Kdo audit vede</h3>
              <p className="mt-2 text-[15px] text-muted"><Placeholder>jméno</Placeholder>17 let v obchodě, vedl týmy až 80 obchodníků. Nebude vám nic prezentovat. Bude se ptát a počítat.</p>
            </Card>
          </div>

          <div className="lg:sticky lg:top-[92px] lg:self-start">
            <AuditForm />
          </div>
        </Container>
      </section>
      <Section tight className="border-t border-line">
        <div className="mx-auto max-w-[820px]"><h2 className="mb-8 text-[30px]">Časté otázky</h2><Faq items={FAQ_AUDIT} id="faq-audit" /></div>
      </Section>
    </>
  )
}
