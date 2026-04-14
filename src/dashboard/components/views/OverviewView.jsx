import { useApp } from '../../context/AppContext';
import KpiCard from '../ui/KpiCard';
import InsightCard from '../ui/InsightCard';
import ProgressBar from '../ui/ProgressBar';
import AvatarBadge from '../ui/AvatarBadge';
import ScoreTrendChart from '../charts/ScoreTrendChart';
import RiskChart from '../charts/RiskChart';
import {
  formatScore, formatCurrency, formatPct,
  groupByObchodnik, computeObchodnikStats,
  enrichObchodnikData, getInitials,
} from '../../lib/calculations';

function SectionTitle({ children }) {
  return <h2 className="text-base font-semibold text-[#0F1629] mb-4">{children}</h2>;
}

export default function OverviewView() {
  const {
    teamStats, filteredHovory, monthlyTrend, insights,
    rawObchodnici, setView, setObchodnik, byObchodnik, obchodnikList,
    getObchodnikMeta, getObchodnikTrend,
  } = useApp();

  if (!teamStats) {
    return <div className="flex items-center justify-center h-64 text-[#9CA3AF]">Nahrajte data pro zobrazení dashboardu</div>;
  }

  const { scores, totalHovory, rizikoveCount, rizikovePercent, risikovaHodnota, opportunity } = teamStats;

  const obchodniciStats = obchodnikList.map((p, i) => ({
    prijmeni: p,
    meta: getObchodnikMeta(p, i),
    stats: byObchodnik[p]?.stats,
    trend: getObchodnikTrend(p),
  })).filter(o => o.stats);

  const sorted = [...obchodniciStats].sort((a, b) => b.stats.celkove - a.stats.celkove);
  const top3 = sorted.slice(0, 3);
  const bottom3 = sorted.slice(-3).reverse();

  // Top quartile for current period
  const topQ = sorted.slice(0, Math.max(1, Math.floor(sorted.length / 4)));
  const topQAvg = {
    profesionalita: topQ.reduce((s, o) => s + o.stats.profesionalita, 0) / topQ.length,
    obchodni: topQ.reduce((s, o) => s + o.stats.obchodni, 0) / topQ.length,
  };

  const oppData = [
    { label: 'Upsell', ...opportunity.upsell },
    { label: 'Crosssell', ...opportunity.crosssell },
    { label: 'Terminovaný příslib', ...opportunity.terminovany },
    { label: 'Soft close', ...opportunity.softClose },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div
        className="rounded-[24px] p-8 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#E8308A 0%,#7B3FF2 50%,#3B7BE8 100%)' }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Kvalita hovorů obchodního týmu</h1>
            <p className="text-white/80 text-sm">
              {obchodnikList.length} obchodníků · {totalHovory} hodnocených hovorů
            </p>
          </div>
          <div className="text-right">
            <div className="text-6xl font-black">{formatScore(scores.celkove)}<span className="text-2xl font-normal opacity-70">/5</span></div>
            <div className="text-white/70 text-sm mt-1">Celkové skóre týmu</div>
          </div>
        </div>
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute -bottom-12 -left-4 w-52 h-52 rounded-full bg-white/5" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KpiCard icon="⭐" label="Profesionalita" value={formatScore(scores.profesionalita)} color="magenta" target="4,0" />
        <KpiCard icon="💼" label="Obchodní dovednosti" value={formatScore(scores.obchodni)} color="purple" target="4,0" />
        <KpiCard
          icon="🎯"
          label="Využití příležitostí"
          value={formatPct((opportunity.upsell.rate + opportunity.crosssell.rate + opportunity.softClose.rate) / 3)}
          color="blue"
        />
        <KpiCard
          icon="⚡"
          label="Rizikové zakázky"
          value={rizikoveCount}
          sub={formatPct(rizikovePercent) + ' hovorů'}
          color={rizikoveCount > 5 ? 'red' : 'amber'}
        />
        <KpiCard
          icon="🔥"
          label="Ohrožená hodnota"
          value={formatCurrency(risikovaHodnota)}
          color="red"
          sub="vyžaduje eskalaci"
        />
        <KpiCard icon="📋" label="Hodnocených hovorů" value={totalHovory} color="green" sub={`${obchodnikList.length} obchodníků`} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-[20px] border border-[#EEEFF3] p-6">
          <SectionTitle>Vývoj skóre v čase</SectionTitle>
          <ScoreTrendChart data={monthlyTrend} lines={['profesionalita', 'obchodni', 'celkove']} />
        </div>
        <div className="bg-white rounded-[20px] border border-[#EEEFF3] p-6">
          <SectionTitle>Rizika v čase</SectionTitle>
          <RiskChart data={monthlyTrend} />
        </div>
      </div>

      {/* AI Insights */}
      <div>
        <SectionTitle>AI přehledy</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights.map((ins, i) => (
            <InsightCard key={i} {...ins} />
          ))}
        </div>
      </div>

      {/* Opportunity Gap */}
      <div className="bg-white rounded-[20px] border border-[#EEEFF3] p-6">
        <SectionTitle>Využití prodejních příležitostí — tým</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {oppData.map(opp => (
            <div key={opp.label}>
              <ProgressBar
                value={opp.rate}
                max={100}
                label={opp.label}
                sublabel={`${opp.done}/${opp.possible} · ${formatPct(opp.rate)}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Top / Bottom */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-[20px] border border-[#EEEFF3] p-6">
          <SectionTitle>Top 3 obchodníci</SectionTitle>
          <div className="space-y-4">
            {top3.map((o, i) => (
              <button
                key={o.prijmeni}
                onClick={() => { setView('detail'); setObchodnik(o.prijmeni); }}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#FAFAFC] transition-colors text-left"
              >
                <span className="text-xl font-black text-[#EEEFF3]">#{i + 1}</span>
                <AvatarBadge initials={o.meta.inicials || getInitials(o.prijmeni)} gradient={o.meta.barva} size={36} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[#0F1629] text-sm">{o.meta.jmeno_cele || o.prijmeni}</div>
                  <div className="text-xs text-[#9CA3AF]">{o.stats.pocetHovoru} hovorů</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[#0F1629]">{formatScore(o.stats.celkove)}</div>
                  {o.trend && (
                    <div className={`text-xs ${o.trend.positive ? 'text-green-600' : 'text-red-500'}`}>
                      {o.trend.label}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[20px] border border-[#EEEFF3] p-6">
          <SectionTitle>Potřebuje koučink</SectionTitle>
          <div className="space-y-4">
            {bottom3.map((o) => (
              <button
                key={o.prijmeni}
                onClick={() => { setView('detail'); setObchodnik(o.prijmeni); }}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#FAFAFC] transition-colors text-left"
              >
                <AvatarBadge initials={o.meta.inicials || getInitials(o.prijmeni)} gradient={o.meta.barva} size={36} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[#0F1629] text-sm">{o.meta.jmeno_cele || o.prijmeni}</div>
                  <div className="text-xs text-[#EF4444] truncate">
                    {o.stats.topZlepseni[0] || 'Celkové skóre pod průměrem'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[#EF4444]">{formatScore(o.stats.celkove)}</div>
                  {o.trend && (
                    <div className={`text-xs ${o.trend.positive ? 'text-green-600' : 'text-red-500'}`}>
                      {o.trend.label}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
