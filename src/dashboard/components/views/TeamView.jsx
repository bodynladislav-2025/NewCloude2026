import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import HeatTag from '../ui/HeatTag';
import PillBadge from '../ui/PillBadge';
import AvatarBadge from '../ui/AvatarBadge';
import RadarTeamChart from '../charts/RadarTeamChart';
import DistributionChart from '../charts/DistributionChart';
import { formatScore, formatCurrency, formatPct, getInitials, computeScoreDistribution } from '../../lib/calculations';

function SectionTitle({ children }) {
  return <h2 className="text-base font-semibold text-[#0F1629] mb-4">{children}</h2>;
}

const OPP_COLOR = (rate) => {
  if (rate >= 45) return 'ok';
  if (rate >= 35) return 'ok';
  if (rate >= 28) return 'watch';
  return 'watch';
};

export default function TeamView() {
  const { byObchodnik, obchodnikList, teamStats, filteredHovory, setView, setObchodnik, getObchodnikMeta, getObchodnikTrend } = useApp();
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('celkove');
  const [sortDir, setSortDir] = useState('desc');

  if (!teamStats) return <div className="flex items-center justify-center h-64 text-[#9CA3AF]">Nahrajte data</div>;

  const rows = obchodnikList
    .filter(p => p.toLowerCase().includes(search.toLowerCase()))
    .map((p, i) => ({
      prijmeni: p,
      meta: getObchodnikMeta(p, i),
      stats: byObchodnik[p]?.stats,
      trend: getObchodnikTrend(p),
    }))
    .filter(o => o.stats);

  const sorted = [...rows].sort((a, b) => {
    let av = a.stats[sortKey] ?? 0;
    let bv = b.stats[sortKey] ?? 0;
    if (sortKey === 'rizikoveCount') { av = a.stats.rizikoveCount; bv = b.stats.rizikoveCount; }
    if (sortKey === 'overallOpportunity') { av = a.stats.overallOpportunity; bv = b.stats.overallOpportunity; }
    return sortDir === 'desc' ? bv - av : av - bv;
  });

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const SortHead = ({ col, label }) => (
    <th
      className="px-3 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wide cursor-pointer hover:text-[#0F1629] select-none whitespace-nowrap"
      onClick={() => handleSort(col)}
    >
      {label} {sortKey === col ? (sortDir === 'desc' ? '↓' : '↑') : ''}
    </th>
  );

  // Top quartile for radar
  const topQ = [...rows].sort((a, b) => b.stats.celkove - a.stats.celkove).slice(0, Math.max(1, Math.floor(rows.length / 4)));
  const topQAvg = topQ.length ? {
    profesionalita: topQ.reduce((s, o) => s + o.stats.profesionalita, 0) / topQ.length,
    obchodni: topQ.reduce((s, o) => s + o.stats.obchodni, 0) / topQ.length,
    zjistovani: topQ.reduce((s, o) => s + o.stats.zjistovani, 0) / topQ.length,
    closing: topQ.reduce((s, o) => s + o.stats.closing, 0) / topQ.length,
  } : null;

  const distribution = computeScoreDistribution(filteredHovory);

  return (
    <div className="space-y-8">
      {/* Search + Table */}
      <div className="bg-white rounded-[20px] border border-[#EEEFF3] overflow-hidden">
        <div className="p-6 border-b border-[#EEEFF3] flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <SectionTitle>Srovnání obchodníků</SectionTitle>
          <input
            type="text"
            placeholder="Hledat obchodníka..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-[#EEEFF3] rounded-xl px-3 py-2 text-sm w-full sm:w-64 outline-none focus:border-[#7B3FF2]"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#FAFAFC]">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Obchodník</th>
                <SortHead col="pocetHovoru" label="Hovorů" />
                <SortHead col="profesionalita" label="Profes." />
                <SortHead col="obchodni" label="Obchod." />
                <SortHead col="zjistovani" label="Zjišť. potřeb" />
                <SortHead col="closing" label="Closing" />
                <SortHead col="overallOpportunity" label="Využ. přílež." />
                <SortHead col="rizikoveCount" label="Rizika" />
                <SortHead col="hodnotaDealu" label="Ø hodnota" />
                <th className="px-3 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Stav</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEEFF3]">
              {sorted.map((o) => {
                const rizikoPill = o.stats.rizikoveCount === 0 ? 'ok' : o.stats.rizikoveCount === 1 ? 'watch' : 'risk';
                return (
                  <tr
                    key={o.prijmeni}
                    className="hover:bg-[#FAFAFC] cursor-pointer transition-colors"
                    onClick={() => { setView('detail'); setObchodnik(o.prijmeni); }}
                  >
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <AvatarBadge initials={o.meta.inicials || getInitials(o.prijmeni)} gradient={o.meta.barva} size={32} />
                        <div>
                          <div className="font-semibold text-[#0F1629] text-sm">{o.meta.jmeno_cele || o.prijmeni}</div>
                          {o.trend && (
                            <div className={`text-xs ${o.trend.positive ? 'text-green-600' : 'text-red-500'}`}>
                              {o.trend.label} vs minulý měsíc
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm text-[#6B7280]">{o.stats.pocetHovoru}</td>
                    <td className="px-3 py-3"><HeatTag score={o.stats.profesionalita} /></td>
                    <td className="px-3 py-3"><HeatTag score={o.stats.obchodni} /></td>
                    <td className="px-3 py-3"><HeatTag score={o.stats.zjistovani} /></td>
                    <td className="px-3 py-3"><HeatTag score={o.stats.closing} /></td>
                    <td className="px-3 py-3">
                      <PillBadge variant={OPP_COLOR(o.stats.overallOpportunity)}>
                        {formatPct(o.stats.overallOpportunity)}
                      </PillBadge>
                    </td>
                    <td className="px-3 py-3">
                      <PillBadge variant={rizikoPill}>{o.stats.rizikoveCount}</PillBadge>
                    </td>
                    <td className="px-3 py-3 text-sm text-[#6B7280] whitespace-nowrap">
                      {o.stats.hodnotaDealu ? formatCurrency(o.stats.hodnotaDealu) : '—'}
                    </td>
                    <td className="px-3 py-3 text-lg">{o.stats.status.label}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {sorted.length === 0 && (
            <div className="text-center py-8 text-[#9CA3AF]">Žádný obchodník nenalezen</div>
          )}
        </div>
      </div>

      {/* Radar + Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-[20px] border border-[#EEEFF3] p-6">
          <SectionTitle>Tým průměr vs top kvartil</SectionTitle>
          <RadarTeamChart teamAvg={teamStats.scores} topQuartile={topQAvg} />
        </div>
        <div className="bg-white rounded-[20px] border border-[#EEEFF3] p-6">
          <SectionTitle>Distribuce skóre obchodníků</SectionTitle>
          <DistributionChart data={distribution} />
        </div>
      </div>
    </div>
  );
}
