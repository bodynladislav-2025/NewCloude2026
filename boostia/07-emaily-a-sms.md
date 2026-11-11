# FÁZE 7 – Emailové a SMS sekvence

**Společná pravidla:** odesílatel „[JMÉNO] z Boostie" · prostý text, bez grafiky, max. jeden odkaz · vykání · podpis: „[JMÉNO], Boostia · [telefon]" · v patičce odhlášení a identifikace firmy · SMS do 160 znaků bez diakritiky (jedna zpráva, spolehlivé doručení).
**Proměnné LeadConnectoru:** `{{contact.first_name}}`, `{{contact.company_name}}`, `{{appointment.start_time}}`, `{{custom_values.*}}`.
**Pozor na příběhy:** emaily psané v první osobě vycházejí z údajů o zakladateli ze zadání (17 let v obchodě, týmy 5–80 lidí). Konkrétní scény jsou označené **[OVĚŘIT příběh]**: upravte je, aby přesně odpovídaly tomu, co se stalo. Nic, co se nestalo, neodesílejte.

---

## SEKVENCE 1 – Po stažení lead magnetu (kalkulačka / prompt pack)

Soap Opera Sequence, 6 emailů. **Ukončení:** rezervace auditu (tag `audit-rezervovan`) → přechod do sekvence 2; odhlášení; odpověď na email (pozastavit, odpovídá člověk).

### 1.1 – Hned (doručení + otevřená smyčka)
- **Předmět A:** Váš výpočet: {{custom_values.calc_czk_year}} Kč ročně
- **Předmět B:** Tady je vaše číslo (a co s ním)
- **Preheader:** Plus jedna věc, kterou kalkulačka nepočítá.

Dobrý den, {{contact.first_name}},

posílám slíbený výpočet.

Váš tým: {{custom_values.calc_reps}} obchodníků
Neprodejní práce, kterou může převzít AI: {{custom_values.calc_hours_week}} hodin týdně
V penězích: {{custom_values.calc_czk_year}} Kč ročně

Počítal jsem opatrně, s úsporou 40 % času.

Jedna věc v tom čísle chybí. Kalkulačka počítá, kolik ty hodiny stojí. Nepočítá, kolik by vydělaly, kdyby je obchodník strávil u klientů. To číslo bývá několikrát vyšší.

Zítra vám napíšu, kdy mi to samotnému došlo. Byl to pátek odpoledne a nebyl to příjemný pohled.

[JMÉNO]

P.S. Jestli jste stahovali prompty pro obchodníky, jsou tady: [odkaz]. Začněte číslem 3, příprava na schůzku.

*(Varianta pro prompt pack bez kalkulačky: první tři odstavce nahradit „posílám 25 promptů pro obchodníka: [odkaz]. Začněte číslem 3. Zabere to deset minut a zítřejší schůzka bude vypadat jinak.")*

### 1.2 – Den 2 (příběh, drama)
- **Předmět A:** Pátek, 16:40, osm lidí u CRM
- **Předmět B:** Za co jsem vlastně platil obchodníky
- **Preheader:** Chvíle, kdy jsem přestal věřit výkazům.

Dobrý den, {{contact.first_name}},

sedmnáct let dělám obchod. Většinu z toho jsem vedl týmy, od pěti lidí po osmdesát.

**[OVĚŘIT příběh]** Jeden pátek odpoledne jsem prošel kanceláří a všiml si, že skoro celý tým sedí u počítače a doplňuje CRM. Schůzky z pondělí, z úterý, ze středy. Zpaměti. V pondělí byla porada a všichni věděli, že se na to budu dívat.

Došly mi dvě věci. Zaprvé, že data, podle kterých řídím obchod, jsou vzpomínky z pátečního odpoledne. Zadruhé, že platím obchodníky za to, aby psali.

Zkusil jsem to, co každý: nový proces, školení, kontrolu. Vydrželo to tři týdny.

Co nakonec zabralo, vám napíšu zítra. Nebylo to žádné kouzlo a napoprvé to nefungovalo.

[JMÉNO]

### 1.3 – Den 4 (zvrat, epifanie)
- **Předmět A:** Proč jedno AI školení nestačí
- **Předmět B:** Všichni kývali. V pondělí nic.
- **Preheader:** Chyba, kterou jsem udělal já a dělá ji většina firem.

Dobrý den, {{contact.first_name}},

když přišla AI, myslel jsem, že mám vyhráno.

**[OVĚŘIT příběh]** Sám jsem si s ní zkrátil přípravu na schůzku ze zhruba čtyřiceti minut na deset. Zápis jsem měl hotový dřív, než jsem odjel z parkoviště. Tak jsem to ukázal týmu. Dvě hodiny, nadšení, otázky, všichni kývali.

V pondělí pracovali všichni stejně jako předtím.

Chvíli mi trvalo, než jsem pochopil proč. Ukázal jsem jim nástroj. Nezměnil jsem jim postup. A návyk se nezmění za odpoledne, mění se opakováním na skutečné práci.

Tři věci, které rozhodují, jestli tým AI opravdu začne používat:

1. Učí se na vlastních zakázkách, ne na cvičných příkladech.
2. Trvá to týdny, ne hodiny. Každý týden jedna věc.
3. Někdo to měří. Co se neměří, vyprchá.

Na tomhle stojí náš program. Ale i kdybyste to dělali sami, držte se těch tří bodů.

Pozítří vám pošlu postup na přípravu schůzky za 10 minut. Můžete ho zkusit hned.

[JMÉNO]

### 1.4 – Den 6 (hodnota, skrytý přínos)
- **Předmět A:** Příprava na schůzku za 10 minut (postup)
- **Předmět B:** Zkuste tohle před příští schůzkou
- **Preheader:** Tři kroky, jeden prompt. Funguje v ChatGPT, Copilotu i Claude.

Dobrý den, {{contact.first_name}},

slíbený postup. Zabere deset minut.

**Krok 1 (3 min):** Otevřete web klienta a jeho profil na LinkedInu. Zkopírujte stránku „O nás" a poslední dvě aktuality. Jen veřejné informace, nic interního.

**Krok 2 (2 min):** Vložte to do AI s tímto zadáním:

„Jsem obchodník ve firmě, která prodává [co prodáváte] firmám jako [typ klienta]. Zítra mám první schůzku s [pozice] ve firmě, o které jsou informace níže. Připrav mi brief na jednu stranu: 1) co firma dělá a co se u ní teď děje, 2) tři pravděpodobné priority člověka na této pozici, 3) pět otevřených otázek, kterými zjistím potřebu, 4) co z naší nabídky dává smysl a proč, 5) na co si dát pozor. Kde si nejsi jistý, napiš to."

