import { useCallback, useEffect, useState } from 'react';
import { supabase, fromDB } from '../lib/supabase';

// Načte položky daného měsíce; pokud měsíc ještě neexistuje,
// založí ho a naplní aktivními položkami ze šablony.
export function useMonthData(year, month) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: monthRow, error: mErr } = await supabase
        .from('payment_months')
        .select('year, month')
        .eq('year', year)
        .eq('month', month)
        .maybeSingle();
      if (mErr) throw mErr;

      if (!monthRow) {
        const { data: templates, error: tErr } = await supabase
          .from('payment_templates')
          .select('*')
          .eq('active', true)
          .order('sort_order')
          .order('created_at');
        if (tErr) throw tErr;

        const { error: insMonthErr } = await supabase
          .from('payment_months')
          .insert({ year, month });
        // 23505 = měsíc mezitím založilo jiné zařízení; položky už má
        if (insMonthErr && insMonthErr.code !== '23505') throw insMonthErr;

        if (!insMonthErr && templates.length > 0) {
          const rows = templates.map((t, idx) => ({
            year,
            month,
            template_id: t.id,
            name: t.name,
            amount: t.amount,
            category: t.category,
            type: t.type,
            sort_order: idx,
          }));
          const { error: insErr } = await supabase.from('payment_items').insert(rows);
          if (insErr) throw insErr;
        }
      }

      const { data, error: iErr } = await supabase
        .from('payment_items')
        .select('*')
        .eq('year', year)
        .eq('month', month)
        .order('sort_order')
        .order('created_at');
      if (iErr) throw iErr;
      setItems(data.map(fromDB.item));
    } catch (e) {
      setError(e.message || 'Nepodařilo se načíst data.');
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    load();
  }, [load]);

  const togglePaid = async (item) => {
    const paid = !item.paid;
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, paid } : i)));
    const { error: err } = await supabase
      .from('payment_items')
      .update({ paid, paid_at: paid ? new Date().toISOString() : null })
      .eq('id', item.id);
    if (err) load();
  };

  const addItem = async ({ name, amount, category, type }) => {
    const { data, error: err } = await supabase
      .from('payment_items')
      .insert({ year, month, name, amount, category, type, sort_order: items.length })
      .select()
      .single();
    if (err) throw err;
    setItems((prev) => [...prev, fromDB.item(data)]);
  };

  const updateItem = async (id, { name, amount, category }) => {
    const { error: err } = await supabase
      .from('payment_items')
      .update({ name, amount, category })
      .eq('id', id);
    if (err) throw err;
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, name, amount, category } : i)));
  };

  const deleteItem = async (id) => {
    const { error: err } = await supabase.from('payment_items').delete().eq('id', id);
    if (err) throw err;
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return { items, loading, error, reload: load, togglePaid, addItem, updateItem, deleteItem };
}
