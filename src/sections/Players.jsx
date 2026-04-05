import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ConfirmDialog from '../components/ConfirmDialog';

const MAX_PLAYERS = 6;

export default function Players({ players, setPlayers, matches }) {
  const [newName, setNewName] = useState('');
  const [isMe, setIsMe] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [error, setError] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) { setError('Zadejte jméno hráče.'); return; }
    if (players.some((p) => p.name.toLowerCase() === trimmed.toLowerCase())) {
      setError('Hráč s tímto jménem již existuje.');
      return;
    }
    if (players.length >= MAX_PLAYERS) {
      setError(`Maximálně ${MAX_PLAYERS} hráčů.`);
      return;
    }

    const newPlayers = isMe
      ? players.map((p) => ({ ...p, isMe: false }))
      : [...players];

    newPlayers.push({ id: uuidv4(), name: trimmed, isMe });
    setPlayers(newPlayers);
    setNewName('');
    setIsMe(false);
    setError('');
  };

  const startEdit = (player) => {
    setEditingId(player.id);
    setEditName(player.name);
    setError('');
  };

  const saveEdit = (id) => {
    const trimmed = editName.trim();
    if (!trimmed) { setError('Jméno nesmí být prázdné.'); return; }
    if (players.some((p) => p.id !== id && p.name.toLowerCase() === trimmed.toLowerCase())) {
      setError('Hráč s tímto jménem již existuje.');
      return;
    }
    setPlayers((prev) => prev.map((p) => p.id === id ? { ...p, name: trimmed } : p));
    setEditingId(null);
    setError('');
  };

  const setAsMe = (id) => {
    setPlayers((prev) => prev.map((p) => ({ ...p, isMe: p.id === id })));
  };

  const handleDelete = (id) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
    setConfirmDeleteId(null);
  };

  const matchCount = (id) => matches.filter((m) => m.player1Id === id || m.player2Id === id).length;

  return (
    <div className="max-w-lg mx-auto p-4">
      {/* Add player form */}
      <div className="bg-white rounded-2xl shadow-sm border border-green-100 overflow-hidden mb-5">
        <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
          <h2 className="text-white font-bold text-lg">👥 Správa hráčů</h2>
          <p className="text-green-100 text-sm">
            {players.length} / {MAX_PLAYERS} hráčů
          </p>
        </div>

        <form onSubmit={handleAdd} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Jméno nového hráče</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => { setNewName(e.target.value); setError(''); }}
              placeholder="Zadejte jméno..."
              maxLength={30}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none text-gray-700 transition-all"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setIsMe((v) => !v)}
              className={`w-11 h-6 rounded-full transition-colors relative ${isMe ? 'bg-green-500' : 'bg-gray-200'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${isMe ? 'left-5' : 'left-0.5'}`} />
            </div>
            <span className="text-sm font-medium text-gray-700">Toto jsem já</span>
          </label>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={players.length >= MAX_PLAYERS}
            className="w-full py-2.5 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            + Přidat hráče
          </button>
        </form>
      </div>

      {/* Player list */}
      {players.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <div className="text-5xl mb-3">👤</div>
          <p className="font-medium">Zatím žádní hráči</p>
          <p className="text-sm">Přidejte prvního hráče výše.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {players.map((player) => (
            <div
              key={player.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden fade-in"
            >
              {editingId === player.id ? (
                <div className="p-4 space-y-3">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(player.id); if (e.key === 'Escape') setEditingId(null); }}
                    maxLength={30}
                    autoFocus
                    className="w-full px-4 py-2.5 rounded-xl border border-green-300 focus:ring-2 focus:ring-green-100 outline-none text-gray-700"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50"
                    >
                      Zrušit
                    </button>
                    <button
                      onClick={() => saveEdit(player.id)}
                      className="flex-1 py-2 rounded-xl bg-green-500 text-white text-sm font-medium hover:bg-green-600"
                    >
                      Uložit
                    </button>
                  </div>
                </div>
              ) : (
                <div className="px-4 py-3 flex items-center gap-3">
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${player.isMe ? 'bg-green-500' : 'bg-gray-400'}`}>
                    {player.name[0].toUpperCase()}
                  </div>

                  {/* Name & meta */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800 truncate">{player.name}</span>
                      {player.isMe && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium shrink-0">já</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400">
                      {matchCount(player.id)} {matchCount(player.id) === 1 ? 'zápas' : matchCount(player.id) < 5 ? 'zápasy' : 'zápasů'}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {!player.isMe && (
                      <button
                        onClick={() => setAsMe(player.id)}
                        title="Označit jako já"
                        className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors text-sm"
                      >
                        👤
                      </button>
                    )}
                    <button
                      onClick={() => startEdit(player)}
                      className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors text-sm"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(player.id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors text-sm"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {confirmDeleteId && (
        <ConfirmDialog
          message={`Opravdu smazat hráče „${players.find((p) => p.id === confirmDeleteId)?.name}"? Všechny jeho zápasy zůstanou v historii.`}
          onConfirm={() => handleDelete(confirmDeleteId)}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}
    </div>
  );
}