**Krok 3 (5 min):** Přečtěte si to a opravte, co nesedí. AI se plete, vy klienta znáte. Vyberte dvě otázky, které určitě položíte.

Jedno pravidlo: do veřejné verze AI nikdy nevkládejte ceníky, smlouvy ani osobní údaje. Co kam smí, je první věc, kterou s týmy řešíme.

Skrytý přínos, který mě překvapil: obchodníci, kteří se takhle připravují, se na schůzce víc ptají a míň prezentují. A to prodává.

Kdybyste chtěli vědět, kolik času by tohle ušetřilo celému vašemu týmu, spočítáme to spolu za 30 minut: [odkaz na audit]

[JMÉNO]

### 1.5 – Den 9 (námitky + nabídka)
- **Předmět A:** „Na to nemáme čas"
- **Předmět B:** Tři důvody, proč to firmy odkládají
- **Preheader:** A proč je ten první vlastně argument pro.

Dobrý den, {{contact.first_name}},

když se s řediteli bavím o AI v obchodě, slyším tři věty.

**„Nemáme na to čas."** Rozumím. Jenže čas nemáte právě proto, že tým dělá ručně věci, které ručně dělat nemusí. Den týdně po dobu osmi týdnů vypadá jako hodně. Od třetího týdne si ho ale tým vrací.

**„Bojíme se o data."** Oprávněně. Jenže vaši lidé AI nejspíš používají už teď, jen o tom nevíte a nemají pravidla. Zákaz nefunguje. Fungují pravidla a firemní účty.

**„Už jsme školení měli."** Jednodenní? Pak vím, jak to dopadlo. Viz můj email z minulého týdne.

Proto vypadá náš program takhle: osm týdnů, jeden den týdně, u vás, na vašich zakázkách. První den pravidla pro data. Na začátku a na konci měříme stopkami. Cíl jsou tři hodiny týdně zpět pro každého obchodníka. Když ho tým nedosáhne, školíme dál zdarma.

Jestli to dává smysl u vás, zjistíme na auditu. 30 minut, zdarma, odnesete si číslo a tři kroky.

Vybrat termín: [odkaz na audit]

[JMÉNO]

### 1.6 – Den 13 (urgence + poslední výzva)
- **Předmět A:** Místa v kohortě {{custom_values.next_cohort_month}}
- **Předmět B:** Poslední email k tomuhle tématu
- **Preheader:** Pak už jen občasné tipy, slibuju.

Dobrý den, {{contact.first_name}},

krátce a věcně.

Vedu nejvýš dvě skupiny najednou. Nejbližší kohorta startuje {{custom_values.next_cohort_date}} a volná jsou {{custom_values.next_cohort_spots}} místa.

Pokud chcete čerpat dotaci, žádost se musí podat před zahájením a schválení chvíli trvá. Pro tento termín by měla odejít do {{custom_values.subsidy_deadline}}.

Jestli je to pro vás téma, začněte auditem: [odkaz]

Jestli ne, je to v pořádku. Tímhle emailem končím s nabídkami. Dál vám jednou za čtrnáct dní pošlu jeden praktický tip pro obchod s AI. Odhlásit se můžete kdykoli dole.

[JMÉNO]

