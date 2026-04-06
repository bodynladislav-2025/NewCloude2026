import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { usePeriod } from '../hooks/usePeriod';
import PeriodSelector from '../components/PeriodSelector';
import { Save, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { formatCZK, formatInt, formatPeriod } from '../utils/formatters';

export default function PlanPage() {
  const period = usePeriod();
  const [salespersons, setSalespersons] = useState([]);
  const [companyPlan, setCompanyPlan]   = useState({ revenue: '', orders: '' });
  const [spPlans, setSpPlans]           = useState({});
  const [loading, setLoading]           = useState(true);
  const [saving, setSaving]             = useState(false);
  const [saved, setSaved]               = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [{ data: sps }, { data: plans }] = await Promise.all([
      supabase.from('salespersons').select('*').eq('active', true).order('name'),
      fetchPlans(period.year, period.month),
    ]);

    setSalespersons(sps || []);

    const company = plans?.find(p => p.level === 'company');
    setCompanyPlan({
      revenue: company?.revenue_target_czk ? String(company.revenue_target_czk) : '',
      orders:  company?.orders_target      ? String(company.orders_target)      : '',
    });

    const spMap = {};
    (sps || []).forEach(sp => {
      const plan = plans?.find(p => p.level === 'salesperson' && p.entity_name === sp.name);
      spMap[sp.name] = {
        revenue: plan?.revenue_target_czk ? String(plan.revenue_target_czk) : '',
        orders:  plan?.orders_target      ? String(plan.orders_target)      : '',
      };
    });
    setSpPlans(spMap);
    setLoading(false);
  }, [period.year, period.month]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleSave() {
    setSaving(true);
    try {
      const { year, month } = period;

      // Upsert period
      const { data: per } = await supabase
        .from('periods')
        .upsert({ year, month }, { onConflict: 'year,month' })
        .select('id')
        .single();

      // Delete old plans for this period
      await supabase.from('plans').delete().eq('period_id', per.id);

      const records = [];

      // Company plan
      records.push({
        period_id:          per.id,
        level:              'company',
        entity_name:        null,
        revenue_target_czk: parseInt(companyPlan.revenue) || 0,
        orders_target:      parseInt(companyPlan.orders)  || 0,
      });

      // Salesperson plans
      salespersons.forEach(sp => {
        const plan = spPlans[sp.name] || {};
        if (plan.revenue || plan.orders) {
          records.push({
            period_id:          per.id,
            level:              'salesperson',
            entity_name:        sp.name,
            revenue_target_czk: parseInt(plan.revenue) || 0,
            orders_target:      parseInt(plan.orders)  || 0,
          });
        }
      });

      await supabase.from('plans').insert(records);
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
    <div className="max-w-3xl">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Obchodní plán</h1>
          <p className="text-sm text-slate-500">Cíle tržeb a zakázek pro {formatPeriod(period.year, period.month)}</p>
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
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-4">
        <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center text-xs text-blue-700 font-bold">F</span>
          Firma – celkový plán
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <PlanInput
            label="Plán tržeb (Kč)"
            value={companyPlan.revenue}
            onChange={v => setCompanyPlan(p => ({ ...p, revenue: v }))}
            hint={companyPlan.revenue ? formatCZK(parseInt(companyPlan.revenue) || 0) : ''}
          />
          <PlanInput
            label="Plán zakázek (počet)"
            value={companyPlan.orders}
            onChange={v => setCompanyPlan(p => ({ ...p, orders: v }))}
          />
        </div>
      </div>

      {/* Salesperson plans */}
      {salespersons.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">Obchodníci – individuální plány</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {salespersons.map(sp => (
              <SalespersonPlanRow
                key={sp.id}
                salesperson={sp}
                plan={spPlans[sp.name] || { revenue: '', orders: '' }}
                onChange={(field, val) => setSpPlans(prev => ({
                  ...prev,
                  [sp.name]: { ...(prev[sp.name] || {}), [field]: val },
                }))}
              />
            ))}
          </div>
        </div>
      )}

      {salespersons.length === 0 && (
        <div className="text-center py-8 text-slate-500 text-sm bg-white rounded-xl border border-slate-200">
          Nejsou definováni žádní obchodníci. Přidejte je v{' '}
          <a href="/settings" className="text-blue-600 hover:underline">Nastavení</a>.
        </div>
      )}

      <div className="mt-4 p-3 bg-slate-50 rounded-lg text-xs text-slate-500">
        <strong>Tip:</strong> Zadejte tržby jako celé číslo v Kč (bez mezer, teček nebo Kč). Například: 2500000
      </div>
    </div>
  );
}

function SalespersonPlanRow({ salesperson, plan, onChange }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="px-5 py-3">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full text-left"
      >
        <div>
          <span className="font-medium text-slate-800">{salesperson.name}</span>
          {salesperson.team && <span className="ml-2 text-xs text-slate-400">{salesperson.team}</span>}
          {plan.revenue && (
            <span className="ml-2 text-xs text-slate-500">({formatCZK(parseInt(plan.revenue) || 0)})</span>
          )}
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      {open && (
        <div className="grid grid-cols-2 gap-4 mt-3">
          <PlanInput
            label="Plán tržeb (Kč)"
            value={plan.revenue}
            onChange={v => onChange('revenue', v)}
            hint={plan.revenue ? formatCZK(parseInt(plan.revenue) || 0) : ''}
          />
          <PlanInput
            label="Plán zakázek"
            value={plan.orders}
            onChange={v => onChange('orders', v)}
          />
        </div>
      )}
    </div>
  );
}

function PlanInput({ label, value, onChange, hint }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
      <input
        type="number"
        min="0"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="0"
        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      {hint && <p className="text-xs text-slate-400 mt-0.5">{hint}</p>}
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
  if (!per) return { data: [] };
  return supabase.from('plans').select('*').eq('period_id', per.id);
}
