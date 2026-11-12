import Seo from '../components/Seo'
import { Button, Container } from '../components/ui'

export default function NotFound() {
  return (
    <section className="flex min-h-[80svh] items-center pt-[120px]">
      <Seo title="Stránka nenalezena · Boostia" noindex description="Tahle stránka neexistuje." />
      <Container>
        <p className="num text-accent">404</p>
        <h1 className="mt-3 text-[clamp(2.2rem,5.4vw,4rem)]">Tahle stránka neexistuje</h1>
        <p className="mt-4 text-muted">Možná se přesunula. Zkuste to z úvodní stránky.</p>
        <div className="mt-8"><Button to="/">Na úvodní stránku</Button></div>
      </Container>
    </section>
  )
}
