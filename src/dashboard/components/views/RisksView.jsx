import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import KpiCard from '../ui/KpiCard';
import PillBadge, { getRizikoPill } from '../ui/PillBadge';
import AvatarBadge from '../ui/AvatarBadge';
import { formatCurrency, formatPct, getInitials } from '../../lib/calculations';

function SectionTitle({ children }) {
  return <h2 className="text-base font-semibold text-[#0F1629] mb-4">{children}</h2>;
}

function getAkce(riziko) {
  if (riziko === 'zakázka+zákazník') return { label: 'Eskalovat', color: 'risk' };
  if (riziko === 'zákazník') return { label: 'Eskalovat', color: 'risk' };
  return { label: 'Manager review', color: 'watch' };
}

export default function RisksView() {
  const { rizikoveHovory, teamStats, obchodnikList, getObchodnikMeta } = useApp();
  const [filterRiziko, setFilterRiziko] = useState('all');
  const [filterObchodnik, setFilterObchodnik] = useState('all');

  if (!teamStats) return <div className="flex items-center justify-center h-64 text-[#9CA3AF]">Nahrajte data</div>;

  const atRisk = rizikoveHovory.filter(h => h.riziko === 'zakázka+zákazník' || h.riziko === 'zákazník');
  const underWatch = rizikoveHovory.filter(h => h.riziko === 'zakázka');
  const ohrozenaHodnota = rizikoveHovory.reduce((s, h) => s + (h.hodnota_dealu || 0), 0);

  const filtered = rizikoveHovory
    .filter(h => filterRiziko === 'all' || h.riziko === filterRiziko)
    .filter(h => filterObchodnik === 'all' || h.obchodnik === filterObchodnik)
    .sort((a, b) => {
      const order = { 'zakázka+zákazník': 0, 'zákazník': 1, 'zakázka': 2 };
      return (order[a.riziko] ?? 3) - (order[b.riziko] ?? 3);
    });

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard
          icon="🔴"
          label="Aktuálně at-risk"
          value={atRisk.length}
          color="red"
          sub="vyžaduje eskalaci"
        />
        <KpiCard
          icon="🟡"
          label="Pod dohledem"
          value={underWatch.length}
          color="amber"
          sub="manager review"
        />
        <KpiCard
          icon="💰"
          label="Ohrožená hodnota"
          value={formatCurrency(ohrozenaHodnota)}
          color="red"
        />
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm text-[#6B7280] font-medium">Typ rizika:</label>
          <select
            value={filterRiziko}
            onChange={e => setFilterRiziko(e.target.value)}
            className="border border-[#EEEFF3] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#7B3FF2] bg-white"
          >
            <option value="all">Všechna</option>
            <option value="zakázka+zákazník">Zakázka + zákazník</option>
            <option value="zákazník">Zákazník</option>
            <option value="zakázka">Zakázka</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-[#6B7280] font-medium">Obchodník:</label>
          <select
            value={filterObchodnik}
            onChange={e => setFilterObchodnik(e.target.value)}
            className="border border-[#EEEFF3] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#7B3FF2] bg-white"
          >
            <option value="all">Všichni</option>
            {obchodnikList.sort().map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <span className="text-xs text-[#9CA3AF]">{filtered.length} záznamů</span>
      </div>

      {/* Risks Table */}
      <div className="bg-white rounded-[20px] border border-[#EEEFF3] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#FAFAFC]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Datum</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Obchodník</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Zákazník</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Typ rizika</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Signál</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Hodnota</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Akce</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEEFF3]">
              {filtered.map((h, i) => {
                const d = h.datum ? new Date(h.datum) : null;
                const dateStr = d && !isNaN(d) ? `${String(d.getDate()).padStart(2,'0')}. ${String(d.getMonth()+1).padStart(2,'0')}.` : h.datum?.slice(0,5) || '—';
                const obIdx = obchodnikList.indexOf(h.obchodnik);
                const meta = getObchodnikMeta(h.obchodnik, obIdx);
                const akce = getAkce(h.riziko);
                const signal = h.poznamka_managera || h.oblasti_zlepseni?.split('|')[0] || '—';

                return (
                  <tr key={i} className="hover:bg-[#FAFAFC] transition-colors">
                    <td className="px-4 py-3 text-sm text-[#6B7280] whitespace-nowrap">{dateStr}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <AvatarBadge initials={meta.inicials || getInitials(h.obchodnik)} gradient={meta.barva} size={28} />
                        <span className="text-sm font-medium text-[#0F1629]">{h.obchodnik}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#0F1629] max-w-[160px] truncate font-medium">{h.zakaznik}</td>
                    <td className="px-4 py-3">{getRizikoPill(h.riziko)}</td>
                    <td className="px-4 py-3 text-sm text-[#6B7280] max-w-[200px]">
                      <span className="truncate block" title={signal}>{signal}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#0F1629] whitespace-nowrap font-medium">
                      {h.hodnota_dealu ? formatCurrency(h.hodnota_dealu) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <button className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                        akce.color === 'risk'
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                      }`}>
                        {akce.label}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-[#9CA3AF]">
              <div className="text-4xl mb-3">✅</div>
              <div className="font-semibold">Žádné rizikové hovory</div>
              <div className="text-sm mt-1">Skvělá práce týmu!</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
