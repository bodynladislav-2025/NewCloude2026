# Prompt 01 – Hlavní stránka `/`

Postav Hlavní stránka `/` webu Boostia. Dodrž design systém a nevyjednatelná pravidla ze základu projektu. Texty vlož přesně podle bloku COPY níže; poznámky v hranatých závorkách [PROOF/DOPLNIT/OVĚŘIT] vykresli jako viditelné placeholdery, poznámky [ROZHODNUTÍ: …] nevykresluj.

## Sekce a motion
1. **Hero** (min-height 92svh). Štítek → H1 → sub → 2 tlačítka → mikrocopy → pruh důvěry (4 položky s ikonami Lucide). H1: odhalení po slovech (GSAP SplitText, `yPercent 100→0`, `duration 0.8`, `stagger 0.05`, `ease power3.out`); „3 hodiny" a „8 týdnů" v barvě `--accent`. Pozadí: komponenta `FlowField` – canvas 2D, 40–60 tenkých linek `--flow` (opacity 0.15–0.5) tekoucích zleva doprava a sbíhajících se k CTA, jemně se ohýbají ke kurzoru v okruhu 180px; strop 30fps, pauza mimo viewport, načtení přes dynamic import po `requestIdleCallback`; při `isLowEnd()` nebo reduced motion statické SVG se stejným motivem. Primární CTA v `MagneticButton`, vede na /audit; sekundární scrolluje na kalkulačku.
2. **Problém.** H2 + text + 4 karty „před → po": hodnota „před" v `--warn` se při vstupu do viewportu přeškrtne (scaleX 0→1, 0.3s), hodnota „po" naběhne v `--accent` (0.8s). Pod kartami poznámka.
3. **Kalkulačka** (`id="kalkulacka"`). Dvousloupcová karta: vlevo posuvníky (Radix Slider + tlačítka +/−), vpravo výsledek. Výpočet v čisté funkci `lib/calc.ts`:
   `nonSelling = reps * (meetings*(prepMin+notesMin)/60 + offers*offerHours)`; `saved = nonSelling * 0.4`; `czkYear = saved * hourCost * 46`.
   Výchozí hodnoty a rozsahy: obchodníci 10 (2–60), schůzky/týden 5 (1–15), příprava 40 min (5–120), zápis+CRM+follow-up 40 min (5–120), nabídky/týden 1.5 (0–10, krok 0.5), hodiny na nabídku 2 (0.5–10), náklad na hodinu 600 Kč (300–1500, krok 50). Čísla výsledku plynule dobíhají (framer-motion useSpring, stiffness 120, damping 20), formát cs-CZ s mezerou jako oddělovačem tisíců. Po první interakci dostane karta výsledku `BorderBeam`. Na mobilu zobraz 4 vstupy (obchodníci, schůzky, příprava, zápis) a zbytek pod „Upřesnit". Pod výsledkem pole e-mail + tlačítko „Poslat mi podrobný výpočet e-mailem" (POST na `VITE_LC_WEBHOOK_CALC` se vstupy, výsledkem a souhlasem) a tlačítko na /audit. Eventy: `calc_start`, `calc_change`, `calc_result_view`, `calc_email_submit`.
