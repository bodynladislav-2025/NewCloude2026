import { useSearchParams } from 'react-router-dom'
import Seo from '../components/Seo'
import { ContactForm } from '../components/Forms'
import { Button, Card, Container, Placeholder, SplitHeadline } from '../components/ui'

export default function Kontakt() {
  const [p] = useSearchParams()
  const preset = p.get('tema') === 'mapa' ? 'Mám zájem o Mapu automatizace.' : ''
  return (
    <>
      <Seo title="Kontakt · Boostia" path="/kontakt" description="Napište nebo zavolejte. Odpovídáme do jednoho pracovního dne." />
      <section className="pb-24 pt-[140px] lg:pt-[180px]">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <SplitHeadline className="text-[clamp(2.2rem,5.4vw,4rem)]" parts={[{ t: 'Napište nebo ' }, { t: 'zavolejte', hl: true }]} />
            <p className="mt-5 text-[19px] text-muted">Odpovídáme do jednoho pracovního dne.</p>
            <dl className="mt-10 space-y-4">
              {['E-mail', 'Telefon', 'Adresa a fakturační údaje', 'LinkedIn'].map((l) => (
                <div key={l} className="flex flex-wrap items-baseline gap-3 border-b border-line pb-4"><dt className="w-[220px] text-muted">{l}</dt><dd><Placeholder /></dd></div>
              ))}
            </dl>
            <Card className="mt-10">
              <h2 className="text-[22px]">Chcete rovnou číslo?</h2>
              <p className="mt-2 text-muted">Rezervujte si 30minutový audit zdarma. Spočítáme, kolik času váš obchod ztrácí.</p>
              <div className="mt-5"><Button to="/audit" ctaId="kontakt_audit" section="kontakt">Rezervovat audit zdarma</Button></div>
            </Card>
          </div>
          <ContactForm presetMessage={preset} />
        </Container>
      </section>
    </>
  )
}
