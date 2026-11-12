// Sdílený obsah: ceny, moduly, FAQ. Mění se na jednom místě.
export const PRICE = { program: '290 000 Kč', founding: '220 000 Kč', startDay: '39 000 Kč', map: '45 000 Kč', provoz: '19 000 Kč', klub: '9 900 Kč' }

// Termíny kohort a volná místa. DOPLNIT skutečná data, pak nastavte `set: true`.
export const COHORT = { set: false, date: '', spots: 3, of: 3, foundingLeft: 3 }

export const MODULES = [
  ['01', 'Bezpečná AI', 'Co do AI smí a co ne. Tým odchází s podepsanou směrnicí a firemními účty.'],
  ['02', 'Příprava na schůzku za 10 minut', 'Firma, člověk, hypotézy potřeb, otázky. Z veřejných zdrojů a z vašeho CRM.'],
  ['03', 'Zápis, CRM a follow-up do 15 minut', 'Z nahrávky nebo poznámek rovnou zápis, úkoly a e-mail klientovi.'],
  ['04', 'Nabídka do 24 hodin', 'Asistent naučený na vašich nejlepších nabídkách. Plus příprava na cenové námitky.'],
  ['05', 'Prospecting, cross-sell a up-sell', 'Oslovení, které nezní jako šablona. Každý týden seznam klientů, kteří mohou kupovat víc.'],
  ['06', 'Týmoví asistenti a trénink hovorů', 'Knihovna, kterou používá celý tým. AI jako sparing partner před těžkým jednáním.'],
]

export const WEEKS = [
  ['1', 'Start, 3 h online', 'Měření výchozího stavu (stopky na 5 činnostech), účty, cíle', 'Výchozí čísla týmu'],
  ['2', 'Den 1, 7 h', 'Bezpečná AI a základy zadávání pro obchod', 'Podepsaná AI směrnice, semafor dat'],
  ['3', 'Den 2, 7 h', 'Příprava na schůzku za 10 minut', 'Asistent Příprava schůzky'],
  ['4', 'Den 3, 7 h', 'Zápisy, CRM a follow-up do 15 minut', 'Šablona zápisu, napojení na CRM'],
  ['5', 'Den 4, 7 h', 'Nabídka do 24 hodin, cena a námitky', 'Asistent Nabídka, banka námitek'],
  ['6', 'Den 5, 7 h', 'Prospecting, cross-sell a up-sell', 'Sekvence oslovení, mapa příležitostí'],
  ['7', 'Den 6, 7 h', 'Týmoví asistenti a trénink hovorů s AI', 'Playbook AI obchodu'],
  ['8', 'Finále, 5 h', 'Měření po, prezentace vedení, plán na 90 dní, osvědčení', 'Report úspor v hodinách a Kč'],
]

export const TOOLS = ['Raynet', 'Pipedrive', 'HubSpot', 'Salesforce', 'eWay-CRM', 'Microsoft 365 Copilot', 'ChatGPT', 'Claude', 'Google Workspace', 'Excel']

export const FAQ_HOME = [
  { q: 'Musí být obchodníci celý den mimo terén?', a: 'V ten den dělají svoji práci, jen jinak: připravují skutečné schůzky a píšou skutečné nabídky. Program jde rozdělit na dva půldny týdně.' },
  { q: 'Bude to fungovat s naším CRM?', a: 'Ano. Pracujeme s tím, co máte: Raynet, Pipedrive, HubSpot, Salesforce, eWay i Excel. První týden si ověříme, co vaše CRM umožňuje.' },
  { q: 'Jaké nástroje budeme potřebovat?', a: 'Firemní účet ChatGPT, Microsoft Copilot nebo Claude, podle toho, co už máte nebo co vám doporučíme. Licence stojí řádově stovky korun na osobu měsíčně a nejsou v ceně.' },
  { q: 'Co když někdo z týmu s počítačem moc nekamarádí?', a: 'Každý účastník má individuální konzultaci s lektorem a pracujeme ve dvojicích. Kdo umí napsat e-mail, zvládne i tohle.' },
  { q: 'Jak je to s bezpečností dat?', a: 'Je to první téma programu. Nastavíme účty, kde se vaše data nepoužívají k trénování modelů, a tým podepíše pravidla, co do AI nepatří.' },
  { q: 'Jak přesně měříte výsledek?', a: 'Stopujeme pět činností (příprava schůzky, zápis, follow-up, nabídka, vyhledání informací) u každého účastníka první a osmý týden. Metodiku dostanete předem.' },
  { q: 'Co když dotaci nedostaneme?', a: 'Rozhodnete se až po ověření nároku. Když Úřad práce žádost zamítne, můžete od smlouvy odstoupit bez sankce.' },
  { q: 'Děláte i otevřené kurzy pro jednotlivce?', a: 'Zatím ne. Program stojí na tom, že se mění práce celého týmu.' },
  { q: 'Čím se lišíte od běžného AI školení?', a: 'Délkou (8 týdnů místo jednoho dne), zaměřením (jen obchod) a tím, že výsledek měříme a ručíme za něj.' },
]

export const FAQ_AGENTI = [
  { q: 'Musíme mít nejdřív školení?', a: 'Nemusíte, ale doporučujeme to: agenta používají lidé a tým, který AI rozumí, ho přijme.' },
  { q: 'Kdo to programuje?', a: 'Náš vývojový tým. Vy máte jeden kontakt a jednu smlouvu s Boostií.' },
  { q: 'Napojíte se na náš systém?', a: 'Pokud má API nebo export, ano. Ověříme v Mapě automatizace.' },
  { q: 'Co stojí provoz?', a: 'Od 19 000 Kč měsíčně včetně nákladů na modely do sjednaného limitu.' },
]

export const FAQ_DOTACE = [
  { q: 'Kolik práce to dá našemu HR?', a: 'Zhruba dvě až čtyři hodiny. Osnovu, harmonogram a profil lektora dodáme my.' },
  { q: 'Účtujete si za pomoc s dotací?', a: 'Ne, je v ceně programu.' },
  { q: 'Jsou i jiné programy?', a: 'Ano, například výzvy OPZ+ nebo projekty oborových sdružení. Při ověření projdeme všechny, které pro vás připadají v úvahu.' },
]

export const FAQ_AUDIT = [
  { q: 'Je to opravdu zdarma?', a: 'Ano. Část firem s námi potom spolupracuje, část ne. Číslo dostanou všechny.' },
  { q: 'Budete mi něco prodávat?', a: 'Když uvidíme, že vám umíme pomoct, řekneme jak a za kolik. Když ne, řekneme to taky.' },
  { q: 'Kdo by měl být na hovoru?', a: 'Ideálně obchodní ředitel a ten, kdo rozhoduje o rozpočtu.' },
]
