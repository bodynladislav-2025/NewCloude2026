-- =============================================================
-- Obchodní Dashboard – Počáteční schéma Supabase (PostgreSQL)
-- Spusť v Supabase SQL Editoru
-- =============================================================

-- Periods (měsíc/rok)
CREATE TABLE IF NOT EXISTS periods (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year       INTEGER NOT NULL,
  month      INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(year, month)
);

-- Salespersons (obchodníci)
CREATE TABLE IF NOT EXISTS salespersons (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  team       TEXT,
  active     BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Plans (obchodní plány)
CREATE TABLE IF NOT EXISTS plans (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period_id           UUID REFERENCES periods(id) ON DELETE CASCADE,
  level               TEXT NOT NULL CHECK (level IN ('company', 'salesperson', 'team')),
  entity_name         TEXT, -- jméno obchodníka / název týmu, NULL pro firemní úroveň
  revenue_target_czk  BIGINT DEFAULT 0,
  orders_target       INTEGER DEFAULT 0,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Uploads (archiv nahraných souborů)
CREATE TABLE IF NOT EXISTS uploads (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period_id    UUID REFERENCES periods(id) ON DELETE CASCADE,
  file_name    TEXT NOT NULL,
  file_type    TEXT NOT NULL CHECK (file_type IN ('excel', 'csv', 'screenshot', 'other')),
  data_type    TEXT NOT NULL CHECK (data_type IN ('sales', 'opportunities', 'invoices', 'mixed')),
  storage_path TEXT,
  parsed_at    TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Sales data (tržby a zakázky)
CREATE TABLE IF NOT EXISTS sales_data (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period_id        UUID REFERENCES periods(id) ON DELETE CASCADE,
  upload_id        UUID REFERENCES uploads(id) ON DELETE CASCADE,
  salesperson_name TEXT NOT NULL,
  team             TEXT,
  revenue_czk      BIGINT DEFAULT 0,
  orders_count     INTEGER DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Opportunities / Pipeline (příležitosti)
CREATE TABLE IF NOT EXISTS opportunities (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period_id        UUID REFERENCES periods(id) ON DELETE CASCADE,
  upload_id        UUID REFERENCES uploads(id) ON DELETE CASCADE,
  partner_name     TEXT NOT NULL,
  value_czk        BIGINT DEFAULT 0,
  status           TEXT,
  created_at_k2    DATE,
  salesperson_name TEXT,
  is_closed        BOOLEAN DEFAULT FALSE,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices aging (faktury po splatnosti)
CREATE TABLE IF NOT EXISTS invoices_aging (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period_id  UUID REFERENCES periods(id) ON DELETE CASCADE,
  upload_id  UUID REFERENCES uploads(id) ON DELETE CASCADE,
  days_range TEXT NOT NULL CHECK (days_range IN ('0-30', '31-60', '61-90', '90+')),
  total_czk  BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- App settings (nastavení aplikace)
CREATE TABLE IF NOT EXISTS settings (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key        TEXT UNIQUE NOT NULL,
  value      TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Default settings
INSERT INTO settings (key, value) VALUES
  ('company_name', 'Moje Firma s.r.o.'),
  ('company_logo_url', ''),
  ('warning_threshold_pct', '85')
ON CONFLICT (key) DO NOTHING;

-- =============================================================
-- Row Level Security (RLS)
-- Všichni přihlášení uživatelé vidí a mění všechna data (single-tenant)
-- =============================================================

ALTER TABLE periods       ENABLE ROW LEVEL SECURITY;
ALTER TABLE salespersons  ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans         ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploads       ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_data    ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices_aging ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings      ENABLE ROW LEVEL SECURITY;

-- Policies: authenticated users can do everything
CREATE POLICY "auth_all_periods"        ON periods        FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_all_salespersons"   ON salespersons   FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_all_plans"          ON plans          FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_all_uploads"        ON uploads        FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_all_sales_data"     ON sales_data     FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_all_opportunities"  ON opportunities  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_all_invoices_aging" ON invoices_aging FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_all_settings"       ON settings       FOR ALL USING (auth.role() = 'authenticated');

-- =============================================================
-- Storage bucket for uploaded files
-- =============================================================
-- Run this separately in Supabase Storage UI or via API:
-- Create bucket: "uploads" (private)
-- Policy: authenticated users can upload and read their files
