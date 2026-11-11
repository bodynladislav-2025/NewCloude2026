# Prompt 08 – Děkovné stránky `/dekujeme` a `/dekujeme-prompty` (obě noindex)

Postav Děkovné stránky `/dekujeme` a `/dekujeme-prompty` (obě noindex) webu Boostia. Dodrž design systém a nevyjednatelná pravidla ze základu projektu. Texty vlož přesně podle bloku COPY níže; poznámky v hranatých závorkách [PROOF/DOPLNIT/OVĚŘIT] vykresli jako viditelné placeholdery, poznámky [ROZHODNUTÍ: …] nevykresluj.

## `/dekujeme` (po rezervaci)
Jméno, datum a čas načti z URL parametrů (`name`, `date`, `time`); když chybí, použij obecné znění. Při načtení event `calendar_booked`.
- H1: „Máte to v kalendáři. Tady je, jak z těch 30 minut dostat maximum."
- Podtitul: „Audit proběhne {{datum}} v {{čas}} přes Google Meet. Odkaz máte v e-mailu i v SMS."
- Video 90s přes `VslFacade` (env `VITE_TY_VIDEO_URL`).
- Tři očíslované kroky jako karty:
  1. „Přidejte si termín do kalendáře" – tlačítka Google / Outlook / .ics.
  2. „Vyplňte 3minutovou přípravu" – formulář se 4 číselnými poli: „Kolik minut zabere příprava na jednu schůzku?", „Kolik minut zabere zápis, CRM a follow-up po schůzce?", „Kolik hodin zabere jedna nabídka?", „Kolik schůzek týdně má jeden obchodník?" + tlačítko „Odeslat přípravu" → POST na `VITE_LC_WEBHOOK_PREP`, event `prep_submit`, potom zaškrtnutí (0.4s) a text „Díky, máme to. Na auditu rovnou počítáme."
  3. „Pozvěte kolegu, který o tom rozhoduje s vámi" – pole e-mail + tlačítko „Poslat pozvánku" (POST na stejný webhook s `inviteEmail`).
- „Co čekat": 5 min: jak dnes váš obchod pracuje · 15 min: počítáme ztracený čas a peníze · 10 min: co s tím, s námi nebo bez nás.
- „Co nečekat": prezentaci o tom, co je umělá inteligence. Tlak na podpis.
- Sekce a text pro nekvalifikované použij na `/dekujeme-prompty` podle bloku COPY.
Motion: jen reveal a animace zaškrtnutí. Žádná navigace kromě loga.

---

# COPY (vlož přesně)

## 5.8 DĚKOVNÁ STRÁNKA
Kompletní copy viz fáze 4.3 (headline, video, 3 kroky, co čekat). Doplňky:
- **Sekce pod kroky:** „Mezitím: 25 promptů pro obchodníka. Stáhněte si je a zkuste první ještě dnes." [tlačítko Stáhnout PDF]
- **Děkovná pro nekvalifikované:** **H1:** Díky. Pro váš tým máme něco lepšího než audit. · „Program je stavěný pro týmy od 4 obchodníků, audit by vám teď moc neřekl. Posíláme vám 25 promptů pro obchodníka a jednou za 14 dní tip, jak s AI ušetřit čas. Až tým poroste, ozvěte se." · **CTA:** Stáhnout prompty
