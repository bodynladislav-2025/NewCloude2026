# Prompt 03 – Stránka `/jak-to-funguje`

Postav Stránka `/jak-to-funguje` webu Boostia. Dodrž design systém a nevyjednatelná pravidla ze základu projektu. Texty vlož přesně podle bloku COPY níže; poznámky v hranatých závorkách [PROOF/DOPLNIT/OVĚŘIT] vykresli jako viditelné placeholdery, poznámky [ROZHODNUTÍ: …] nevykresluj.

## Sekce a motion
1. Hero s H1 a sub.
2. **Scrollytelling „Úterý obchodníka"** – komponenta `DayScrolly`. Desktop: sekce připnutá (GSAP ScrollTrigger `pin: true, scrub: 0.6, end: '+=300%'`), 6 kroků podle časů. Vlevo sloupec „Bez AI" (`--warn`), vpravo „S AI" (`--accent`), uprostřed časová osa. Při každém kroku se rozházené linky proudu vlevo o kus srovnají do jedné vpravo. Na konci count-up „hodin týdně zpět" s poznámkou „Vaše číslo změříme." (hodnotu nevymýšlej, použij placeholder [PROOF: průměr z pilotu], do té doby zobraz text „3+ hodiny týdně: cíl programu"). Mobil a reduced motion: 6 statických karet pod sebou, každá s oběma stavy.
3. **Týden po týdnu** – tabulka 8 řádků (níže) jako časová osa; na mobilu karty.
4. Co potřebujeme od vás (seznam s ikonami), Co vám zůstane (grid karet), Jak měříme (karta s 5 činnostmi a ikonou stopek).
5. CTA na /audit.
Tabulka Týden po týdnu:
| Týden | Formát | Obsah | Výstup |
| 1 | Start, 3 h online | Měření výchozího stavu (stopky na 5 činnostech), účty, cíle | Výchozí čísla týmu |
| 2 | Den 1, 7 h | Bezpečná AI a základy zadávání pro obchod | Podepsaná AI směrnice, semafor dat |
| 3 | Den 2, 7 h | Příprava na schůzku za 10 minut | Asistent Příprava schůzky |
| 4 | Den 3, 7 h | Zápisy, CRM a follow-up do 15 minut | Šablona zápisu, napojení na CRM |
| 5 | Den 4, 7 h | Nabídka do 24 hodin, cena a námitky | Asistent Nabídka, banka námitek |
| 6 | Den 5, 7 h | Prospecting, cross-sell a up-sell | Sekvence oslovení, mapa příležitostí |
| 7 | Den 6, 7 h | Týmoví asistenti a trénink hovorů s AI | Playbook AI obchodu |
| 8 | Finále, 5 h | Měření po, prezentace vedení, plán na 90 dní, osvědčení | Report úspor v hodinách a Kč |
SEO: title „Jak probíhá program AI Obchod 50 · Boostia"; description „Týden po týdnu: měření, šest tréninkových dní na vašich zakázkách a závěrečný report úspor v hodinách a korunách." 

---

# COPY (vlož přesně)

## 5.3 JAK TO FUNGUJE

**Cíl:** odstranit nejistotu z průběhu; CTA audit.

- **H1:** Osm týdnů od stopek ke stopkám
- **Sub:** Přesně víte, co se děje který týden, co potřebujeme od vás a co vám zůstane.
- **Scrollytelling „Úterý obchodníka: bez AI → s AI":**
  - 8:00 Příprava na schůzku: *hledá na webu, v e-mailech, v CRM, 40 minut* → *brief za 10 minut, zbytek času volá klientovi*
  - 10:00 Schůzka: *píše si poznámky a nestíhá poslouchat* → *nahrává se souhlasem klienta, soustředí se na rozhovor*
  - 11:30 Po schůzce: *zápis si nechá „na večer"* → *zápis, úkoly a CRM hotové v autě před odjezdem*
  - 13:00 Follow-up: *odejde pozítří* → *odešel v 11:45*
  - 14:00 Nabídka: *skládá ji tři dny z loňské* → *návrh do hodiny, kontrola a odeslání týž den*
  - 16:00 Stávající klienti: *nezbyl čas* → *dva telefonáty podle seznamu příležitostí*
  - **Součet:** [count-up] hodin týdně zpět. *Vaše číslo změříme.*
- **H2: Týden po týdnu** (tabulka z fáze 3: týden, formát, obsah, výstup)
- **H2: Co potřebujeme od vás** · Místnost a projektor · Účast obchodního ředitele první a poslední den · Pět vašich nejlepších nabídek a export z CRM · Hodinu týdně na úkol mezi setkáními · Jednoho AI šampiona z týmu
- **H2: Co vám zůstane** · Report úspor v hodinách a Kč · Playbook AI obchodu · 4 asistenti · Směrnice a semafor dat · Osvědčení pro každého účastníka (podklad pro AI gramotnost podle AI Actu [OVĚŘIT formulaci]) · Kontrolní měření po 60 dnech
- **H2: Jak měříme** · Pět činností, stopky, každý účastník, první a osmý týden. Průměr za tým, ne nejlepší jednotlivec. Metodiku pošleme předem.
- **CTA:** Rezervovat audit zdarma
