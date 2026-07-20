import { useCallback, useEffect, useState } from 'react';
import { supabase, fromDB } from '../lib/supabase';

export function useTemplates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('payment_templates')
        .select('*')
        .order('sort_order')
        .order('created_at');
      if (err) throw err;
      setTemplates(data.map(fromDB.template));
    } catch (e) {
      setError(e.message || 'Nepodařilo se načíst šablonu.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Otevřené měsíce od aktuálního (včetně) nebo až od následujícího
  const openedMonths = async (includeCurrent) => {
    const { data, error: err } = await supabase.from('payment_months').select('year, month');
    if (err) throw err;
    const d = new Date();
    const nowKey = d.getFullYear() * 100 + (d.getMonth() + 1);
    return data.filter(({ year, month }) => {
      const key = year * 100 + month;
      return includeCurrent ? key >= nowKey : key > nowKey;
    });
  };

  const addTemplate = async ({ name, amount, category, type }) => {
    const { data, error: err } = await supabase
      .from('payment_templates')
      .insert({ name, amount, category, type, sort_order: templates.length })
      .select()
      .single();
    if (err) throw err;
    const t = fromDB.template(data);
    setTemplates((prev) => [...prev, t]);

    // Nová položka se hned propíše do aktuálního a budoucích otevřených měsíců
    const months = await openedMonths(true);
    if (months.length > 0) {
      const { error: insErr } = await supabase.from('payment_items').insert(
        months.map(({ year, month }) => ({
          year,
          month,
          template_id: t.id,
          name,
          amount,
          category,
          type,
          sort_order: t.sortOrder,
        }))
      );
      if (insErr) throw insErr;
    }
  };

  const updateTemplate = async (id, { name, amount, category }) => {
    const { error: err } = await supabase
      .from('payment_templates')
      .update({ name, amount, category })
      .eq('id', id);
    if (err) throw err;
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, name, amount, category } : t))
    );

    // Úpravy se promítají až od následujícího měsíce
    for (const { year, month } of await openedMonths(false)) {
      const { error: updErr } = await supabase
        .from('payment_items')
        .update({ name, amount, category })
        .eq('template_id', id)
        .eq('year', year)
        .eq('month', month);
      if (updErr) throw updErr;
    }
  };

  const toggleActive = async (template) => {
    const active = !template.active;
    setTemplates((prev) => prev.map((t) => (t.id === template.id ? { ...t, active } : t)));
    const { error: err } = await supabase
      .from('payment_templates')
      .update({ active })
      .eq('id', template.id);
    if (err) {
      load();
      return;
    }

    // Zapnutí/vypnutí se projeví od následujícího měsíce
    for (const { year, month } of await openedMonths(false)) {
      if (active) {
        const { data: existing } = await supabase
          .from('payment_items')
          .select('id')
          .eq('template_id', template.id)
          .eq('year', year)
          .eq('month', month);
        if (!existing || existing.length === 0) {
          await supabase.from('payment_items').insert({
            year,
            month,
            template_id: template.id,
            name: template.name,
            amount: template.amount,
            category: template.category,
            type: template.type,
            sort_order: template.sortOrder,
          });
        }
      } else {
        await supabase
          .from('payment_items')
          .delete()
          .eq('template_id', template.id)
          .eq('year', year)
          .eq('month', month)
          .eq('paid', false);
      }
    }
  };

  const deleteTemplate = async (id) => {
    const { error: err } = await supabase.from('payment_templates').delete().eq('id', id);
    if (err) throw err;
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  return { templates, loading, error, addTemplate, updateTemplate, toggleActive, deleteTemplate };
}
