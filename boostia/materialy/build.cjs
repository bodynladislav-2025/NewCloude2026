// Vyrobí PDF materiály a OG obrázek. Spuštění: node build.cjs (potřebuje Playwright s Chromiem).
const fs = require('fs'), path = require('path')
const { chromium } = require('playwright')
const WEB = path.join(__dirname, '..', 'web')
const OUT = path.join(WEB, 'public', 'materialy')
const F = (p) => 'file://' + path.join(WEB, 'node_modules', '@fontsource-variable', p)
const css = `
@font-face{font-family:Inter;src:url(${F('inter/files/inter-latin-wght-normal.woff2')});font-weight:100 900;unicode-range:U+0000-00FF,U+2000-206F,U+20AC}
@font-face{font-family:Inter;src:url(${F('inter/files/inter-latin-ext-wght-normal.woff2')});font-weight:100 900;unicode-range:U+0100-02AF,U+1E00-1EFF}
@font-face{font-family:Tight;src:url(${F('inter-tight/files/inter-tight-latin-wght-normal.woff2')});font-weight:100 900;unicode-range:U+0000-00FF,U+2000-206F}
@font-face{font-family:Tight;src:url(${F('inter-tight/files/inter-tight-latin-ext-wght-normal.woff2')});font-weight:100 900;unicode-range:U+0100-02AF,U+1E00-1EFF}
@page{size:A4;margin:18mm 17mm 20mm}
*{box-sizing:border-box}
body{font-family:Inter,sans-serif;font-size:10.5pt;line-height:1.55;color:#12161d;margin:0}
h1,h2,h3{font-family:Tight,Inter,sans-serif;letter-spacing:-.02em;line-height:1.1;margin:0}
h1{font-size:30pt;font-weight:700}
h2{font-size:15pt;font-weight:650;margin:22pt 0 8pt;padding-top:10pt;border-top:1.5pt solid #12161d;break-after:avoid}
h3{font-size:11pt;font-weight:650;margin:0 0 3pt}
p{margin:0 0 7pt}
.cover{background:#07090D;color:#F2F5F9;margin:-18mm -17mm 14pt;padding:22mm 17mm 14mm}
.cover .tag{font-size:8.5pt;letter-spacing:.12em;text-transform:uppercase;color:#C8FF3E}
.cover h1{margin:10pt 0 8pt}.cover h1 em{color:#C8FF3E;font-style:normal}
.cover p{color:#9AA6B8;max-width:150mm;margin:0}
.logo{font-family:Tight;font-weight:700;font-size:13pt;margin-bottom:26pt}
.box{border:1pt solid #cfd6df;border-radius:7pt;padding:9pt 11pt;margin:0 0 7pt;break-inside:avoid}
.box .n{font-size:8pt;color:#5d6a7c;font-weight:600;letter-spacing:.06em}
.box .q{background:#f1f4f7;border-radius:5pt;padding:7pt 9pt;margin-top:5pt;font-size:9.8pt}
.note{background:#f4fbdc;border-left:3pt solid #9ccc10;padding:8pt 11pt;margin:0 0 10pt;break-inside:avoid}
.warn{background:#fff1e8;border-left:3pt solid #FF8A4C;padding:8pt 11pt;margin:0 0 10pt;break-inside:avoid}
table{width:100%;border-collapse:collapse;margin:0 0 10pt;font-size:9.8pt}
th,td{text-align:left;padding:6pt 7pt;border-bottom:.7pt solid #cfd6df;vertical-align:top}
th{font-size:8.5pt;text-transform:uppercase;letter-spacing:.06em;color:#5d6a7c}
ul,ol{margin:0 0 8pt;padding-left:15pt}li{margin-bottom:3pt}
.cols{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8pt}
.g{border-top:4pt solid #39a845}.o{border-top:4pt solid #f0a020}.r{border-top:4pt solid #d8452e}
.foot{margin-top:16pt;padding-top:9pt;border-top:.7pt solid #cfd6df;font-size:9pt;color:#5d6a7c}
.fill{display:inline-block;min-width:60pt;border-bottom:.7pt solid #12161d}
`
const page = (tag, title, sub, body) => `<!doctype html><html lang="cs"><head><meta charset="utf-8"><style>${css}</style></head><body>
<div class="cover"><div class="logo">Boostia</div><div class="tag">${tag}</div><h1>${title}</h1><p>${sub}</p></div>${body}
<div class="foot">Boostia · Měřený AI trénink pro obchodní týmy · www.boostia.cz · Audit zdarma: www.boostia.cz/audit</div></body></html>`

