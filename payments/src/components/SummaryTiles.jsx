import { formatCzk } from '../utils/format';

function Tile({ label, value, valueClass = 'text-slate-900' }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className={`tnum mt-0.5 text-base font-semibold sm:text-lg ${valueClass}`}>{value}</p>
    </div>
  );
}

export default function SummaryTiles({ items }) {
  const expenses = items.filter((i) => i.type === 'expense');
  const incomes = items.filter((i) => i.type === 'income');
  const sum = (list) => list.reduce((acc, i) => acc + i.amount, 0);

  const totalExpenses = sum(expenses);
  const totalIncomes = sum(incomes);
  const paid = sum(expenses.filter((i) => i.paid));
  const remaining = totalExpenses - paid;
  const balance = totalIncomes - totalExpenses;

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      <Tile label="Příjmy" value={formatCzk(totalIncomes)} />
      <Tile label="Výdaje" value={formatCzk(totalExpenses)} />
      <Tile label="Zbývá zaplatit" value={formatCzk(remaining)} valueClass={remaining > 0 ? 'text-amber-700' : 'text-emerald-700'} />
      <Tile
        label="Bilance"
        value={`${balance > 0 ? '+' : ''}${formatCzk(balance)}`}
        valueClass={balance < 0 ? 'text-red-700' : 'text-emerald-700'}
      />
    </div>
  );
}
