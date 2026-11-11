# FÁZE 6 – Web: vizuální identita a motion design

## 6.1 Art direction

### Tři směry

| | A) **Proud** | B) **Tiskovina** | C) **Terminál** |
|---|---|---|---|
| Nálada | Tmavý, klidný, přesný. Tenké světelné linky, které se sbíhají do jednoho bodu. | Světlý, redakční, velká patková typografie, hodně bílé. | Monospace, zelená na černé, „hackerský" vzhled. |
| Reference | linear.app, vercel.com, resend.com, stripe.com (sekce s proudícími linkami) | stripe.com/press, anthropic.com, readymag ukázky | warp.dev, railway.app |
| Plus | Okamžitě čte jako technologická firma. Dobře nese čísla a ukázku AI. Dark mode šetří efekty. | Důvěryhodné, odlišné od AI klišé. | Silně „tech". |
| Minus | Hrozí podobnost s desítkami AI webů, když se to přežene s gradienty. | Působí jako poradenská firma nebo magazín, méně jako někdo, kdo AI staví. | Odradí jednatele a HR, působí jako nástroj pro vývojáře. |

**Vítěz: A) Proud**, s jednou pojistkou proti klišé: **žádná fialová, žádné duhové gradienty, žádné 3D koule.** Jedna akcentní barva, hodně černé, čísla jako hlavní vizuální prvek. Důvod volby: kupující má za 5 sekund uvěřit, že „tihle AI opravdu umí", a zároveň musí web unést tabulky, ceny a kalkulačku. Směr B by lépe prodával poradenství, C by prodával vývojářům.

### Vizuální metafora: „Proud k výsledku"
Mnoho tenkých linek (rozptýlená práce obchodníka: e-maily, poznámky, tabulky) se sbíhá do jedné silné linky, která míří k číslu. V hero linky tečou zleva doprava k CTA. V sekci Problém jsou rozházené. V sekci „Jak to funguje" se při scrollu postupně srovnávají. U výsledku končí v count-up čísle. Stejný motiv nesou ikony (linka se šipkou), oddělovače sekcí a favicon.

### Barvy (dark mode first)