---

## SEKVENCE 2 – Po rezervaci auditu (show-up)

4 emaily + 2 SMS. **Ukončení:** audit proběhl / zrušen / přesunut (restart s novým časem).

### 2.1 – Email hned po rezervaci
- **Předmět A:** Potvrzeno: audit {{appointment.start_time}}
- **Předmět B:** Máte to v kalendáři. Jedna prosba.
- **Preheader:** Odkaz na hovor a tříminutová příprava.

Dobrý den, {{contact.first_name}},

audit je potvrzený.

Kdy: {{appointment.start_time}}
Kde: Google Meet, {{appointment.meeting_location}}
Délka: 30 minut

Jedna prosba, aby výsledné číslo sedělo: zeptejte se dvou obchodníků, kolik času jim zabere příprava na schůzku, zápis po ní a jedna nabídka. Stačí odhad. Odpovědi zapište sem (3 minuty): [odkaz na přípravu]

A pokud o vzdělávání obchodu rozhoduje ještě někdo další, pozvěte ho rovnou. Ušetříte si jedno kolo.

Potřebujete jiný termín? Změníte ho tady: {{appointment.reschedule_link}}

Těším se.
[JMÉNO]

### 2.2 – SMS hned po rezervaci
`Boostia: audit potvrzen na {{appointment.start_time}}. Odkaz a kratka priprava jsou v e-mailu. [JMENO]`

### 2.3 – Email 2 dny před (pokud je rezervace dál než 3 dny)
- **Předmět A:** Co na auditu uvidíte
- **Předmět B:** Ukázka: výpočet pro tým 10 lidí
- **Preheader:** Jak vypadá výstup, který dostanete do 24 hodin.

Dobrý den, {{contact.first_name}},

ať víte, do čeho jdete. Takhle vypadá výstup auditu pro modelový tým deseti obchodníků:

Příprava schůzek: 33 hodin týdně
Zápisy, CRM, follow-upy: 33 hodin týdně
Nabídky: 30 hodin týdně
Celkem neprodejní práce: 96 hodin týdně
Při úspoře 40 %: 38 hodin týdně
Co slibujeme a garantujeme: 30 hodin týdně, tedy 3 hodiny na člověka
V penězích při 600 Kč za hodinu a 46 pracovních týdnech: 828 000 Kč ročně

*(Modelový příklad pro ilustraci, ne výsledek konkrétního klienta.)*

Vaše čísla budou jiná. Proto se ptám na tu tříminutovou přípravu: [odkaz]. Vyplněná je zatím u {{custom_values.prep_status}}.

Ve {{appointment.start_time}} na viděnou.
[JMÉNO]

### 2.4 – Email den předem
- **Předmět A:** Zítra v {{appointment.only_start_time}}
- **Předmět B:** Zítřejší audit: tři otázky, které položím
- **Preheader:** Ať vás nezaskočí.

Dobrý den, {{contact.first_name}},

zítra v {{appointment.only_start_time}} se vidíme na Meetu: {{appointment.meeting_location}}

Zeptám se hlavně na tohle:
1. Jak vypadá týden vašeho obchodníka?
2. Co se děje po schůzce, než je zápis v CRM a follow-up u klienta?
3. Jak dlouho trvá nabídka od poptávky po odeslání?

Nic si nepřipravujte, stačí vědět, jak to u vás chodí.

Kdyby vám do toho něco vlezlo, přesuňte si termín tady, ať místo může využít někdo jiný: {{appointment.reschedule_link}}

[JMÉNO]

### 2.5 – SMS 2 hodiny předem
`Dobry den, dnes v {{appointment.only_start_time}} mame audit. Odkaz: {{appointment.meeting_location}} Kdyby neco, volejte [TEL]. [JMENO], Boostia`

### 2.6 – Email 10 minut předem
- **Předmět A:** Za 10 minut začínáme
- **Předmět B:** Odkaz na audit
- **Preheader:** Jedním klikem.

Jsem připravený. Odkaz: {{appointment.meeting_location}}

[JMÉNO]

---

## SEKVENCE 3 – No-show recovery

3 emaily + 1 SMS. Spouští status schůzky `no-show`. **Ukončení:** nová rezervace; odpověď; po 3. emailu tag `no-show-uzavreno` a přesun do newsletteru.

### 3.1 – Email 15 minut po začátku
- **Předmět A:** Čekal jsem na Meetu
- **Předmět B:** Nepovedlo se nám to dnes
- **Preheader:** Nic se neděje, tady je nový termín.

Dobrý den, {{contact.first_name}},

dnes jsme se na auditu minuli. Chápu, že se den občas zvrtne.

Nový termín si vyberete tady, jsou tam i časy brzy ráno a v podvečer: {{custom_values.audit_link}}

[JMÉNO]

### 3.2 – SMS 2 hodiny po
`Dobry den, dnes jsme se na auditu minuli. Novy termin si vyberete zde: {{custom_values.audit_short_link}} [JMENO], Boostia`

