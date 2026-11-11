# FÁZE 8 – Lead magnety a obsah

## 8.1 Tři lead magnety

| # | Lead magnet | Pro koho | Síla | Slabina |
|---|---|---|---|---|
| 1 | **Kalkulačka ztraceného času obchodu** (na webu, výsledek v Kč, podrobný výpočet e-mailem) | jednatel, obchodní ředitel | Vlastní číslo v korunách. Přímo vede k auditu (ten je „kalkulačka s člověkem"). Sama ukazuje, že umíme stavět. | Nedá se „přeposlat týmu". |
| 2 | **25 promptů pro obchodníka** (PDF) | obchodní ředitel, obchodníci | Okamžitě použitelné, šíří se v týmu, dobrý dárek po LinkedIn konverzaci. | Přitahuje i jednotlivce bez rozpočtu. |
| 3 | **Semafor: co do AI smí a nesmí** (checklist bezpečného používání AI ve firmě, 1 strana + vzor pravidel) | jednatel, HR, IT | Odpovídá na strach z úniku dat, dobře se sdílí vedení. | Dál od obchodního výsledku. |

**Vítěz: kalkulačka.** Je nejblíž nákupnímu rozhodnutí: převádí vágní pocit („obchod je pomalý") na číslo v Kč, které je hlavní osou auditu, nabídky i garance. Prompt pack je druhý v pořadí jako doplněk (děkovná stránka, outbound, LinkedIn), semafor jako obsah pro jednatele a HR. Níže je kompletní kalkulačka (logika, texty, e-mailový report) a také kompletní prompt pack, protože se na něj odkazují emaily z fáze 7.

## 8.2 Kalkulačka ztraceného času: kompletní specifikace

**Název:** Kolik stojí neprodejní práce váš obchodní tým?
**Úvod:** Sedm čísel, dvě minuty. Výsledek v hodinách týdně a korunách ročně. Bez registrace.

**Vstupy**

| Pole | Popisek | Výchozí | Rozsah | Nápověda |
|---|---|---|---|---|
| `reps` | Kolik lidí u vás obchoduje? | 10 | 2–60 | Včetně key account manažerů. |
| `meetings` | Kolik schůzek nebo delších hovorů týdně má jeden z nich? | 5 | 1–15 | Osobních i online. |
| `prepMin` | Kolik minut zabere příprava na jednu schůzku? | 40 | 5–120 | Hledání informací, podklady, prezentace. |
| `notesMin` | Kolik minut zabere zápis, CRM a follow-up po schůzce? | 40 | 5–120 | Dohromady. |
| `offers` | Kolik nabídek týdně připraví jeden obchodník? | 1,5 | 0–10 | Průměr. |
| `offerHours` | Kolik hodin zabere jedna nabídka? | 2 | 0,5–10 | Od poptávky po odeslání, čistý čas. |
| `hourCost` | Kolik vás stojí hodina obchodníka? | 600 Kč | 300–1 500 | Mzda s odvody, auto, režie. Nevíte? Roční náklad vydělte 1 700. |

**Výpočet**
```
prepHours   = reps × meetings × prepMin / 60
notesHours  = reps × meetings × notesMin / 60
offerHrs    = reps × offers × offerHours
nonSelling  = prepHours + notesHours + offerHrs          (hodin týdně)
saved       = nonSelling × 0,40                           (opatrný odhad)
savedPerRep = saved / reps
czkYear     = saved × hourCost × 46                       (46 pracovních týdnů)
meetingsGained = saved / 1,5                              (schůzka + cesta = 1,5 h, orientačně)
```
Koeficient 0,40 je pracovní odhad, **[PROOF: po pilotu nahradit změřeným průměrem]**.

**Text výsledku**
> Váš tým tráví přípravami, zápisy a nabídkami **{nonSelling} hodin týdně**.
> Opatrným odhadem z toho AI vrátí **{saved} hodin týdně**. To je **{savedPerRep} hodiny na obchodníka**.
> V nákladech jde o **{czkYear} Kč ročně**. V obchodě o zhruba **{meetingsGained} schůzek týdně navíc**.
> *Počítáme s úsporou 40 % času. Skutečné číslo změříme stopkami až u vás.*

**Stavy výsledku:** `savedPerRep < 1,5` → „U vašeho týmu je prostor menší. Pomůže spíš jednodenní Start než celý program." · `1,5–4` → standardní text + CTA audit · `> 4` → „To je hodně. Vyplatí se podívat na to podrobně." + CTA audit.

**Brána:** výsledek je vidět hned (bez e-mailu). E-mail se ptáme až za „podrobný výpočet + tři kroky, jak začít": pole e-mail, souhlas, tlačítko **Poslat mi podrobný výpočet**.

**E-mailový report** (odejde hned, viz sekvence 1, email 1.1) + **PDF na jednu stranu:**
1. Vaše vstupy a výsledek (tabulka).
2. Kde je největší ztráta (nejvyšší ze tří položek) a co s ní:
   - *Přípravy:* brief z veřejných zdrojů za 10 minut (postup v emailu 1.4).
   - *Zápisy a CRM:* nahrávka se souhlasem → zápis → úkoly → e-mail klientovi.
   - *Nabídky:* jedna struktura nabídky a asistent naučený na pěti nejlepších.
3. Tři kroky na příští týden: (a) vyberte jednu činnost, (b) dejte týmu jedno pravidlo pro data, (c) změřte ji stopkami před a po.
4. Pozvánka na audit.

**Napojení:** webhook → custom fields `calc_*` → tag `lead-kalkulacka` → sekvence 1 → pokud `savedPerRep ≥ 1,5` a `reps ≥ 4`, úkol pro zakladatele „zavolat do 24 hodin".

## 8.3 Prompt pack: 25 promptů pro obchodníka (kompletní text PDF)

**Jak s tím pracovat:** Text v hranatých závorkách nahraďte svým. Čím víc kontextu, tím lepší výsledek. Výstup vždy přečtěte a opravte, AI se plete a občas si vymýšlí. **Do veřejných verzí AI nevkládejte ceníky, smlouvy, osobní údaje klientů ani nic, co byste neposlali e-mailem cizímu člověku.**

**Kontext, který vložte na začátek každého rozhovoru:**
> Jsem obchodník ve firmě [název], která prodává [co] zákazníkům typu [komu]. Náš typický klient řeší [problém]. Píšu česky, věcně, bez frází, vykám.

### A) Příprava na schůzku
1. **Brief o firmě.** „Z textu níže (web klienta, aktuality) připrav brief na jednu stranu: co firma dělá, jak je velká, co se u ní teď děje, kdo jsou její zákazníci. Kde si nejsi jistý, napiš to. [text]"
2. **Priority protistrany.** „Jdu na schůzku s [pozice] ve firmě z oboru [obor]. Jaké tři priority a tři obavy má člověk na této pozici obvykle? Ke každé napiš, jak s ní souvisí [náš produkt]."
3. **Otázky.** „Připrav 8 otevřených otázek pro první schůzku s [pozice], kterými zjistím současný stav, dopad problému a rozhodovací proces. Seřaď je od nejsnazší po nejcitlivější."
4. **Hypotéza hodnoty.** „Na základě briefu výše napiš tři hypotézy, kde by [náš produkt] mohl této firmě pomoct. U každé uveď, čím si ji na schůzce ověřím."
5. **Úvod schůzky.** „Napiš úvod schůzky na 30 sekund: proč jsem tady, co navrhuji probrat, kolik to zabere času. Přirozeně, bez prodejních frází."

### B) Po schůzce
6. **Zápis.** „Z poznámek/přepisu níže udělej zápis: účastníci, současný stav klienta, potřeby, námitky, dohodnuté kroky s termínem a odpovědnou osobou, otevřené otázky. Nic nepřidávej. [poznámky]"
7. **Pole do CRM.** „Ze zápisu výše vytáhni: velikost příležitosti, fázi, rozhodovatele, termín rozhodnutí, konkurenci, další krok. Kde údaj chybí, napiš ‚nezjištěno'."
8. **Follow-up e-mail.** „Napiš follow-up po schůzce: poděkování jednou větou, tři body, na kterých jsme se shodli, co pošlu a do kdy, návrh dalšího kroku se dvěma termíny. Do 120 slov."
9. **Co jsem se nezeptal.** „Podívej se na zápis jako zkušený obchodní ředitel. Jaké tři důležité informace mi chybí a jak se na ně zeptám příště?"
10. **Interní shrnutí.** „Shrň tuto příležitost pro mého ředitele do pěti řádků: kdo, co chtějí, kolik, kdy, co potřebuji od něj."

### C) Nabídka
11. **Struktura nabídky.** „Navrhni strukturu nabídky pro [klient] podle zápisu: situace klienta jeho slovy, cíl, navržené řešení, co dostane, harmonogram, cena, další krok."
12. **Shrnutí pro vedení.** „Napiš úvodní shrnutí nabídky na půl strany pro člověka, který bude číst jen tuhle část. Začni problémem klienta, ne naší firmou."
13. **Tři varianty.** „Navrhni tři varianty rozsahu (základní, doporučená, rozšířená) pro tuto nabídku. U každé napiš, co obsahuje a pro koho je. Ceny doplním sám."
14. **Kontrola nabídky.** „Přečti nabídku očima skeptického finančního ředitele klienta. Co je nejasné, co nepodložené, co by vyškrtl?"
15. **Průvodní e-mail.** „Napiš průvodní e-mail k nabídce do 80 slov: co posílám, co je nejdůležitější, kdy se ozvu."

### D) Námitky a vyjednávání
16. **Banka námitek.** „Jaké námitky nejspíš zazní k nabídce výše? Ke každé navrhni odpověď: uznání, doplňující otázka, argument."
17. **Trénink.** „Hraj nákupčího firmy [klient]. Jsi věcný, tlačíš na cenu a termín. Reaguj na mé odpovědi vždy jednou replikou. Po pěti výměnách mi dej zpětnou vazbu. Začni."
18. **„Je to drahé."** „Klient řekl, že jsme o 15 % dražší než konkurence. Navrhni tři způsoby, jak reagovat bez slevy, a jeden ústupek, který nás stojí málo."
19. **Ticho po nabídce.** „Klient se dva týdny po nabídce neozval. Napiš tři krátké zprávy pro tři další týdny. Každá přináší něco nového, žádná nezní uraženě."

### E) Prospecting
20. **Profil ideálního klienta.** „Z popisu našich pěti nejlepších klientů níže vytáhni společné znaky a napiš profil ideálního klienta a tři signály, podle kterých ho poznám. [popis bez citlivých údajů]"
21. **První věta.** „Z veřejných informací o firmě níže napiš tři varianty první věty oslovení, která ukáže, že jsem si o nich něco zjistil. Bez lichotek. [text]"
22. **Oslovení.** „Napiš první e-mail pro [pozice] do 90 slov: první věta o nich, jedna otázka k problému, jedna věta o tom, co děláme, jednoduchý další krok."
23. **Telefonát.** „Napiš osnovu prvního telefonátu na 60 sekund: kdo jsem, proč volám právě jim, jedna otázka, návrh schůzky. Plus odpovědi na ‚pošlete to mailem' a ‚nemáme zájem'."

### F) Stávající klienti
24. **Cross-sell.** „V tabulce jsou klienti a produkty, které odebírají (bez osobních údajů). Najdi deset klientů, u kterých dává smysl nabídnout další produkt. Ke každému napiš proč a první větu oslovení. [tabulka]"
25. **Roční hodnocení spolupráce.** „Připrav osnovu ročního hodnocení spolupráce s klientem [obor, co odebírá]: co fungovalo, čísla, co zlepšit, dva návrhy rozšíření."

**Poslední strana:** „Tohle je 25 jednotlivých kroků. Když je celý tým používá stejně a každý den, bývá to několik hodin týdně na člověka. Kolik přesně u vás? Spočítáme to na auditu zdarma: [odkaz]"

## 8.4 Obsahová strategie zakladatele

**Princip:** zakladatel je tvář na sítích, web je firma. Posty píše v první osobě z praxe obchodního ředitele, ne jako „AI expert".

### Čtyři pilíře

| Pilíř | Podíl | Co to je | Vazba na funnel |
|---|---|---|---|
| **1. Čísla z obchodu** | 30 % | Kolik času a peněz stojí rutina. Výpočty, měření, před/po. | → kalkulačka |
| **2. Ukázka postupu** | 30 % | Konkrétní postup nebo prompt, záznam obrazovky do 60 s. | → prompt pack |
| **3. Pohled ředitele** | 25 % | Vedení týmu, porady, CRM, odpor ke změně, co se nepovedlo. | → audit |
| **4. Bezpečnost a pravidla** | 15 % | Co do AI nepatří, směrnice, dotace, AI Act věcně. | → semafor, stránka Dotace |

### Kadence
- **LinkedIn:** 4 posty týdně (út, st, čt ráno v 7:30; ne v 8:00). Úterý číslo, středa postup (video nebo karusel), čtvrtek pohled ředitele, neděle večer osobnější text. Denně 15 minut komentářů u 10 lidí z cílovky. Odkaz vždy v prvním komentáři.
- **Instagram:** 3 reels týdně (stejná videa jako středa + 2 střihy z VSL a školení), 2 karusely týdně (převzaté z LinkedInu). Instagram je sekundární: slouží hlavně jako důkaz, že firma žije, a pro retargeting.
- **Jednou měsíčně:** živý 30min webinář „Příprava na schůzku za 10 minut" → záznam nastříhat na 6 videí.
- **Každý pátek:** 60 minut dávkové výroby (4 texty + 1 záznam obrazovky).

### 20 hooků
1. Spočítal jsem, kolik hodin týdně můj tým opravdu prodával. Neměl jsem to dělat.
2. Zápis ze schůzky za tři dny není zápis. Je to vzpomínka.
3. Vaši obchodníci AI používají. Jen vám to neřekli.
4. Ukázal jsem týmu ChatGPT. V pondělí pracovali všichni postaru. Tady je proč.
5. Příprava na schůzku: 40 minut, nebo 10. Rozdíl není v nástroji.
6. Nabídka za týden je dnes pozdě. Tady je, jak ji mít do druhého dne.
7. Tři věci, které do AI nikdy nevkládejte. Tu třetí dělá skoro každý.
8. 17 let vedu obchodníky. Tohle je první změna, která jim opravdu vrací čas.
9. CRM vyplněné v pátek odpoledne řídí vaši firmu. Přemýšlejte o tom.
10. Nejlepší obchodník v týmu nemá čas učit ostatní. AI ano.
11. Kolik stojí hodina vašeho obchodníka? A kolik z ní je prodej?
12. „Na AI nemáme čas." Přeloženo: děláme ručně věci, které ručně dělat nemusíme.
13. Tenhle prompt používám před každou schůzkou. Zkopírujte si ho.
14. Proč jednodenní AI školení nefunguje. A co funguje.
15. Zakázat AI ve firmě je nejjistější způsob, jak ztratit kontrolu nad daty.
16. Jak vypadá úterý obchodníka bez AI a s AI. Hodinu po hodině.
17. Stopky. Nejlevnější nástroj na řízení obchodu, který nikdo nepoužívá.
18. Starší obchodníci AI nezvládnou? Moje zkušenost je opačná.
19. Stát vám zaplatí část AI školení. Většina firem o tom neví.
20. Řekl jsem klientovi, že náš program nepotřebuje. Tady je důvod.

### 10 hotových postů

**Post 1 (pilíř 1, hook 11)**
Kolik stojí hodina vašeho obchodníka? A kolik z ní je prodej?

Zkuste si to spočítat. Stačí tři čísla.

Schůzek týdně na obchodníka: řekněme 5.
Příprava na jednu: 40 minut.
Zápis, CRM a follow-up: dalších 40 minut.

To je skoro 7 hodin týdně na člověka. A to jsem nezapočítal nabídky.

U týmu deseti lidí jde o 67 hodin týdně. Při 600 Kč za hodinu je to přes 1,8 milionu korun ročně. Za práci, kterou klient nikdy neuvidí.

Neříkám, že jde zmizet celá. Říkám, že většina firem to číslo nezná.

Kalkulačku, kde si dosadíte vlastní čísla, dávám do komentáře. Bez registrace.

**Post 2 (pilíř 2, hook 13)**
Tenhle prompt používám před každou schůzkou. Zkopírujte si ho.

„Zítra mám první schůzku s [pozice] ve firmě, o které jsou informace níže. Připrav brief na jednu stranu:
1) co firma dělá a co se u ní děje,
2) tři pravděpodobné priority člověka na této pozici,
3) pět otázek, kterými zjistím potřebu,
4) co z naší nabídky dává smysl a proč,
5) na co si dát pozor.
Kde si nejsi jistý, napiš to."

