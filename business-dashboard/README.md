# Obchodní Dashboard

Webová aplikace pro sledování obchodních výsledků. Přihlášení přes Google OAuth, data z K2 parsována pomocí Claude AI.

## Rychlý start

### 1. Supabase projekt

1. Vytvoř projekt na [supabase.com](https://supabase.com)
2. V **SQL Editoru** spusť soubor `supabase/migrations/001_initial_schema.sql`
3. V **Storage** vytvoř bucket `uploads` (nastavení: Private)
4. V **Authentication → Providers** povol Google OAuth (nastav Client ID + Secret z Google Cloud Console)

### 2. Lokální spuštění

```bash
cd business-dashboard
cp .env.local.example .env.local
# Vyplň VITE_SUPABASE_URL a VITE_SUPABASE_ANON_KEY z Supabase → Settings → API
npm install
npm run dev
# Otevři http://localhost:5174
```

### 3. Edge Function (pro parsování screenshotů)

```bash
# Instalace Supabase CLI
npm install -g supabase

# Přihlášení
supabase login

# Propojení s projektem
supabase link --project-ref TVUJ_PROJECT_REF

# Nasazení funkce
supabase functions deploy parse-document

# Nastavení API klíče (server-side, bezpečné)
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
```

### 4. Nasazení na Vercel

1. Push do GitHub
2. Import projektu na [vercel.com](https://vercel.com)
3. Nastav **Root Directory** na `business-dashboard`
4. Přidej environment proměnné z `.env.local`

## Struktura

```
business-dashboard/
├── src/
│   ├── pages/
│   │   ├── Dashboard.jsx    # Hlavní přehled
│   │   ├── Upload.jsx       # Nahrávání dat z K2
│   │   ├── Plan.jsx         # Zadávání obchodního plánu
│   │   ├── History.jsx      # Historie a trendy
│   │   └── Settings.jsx     # Nastavení
│   ├── components/          # Sdílené komponenty
│   ├── hooks/               # React hooks (auth, period)
│   ├── lib/                 # Supabase client
│   └── utils/               # Formátování, svátky, pracovní dny
├── supabase/
│   ├── functions/parse-document/  # Edge Function pro Claude API
│   └── migrations/                # SQL schéma
└── .env.local.example
```

## Funkce

- **Dashboard** – KPI karty (gauge plnění), prognóza, tabulka obchodníků, pipeline, aging faktur
- **Nahrát data** – drag & drop Excel/CSV/screenshotů, automatické parsování, preview s editací
- **Plán** – zadávání měsíčního plánu pro firmu i každého obchodníka
- **Historie** – roční přehled, srovnání let, trend grafy
- **Nastavení** – název firmy, logo, správa obchodníků, whitelist emailů

## Pracovní dny

Aplikace počítá očekávané plnění plánu na základě pracovních dní (Po–Pá bez českých státních svátků). Vzorec:
`Očekávané % = pracovní dny od 1. do dnes / celkové pracovní dny v měsíci × 100`