4. **Řešení.** H2, text, 3 sloupce s ikonou.
5. **Moduly.** Bento grid 6 karet (desktop 3×2 s jednou širší kartou, mobil pod sebou), každá: číslo modulu v JetBrains Mono, název, popis. Desktop: spotlight pod kurzorem (rádius 300px) a náklon max 4°. Mobil: statické.
6. **Živá ukázka** – komponenta `AgentDemo`: okno chatu, 3 záložky (Příprava schůzky / Zápis ze schůzky / Návrh nabídky). Zpráva obchodníka se objeví celá, odpověď AI se píše po znacích (22ms/znak) po odstavcích; start při 50 % ve viewportu; tlačítka „Přehrát znovu" a „Přeskočit". Pro záložky 2 a 3 vytvoř obdobné krátké ukázky ve stejném stylu (zápis: body jednání, úkoly, návrh follow-up e-mailu; nabídka: struktura nabídky se třemi variantami) – obecné, bez jmen firem a bez čísel výsledků. Štítek „Simulovaná ukázka". Eventy `demo_play`, `demo_complete`.
7. **Jak to funguje** – 4 kroky vodorovně spojené linkou proudu, která se vykreslí při scrollu (stroke-dashoffset přes ScrollTrigger scrub 0.6). Odkaz „Celý průběh týden po týdnu" → /jak-to-funguje.
8. **Garance** – výrazná karta s okrajem `--accent`, ikona štítu, dva odstavce a drobné podmínky.
9. **Cena a dotace** – 3 cenové karty, prostřední zvýrazněná. Částky v JetBrains Mono.
10. **Kdo vás bude učit** – text + placeholder fotky.
11. **Proof** – zobraz „poctivou verzi" jako banner zakládajících klientů; komponentu `CaseStudyCard` připrav, ale nevykresluj, dokud nejsou data.
12. **Marquee** nad FAQ: textové štítky „Raynet · Pipedrive · HubSpot · Salesforce · eWay-CRM · Microsoft 365 Copilot · ChatGPT · Claude · Google Workspace" s nadpisem „Pracujeme s tím, co už máte" (40s cyklus, pauza na hover). Žádná loga klientů.
13. **FAQ** – accordion, event `faq_open`.
14. **Závěrečná CTA** – velká karta s linkami proudu sbíhajícími se k tlačítku.
SEO: title „AI školení pro obchodní týmy s měřeným výsledkem · Boostia"; description „Za 8 týdnů naučíme váš obchodní tým používat AI na schůzky, zápisy a nabídky. Cíl: 3 hodiny týdně na obchodníka. Změřeno, s garancí a dotací."; JSON-LD Organization, Course (AI Obchod 50, PT50H, onsite, 290000 CZK) a FAQPage.

---

# COPY (vlož přesně)

## 5.1 HLAVNÍ STRÁNKA: AI školení pro obchod

**Cíl:** rezervace auditu (primární), použití kalkulačky (sekundární).

### Sekce 1 – Hero
- **Štítek nad headline:** Měřený AI trénink pro obchodní týmy
- **H1:** O 3 hodiny týdně víc na prodej pro každého obchodníka. Za 8 týdnů, změřeno.
- **Sub:** Naučíme váš obchodní tým používat AI na přípravu schůzek, zápisy, nabídky a follow-upy. Bezpečně a na vašich zakázkách. Výsledek změříme stopkami, ne dotazníkem spokojenosti.
- **CTA 1:** Spočítat ztracený čas (audit zdarma)
- **CTA 2:** Vyzkoušet kalkulačku
- **Pod tlačítky (mikrocopy):** 30 minut online · bez závazku · číslo v Kč dostanete i bez spolupráce
- **Pruh důvěry:** 50hodinový program · První den na naše riziko · Lze čerpat dotaci Úřadu práce · Vede obchodník se 17 lety praxe

### Sekce 2 – Problém („Obchodník úředníkem")
- **H2:** Platíte obchodníky za prodej. Většinu týdne ale dělají něco jiného.
- **Text:** Hledají informace o klientovi. Přepisují poznámky ze schůzky. Skládají nabídku z pěti souborů. V pátek odpoledne dohánějí CRM. Na samotné jednání s klienty jim zbývá zlomek týdne.
  Není to jejich chyba. Tak se obchod dělal dvacet let. Jenže dnes tu práci zvládne AI za zlomek času a vaši konkurenti se to právě učí.
- **Čtyři karty (před → po):**
  - Příprava na schůzku: **40 minut → 10 minut**
  - Zápis a CRM: **druhý den → do 15 minut po schůzce**
  - Nabídka: **týden → do 24 hodin**
  - Cross-sell: **když si někdo vzpomene → každý týden seznam příležitostí**
- **Poznámka pod kartami:** Cílové hodnoty programu. Vaše skutečná čísla změříme první týden. [PROOF: nahradit průměry z pilotních týmů]

### Sekce 3 – Kalkulačka
- **H2:** Kolik stojí neprodejní práce váš tým? Spočítejte si to.
- **Vstupy (posuvníky):** Počet obchodníků (10) · Schůzek nebo delších hovorů týdně na obchodníka (5) · Minut na přípravu jedné schůzky (40) · Minut na zápis, CRM a follow-up (40) · Nabídek týdně na obchodníka (1,5) · Hodin na jednu nabídku (2) · Plný náklad na hodinu obchodníka v Kč (600)
- **Výsledek (živě):** „Váš tým tráví neprodejní prací **{X} hodin týdně**. Opatrným odhadem z toho AI vrátí **{Y} hodin týdně**, tedy **{Z} Kč ročně**."
- **Pod výsledkem:** Počítáme s úsporou 40 % času. V programu míříme výš, ale slibovat budeme až to, co změříme u vás.
- **CTA:** Poslat mi podrobný výpočet e-mailem → (pole e-mail) · **Probrat to na auditu zdarma**

