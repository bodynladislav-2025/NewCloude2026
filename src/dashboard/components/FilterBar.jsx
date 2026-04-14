import { useApp } from '../context/AppContext';

const PERIODS = [
  { key: '7d', label: '7 dní' },
  { key: '30d', label: '30 dní' },
  { key: '90d', label: '90 dní' },
  { key: 'quarter', label: 'Kvartál' },
  { key: 'year', label: 'Rok' },
];

const SEGMENTS = ['all', 'Enterprise', 'Mid-market', 'SME'];
const TYPY = ['all', 'Akvizice', 'Péče', 'Reklamace', 'Uzavírání'];

export default function FilterBar() {
  const { filterPeriod, filterSegment, filterTypHovoru, setFilterPeriod, setFilterSegment, setFilterTyp } = useApp();

  return (
    <div className="bg-white border-b border-[#EEEFF3]">
      <div className="max-w-screen-2xl mx-auto px-6 py-3 flex flex-wrap gap-4 items-center">
        {/* Period filter */}
        <div className="flex gap-1 bg-[#FAFAFC] rounded-xl p-1">
          {PERIODS.map(p => (
            <button
              key={p.key}
              onClick={() => setFilterPeriod(p.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterPeriod === p.key
                  ? 'bg-white text-[#7B3FF2] shadow-sm'
                  : 'text-[#6B7280] hover:text-[#0F1629]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <select
          value={filterSegment}
          onChange={e => setFilterSegment(e.target.value)}
          className="border border-[#EEEFF3] rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-[#7B3FF2] bg-white text-[#6B7280]"
        >
          <option value="all">Všechny segmenty</option>
          {SEGMENTS.slice(1).map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select
          value={filterTypHovoru}
          onChange={e => setFilterTyp(e.target.value)}
          className="border border-[#EEEFF3] rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-[#7B3FF2] bg-white text-[#6B7280]"
        >
          <option value="all">Všechny typy hovorů</option>
          {TYPY.slice(1).map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
    </div>
  );
}