Pod to vložte text z webu klienta a jeho poslední aktuality. Jen veřejné informace.

Deset minut místo čtyřiceti. A hlavně: přijdete s otázkami, ne s prezentací.

Dalších 24 promptů pro obchodníky je v komentáři.

**Post 3 (pilíř 3, hook 4)**
Ukázal jsem týmu ChatGPT. V pondělí pracovali všichni postaru.

[OVĚŘIT příběh] Dvě hodiny, živé ukázky, nadšení. Lidi si fotili obrazovku.

O týden později jsem se zeptal, kdo to použil. Zvedly se dvě ruce.

Udělal jsem klasickou chybu. Ukázal jsem nástroj a čekal, že se změní práce.

Návyk se nemění ukázkou. Mění se tak, že člověk udělá novým způsobem svoji skutečnou práci. Zítra znovu. A někdo se za týden zeptá, jak to šlo.

Od té doby to dělám jinak:
• jedna dovednost týdně, ne dvacet za odpoledne,
• vždy na vlastní zakázce,
• a měříme stopkami, jestli to opravdu šetří čas.

Je to pomalejší. Ale vydrží to.

**Post 4 (pilíř 4, hook 7)**
Tři věci, které do AI nikdy nevkládejte. Tu třetí dělá skoro každý.

