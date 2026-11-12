import { useEffect, useState } from 'react'
import { Check, Download, FileText } from 'lucide-react'
import Seo from '../components/Seo'
import { Button, Card, Container, Reveal, Section, SectionHead, SplitHeadline } from '../components/ui'
import { FinalCta, PageHero } from '../components/blocks'
import { submitLead } from '../lib/leadconnector'
import { track } from '../lib/tracking'

export const MATERIALS = {
  hr: [
    { id: 'hr-vyber', file: 'hr-jak-vybrat-ai-skoleni.pdf', title: 'Jak vybrat AI školení, které obhájíte', pages: 3, type: 'Průvodce',
      text: 'Dvanáct otázek na dodavatele, srovnávací tabulka pro tři nabídky a pět varovných signálů.' },
    { id: 'hr-dotace', file: 'hr-dotace-kontrolni-seznam.pdf', title: 'Dotace na AI školení: kontrolní seznam pro HR', pages: 3, type: 'Kontrolní seznam',
      text: 'Co si ověřit, jaké podklady připravit, postup krok za krokem a nejčastější chyby.' },
    { id: 'hr-pravidla', file: 'hr-vzor-pravidla-ai-a-zaznam-o-proskoleni.pdf', title: 'Vzor pravidel používání AI a záznam o proškolení', pages: 3, type: 'Vzor k úpravě',
      text: 'Pravidla pro zaměstnance a formulář, kterým doložíte, že jste lidi proškolili.' },
    { id: 'hr-podklad', file: 'hr-podklad-pro-vedeni.pdf', title: 'Podklad pro vedení: proč investovat do AI školení', pages: 2, type: 'Šablona',
      text: 'Náklady, návratnost, měření výsledku a rizika. Doplníte čísla a máte s čím jít za jednatelem.' },
  ],
  sales: [
    { id: 'prompty', file: '25-promptu-pro-obchodnika.pdf', title: '25 promptů pro obchodníka', pages: 5, type: 'Sada promptů',
      text: 'Příprava na schůzku, zápis, nabídka, námitky, prospecting a stávající klienti. Ke zkopírování.' },
    { id: 'semafor', file: 'semafor-co-do-ai-smi.pdf', title: 'Semafor: co do AI smí a co ne', pages: 2, type: 'Přehled',
      text: 'Tři barvy, pět pravidel na jednu poradu a kontrolní otázky pro vedení.' },
    { id: 'metodika', file: 'metodika-mereni.pdf', title: 'Metodika měření: stopky, ne dotazník', pages: 2, type: 'Metodika',
      text: 'Jak přesně měříme ušetřený čas obchodního týmu před programem a po něm.' },
  ],
}

const KEY = 'boostia_materials_email'
const stored = () => { try { return localStorage.getItem(KEY) || '' } catch { return '' } }

function MaterialCard({ m, group, unlocked, onUnlock }) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [news, setNews] = useState(false)
  const [state, setState] = useState('idle')
  const href = `/materialy/${m.file}`

  const download = () => {
    const a = document.createElement('a'); a.href = href; a.download = m.file; a.target = '_blank'; a.rel = 'noopener'
    document.body.appendChild(a); a.click(); a.remove()
  }
  const send = async (e) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) return setState('error')
    setState('sending')
    await submitLead('material', { email, consentMarketing: news, material: m.id, materialTitle: m.title, audience: group })
    track('material_download', { material: m.id, audience: group, gated: true })
    onUnlock(email); setState('idle'); setOpen(false); download()
  }
  const again = () => {
    submitLead('material', { email: unlocked, material: m.id, materialTitle: m.title, audience: group, repeat: true })
    track('material_download', { material: m.id, audience: group, gated: false })
  }

  return (
    <Card spotlight tilt className="flex flex-col">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[12px] uppercase tracking-wider text-accent">{m.type}</span>
        <span className="flex items-center gap-1.5 num text-[12px] text-muted"><FileText size={14} aria-hidden="true" />PDF · {m.pages} {m.pages < 5 ? 'strany' : 'stran'}</span>
      </div>
      <h3 className="mt-5 text-[22px]">{m.title}</h3>
      <p className="mt-3 flex-1 text-muted">{m.text}</p>
      <div className="mt-6">
        {unlocked ? (
          <a href={href} download onClick={again} className="group inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-medium text-accentink transition-colors hover:brightness-110">
            <Download size={18} aria-hidden="true" /> Stáhnout PDF
          </a>
        ) : open ? (
          <form onSubmit={send} noValidate className="space-y-3">
            <label htmlFor={`m-${m.id}`} className="block text-[15px]">Kam vám ho máme poslat?</label>
            <input id={`m-${m.id}`} type="email" inputMode="email" autoComplete="email" autoFocus placeholder="vas@email.cz" value={email}
              onChange={(e) => { setEmail(e.target.value); if (state === 'error') setState('idle') }} aria-invalid={state === 'error'}
              className="min-h-[48px] w-full rounded-full border border-line bg-bg px-5 text-[16px] outline-none placeholder:text-muted/60 focus:border-accent aria-[invalid=true]:border-warn" />
            {state === 'error' && <p className="text-[14px] text-warn">Zkontrolujte prosím e-mail.</p>}
            <label className="flex items-start gap-2 text-[13px] text-muted"><input type="checkbox" checked={news} onChange={(e) => setNews(e.target.checked)} className="mt-1 h-4 w-4 accent-[var(--color-accent)]" /> Chci jednou za 14 dní praktický tip k AI ve firmě.</label>
            <Button type="submit" disabled={state === 'sending'} arrow={false} className="w-full">{state === 'sending' ? 'Odesílám…' : 'Stáhnout PDF'}</Button>
            <p className="text-[12px] text-muted">Stažení začne hned. E-mail zadáváte jen jednou, pak se odemknou všechny materiály.</p>
          </form>
        ) : (
          <Button onClick={() => { setOpen(true); track('material_open', { material: m.id, audience: group }) }} variant="secondary" arrow={false} className="w-full"><Download size={18} aria-hidden="true" />&nbsp;Stáhnout zdarma</Button>
        )}
      </div>
    </Card>
  )
}

