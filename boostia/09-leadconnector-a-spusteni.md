# FÁZE 9 – Implementace v LeadConnector a spuštění

## 9.1 Pipelines

**Pipeline 1: Obchod – AI Obchod 50**

| # | Fáze | Vstup do fáze | Pravděpodobnost | Automatika |
|---|---|---|---|---|
| 1 | Nový lead | formulář krok 1, kalkulačka s e-mailem, ruční zadání | 3 % | sekvence 1 nebo úkol „zavolat do 24 h" |
| 2 | Audit rezervován | rezervace v kalendáři | 15 % | sekvence 2 |
| 3 | Audit proběhl | status schůzky „showed" | 30 % | úkol „report do 24 h" |
| 4 | Nabídka odeslána | odeslán report s nabídkou | 35 % | sekvence 4, úkoly telefon den 2 a 8 |
| 5 | Start den prodán | objednávka Start dne | 60 % | fakturace, úkol „termín" |
| 6 | Smlouva odeslána | ústní ano | 80 % | připomínka po 3 dnech |
| 7 | Dotace v řešení | podpis + žádost | 90 % | úkoly pro HR, hlídání lhůt |
| 8 | Vyhráno | podpis (a schválení, je-li podmínkou) | 100 % | sekvence 5, založení v pipeline Delivery |
| – | Prohra | výslovné ne | 0 % | povinné pole „důvod prohry", newsletter |
| – | Odloženo | „později" | – | úkol na dohodnuté datum |
| – | No-show | status „no-show" | – | sekvence 3 |

**Pipeline 2: Delivery** – Onboarding → Týden 1 (měření) → Týdny 2–7 → Finále (měření) → Kontrola po 60 dnech → Klub / ukončeno.
**Pipeline 3: AI agenti** – Zájem → Mapa prodána → Mapa předána → Nabídka stavby → Stavba (milník 1 / 2 / akceptace) → Provoz.
**Pipeline 4: Partneři** – Osloven → Schůzka → Dohoda → Aktivní (poslal lead).

## 9.2 Tagy

| Skupina | Tagy |
|---|---|
| Zdroj | `zdroj-outbound-email`, `zdroj-linkedin`, `zdroj-kalkulacka`, `zdroj-prompt-pack`, `zdroj-partner`, `zdroj-doporuceni`, `zdroj-event`, `zdroj-reklama` |
| Role | `role-jednatel`, `role-obchodni-reditel`, `role-hr`, `role-obchodnik`, `role-jina` |
| Kvalifikace | `audit-kvalifikovany`, `audit-uvodni`, `nurture`, `maly-tym` |
| Stav | `lead-kalkulacka`, `audit-rezervovan`, `priprava-vyplnena`, `audit-probehl`, `no-show`, `no-show-uzavreno`, `nabidka-odeslana`, `klient`, `klient-zakladajici`, `prohra`, `nezajem` |
| Zájem | `zajem-dotace`, `zajem-agenti`, `zajem-start-den` |
| Komunikace | `newsletter`, `odhlasen`, `nekontaktovat` |
| Produkt | `absolvent-obchod50`, `klub`, `provoz` |

## 9.3 Custom fields

**Kontakt:** `role` (výběr) · `sales_team_size` (výběr) · `crm_system` · `decision_maker` · `timeline` · `subsidy_interest` · `biggest_pain` (text) · `lead_score` (číslo) · `route` · `utm_source/medium/campaign/content` · `consent_marketing` (ano/ne + datum)
**Kalkulačka:** `calc_reps`, `calc_meetings`, `calc_prep_min`, `calc_notes_min`, `calc_offers`, `calc_offer_hours`, `calc_hour_cost`, `calc_hours_week`, `calc_czk_year`
**Příprava auditu:** `prep_minutes_meeting`, `prep_minutes_notes`, `prep_hours_offer`, `prep_meetings_week`, `prep_status`
**Audit (vyplňuje lektor):** `audit_nonselling_hours`, `audit_hours_week`, `audit_czk_year`, `audit_pain_quote`, `participants`, `subsidy_amount`, `price_after_subsidy`, `followup_date`, `loss_reason` (výběr: cena / načasování / není priorita / jiný dodavatel / malý tým / bez odpovědi)
**Firma:** `ico`, `employees`, `industry`
**Custom values (globální, mění se na jednom místě):** `next_cohort_date`, `next_cohort_month`, `next_cohort_spots`, `following_cohort_date`, `subsidy_deadline`, `start_day_dates`, `audit_link`, `audit_short_link`, `program_price`, `ai_tool`

## 9.4 Workflows