### 3.3 – Email den 2
- **Předmět A:** Mám to pro vás předpočítat?
- **Předmět B:** Tři čísla a pošlu vám výsledek
- **Preheader:** Když není čas na hovor, zkusme to e-mailem.

Dobrý den, {{contact.first_name}},

jestli se 30 minut těžko hledá, zkusme to jinak. Odpovězte mi na tenhle email třemi čísly:

1. Kolik lidí u vás obchoduje?
2. Kolik schůzek týdně má jeden z nich?
3. Jak dlouho trvá jedna nabídka?

Pošlu vám zpátky hrubý výpočet. A pak se rozhodnete, jestli má hovor smysl.

[JMÉNO]

### 3.4 – Email den 6
- **Předmět A:** Mám to uzavřít?
- **Předmět B:** Poslední zpráva k auditu
- **Preheader:** Stačí odpovědět jedním slovem.

Dobrý den, {{contact.first_name}},

nechci vás zahlcovat. Předpokládám, že teď je priorita jinde.

Uzavírám to u sebe. Kdyby se téma vrátilo, termín si vyberete tady: {{custom_values.audit_link}}

A kdyby byl důvod jiný (špatné načasování, špatný člověk, něco vám na tom nesedí), budu rád, když mi to napíšete. Jedním slovem stačí.

[JMÉNO]

---

## SEKVENCE 4 – Po auditu bez nákupu

6 emailů + 2 telefonáty (úkol v pipeline: den 2 a den 8). Spouští přesun dealu do fáze „Nabídka odeslána". **Ukončení:** podpis; výslovné „ne" (tag `prohra` + důvod); odpověď (pozastavit). Po emailu 4.6 přesun do newsletteru a úkol „ozvat se za 90 dní".

### 4.1 – Do 24 hodin (report)
- **Předmět A:** Report z auditu: {{custom_values.audit_hours_week}} hodin týdně
- **Předmět B:** {{contact.company_name}}: čísla z našeho hovoru
- **Preheader:** Jedna strana, tři kroky, návrh dalšího postupu.

Dobrý den, {{contact.first_name}},

díky za včerejší hovor. V příloze máte report na jednu stranu. To hlavní:

Neprodejní práce týmu: {{custom_values.audit_nonselling_hours}} hodin týdně
Opatrný odhad úspory: {{custom_values.audit_hours_week}} hodin týdně
V penězích: {{custom_values.audit_czk_year}} Kč ročně

Zapsal jsem si i to, co jste řekl(a) jako největší potíž: „{{custom_values.audit_pain_quote}}"

Tři kroky, které můžete udělat hned, najdete v reportu. Fungují i bez nás.

Náš návrh: AI Obchod 50, start {{custom_values.next_cohort_date}}, 290 000 Kč, s dotací pro váš tým odhadem {{custom_values.price_after_subsidy}} Kč. První den na naše riziko, výsledek garantujeme měřením.

Domluvili jsme se, že se k tomu vrátíme {{custom_values.followup_date}}. Kdybyste mezitím cokoli potřebovali pro kolegy nebo vedení, napište.

[JMÉNO]

### 4.2 – Den 3 (jak měříme = důkaz místo referencí)
- **Předmět A:** Jak přesně měříme výsledek
- **Předmět B:** Stopky, ne dotazník spokojenosti
- **Preheader:** Metodika, kterou si můžete projít předem.

Dobrý den, {{contact.first_name}},

nejčastější otázka po auditu: „A jak poznám, že to fungovalo?"

První týden každý účastník stopuje pět činností na skutečné práci: přípravu schůzky, zápis, follow-up, nabídku a dohledání informace. Osmý týden znovu. Počítáme průměr za celý tým, ne nejlepšího jednotlivce.

Vy dostanete tabulku před a po, v hodinách týdně a v korunách ročně.

Na tom stojí i garance. Když tým s účastí aspoň 80 % nezíská v průměru tři hodiny týdně na člověka, školíme dál zdarma, až 20 hodin. Když to ani pak nevyjde, vracíme čtvrtinu ceny.

