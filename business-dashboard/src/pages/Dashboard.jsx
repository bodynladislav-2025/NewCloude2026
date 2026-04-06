import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Download, RefreshCw, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { usePeriod } from '../hooks/usePeriod';
import PeriodSelector from '../components/PeriodSelector';
import KPICard from '../components/KPICard';
import GaugeChart from '../components/GaugeChart';
import EmptyState from '../components/EmptyState';
import {
  formatCZK, formatCZKShort, formatPct, formatInt, formatPeriod, formatDate, MESICE_SHORT,
} from '../utils/formatters';
import {
  calcExpectedFulfillment, calcForecast, getPlanStatus,
} from '../utils/workingDays';

// PDF export (lazy loaded)
async function exportPDF(ref) {
  const { default: html2canvas } = await import('html2canvas');
  const { jsPDF } = await import('jspdf');
  const canvas = await html2canvas(ref, { scale: 2, useCORS: true });
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pdfW = pdf.internal.pageSize.getWidth();
  const pdfH = (canvas.height * pdfW) / canvas.width;
  pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH);
  pdf.save(`dashboard-${new Date().toISOString().slice(0, 10)}.pdf`);
}

const STATUS_LABEL = { green: '✓ Na plánu', yellow: '⚠ Mírná odchylka', red: '✕ Výrazná odchylka' };

export default function Dashboard() {
  const period  = usePeriod();
  const dashRef = useRef(null);
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { year, month } = period;

      // Get or create period
      let { data: per } = await supabase
        .from('periods').select('id').eq('year', year).eq('month', month).maybeSingle();
      const periodId = per?.id;

      if (!periodId) {
        setData(null);
        setLoading(false);
        return;
      }

      // Parallel fetches
      const [
        { data: salesRows },
        { data: plans },
        { data: opps },
        { data: aging },
        { data: historySales },
      ] = await Promise.all([
        supabase.from('sales_data').select('*').eq('period_id', periodId),
        supabase.from('plans').select('*').eq('period_id', periodId),
        supabase.from('opportunities').select('*').eq('period_id', periodId),
        supabase.from('invoices_aging').select('*').eq('period_id', periodId),
        // Last 12 months for trend chart
        fetchTrendData(year, month),
      ]);

      // Company plan
      const companyPlan = plans?.find(p => p.level === 'company') || {};
      const revPlan    = companyPlan.revenue_target_czk || 0;
      const ordPlan    = companyPlan.orders_target || 0;

      // Totals
      const totalRev   = salesRows?.reduce((s, r) => s + (r.revenue_czk || 0), 0) || 0;
      const totalOrd   = salesRows?.reduce((s, r) => s + (r.orders_count || 0), 0) || 0;
      const revPct     = revPlan > 0 ? (totalRev / revPlan) * 100 : null;
      const ordPct     = ordPlan > 0 ? (totalOrd / ordPlan) * 100 : null;

      // Expected fulfillment
      const { expectedPct, workingDaysSoFar, workingDaysTotal } =
        calcExpectedFulfillment(year, month);

      // Forecast
      const { forecastValue, forecastOrders } =
        calcForecast(totalRev, totalOrd, workingDaysSoFar, workingDaysTotal);

      // Salesperson rows
      const spMap = {};
      salesRows?.forEach(r => {
        if (!spMap[r.salesperson_name]) {
          spMap[r.salesperson_name] = { name: r.salesperson_name, team: r.team, revenue: 0, orders: 0, pipeline: 0, closed: 0, total: 0 };
        }
        spMap[r.salesperson_name].revenue += r.revenue_czk || 0;
        spMap[r.salesperson_name].orders  += r.orders_count || 0;
      });
      opps?.forEach(o => {
        const sp = o.salesperson_name;
        if (sp && spMap[sp]) {
          spMap[sp].pipeline += o.value_czk || 0;
          spMap[sp].total    += 1;
          if (o.is_closed) spMap[sp].closed += 1;
        }
      });

      // Attach salesperson plans
      const spRows = Object.values(spMap).map(sp => {
        const spPlan = plans?.find(p => p.level === 'salesperson' && p.entity_name === sp.name);
        const plan   = spPlan?.revenue_target_czk || 0;
        const pct    = plan > 0 ? (sp.revenue / plan) * 100 : null;
        const convRate = sp.total > 0 ? (sp.closed / sp.total) * 100 : 0;
        return { ...sp, plan, pct, convRate };
      }).sort((a, b) => b.revenue - a.revenue);

      // Top 3 opportunities
      const top3 = (opps || [])
        .filter(o => !o.is_closed)
        .sort((a, b) => b.value_czk - a.value_czk)
        .slice(0, 3);

      // Aging totals
      const agingMap = {};
      aging?.forEach(a => { agingMap[a.days_range] = (agingMap[a.days_range] || 0) + (a.total_czk || 0); });
      const agingTotal = Object.values(agingMap).reduce((s, v) => s + v, 0);

      // Pipeline totals
      const totalPipeline = opps?.reduce((s, o) => s + (o.value_czk || 0), 0) || 0;
      const closedOpps    = opps?.filter(o => o.is_closed).length || 0;
      const totalOpps     = opps?.length || 0;
      const convRate      = totalOpps > 0 ? (closedOpps / totalOpps) * 100 : 0;

      setData({
        totalRev, totalOrd, revPlan, ordPlan, revPct, ordPct,
        expectedPct, workingDaysSoFar, workingDaysTotal,
        forecastValue, forecastOrders,
        spRows, top3,
        agingMap, agingTotal,
        totalPipeline, totalOpps: opps?.filter(o => !o.is_closed).length || 0, convRate,
        trendData: historySales || [],
        hasData: (salesRows && salesRows.length > 0) || (opps && opps.length > 0),
      });
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [period.year, period.month]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleExportPDF() {
    if (!dashRef.current) return;
    setExporting(true);
    try { await exportPDF(dashRef.current); }
    catch (e) { console.error(e); }
    finally { setExporting(false); }
  }

  if (loading) return <LoadingState />;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500">Přehled obchodních výsledků</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <PeriodSelector {...period} />
          <button onClick={fetchData} className="p-2 rounded-lg hover:bg-slate-100 transition-colors" title="Obnovit data">
            <RefreshCw className="w-4 h-4 text-slate-500" />
          </button>
          <button
            onClick={handleExportPDF}
            disabled={exporting}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {exporting ? 'Exportuji…' : 'Export PDF'}
          </button>
        </div>
      </div>

      {!data?.hasData ? (
        <EmptyState />
      ) : (
        <div ref={dashRef} className="space-y-6">
          {/* KPI Cards */}
          <KPISection data={data} period={period} />

          {/* Trend Chart */}
          {data.trendData.length > 0 && <TrendChart data={data.trendData} />}

          {/* Salespeople */}
          {data.spRows.length > 0 && <SalesTable rows={data.spRows} expectedPct={data.expectedPct} />}

          {/* Pipeline */}
          <PipelineSection data={data} />

          {/* Aging */}
          {data.agingTotal > 0 && <AgingSection agingMap={data.agingMap} agingTotal={data.agingTotal} />}
        </div>
      )}
    </div>
  );
}