| # | Název | Trigger | Akce a časování |
|---|---|---|---|
| W1 | Příjem leadu z webu | Inbound webhook (formulář auditu) | Vytvořit/aktualizovat kontakt → uložit pole a UTM → spočítat skóre → nastavit `route` a tagy → vytvořit deal ve fázi Nový lead → **pokud krok 2 nedokončen do 15 min:** e-mail „Zbývají 4 otázky" + úkol zavolat do 24 h → interní notifikace (e-mail + push) |
| W2 | Kalkulačka | Inbound webhook (kalkulačka) | Uložit `calc_*` → tag `lead-kalkulacka` → e-mail 1.1 hned → sekvence 1 → pokud `calc_reps ≥ 4` a úspora ≥ 1,5 h/os.: úkol „zavolat do 24 h" |
| W3 | Rezervace auditu | Appointment booked (kalendář Audit) | Tag `audit-rezervovan` → deal do fáze 2 → ukončit sekvenci 1 → e-mail 2.1 + SMS 2.2 hned → e-mail 2.3 (−2 dny, jen když je rezervace > 3 dny dopředu) → e-mail 2.4 (−24 h) → SMS 2.5 (−2 h) → e-mail 2.6 (−10 min) → interní: připravit podklady (−1 h) |
| W4 | Příprava vyplněna | Inbound webhook (příprava) | Uložit `prep_*` → tag `priprava-vyplnena` → `prep_status = vyplněno` → notifikace lektorovi |
| W5 | Změna termínu | Appointment rescheduled / cancelled | Zastavit W3 → při přesunu spustit znovu; při zrušení e-mail s odkazem na nový termín + úkol zavolat |
| W6 | Audit proběhl | Appointment status = showed | Tag `audit-probehl` → deal do fáze 3 → úkol „vyplnit audit pole a odeslat report do 24 h" (termín +24 h, eskalace +30 h) |
| W7 | No-show | Appointment status = no-show | Tag `no-show` → e-mail 3.1 (+15 min) → SMS 3.2 (+2 h) → e-mail 3.3 (+2 dny) → e-mail 3.4 (+6 dní) → tag `no-show-uzavreno` → newsletter. Ukončit při nové rezervaci nebo odpovědi |
| W8 | Po auditu | Deal přesunut do „Nabídka odeslána" | E-mail 4.1 hned (ručně schválit) → úkol telefon (+2 dny) → 4.2 (+3) → 4.3 (+6) → úkol telefon (+8) → 4.4 (+9, **jen když jsou vyplněná pole dotace**) → 4.5 (+13) → 4.6 (+18) → úkol „za 90 dní" → newsletter. Ukončit při odpovědi, výhře, prohře |
| W9 | Vyhráno | Deal → Vyhráno | Tag `klient` → ukončit W8 → e-mail 5.1 → 5.2 (+3 dny) → založit kartu v pipeline Delivery → úkoly: dotace, účastníci, místnost, účty |
| W10 | Účastníci programu | Tag `ucastnik` + datum startu | 5.3 (−7 dní) → 5.4 (−1 den) → po každém týdnu připomínka úkolu |
| W11 | Doporučení | Delivery → Týden 4 | Úkol pro lektora: požádat ředitele o 2 doporučení; e-mail s hotovým textem k přeposlání |
| W12 | Nabídka agentů | Delivery → Týden 7 | Úkol: nabídnout Mapu automatizace; tag `zajem-agenti` při zájmu |
| W13 | Kontrola po 60 dnech | Delivery → Finále + 60 dní | E-mail s výzvou k měření → úkol → nabídka Klubu → žádost o referenci |
| W14 | Newsletter | Ruční kampaň, každé druhé úterý 7:30 | Segment `newsletter` bez `odhlasen` |
| W15 | Odpověď na e-mail | Customer replied | Pozastavit všechny běžící sekvence kontaktu → notifikace → úkol „odpovědět do 4 pracovních hodin" |
| W16 | Odhlášení a „ne" | Unsubscribe / odpověď obsahuje „ne", „nemám zájem" | Tag `odhlasen` nebo `nezajem` → DND pro marketing → ukončit vše |
| W17 | Hygiena | Deal bez aktivity 14 dní | Notifikace vlastníkovi |

**Cold outbound** běží v samostatném nástroji (Instantly / Smartlead / lemlist) na samostatné doméně, ne v LeadConnectoru, aby se neohrozila pověst hlavní domény. Kladná odpověď → webhook → kontakt do LeadConnectoru s tagem `zdroj-outbound-email`.

## 9.5 Formuláře, kalendáře, připomínky

