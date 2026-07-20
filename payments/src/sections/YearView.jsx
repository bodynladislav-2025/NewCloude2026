import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { MONTHS, formatCzk } from '../utils/format';

export default function YearView({ onOpenMonth }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      const { data, error: err } = await supabase
        .from('payment_items')
        .select('month, type, paid, amount')
        .eq('year', year);
      if (cancelled) return;
      if (err) {
        setError(err.message);
      } else {
        setRows(data);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [year]);

  const months = MONTHS.map((name, idx) => {
    const m = idx + 1;
    const list = rows.filter((r) => r.month === m);
    const sum = (fn) => list.filter(fn).reduce((a, r) => a + Number(r.amount), 0);
    const incomes = sum((r) => r.type === 'income');
    const expenses = sum((r) => r.type === 'expense');
    const unpaid = sum((r) => r.type === 'expense' && !r.paid);
    return { m, name, incomes, expenses, unpaid, balance: incomes - expenses, hasData: list.length > 0 };
  });

  const withData = months.filter((r) => r.hasData);
  const total = (key) => withData.reduce((a, r) => a + r[key], 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-2 py-2 shadow-sm">
        <button
          type="button"
          onClick={() => setYear((y) => y - 1)}
          aria-label="Předchozí rok"
          className="rounded-xl p-2 text-slate-500 active:bg-slate-100"
        >
          <ChevronLeft size={22} />
        </button>
        <p className="font-semibold text-slate-900">{year}</p>
        <button
          type="button"
          onClick={() => setYear((y) => y + 1)}
          aria-label="Další rok"
          className="rounded-xl p-2 text-slate-500 active:bg-slate-100"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      {loading ? (
        <p className="py-10 text-center text-sm text-slate-500">Načítám…</p>
      ) : withData.length === 0 ? (
        <p className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500 shadow-sm">
          V roce {year} zatím nejsou žádná data.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs text-slate-500">
                <th className="px-3 py-2 font-medium">Měsíc</th>
                <th className="tnum px-3 py-2 text-right font-medium">Příjmy</th>
                <th className="tnum px-3 py-2 text-right font-medium">Výdaje</th>
                <th className="tnum px-3 py-2 text-right font-medium">Nezaplaceno</th>
                <th className="tnum px-3 py-2 text-right font-medium">Bilance</th>
              </tr>
            </thead>
            <tbody>
              {withData.map((r) => (
                <tr
                  key={r.m}
                  onClick={() => onOpenMonth(year, r.m)}
                  className="cursor-pointer border-b border-slate-50 active:bg-slate-50"
                >
                  <td className="px-3 py-2 font-medium text-slate-900">{r.name}</td>
                  <td className="tnum px-3 py-2 text-right text-slate-700">
                    {formatCzk(r.incomes)}
                  </td>
                  <td className="tnum px-3 py-2 text-right text-slate-700">
                    {formatCzk(r.expenses)}
                  </td>
                  <td
                    className={`tnum px-3 py-2 text-right ${
                      r.unpaid > 0 ? 'font-medium text-amber-700' : 'text-slate-400'
                    }`}
                  >
                    {formatCzk(r.unpaid)}
                  </td>
                  <td
                    className={`tnum px-3 py-2 text-right font-medium ${
                      r.balance < 0 ? 'text-red-700' : 'text-emerald-700'
                    }`}
                  >
                    {r.balance > 0 ? '+' : ''}
                    {formatCzk(r.balance)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="text-slate-900">
                <td className="px-3 py-2 font-semibold">Celkem</td>
                <td className="tnum px-3 py-2 text-right font-semibold">
                  {formatCzk(total('incomes'))}
                </td>
                <td className="tnum px-3 py-2 text-right font-semibold">
                  {formatCzk(total('expenses'))}
                </td>
                <td className="tnum px-3 py-2 text-right font-semibold">
                  {formatCzk(total('unpaid'))}
                </td>
                <td
                  className={`tnum px-3 py-2 text-right font-semibold ${
                    total('balance') < 0 ? 'text-red-700' : 'text-emerald-700'
                  }`}
                >
                  {total('balance') > 0 ? '+' : ''}
                  {formatCzk(total('balance'))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
