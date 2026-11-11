# Prompt 07 – Landing page `/audit` (bez navigace, jen logo)

Postav Landing page `/audit` (bez navigace, jen logo) webu Boostia. Dodrž design systém a nevyjednatelná pravidla ze základu projektu. Texty vlož přesně podle bloku COPY níže; poznámky v hranatých závorkách [PROOF/DOPLNIT/OVĚŘIT] vykresli jako viditelné placeholdery, poznámky [ROZHODNUTÍ: …] nevykresluj.

## Sekce a motion
Jediný cíl stránky je odeslaný formulář a rezervace. Žádná navigace, žádné odkazy ven kromě GDPR. Minimum pohybu: jen reveal H1 po slovech.
1. Štítek, H1, sub.
2. **VSL** – komponenta `VslFacade`: náhledový obrázek 16:9 s tlačítkem přehrát, přehrávač (URL z env `VITE_VSL_URL`) se načte až po kliknutí; rezervuj poměr stran; eventy `vsl_play`, `vsl_25/50/75`, `vsl_complete`. Pod videem tlačítko „Vybrat termín auditu" (scroll na formulář).
3. Co dostanete (4 odrážky se zaškrtnutím), Pro koho to je / Pro koho ne (2 sloupce), Kdo audit vede (karta).
4. **Formulář `AuditForm` ve 2 krocích** s lištou průběhu.
   Krok 1: jméno, příjmení, e-mail, telefon (+420 předvyplněno), firma → tlačítko „Pokračovat". Po kroku 1 hned POST částečného leadu (`stage: 'step1'`).
   Krok 2 (otázky a body): 
   - „Kolik lidí u vás obchoduje?" 1–3 (0) · 4–7 (2) · 8–15 (3) · 16–40 (3) · 41+ (2)
   - „Jaká je vaše role?" Jednatel / majitel (3) · Obchodní ředitel / vedoucí obchodu (3) · HR / vzdělávání (2) · Obchodník (0) · Jiná (0)
   - „Jaké CRM používáte?" Raynet · Pipedrive · HubSpot · Salesforce · eWay-CRM · Jiné (1) · Excel (1) · Žádné (0)
   - „Kdo rozhoduje o investici do vzdělávání obchodu?" Já (2) · Já s někým dalším (2) · Někdo jiný (0)
   - „Kdy byste chtěli začít?" Do 2 měsíců (3) · Do půl roku (2) · Zatím jen zjišťuji (0)
   - „Chcete ověřit nárok na dotaci?" Ano (1) · Ne (0) · Nevím, co to obnáší (1)
   - nepovinné textové pole „Co vaše obchodníky nejvíc zdržuje od prodeje?"
   Tlačítko „Vybrat termín". Odpovědi jako velké klikací dlaždice (ne select).
   Směrování: skóre >= 6 a zároveň aspoň 4 obchodníci → `route: 'audit'`, zobraz embed kalendáře z `VITE_LC_CALENDAR_AUDIT`; skóre 3–5 → `route: 'uvodni'`, embed `VITE_LC_CALENDAR_INTRO` s textem „Začneme krátkým 15minutovým hovorem."; jinak `route: 'nurture'` → přesměruj na /dekujeme-prompty. POST celého payloadu včetně `score` a `route` na `VITE_LC_WEBHOOK_AUDIT`.
   Kalendář: iframe LeadConnectoru v kartě `--surface`, předvyplněný přes URL parametry (first_name, last_name, email, phone), líné načtení, rezervovaná výška 680px. Po rezervaci (postMessage z iframe nebo redirect nastavený v kalendáři) přejdi na /dekujeme.
   Ochrana: honeypot pole a Cloudflare Turnstile. Eventy `form_start`, `form_step1`, `form_submit` (s `route`, `score`), `form_error`.
5. Mikrocopy, FAQ (3 otázky).
SEO: title „Bezplatný audit: kolik času ztrácí váš obchod · Boostia"; description „Za 30 minut spočítáme, kolik hodin a korun váš obchodní tým týdně ztrácí neprodejní prací. Zdarma a bez závazku."; JSON-LD FAQPage.

---

# COPY (vlož přesně)

## 5.7 AUDIT ZDARMA (landing page, bez navigace)

**Cíl:** jediný – odeslaný formulář a rezervace.

- **Štítek:** Bezplatný 30minutový audit
- **H1:** Kolik času vaši obchodníci ztrácí neproduktivní prací? Za 30 minut to budete vědět v hodinách i korunách.
- **Sub:** Projdeme, jak váš tým připravuje schůzky, píše zápisy a skládá nabídky. Spočítáme, kolik z toho zvládne AI. Odnesete si číslo a tři konkrétní kroky.
- **VSL** (4 min, skript níže) · pod videem tlačítko **Vybrat termín auditu**
- **Co dostanete:**
  - Výpočet ztraceného času vašeho týmu v hodinách týdně a Kč ročně
  - Tři kroky, které můžete udělat hned, i bez nás
  - Ověření, jestli máte nárok na dotaci
  - Jednostránkový report do 24 hodin
