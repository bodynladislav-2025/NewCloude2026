# Prompt 00 – Základ projektu (pošli jako první)

Postav základ marketingového webu české B2B firmy **Boostia** (AI školení pro obchodní týmy a AI agenti na míru). Stack: React + TypeScript + Tailwind + shadcn/ui, react-router, framer-motion, gsap + @gsap/react (ScrollTrigger, SplitText), lenis, lucide-react, react-hook-form + zod, react-helmet-async. Jazyk webu: čeština (`<html lang="cs">`). Zatím nevytvářej obsah stránek, jen základ, layout a sdílené komponenty. Stránky přidám dalšími zprávami.

## Design systém (dark mode only)
CSS proměnné v `:root` a namapované do Tailwind theme:
- `--bg #07090D`, `--surface #0E1218`, `--surface-2 #151B24`, `--border #232B38`
- `--text #F2F5F9`, `--muted #9AA6B8`
- `--accent #C8FF3E` (CTA, čísla), `--accent-ink #0B1200` (text na akcentu)
- `--flow #4DA3FF` (linky, odkazy), `--warn #FF8A4C` (stavy „před")
Zakázáno: fialová, duhové gradienty, glassmorphism, 3D objekty, fotobankové fotky, emoji v textech.
Fonty (Google Fonts, subset latin-ext, display swap): nadpisy **Inter Tight** 600/700 s letter-spacing -0.02em; text **Inter** 400/500, 17px, line-height 1.6; čísla a štítky **JetBrains Mono** 500 s tabulárními číslicemi. H1 `clamp(2.25rem, 6vw, 4.5rem)`, line-height 1.05.
Layout: kontejner max 1200px, padding 24px mobil / 48px desktop, sekce 96px mobil / 160px desktop, rádius karet 14px, tlačítka plně zaoblená, okraje 1px `--border`.
Vizuální motiv „Proud k výsledku": tenké linky v barvě `--flow` s nízkou průhledností, které se sbíhají do jedné a míří k číslu nebo k CTA. Použij ho jako SVG oddělovač sekcí.

## Sdílené komponenty
- `Header`: logo „Boostia" (text, Inter Tight 700), navigace: AI školení pro obchod (/), AI agenti (/ai-agenti), Jak to funguje (/jak-to-funguje), Dotace (/dotace), Případové studie (/pripadove-studie), O nás (/o-nas); vpravo tlačítko „Audit zdarma" (/audit). Sticky, po odscrollování pozadí `--bg` s 80% průhledností a blur. Mobil: hamburger a celoobrazovkové menu.
- `Footer`: Boostia s.r.o., [DOPLNIT IČO, sídlo, e-mail, telefon], odkazy Kontakt, Ochrana osobních údajů (/ochrana-osobnich-udaju), Obchodní podmínky (/obchodni-podminky), LinkedIn.
- `StickyCta` (jen mobil): lišta dole s tlačítkem „Audit zdarma", objeví se po odscrollování hero (y 100% → 0, 0.3s), skrytá na /audit a /dekujeme.
- `Button`: varianty primary (pozadí `--accent`, text `--accent-ink`, šipka vpravo, která se na hover posune o 4px za 0.2s; `whileTap scale 0.97`), secondary (obrys `--border`, text `--text`), ghost.
- `Section`, `Container`, `Badge` (JetBrains Mono, verzálky 12px), `Card`, `Accordion` (FAQ), `NumberTicker` (count-up 1.2s jednou při vstupu do viewportu), `Marquee`, `BorderBeam`.
- `MagneticButton`: obal, který na zařízeních s `pointer: fine` přitahuje tlačítko ke kurzoru max o 8px (0.3s).
- `Reveal`: obal sekce, GSAP ScrollTrigger `y 32→0, opacity 0→1, duration 0.7, stagger 0.08, start 'top 80%', once: true`.
- `LenisProvider`: Lenis s `lerp 0.1`, `autoRaf: false`, napojený na `gsap.ticker` a `ScrollTrigger.update`; na dotykových zařízeních a při `prefers-reduced-motion` se neinicializuje.
- `PageTransition`: framer-motion AnimatePresence, opacity 0.2s + y 8px.
- `ConsentProvider`: cookie lišta v češtině (Nezbytné / Analytické / Marketingové; tlačítka „Přijmout vše", „Jen nezbytné", „Nastavení"), Google Consent Mode v2; GTM se načte až po souhlasu.
- `lib/tracking.ts`: funkce `track(event, params)` → `window.dataLayer.push`. Automaticky `scroll_depth` (25/50/75/90) a `cta_click` (`cta_id`, `cta_text`, `section`) pro každé tlačítko s `data-cta`.
- `lib/leadconnector.ts`: `submitLead(payload, webhookUrl)` – POST JSON na URL z env `VITE_LC_WEBHOOK_AUDIT`, `VITE_LC_WEBHOOK_CALC`, `VITE_LC_WEBHOOK_PREP`, `VITE_LC_WEBHOOK_CONTACT`; přidá UTM parametry, `gclid`, `fbclid`, `li_fat_id` a `pageUrl` (UTM ukládej při první návštěvě do sessionStorage). Při chybě ulož payload do localStorage, zobraz záložní kontakt a zkus znovu.
- `lib/motion.ts`: sdílený easing `[0.22, 1, 0.36, 1]`, `isLowEnd()` (hardwareConcurrency <= 4 || deviceMemory <= 4 || saveData || effectiveType 2g/3g), `gsap.matchMedia()` pomocník.
- `Seo`: komponenta pro title, meta description, canonical, OG a JSON-LD.

## Nevyjednatelná pravidla (platí pro všechny další prompty)
1. Headline a CTA nad zlomem jsou v HTML od prvního vykreslení a viditelné bez JavaScriptu. Animace je nikdy nezdrží.
2. Animuj jen `transform` a `opacity`. Délky 0.4–0.9s. Jeden výrazný efekt na sekci.
3. `prefers-reduced-motion: reduce` = plnohodnotná verze bez pohybu (reveal okamžitý, count-up ukáže konečné číslo, psaný text se zobrazí celý, připnuté sekce se rozpadnou na statické karty).
4. Mobil: žádný obsah dostupný jen přes hover, bez pinování, bez náklonu karet, dotykové cíle min. 44px.
5. Těžké komponenty (canvas v hero, ukázka AI, embed kalendáře, video) načítej líně přes dynamic import nebo až při přiblížení k viewportu; rezervuj jim výšku, aby CLS zůstalo pod 0.1.
6. Cíl: Lighthouse Performance 90+ na mobilu, LCP pod 2.5s.
7. Přístupnost: kontrast AA, viditelný focus, ovládání klávesnicí, `aria-label` u animovaných textů, posuvníky s `aria-valuetext`.
8. Texty vkládej přesně tak, jak je dostaneš. Nic nepřidávej, nevymýšlej reference, loga klientů ani čísla. Místa označená [PROOF: …], [DOPLNIT: …] a [OVĚŘIT] vykresli jako viditelně odlišený placeholder (přerušovaný okraj, štítek „Doplnit"), aby se nedala přehlédnout před spuštěním.
9. Děkovné stránky mají `noindex`.