### Sekce 4 – Řešení
- **H2:** AI Obchod 50: osm týdnů, po kterých tým pracuje jinak
- **Text:** Žádná přednáška o umělé inteligenci. Jeden den v týdnu u vás ve firmě, na vašich klientech a vašich nabídkách. Každý týden jedna dovednost, kterou obchodník druhý den použije.
- **Tři sloupce:**
  - **Měříme.** První týden stopujeme pět běžných činností. Osmý týden znovu. Vedení dostane rozdíl v hodinách a korunách.
  - **Trénujeme na vaší práci.** Příprava na skutečnou zítřejší schůzku. Skutečná nabídka. Skutečný zápis do vašeho CRM.
  - **Necháme vám nástroje.** Čtyři asistenti nastavení na vaše podklady a Playbook AI obchodu vaší firmy.

### Sekce 5 – Moduly (bento grid)
- **H2:** Co se tým naučí
1. **Bezpečná AI.** Co do AI smí a co ne. Tým odchází s podepsanou směrnicí a firemními účty.
2. **Příprava na schůzku za 10 minut.** Firma, člověk, hypotézy potřeb, otázky. Z veřejných zdrojů a z vašeho CRM.
3. **Zápis, CRM a follow-up do 15 minut.** Z nahrávky nebo poznámek rovnou zápis, úkoly a e-mail klientovi.
4. **Nabídka do 24 hodin.** Asistent naučený na vašich nejlepších nabídkách. Plus příprava na cenové námitky.
5. **Prospecting, cross-sell a up-sell.** Oslovení, které nezní jako šablona. Každý týden seznam klientů, kteří mohou kupovat víc.
6. **Týmoví asistenti a trénink hovorů.** Knihovna, kterou používá celý tým. AI jako sparing partner před těžkým jednáním.

### Sekce 6 – Živá ukázka
- **H2:** Podívejte se, jak to vypadá v praxi
- **Text:** Ukázka je simulovaná, postup je skutečný. Tohle se tým naučí druhý týden.
- **Simulace (typewriter):**
  - Obchodník: „Zítra v 10:00 mám schůzku s výrobním ředitelem firmy na obráběcí stroje, 120 zaměstnanců. Připrav mi brief."
  - AI: „**Brief na schůzku.** 1) Co o firmě víme: … 2) Tři pravděpodobné priority výrobního ředitele: … 3) Pět otázek, které otevřou potřebu: … 4) Co z našeho portfolia dává smysl a proč: … 5) Na co si dát pozor: …"
  - Pod tím: „Hotovo za 40 sekund. Ručně: 40 minut."
- **CTA:** Chci tohle pro svůj tým

### Sekce 7 – Jak to funguje (zkráceně, odkaz na podstránku)
- **H2:** Od prvního hovoru k výsledku ve čtyřech krocích
1. **Audit (30 minut, zdarma).** Spočítáme, kolik času a peněz váš obchod ztrácí.
2. **Dotace.** Ověříme nárok a žádost připravíme s vaším HR.
3. **Osm týdnů tréninku.** Jeden den týdně u vás. Měření na začátku a na konci.
4. **Výsledek a co dál.** Report pro vedení. Tým, který AI používá každý den. Když to dává smysl, postavíme vám AI agenty.

### Sekce 8 – Garance
- **H2:** Garance 3 hodin
- **Text:** **První den na naše riziko.** Když po prvním dni řeknete, že to není ono, rozejdeme se a neplatíte nic.
  **Výsledek změříme.** Když váš tým při závěrečném měření nezíská v průměru aspoň 3 hodiny týdně na obchodníka, školíme dál zdarma, až 20 hodin. A pokud se tam ani tak nedostaneme, vrátíme vám čtvrtinu ceny.
- **Drobným písmem:** Platí pro týmy s účastí aspoň 80 % a splněnými týdenními úkoly.

