import { useState } from 'react';
import { Check, Pencil, Trash2 } from 'lucide-react';
import ItemForm from './ItemForm';
import { formatCzk } from '../utils/format';

export default function ItemRow({ item, categories, onTogglePaid, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (editing) {
    return (
      <li className="py-2">
        <ItemForm
          initial={item}
          categories={categories}
          submitLabel="Uložit"
          onSubmit={async (values) => {
            await onUpdate(item.id, values);
            setEditing(false);
          }}
          onCancel={() => setEditing(false)}
        />
      </li>
    );
  }

  return (
    <li className="flex items-center gap-3 py-1.5">
      <button
        type="button"
        onClick={() => onTogglePaid(item)}
        aria-label={item.paid ? 'Označit jako nezaplacené' : 'Označit jako zaplacené'}
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          item.paid
            ? 'border-emerald-600 bg-emerald-600 text-white'
            : 'border-slate-300 bg-white text-transparent active:border-emerald-500'
        }`}
      >
        <Check size={16} strokeWidth={3} />
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-sm font-medium ${
            item.paid ? 'text-slate-400 line-through' : 'text-slate-900'
          }`}
        >
          {item.name}
        </p>
        {!item.templateId && item.type === 'expense' && (
          <p className="text-xs text-slate-400">jednorázová</p>
        )}
      </div>

      <span
        className={`tnum shrink-0 text-sm font-semibold ${
          item.paid ? 'text-slate-400' : 'text-slate-900'
        }`}
      >
        {formatCzk(item.amount)}
      </span>

      {confirmDelete ? (
        <span className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => onDelete(item.id)}
            className="rounded-lg bg-red-600 px-2 py-1 text-xs font-semibold text-white"
          >
            Smazat
          </button>
          <button
            type="button"
            onClick={() => setConfirmDelete(false)}
            className="rounded-lg px-2 py-1 text-xs font-medium text-slate-500"
          >
            Ne
          </button>
        </span>
      ) : (
        <span className="flex shrink-0 items-center">
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-label="Upravit"
            className="rounded-lg p-1.5 text-slate-400 active:text-slate-700"
          >
            <Pencil size={15} />
          </button>
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            aria-label="Smazat"
            className="rounded-lg p-1.5 text-slate-400 active:text-red-600"
          >
            <Trash2 size={15} />
          </button>
        </span>
      )}
    </li>
  );
}
