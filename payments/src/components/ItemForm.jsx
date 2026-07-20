import { useState } from 'react';

// Formulář pro přidání/úpravu položky (platba, příjem i šablona).
export default function ItemForm({ initial, categories, submitLabel, onSubmit, onCancel }) {
  const [name, setName] = useState(initial?.name ?? '');
  const [amount, setAmount] = useState(initial?.amount ?? '');
  const [category, setCategory] = useState(initial?.category ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await onSubmit({
        name: name.trim(),
        amount: Number(amount) || 0,
        category: category.trim(),
      });
    } catch (err) {
      setError(err.message || 'Uložení se nepodařilo.');
      setSaving(false);
      return;
    }
    setSaving(false);
  };

  return (
    <form onSubmit={submit} className="space-y-2 rounded-xl bg-slate-50 p-3">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Název (např. Nájem)"
        autoFocus
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900"
      />
      <div className="flex gap-2">
        <input
          type="number"
          inputMode="decimal"
          step="any"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Částka (Kč)"
          className="w-32 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900"
        />
        <input
          type="text"
          list="category-list"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Kategorie"
          className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900"
        />
        <datalist id="category-list">
          {categories.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving || !name.trim()}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
        >
          {submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600"
        >
          Zrušit
        </button>
      </div>
    </form>
  );
}
