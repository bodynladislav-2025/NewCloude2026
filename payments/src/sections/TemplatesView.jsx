import { useMemo, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useTemplates } from '../hooks/useTemplates';
import ItemForm from '../components/ItemForm';
import { formatCzk } from '../utils/format';

function TemplateRow({ template, categories, onUpdate, onToggleActive, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (editing) {
    return (
      <li className="py-2">
        <ItemForm
          initial={template}
          categories={categories}
          submitLabel="Uložit"
          onSubmit={async (values) => {
            await onUpdate(template.id, values);
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
        role="switch"
        aria-checked={template.active}
        aria-label={template.active ? 'Vypnout položku' : 'Zapnout položku'}
        onClick={() => onToggleActive(template)}
        className={`relative h-6 w-10 shrink-0 rounded-full transition-colors ${
          template.active ? 'bg-emerald-600' : 'bg-slate-300'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
            template.active ? 'left-[18px]' : 'left-0.5'
          }`}
        />
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-sm font-medium ${
            template.active ? 'text-slate-900' : 'text-slate-400'
          }`}
        >
          {template.name}
        </p>
        {template.category && <p className="text-xs text-slate-400">{template.category}</p>}
      </div>

      <span
        className={`tnum shrink-0 text-sm font-semibold ${
          template.active ? 'text-slate-900' : 'text-slate-400'
        }`}
      >
        {formatCzk(template.amount)}
      </span>

      {confirmDelete ? (
        <span className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => onDelete(template.id)}
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

function TemplateSection({ title, type, templates, categories, actions }) {
  const [adding, setAdding] = useState(false);
  const list = templates.filter((t) => t.type === type);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-1 text-sm font-semibold text-slate-900">{title}</h2>
      {list.length === 0 && <p className="py-3 text-sm text-slate-500">Zatím žádné položky.</p>}
      <ul className="divide-y divide-slate-50">
        {list.map((t) => (
          <TemplateRow
            key={t.id}
            template={t}
            categories={categories}
            onUpdate={actions.updateTemplate}
            onToggleActive={actions.toggleActive}
            onDelete={actions.deleteTemplate}
          />
        ))}
      </ul>
      <div className="mt-3">
        {adding ? (
          <ItemForm
            categories={categories}
            submitLabel="Přidat"
            onSubmit={async (values) => {
              await actions.addTemplate({ ...values, type });
              setAdding(false);
            }}
            onCancel={() => setAdding(false)}
          />
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-blue-600 active:bg-blue-50"
          >
            <Plus size={16} /> Přidat
          </button>
        )}
      </div>
    </section>
  );
}

export default function TemplatesView() {
  const { templates, loading, error, addTemplate, updateTemplate, toggleActive, deleteTemplate } =
    useTemplates();

  const categories = useMemo(
    () => [...new Set(templates.map((t) => t.category).filter(Boolean))],
    [templates]
  );

  const actions = { addTemplate, updateTemplate, toggleActive, deleteTemplate };

  return (
    <div className="space-y-3">
      <p className="rounded-2xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900">
        Položky šablony se automaticky předvyplní do každého nově otevřeného měsíce. Změny se
        projeví až v měsících, které otevřete poprvé — už založené měsíce zůstávají beze změny.
      </p>

      {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      {loading ? (
        <p className="py-10 text-center text-sm text-slate-500">Načítám…</p>
      ) : (
        <>
          <TemplateSection
            title="Pravidelné výdaje"
            type="expense"
            templates={templates}
            categories={categories}
            actions={actions}
          />
          <TemplateSection
            title="Pravidelné příjmy"
            type="income"
            templates={templates}
            categories={categories}
            actions={actions}
          />
        </>
      )}
    </div>
  );
}