- **Formuláře:** vlastní na webu → webhooky W1, W2, W4 a kontaktní. V LeadConnectoru jen záložní formulář (kdyby web vypadl) a interní formulář „Záznam auditu" pro lektora.
- **Kalendář „Audit 30 min":** út–čt 8:00–11:00 a 15:00–17:30, pá 8:00–10:00 · sloty po 30 min + 15 min rezerva · min. 18 hodin předem, max. 14 dní dopředu · max. 4 audity denně · Google Meet automaticky · potvrzení a připomínky z kalendáře vypnout (řeší W3) · přesměrování po rezervaci na `/dekujeme` s parametry.
- **Kalendář „Úvodní hovor 15 min":** stejná okna, max. 3 denně.
- **Kalendář „Follow-up 20 min":** jen přes odkaz z emailů po auditu.
- **SMS:** české číslo nebo alfanumerický odesílatel „Boostia" **[OVĚŘIT dostupnost a cenu v LeadConnectoru pro ČR; záloha: SMS brána napojená webhookem]**. Odesílat jen 8:00–19:00.

## 9.6 Reporting dashboard

| Widget | Metrika | Cíl |
|---|---|---|
| Leady týdně podle zdroje | počet, podle tagu `zdroj-*` | 15+ |
| Audity: rezervované / proběhlé / show-up | týdně | 5 / 4 / ≥ 78 % |
| Formulář: krok 1 → krok 2 → rezervace | % | ≥ 75 % / ≥ 85 % |
| Kvalifikované příležitosti | podíl z proběhlých | ≥ 70 % |
| Pipeline v Kč (vážená) | podle fází | ≥ 3× měsíční cíl |
| Výhry měsíčně | počet a Kč, podle produktu | viz plán |
| Délka cyklu | medián dní audit → podpis | ≤ 30 |
| Důvody proher | podle `loss_reason` | sledovat trend |
| Rychlost reakce | medián času do prvního kontaktu | ≤ 4 pracovní hodiny |
| E-maily | open / click / reply podle sekvence | open ≥ 45 %, reply na outbound ≥ 6 % |
| Kalkulačka | dokončení, e-maily, podíl na auditech | ≥ 25 % e-mailů z dokončených |
| Delivery | docházka, splněné úkoly, změřená úspora | ≥ 85 % / ≥ 80 % / ≥ 3 h |

Pondělní rituál (20 min): projít dashboard, tři čísla pod alarmem, jedna změna na tento týden.

## 9.7 Checklist spuštění

**Doména a e-mail**
- [ ] Hlavní doména (např. boostia.cz) na Vercelu, `www` → kořen, HTTPS.
- [ ] Odesílací subdoména pro LeadConnector (např. `mail.boostia.cz`), dedikovaná doména v nastavení e-mailu.
- [ ] Samostatná doména pro cold outbound (např. `boostia-tym.cz`), 2–3 schránky, 3 týdny zahřívání, max. 30 nových kontaktů na schránku denně.
- [ ] SPF (jeden záznam, všechny odesílací služby), DKIM pro každou službu, DMARC `p=none` s reportováním → po 4 týdnech `quarantine`.
- [ ] Test doručitelnosti (mail-tester, cíl 9+/10), kontrola blacklistů, test do Gmailu, Seznamu a Outlooku. Seznam.cz otestovat zvlášť.
- [ ] Sledovací doména pro odkazy s vlastním CNAME.

**Právní**
- [ ] Zásady zpracování osobních údajů a obchodní podmínky zkontrolované právníkem.
- [ ] Cookie lišta s Consent Mode v2, skripty až po souhlasu.
- [ ] Souhlas u formulářů (oddělený marketingový souhlas, odkaz na zásady), záznam data a znění.
- [ ] Zpracovatelské smlouvy: LeadConnector, hosting, nástroj na outbound, technický partner.
- [ ] Patička e-mailů: název firmy, IČO, sídlo, odhlášení.
- [ ] Posouzení oprávněného zájmu pro cold outbound, seznam „nekontaktovat".
- [ ] Vzor smlouvy s Garancí 3 hodin, metodikou měření a odstoupením při zamítnutí dotace.
- [ ] Souhlas s nahráváním (VSL, ukázky, případové studie).

**Dotace**
- [ ] Ověřit na Úřadu práce podmínky pro vzdělavatele a aktuální sazby; rozhodnout o akreditaci nebo partnerovi.
- [ ] Osnova, hodinová dotace, profil lektora, vzor prezenční listiny a osvědčení.

**Web a měření**
- [ ] Všechny placeholdery [PROOF/DOPLNIT/OVĚŘIT] vyřešené nebo vědomě ponechané v poctivé verzi.
- [ ] Lighthouse mobil ≥ 90, LCP < 2,5 s, CLS < 0,1 na hlavní stránce a na /audit.
- [ ] Test s `prefers-reduced-motion`, klávesnicí a čtečkou.
- [ ] GA4, Meta Pixel + CAPI, LinkedIn Insight, Clarity; ověřit eventy v debug režimu.
- [ ] Sitemap v Search Console, schema validní, OG náhledy na LinkedInu.

