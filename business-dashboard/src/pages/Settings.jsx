import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Save, Plus, Trash2, AlertCircle } from 'lucide-react';
import { getCzechHolidaysWithNames } from '../utils/czechHolidays';
import { formatDate } from '../utils/formatters';

export default function SettingsPage() {
  const [settings, setSettings]         = useState({ company_name: '', company_logo_url: '', warning_threshold_pct: '85' });
  const [salespersons, setSalespersons] = useState([]);
  const [newSp, setNewSp]               = useState({ name: '', team: '' });
  const [saving, setSaving]             = useState(false);
  const [saved, setSaved]               = useState('');
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('settings').select('key, value'),
      supabase.from('salespersons').select('*').order('name'),
    ]).then(([{ data: s }, { data: sp }]) => {
      const map = {};
      s?.forEach(row => { map[row.key] = row.value || ''; });
      setSettings(prev => ({ ...prev, ...map }));
      setSalespersons(sp || []);
      setLoading(false);
    });
  }, []);

  async function saveSetting(key, value) {
    await supabase.from('settings').upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  }

  async function handleSaveSettings() {
    setSaving(true);
    try {
      await Promise.all([
        saveSetting('company_name', settings.company_name),
        saveSetting('company_logo_url', settings.company_logo_url),
        saveSetting('warning_threshold_pct', settings.warning_threshold_pct),
      ]);
      setSaved('settings');
      setTimeout(() => setSaved(''), 2000);
    } finally {
      setSaving(false);
    }
  }

  // Logo: convert to base64 and store directly in settings
  async function handleLogoChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSettings(prev => ({ ...prev, company_logo_url: reader.result }));
    };
    reader.readAsDataURL(file);
  }

  async function addSalesperson() {
    if (!newSp.name.trim()) return;
    const { data } = await supabase.from('salespersons').insert({ name: newSp.name.trim(), team: newSp.team.trim() || null }).select().single();
    if (data) {
      setSalespersons(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      setNewSp({ name: '', team: '' });
    }
  }

  async function deleteSalesperson(id) {
    await supabase.from('salespersons').delete().eq('id', id);
    setSalespersons(prev => prev.filter(sp => sp.id !== id));
  }

  async function toggleActive(sp) {
    const updated = { ...sp, active: !sp.active };
    await supabase.from('salespersons').update({ active: updated.active }).eq('id', sp.id);
    setSalespersons(prev => prev.map(s => s.id === sp.id ? updated : s));
  }

  const allowedEmails = (import.meta.env.VITE_ALLOWED_EMAILS || '').split(',').filter(Boolean);
  const holidays = getCzechHolidaysWithNames(new Date().getFullYear());

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-xl font-bold text-slate-900">Nastavení</h1>

      {/* Company settings */}
      <Section title="Informace o firmě">
        <div className="space-y-4">
          <Field label="Název firmy">
            <input
              type="text"
              value={settings.company_name}
              onChange={e => setSettings(p => ({ ...p, company_name: e.target.value }))}
              className="input-base"
              placeholder="Moje Firma s.r.o."
            />
          </Field>

          <Field label="Logo firmy" hint="Logo se zobrazí v PDF exportu. Bude uloženo po kliknutí na Uložit nastavení.">
            {settings.company_logo_url && (
              <img src={settings.company_logo_url} alt="Logo" className="h-12 mb-2 rounded border border-slate-200" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="text-sm text-slate-600"
            />
          </Field>

          <Field label="Práh varování (% očekávaného plnění)" hint="Výchozí 85 % – pod tímto prahem se zobrazí červená">
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="50"
                max="99"
                value={settings.warning_threshold_pct}
                onChange={e => setSettings(p => ({ ...p, warning_threshold_pct: e.target.value }))}
                className="input-base w-24"
              />
              <span className="text-sm text-slate-500">%</span>
            </div>
          </Field>

          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Ukládám…' : saved === 'settings' ? '✓ Uloženo' : 'Uložit nastavení'}
          </button>
        </div>
      </Section>

      {/* Salespersons */}
      <Section title="Obchodníci">
        <div className="space-y-2 mb-4">
          {salespersons.length === 0 && (
            <p className="text-sm text-slate-400 py-2">Žádní obchodníci</p>
          )}
          {salespersons.map(sp => (
            <div key={sp.id} className={`flex items-center gap-3 p-3 rounded-lg border ${sp.active ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50 opacity-60'}`}>
              <div className="flex-1">
                <span className="font-medium text-slate-800 text-sm">{sp.name}</span>
                {sp.team && <span className="ml-2 text-xs text-slate-400">{sp.team}</span>}
              </div>
              <button
                onClick={() => toggleActive(sp)}
                className={`text-xs px-2 py-1 rounded-md font-medium transition-colors ${
                  sp.active ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {sp.active ? 'Aktivní' : 'Neaktivní'}
              </button>
              <button
                onClick={() => deleteSalesperson(sp.id)}
                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Jméno obchodníka"
            value={newSp.name}
            onChange={e => setNewSp(p => ({ ...p, name: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && addSalesperson()}
            className="input-base flex-1"
          />
          <input
            type="text"
            placeholder="Tým (volitelné)"
            value={newSp.team}
            onChange={e => setNewSp(p => ({ ...p, team: e.target.value }))}
            className="input-base w-36"
          />
          <button
            onClick={addSalesperson}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Přidat
          </button>
        </div>
      </Section>

      {/* Allowed emails */}
      <Section title="Přístup (whitelist e-mailů)">
        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg mb-3">
          <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-700">
            Whitelist se konfiguruje přes environment proměnnou <code className="bg-amber-100 px-1 rounded">VITE_ALLOWED_EMAILS</code> v souboru <code className="bg-amber-100 px-1 rounded">.env.local</code>.
          </p>
        </div>
        {allowedEmails.length === 0 ? (
          <p className="text-sm text-slate-500">Whitelist není nastaven – přístup mají všechny přihlášené Google účty.</p>
        ) : (
          <ul className="space-y-1">
            {allowedEmails.map(email => (
              <li key={email} className="text-sm text-slate-700 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                {email}
              </li>
            ))}
          </ul>
        )}
      </Section>

      {/* Czech holidays */}
      <Section title={`České státní svátky ${new Date().getFullYear()}`}>
        <div className="space-y-1.5">
          {holidays.map(({ date, name }, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-slate-500">{formatDate(date)}</span>
              <span className="text-slate-800 text-right font-medium">{name}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h2 className="font-semibold text-slate-800 mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {children}
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}
