import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Seo from '../components/Seo'
import { InviteForm, PrepForm, VslFacade } from '../components/Forms'
import { Button, Card, Container, SplitHeadline } from '../components/ui'
import { track } from '../lib/tracking'

function icsHref(start) {
  const d = new Date(start); if (isNaN(d)) return null
  const f = (x) => x.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const end = new Date(d.getTime() + 30 * 60000)
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT', `DTSTART:${f(d)}`, `DTEND:${f(end)}`, 'SUMMARY:Boostia: audit ztraceného času (30 min)', 'DESCRIPTION:Odkaz na Google Meet máte v potvrzovacím e-mailu.', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n')
  return 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics)
}

export default function Dekujeme() {
  const [p] = useSearchParams()
  const name = p.get('name') || p.get('first_name')
  const date = p.get('date'), time = p.get('time'), start = p.get('start'), email = p.get('email') || ''
  useEffect(() => { track('calendar_booked', { route: p.get('route') || 'audit' }) }, []) // eslint-disable-line react-hooks/exhaustive-deps
  const ics = start ? icsHref(start) : null
  const gcal = start && !isNaN(new Date(start)) ? (() => { const d = new Date(start), e = new Date(d.getTime() + 30 * 60000), f = (x) => x.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'; return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Boostia: audit ztraceného času')}&dates=${f(d)}/${f(e)}` })() : null

  return (
    <>
      <Seo title="Audit je potvrzený · Boostia" path="/dekujeme" noindex description="Váš audit je potvrzený. Tady je, jak se připravit." />
      <section className="pb-20 pt-[120px]">
        <Container className="max-w-[860px]">
          <SplitHeadline className="text-[clamp(2rem,4.6vw,3.3rem)]" parts={[{ t: name ? `${name}, máte to v kalendáři. ` : 'Máte to v kalendáři. ' }, { t: 'Tady je, jak z těch 30 minut dostat maximum.', hl: true }]} />
          <p className="mt-5 text-[18px] text-muted">{date && time ? <>Audit proběhne <span className="text-ink">{date} v {time}</span> přes Google Meet. </> : 'Audit proběhne přes Google Meet. '}Odkaz máte v e-mailu i v SMS.</p>

          <div className="mt-8"><VslFacade url={import.meta.env.VITE_TY_VIDEO_URL} title="Co vás na auditu čeká" length="90 s" eventPrefix="ty_video" /></div>

          <ol className="mt-10 space-y-4">
            <li><Card>
              <p className="num text-[13px] text-accent">01</p>
              <h2 className="mt-2 text-[22px]">Přidejte si termín do kalendáře</h2>
              {gcal ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button href={gcal} variant="secondary" arrow={false}>Google kalendář</Button>
                  <Button href={ics} variant="secondary" arrow={false}>Outlook / Apple (.ics)</Button>
                </div>
              ) : <p className="mt-2 text-muted">Pozvánku s odkazem jsme vám poslali e-mailem. Stačí ji přijmout.</p>}
            </Card></li>
            <li><Card>
              <p className="num text-[13px] text-accent">02</p>
              <h2 className="mt-2 text-[22px]">Vyplňte 3minutovou přípravu</h2>
              <p className="mb-5 mt-2 text-muted">Zeptejte se dvou obchodníků. Stačí odhad. Díky tomu bude výsledné číslo sedět.</p>
              <PrepForm email={email} />
            </Card></li>
            <li><Card>
              <p className="num text-[13px] text-accent">03</p>
              <h2 className="mt-2 text-[22px]">Pozvěte kolegu, který o tom rozhoduje s vámi</h2>
              <p className="mb-4 mt-2 text-muted">Ušetříte si jedno kolo.</p>
              <InviteForm email={email} />
            </Card></li>
          </ol>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Card><h2 className="text-[20px]">Co čekat</h2><ul className="mt-3 space-y-2 text-muted"><li><span className="num text-ink">5 min</span> · jak dnes váš obchod pracuje</li><li><span className="num text-ink">15 min</span> · počítáme ztracený čas a peníze</li><li><span className="num text-ink">10 min</span> · co s tím, s námi nebo bez nás</li></ul></Card>
            <Card><h2 className="text-[20px]">Co nečekat</h2><ul className="mt-3 space-y-2 text-muted"><li>Prezentaci o tom, co je umělá inteligence.</li><li>Tlak na podpis.</li></ul></Card>
          </div>

          <Card className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <div><h2 className="text-[20px]">Mezitím: 25 promptů pro obchodníka</h2><p className="mt-1 text-muted">Stáhněte si je a zkuste první ještě dnes.</p></div>
            <Button href="/materialy/25-promptu-pro-obchodnika.pdf" ctaId="ty_prompts" section="dekujeme" arrow={false}>Stáhnout PDF</Button>
          </Card>
        </Container>
      </section>
    </>
  )
}