const P = (n, h, q) => `<div class="box"><div class="n">${String(n).padStart(2, '0')}</div><h3>${h}</h3><div class="q">${q}</div></div>`
const prompts = page('Pro obchodníky · zdarma', '25 promptů <em>pro obchodníka</em>', 'Příprava na schůzku, zápis, nabídka, námitky, prospecting a stávající klienti. Zkopírujte, doplňte a použijte ještě dnes. Funguje v ChatGPT, Copilotu i Claude.', `
<div class="note"><b>Jak s tím pracovat.</b> Text v hranatých závorkách nahraďte svým. Čím víc kontextu, tím lepší výsledek. Výstup vždy přečtěte a opravte: AI se plete a občas si vymýšlí.</div>
<div class="warn"><b>Pravidlo číslo jedna.</b> Do veřejných verzí AI nevkládejte ceníky, smlouvy, osobní údaje klientů ani nic, co byste neposlali e-mailem cizímu člověku.</div>
<div class="box"><h3>Kontext, který vložte na začátek každého rozhovoru</h3><div class="q">Jsem obchodník ve firmě [název], která prodává [co] zákazníkům typu [komu]. Náš typický klient řeší [problém]. Píšu česky, věcně, bez frází, vykám.</div></div>
<h2>A) Příprava na schůzku</h2>
${P(1, 'Brief o firmě', 'Z textu níže (web klienta, aktuality) připrav brief na jednu stranu: co firma dělá, jak je velká, co se u ní teď děje, kdo jsou její zákazníci. Kde si nejsi jistý, napiš to. [text]')}
${P(2, 'Priority protistrany', 'Jdu na schůzku s [pozice] ve firmě z oboru [obor]. Jaké tři priority a tři obavy má člověk na této pozici obvykle? Ke každé napiš, jak s ní souvisí [náš produkt].')}
${P(3, 'Otázky', 'Připrav 8 otevřených otázek pro první schůzku s [pozice], kterými zjistím současný stav, dopad problému a rozhodovací proces. Seřaď je od nejsnazší po nejcitlivější.')}
${P(4, 'Hypotéza hodnoty', 'Na základě briefu výše napiš tři hypotézy, kde by [náš produkt] mohl této firmě pomoct. U každé uveď, čím si ji na schůzce ověřím.')}
${P(5, 'Úvod schůzky', 'Napiš úvod schůzky na 30 sekund: proč jsem tady, co navrhuji probrat, kolik to zabere času. Přirozeně, bez prodejních frází.')}
<h2>B) Po schůzce</h2>
${P(6, 'Zápis', 'Z poznámek nebo přepisu níže udělej zápis: účastníci, současný stav klienta, potřeby, námitky, dohodnuté kroky s termínem a odpovědnou osobou, otevřené otázky. Nic nepřidávej. [poznámky]')}
${P(7, 'Pole do CRM', 'Ze zápisu výše vytáhni: velikost příležitosti, fázi, rozhodovatele, termín rozhodnutí, konkurenci, další krok. Kde údaj chybí, napiš „nezjištěno“.')}
${P(8, 'Follow-up e-mail', 'Napiš follow-up po schůzce: poděkování jednou větou, tři body, na kterých jsme se shodli, co pošlu a do kdy, návrh dalšího kroku se dvěma termíny. Do 120 slov.')}
${P(9, 'Co jsem se nezeptal', 'Podívej se na zápis jako zkušený obchodní ředitel. Jaké tři důležité informace mi chybí a jak se na ně zeptám příště?')}
${P(10, 'Interní shrnutí', 'Shrň tuto příležitost pro mého ředitele do pěti řádků: kdo, co chtějí, kolik, kdy, co potřebuji od něj.')}
<h2>C) Nabídka</h2>
${P(11, 'Struktura nabídky', 'Navrhni strukturu nabídky pro [klient] podle zápisu: situace klienta jeho slovy, cíl, navržené řešení, co dostane, harmonogram, cena, další krok.')}
${P(12, 'Shrnutí pro vedení', 'Napiš úvodní shrnutí nabídky na půl strany pro člověka, který bude číst jen tuhle část. Začni problémem klienta, ne naší firmou.')}
${P(13, 'Tři varianty', 'Navrhni tři varianty rozsahu (základní, doporučená, rozšířená) pro tuto nabídku. U každé napiš, co obsahuje a pro koho je. Ceny doplním sám.')}
${P(14, 'Kontrola nabídky', 'Přečti nabídku očima skeptického finančního ředitele klienta. Co je nejasné, co nepodložené, co by vyškrtl?')}
${P(15, 'Průvodní e-mail', 'Napiš průvodní e-mail k nabídce do 80 slov: co posílám, co je nejdůležitější, kdy se ozvu.')}
<h2>D) Námitky a vyjednávání</h2>
${P(16, 'Banka námitek', 'Jaké námitky nejspíš zazní k nabídce výše? Ke každé navrhni odpověď: uznání, doplňující otázka, argument.')}
${P(17, 'Trénink', 'Hraj nákupčího firmy [klient]. Jsi věcný, tlačíš na cenu a termín. Reaguj na mé odpovědi vždy jednou replikou. Po pěti výměnách mi dej zpětnou vazbu. Začni.')}
${P(18, '„Je to drahé“', 'Klient řekl, že jsme o 15 % dražší než konkurence. Navrhni tři způsoby, jak reagovat bez slevy, a jeden ústupek, který nás stojí málo.')}
${P(19, 'Ticho po nabídce', 'Klient se dva týdny po nabídce neozval. Napiš tři krátké zprávy pro tři další týdny. Každá přináší něco nového, žádná nezní uraženě.')}
<h2>E) Prospecting</h2>
${P(20, 'Profil ideálního klienta', 'Z popisu našich pěti nejlepších klientů níže vytáhni společné znaky a napiš profil ideálního klienta a tři signály, podle kterých ho poznám. [popis bez citlivých údajů]')}
${P(21, 'První věta', 'Z veřejných informací o firmě níže napiš tři varianty první věty oslovení, která ukáže, že jsem si o nich něco zjistil. Bez lichotek. [text]')}
${P(22, 'Oslovení', 'Napiš první e-mail pro [pozice] do 90 slov: první věta o nich, jedna otázka k problému, jedna věta o tom, co děláme, jednoduchý další krok.')}
${P(23, 'Telefonát', 'Napiš osnovu prvního telefonátu na 60 sekund: kdo jsem, proč volám právě jim, jedna otázka, návrh schůzky. Plus odpovědi na „pošlete to mailem“ a „nemáme zájem“.')}
<h2>F) Stávající klienti</h2>
${P(24, 'Cross-sell', 'V tabulce jsou klienti a produkty, které odebírají (bez osobních údajů). Najdi deset klientů, u kterých dává smysl nabídnout další produkt. Ke každému napiš proč a první větu oslovení. [tabulka]')}
${P(25, 'Roční hodnocení spolupráce', 'Připrav osnovu ročního hodnocení spolupráce s klientem [obor, co odebírá]: co fungovalo, čísla, co zlepšit, dva návrhy rozšíření.')}
<div class="note" style="margin-top:14pt"><b>Tohle je 25 jednotlivých kroků.</b> Když je celý tým používá stejně a každý den, bývá to několik hodin týdně na člověka. Kolik přesně u vás? Spočítáme to na auditu zdarma: <b>www.boostia.cz/audit</b></div>`)