1. Osobní údaje klientů. Jména s telefony, rodná čísla, zdravotní informace.
2. Smlouvy a ceníky s individuálními podmínkami.
3. Export z CRM „jen na rychlou analýzu".

Ta třetí vypadá nevinně. Je v ní ale všechno z bodů 1 a 2 najednou.

Řešení není zákaz. Zákaz znamená, že to lidé dělají dál z osobních účtů a vy o tom nevíte.

Řešení jsou tři věci: firemní účty, kde se data nepoužívají k trénování, jednoduchá pravidla na jednu stranu a někdo, koho se lidé můžou zeptat.

Jednostránkový semafor „co smí, co ne" posílám komukoli, kdo si napíše.

**Post 5 (pilíř 1, hook 2)**
Zápis ze schůzky za tři dny není zápis. Je to vzpomínka.

A podle vzpomínek pak řídíte obchod. Forecast, priority, porady.

Jak to jde dnes:
Schůzka se (se souhlasem klienta) nahraje.
Přepis jde do AI s jedním zadáním.
Za pár minut máte zápis, úkoly s termíny a návrh e-mailu klientovi.
Obchodník to přečte, opraví a odešle. Dřív, než odjede z parkoviště.

Cíl, se kterým pracujeme: zápis a follow-up do 15 minut po schůzce.

