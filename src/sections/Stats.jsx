import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList,
} from 'recharts';
import { computePlayerStats, computeHeadToHead } from '../utils/stats';
import EmptyState from '../components/EmptyState';

const MEDAL_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];
const MEDAL_LABELS = ['🥇', '🥈', '🥉'];
const BAR_COLORS = ['#4CAF50', '#2196F3', '#FF9800', '#E91E63', '#9C27B0', '#00BCD4'];

function RankBadge({ rank }) {
  if (rank <= 3) return <span className="text-xl">{MEDAL_LABELS[rank - 1]}</span>;
  return <span className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 text-sm font-bold flex items-center justify-center">{rank}</span>;
}

export default function Stats({ players, matches, setActiveTab }) {
  const stats = useMemo(() => computePlayerStats(players, matches), [players, matches]);
  const h2h = useMemo(() => computeHeadToHead(players, matches), [players, matches]);

  const sorted = [...stats].sort((a, b) => {
    if (b.pct !== a.pct) return (b.pct ?? -1) - (a.pct ?? -1);
    return b.wins - a.wins;
  });

  const chartData = sorted.map((s) => ({
    name: s.name,
    pct: s.pct ?? 0,
    isMe: s.isMe,
  }));

  if (players.length === 0) {
    return (
      <EmptyState
        icon="📊"
        title="Žádní hráči"
        description="Přidejte hráče a začněte hrát zápasy, aby se zobrazily statistiky."
        action={{ label: 'Přidat hráče', onClick: () => setActiveTab('players') }}
      />
    );
  }

  if (matches.length === 0) {
    return (
      <EmptyState
        icon="🎾"
        title="Zatím žádné zápasy"
        description="Statistiky se zobrazí po přidání prvního zápasu."
        action={{ label: 'Přidat první zápas', onClick: () => setActiveTab('add') }}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">

      {/* === Pořadí hráčů === */}
      <section>
        <h2 className="text-lg font-bold text-gray-800 mb-3">🏆 Celkové pořadí</h2>
        <div className="space-y-2">
          {sorted.map((s, idx) => {
            const rank = idx + 1;
            const bgColor = rank === 1 ? 'bg-yellow-50 border-yellow-200' : rank === 2 ? 'bg-gray-50 border-gray-200' : rank === 3 ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-100';
            return (
              <div key={s.id} className={`rounded-2xl border shadow-sm px-4 py-3 flex items-center gap-4 ${bgColor} fade-in`}>
                <RankBadge rank={rank} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800 truncate">{s.name}</span>
                    {s.isMe && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium shrink-0">já</span>}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {s.wins}V / {s.losses}P · {s.total} {s.total === 1 ? 'zápas' : s.total < 5 ? 'zápasy' : 'zápasů'}
                  </div>
                </div>

                {/* % bar */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-24 hidden sm:block">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${s.pct ?? 0}%`,
                          background: rank === 1 ? '#FFD700' : rank === 2 ? '#C0C0C0' : rank === 3 ? '#CD7F32' : '#4CAF50',
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-700 w-10 text-right">
                    {s.pct !== null ? `${s.pct}%` : '–'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* === Graf === */}
      <section>
        <h2 className="text-lg font-bold text-gray-800 mb-3">📊 Graf úspěšnosti</h2>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 13, fontWeight: 600, fill: '#555' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11, fill: '#aaa' }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(value) => [`${value}%`, 'Úspěšnost']}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '13px' }}
                cursor={{ fill: 'rgba(0,0,0,0.04)' }}
              />
              <Bar dataKey="pct" radius={[8, 8, 0, 0]} maxBarSize={60}>
                {chartData.map((_, index) => (
                  <Cell key={index} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                ))}
                <LabelList dataKey="pct" position="top" formatter={(v) => v > 0 ? `${v}%` : ''} style={{ fontSize: '12px', fontWeight: 700, fill: '#555' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* === Head-to-head === */}
      {players.length >= 2 && (
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">⚔️ Head-to-head</h2>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-4 py-3 text-left font-semibold text-gray-500 text-xs uppercase tracking-wide">
                      ↓ vs →
                    </th>
                    {players.map((opp) => (
                      <th key={opp.id} className="px-3 py-3 text-center font-semibold text-gray-700 text-xs whitespace-nowrap">
                        {opp.name}
                        {opp.isMe && <span className="ml-1 text-green-500">★</span>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {players.map((attacker, rowIdx) => (
                    <tr key={attacker.id} className={rowIdx % 2 === 0 ? '' : 'bg-gray-50/50'}>
                      <td className="px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">
                        {attacker.name}
                        {attacker.isMe && <span className="ml-1 text-xs text-green-500">(já)</span>}
                      </td>
                      {players.map((opp) => {
                        if (attacker.id === opp.id) {
                          return (
                            <td key={opp.id} className="px-3 py-3 text-center bg-gray-100 text-gray-300">
                              —
                            </td>
                          );
                        }
                        const cell = h2h[attacker.id]?.[opp.id];
                        if (!cell || cell.total === 0) {
                          return (
                            <td key={opp.id} className="px-3 py-3 text-center text-gray-300 text-xs">
                              –
                            </td>
                          );
                        }
                        const pctColor = cell.pct >= 60 ? 'text-green-600' : cell.pct <= 40 ? 'text-red-500' : 'text-gray-600';
                        return (
                          <td key={opp.id} className="px-3 py-3 text-center">
                            <div className={`font-bold text-sm ${pctColor}`}>{cell.wins}</div>
                            <div className="text-xs text-gray-400">{cell.pct}%</div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-400">
              Číslo = počet výher · % = úspěšnost proti danému soupeři
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