### Sekce 9 – Cena a dotace
- **H2:** Kolik to stojí
- **Karta 1:** **AI Obchod 50** · 290 000 Kč bez DPH · tým do 12 lidí · 50 hodin u vás · měření, Playbook, 4 asistenti, směrnice, 3 měsíce Klubu
- **Karta 2:** **S dotací** · zhruba 160 000 Kč pro tým 10 lidí · příspěvek 260,73 Kč na hodinu a účastníka z projektu Vzdělávání pro firmy · žádost připravíme s vámi [OVĚŘIT před zveřejněním]
- **Karta 3:** **AI Start den** · 39 000 Kč · jeden den s celým týmem · když pak půjdete do programu, celou částku odečteme
- **Pod kartami:** O dotaci žádá vaše firma a rozhoduje Úřad práce. Nárok vám ověříme do dvou pracovních dnů.
- **CTA:** Ověřit nárok na dotaci

### Sekce 10 – Kdo vás bude učit
- **H2:** Učí vás lidé, kteří obchod sami řídili
- **Text:** Program vede [JMÉNO], vedoucí lektor Boostie. Sedmnáct let v obchodě, týmy od 5 do 80 obchodníků, obchodní ředitel ve firmách s obratem přes 400 milionů korun. AI nástroje sám staví a zavádí do obchodní praxe. Certifikovaný kouč a lektor.
  Technickou část a AI agenty dodává náš vývojový tým. [DOPLNIT: jak partnera prezentovat, viz Předpoklady]

### Sekce 11 – Proof
- **H2:** Výsledky
- **[PROOF: 1–3 případové studie: obor, velikost týmu, úspora h/týden, čas na nabídku před/po, citace ředitele]**
- **Do té doby (poctivá verze):** „Právě běží první tři týmy. Výsledky měření zveřejníme tady, včetně těch, které nedopadnou podle plánu. Chcete být mezi prvními? Zakládající klienti mají cenu 220 000 Kč výměnou za souhlas s případovou studií. Volná místa: [X] ze 3."

### Sekce 12 – FAQ (odpovědi na námitky)
1. **Musí být obchodníci celý den mimo terén?** V ten den dělají svoji práci, jen jinak: připravují skutečné schůzky a píšou skutečné nabídky. Program jde rozdělit na dva půldny týdně.
2. **Používáme [CRM]. Bude to fungovat?** Ano. Pracujeme s tím, co máte: Raynet, Pipedrive, HubSpot, Salesforce, eWay i Excel. První týden si ověříme, co vaše CRM umožňuje.
3. **Jaké nástroje budeme potřebovat?** Firemní účet ChatGPT, Microsoft Copilot nebo Claude, podle toho, co už máte nebo co vám doporučíme. Licence stojí řádově stovky korun na osobu měsíčně a nejsou v ceně.
4. **Co když někdo z týmu s počítačem moc nekamarádí?** Každý účastník má individuální konzultaci s lektorem a pracujeme ve dvojicích. Kdo umí napsat e-mail, zvládne i tohle.
5. **Jak je to s bezpečností dat?** Je to první téma programu. Nastavíme účty, kde se vaše data nepoužívají k trénování modelů, a tým podepíše pravidla, co do AI nepatří.
6. **Jak přesně měříte výsledek?** Stopujeme pět činností (příprava schůzky, zápis, follow-up, nabídka, vyhledání informací) u každého účastníka první a osmý týden. Metodiku dostanete předem.
7. **Co když dotaci nedostaneme?** Rozhodnete se až po ověření nároku. Když Úřad práce žádost zamítne, můžete od smlouvy odstoupit bez sankce. [ROZHODNUTÍ: doporučuji tuto podmínku do smlouvy]
8. **Děláte i otevřené kurzy pro jednotlivce?** Zatím ne. Program stojí na tom, že se mění práce celého týmu.
9. **Čím se lišíte od běžného AI školení?** Délkou (8 týdnů místo jednoho dne), zaměřením (jen obchod) a tím, že výsledek měříme a ručíme za něj.

### Sekce 13 – Závěrečná CTA
- **H2:** Začněte číslem
- **Text:** Za 30 minut budete vědět, kolik hodin a korun váš obchod každý týden ztrácí. Co s tím uděláte, je na vás.
- **CTA:** Rezervovat audit zdarma
- **Mikrocopy:** Nejbližší kohorta: [DATUM] · volná místa: [X] ze 3