| Token | Hex | Použití |
|---|---|---|
| `--bg` | `#07090D` | pozadí |
| `--surface` | `#0E1218` | karty |
| `--surface-2` | `#151B24` | vyvýšené prvky, vstupy |
| `--border` | `#232B38` | linky, okraje (1 px) |
| `--text` | `#F2F5F9` | hlavní text (kontrast 17:1) |
| `--muted` | `#9AA6B8` | sekundární text (kontrast 7,6:1) |
| `--accent` | `#C8FF3E` | CTA, čísla, aktivní stavy („signální limetková") |
| `--accent-ink` | `#0B1200` | text na akcentu (kontrast 15:1) |
| `--flow` | `#4DA3FF` | linky proudu, odkazy, grafy |
| `--warn` | `#FF8A4C` | „před" stavy, upozornění |

Světlý režim se nedělá (rozhodnutí: jedna dobře vyladěná verze je lepší než dvě průměrné). Výjimka: stránky GDPR a obchodní podmínky mají kvůli čitelnosti `--surface` pozadí a větší řádkování.

### Typografie (Google Fonts, plná čeština)
- **Nadpisy:** **Inter Tight** 600/700, prostrkání −0,02em, H1 `clamp(2.25rem, 6vw, 4.5rem)`, řádkování 1,05.
- **Text:** **Inter** 400/500, 17–18 px, řádkování 1,6, max. šířka odstavce 62 znaků.
- **Čísla, štítky, ukázka AI:** **JetBrains Mono** 500, tabulární číslice.
- Načítání: `next/font` nebo self-host přes Fontsource, subset `latin-ext`, `font-display: swap`, jen použité řezy (celkem 5 souborů). Otestovat ě š č ř ž ý á í é ů ú ď ť ň i ve verzálkách.

### Grid a prostor
12 sloupců, max. šířka 1200 px, okraje 24 px mobil / 48 px desktop. Vertikální rytmus sekcí 96 px mobil / 160 px desktop. Rádius 14 px karty, 999 px tlačítka. Jedna myšlenka na sekci.

### Ikony a ilustrace
Lucide (tah 1,5 px) v barvě `--muted`, aktivní v `--accent`. Žádné fotobankové fotky, žádní roboti, žádné mozky s obvody. Ilustrace jsou jen SVG linky proudu a skutečné snímky rozhraní (ukázka briefu, zápisu, nabídky). Jediná fotografie: vedoucí lektor při školení (O nás, landing auditu) **[DOPLNIT: reálné fotky z první kohorty]**.

## 6.2 Motion systém

**Zásady:** animuje se jen `transform` a `opacity` · délky 0,4–0,9 s · jeden výrazný efekt na sekci · výchozí easing `power3.out` (GSAP) / `[0.22, 1, 0.36, 1]` (Framer Motion) · headline a CTA jsou viditelné v prvním vykreslení, animace je jen zdobí.

| Sekce / prvek | Efekt | Knihovna a komponenta | Parametry | Proč pomáhá konverzi |
|---|---|---|---|---|
| **Hero headline** | Odhalení po slovech zespodu | GSAP SplitText (nebo React Bits `SplitText`) | `yPercent: 100→0`, `duration: 0.8`, `stagger: 0.05`, `ease: power3.out`, start hned po hydrataci; text je v HTML od začátku, v CSS výchozí stav viditelný, skrytí nastaví až JS | Vede oko po slibu slovo za slovem; čísla „3 hodiny" a „8 týdnů" zvýrazněna akcentem |
| **Hero pozadí** | Canvas 2D: 40–60 tenkých linek tekoucích k pravému okraji, jemně se ohýbají k myši | vlastní komponenta `FlowField` (canvas 2D, ne WebGL) | 30 fps strop, pauza mimo viewport (IntersectionObserver), vliv myši v okruhu 180 px, načtení přes `dynamic import` po `requestIdleCallback` | Nese metaforu značky a ukazuje řemeslo; 2D canvas je levný i na mobilu. **3D objekt a shader vyškrtnuty** (drahé, nic neprodávají) |
| **Hero CTA** | Magnetické tlačítko | React Bits `Magnet` nebo vlastní hook | posun max. 8 px, `duration: 0.3`, jen `pointer: fine` | Přitahuje pozornost k jediné akci |
| **Plynulý scroll** | Lenis | `lenis` + GSAP ticker | `lerp: 0.1`, `autoRaf: false`, na dotykových zařízeních nativní scroll | Pocit prémiového webu; na mobilu se vypíná, aby nepřekážel |
| **Reveal sekcí** | Vysunutí a zprůhlednění | GSAP ScrollTrigger | `y: 32→0`, `opacity: 0→1`, `duration: 0.7`, `stagger: 0.08`, `start: 'top 80%'`, `once: true` | Dávkuje informace, drží rytmus čtení |
| **Karty před → po** | Staré číslo se přeškrtne, nové naběhne | GSAP timeline | přeškrtnutí `scaleX 0→1` 0,3 s, nové číslo count-up 0,8 s | Kontrast před/po je jádro argumentu |
| **Kalkulačka** | Živý přepočet, číslo plynule dobíhá | Framer Motion `useSpring` + `useTransform`, posuvníky Radix Slider | `stiffness: 120, damping: 20`; výsledná karta má `BorderBeam` (Magic UI) po první interakci | Interakce = vlastní číslo = důvod nechat e-mail |
| **Count-up čísla** | Naběhnutí při vstupu do viewportu | Magic UI `NumberTicker` | `duration: 1.2`, jednou, tabulární číslice | Zdůrazní úspory v hodinách a Kč |
| **Bento moduly** | Spotlight pod kurzorem, jemný náklon | Aceternity `CardSpotlight` / React Bits `SpotlightCard` | spotlight rádius 300 px, náklon max. 4°, jen desktop; na mobilu statické karty s plným textem | Zve k prozkoumání obsahu programu; žádný text jen na hover |
| **Živá ukázka AI** | Simulovaný chat s psaním po znacích | vlastní `AgentDemo` (stavový automat) + React Bits `TextType` | 22 ms/znak, start při 50 % ve viewportu, tlačítka „Přehrát znovu" a „Přeskočit"; tři scénáře v záložkách (příprava, zápis, nabídka) | Nejsilnější důkaz bez referencí: návštěvník vidí výsledek, ne popis |
| **Jak to funguje** | Připnuté scrollytelling „úterý obchodníka" | GSAP ScrollTrigger `pin` + `scrub` | `pin: true`, `scrub: 0.6`, `end: '+=300%'`, 6 kroků; vlevo „bez AI", vpravo „s AI", linky proudu se srovnávají | Převádí abstraktní slib do jednoho pracovního dne |
| **Marquee** | Pás nástrojů a CRM, se kterými pracujeme | Magic UI `Marquee` | 40 s na cyklus, pauza na hover, `aria-hidden` + textový seznam pro čtečky | Odpovídá na „bude to fungovat s naším CRM". **Loga klientů až budou skutečná** |
| **Přechody stránek** | Krátké prolnutí | Framer Motion `AnimatePresence` | `opacity` 0,2 s + `y: 8` | Souvislý dojem; krátké, aby nezdržovalo |
| **Tlačítka** | Stisk a šipka | Tailwind + Framer Motion | `whileTap: scale 0.97`, šipka `x: 0→4` na hover, 0,2 s | Odezva na akci |
| **Formulář** | Popisky, stavy polí, průběh kroků | CSS + Framer Motion | okraj `--accent` na focus, lišta kroků 1/2, úspěch = zaškrtnutí 0,4 s | Méně chyb, vyšší dokončení |
| **Sticky CTA (mobil)** | Lišta dole po odscrollování hero | Framer Motion | `y: 100%→0`, 0,3 s | CTA vždy po ruce |

**Vyškrtnuto jako efekt pro efekt:** custom kurzor (ruší, nic neprodává; zadání ho zmiňuje, doporučuji vynechat a případně otestovat později jen na ukázce AI) · 3D objekt v hero · WebGL shader · particles · parallax fotek (žádné fotky nemáme) · text scramble na nadpisech · horizontální scroll sekcí · úvodní preloader.

## 6.3 Výkon a přístupnost

| Požadavek | Jak ho splníme |
|---|---|
| Lighthouse 90+ mobil | Statické generování stránek, JS hero pozadí a ukázky AI načten líně, žádné video na pozadí, obrázky AVIF/WebP s rozměry |
| LCP < 2,5 s | LCP prvek je H1 jako text. Fonty přednačtené, `swap`. Žádný JS neblokuje vykreslení headline a CTA |
| CLS < 0,1 | Pevné rozměry canvasu, embedů a videa (poměr stran), `size-adjust` u záložních fontů, výška embedu kalendáře rezervovaná |
| INP < 200 ms | Kalkulačka počítá synchronně z lokálního stavu, tracking přes `requestIdleCallback` |
| Slabá zařízení | `navigator.hardwareConcurrency <= 4` nebo `saveData` nebo `deviceMemory <= 4` → hero pozadí je statické SVG |
| `prefers-reduced-motion` | `gsap.matchMedia()`: žádné posuny, reveal okamžitý, scrollytelling se rozpadne na 6 statických karet pod sebou, ukázka AI zobrazí hotový výstup, count-up ukáže konečné číslo |
| Mobil | Bez Lenis, bez pinování (kroky jako karty), bez náklonu a spotlightu; veškerý obsah viditelný bez hoveru |
| VSL | Fasáda: náhledový obrázek + tlačítko, přehrávač se načte až po kliknutí; titulky v češtině |
| Embedy LeadConnector | Načítat až při přiblížení k viewportu; hlavní formulář je vlastní React (viz 6.4), embed jen kalendář |
| Přístupnost | Kontrast AA a lepší, focus stavy viditelné, vše ovladatelné klávesnicí, posuvníky s `aria-valuetext` („40 minut"), animovaný text má `aria-label` s plným zněním, cílová velikost dotyku 44 px |
| Třetí strany | GA4, Meta, LinkedIn, Clarity přes GTM až po souhlasu (Consent Mode v2), `defer` |

## 6.4 Technické řešení

### Stack (rozhodnutí)
**Lovable (Vite + React + TypeScript + Tailwind + shadcn/ui)** pro rychlé postavení, kód synchronizovaný do GitHubu, nasazení na **Vercel**. Důvod: rychlost a to, že web bude upravovat malý tým. **Kdy přejít na Next.js:** pokud Lighthouse na mobilu nedosáhne 90 kvůli vykreslování na klientu nebo pokud SEO (blog, případové studie) začne být hlavní kanál. Pojistka už teď: prerender statických stránek (`vite-plugin-prerender` / `vite-react-ssg`), aby byl text v HTML.
Knihovny: `gsap`, `@gsap/react`, `lenis`, `framer-motion`, `@radix-ui/react-slider`, `lucide-react`, `react-hook-form`, `zod`, `react-helmet-async`.

### Struktura komponent

```
src/
  app/            Router, Layout, PageTransition, LenisProvider, ConsentProvider
  pages/          Home, Agenti, JakToFunguje, Dotace, PripadoveStudie, ONas,
                  Audit, Dekujeme, DekujemeNurture, Kontakt, Gdpr, Podminky
  components/
    layout/       Header, Footer, StickyCta, Section, Container
    hero/         Hero, FlowField (lazy), FlowFallback.svg, SplitHeadline, MagneticButton
    proof/        TrustBar, BeforeAfterCards, CaseStudyCard, FoundingClientBanner
    calc/         Calculator, CalcSlider, CalcResult, CalcEmailGate
    demo/         AgentDemo, TypeLine, DemoTabs
    program/      ModulesBento, WeekTimeline, DayScrolly, GuaranteeBlock, PricingCards
    forms/        AuditForm (2 kroky), ContactForm, SubsidyForm, FormField, ProgressSteps
    embeds/       LcCalendar (lazy iframe), VslFacade
    ui/           Button, Card, Badge, Accordion, Marquee, NumberTicker, BorderBeam
  lib/
    leadconnector.ts   odeslání na webhook, skórování, UTM
    tracking.ts        dataLayer eventy
    motion.ts          sdílené easing, matchMedia, isLowEnd()
    calc.ts            výpočet kalkulačky (čistá funkce, testy)
  content/        texty stránek (cs.ts), FAQ, moduly, ceník
```

### Použité komponenty
| Zdroj | Komponenty |
|---|---|
| React Bits | `SplitText`, `Magnet`, `SpotlightCard`, `TextType` |
| Magic UI | `NumberTicker`, `Marquee`, `BorderBeam`, `BentoGrid` |
| Aceternity UI | `CardSpotlight` (alternativa), `Timeline` (týden po týdnu), `StickyScrollReveal` (záložní řešení scrollytellingu) |
| 21st.dev | cenové karty, FAQ accordion, vícekrokový formulář (jako výchozí bod, přestylovat) |
| shadcn/ui | Button, Input, Slider, Accordion, Tabs, Dialog, Toast |

### Napojení LeadConnectoru
1. **Formuláře jsou vlastní React komponenty** (plná kontrola nad designem a rychlostí). Po odeslání `POST` na **Inbound Webhook** workflow v LeadConnectoru s JSON: `firstName, lastName, email, phone, company, role, salesTeamSize, crm, decisionMaker, timeline, subsidyInterest, biggestPain, score, route, utm_source, utm_medium, utm_campaign, utm_content, gclid, fbclid, li_fat_id, pageUrl, consentMarketing`.
2. **Skóre a větev** (`audit` / `uvodni` / `nurture`) se počítá na klientu i ve workflow (zdroj pravdy je workflow).
3. **Kalendář:** embed LeadConnector kalendáře v iframe, předvyplněný přes URL parametry (`?first_name=…&email=…&phone=…`), obalený kartou v barvách webu; v nastavení kalendáře vlastní CSS (tmavé pozadí `#0E1218`, akcent `#C8FF3E`, font Inter). Po rezervaci přesměrování na `/dekujeme?name=…&date=…`.
4. **Kalkulačka:** po zadání e-mailu `POST` na druhý webhook s vstupy a výsledkem (`calc_reps, calc_hours_week, calc_czk_year`) → tag `lead-kalkulacka` → e-mail s výpočtem → sekvence 1.
5. **Příprava na děkovné stránce:** `POST` s `prep_minutes_meeting, prep_minutes_notes, prep_hours_offer, prep_meetings_week` → custom fields + tag `priprava-vyplnena`.
6. **Záloha:** když webhook selže, formulář uloží data do `localStorage`, zobrazí telefon a e-mail a zkusí odeslat znovu; chyba se loguje do GA4 (`form_error`).
7. Ochrana proti spamu: honeypot pole + časová kontrola + Cloudflare Turnstile.

### Tracking
GTM kontejner, vše až po souhlasu. `dataLayer` eventy:

| Event | Kdy | Parametry |
|---|---|---|
| `scroll_depth` | 25 / 50 / 75 / 90 % | `page`, `percent` |
| `cta_click` | každý klik na CTA | `cta_id`, `cta_text`, `section` |
| `calc_start` | první pohyb posuvníkem | – |
| `calc_change` | změna vstupu (debounce 1 s) | `field` |
| `calc_result_view` | výsledek 3 s ve viewportu | `hours_week`, `czk_year` |
| `calc_email_submit` | e-mail odeslán | `czk_year` |
| `vsl_play` / `vsl_25` / `vsl_50` / `vsl_75` / `vsl_complete` | přehrávač | – |
| `demo_play` / `demo_complete` | ukázka AI | `scenario` |
| `form_start` / `form_step1` / `form_submit` / `form_error` | formuláře | `form_id`, `route`, `score` |
| `calendar_booked` | návrat na `/dekujeme` | `route` |
| `prep_submit` | příprava na děkovné | – |
| `faq_open` | otevření otázky | `question_id` |

Konverze: GA4 `form_submit`, `calendar_booked` · Meta `Lead` (formulář), `Schedule` (rezervace) + Conversions API přes LeadConnector · LinkedIn konverze `Lead`, `Book appointment` · Clarity: nahrávky a heatmapy, maskovat pole formulářů.

### SEO základ

| Stránka | Title (do 60 znaků) | Meta description (do 155 znaků) |
|---|---|---|
| Hlavní | AI školení pro obchodní týmy s měřeným výsledkem · Boostia | Za 8 týdnů naučíme váš obchodní tým používat AI na schůzky, zápisy a nabídky. Cíl: 3 hodiny týdně na obchodníka. Změřeno, s garancí a dotací. |
| AI agenti | AI agenti a automatizace obchodu na míru · Boostia | Navrhneme, postavíme a provozujeme AI agenty napojené na vaše CRM. Pevná cena a návratnost předem, platba po milnících. |
| Jak to funguje | Jak probíhá program AI Obchod 50 · Boostia | Týden po týdnu: měření, šest tréninkových dní na vašich zakázkách a závěrečný report úspor v hodinách a korunách. |
| Dotace | Dotace na AI školení zaměstnanců · Boostia | Program má 50 hodin a lze na něj čerpat příspěvek Úřadu práce. Nárok ověříme do 2 dnů a žádost připravíme s vaším HR. |
| Případové studie | Výsledky AI tréninku obchodních týmů · Boostia | Změřené výsledky týmů po osmi týdnech: čas na přípravu schůzky, zápis a nabídku před a po. |
| O nás | O nás: školicí a technologická firma pro obchod · Boostia | Učíme obchodníky pracovat s AI a stavíme systémy, které jim berou rutinu. Vedeno lidmi, kteří obchod sami řídili. |
| Audit | Bezplatný audit: kolik času ztrácí váš obchod · Boostia | Za 30 minut spočítáme, kolik hodin a korun váš obchodní tým týdně ztrácí neprodejní prací. Zdarma a bez závazku. |
| Kontakt | Kontakt · Boostia | Napište nebo zavolejte. Odpovídáme do jednoho pracovního dne. |

- **OG obrázky** 1200×630, tmavé pozadí, linky proudu, headline stránky v Inter Tight, logo. Generovat šablonou (Satori / `@vercel/og`).
- **schema.org (JSON-LD):** `Organization` (název, logo, url, sameAs LinkedIn, kontakt) · `Course` na hlavní stránce (name „AI Obchod 50", description, provider, `hasCourseInstance` s `courseWorkload: PT50H`, `courseMode: onsite`, `offers` 290000 CZK) · `FAQPage` na hlavní, Dotace, Agenti, Audit · `Service` na stránce agentů · `BreadcrumbList`.
- `sitemap.xml`, `robots.txt`, kanonické URL, `lang="cs"`, děkovné stránky `noindex`.
- URL: `/`, `/ai-agenti`, `/jak-to-funguje`, `/dotace`, `/pripadove-studie`, `/o-nas`, `/audit`, `/dekujeme`, `/kontakt`, `/ochrana-osobnich-udaju`, `/obchodni-podminky`.

### Prompty pro Lovable
Hotové prompty ke zkopírování jsou ve složce [`lovable-prompty/`](./lovable-prompty/). Každý obsahuje design systém, motion pro danou stránku a **kompletní copy z fáze 5**. Postup: nejdřív `00-zaklad.md` (design systém, layout, sdílené komponenty), potom stránky v pořadí 01–10. Jeden prompt = jedna zpráva pro Lovable.

## 6.5 Kontrola: jednatel na mobilu ve vlaku, slabý signál

| Otázka | Odpověď | Úprava |
|---|---|---|
| Vidí do 2 s headline a CTA? | Ano: text je v HTML, pozadí je do načtení jen barva. | Hero canvas se na `saveData` a pomalém připojení (`effectiveType` 2g/3g) nenačte vůbec. |
| Pochopí za 5 s, co prodáváme? | Štítek „Měřený AI trénink pro obchodní týmy" + H1 s čísly. Ano. | Sub zkrácen na mobilu na první větu, zbytek po rozkliknutí není, je v další sekci. |
| Dá se kalkulačka ovládat palcem? | Posuvníky 44 px, vedle tlačítka +/−. | Na mobilu jen 4 vstupy (ostatní mají výchozí hodnoty a rozbalí se přes „Upřesnit"). |
| Přehraje VSL? | Fasáda, video se stáhne až po kliknutí, s titulky. | Pod videem 3 odrážky, aby stránka fungovala i bez přehrání. |
| Co je efekt pro efekt? | Custom kurzor, 3D, shader, particles, preloader, text scramble. | Vyhozeno (viz 6.2). |
| Působí prémiově i bez animací? | Ano, pokud drží typografie, prostor a jedna akcentní barva. | Vizuální kvalita nesmí záviset na pohybu: to je test `prefers-reduced-motion`. |
| Unese to výpadek signálu při odeslání? | Formulář uloží data lokálně a zkusí znovu. | Zobrazit telefon jako záložní cestu. |

## Self-review fáze 6

**Kolo 1 – slabiny:** (1) Seznam efektů kopíroval zadání bez výběru → doplněn sloupec „proč pomáhá konverzi" a seznam vyškrtnutých. (2) Hero s WebGL shaderem by ohrozil LCP na mobilu → nahrazen 2D canvasem s líným načtením a statickou zálohou. (3) Embed formuláře LeadConnectoru by rozbil design i výkon → vlastní formulář + webhook, embed jen kalendář.
**Kolo 2 – slabiny:** (1) Směr „Proud" hrozil AI klišé → zákaz fialové, gradientů a 3D, jediný akcent. (2) Scrollytelling na mobilu → rozpad na karty. (3) Lovable generuje aplikaci vykreslovanou na klientu, což je riziko pro SEO a LCP → prerender a jasné kritérium, kdy přejít na Next.js.

| Kritérium | Kolo 1 | Finál |
|---|---|---|
| Konkrétnost | 8 | 9,5 |
| Přesvědčivost | 8 | 9 |
| Jasnost | 8 | 9 |
| Konzistence | 9 | 9,5 |
| Proveditelnost | 7 | 9 |
| Pravdivost | 9 | 9,5 |
| Vizuální dojem | 8 | 9 (návrh; skutečný dojem ověří až postavený web) |
| Výkon | 6 | 9 (návrh; ověřit Lighthouse na reálném buildu) |
| Přístupnost | 7 | 9 |
