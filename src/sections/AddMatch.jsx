import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { todayISO } from '../utils/stats';
import EmptyState from '../components/EmptyState';

export default function AddMatch({ players, matches, addMatch, updateMatch, editingMatch, setEditingMatch, setActiveTab, embedded = false }) {
  const today = todayISO();
  const [form, setForm] = useState({ date: today, player1Id: '', player2Id: '', score1: '', score2: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingMatch) {
      setForm({
        date: editingMatch.date,
        player1Id: editingMatch.player1Id,
        player2Id: editingMatch.player2Id,
        score1: String(editingMatch.score1),
        score2: String(editingMatch.score2),
      });
    } else {
      setForm((f) => ({ ...f, date: today, player1Id: '', player2Id: '', score1: '', score2: '' }));
    }
    setError('');
    setSuccess(false);
  }, [editingMatch]);

  if (players.length < 2) {
    if (embedded) {
      return (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-6 text-center text-gray-500 text-sm">
          👥 Pro přidání zápasu potřebujete alespoň 2 hráče.{' '}
          <button onClick={() => setActiveTab('players')} className="text-green-600 font-semibold underline">Přidat hráče</button>
        </div>
      );
    }
    return (
      <EmptyState
        icon="👥"
        title="Nejdříve přidejte hráče"
        description="Pro zadání zápasu potřebujete alespoň 2 hráče. Začněte přidáním hráčů."
        action={{ label: 'Přidat hráče', onClick: () => setActiveTab('players') }}
      />
    );
  }

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setError('');
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.player1Id || !form.player2Id) { setError('Vyberte oba hráče.'); return; }
    if (form.player1Id === form.player2Id) { setError('Hráč 1 a Hráč 2 musí být různí.'); return; }
    const s1 = parseInt(form.score1, 10);
    const s2 = parseInt(form.score2, 10);
    if (isNaN(s1) || isNaN(s2) || s1 < 0 || s2 < 0) { setError('Zadejte platné skóre (nezáporná čísla).'); return; }
    if (!form.date) { setError('Zadejte datum zápasu.'); return; }

    setSaving(true);
    try {
      if (editingMatch) {
        await updateMatch(editingMatch.id, {
          date: form.date, player1Id: form.player1Id, player2Id: form.player2Id, score1: s1, score2: s2,
        });
        setEditingMatch(null);
      } else {
        await addMatch({ id: uuidv4(), date: form.date, player1Id: form.player1Id, player2Id: form.player2Id, score1: s1, score2: s2 });
      }
      setForm({ date: today, player1Id: '', player2Id: '', score1: '', score2: '' });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError('Chyba při ukládání. Zkuste to znovu.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingMatch(null);
    setForm({ date: today, player1Id: '', player2Id: '', score1: '', score2: '' });
    setError('');
  };

  const availableP2 = players.filter((p) => p.id !== form.player1Id);
  const availableP1 = players.filter((p) => p.id !== form.player2Id);
  const p1 = players.find((p) => p.id === form.player1Id);
  const p2 = players.find((p) => p.id === form.player2Id);

  return (
    <div className={embedded ? '' : 'max-w-lg mx-auto p-4'}>
      <div className="bg-white rounded-2xl shadow-sm border border-green-100 overflow-hidden">
        {!embedded && (
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-5">
            <h2 className="text-white font-bold text-xl">{editingMatch ? '✏️ Upravit zápas' : '🎾 Přidat nový zápas'}</h2>
            <p className="text-green-100 text-sm mt-1">{editingMatch ? 'Upravte výsledek zápasu' : 'Zaznamenejte výsledek zápasu'}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">📅 Datum zápasu</label>
            <input type="date" value={form.date} onChange={(e) => handleChange('date', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none text-gray-700 transition-all" />
          </div>

          <div className="bg-gray-50 rounded-xl p-4 space-y-4">
            <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Hráči a skóre</div>
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Hráč 1</label>
                <select value={form.player1Id} onChange={(e) => handleChange('player1Id', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none text-gray-700 bg-white transition-all">
                  <option value="">— Vyberte hráče —</option>
                  {availableP1.map((p) => <option key={p.id} value={p.id}>{p.name}{p.isMe ? ' (já)' : ''}</option>)}
                </select>
              </div>
              <div className="w-20">
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Výhry</label>
                <input type="number" min="0" value={form.score1} onChange={(e) => handleChange('score1', e.target.value)} placeholder="0"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none text-center text-gray-700 text-lg font-bold bg-white transition-all" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-xs font-bold text-yellow-900 shadow-sm">VS</div>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Hráč 2</label>
                <select value={form.player2Id} onChange={(e) => handleChange('player2Id', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none text-gray-700 bg-white transition-all">
                  <option value="">— Vyberte hráče —</option>
                  {availableP2.map((p) => <option key={p.id} value={p.id}>{p.name}{p.isMe ? ' (já)' : ''}</option>)}
                </select>
              </div>
              <div className="w-20">
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Výhry</label>
                <input type="number" min="0" value={form.score2} onChange={(e) => handleChange('score2', e.target.value)} placeholder="0"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none text-center text-gray-700 text-lg font-bold bg-white transition-all" />
              </div>
            </div>
          </div>

          {p1 && p2 && form.score1 !== '' && form.score2 !== '' && (
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-center fade-in">
              <span className="font-semibold text-green-800">{p1.name}</span>
              <span className="mx-2 text-2xl font-bold text-green-700">{form.score1} : {form.score2}</span>
              <span className="font-semibold text-green-800">{p2.name}</span>
            </div>
          )}

          {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm fade-in">⚠️ {error}</div>}
          {success && <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm fade-in">✅ Zápas byl úspěšně uložen!</div>}

          <div className="flex gap-3 pt-1">
            {editingMatch && (
              <button type="button" onClick={handleCancel}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors">
                Zrušit
              </button>
            )}
            <button type="submit" disabled={saving}
              className="flex-1 px-4 py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 disabled:opacity-60 transition-colors shadow-md">
              {saving ? 'Ukládám…' : editingMatch ? 'Uložit změny' : '+ Přidat zápas'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
