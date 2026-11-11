# Prompt 04 – Stránka `/dotace`

Postav Stránka `/dotace` webu Boostia. Dodrž design systém a nevyjednatelná pravidla ze základu projektu. Texty vlož přesně podle bloku COPY níže; poznámky v hranatých závorkách [PROOF/DOPLNIT/OVĚŘIT] vykresli jako viditelné placeholdery, poznámky [ROZHODNUTÍ: …] nevykresluj.

## Sekce a motion
Hero s H1, sub a CTA, které scrolluje na formulář. Tabulka „Kolik to dělá" (3 řádky níže) s count-up u částek; na mobilu 3 karty. Časová osa 5 kroků. Karta „Co je dobré vědět předem" s ikonou info a okrajem `--flow` (věcná, žádný strašák). Karta „Když dotace nevyjde". FAQ. Formulář `SubsidyForm`: jméno, e-mail, telefon, firma, IČO, počet účastníků, tlačítko „Ověřit nárok" → POST na `VITE_LC_WEBHOOK_AUDIT` s `source: 'dotace'`, potom zpráva „Díky. Do dvou pracovních dnů se ozveme s výsledkem." a nabídka rezervace auditu.
Tabulka (výpočet ze sazby 260,73 Kč/h/účastník, 50 hodin; vykresli s viditelným štítkem [OVĚŘIT]):
| Tým | Cena programu | Příspěvek na vzdělávání | Cena po dotaci |
| 8 lidí | 290 000 Kč | 104 292 Kč | 185 708 Kč |
| 10 lidí | 290 000 Kč | 130 365 Kč | 159 635 Kč |
| 12 lidí | 290 000 Kč | 156 438 Kč | 133 562 Kč |
SEO: title „Dotace na AI školení zaměstnanců · Boostia"; description „Program má 50 hodin a lze na něj čerpat příspěvek Úřadu práce. Nárok ověříme do 2 dnů a žádost připravíme s vaším HR."; JSON-LD FAQPage.

---

# COPY (vlož přesně)

## 5.4 DOTACE

**Cíl:** formulář „Ověřit nárok" (zkrácená kvalifikace + IČO).

- **H1:** Na AI Obchod 50 můžete čerpat dotaci. Papíry připravíme s vámi.
- **Sub:** Program má 50 hodin, což je minimální rozsah pro projekt Vzdělávání pro firmy Úřadu práce. Pro tým deseti lidí jde o příspěvek přes 130 000 Kč na školení a k tomu příspěvek na mzdy. [OVĚŘIT]
- **CTA:** Ověřit nárok do 2 pracovních dnů
- **H2: Kolik to dělá** (tabulka z fáze 2: 8 / 10 / 12 lidí, cena, příspěvek, cena po dotaci)
  *Výpočet vychází ze sazby 260,73 Kč za hodinu a účastníka platné k [DATUM]. Konečnou výši určuje Úřad práce.*
- **H2: Jak to probíhá**
  1. **Ověření (2 dny).** Pošlete IČO a počet účastníků. Řekneme, jestli a z čeho můžete čerpat.
  2. **Žádost (1–2 týdny).** Dodáme osnovu, harmonogram, hodinovou dotaci a profil lektora. Žádost s vaším HR předvyplníme. Podáváte vy.
  3. **Schválení.** Rozhoduje Úřad práce. [DOPLNIT: obvyklá lhůta]
  4. **Program.** Vedeme prezenční listiny a vystavíme osvědčení.
  5. **Vyúčtování.** Připravíme podklady. Příspěvek dostáváte zpětně po dokončení.
- **H2: Co je dobré vědět předem** · Žádost musí být podaná a schválená před zahájením. · Program nejdřív zaplatíte, příspěvek přijde po dokončení. · Účastníci musí kurz dokončit. · Schválení nemůžeme zaručit. Můžeme zaručit, že podklady budou úplné a včas.
- **H2: Když dotace nevyjde** · Když Úřad práce žádost zamítne, můžete od smlouvy odstoupit bez sankce.
- **FAQ:** *Kolik práce to dá našemu HR?* Zhruba dvě až čtyři hodiny. · *Účtujete si za pomoc s dotací?* Ne, je v ceně programu. · *Jsou i jiné programy?* Ano, například výzvy OPZ+ nebo projekty oborových sdružení. Při ověření projdeme všechny, které pro vás připadají v úvahu.