const metodika = page('Program AI Obchod 50', 'Metodika měření: <em>stopky, ne dotazník</em>', 'Jak zjišťujeme, kolik času váš obchodní tým získal. Metodika je přílohou smlouvy a na ní stojí Garance 3 hodin.', `
<h2>1. Co měříme</h2>
<p>Pět činností, které obchodník dělá každý týden a které nejsou jednáním s klientem.</p>
<table><tr><th>#</th><th>Činnost</th><th>Začátek měření</th><th>Konec měření</th></tr>
<tr><td>1</td><td>Příprava na jednu schůzku</td><td>otevřu první zdroj informací</td><td>mám hotový brief nebo poznámky</td></tr>
<tr><td>2</td><td>Zápis ze schůzky a CRM</td><td>začnu psát zápis</td><td>zápis je uložen a pole v CRM vyplněna</td></tr>
<tr><td>3</td><td>Follow-up e-mail</td><td>začnu psát</td><td>e-mail je odeslán</td></tr>
<tr><td>4</td><td>Jedna nabídka</td><td>začnu připravovat</td><td>nabídka je odeslána (čistý čas práce)</td></tr>
<tr><td>5</td><td>Dohledání informace o klientovi</td><td>začnu hledat</td><td>mám odpověď</td></tr></table>
<h2>2. Kdy a jak</h2>
<ul><li><b>Týden 1 (výchozí stav)</b> a <b>týden 8 (po programu)</b>. Kontrolní měření po 60 dnech.</li>
<li>Měří <b>každý účastník</b> stopkami v telefonu na <b>skutečné práci</b>, ne na cvičném příkladu.</li>
<li>Každou činnost alespoň <b>třikrát</b>, počítá se medián.</li>
<li>K tomu týdenní četnost: kolik schůzek, zápisů, follow-upů a nabídek obchodník za týden udělá (z kalendáře a CRM).</li></ul>
<h2>3. Výpočet</h2>
<div class="box"><p><b>Úspora na obchodníka (hodin týdně)</b> = součet přes pět činností: (čas před − čas po) × týdenní četnost.</p>
<p><b>Výsledek týmu</b> = průměr přes všechny účastníky, kteří splnili podmínky účasti. Ne nejlepší jednotlivec.</p>
<p style="margin:0"><b>V korunách ročně</b> = úspora týmu týdně × plný náklad na hodinu obchodníka (určí klient) × 46 pracovních týdnů.</p></div>
<h2>4. Pravidla, aby číslo bylo poctivé</h2>
<ul><li>Četnost se bere z týdne 1, aby výsledek nezkreslil jiný počet schůzek na konci.</li>
<li>Čas na kontrolu a opravu výstupu AI se <b>započítává</b>.</li>
<li>Záznamy vede účastník sám do sdílené tabulky; lektor je namátkově ověřuje při školicím dni.</li>
<li>Kvalitu neobětujeme rychlosti: u nabídek a zápisů vedoucí týmu potvrdí, že výstup odpovídá firemnímu standardu.</li>
<li>Report obsahuje i činnosti, kde se úspora nedostavila.</li></ul>
<h2>5. Garance 3 hodin</h2>
<div class="note"><p><b>První den na naše riziko.</b> Když po prvním školicím dni řeknete, že to není ono, rozejdeme se a neplatíte nic.</p>
<p style="margin:0"><b>Výsledek změříme.</b> Když tým nezíská v průměru aspoň 3 hodiny týdně na obchodníka, školíme dál zdarma, až 20 hodin. Pokud se tam ani tak nedostaneme, vrátíme čtvrtinu ceny.</p></div>
<p>Podmínky: účast aspoň 80 % hodin a splněné týdenní úkoly. Do průměru se počítají účastníci, kteří podmínky splnili.</p>
<h2>6. Co dostane vedení</h2>
<ul><li>Tabulku před a po za tým i za jednotlivé činnosti.</li><li>Úsporu v hodinách týdně a v korunách ročně.</li><li>Co fungovalo, co ne, a plán na dalších 90 dní.</li></ul>`)

