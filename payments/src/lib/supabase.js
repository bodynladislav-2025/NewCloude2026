import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://rstuhinwhcguefpyfsdz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzdHVoaW53aGNndWVmcHlmc2R6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0MDcxNTMsImV4cCI6MjA5MDk4MzE1M30.TqjmhdwxTkU4pfubGXju5T124HEENcwnR1eFsX_FU2E'
);

// DB (snake_case) → App (camelCase)
export const fromDB = {
  template: (t) => ({
    id: t.id,
    name: t.name,
    amount: Number(t.amount),
    category: t.category,
    type: t.type,
    active: t.active,
    sortOrder: t.sort_order,
  }),
  item: (i) => ({
    id: i.id,
    year: i.year,
    month: i.month,
    templateId: i.template_id,
    name: i.name,
    amount: Number(i.amount),
    category: i.category,
    type: i.type,
    paid: i.paid,
    paidAt: i.paid_at,
    sortOrder: i.sort_order,
  }),
};
