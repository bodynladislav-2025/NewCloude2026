import AddMatch from './AddMatch';

const tiles = [
  { id: 'stats',   icon: '📊', label: 'Statistiky',  desc: 'Pořadí, grafy, H2H' },
  { id: 'history', icon: '📋', label: 'Historie',     desc: 'Všechny odehrané zápasy' },
  { id: 'players', icon: '👥', label: 'Hráči',        desc: 'Správa hráčů' },
];

export default function Home({ players, matches, addMatch, updateMatch, editingMatch, setEditingMatch, setActiveTab }) {
  return (
    <div className="max-w-lg mx-auto px-4 pb-8">

      {/* Hero */}
      <div className="text-center py-8">
        <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center text-4xl shadow-lg mx-auto mb-4">
          🎾
        </div>
        <h1 className="text-2xl font-extrabold text-green-800 leading-tight">Master of Tenis</h1>
        <p className="text-sm text-green-600 font-medium mt-1">Tenisová škola Ladislava Bodyna</p>
        {matches.length > 0 && (
          <p className="text-xs text-gray-400 mt-2">
            {matches.length} {matches.length === 1 ? 'zápas' : matches.length < 5 ? 'zápasy' : 'zápasů'} · {players.length} hráčů
          </p>
        )}
      </div>

      {/* Navigační dlaždice */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {tiles.map((tile) => (
          <button
            key={tile.id}
            onClick={() => setActiveTab(tile.id)}
            className="bg-white rounded-2xl border border-green-100 shadow-sm p-4 flex flex-col items-center gap-2 hover:border-green-300 hover:shadow-md transition-all active:scale-95"
          >
            <span className="text-3xl">{tile.icon}</span>
            <span className="font-bold text-gray-800 text-sm">{tile.label}</span>
            <span className="text-xs text-gray-400 text-center leading-tight">{tile.desc}</span>
          </button>
        ))}
      </div>

      {/* Oddělovač */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-sm font-semibold text-gray-400">Přidat zápas</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Formulář přidání zápasu */}
      <AddMatch
        players={players}
        matches={matches}
        addMatch={addMatch}
        updateMatch={updateMatch}
        editingMatch={editingMatch}
        setEditingMatch={setEditingMatch}
        setActiveTab={setActiveTab}
        embedded
      />
    </div>
  );
}
