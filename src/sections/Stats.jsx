import { useMemo, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList,
} from 'recharts';
import { computePlayerStats, computeHeadToHead } from '../utils/stats';
import EmptyState from '../components/EmptyState';

const MEDAL_LABELS = ['🥇', '🥈', '🥉'];
const BAR_COLORS = ['#4CAF50', '#2196F3', '#FF9800', '#E91E63', '#9C27B0', '#00BCD4'];
const RANK_BAR = ['#FFD700', '#C0C0C0', '#CD7F32'];

function RankBadge({ rank }) {
  if (rank <= 3) return <span className="text-xl">{MEDAL_LABELS[rank - 1]}</span>;
  return (
    <span className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 text-sm font-bold flex items-center justify-center">
      {rank}
    </span>
  );
}

function PctBar({ value, color }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${value ?? 0}%`, background: color }} />
      </div>
      <span className="text-sm font-bold text-gray-700 w-9 text-right shrink-0">
        {value !== null ? `${value}%` : '–'}
      </span>
    </div>
  );
}

export default function Stats({ players, matches, setActiveTab }) {
  const [chartMetric, setChartMetric] = useState('pct');
  const stats = useMemo(() => computePlayerStats(players, matches), [players, matches]);
  const h2h = useMemo(() => computeHeadToHead(players, matches), [players, matches]);

  const sorted = [...stats].sort((a, b) => {
    if (b.pct !== a.pct) return (b.pct ?? -1) - (a.pct ?? -1);
    return b.wins - a.wins;
  });

  const chartData = sorted.map((s) => ({
    name: s.name,
    pct: s.pct ?? 0,
    gamePct: s.gamePct ?? 0,
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

      {/* === Celkové pořadí + detail vs soupeři === */}
      <section>
        <h2 className="text-lg font-bold text-gray-800 mb-3">🏆 Celkové pořadí</h2>
        <div className="space-y-3">
          {sorted.map((s, idx) => {
            const rank = idx + 1;
            const barColor = rank <= 3 ? RANK_BAR[rank - 1] : '#4CAF50';
            const bgColor = rank === 1 ? 'bg-yellow-50 border-yellow-200'
              : rank === 2 ? 'bg-gray-50 border-gray-200'
              : rank === 3 ? 'bg-orange-50 border-orange-200'
              : 'bg-white border-gray-100';

            // opponents this player has played
            const opponents = players.filter((p) => p.id !== s.id && h2h[s.id]?.[p.id]?.total > 0);

            return (
              <div key={s.id} className={`rounded-2xl border shadow-sm p-4 ${bgColor} fade-in`}>

                {/* Jméno + odznak */}
                <div className="flex items-center gap-3 mb-3">
                  <RankBadge rank={rank} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-800 text-base">{s.name}</span>
                      {s.isMe && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">já</span>}
                    </div>
                    <div className="text-xs text-gray-500">
                      {s.wins}V / {s.losses}P / {s.total - s.wins - s.losses}R · celkem {s.total} {s.total === 1 ? 'zápas' : s.total < 5 ? 'zápasy' : 'zápasů'}
                    </div>
                  </div>
                </div>

                {/* Celkové % */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white/80 rounded-xl px-3 py-2">
                    <div className="text-xs font-semibold text-gray-500 mb-1">% vyhraných dní</div>
                    <PctBar value={s.pct} color={barColor} />
                    <div className="text-xs text-gray-400 mt-0.5">{s.wins} výher z {s.total} sesí</div>
                  </div>
                  <div className="bg-white/80 rounded-xl px-3 py-2">
                    <div className="text-xs font-semibold text-gray-500 mb-1">% vyhraných zápasů</div>
                    <PctBar value={s.gamePct} color={barColor} />
                    <div className="text-xs text-gray-400 mt-0.5">{s.gamesWon} gemů z {s.totalGames} celkem</div>
                  </div>
                </div>

                {/* Detail vs každý soupeř */}
                {opponents.length > 0 && (
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Výsledky proti soupeřům</div>
                    <div className="space-y-2">
                      {opponents.map((opp) => {
                        const cell = h2h[s.id][opp.id];
                        const matchColor = cell.pct >= 60 ? '#4CAF50' : cell.pct !== null && cell.pct <= 40 ? '#ef4444' : '#9E9E9E';
                        const gameColor = cell.gamePct >= 60 ? '#4CAF50' : cell.gamePct !== null && cell.gamePct <= 40 ? '#ef4444' : '#9E9E9E';
                        return (
                          <div key={opp.id} className="bg-white/80 rounded-xl px-3 py-2.5">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold text-gray-700 text-sm">vs {opp.name}</span>
                              <span className="text-xs text-gray-400">{cell.total} {cell.total === 1 ? 'zápas' : cell.total < 5 ? 'zápasy' : 'zápasů'}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <div className="text-xs text-gray-400 mb-1">% zápasů</div>
                                <PctBar value={cell.pct} color={matchColor} />
                                <div className="text-xs text-gray-400 mt-0.5">{cell.wins}V z {cell.total}</div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-400 mb-1">% zápasů</div>
                                <PctBar value={cell.gamePct} color={gameColor} />
                                <div className="text-xs text-gray-400 mt-0.5">{cell.gamesWon}G z {cell.gamesWon + cell.gamesLost}</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* === Graf === */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-800">📊 Graf úspěšnosti</h2>
          <div className="flex bg-gray-100 rounded-xl p-1 text-xs font-semibold">
            <button
              onClick={() => setChartMetric('pct')}
              className={`px-3 py-1.5 rounded-lg transition-all ${chartMetric === 'pct' ? 'bg-white shadow text-green-700' : 'text-gray-500'}`}
            >
              % zápasů
            </button>
            <button
              onClick={() => setChartMetric('gamePct')}
              className={`px-3 py-1.5 rounded-lg transition-all ${chartMetric === 'gamePct' ? 'bg-white shadow text-green-700' : 'text-gray-500'}`}
            >
              % zápasů
            </button>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="text-xs text-gray-400 mb-2 text-center">
            {chartMetric === 'pct' ? 'Vyhraných dní / celkem dní' : 'Vyhraných zápasů / celkem zápasů'}
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 13, fontWeight: 600, fill: '#555' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11, fill: '#aaa' }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(value, name) => [`${value}%`, name === 'pct' ? '% vyhraných dní' : '% zápasů']}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '13px' }}
                cursor={{ fill: 'rgba(0,0,0,0.04)' }}
              />
              <Bar dataKey={chartMetric} radius={[8, 8, 0, 0]} maxBarSize={60}>
                {chartData.map((_, index) => (
                  <Cell key={index} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                ))}
                <LabelList dataKey={chartMetric} position="top" formatter={(v) => v > 0 ? `${v}%` : ''} style={{ fontSize: '12px', fontWeight: 700, fill: '#555' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* === Head-to-head tabulka === */}
      {players.length >= 2 && (
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">⚔️ Head-to-head přehled</h2>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-4 py-3 text-left font-semibold text-gray-500 text-xs uppercase tracking-wide">↓ vs →</th>
                    {players.map((opp) => (
                      <th key={opp.id} className="px-3 py-3 text-center font-semibold text-gray-700 text-xs whitespace-nowrap">
                        {opp.name}{opp.isMe && <span className="ml-1 text-green-500">★</span>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {players.map((attacker, rowIdx) => (
                    <tr key={attacker.id} className={rowIdx % 2 === 0 ? '' : 'bg-gray-50/50'}>
                      <td className="px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">
                        {attacker.name}{attacker.isMe && <span className="ml-1 text-xs text-green-500">(já)</span>}
                      </td>
                      {players.map((opp) => {
                        if (attacker.id === opp.id) {
                          return <td key={opp.id} className="px-3 py-3 text-center bg-gray-100 text-gray-300">—</td>;
                        }
                        const cell = h2h[attacker.id]?.[opp.id];
                        if (!cell || cell.total === 0) {
                          return <td key={opp.id} className="px-3 py-3 text-center text-gray-300 text-xs">–</td>;
                        }
                        const matchColor = cell.pct >= 60 ? 'text-green-600' : cell.pct <= 40 ? 'text-red-500' : 'text-gray-600';
                        const gameColor = cell.gamePct >= 60 ? 'text-green-500' : cell.gamePct <= 40 ? 'text-red-400' : 'text-gray-500';
                        return (
                          <td key={opp.id} className="px-3 py-3 text-center">
                            <div className={`font-bold text-sm ${matchColor}`}>{cell.wins}z{cell.total} · {cell.pct ?? '–'}%</div>
                            <div className={`text-xs ${gameColor}`}>{cell.gamesWon}G · {cell.gamePct ?? '–'}%</div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-400">
              XzY = výher z celku · % = úspěšnost · G = gemy vyhrané
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