Celou metodiku posílám v příloze. [PROOF: až bude, přidat „Takhle dopadlo měření u týmu X: …"]

[JMÉNO]

### 4.3 – Den 6 (námitka: čas týmu)
- **Předmět A:** Den týdně mimo terén?
- **Předmět B:** Co obchodníci v ten den vlastně dělají
- **Preheader:** Připravují skutečné schůzky a píšou skutečné nabídky.

Dobrý den, {{contact.first_name}},

rozumím obavě, že den týdně je pro obchod hodně.

Jak takový den vypadá: dopoledne ukážu postup, třeba nabídku. Odpoledne každý píše nabídku, kterou má ten týden stejně odeslat. Odchází s hotovou prací, ne s poznámkami ze školení.

Kde to firmě nesedí, dělíme den na dva půldny. A termíny domlouváme tak, aby nekolidovaly s uzávěrkou nebo veletrhem.

Jestli by vám pomohlo probrat to s vedoucím týmu, rád se připojím na 15 minut.

[JMÉNO]

### 4.4 – Den 9 (dotace)
- **Předmět A:** Dotace pro {{contact.company_name}}: ověřeno
- **Předmět B:** Kolik by vás program stál po dotaci
- **Preheader:** A co je potřeba stihnout do {{custom_values.subsidy_deadline}}.

Dobrý den, {{contact.first_name}},

prošel jsem podmínky pro vaši firmu. [DOPLNIT podle skutečného ověření; neodesílat automaticky bez něj]

Pro {{custom_values.participants}} účastníků a 50 hodin vychází příspěvek na vzdělávání na {{custom_values.subsidy_amount}} Kč. Cena programu po dotaci: {{custom_values.price_after_subsidy}} Kč. K tomu příspěvek na mzdy za dobu školení.

Co to obnáší: žádost připravíme s vaším HR, od vás potřebujeme zhruba dvě až čtyři hodiny. Program nejdřív zaplatíte, příspěvek přijde po dokončení. Schválení zaručit neumím, rozhoduje Úřad práce. Proto máme ve smlouvě, že při zamítnutí můžete odstoupit bez sankce.

Aby se stihl start {{custom_values.next_cohort_date}}, měla by žádost odejít do {{custom_values.subsidy_deadline}}.

Mám poslat vašemu HR seznam podkladů?

[JMÉNO]

### 4.5 – Den 13 (menší krok)
- **Předmět A:** Menší krok: jeden den za 39 000 Kč
- **Předmět B:** Když je 290 tisíc na první krok moc
- **Preheader:** AI Start den. Když pak půjdete dál, celou částku odečteme.

Dobrý den, {{contact.first_name}},

možná je celý program na první krok velké rozhodnutí. Nabízím menší.

AI Start den: jeden den s celým vaším týmem, u vás. Nastavíme pravidla pro data, tým se naučí přípravu schůzky a zápis s AI a změříme výchozí stav. Odpoledne už všichni pracují na svých zakázkách.

Cena je 39 000 Kč. Když se do 30 dnů rozhodnete pro program, celou částku odečteme. Když ne, zůstanou vám pravidla, dva postupy a vlastní čísla.

Nejbližší volné dny: {{custom_values.start_day_dates}}

Stačí odpovědět, který se hodí.

[JMÉNO]

### 4.6 – Den 18 (deadline + uzavření)
- **Předmět A:** Kohorta {{custom_values.next_cohort_month}}: v pátek uzavírám
- **Předmět B:** Mám vám místo držet?
- **Preheader:** Stačí ano, ne, nebo později.

Dobrý den, {{contact.first_name}},

v pátek uzavírám obsazení kohorty, která startuje {{custom_values.next_cohort_date}}. Volná jsou {{custom_values.next_cohort_spots}} místa a po pátku už se nestihne ani dotační žádost.

Potřebuju od vás jedno ze tří:

**Ano** – pošlu smlouvu a ozvu se vašemu HR.
**Později** – napište kdy, další kohorta startuje {{custom_values.following_cohort_date}}.
**Ne** – v pořádku. Budu rád, když mi napíšete proč, pomůže mi to.

Ať už to dopadne jakkoli, report z auditu a tři kroky vám zůstávají.

[JMÉNO]

---

## SEKVENCE 5 – Onboarding po nákupu

4 emaily. Spouští fáze dealu „Vyhráno". **Ukončení:** start programu (týden 1).

### 5.1 – Hned po podpisu (příjemce: jednatel + ředitel + HR)
- **Předmět A:** Vítejte. Co se bude dít do startu.
- **Předmět B:** AI Obchod 50 pro {{contact.company_name}}: plán
- **Preheader:** Čtyři kroky a kdo co udělá.

Dobrý den,

děkuju za důvěru. Tady je plán do startu {{custom_values.program_start_date}}:

1. **Tento týden:** s vaším HR připravíme a podáme žádost o dotaci. Seznam podkladů posílám zvlášť.
2. **Do 10 dnů:** pošlete mi jména a e-maily účastníků a jméno jednoho AI šampiona (někdo z týmu, koho to baví).
3. **Týden před startem:** každý účastník dostane krátký dotazník a pozvánku. Ověříme účty a přístupy s vaším IT.
4. **{{custom_values.program_start_date}}:** tříhodinový start online, měření výchozího stavu.

Od vás budu potřebovat: místnost s projektorem na šest celodenních setkání, pět vašich nejlepších nabídek a export klientů z CRM. Data zůstávají ve vašich systémech.

Připomínám garanci: první den je na naše riziko.

Kdykoli volejte: [TEL]
[JMÉNO]

### 5.2 – Den 3 (pro ředitele: jak to říct týmu)
- **Předmět A:** Jak program oznámit týmu (hotový text)
- **Předmět B:** Tři věty, které rozhodnou o přístupu týmu
- **Preheader:** Zkopírujte, upravte, pošlete.

Dobrý den, {{contact.first_name}},

to, jak program týmu představíte, ovlivní výsledek víc než cokoli, co řeknu já první den. Tři věci, které by měly zaznít:

1. Nejde o kontrolu ani o náhradu lidí. Jde o to, zbavit je práce, která je nebaví.
2. Bude se pracovat na jejich skutečných zakázkách. Nikdo nepřijde o čas.
3. Vy jako ředitel u toho budete první a poslední den.

Text, který můžete poslat:

„Kolegové, od {{custom_values.program_start_date}} nás čeká osm týdnů programu AI Obchod 50. Jeden den týdně se budeme učit, jak si s pomocí AI zkrátit přípravu schůzek, zápisy, nabídky a CRM. Pracovat budeme na vlastních klientech a zakázkách. Cíl: aby každý z nás měl aspoň tři hodiny týdně navíc na klienty. Na začátku a na konci si změříme, kolik času nám tyhle věci berou. První setkání je {{custom_values.program_start_date}}, budu tam s vámi."

[JMÉNO]

### 5.3 – 7 dní před startem (pro účastníky)
- **Předmět A:** Za týden začínáme: 3 věci předem
- **Předmět B:** AI Obchod 50: co si připravit
- **Preheader:** Zabere to 15 minut.

Dobrý den, {{contact.first_name}},

jsem [JMÉNO] a příštích osm týdnů budeme pracovat spolu. Sedmnáct let dělám obchod, takže se nebojte přednášek o technologiích. Budeme řešit schůzky, nabídky a klienty.

Před prvním setkáním prosím o tři věci:

1. Vyplňte krátký dotazník (5 minut): [odkaz]
2. Ověřte, že se přihlásíte do {{custom_values.ai_tool}}: [odkaz]
3. Vyberte si jednu schůzku, kterou máte v týdnu po startu. Budeme se na ni připravovat.

Žádná předchozí zkušenost s AI není potřeba.

Na viděnou {{custom_values.program_start_date}}.
[JMÉNO]

### 5.4 – 1 den před startem (rychlá výhra)
- **Předmět A:** Zítra v {{custom_values.program_start_time}} + jeden pokus na dnešek
- **Předmět B:** Vyzkoušejte si to ještě před startem
- **Preheader:** Dvě minuty, jeden prompt.

Dobrý den, {{contact.first_name}},

zítra začínáme: {{custom_values.program_start_time}}, {{custom_values.program_location}}.

Jestli máte dvě minuty, zkuste si dnes jednu věc. Vezměte poslední e-mail od klienta, na který musíte odpovědět (bez citlivých údajů), a zadejte AI:

„Navrhni odpověď na tento e-mail. Stručně, věcně, vykání, na konci konkrétní další krok s návrhem dvou termínů."

Výsledek upravte a pošlete. Zítra mi řeknete, co na tom sedělo a co ne. Přesně na tom budeme stavět.

[JMÉNO]

---

## SEKVENCE 6 – Nurture / newsletter

**Název:** „Tři hodiny" · **Kadence:** každé druhé úterý v 7:30 · **Délka:** do 250 slov · **Ukončení:** odhlášení; rezervace auditu přesouvá kontakt do sekvence 2 (newsletter chodí dál).

### Šablona
- **Předmět:** [konkrétní výsledek nebo situace, do 45 znaků]
- **Preheader:** [co si čtenář odnese]

Dobrý den, {{contact.first_name}},

**[Situace z obchodní praxe, 2–3 věty.]**

**[Postup ve 3 krocích nebo jeden prompt ke zkopírování.]**

**[Na co si dát pozor, 1–2 věty.]**

**[Jedna věta navíc: co jsme tento měsíc viděli u týmů / změřili.]** [PROOF: průběžně doplňovat]

[JMÉNO]

P.S. Chcete vědět, kolik času by AI vrátila vašemu týmu? Audit zdarma: [odkaz]

### 12 témat (půl roku)
1. Zápis ze schůzky do 15 minut: postup od nahrávky po CRM
2. Follow-up, který klient otevře: prompt a tři chyby
3. Co do AI nikdy nevkládat (semafor na jednu stranu)
4. Nabídka do 24 hodin: jak naučit AI vaši strukturu
5. Příprava na cenovou námitku: AI jako protistrana
6. Pondělní seznam cross-sell příležitostí z exportu CRM
7. Jak poznat, že vám AI něco vymyslela, a jak jí to zatrhnout
8. Oslovení, které nezní jako šablona: pět řádků
9. Porada obchodu s AI: příprava ředitele za 20 minut
10. Zaučení nového obchodníka: asistent místo šanonu
11. Dotace na vzdělávání: co se aktuálně změnilo [OVĚŘIT před odesláním]
12. Co jsme změřili u týmů za poslední čtvrtletí [PROOF]

---

## SEKVENCE 7 – Cold outbound

**Cílovka:** firmy 20–250 zaměstnanců s obchodním týmem 4+ lidí. **Objem:** 30 nových kontaktů denně ze 2–3 schránek na samostatné doméně. **Ukončení:** jakákoli odpověď; rezervace; odhlášení („nemám zájem" → tag `nezajem`, 12 měsíců neoslovovat).
**Právní poznámka:** oslovujeme firemní adresy konkrétních lidí s nabídkou související s jejich pracovní rolí, s identifikací odesílatele a možností odmítnout další zprávy. **[OVĚŘIT s právníkem: oprávněný zájem, § 7 zák. č. 480/2004 Sb.]**
**Personalizace:** `{{prvni_veta}}` = jedna věta o konkrétní firmě (nábor obchodníka, nový produkt, veletrh, expanze). Bez ní neodesílat.

### Krok 1 – Den 1: první email, 3 varianty podle role

**1A – Obchodní ředitel**
- **Předmět A:** zápisy ze schůzek v {{company}}
- **Předmět B:** {{first_name}}, otázka k vašemu obchodu
- **Preheader:** Krátký dotaz, odpověď jedním slovem stačí.

Dobrý den, pane/paní {{last_name}},

{{prvni_veta}}

Mám na vás jednu otázku z praxe: kolik času týdně stráví vaši obchodníci přípravou schůzek, zápisy a nabídkami místo jednání s klienty?

Sedmnáct let jsem vedl obchodní týmy a u většiny z nich to byly hodiny denně. Dnes učíme obchodní týmy tuhle práci zkrátit s pomocí AI. Osm týdnů, na jejich vlastních zakázkách, a výsledek měříme stopkami. Cíl jsou tři hodiny týdně na obchodníka.

Dává smysl podívat se na to u vás? Za 30 minut vám spočítám, o kolik hodin a korun jde.

[JMÉNO]
Boostia · [web] · [telefon]

Nechcete další zprávy? Stačí odpovědět „ne".

**1B – Jednatel / majitel**
- **Předmět A:** {{company}}: kolik hodin obchodu není prodej
- **Předmět B:** dotaz k obchodnímu týmu {{company}}
- **Preheader:** Jedno číslo, které většina majitelů nezná.

Dobrý den, pane/paní {{last_name}},

{{prvni_veta}}

U firem vaší velikosti počítáme jednu věc: kolik hodin týdně obchodníci tráví prací, kterou dnes zvládne AI. Přípravy, zápisy, nabídky, CRM. U týmu deseti lidí to při opatrném odhadu dělá kolem 30 hodin týdně.

Učíme obchodní týmy, jak ten čas získat zpět. Bezpečně, s pravidly pro data, a s měřením na začátku a na konci. Na program lze čerpat dotaci z Úřadu práce.

Měl byste 30 minut na to, abychom to číslo spočítali pro {{company}}? Dostanete ho, i kdybychom dál nespolupracovali.

[JMÉNO]
Boostia · [web] · [telefon]

Nechcete další zprávy? Stačí odpovědět „ne".

**1C – HR / L&D**
- **Předmět A:** AI školení obchodu s dotací (50 hodin)
- **Předmět B:** {{first_name}}, řešíte AI vzdělávání pro obchod?
- **Preheader:** Program stavěný na podmínky Úřadu práce.

Dobrý den, paní/pane {{last_name}},

{{prvni_veta}}

Jestli u vás vedení řeší, jak naučit lidi pracovat s AI, mám pro vás jednu možnost pro obchodní tým.

Padesátihodinový program přímo pro obchodníky, rozložený do osmi týdnů. Rozsah odpovídá podmínkám projektu Vzdělávání pro firmy, takže lze žádat o příspěvek na školení i na mzdy. Osnovu, harmonogram a podklady k žádosti připravíme s vámi, vedeme prezenční listiny a vystavujeme osvědčení. Výsledek měříme, takže máte co vykázat.

Můžu vám poslat osnovu a orientační výpočet dotace pro váš tým? Stačí napsat, kolik lidí u vás obchoduje.

[JMÉNO]
Boostia · [web] · [telefon]

Nechcete další zprávy? Stačí odpovědět „ne".

### Krok 2 – Den 4 (odpověď ve vlákně, hodnota)
- **Předmět:** Re: [původní předmět] *(B: bez předmětu, ve vlákně)*
- **Preheader:** Postup, který můžete vyzkoušet ještě dnes.

Dobrý den, pane/paní {{last_name}},

ať nepíšu jen s prosbou: tady je postup, který týmy učíme druhý týden. Příprava na schůzku za 10 minut.

Obchodník vloží do AI veřejné informace o klientovi a zadá: „Připrav brief na jednu stranu: co firma dělá, tři pravděpodobné priority člověka na pozici X, pět otázek na zjištění potřeby, co z naší nabídky dává smysl a na co si dát pozor."

Zkuste to dát jednomu obchodníkovi před zítřejší schůzkou. Uvidíte rozdíl.

Kdybyste chtěli vědět, co by to udělalo v celém týmu, nabídka 30 minut platí.

[JMÉNO]

### Krok 3 – Den 9 (nový úhel: riziko a kalkulačka)
- **Předmět A:** co vaši obchodníci kopírují do ChatGPT
- **Předmět B:** dvě minuty: kalkulačka pro {{company}}
- **Preheader:** Bez registrace, výsledek v korunách.

Dobrý den, pane/paní {{last_name}},

ještě jeden pohled. Ve většině firem, se kterými mluvím, obchodníci AI už používají. Bez pravidel a z osobních účtů. Vedení neví, jestli tam nekončí ceníky a údaje o klientech.

Proto u nás první den nezačíná triky, ale pravidly: co do AI smí, co ne, a firemní účty.

Jestli nechcete hovor, zkuste aspoň kalkulačku. Za dvě minuty ukáže, kolik hodin a korun ročně u vás padne na neprodejní práci: [odkaz]

[JMÉNO]

### Krok 4 – Den 16 (rozloučení)
- **Předmět A:** mám to uzavřít?
- **Předmět B:** poslední zpráva
- **Preheader:** Jedno slovo jako odpověď stačí.

Dobrý den, pane/paní {{last_name}},

nechci vás zahlcovat, tohle je ode mě poslední zpráva.

Pokud AI v obchodě teď není téma, rozumím. Pokud je, ale řeší ho někdo jiný, budu vděčný za jméno.

A kdyby se to hodilo později, kohorty startují pětkrát ročně a audit je vždy zdarma: [odkaz]

Ať se obchodu daří.
[JMÉNO]

### LinkedIn – 3 kroky (souběžně s emaily)

**L1 – Den 2: žádost o spojení (do 300 znaků)**
- **Varianta A:** „Dobrý den, pane/paní {{last_name}}, vedl jsem 17 let obchodní týmy a teď učím obchodníky zkracovat s AI přípravy, zápisy a nabídky. Sleduji, jak to řeší firmy ve vašem oboru. Rád se propojím."
- **Varianta B:** „Dobrý den, {{prvni_veta_kratka}} Věnuji se AI v obchodních týmech, rád bych vás měl v síti."
- **Ukončení:** nepřijetí do 14 dnů → dál jen e-mail.

**L2 – Den 6 (po přijetí): zpráva bez prodeje**
- **Varianta A:** „Díky za propojení. Jedna otázka ze zvědavosti: používají u vás obchodníci AI na něco pravidelně, nebo to zatím každý zkouší po svém?"
- **Varianta B:** „Díky za propojení. Sbírám od obchodních ředitelů jedno číslo: jak dlouho u vás trvá nabídka od poptávky po odeslání? Rád se podělím o to, co vidím jinde."
- **Ukončení:** odpověď → ruční konverzace.

**L3 – Den 12: nabídka hodnoty**
- **Varianta A:** „Posílám kalkulačku, kterou používáme na auditech. Za dvě minuty ukáže, kolik hodin týdně tým tráví neprodejní prací: [odkaz]. Kdybyste chtěl výsledek probrat, mám 30 minut zdarma."
- **Varianta B:** „Sepsal jsem 25 promptů, které obchodníci používají na přípravu schůzek, zápisy a nabídky. Mám vám je poslat?"
- **Ukončení:** bez reakce → žádné další zprávy; kontakt zůstává v publiku obsahu.

## Self-review fáze 7

**Kolo 1 – slabiny:** (1) Emaily zněly jako newsletter („V dnešním vydání…") → přepsáno na krátké osobní zprávy s jedním odkazem. (2) Sekvence po auditu stála na „case study" a recenzích, které nemáme → nahrazeno metodikou měření, garancí a menším krokem; proof jako placeholder. (3) Cold emaily začínaly představením firmy → začínají větou o příjemci a otázkou.
**Kolo 2 – slabiny:** (1) Příběhové emaily mohly obsahovat detaily, které se nestaly → označeny [OVĚŘIT příběh], s pokynem neodesílat neověřené. (2) Email 4.4 o dotaci by se odeslal i bez skutečného ověření → podmínka: jen po ručním doplnění polí. (3) Modelový výpočet v 2.3 mohl vypadat jako výsledek klienta → výslovně označen jako modelový a čísla přepočítána (10 lidí × 5 schůzek × 40 min = 33 h atd.).
**Kolo 3:** sjednocení cen, garance, termínů; kontrola zakázaných slov; SMS bez diakritiky a do 160 znaků.

| Kritérium | Kolo 1 | Kolo 2 | Finál |
|---|---|---|---|
| Konkrétnost | 8 | 9 | 9 |
| Přesvědčivost | 7 | 8 | 9 |
| Jasnost | 8 | 9 | 9,5 |
| Konzistence | 8 | 9 | 9,5 |
| Proveditelnost | 8 | 9 | 9 |
| Pravdivost | 6 | 8 | 9 (za podmínky ověření příběhů) |