- **Pro koho to je:** firmy s 4 a více obchodníky · jednatelé, obchodní ředitelé, HR
- **Pro koho ne:** jednotlivci a týmy do 3 lidí (pro vás máme [prompt pack zdarma])
- **Kdo audit vede:** [JMÉNO], 17 let v obchodě, vedl týmy až 80 obchodníků. Nebude vám nic prezentovat. Bude se ptát a počítat.
- **Formulář** (2 kroky, fáze 4) · tlačítko kroku 1: **Pokračovat** · tlačítko kroku 2: **Vybrat termín**
- **Mikrocopy u formuláře:** Údaje použijeme jen k přípravě auditu. Žádný spam.
- **FAQ:** *Je to opravdu zdarma?* Ano. Část firem s námi potom spolupracuje, část ne. Číslo dostanou všechny. · *Budete mi něco prodávat?* Když uvidíme, že vám umíme pomoct, řekneme jak a za kolik. Když ne, řekneme to taky. · *Kdo by měl být na hovoru?* Ideálně obchodní ředitel a ten, kdo rozhoduje o rozpočtu.


---

# Příloha: skript VSL (pro titulky a náhled, na stránku nevkládat jako text)

## 5.11 Skript VSL (cca 4 minuty, 560 slov)

Formát: vedoucí lektor mluví do kamery, prostřihy na obrazovku. Bez hudebního podkresu v první minutě.

**[HOOK, 0:00–0:20]**
Kolik hodin týdně stráví váš obchodník skutečným jednáním s klienty? Ne v autě, ne u Excelu, ne u CRM. S klienty.
Většina ředitelů, kterých se zeptám, to neví. A když to spolu spočítáme, bývají nepříjemně překvapení.

**[PROBLÉM, 0:20–1:10]**
Jmenuju se [JMÉNO]. Sedmnáct let jsem dělal obchod a vedl obchodní týmy, od pěti do osmdesáti lidí. A celou tu dobu jsem viděl totéž.
Dobrý obchodník přijde ze schůzky a místo aby zvedl telefon a volal dalšímu klientovi, sedne si a přepisuje poznámky. Pak hledá podklady. Pak skládá nabídku z té loňské. V pátek odpoledne dohání CRM, protože v pondělí je porada.
Platíte ho za prodej. A on většinu týdne dělá administrativu.

**[STORY, 1:10–2:00]**
Já to tak dělal taky. Pak jsem začal zkoušet AI. Nejdřív jako všichni, sem tam něco přeformulovat. Nic moc.
Zlom přišel, když jsem přestal zkoušet nástroj a začal měnit postup. Příprava na schůzku: místo čtyřiceti minut deset. Zápis a follow-up: hotové dřív, než odjedu z parkoviště. Nabídka: návrh do hodiny.
A pak jsem to chtěl dostat do celého týmu. A zjistil jsem, že jedno školení nestačí. Lidi kývají, jsou nadšení a v pondělí pracují postaru.
[PROOF: konkrétní číslo z vlastní praxe nebo pilotu, např. „V týmu X jsme zkrátili čas na nabídku z … na …"]

**[OFFER, 2:00–3:10]**
Proto jsme postavili AI Obchod 50. Osm týdnů, jeden den týdně, u vás ve firmě.
První týden vezmeme stopky a změříme, jak dlouho vašim lidem trvá pět běžných věcí. Pak každý týden jedna dovednost, na vašich skutečných zakázkách: bezpečná práce s daty, příprava schůzek, zápisy a CRM, nabídky, oslovování, práce se stávajícími klienty.
Osmý týden měříme znovu. A vy dostanete rozdíl v hodinách a v korunách.
Cíl je aspoň tři hodiny týdně zpět pro každého obchodníka. Když ho tým nedosáhne, školíme dál zdarma. A první den je celý na naše riziko: když řeknete, že to není ono, neplatíte nic.
Program má padesát hodin, takže na něj jde čerpat dotace z Úřadu práce. Papíry připravíme s vaším HR.

**[CTA, 3:10–3:50]**
Jestli to dává smysl pro vás, to zjistíme za třicet minut. Na bezplatném auditu spolu spočítáme, kolik času a peněz váš obchod ztrácí. Nebudu nic prezentovat. Budu se ptát a počítat.
Číslo a tři konkrétní kroky dostanete, i kdybychom spolu nikdy nespolupracovali.
Vyplňte formulář pod videem a vyberte si termín. Vedu nejvýš dvě skupiny najednou, takže nových týmů beru jen několik za čtvrtletí.
Uvidíme se na auditu.
