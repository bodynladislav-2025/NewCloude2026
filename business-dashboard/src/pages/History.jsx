import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { formatCZK, formatCZKShort, formatPct, formatInt, MESICE_SHORT } from '../utils/formatters';

export default function HistoryPage() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory().then(d => { setData(d); setLoading(false); });
  }, []);

  if (loading) return <LoadingState />;

  const currentYear  = new Date().getFullYear();
  const previousYear = currentYear - 1;

  const thisYearData = data.filter(d => d.year === currentYear);
  const lastYearData = data.filter(d => d.year === previousYear);

  // YTD
  const now  = new Date();
  const ytd  = data.filter(d => d.year === currentYear && d.month <= now.getMonth() + 1);
  const ytdRevenue = ytd.reduce((s, d) => s + d.revenue, 0);
  const ytdPlan    = ytd.reduce((s, d) => s + d.plan, 0);
  const ytdPct     = ytdPlan > 0 ? (ytdRevenue / ytdPlan) * 100 : null;

  // Build chart data (align by month)
  const chartData = Array.from({ length: 12 }, (_, i) => {
    const m = i + 1;
    const cy = thisYearData.find(d => d.month === m);
    const py = lastYearData.find(d => d.month === m);
    return {
      month: MESICE_SHORT[i],
      [currentYear]:  cy?.revenue || 0,
      [previousYear]: py?.revenue || 0,
      plan:           cy?.plan || 0,
    };
  });

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-900 mb-6">Historie</h1>

      {/* YTD Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">YTD tržby {currentYear}</p>
          <p className="text-2xl font-bold text-slate-900">{formatCZKShort(ytdRevenue)}</p>
          {ytdPlan > 0 && <p className="text-sm text-slate-500 mt-0.5">z plánu {formatCZKShort(ytdPlan)}</p>}
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">YTD plnění plánu</p>
          <p className={`text-2xl font-bold ${ytdPct !== null ? (ytdPct >= 100 ? 'text-emerald-600' : ytdPct >= 85 ? 'text-amber-600' : 'text-red-600') : 'text-slate-400'}`}>
            {ytdPct !== null ? formatPct(ytdPct) : '—'}
          </p>
          <p className="text-sm text-slate-500 mt-0.5">{now.getMonth() + 1} měsíců roku</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Průměrné měsíční tržby</p>
          <p className="text-2xl font-bold text-slate-900">
            {ytd.length > 0 ? formatCZKShort(ytdRevenue / ytd.length) : '—'}
          </p>
          <p className="text-sm text-slate-500 mt-0.5">za měsíc</p>
        </div>
      </div>

      {/* Trend Chart */}
      {data.length > 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
          <h2 className="font-semibold text-slate-800 mb-4">Vývoj tržeb – roční srovnání</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={v => formatCZKShort(v)} tick={{ fontSize: 11 }} width={75} />
              <Tooltip formatter={v => formatCZK(v)} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line dataKey={currentYear}  stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name={String(currentYear)} />
              <Line dataKey={previousYear} stroke="#94a3b8" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="4 4" name={String(previousYear)} />
              {chartData.some(d => d.plan > 0) && (
                <Line dataKey="plan" stroke="#10b981" strokeWidth={1.5} dot={false} strokeDasharray="6 3" name="Plán" />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-400 mb-6">
          Žádná historická data k zobrazení
        </div>
      )}

      {/* Monthly cards */}
      <h2 className="font-semibold text-slate-700 mb-3 text-sm uppercase tracking-wider">Měsíce {currentYear}</h2>
      {thisYearData.length === 0 ? (
        <div className="text-center py-8 text-slate-400 text-sm">Žádná data pro {currentYear}</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
          {thisYearData.sort((a, b) => b.month - a.month).map(d => (
            <MonthCard key={`${d.year}-${d.month}`} data={d} />
          ))}
        </div>
      )}

      {lastYearData.length > 0 && (
        <>
          <h2 className="font-semibold text-slate-700 mb-3 text-sm uppercase tracking-wider">Měsíce {previousYear}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {lastYearData.sort((a, b) => b.month - a.month).map(d => (
              <MonthCard key={`${d.year}-${d.month}`} data={d} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function MonthCard({ data }) {
  const pct = data.plan > 0 ? (data.revenue / data.plan) * 100 : null;
  const bgColor = pct === null ? 'bg-white' : pct >= 100 ? 'bg-emerald-50 border-emerald-200' : pct >= 85 ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200';

  return (
    <div className={`rounded-xl border p-4 ${bgColor} border-slate-200`}>
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
        {MESICE_SHORT[data.month - 1]} {data.year}
      </p>
      <p className="text-lg font-bold text-slate-900">{formatCZKShort(data.revenue)}</p>
      {pct !== null && (
        <p className={`text-sm font-medium mt-0.5 ${pct >= 100 ? 'text-emerald-600' : pct >= 85 ? 'text-amber-600' : 'text-red-600'}`}>
          {formatPct(pct)} plánu
        </p>
      )}
      <div className="mt-2 flex gap-3 text-xs text-slate-500">
        {data.orders > 0 && <span>{formatInt(data.orders)} zak.</span>}
        {data.plan > 0 && <span>plán {formatCZKShort(data.plan)}</span>}
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

async function fetchHistory() {
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1];

  const { data: periods } = await supabase
    .from('periods')
    .select('id, year, month')
    .in('year', years)
    .order('year', { ascending: false })
    .order('month', { ascending: false });

  if (!periods?.length) return [];

  const ids = periods.map(p => p.id);
  const [{ data: sales }, { data: plans }] = await Promise.all([
    supabase.from('sales_data').select('period_id, revenue_czk, orders_count').in('period_id', ids),
    supabase.from('plans').select('period_id, revenue_target_czk, orders_target').eq('level', 'company').in('period_id', ids),
  ]);

  return periods.map(p => ({
    year:    p.year,
    month:   p.month,
    revenue: sales?.filter(s => s.period_id === p.id).reduce((sum, s) => sum + (s.revenue_czk || 0), 0) || 0,
    orders:  sales?.filter(s => s.period_id === p.id).reduce((sum, s) => sum + (s.orders_count || 0), 0) || 0,
    plan:    plans?.find(pl => pl.period_id === p.id)?.revenue_target_czk || 0,
  }));
}