const semafor = page('Bezpečné používání AI ve firmě', 'Semafor: <em>co do AI smí a co ne</em>', 'Krátký přehled pro obchodní tým. Vytiskněte, projděte na poradě, doplňte podle svých pravidel. Nenahrazuje právní posouzení.', `
<div class="cols">
<div class="box g"><h3>Zelená: smí</h3><ul><li>Veřejné informace o klientovi (web, tiskové zprávy, výroční zprávy).</li><li>Vlastní poznámky bez jmen a osobních údajů.</li><li>Obecné dotazy: struktura nabídky, formulace, otázky na schůzku.</li><li>Vlastní texty k úpravě a zkrácení.</li><li>Trénink vyjednávání a námitek.</li></ul></div>
<div class="box o"><h3>Oranžová: jen ve firemním účtu</h3><ul><li>Zápisy a přepisy schůzek.</li><li>Nabídky a cenové kalkulace.</li><li>Export z CRM pro analýzu.</li><li>Interní postupy a ceníky.</li><li>E-maily od klientů.</li></ul><p style="margin:0"><b>Podmínka:</b> firemní licence, kde se data nepoužívají k trénování modelů.</p></div>
<div class="box r"><h3>Červená: nikdy</h3><ul><li>Rodná čísla, zdravotní údaje, čísla dokladů.</li><li>Přihlašovací údaje a hesla.</li><li>Smlouvy s doložkou mlčenlivosti, pokud to výslovně nedovolují.</li><li>Cokoli do osobního nebo bezplatného účtu, co patří do oranžové.</li></ul></div></div>
<h2>Pět pravidel na jednu poradu</h2>
<ol><li><b>Pracovní věci jen z firemního účtu.</b> Osobní účty na firemní data nepoužíváme.</li>
<li><b>Výstup vždy čte člověk.</b> AI se plete a vymýšlí si. Za nabídku i e-mail ručí obchodník.</li>
<li><b>Nahráváme jen se souhlasem.</b> Klientovi řekneme proč a co se záznamem bude.</li>
<li><b>Když si nejsem jistý, ptám se.</b> Kontaktní osoba: <span class="fill">&nbsp;</span></li>
<li><b>Chybu hlásím hned.</b> Vložil jsem něco, co jsem neměl? Řeknu to ten den, bez postihu.</li></ol>
<h2>Kontrola pro vedení</h2>
<table><tr><th>Otázka</th><th>Ano / Ne</th></tr>
<tr><td>Víme, které AI nástroje lidé ve firmě používají?</td><td></td></tr>
<tr><td>Máme firemní licence s vypnutým trénováním na našich datech?</td><td></td></tr>
<tr><td>Mají zaměstnanci písemná pravidla a podepsali je?</td><td></td></tr>
<tr><td>Je určen člověk, kterého se mohou zeptat?</td><td></td></tr>
<tr><td>Máme se zpracovateli uzavřené zpracovatelské smlouvy?</td><td></td></tr>
<tr><td>Proškolili jsme lidi a máme o tom záznam?</td><td></td></tr></table>
<div class="note">Zákaz AI nefunguje: lidé ji používají dál z osobních účtů a vedení o tom neví. Fungují firemní účty, jednoduchá pravidla a někdo, koho se lze zeptat. V programu AI Obchod 50 je to první školicí den.</div>`)