**Test celé cesty zákazníka (projít 3× různou personou)**
- [ ] Kalkulačka → e-mail s výpočtem → sekvence 1 → klik na audit.
- [ ] Formulář kvalifikovaný → kalendář → děkovná → příprava → všechny připomínky (e-mail i SMS) ve správný čas.
- [ ] Formulář „úvodní hovor" a „nurture" → správná větev.
- [ ] Opuštěný formulář po kroku 1 → e-mail + úkol.
- [ ] Přesun a zrušení termínu.
- [ ] No-show → sekvence 3 → nová rezervace sekvenci ukončí.
- [ ] Showed → úkol reportu → sekvence 4 → odpověď ji pozastaví.
- [ ] Vyhráno → onboarding → pipeline Delivery.
- [ ] Odhlášení a odpověď „ne" zastaví vše.
- [ ] Mobil (iOS Safari, Android Chrome), pomalé připojení, výpadek webhooku.

## 9.8 30denní plán testování

**Realita vzorků:** při stovkách návštěv měsíčně klasický A/B test s 95% jistotou nevyjde. Proto: (1) testovat velké rozdíly, ne barvu tlačítka; (2) na webu vyhodnocovat směrově a doplnit nahrávkami z Clarity a otázkou na auditu „co vás přimělo si to rezervovat"; (3) statisticky testovat tam, kde je objem: outbound e-maily.

| Týden | Test | Varianty | Metrika | Vzorek a vyhodnocení |
|---|---|---|---|---|
| 1–2 | **Předmět a první věta outboundu** | A „zápisy ze schůzek v {{company}}" vs. B „{{first_name}}, otázka k vašemu obchodu" | kladné odpovědi | 150 + 150 kontaktů; rozhodnout při rozdílu ≥ 2 p. b., jinak pokračovat do 300 + 300 |
| 1–2 | **Role v outboundu** | obchodní ředitel vs. jednatel vs. HR | rezervace auditu na 100 oslovených | 100 na roli; přesunout objem k nejlepší |
| 1–4 | **Headline hlavní stránky** | 1 (3 hodiny, změřeno) vs. 2 (kolik vás stojí…) | klik na CTA + start kalkulačky | po 400 návštěvách na variantu nebo po 4 týdnech; směrově |
| 2–3 | **Kalkulačka: brána** | výsledek volně + e-mail za report vs. e-mail před výsledkem | počet e-mailů a podíl, který rezervuje audit | 200 dokončení na variantu |
| 2–4 | **Landing auditu** | s VSL vs. bez VSL (jen headline + odrážky + formulář) | odeslaný formulář | 150 návštěv na variantu |
| 3–4 | **Garance na webu** | plné znění (první den + 3 hodiny) vs. jen „první den na naše riziko" | klik na CTA ze sekce, zmínky na auditech | směrově + kvalitativně z 10 auditů |
| 3–4 | **Nabídka na auditu** | program přímo vs. Start den jako první krok | podíl uzavřených a tržba na audit | 10 + 10 auditů; střídat po týdnech |
| 4 | **Předměty sekvence 2** | A vs. B u e-mailu 2.4 | show-up | průběžně, vyhodnotit po 40 rezervacích |
| průběžně | **SMS připomínka** | 2 h vs. 30 min předem | show-up | po 40 rezervacích |

**Pořadí priorit:** nejdřív outbound (rychlá data, přímý vliv na počet auditů) → headline → nabídka na auditu → garance → zbytek.
**Vyhodnocení:** každé pondělí 20 minut; 30. den souhrn: co ponechat, co zahodit, tři testy na další měsíc. Po prvních 20 auditech přepsat web slovy, která klienti sami použili.

## Self-review fáze 9

**Kolo 1 – slabiny:** (1) Workflow jen vyjmenované → doplněn trigger, akce a časování u každého. (2) A/B plán předstíral statistickou jistotu při malém provozu → přiznáno a přeskládáno podle objemu. (3) Cold outbound z hlavní domény by ohrozil doručitelnost → oddělená doména a nástroj.
**Kolo 2 – slabiny:** (1) E-mail o dotaci by šel automaticky bez ověření → podmínka ve W8. (2) Chyběla reakce na odpovědi → W15. (3) SMS v ČR přes LeadConnector není jistota → označeno k ověření se zálohou.

| Kritérium | Kolo 1 | Finál |
|---|---|---|
| Konkrétnost | 8 | 9,5 |
| Přesvědčivost | 8 | 9 |
| Jasnost | 8 | 9 |
| Konzistence | 9 | 9,5 |
| Proveditelnost | 7 | 9 |
| Pravdivost | 8 | 9 |
