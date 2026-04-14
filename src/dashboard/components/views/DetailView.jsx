import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import AvatarBadge from '../ui/AvatarBadge';
import HeatTag from '../ui/HeatTag';
import PillBadge, { getRizikoPill } from '../ui/PillBadge';
import ProgressBar from '../ui/ProgressBar';
import MoodIndicator, { MoodDelta } from '../ui/MoodIndicator';
import RadarDetailChart from '../charts/RadarDetailChart';
import DetailTrendChart from '../charts/DetailTrendChart';
import { formatScore, formatCurrency, formatPct, computeMonthlyTrend, getInitials, computeOpportunityRates } from '../../lib/calculations';

function SectionTitle({ children }) {
  return <h2 className="text-base font-semibold text-[#0F1629] mb-4">{children}</h2>;
}

function HovorModal({ hovor, onClose }) {
  if (!hovor) return null;
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-[24px] w-full max-w-lg shadow-2xl p-6 space-y-4 max-h-[80vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="font-bold text-[#0F1629]">{hovor.zakaznik}</div>
            <div className="text-xs text-[#9CA3AF]">{hovor.datum} · {hovor.typ_hovoru}</div>
          </div>
          <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#0F1629] text-2xl font-light">✕</button>
        </div>

        {hovor.essence && (
          <div>
            <div className="text-xs font-semibold text-[#6B7280] uppercase mb-1">Shrnutí hovoru</div>
            <p className="text-sm text-[#0F1629] bg-[#FAFAFC] rounded-xl p-3">{hovor.essence}</p>
          </div>
        )}

        {hovor.pochvala && (
          <div>
            <div className="text-xs font-semibold text-[#065F46] uppercase mb-1">Pochvala</div>
            <p className="text-sm text-[#065F46] bg-green-50 rounded-xl p-3">{hovor.pochvala}</p>
          </div>
        )}

        {hovor.doporuceni && (
          <div>
            <div className="text-xs font-semibold text-[#7B3FF2] uppercase mb-1">Doporučení</div>
            <div className="text-sm text-[#0F1629] bg-[#F1EBFE] rounded-xl p-3">
              {hovor.doporuceni.includes('\n')
                ? <ol className="list-decimal list-inside space-y-1">{hovor.doporuceni.split('\n').filter(Boolean).map((l, i) => <li key={i}>{l}</li>)}</ol>
                : <p>{hovor.doporuceni}</p>
              }
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="bg-[#FAFAFC] rounded-xl p-3 text-center">
            <div className="text-xs text-[#9CA3AF] mb-1">Profesionalita</div>
            <HeatTag score={hovor.profesionalita} />
          </div>
          <div className="bg-[#FAFAFC] rounded-xl p-3 text-center">
            <div className="text-xs text-[#9CA3AF] mb-1">Obchod. dovednosti</div>
            <HeatTag score={hovor.obchodni_dovednosti} />
          </div>
          <div className="bg-[#FAFAFC] rounded-xl p-3 text-center">
            <div className="text-xs text-[#9CA3AF] mb-1">Hodnota dealu</div>
            <div className="font-semibold text-sm">{hovor.hodnota_dealu ? formatCurrency(hovor.hodnota_dealu) : '—'}</div>
          </div>
          <div className="bg-[#FAFAFC] rounded-xl p-3 text-center">
            <div className="text-xs text-[#9CA3AF] mb-1">Nálada zákazníka</div>
            <MoodIndicator start={hovor.nalada_zakaznika_start} end={hovor.nalada_zakaznika_end} showDelta={false} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DetailView() {
  const { obchodnikList, byObchodnik, selectedObchodnik, setObchodnik, teamStats, monthlyTrend, filteredHovory, getObchodnikMeta, getObchodnikTrend } = useApp();
  const [selectedHovor, setSelectedHovor] = useState(null);

  const prijmeni = selectedObchodnik || obchodnikList[0];
  const obchodnikData = byObchodnik[prijmeni];
  const stats = obchodnikData?.stats;
  const meta = getObchodnikMeta(prijmeni, obchodnikList.indexOf(prijmeni));
  const trend = getObchodnikTrend(prijmeni);

  // Individual monthly trend
  const myHovory = filteredHovory.filter(h => h.obchodnik === prijmeni);
  const myMonthlyTrend = computeMonthlyTrend(myHovory);

  // Top quartile
  const allStats = obchodnikList.map((p, i) => byObchodnik[p]?.stats).filter(Boolean).sort((a, b) => b.celkove - a.celkove);
  const topQ = allStats.slice(0, Math.max(1, Math.floor(allStats.length / 4)));
  const topQAvg = topQ.length ? {
    profesionalita: topQ.reduce((s, o) => s + o.profesionalita, 0) / topQ.length,
    obchodni: topQ.reduce((s, o) => s + o.obchodni, 0) / topQ.length,
    zjistovani: topQ.reduce((s, o) => s + o.zjistovani, 0) / topQ.length,
    closing: topQ.reduce((s, o) => s + o.closing, 0) / topQ.length,
  } : null;

  const opportunity = stats ? computeOpportunityRates(myHovory) : null;

  const recentHovory = [...myHovory].sort((a, b) => new Date(b.datum) - new Date(a.datum)).slice(0, 15);

  if (!obchodnikList.length) return <div className="flex items-center justify-center h-64 text-[#9CA3AF]">Nahrajte data</div>;

  return (
    <div className="space-y-6">
      {/* Obchodnik Selector */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-semibold text-[#6B7280]">Obchodník:</label>
        <select
          value={prijmeni}
          onChange={e => setObchodnik(e.target.value)}
          className="border border-[#EEEFF3] rounded-xl px-4 py-2 text-sm font-semibold text-[#0F1629] outline-none focus:border-[#7B3FF2] bg-white"
        >
          {obchodnikList.sort().map(p => (
            <option key={p} value={p}>{byObchodnik[p]?.stats ? p : p}</option>
          ))}
        </select>
      </div>

      {stats ? (
        <>
          {/* Header Card */}
          <div className="bg-white rounded-[20px] border border-[#EEEFF3] p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <AvatarBadge initials={meta.inicials || getInitials(prijmeni)} gradient={meta.barva} size={64} />
              <div className="flex-1">
                <div className="text-xl font-bold text-[#0F1629]">{meta.jmeno_cele || prijmeni}</div>
                {meta.role && <div className="text-sm text-[#6B7280]">{meta.role}</div>}
                <div className="flex flex-wrap gap-2 mt-2">
                  <PillBadge variant="purple">{stats.pocetHovoru} hovorů</PillBadge>
                  {meta.roky_v_tymu && <PillBadge variant="blue">{meta.roky_v_tymu} let v týmu</PillBadge>}
                  {stats.rizikoveCount > 0 && <PillBadge variant="risk">{stats.rizikoveCount} rizika</PillBadge>}
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-black text-[#0F1629]">{formatScore(stats.celkove)}</div>
                <div className="text-xs text-[#9CA3AF]">Celkové skóre</div>
                {trend && (
                  <div className={`text-sm font-semibold mt-1 ${trend.positive ? 'text-green-600' : 'text-red-500'}`}>
                    {trend.label} vs min. měsíc
                  </div>
                )}
                <div className="text-2xl mt-1">{stats.status.label}</div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-[20px] border border-[#EEEFF3] p-6">
              <h2 className="text-base font-semibold text-[#0F1629] mb-4">Kompetence</h2>
              <RadarDetailChart
                obchodnikStats={stats}
                teamAvg={teamStats?.scores}
                topQuartile={topQAvg}
              />
            </div>
            <div className="lg:col-span-2 bg-white rounded-[20px] border border-[#EEEFF3] p-6">
              <h2 className="text-base font-semibold text-[#0F1629] mb-4">Individuální trend</h2>
              <DetailTrendChart data={myMonthlyTrend} obchodnik={prijmeni} teamData={monthlyTrend} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Opportunity Gap */}
            {opportunity && (
              <div className="bg-white rounded-[20px] border border-[#EEEFF3] p-6">
                <h2 className="text-base font-semibold text-[#0F1629] mb-4">Využití příležitostí</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Upsell', ...opportunity.upsell },
                    { label: 'Crosssell', ...opportunity.crosssell },
                    { label: 'Terminovaný příslib', ...opportunity.terminovany },
                    { label: 'Soft close', ...opportunity.softClose },
                  ].map(opp => (
                    <ProgressBar key={opp.label} value={opp.rate} max={100} label={opp.label} sublabel={`${opp.done}/${opp.possible} · ${formatPct(opp.rate)}`} />
                  ))}
                </div>
              </div>
            )}

            {/* Mood */}
            <div className="bg-white rounded-[20px] border border-[#EEEFF3] p-6">
              <h2 className="text-base font-semibold text-[#0F1629] mb-4">Nálada zákazníků</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6B7280]">Průměrná nálada (start)</span>
                  <span className="font-bold text-[#0F1629]">{formatScore(myHovory.reduce((s, h) => s + (h.nalada_zakaznika_start || 0), 0) / (myHovory.length || 1))}/5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6B7280]">Průměrná nálada (konec)</span>
                  <span className="font-bold text-[#0F1629]">{formatScore(myHovory.reduce((s, h) => s + (h.nalada_zakaznika_end || 0), 0) / (myHovory.length || 1))}/5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6B7280]">Průměrná změna nálady</span>
                  <span className={`font-bold ${stats.avgMoodChange >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {stats.avgMoodChange >= 0 ? '+' : ''}{formatScore(stats.avgMoodChange)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Strengths + Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-[20px] border border-[#EEEFF3] p-6">
              <h2 className="text-base font-semibold text-[#0F1629] mb-4">Silné stránky</h2>
              {stats.topSilne.length ? (
                <div className="flex flex-wrap gap-2">
                  {stats.topSilne.map(s => (
                    <span key={s} className="px-3 py-1.5 bg-green-50 text-green-700 text-sm font-medium rounded-full border border-green-100">
                      ✓ {s}
                    </span>
                  ))}
                </div>
              ) : <p className="text-sm text-[#9CA3AF]">Žádná data</p>}
            </div>
            <div className="bg-white rounded-[20px] border border-[#EEEFF3] p-6">
              <h2 className="text-base font-semibold text-[#0F1629] mb-4">Oblasti pro zlepšení</h2>
              {stats.topZlepseni.length ? (
                <div className="flex flex-wrap gap-2">
                  {stats.topZlepseni.map(s => (
                    <span key={s} className="px-3 py-1.5 bg-amber-50 text-amber-700 text-sm font-medium rounded-full border border-amber-100">
                      → {s}
                    </span>
                  ))}
                </div>
              ) : <p className="text-sm text-[#9CA3AF]">Žádná data</p>}
            </div>
          </div>

          {/* Recent Calls Table */}
          <div className="bg-white rounded-[20px] border border-[#EEEFF3] overflow-hidden">
            <div className="p-6 border-b border-[#EEEFF3]">
              <h2 className="text-base font-semibold text-[#0F1629]">Poslední hodnocené hovory</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#FAFAFC]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Datum</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Zákazník</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Typ</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Profes.</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Obchod.</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Nálada</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Riziko</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase">Hodnota</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EEEFF3]">
                  {recentHovory.map((h, i) => {
                    const d = h.datum ? new Date(h.datum) : null;
                    const dateStr = d && !isNaN(d) ? `${String(d.getDate()).padStart(2,'0')}. ${String(d.getMonth()+1).padStart(2,'0')}.` : h.datum?.slice(0,5) || '—';
                    return (
                      <tr
                        key={i}
                        className="hover:bg-[#FAFAFC] cursor-pointer transition-colors"
                        onClick={() => setSelectedHovor(h)}
                      >
                        <td className="px-4 py-3 text-sm text-[#6B7280] whitespace-nowrap">{dateStr}</td>
                        <td className="px-4 py-3 text-sm font-medium text-[#0F1629] max-w-[160px] truncate">{h.zakaznik}</td>
                        <td className="px-4 py-3"><PillBadge variant="gray">{h.typ_hovoru}</PillBadge></td>
                        <td className="px-4 py-3"><HeatTag score={h.profesionalita} /></td>
                        <td className="px-4 py-3"><HeatTag score={h.obchodni_dovednosti} /></td>
                        <td className="px-4 py-3"><MoodDelta start={h.nalada_zakaznika_start} end={h.nalada_zakaznika_end} /></td>
                        <td className="px-4 py-3">{getRizikoPill(h.riziko) || <span className="text-gray-300">—</span>}</td>
                        <td className="px-4 py-3 text-sm text-[#6B7280] whitespace-nowrap">{h.hodnota_dealu ? formatCurrency(h.hodnota_dealu) : '—'}</td>
                        <td className="px-4 py-3 text-[#9CA3AF]">→</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-48 text-[#9CA3AF]">Pro tohoto obchodníka nejsou k dispozici data</div>
      )}

      {selectedHovor && <HovorModal hovor={selectedHovor} onClose={() => setSelectedHovor(null)} />}
    </div>
  );
}