Klient dostane shrnutí ještě ten den. Víte, kolik vašich konkurentů to dělá?

**Post 6 (pilíř 3, hook 20)**
Řekl jsem klientovi, že náš program nepotřebuje.

Tři obchodníci, dvě schůzky týdně, nabídky na jednu stranu. Spočítali jsme to spolu a vyšlo to na necelou hodinu týdně na člověka.

Na to není potřeba osmitýdenní program. Stačí dva postupy a jedno pravidlo pro data. Poslal jsem mu je.

Píšu to proto, že AI se dnes prodává jako odpověď na všechno. Není. Vyplatí se tam, kde je objem: hodně schůzek, složité nabídky, velké portfolio klientů.

Jak to poznat? Spočítat. Než cokoli koupíte, chtějte od dodavatele číslo pro vaši firmu. A zeptejte se, jak ho potom změří.

**Post 7 (pilíř 2, hook 6)**
Nabídka za týden je dnes pozdě.

Kde se ten týden ztrácí? Ne v počítání ceny. V psaní.

Postup, který zkracuje nabídku na jeden den:

1. Vezměte pět svých nejlepších nabídek a nechte AI popsat jejich společnou strukturu.
2. Z té struktury udělejte šablonu: situace klienta jeho slovy, cíl, řešení, co dostane, harmonogram, cena, další krok.
3. Po schůzce vložte zápis a nechte AI šablonu vyplnit.
4. Obchodník doplní cenu a zkontroluje každou větu.

