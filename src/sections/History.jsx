import { useState } from 'react';
import { formatDate } from '../utils/stats';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';

export default function History({ players, matches, setMatches, setEditingMatch, setActiveTab }) {
  const [confirmId, setConfirmId] = useState(null);

  const getPlayer = (id) => players.find((p) => p.id === id);

  const handleDelete = (id) => {
    setMatches((prev) => prev.filter((m) => m.id !== id));
    setConfirmId(null);
  };

  const handleEdit = (match) => {
    setEditingMatch(match);
    setActiveTab('add');
  };

  const sortedMatches = [...matches].sort((a, b) => {
    if (b.date !== a.date) return b.date.localeCompare(a.date);
    return 0;
  });

  if (matches.length === 0) {
    return (
      <EmptyState
        icon="📋"
        title="Zatím žádné zápasy"
        description="Přidejte první zápas a začněte sledovat své výsledky!"
        action={{ label: '🎾 Přidat první zápas', onClick: () => setActiveTab('add') }}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">Historie zápasů</h2>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {matches.length} {matches.length === 1 ? 'zápas' : matches.length < 5 ? 'zápasy' : 'zápasů'}
        </span>
      </div>

      <div className="space-y-3">
        {sortedMatches.map((match) => {
          const p1 = getPlayer(match.player1Id);
          const p2 = getPlayer(match.player2Id);
          if (!p1 || !p2) return null;

          const p1Won = match.score1 > match.score2;
          const p2Won = match.score2 > match.score1;
          const draw = match.score1 === match.score2;

          return (
            <div
              key={match.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden fade-in"
            >
              {/* Date bar */}
              <div className="bg-gray-50 border-b border-gray-100 px-4 py-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  📅 {formatDate(match.date)}
                </span>
                {draw && (
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                    Remíza
                  </span>
                )}
              </div>

              {/* Score */}
              <div className="px-4 py-4">
                <div className="flex items-center gap-3">
                  {/* Player 1 */}
                  <div className={`flex-1 text-right ${p1Won ? 'text-green-700' : 'text-gray-500'}`}>
                    <div className="font-bold text-base">
                      {p1.name}
                      {p1.isMe && <span className="ml-1 text-xs text-green-500">(já)</span>}
                    </div>
                    {p1Won && <div className="text-xs text-green-500 font-medium">🏆 Vítěz</div>}
                  </div>

                  {/* Score */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-2xl font-extrabold w-10 text-center ${p1Won ? 'text-green-600' : 'text-gray-400'}`}>
                      {match.score1}
                    </span>
                    <span className="text-gray-300 font-bold text-xl">:</span>
                    <span className={`text-2xl font-extrabold w-10 text-center ${p2Won ? 'text-green-600' : 'text-gray-400'}`}>
                      {match.score2}
                    </span>
                  </div>

                  {/* Player 2 */}
                  <div className={`flex-1 ${p2Won ? 'text-green-700' : 'text-gray-500'}`}>
                    <div className="font-bold text-base">
                      {p2.name}
                      {p2.isMe && <span className="ml-1 text-xs text-green-500">(já)</span>}
                    </div>
                    {p2Won && <div className="text-xs text-green-500 font-medium">🏆 Vítěz</div>}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-gray-100 px-4 py-2 flex gap-2 justify-end">
                <button
                  onClick={() => handleEdit(match)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-colors"
                >
                  ✏️ Upravit
                </button>
                <button
                  onClick={() => setConfirmId(match.id)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 font-medium transition-colors"
                >
                  🗑️ Smazat
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {confirmId && (
        <ConfirmDialog
          message="Opravdu chcete smazat tento zápas? Tato akce je nevratná."
          onConfirm={() => handleDelete(confirmId)}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  );
}
