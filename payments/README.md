# Měsíční platby

Jednoduchá osobní aplikace na správu měsíčních plateb — náhrada za excelovou tabulku.
Funguje na mobilu i počítači, data se synchronizují přes Supabase.

## Funkce

- **Měsíc** — seznam výdajů (seskupený podle kategorií) a příjmů pro daný měsíc.
  Fajfkou označíte platbu jako zaplacenou. Nahoře vidíte souhrn: příjmy, výdaje,
  kolik zbývá zaplatit a bilanci. Mezi měsíci se listuje šipkami.
- **Šablona** — pravidelné platby a příjmy, které se automaticky předvyplní do
  každého nově otevřeného měsíce. Položku lze dočasně vypnout přepínačem.
  Jednorázové platby se přidávají přímo v měsíci.
- **Rok** — přehled všech měsíců v roce s příjmy, výdaji, nezaplacenou částkou
  a bilancí. Kliknutím na řádek otevřete daný měsíc.

## Změna PINu

PIN je v souboru [`src/config.js`](src/config.js) — změňte hodnotu `APP_PIN`
a aplikaci znovu nasaďte. Po změně se aplikace na všech zařízeních znovu zamkne.

## Vývoj

```bash
cd payments
npm install
npm run dev
```

## Nasazení (Vercel / Netlify)

Aplikace je samostatný Vite projekt ve složce `payments/` tohoto repozitáře.
Při nasazení nastavte **Root Directory** na `payments`, build command `npm run build`,
output `dist`.

## Databáze

Používá stejný Supabase projekt jako tenisová aplikace, tabulky:

- `payment_templates` — šablona pravidelných plateb/příjmů
- `payment_months` — evidence už založených měsíců
- `payment_items` — konkrétní položky v jednotlivých měsících
