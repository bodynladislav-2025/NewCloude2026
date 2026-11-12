// Sdílený obsah: ceny, moduly, FAQ. Mění se na jednom místě.
export const PRICE = { program: '23 900 Kč', full: '358 500 Kč', startDay: '39 000 Kč', map: '45 000 Kč', provoz: '19 000 Kč', klub: '9 900 Kč' }

// Termíny kohort a volná místa. DOPLNIT skutečná data, pak nastavte `set: true`.
export const COHORT = { set: false, date: '', spots: 3, of: 3 }

export const MODULES = [
  ['01', 'Bezpečná AI', 'Co do AI smí a co ne. Tým odchází s podepsanou směrnicí a firemními účty.'],
  ['02', 'Příprava na schůzku za 10 minut', 'Firma, člověk, hypotézy potřeb, otázky. Z veřejných zdrojů a z vašeho CRM.'],
  ['03', 'Zápis, CRM a follow-up do 15 minut', 'Z nahrávky nebo poznámek rovnou zápis, úkoly a e-mail klientovi.'],
  ['04', 'Nabídka do 24 hodin', 'Asistent naučený na vašich nejlepších nabídkách. Plus příprava na cenové námitky.'],
  ['05', 'Prospecting, cross-sell a up-sell', 'Oslovení, které nezní jako šablona. Každý týden seznam klientů, kteří mohou kupovat víc.'],
  ['06', 'Týmoví asistenti a trénink hovorů', 'Knihovna, kterou používá celý tým. AI jako sparing partner před těžkým jednáním.'],
]

// 9 školicích dní, dohromady 50 hodin (4 + 7 × 6 + 4). Obvykle jeden den týdně.
export const DAYS = [
  ['1', 'Start, 4 h', 'Měření výchozího stavu (stopky na 5 činnostech), účty, cíle', 'Výchozí čísla týmu'],
  ['2', '6 h', 'Bezpečná AI a základy zadávání pro obchod', 'Podepsaná AI směrnice, semafor dat'],
  ['3', '6 h', 'Příprava na schůzku za 10 minut', 'Asistent Příprava schůzky'],
  ['4', '6 h', 'Zápisy, CRM a follow-up do 15 minut', 'Šablona zápisu, napojení na CRM'],
  ['5', '6 h', 'Nabídka do 24 hodin, cena a námitky', 'Asistent Nabídka, banka námitek'],
  ['6', '6 h', 'Prospecting a oslovení, které nezní jako šablona', 'Sekvence oslovení'],
  ['7', '6 h', 'Stávající klienti: cross-sell a up-sell', 'Mapa příležitostí v portfoliu'],
  ['8', '6 h', 'Týmoví asistenti a trénink hovorů s AI', 'Playbook AI obchodu'],
  ['9', 'Finále, 4 h', 'Měření po, prezentace vedení, plán na 90 dní, osvědčení', 'Report úspor v hodinách a Kč'],
]

export const TOOLS = ['Raynet', 'Pipedrive', 'HubSpot', 'Salesforce', 'eWay-CRM', 'Microsoft 365 Copilot', 'ChatGPT', 'Claude', 'Google Workspace', 'Excel']

export const FAQ_HOME = [
  { q: 'Musí být obchodníci celý den mimo terén?', a: 'V ten den dělají svoji práci, jen jinak: připravují skutečné schůzky a píšou skutečné nabídky. Devět dní je rozložených zhruba do dvou měsíců, obvykle jeden den týdně.' },
  { q: 'Bude to fungovat s naším CRM?', a: 'Ano. Pracujeme s tím, co máte: Raynet, Pipedrive, HubSpot, Salesforce, eWay i Excel. První den si ověříme, co vaše CRM umožňuje.' },
  { q: 'Jaké nástroje budeme potřebovat?', a: 'Firemní účet ChatGPT, Microsoft Copilot nebo Claude, podle toho, co už máte nebo co vám doporučíme. Licence stojí řádově stovky korun na osobu měsíčně a nejsou v ceně.' },
  { q: 'Co když někdo z týmu s počítačem moc nekamarádí?', a: 'Každý účastník má individuální konzultaci s lektorem a pracujeme ve dvojicích. Kdo umí napsat e-mail, zvládne i tohle.' },
  { q: 'Jak je to s bezpečností dat?', a: 'Je to první téma programu. Nastavíme účty, kde se vaše data nepoužívají k trénování modelů, a tým podepíše pravidla, co do AI nepatří.' },
  { q: 'Jak přesně měříte výsledek?', a: 'Stopujeme pět činností (příprava schůzky, zápis, follow-up, nabídka, vyhledání informací) u každého účastníka první a devátý den programu. Vedení dostane rozdíl v hodinách a korunách. Metodiku dostanete předem.' },
  { q: 'Opravdu to zaplatí Úřad práce?', a: 'Příspěvek je 478,19 Kč za hodinu výuky a účastníka, při 50 hodinách tedy až 23 909 Kč na člověka. Program stojí 23 900 Kč za účastníka, takže ho příspěvek při plné docházce pokryje celý. Účtujeme nejméně 9 míst. Příspěvek ale není nárokový, přijde zpětně a nepokrývá DPH ani licence AI nástrojů.' },
  { q: 'Co když dotaci nedostaneme?', a: 'Neplatíte nic. Smlouva s námi začne platit až ve chvíli, kdy začne platit vaše dohoda s Úřadem práce.' },
  { q: 'Děláte i otevřené kurzy pro jednotlivce?', a: 'Zatím ne. Program stojí na tom, že se mění práce celého týmu.' },
  { q: 'Čím se lišíte od běžného AI školení?', a: 'Rozsahem (9 školicích dní místo jednoho), zaměřením (jen obchod) a tím, že výsledek měříme v hodinách a korunách.' },
]

