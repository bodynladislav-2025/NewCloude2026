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

  const addTemplate = async ({ name, amount, category, type }) => {
    const { data, error: err } = await supabase
      .from('payment_templates')
      .insert({ name, amount, category, type, sort_order: templates.length })
      .select()
      .single();
    if (err) throw err;
    setTemplates((prev) => [...prev, fromDB.template(data)]);
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
  };

  const toggleActive = async (template) => {
    const active = !template.active;
    setTemplates((prev) => prev.map((t) => (t.id === template.id ? { ...t, active } : t)));
    const { error: err } = await supabase
      .from('payment_templates')
      .update({ active })
      .eq('id', template.id);
    if (err) load();
  };

  const deleteTemplate = async (id) => {
    const { error: err } = await supabase.from('payment_templates').delete().eq('id', id);
    if (err) throw err;
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  return { templates, loading, error, addTemplate, updateTemplate, toggleActive, deleteTemplate };
}
