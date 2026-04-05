import { useMemo, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList,
} from 'recharts';
import { computePlayerStats, computeHeadToHead } from '../utils/stats';
import EmptyState from '../components/EmptyState';

const BAR_COLORS = ['#4CAF50', '#2196F3', '#FF9800', '#E91E63', '#9C27B0', '#00BCD4'];

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

  // Pouze hráč označený jako "já"
  const me = stats.find((s) => s.isMe);

  // Graf: Láďovy % proti každému soupeři (bez Ládi)
  const chartData = useMemo(() => {
    if (!me) return [];
    return players
      .filter((p) => !p.isMe && h2h[me.id]?.[p.id]?.total > 0)
      .map((opp, i) => {
        const cell = h2h[me.id][opp.id];
        return {
          name: opp.name,
          pct: cell.pct ?? 0,
          gamePct: cell.gamePct ?? 0,
          color: BAR_COLORS[i % BAR_COLORS.length],
        };
      })
      .sort((a, b) => b[chartMetric] - a[chartMetric]);
  }, [me, players, h2h, chartMetric]);

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
        action={{ label: 'Přidat první zápas', onClick: () => setActiveTab('home') }}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">

      {/* === Moje statistiky === */}
      {me && (
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">🏆 Moje statistiky</h2>
          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 shadow-sm p-4 fade-in">

            {/* Hlavička */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🥇</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-800 text-lg">{me.name}</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">já</span>
                </div>
                <div className="text-xs text-gray-500">
                  {me.wins}V / {me.losses}P / {me.total - me.wins - me.losses}R · celkem {me.total} {me.total === 1 ? 'den' : me.total < 5 ? 'dny' : 'dní'}
                </div>
              </div>
            </div>

            {/* Celkové % */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white/80 rounded-xl px-3 py-2">
                <div className="text-xs font-semibold text-gray-500 mb-1">% vyhraných dní</div>
                <PctBar value={me.pct} color="#FFD700" />
                <div className="text-xs text-gray-400 mt-0.5">{me.wins} výher z {me.total} dní</div>
              </div>
              <div className="bg-white/80 rounded-xl px-3 py-2">
                <div className="text-xs font-semibold text-gray-500 mb-1">% vyhraných zápasů</div>
                <PctBar value={me.gamePct} color="#FFD700" />
                <div className="text-xs text-gray-400 mt-0.5">{me.gamesWon} zápasů z {me.totalGames} celkem</div>
              </div>
            </div>

            {/* Výsledky vs každý soupeř */}
            {players.filter((p) => !p.isMe && h2h[me.id]?.[p.id]?.total > 0).length > 0 && (
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Výsledky proti soupeřům</div>
                <div className="space-y-2">
                  {players
                    .filter((p) => !p.isMe && h2h[me.id]?.[p.id]?.total > 0)
                    .map((opp) => {
                      const cell = h2h[me.id][opp.id];
                      const matchColor = cell.pct >= 60 ? '#4CAF50' : cell.pct !== null && cell.pct <= 40 ? '#ef4444' : '#9E9E9E';
                      const gameColor = cell.gamePct >= 60 ? '#4CAF50' : cell.gamePct !== null && cell.gamePct <= 40 ? '#ef4444' : '#9E9E9E';
                      return (
                        <div key={opp.id} className="bg-white/80 rounded-xl px-3 py-2.5">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-gray-700 text-sm">vs {opp.name}</span>
                            <span className="text-xs text-gray-400">
                              {cell.total} {cell.total === 1 ? 'den' : cell.total < 5 ? 'dny' : 'dní'}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <div className="text-xs text-gray-400 mb-1">% vyhraných dní</div>
                              <PctBar value={cell.pct} color={matchColor} />
                              <div className="text-xs text-gray-400 mt-0.5">{cell.wins}V z {cell.total}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-400 mb-1">% vyhraných zápasů</div>
                              <PctBar value={cell.gamePct} color={gameColor} />
                              <div className="text-xs text-gray-400 mt-0.5">{cell.gamesWon} z {cell.gamesWon + cell.gamesLost}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* === Graf — Láďovy % proti soupeřům === */}
      {chartData.length > 0 && (
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-800">📊 Moje úspěšnost proti soupeřům</h2>
          <div className="flex bg-gray-100 rounded-xl p-1 text-xs font-semibold">
            <button
              onClick={() => setChartMetric('pct')}
              className={`px-3 py-1.5 rounded-lg transition-all ${chartMetric === 'pct' ? 'bg-white shadow text-green-700' : 'text-gray-500'}`}
            >
              % dní
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
          <div className="text-xs text-gray-400 mb-3 text-center">
            {chartMetric === 'pct' ? 'Vyhraných dní / celkem dní vs daný soupeř' : 'Vyhraných zápasů / celkem zápasů vs daný soupeř'}
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 13, fontWeight: 600, fill: '#555' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11, fill: '#aaa' }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(value) => [`${value}%`, chartMetric === 'pct' ? '% vyhraných dní' : '% vyhraných zápasů']}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '13px' }}
                cursor={{ fill: 'rgba(0,0,0,0.04)' }}
              />
              <Bar dataKey={chartMetric} radius={[8, 8, 0, 0]} maxBarSize={70}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
                <LabelList
                  dataKey={chartMetric}
                  position="top"
                  formatter={(v) => v > 0 ? `${v}%` : ''}
                  style={{ fontSize: '12px', fontWeight: 700, fill: '#555' }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
      )}

    </div>
  );
}
