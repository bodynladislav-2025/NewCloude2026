import Seo from '../components/Seo'
import { Button, Card, Container, SplitHeadline } from '../components/ui'

export default function DekujemePrompty() {
  return (
    <>
      <Seo title="Díky · Boostia" path="/dekujeme-prompty" noindex description="Posíláme 25 promptů pro obchodníka." />
      <section className="flex min-h-[80svh] items-center pb-20 pt-[120px]">
        <Container className="max-w-[760px]">
          <SplitHeadline className="text-[clamp(2rem,4.6vw,3.3rem)]" parts={[{ t: 'Díky. Pro váš tým máme ' }, { t: 'něco lepšího než audit', hl: true }, { t: '.' }]} />
          <p className="mt-5 text-[18px] text-muted">Program je stavěný pro týmy od 4 obchodníků, audit by vám teď moc neřekl. Posíláme vám 25 promptů pro obchodníka a jednou za 14 dní tip, jak s AI ušetřit čas. Až tým poroste, ozvěte se.</p>
          <Card className="mt-8">
            <h2 className="text-[22px]">25 promptů pro obchodníka</h2>
            <p className="mt-2 text-muted">Příprava na schůzku, zápis, nabídka, námitky, prospecting, stávající klienti. Začněte číslem 3.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button href="/materialy/25-promptu-pro-obchodnika.pdf" ctaId="nq_prompts" section="dekujeme" arrow={false}>Stáhnout prompty (PDF)</Button>
              <Button href="/materialy/semafor-co-do-ai-smi.pdf" variant="secondary" arrow={false}>Semafor: co do AI smí</Button>
            </div>
          </Card>
          <p className="mt-6"><Button to="/#kalkulacka" variant="ghost">Spočítat si ztracený čas v kalkulačce</Button></p>
        </Container>
      </section>
    </>
  )
}