export function MaterialsGrid({ group, items }) {
  const [unlocked, setUnlocked] = useState(stored)
  // Jeden e-mail odemkne všechny skupiny materiálů na stránce.
  useEffect(() => {
    const on = (e) => setUnlocked(e.detail)
    window.addEventListener('boostia:materials', on)
    return () => window.removeEventListener('boostia:materials', on)
  }, [])
  const unlock = (email) => {
    try { localStorage.setItem(KEY, email) } catch { /* soukromý režim */ }
    window.dispatchEvent(new CustomEvent('boostia:materials', { detail: email }))
  }
  return (
    <Reveal className="grid gap-4 md:grid-cols-2" stagger={0.06}>
      {items.map((m) => <MaterialCard key={m.id} m={m} group={group} unlocked={unlocked} onUnlock={unlock} />)}
    </Reveal>
  )
}

export default function Materialy() {
  return (
    <>
      <Seo title="Materiály zdarma: AI školení pro HR a obchod · Boostia" path="/materialy-zdarma"
        description="Průvodce výběrem AI školení, kontrolní seznam k dotaci, vzor pravidel pro AI, podklad pro vedení a 25 promptů pro obchodníka. Zdarma ke stažení." />
      <PageHero badge="Materiály zdarma"
        parts={<SplitHeadline className="max-w-[18ch] text-[clamp(2.2rem,5.4vw,4rem)]" parts={[{ t: 'Podklady, které můžete ' }, { t: 'použít ještě dnes', hl: true }]} />}
        sub="Vzory, kontrolní seznamy a šablony pro HR, vedení i obchodníky. PDF na pár stran, bez omáčky.">
        <Button href="#pro-hr" variant="secondary" arrow={false}>Pro HR a vzdělávání</Button>
        <Button href="#pro-obchod" variant="secondary" arrow={false}>Pro obchod</Button>
      </PageHero>

      <Section tight id="pro-hr" className="scroll-mt-20">
        <SectionHead badge="Pro HR a L&D" title="Máte za úkol „vyřešit AI“. Tady je, čím začít.">
          <p>Vybrat dodavatele, zajistit dotaci, nastavit pravidla a obhájit rozpočet. Na každý z těch kroků máme jeden podklad.</p>
        </SectionHead>
        <MaterialsGrid group="hr" items={MATERIALS.hr} />
      </Section>

      <Section tight id="pro-obchod" className="scroll-mt-20 border-y border-line bg-surface/40">
        <SectionHead badge="Pro obchod" title="Pro obchodní ředitele a obchodníky">
          <p>Postupy, které jde vyzkoušet před zítřejší schůzkou, a pravidla, která obchod potřebuje.</p>
        </SectionHead>
        <MaterialsGrid group="sales" items={MATERIALS.sales} />
      </Section>

      <Section tight>
        <Container className="!px-0">
          <Card className="grid items-center gap-6 lg:grid-cols-[1fr_auto]">
            <div>
              <h2 className="text-[26px]">Chcete rovnou číslo pro svůj tým?</h2>
              <p className="mt-2 max-w-[60ch] text-muted">Kalkulačka za dvě minuty ukáže, kolik hodin a korun ročně padne na neprodejní práci. Výsledek se hodí do podkladu pro vedení.</p>
            </div>
            <Button to="/#kalkulacka" ctaId="materialy_calc" section="materialy">Otevřít kalkulačku</Button>
          </Card>
          <ul className="mt-8 grid gap-3 text-[15px] text-muted md:grid-cols-3">
            {['Žádné povinné údaje kromě e-mailu', 'Jeden e-mail odemkne všechny materiály', 'Odhlásit se můžete kdykoli'].map((t) => <li key={t} className="flex items-center gap-2"><Check size={16} className="text-accent" aria-hidden="true" />{t}</li>)}
          </ul>
        </Container>
      </Section>
      <FinalCta title="Řešíte AI školení pro obchodní tým?" text="Za 30 minut spočítáme, kolik času váš obchod ztrácí, ověříme nárok na dotaci a pošleme vám jednostránkový report, který můžete dát vedení." />
    </>
  )
}
