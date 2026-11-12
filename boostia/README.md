# Boostia: AI školení pro obchodní týmy a AI agenti

Kompletní podklady pro spuštění: trh, business plán, nabídky, funnel, web (copy, design, motion, prompty pro Lovable), emaily a SMS, lead magnety, obsah a nastavení LeadConnectoru.

**Začněte tady:** [10 – Finální výstup](./10-finalni-vystup.md) (shrnutí na jednu stranu, předpoklady a rozhodnutí, placeholdery k doplnění, top 10 úkolů na první týden).

| Fáze | Soubor | Obsah |
|---|---|---|
| 1 | [Trh a pozice](./01-trh-a-pozice.md) | 3 avatary, konkurence a ceny, pozicování, dotace |
| 2 | [Business plán](./02-business-plan.md) | Value ladder, ceník s dotací, unit economics, plán 90 dní a 12 měsíců, pre-mortem |
| 3 | [Nabídky](./03-nabidky.md) | AI Obchod 50 a AI Agent na klíč: Value Equation, stack, bonusy, garance |
| 4 | [Funnel](./04-funnel.md) | Mapa, kvalifikace, potvrzovací stránka, scénář auditu, CLOSER, 10 námitek, KPI |
| 5 | [Web: copy](./05-web-copy.md) | 10 stránek, 5 headline, VSL, 3 reklamy |
| 6 | [Web: design a motion](./06-web-design-motion.md) | Art direction, motion systém, výkon, technické řešení, tracking, SEO |
| 6 | [Prompty pro Lovable](./lovable-prompty/) | 11 hotových promptů (základ + každá stránka) včetně copy |
| 7 | [Emaily a SMS](./07-emaily-a-sms.md) | 7 sekvencí, kompletní texty |
| 8 | [Lead magnety a obsah](./08-lead-magnety-a-obsah.md) | Kalkulačka, 25 promptů, 4 pilíře, 20 hooků, 10 postů |
| 9 | [LeadConnector a spuštění](./09-leadconnector-a-spusteni.md) | Pipelines, tagy, pole, 17 workflows, checklist, 30denní testy |
| – | [Finální výstup](./10-finalni-vystup.md) | Kontrola celku, shrnutí, předpoklady, placeholdery, úkoly |

## Hotové soubory k použití

| Složka | Obsah |
|---|---|
| [`web/`](./web/) | **Funkční web** (React, Tailwind, GSAP, Lenis): 12 stránek, kalkulačka, ukázka AI, kvalifikační formulář, napojení na LeadConnector. Návod v [`web/README.md`](./web/README.md). |
| [`web/public/materialy/`](./web/public/materialy/) | PDF ke stažení: 25 promptů pro obchodníka, Metodika měření, Semafor co do AI smí. |
| [`materialy/`](./materialy/) | Zdroje PDF, šablona reportu z auditu a skript, který je generuje. |
| [`leadconnector/`](./leadconnector/) | Seznam vlastních polí, tagů a ukázky dat z webhooků. |
| [`lovable-prompty/`](./lovable-prompty/) | Alternativa: prompty pro postavení stejného webu v Lovable. |

## Změny po první verzi (platí web, ne starší dokumenty)

Web a PDF už používají novou podobu nabídky. Dokumenty fází 1–10, emaily a prompty pro Lovable ji zatím nemají:

| Co | Původně (dokumenty) | Nyní (web, PDF) |
|---|---|---|
| Hlavní slib | 3 hodiny týdně na obchodníka | 12 hodin měsíčně navíc na prodej; důraz na tržby, ne jen ušetřený čas |
| Cena programu | 290 000 Kč, tým do 12 lidí; zakladatelská cena 220 000 Kč | 197 000 Kč, jedna cena pro tým až 16 lidí; zakladatelská cena zrušena |
| Dotace | „cca 160 000 Kč po dotaci pro 10 lidí" | při 16 účastnících pokryje příspěvek celou cenu, při 12 lidech 79 %, při 10 lidech 66 % |
| Garance | Garance 3 hodin (doučení + vrácení 25 %) | první den na naše riziko · bez schválené dotace se neplatí · doučení zdarma až 20 hodin |
| Rozsah | 50 hodin, 8 týdnů (3 h + 6 × 7 h + 5 h) | 50 hodin v 9 školicích dnech (4 h + 7 × 6 h + 4 h) |
| Velikost běhu | do 12 lidí | nejvýš 15 lidí; dotace pak pokryje 99 % ceny |
| Vzhled | jen tmavý režim | tmavý i světlý režim s přepínačem v hlavičce |
| Primární cílovka | obchodní ředitel | HR / L&D (materiály zdarma), obchodní ředitel a jednatel jako spolurozhodující |

## Jak číst značky
- **[PROOF: …]** chybí důkaz (reference, číslo, případová studie). Nic není vymyšlené; dokud ho nedodáte, platí „poctivá verze" textu.
- **[OVĚŘIT]** údaj z rešerše nebo právní věc, kterou je třeba potvrdit před zveřejněním (hlavně dotace).
- **[DOPLNIT: …]** údaj, který znáte jen vy (jména, termíny, kontakty).
- Čísla označená „odhad" jsou pracovní předpoklady, ne naměřené výsledky.

## Poznámka ke skóre kvality
Tabulky skóre na konci fází jsou moje vlastní hodnocení po kolech oprav, ne nezávislé měření. U webu platí pro návrh: skutečný výkon (Lighthouse) a vizuální dojem se ověří až na postaveném webu.
