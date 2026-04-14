import { useApp } from '../context/AppContext';

const TABS = [
  { key: 'overview', label: 'Přehled vedení', icon: '📊' },
  { key: 'team', label: 'Srovnání obchodníků', icon: '👥' },
  { key: 'detail', label: 'Detail obchodníka', icon: '👤' },
  { key: 'risks', label: 'Rizikové hovory', icon: '⚠️' },
];

export default function TabNav() {
  const { activeView, setView, rizikoveHovory } = useApp();

  return (
    <div className="bg-white border-b border-[#EEEFF3] sticky top-[69px] z-30">
      <div className="max-w-screen-2xl mx-auto px-6">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {TABS.map(tab => {
            const isActive = activeView === tab.key;
            const badge = tab.key === 'risks' && rizikoveHovory?.length > 0 ? rizikoveHovory.length : null;
            return (
              <button
                key={tab.key}
                onClick={() => setView(tab.key)}
                className={`relative flex items-center gap-2 px-4 py-4 text-sm font-medium transition-all whitespace-nowrap border-b-2 -mb-px ${
                  isActive
                    ? 'border-[#7B3FF2] text-[#7B3FF2]'
                    : 'border-transparent text-[#6B7280] hover:text-[#0F1629] hover:border-[#EEEFF3]'
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
                {badge && (
                  <span className="bg-red-100 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