const report = page('Report z auditu ztraceného času', '<em>[Firma]</em>: kolik času váš obchod ztrácí', 'Šablona jednostránkového reportu, který klient dostane do 24 hodin po auditu. Hodnoty v závorkách doplňte z hovoru.', `
<h2>Vaše čísla</h2>
<table><tr><th>Činnost</th><th>Minut teď</th><th>Kolikrát týdně</th><th>Opatrná úspora</th><th>Hodin týdně na obchodníka</th></tr>
<tr><td>Příprava na schůzku</td><td>[ ]</td><td>[ ]</td><td>[ ] %</td><td>[ ]</td></tr><tr><td>Zápis a CRM</td><td>[ ]</td><td>[ ]</td><td>[ ] %</td><td>[ ]</td></tr>
<tr><td>Follow-up</td><td>[ ]</td><td>[ ]</td><td>[ ] %</td><td>[ ]</td></tr><tr><td>Nabídka</td><td>[ ]</td><td>[ ]</td><td>[ ] %</td><td>[ ]</td></tr>
<tr><td>Hledání informací, reporty</td><td>[ ]</td><td>[ ]</td><td>[ ] %</td><td>[ ]</td></tr></table>
<div class="cols"><div class="box"><div class="n">NEPRODEJNÍ PRÁCE TÝMU</div><h3>[ ] hodin týdně</h3></div><div class="box"><div class="n">OPATRNÝ ODHAD ÚSPORY</div><h3>[ ] hodin týdně</h3></div><div class="box"><div class="n">V PENĚZÍCH</div><h3>[ ] Kč ročně</h3></div></div>
<p>Počítáme s polovinou toho, co vyšlo na hovoru, a s [ ] Kč za hodinu obchodníka.</p>
<h2>Co jste řekli</h2><div class="box"><p style="margin:0">„[doslovná citace největší potíže]“</p></div>
<h2>Tři kroky, které můžete udělat hned</h2>
<ol><li>[krok k největší ztrátě: přípravy / zápisy / nabídky]</li><li>Dejte týmu jedno pravidlo pro data (viz Semafor).</li><li>Změřte jednu činnost stopkami před a po.</li></ol>
<h2>Náš návrh</h2>
<table><tr><td>Program</td><td>AI Obchod 50: 50 hodin, 8 týdnů, 1 den týdně u vás</td></tr><tr><td>Start</td><td>[datum kohorty]</td></tr>
<tr><td>Cena</td><td>290 000 Kč bez DPH; s dotací pro váš tým odhadem [ ] Kč</td></tr><tr><td>Garance</td><td>První den na naše riziko. Výsledek 3 hodiny týdně na obchodníka, jinak školíme dál zdarma a vracíme čtvrtinu ceny.</td></tr>
<tr><td>Menší krok</td><td>AI Start den za 39 000 Kč, při pokračování se odečte</td></tr><tr><td>Další krok</td><td>[datum a čas domluveného hovoru]; dotační žádost do [datum]</td></tr></table>`)

