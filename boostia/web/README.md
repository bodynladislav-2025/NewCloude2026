# Boostia – web

Marketingový web: React 19, Vite, Tailwind 4, GSAP + ScrollTrigger, Lenis, Motion. Jen tmavý režim, čeština.

## Spuštění

```bash
npm install
cp .env.example .env      # doplňte webhooky, kalendáře, videa, GTM
npm run dev               # vývoj na http://localhost:5173
npm run build             # produkční build do dist/
npm run preview           # náhled buildu
```

Bez vyplněného `.env` web funguje: formuláře se neodesílají nikam, data se vypíší do konzole a místo kalendáře a videa je vidět zástupný blok.

## Nasazení

**Vercel:** nový projekt z tohoto repozitáře, *Root Directory* = `boostia/web`, framework Vite. `vercel.json` řeší přesměrování adres na `index.html`. Proměnné z `.env.example` zadejte v nastavení projektu.
**Netlify:** base directory `boostia/web`, build `npm run build`, publish `dist`. Přesměrování řeší `public/_redirects`.

## Stránky

| Adresa | Soubor |
|---|---|
| `/` | `src/pages/Home.jsx` |
| `/ai-agenti` | `src/pages/Agenti.jsx` |
| `/jak-to-funguje` | `src/pages/JakToFunguje.jsx` |
| `/dotace` | `src/pages/Dotace.jsx` |
| `/pripadove-studie` | `src/pages/Studie.jsx` |
| `/o-nas` | `src/pages/ONas.jsx` |
| `/audit` (landing bez navigace) | `src/pages/Audit.jsx` |
| `/dekujeme`, `/dekujeme-prompty` (noindex) | `src/pages/Dekujeme.jsx`, `DekujemePrompty.jsx` |
| `/kontakt` | `src/pages/Kontakt.jsx` |
| `/ochrana-osobnich-udaju`, `/obchodni-podminky` | `src/pages/Gdpr.jsx`, `Podminky.jsx` |

## Co kde upravit

- **Ceny, moduly, týdny, FAQ, termín kohorty:** `src/content.jsx`. Termín kohorty: vyplňte `COHORT` a nastavte `set: true`.
- **Případové studie:** pole `CASE_STUDIES` v `src/pages/Studie.jsx`. Dokud je prázdné, zobrazuje se poctivá verze „první týmy právě měříme".
- **Štítky DOPLNIT / PROOF / OVĚŘIT:** oranžové přerušované rámečky označují místa, kde chybí údaj nebo důkaz. Hledejte `<Placeholder` v `src/`. Vypnou se proměnnou `VITE_SHOW_PLACEHOLDERS=false`, ale nejdřív je vyřešte, jinak na webu zůstanou díry ve větách.
- **Telefon v hlavičce landing page:** `src/components/Layout.jsx` (`tel:+420000000000`).
- **Výpočet kalkulačky:** `src/lib/calc.js` (koeficient úspory 40 %, 46 týdnů).
- **Bodování formuláře:** `src/lib/leadconnector.js` (`SCORE`, `scoreLead`).
- **Barvy a písma:** `@theme` v `src/index.css`.
- **PDF ke stažení a OG obrázek:** `../materialy/build.cjs` (`node build.cjs`), výstup do `public/materialy/` a `public/og.png`.

## Napojení LeadConnectoru

Formuláře jsou vlastní komponenty a posílají JSON na Inbound Webhook (`src/lib/leadconnector.js`). Ukázky dat a seznam polí jsou v `../leadconnector/`. Kontakt se ukládá už po prvním kroku formuláře. Když odeslání selže, data se uloží v prohlížeči a odešlou po obnovení připojení. Kalendář je vložený iframe s předvyplněným jménem, e-mailem a telefonem.

## Měření

Vše jde do `window.dataLayer` (`src/lib/tracking.js`): `page_view`, `scroll_depth`, `cta_click`, `calc_start`, `calc_change`, `calc_email_submit`, `vsl_play`, `demo_play`, `demo_complete`, `form_start`, `form_step1`, `form_submit`, `form_error`, `calendar_booked`, `prep_submit`, `faq_open`. GTM se načte až po souhlasu s cookies (Consent Mode v2). GA4, Meta Pixel, LinkedIn Insight Tag a Clarity nastavte jako tagy v GTM.

## Pohyb, výkon, přístupnost

- Headline a tlačítka jsou v HTML hned; odhalení nadpisu je čisté CSS.
- Hero pozadí je canvas 2D, načítá se až po prvním vykreslení; na slabých zařízeních, pomalém připojení a při omezeném pohybu zůstane statické SVG.
- Lenis běží jen na zařízeních s myší. Připnuté scrollytelling je jen na desktopu, na mobilu jsou z něj karty.
- `prefers-reduced-motion`: bez animací, ukázka AI zobrazí hotový text.

## Co není hotové

- **Lighthouse jsem neměřil.** Hlavní balíček JavaScriptu má zhruba 154 kB (gzip); cíl 90+ na mobilu ověřte na nasazeném webu.
- **Web se vykresluje v prohlížeči.** Title, popisky a schema.org se doplňují JavaScriptem. Google to zpracuje, ale pro jistotu u SEO a náhledů na sociálních sítích zvažte prerender nebo přechod na Next.js (viz fáze 6).
- **Ochrana proti spamu** je jen skryté pole a časová kontrola. Cloudflare Turnstile přidejte, až začne chodit spam.
- Videa, kalendáře a webhooky čekají na vaše adresy v `.env`.