Čtvrtý krok je důležitý. AI píše návrh, za nabídku ručí člověk.

Výsledek: první verze do hodiny po schůzce, odeslání týž nebo druhý den.

**Post 8 (pilíř 4, hook 19)**
Stát vám zaplatí část AI školení. Většina firem o tom neví.

Úřad práce má projekt Vzdělávání pro firmy. Co jsem si k němu dohledal: [OVĚŘIT před zveřejněním]

• příspěvek 260,73 Kč na hodinu a účastníka,
• k tomu příspěvek na mzdy za dobu školení,
• minimální rozsah kurzu 50 hodin,
• žádá firma, a to před zahájením,
• peníze přijdou zpětně po dokončení.

Pro tým deseti lidí a padesátihodinový kurz to dělá přes 130 tisíc jen na školení.

Háček: administrativa a to, že schválení není jisté. Proto se vyplatí nechat si nárok ověřit dřív, než cokoli objednáte.

Pokud to řešíte, napište mi. Podklady k žádosti připravujeme s klienty běžně.

**Post 9 (pilíř 3, hook 18)**
„Starší obchodníci AI nezvládnou."

Slyším to od ředitelů často. Moje zkušenost je jiná. [OVĚŘIT příběh / PROOF z pilotu]

Zkušený obchodník přesně ví, co chce klientovi říct. Jen ho nebaví to psát. AI mu bere tu část práce, kterou nikdy neměl rád.

