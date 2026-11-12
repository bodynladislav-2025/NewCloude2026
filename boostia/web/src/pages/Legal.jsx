import { Container, SHOW_PLACEHOLDERS } from '../components/ui'

export default function Legal({ title, children }) {
  return (
    <section className="bg-surface pb-24 pt-[130px]">
      <Container className="max-w-[780px]">
        {SHOW_PLACEHOLDERS && <p className="mb-6 rounded-md border border-dashed border-warn/70 bg-warn/5 px-4 py-2 font-mono text-[12px] uppercase tracking-wider text-warn">Návrh k právní kontrole. Před spuštěním nechte ověřit právníkem a doplňte údaje.</p>}
        <h1 className="text-[clamp(2rem,4.6vw,3rem)]">{title}</h1>
        <div className="prose-legal mt-8">{children}</div>
      </Container>
    </section>
  )
}
