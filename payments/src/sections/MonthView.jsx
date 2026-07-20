import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useMonthData } from '../hooks/useMonthData';
import SummaryTiles from '../components/SummaryTiles';
import ItemRow from '../components/ItemRow';
import ItemForm from '../components/ItemForm';
import { MONTHS, OTHER_CATEGORY, formatCzk } from '../utils/format';

function Section({ title, subtotal, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-1 flex items-baseline justify-between">
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        {subtotal != null && (
          <span className="tnum text-xs font-medium text-slate-500">{formatCzk(subtotal)}</span>
        )}
      </div>
      {children}
    </section>
  );
}

export default function MonthView({ year, month, onPrev, onNext, onToday, isCurrentMonth }) {
  const { items, loading, error, togglePaid, addItem, updateItem, deleteItem } = useMonthData(
    year,
    month
  );
  const [adding, setAdding] = useState(null); // 'expense' | 'income' | null

  const categories = useMemo(
    () => [...new Set(items.map((i) => i.category).filter(Boolean))],
    [items]
  );

  const expenseGroups = useMemo(() => {
    const groups = new Map();
    for (const item of items.filter((i) => i.type === 'expense')) {
      const key = item.category || OTHER_CATEGORY;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(item);
    }
    return [...groups.entries()];
  }, [items]);

  const incomes = items.filter((i) => i.type === 'income');

  const rowProps = { categories, onTogglePaid: togglePaid, onUpdate: updateItem, onDelete: deleteItem };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-2 py-2 shadow-sm">
        <button
          type="button"
          onClick={onPrev}
          aria-label="Předchozí měsíc"
          className="rounded-xl p-2 text-slate-500 active:bg-slate-100"
        >
          <ChevronLeft size={22} />
        </button>
        <div className="text-center">
          <p className="font-semibold text-slate-900">
            {MONTHS[month - 1]} {year}
          </p>
          {!isCurrentMonth && (
            <button
              type="button"
              onClick={onToday}
              className="text-xs font-medium text-blue-600"
            >
              Zpět na aktuální měsíc
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={onNext}
          aria-label="Další měsíc"
          className="rounded-xl p-2 text-slate-500 active:bg-slate-100"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      {loading ? (
        <p className="py-10 text-center text-sm text-slate-500">Načítám…</p>
      ) : (
        <>
          <SummaryTiles items={items} />

          <Section
            title="Výdaje"
            subtotal={items.filter((i) => i.type === 'expense').reduce((a, i) => a + i.amount, 0)}
          >
            {expenseGroups.length === 0 && (
              <p className="py-3 text-sm text-slate-500">
                Zatím žádné platby. Přidejte je zde, nebo si nastavte šablonu v záložce „Šablona“.
              </p>
            )}
            {expenseGroups.map(([category, list]) => (
              <div key={category} className="mt-2">
                <div className="flex items-baseline justify-between border-b border-slate-100 pb-1">
                  <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                    {category}
                  </p>
                  <span className="tnum text-xs text-slate-400">
                    {formatCzk(list.reduce((a, i) => a + i.amount, 0))}
                  </span>
                </div>
                <ul className="divide-y divide-slate-50">
                  {list.map((item) => (
                    <ItemRow key={item.id} item={item} {...rowProps} />
                  ))}
                </ul>
              </div>
            ))}
            <div className="mt-3">
              {adding === 'expense' ? (
                <ItemForm
                  categories={categories}
                  submitLabel="Přidat"
                  onSubmit={async (values) => {
                    await addItem({ ...values, type: 'expense' });
                    setAdding(null);
                  }}
                  onCancel={() => setAdding(null)}
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setAdding('expense')}
                  className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-blue-600 active:bg-blue-50"
                >
                  <Plus size={16} /> Přidat platbu
                </button>
              )}
            </div>
          </Section>

          <Section title="Příjmy" subtotal={incomes.reduce((a, i) => a + i.amount, 0)}>
            {incomes.length === 0 && (
              <p className="py-3 text-sm text-slate-500">Zatím žádné příjmy.</p>
            )}
            <ul className="divide-y divide-slate-50">
              {incomes.map((item) => (
                <ItemRow key={item.id} item={item} {...rowProps} />
              ))}
            </ul>
            <div className="mt-3">
              {adding === 'income' ? (
                <ItemForm
                  categories={categories}
                  submitLabel="Přidat"
                  onSubmit={async (values) => {
                    await addItem({ ...values, type: 'income' });
                    setAdding(null);
                  }}
                  onCancel={() => setAdding(null)}
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setAdding('income')}
                  className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-blue-600 active:bg-blue-50"
                >
                  <Plus size={16} /> Přidat příjem
                </button>
              )}
            </div>
          </Section>
        </>
      )}
    </div>
  );
}