export const FAQ_AGENTI = [
  { q: 'Musíme mít nejdřív školení?', a: 'Nemusíte, ale doporučujeme to: agenta používají lidé a tým, který AI rozumí, ho přijme.' },
  { q: 'Kdo to programuje?', a: 'Náš vývojový tým. Vy máte jeden kontakt a jednu smlouvu s Boostií.' },
  { q: 'Napojíte se na náš systém?', a: 'Pokud má API nebo export, ano. Ověříme v Mapě automatizace.' },
  { q: 'Co stojí provoz?', a: 'Od 19 000 Kč měsíčně včetně nákladů na modely do sjednaného limitu.' },
]

export const FAQ_DOTACE = [
  { q: 'Kolik nás program reálně bude stát?', a: 'Program stojí 23 900 Kč bez DPH za účastníka, plná skupina 15 lidí tedy 358 500 Kč. Účtujeme nejméně 9 míst (215 100 Kč). Úřad práce vrátí až 23 909,50 Kč za každého zaměstnance, který kurz absolvuje (478,19 Kč za hodinu výuky). Od devíti lidí s plnou docházkou tak příspěvek pokryje celou cenu. Každá zameškaná hodina příspěvek sníží o 478 Kč a ten rozdíl doplácíte. Mimo příspěvek zůstává DPH a licence AI nástrojů.' },
  { q: 'Odkud ty peníze jsou a je to jisté?', a: 'Jde o projekt Úřadu práce ČR Vzdělávání pro firmy, reg. č. CZ.03.01.03/00/23_048/0006351, financovaný z Operačního programu Zaměstnanost plus. Žádosti se podávají od 1. 7. 2026 do 31. 8. 2028. Příspěvek není nárokový a o jeho přiznání rozhoduje Úřad práce, proto s vámi podmínky projdeme před podáním.' },
  { q: 'Koho můžeme na kurz poslat?', a: 'Zaměstnance s pracovní smlouvou aspoň na 10 hodin týdně, která trvá ještě nejméně 3 měsíce po skončení kurzu. Zařadit nejde lidi na dohodu o provedení práce nebo o pracovní činnosti. Žádat nemohou neziskové organizace, školy, obce a veřejná správa.' },
  { q: 'Co musíme splnit, aby příspěvek opravdu přišel?', a: 'Každý účastník musí odchodit aspoň 80 % výuky a příspěvek se počítá z hodin, které skutečně odseděl. Složení skupiny se během kurzu nesmí měnit. Výuka smí začít až po účinnosti dohody s Úřadem práce. Mzdu lidem za dobu výuky vyplácíte normálně. Příspěvek je podpora de minimis. Úplné znění je v podmínkách projektu na up.gov.cz/vzdelavani-pro-firmy.' },
  { q: 'Kdo podává žádost a kolik je s tím práce?', a: 'Žádost podáváte vy jako zaměstnavatel, online v aplikaci Úřadu práce. Podle pravidel projektu ji nesmí připravovat ten, kdo kurz dodává, proto ji za vás zpracovat nemůžeme. Dodáme podklady k obsahu kurzu a harmonogram. Když si administrativu nechcete vzít na sebe, svěřte ji nezávislému dotačnímu poradci.' },
  { q: 'Jak dlouho trvá, než můžeme začít?', a: 'Počítejte s rezervou dvou až tří měsíců od prvního kontaktu. Schválení obvykle trvá do 30 dní, pravidla ale úřadu žádnou lhůtu nestanovují, takže to zaručit nemůžeme. Termíny proto domlouváme s předstihem.' },
  { q: 'Je nás méně než 9. Musíme doplácet?', a: 'Ano. Účtujeme nejméně 9 míst a příspěvek dostanete jen za lidi, kteří kurz opravdu absolvují. Skupinu ale můžete doplnit kolegy z obchodní podpory, marketingu nebo vedení, kteří s obchodem pracují. Kalkulačka ukáže doplatek pro váš počet lidí.' },
  { q: 'Máme víc než 15 lidí. Jak to funguje?', a: 'V jednom běhu může být nejvýš 15 lidí. Pro větší počet vypíšeme další běh s vlastními termíny a příspěvek dostanete za každého zaměstnance stejný.' },
  { q: 'Pomůže nám kurz s AI Actem?', a: 'AI Act ukládá firmám, které AI používají, podporovat AI gramotnost svých lidí. Kurz s osvědčením o absolvování je jedním z takových kroků. Hlavním obsahem je ale praktická práce s AI v obchodě, AI Act je vedlejší přínos.' },
]

export const FAQ_AUDIT = [
  { q: 'Je to opravdu zdarma?', a: 'Ano. Část firem s námi potom spolupracuje, část ne. Číslo dostanou všechny.' },
  { q: 'Budete mi něco prodávat?', a: 'Když uvidíme, že vám umíme pomoct, řekneme jak a za kolik. Když ne, řekneme to taky.' },
  { q: 'Kdo by měl být na hovoru?', a: 'Ideálně obchodní ředitel a ten, kdo rozhoduje o rozpočtu.' },
]