Mladší kolega umí nástroj ovládat rychleji. Ale často neví, na co se zeptat.

Proto je na školeních dávám do dvojic. Jeden ví co, druhý ví jak. Za hodinu se učí navzájem.

Odpor ke změně nebývá o věku. Bývá o strachu, že budu před ostatními vypadat hloupě. To se dá ošetřit.

**Post 10 (pilíř 1, hook 17)**
Stopky. Nejlevnější nástroj na řízení obchodu, který nikdo nepoužívá.

Zkuste příští týden jednoduchý pokus. Požádejte tři obchodníky, ať si změří pět věcí:

• přípravu na jednu schůzku,
• zápis po ní,
• follow-up e-mail,
• jednu nabídku,
• dohledání jedné informace o klientovi.

Žádný odhad. Stopky v telefonu.

Dvě věci se stanou. Zjistíte, že odhady byly poloviční. A obchodníci sami začnou přemýšlet, proč to tak trvá.

Přesně takhle začínáme každý program. Bez výchozího čísla totiž nikdo nepozná, jestli se něco zlepšilo.

### Vazba na funnel
- Každý post má jednu akci: kalkulačka, prompt pack, semafor, nebo „napište mi".
- Komentář „prompty" / „semafor" → ruční zpráva s odkazem → kontakt do LeadConnectoru s tagem `zdroj-linkedin`.
- Lidi, kteří reagovali dvakrát a odpovídají cílovce → zpráva L2 z outboundu.
- Retargeting (Meta, LinkedIn): návštěvníci kalkulačky bez e-mailu → video B; návštěvníci stránky auditu bez rezervace → video A.
- Jednou měsíčně vyhodnotit: které posty přivedly audity (UTM `utm_source=linkedin&utm_content=post-XX`).

## Self-review fáze 8

**Kolo 1 – slabiny:** (1) Lead magnet „e-book o AI" by nikdo nečetl → nahrazeno kalkulačkou s vlastním číslem a prompty k okamžitému použití. (2) Kalkulačka schovávala výsledek za e-mail → výsledek volně, e-mail až za podrobný report (víc dokončení, kvalitnější kontakty). (3) Posty zněly jako reklama → přepsány na zkušenost a postup, nabídka jen v posledním řádku.
**Kolo 2 – slabiny:** (1) Post 1 měl nepřepočítaná čísla → 10 × 5 × 80 min = 67 h; × 600 × 46 = 1,84 mil. Kč. (2) Posty 3 a 9 obsahovaly příběhy, které nemusí být pravdivé → označeny k ověření. (3) Post o dotacích uváděl sazby jako jistotu → označen k ověření před zveřejněním.

| Kritérium | Kolo 1 | Finál |
|---|---|---|
| Konkrétnost | 8 | 9,5 |
| Přesvědčivost | 8 | 9 |
| Jasnost | 9 | 9 |
| Konzistence | 8 | 9,5 |
| Proveditelnost | 8 | 9 |
| Pravdivost | 7 | 9 |
