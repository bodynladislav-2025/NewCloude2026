# Prompt 05 – Stránka `/pripadove-studie`

Postav Stránka `/pripadove-studie` webu Boostia. Dodrž design systém a nevyjednatelná pravidla ze základu projektu. Texty vlož přesně podle bloku COPY níže; poznámky v hranatých závorkách [PROOF/DOPLNIT/OVĚŘIT] vykresli jako viditelné placeholdery, poznámky [ROZHODNUTÍ: …] nevykresluj.

## Sekce a motion
Hero. Protože zatím nejsou reálné studie, vykresli „Stav před prvním proofem" jako hlavní obsah: velká karta s textem, 3 dlaždice (Metodika měření · Garance 3 hodin · Zakladatelská cena 220 000 Kč pro první 3 týmy) a 2 CTA. Připrav komponentu `CaseStudyCard` (obor, velikost týmu, 5 čísel před/po s count-up, citace, „co nefungovalo") a datový soubor `content/caseStudies.ts` s prázdným polem; když je pole prázdné, sekce studií se nevykreslí. Nevymýšlej žádné ukázkové firmy ani čísla.
SEO: title „Výsledky AI tréninku obchodních týmů · Boostia"; description „Změřené výsledky týmů po osmi týdnech: čas na přípravu schůzky, zápis a nabídku před a po." 

---

# COPY (vlož přesně)

## 5.5 PŘÍPADOVÉ STUDIE

**Cíl:** proof → audit.

- **H1:** Výsledky, které jsme změřili
- **Sub:** U každého týmu uvádíme výchozí stav, výsledek po osmi týdnech a jak jsme měřili.
- **Šablona studie:** Firma (obor, velikost, tým) · Výchozí stav (5 čísel) · Co jsme dělali · Výsledek (5 čísel + Kč ročně) · Co nefungovalo · Citace ředitele · **[PROOF × 3]**
- **Stav před prvním proofem (poctivá verze):**
  **H2:** První týmy právě měříme
  „Boostia je nová firma. Případové studie tu budou, až doběhne první kohorta ([DATUM]). Nechceme vám ukazovat čísla, která nemáme. Do té doby nabízíme tohle: metodiku měření, kterou si můžete projít, garanci 3 hodin a zakladatelskou cenu pro první tři týmy."
  **CTA:** Chci být zakládající klient · Stáhnout metodiku měření (PDF)