;(async () => {
  fs.mkdirSync(OUT, { recursive: true })
  const b = await chromium.launch()
  const pg = await b.newPage()
  const docs = { '25-promptu-pro-obchodnika': [prompts, OUT], 'metodika-mereni': [metodika, OUT], 'semafor-co-do-ai-smi': [semafor, OUT], 'sablona-report-z-auditu': [report, __dirname] }
  for (const [name, [html, dir]] of Object.entries(docs)) {
    const src = path.join(__dirname, name + '.html'); fs.writeFileSync(src, html)
    await pg.goto('file://' + src); await pg.evaluate(() => document.fonts.ready)
    await pg.pdf({ path: path.join(dir, name + '.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true })
    console.log('PDF', name)
  }
  // OG obrázek 1200×630
  await pg.setViewportSize({ width: 1200, height: 630 })
  await pg.setContent(`<style>${css} body{background:#07090D;color:#F2F5F9;width:1200px;height:630px;position:relative;overflow:hidden}
  .w{position:absolute;left:72px;top:64px;right:72px}.l{font-family:Tight;font-weight:700;font-size:34px}.t{font-size:17px;letter-spacing:.14em;text-transform:uppercase;color:#9AA6B8;margin-top:70px}
  h1{font-size:76px;line-height:1.04;margin-top:18px;max-width:900px}h1 em{color:#C8FF3E;font-style:normal}</style>
  <svg width="1200" height="630" style="position:absolute;inset:0">${[40, 120, 200, 300, 400, 480, 560, 610].map((y) => `<path d="M560 ${y} C 850 ${y}, 950 500, 1060 500" fill="none" stroke="#4DA3FF" stroke-opacity=".28"/>`).join('')}<path d="M1060 500 H1200" stroke="#C8FF3E" stroke-width="3"/><circle cx="1060" cy="500" r="7" fill="#C8FF3E"/></svg>
  <div class="w"><div class="l">Boostia</div><div class="t">Měřený AI trénink pro obchodní týmy</div><h1>O <em>3 hodiny</em> týdně víc na prodej. Za <em>8 týdnů</em>, změřeno.</h1></div>`)
  await pg.evaluate(() => document.fonts.ready)
  await pg.screenshot({ path: path.join(WEB, 'public', 'og.png') })
  console.log('OG image')
  await b.close()
})()