// ── KPI Section ───────────────────────────────────────────────
function KPISection({ data, period }) {
  const {
    totalRev, revPlan, revPct, totalOrd, ordPlan, ordPct,
    expectedPct, workingDaysSoFar, workingDaysTotal,
    forecastValue, forecastOrders,
  } = data;

  const revStatus = revPct !== null ? getPlanStatus(revPct, expectedPct) : 'neutral';
  const ordStatus = ordPct !== null ? getPlanStatus(ordPct, expectedPct) : 'neutral';

  const expectedRevKc  = revPlan > 0 ? (revPlan * expectedPct) / 100 : null;
  const expectedOrdCnt = ordPlan > 0 ? (ordPlan * expectedPct) / 100 : null;

  return (
    <div>
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Klíčové ukazatele – {formatPeriod(period.year, period.month)}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Revenue gauge */}
        <div className={`rounded-xl border p-5 col-span-1 ${revStatus === 'green' ? 'border-emerald-200 bg-emerald-50' : revStatus === 'yellow' ? 'border-amber-200 bg-amber-50' : revStatus === 'red' ? 'border-red-200 bg-red-50' : 'border-slate-200 bg-white'}`}>
          <p className="text-sm font-medium text-slate-600 mb-2">Tržby – plnění plánu</p>
          <GaugeChart
            pct={revPct ?? 0}
            expectedPct={expectedPct}
            label={`${formatCZKShort(totalRev)} z ${formatCZKShort(revPlan)}`}
            sublabel={revPlan > 0 ? `Plán: ${formatCZK(revPlan)}` : 'Plán nezadán'}
          />
          {revStatus !== 'neutral' && (
            <div className="text-center mt-2">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${revStatus === 'green' ? 'bg-emerald-100 text-emerald-700' : revStatus === 'yellow' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                {STATUS_LABEL[revStatus]}
              </span>
            </div>
          )}
        </div>

        {/* Orders gauge */}
        <div className={`rounded-xl border p-5 ${ordStatus === 'green' ? 'border-emerald-200 bg-emerald-50' : ordStatus === 'yellow' ? 'border-amber-200 bg-amber-50' : ordStatus === 'red' ? 'border-red-200 bg-red-50' : 'border-slate-200 bg-white'}`}>
          <p className="text-sm font-medium text-slate-600 mb-2">Zakázky – plnění plánu</p>
          <GaugeChart
            pct={ordPct ?? 0}
            expectedPct={expectedPct}
            label={`${formatInt(totalOrd)} z ${formatInt(ordPlan)} ks`}
            sublabel={ordPlan > 0 ? `Plán: ${formatInt(ordPlan)} zakázek` : 'Plán nezadán'}
          />
          {ordStatus !== 'neutral' && (
            <div className="text-center mt-2">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ordStatus === 'green' ? 'bg-emerald-100 text-emerald-700' : ordStatus === 'yellow' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                {STATUS_LABEL[ordStatus]}
              </span>
            </div>
          )}
        </div>

        {/* Expected vs Actual */}
        <KPICard title="Očekávané k dnešku" value={expectedRevKc !== null ? formatCZKShort(expectedRevKc) : '—'} status="neutral"
          subtitle={`Pracovní dny: ${workingDaysSoFar} / ${workingDaysTotal} (${formatPct(expectedPct)})`}
          footer={expectedOrdCnt !== null ? `Zakázky: ${Math.round(expectedOrdCnt)} ks` : undefined}
        />

        {/* Forecast */}
        <KPICard
          title="Prognóza do konce měsíce"
          value={forecastValue !== null ? formatCZKShort(forecastValue) : '—'}
          subtitle={forecastValue !== null && revPlan > 0 ? `${formatPct((forecastValue / revPlan) * 100)} plánu` : 'Nedostatek dat'}
          footer={forecastOrders !== null ? `Zakázky: ~${Math.round(forecastOrders)} ks` : undefined}
          status="neutral"
        >
          {forecastValue !== null && revPlan > 0 && (
            <div className="mt-2">
              <div className="w-full bg-slate-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${forecastValue >= revPlan ? 'bg-emerald-500' : 'bg-blue-500'}`}
                  style={{ width: `${Math.min((forecastValue / revPlan) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}
        </KPICard>
      </div>
    </div>
  );
}

// ── Trend Chart ───────────────────────────────────────────────
function TrendChart({ data }) {
  const formatted = data.map(d => ({
    ...d,
    name: `${MESICE_SHORT[d.month - 1]} ${d.year}`,
  }));

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-blue-600" />
        Vývoj tržeb – měsíc po měsíci
      </h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={formatted} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis tickFormatter={v => formatCZKShort(v)} tick={{ fontSize: 11 }} width={75} />
          <Tooltip formatter={(v) => formatCZK(v)} labelStyle={{ fontWeight: 600 }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="revenue" name="Tržby (Kč)" fill="#3b82f6" radius={[3, 3, 0, 0]} />
          {formatted.some(d => d.plan > 0) && (
            <Line dataKey="plan" name="Plán" stroke="#94a3b8" strokeDasharray="4 4" dot={false} />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Sales Table ───────────────────────────────────────────────
function SalesTable({ rows, expectedPct }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <h2 className="font-semibold text-slate-800">Výkonnost obchodníků</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <th className="px-4 py-3 text-left font-medium">#</th>
              <th className="px-4 py-3 text-left font-medium">Obchodník</th>
              <th className="px-4 py-3 text-right font-medium">Tržby</th>
              <th className="px-4 py-3 text-right font-medium">% plánu</th>
              <th className="px-4 py-3 text-right font-medium">Zakázky</th>
              <th className="px-4 py-3 text-right font-medium">Pipeline</th>
              <th className="px-4 py-3 text-right font-medium">Konverze</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((sp, i) => {
              const status = sp.pct !== null ? getPlanStatus(sp.pct, expectedPct) : 'neutral';
              const rowBg  = status === 'red' ? 'bg-red-50/40' : status === 'yellow' ? 'bg-amber-50/40' : '';
              return (
                <tr key={sp.name} className={`hover:bg-slate-50 transition-colors ${rowBg}`}>
                  <td className="px-4 py-3 text-slate-400 font-mono">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {sp.name}
                    {sp.team && <span className="ml-2 text-xs text-slate-400">{sp.team}</span>}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-800">{formatCZK(sp.revenue)}</td>
                  <td className="px-4 py-3 text-right">
                    {sp.pct !== null ? (
                      <span className={`font-medium ${status === 'green' ? 'text-emerald-600' : status === 'yellow' ? 'text-amber-600' : 'text-red-600'}`}>
                        {formatPct(sp.pct)}
                      </span>
                    ) : <span className="text-slate-400">—</span>}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-600">{formatInt(sp.orders)}</td>
                  <td className="px-4 py-3 text-right text-slate-600">{formatCZK(sp.pipeline)}</td>
                  <td className="px-4 py-3 text-right text-slate-600">{formatPct(sp.convRate)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Pipeline Section ──────────────────────────────────────────
function PipelineSection({ data }) {
  const { totalPipeline, totalOpps, convRate, top3 } = data;
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h2 className="font-semibold text-slate-800 mb-4">Příležitosti (Pipeline)</h2>
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="text-center">
          <div className="text-2xl font-bold text-slate-900">{formatInt(totalOpps)}</div>
          <div className="text-xs text-slate-500 mt-0.5">Otevřené příležitosti</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-slate-900">{formatCZKShort(totalPipeline)}</div>
          <div className="text-xs text-slate-500 mt-0.5">Celková hodnota</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-slate-900">{formatPct(convRate)}</div>
          <div className="text-xs text-slate-500 mt-0.5">Konverzní poměr</div>
        </div>
      </div>

      {top3.length > 0 && (
        <>
          <h3 className="text-sm font-medium text-slate-600 mb-3">Top 3 příležitosti</h3>
          <div className="space-y-3">
            {top3.map((opp, i) => (
              <div key={opp.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-800 truncate">{opp.partner_name}</div>
                  <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap gap-x-3">
                    <span>{opp.status || 'Neznámý stav'}</span>
                    {opp.salesperson_name && <span>👤 {opp.salesperson_name}</span>}
                    {opp.created_at_k2 && <span>📅 {formatDate(opp.created_at_k2)}</span>}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-bold text-slate-900">{formatCZKShort(opp.value_czk)}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Aging Section ─────────────────────────────────────────────
const AGING_BANDS = [
  { key: '0-30',  label: '0–30 dní',  color: 'bg-yellow-400' },
  { key: '31-60', label: '31–60 dní', color: 'bg-orange-500' },
  { key: '61-90', label: '61–90 dní', color: 'bg-red-500' },
  { key: '90+',   label: '90+ dní',   color: 'bg-red-800' },
];

function AgingSection({ agingMap, agingTotal }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h2 className="font-semibold text-slate-800 mb-4">Saldo faktur po splatnosti</h2>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-slate-500">Celkem po splatnosti</span>
        <span className="font-bold text-slate-900 text-lg">{formatCZK(agingTotal)}</span>
      </div>
      <div className="space-y-2.5">
        {AGING_BANDS.map(({ key, label, color }) => {
          const val = agingMap[key] || 0;
          const pct = agingTotal > 0 ? (val / agingTotal) * 100 : 0;
          return (
            <div key={key}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-slate-600">{label}</span>
                <span className="font-medium text-slate-800">{formatCZK(val)}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Loading ───────────────────────────────────────────────────
function LoadingState() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-slate-500 text-sm">Načítám data…</p>
      </div>
    </div>
  );
}

// ── Trend data helper ─────────────────────────────────────────
async function fetchTrendData(year, month) {
  // Build list of last 12 months
  const months = [];
  for (let i = 11; i >= 0; i--) {
    let y = year, m = month - i;
    while (m <= 0) { m += 12; y--; }
    months.push({ year: y, month: m });
  }

  const { data: periods } = await supabase
    .from('periods')
    .select('id, year, month')
    .in('year', [...new Set(months.map(m => m.year))]);

  if (!periods?.length) return [];

  const periodIds = periods.map(p => p.id);

  const [{ data: sales }, { data: plans }] = await Promise.all([
    supabase.from('sales_data').select('period_id, revenue_czk').in('period_id', periodIds),
    supabase.from('plans').select('period_id, revenue_target_czk').eq('level', 'company').in('period_id', periodIds),
  ]);

  return months.map(({ year: y, month: m }) => {
    const per = periods.find(p => p.year === y && p.month === m);
    if (!per) return { year: y, month: m, revenue: 0, plan: 0 };
    const revenue = sales?.filter(s => s.period_id === per.id).reduce((sum, s) => sum + (s.revenue_czk || 0), 0) || 0;
    const plan    = plans?.find(p => p.period_id === per.id)?.revenue_target_czk || 0;
    return { year: y, month: m, revenue, plan };
  });
}
