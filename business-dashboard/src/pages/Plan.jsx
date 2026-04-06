import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { usePeriod } from '../hooks/usePeriod';
import PeriodSelector from '../components/PeriodSelector';
import { Save, ChevronDown, ChevronUp } from 'lucide-react';
import { formatCZK, formatPeriod } from '../utils/formatters';

export default function PlanPage() {
  const period = usePeriod();
  const [companyPlan, setCompanyPlan] = useState({ margin: '' });
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);
  const [saved, setSaved]             = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const plans = await fetchPlans(period.year, period.month);
    const company = plans?.find(p => p.level === 'company');
    setCompanyPlan({
      margin: company?.revenue_target_czk ? String(company.revenue_target_czk) : '',
    });
    setLoading(false);
  }, [period.year, period.month]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleSave() {
    setSaving(true);
    try {
      const { year, month } = period;

      const { data: per } = await supabase
        .from('periods')
        .upsert({ year, month }, { onConflict: 'year,month' })
        .select('id')
        .single();

      // Delete old company plan for this period
      await supabase.from('plans').delete().eq('period_id', per.id).eq('level', 'company');

      await supabase.from('plans').insert({
        period_id:          per.id,
        level:              'company',
        entity_name:        null,
        revenue_target_czk: parseInt(companyPlan.margin) || 0,
        orders_target:      0,
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error('Save plan error:', err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <LoadingState />;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Obchodní plán</h1>
          <p className="text-sm text-slate-500">Plán marže pro {formatPeriod(period.year, period.month)}</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <PeriodSelector {...period} />
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Ukládám…' : saved ? '✓ Uloženo' : 'Uložit plán'}
          </button>
        </div>
      </div>

      {/* Company-level plan */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center text-xs text-blue-700 font-bold">F</span>
          Firma – plán marže
        </h2>
        <div className="max-w-xs">
          <label className="block text-sm font-medium text-slate-700 mb-1">Plán marže (Kč)</label>
          <input
            type="number"
            min="0"
            value={companyPlan.margin}
            onChange={e => setCompanyPlan({ margin: e.target.value })}
            placeholder="0"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {companyPlan.margin && (
            <p className="text-xs text-slate-400 mt-1">{formatCZK(parseInt(companyPlan.margin) || 0)}</p>
          )}
        </div>
      </div>

      <div className="mt-4 p-3 bg-slate-50 rounded-lg text-xs text-slate-500">
        <strong>Tip:</strong> Zadejte marži jako celé číslo v Kč (bez mezer nebo symbolů). Například: 500000
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

async function fetchPlans(year, month) {
  const { data: per } = await supabase
    .from('periods').select('id').eq('year', year).eq('month', month).maybeSingle();
  if (!per) return [];
  const { data } = await supabase.from('plans').select('*').eq('period_id', per.id);
  return data || [];
}
