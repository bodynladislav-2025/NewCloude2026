const tabs = [
  { id: 'home',    label: 'Domů',      icon: '🏠' },
  { id: 'stats',   label: 'Statistiky', icon: '📊' },
  { id: 'history', label: 'Historie',   icon: '📋' },
  { id: 'players', label: 'Hráči',      icon: '👥' },
];

export default function Nav({ active, setActive }) {
  return (
    <nav className="bg-white border-b border-green-100 sticky top-0 z-10 shadow-sm">
      <div className="max-w-5xl mx-auto px-2">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                active === tab.id
                  ? 'border-green-500 text-green-700'
                  : 'border-transparent text-gray-500 hover:text-green-600 hover:border-green-200'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
