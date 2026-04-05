import { useState } from 'react';
import { useAppData } from './hooks/useAppData';
import Header from './components/Header';
import Nav from './components/Nav';
import Home from './sections/Home';
import History from './sections/History';
import Players from './sections/Players';
import Stats from './sections/Stats';

export default function App() {
  const {
    players, matches, loading, error,
    addPlayer, updatePlayer, deletePlayer, setPlayerAsMe,
    addMatch, updateMatch, deleteMatch,
  } = useAppData();

  const [activeTab, setActiveTab] = useState('home');
  const [editingMatch, setEditingMatch] = useState(null);

  const handleSetActiveTab = (tab) => {
    setActiveTab(tab);
    if (tab !== 'home') setEditingMatch(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🎾</div>
          <div className="text-green-700 font-semibold text-lg">Načítám data…</div>
          <div className="text-gray-400 text-sm mt-1">Připojuji se k databázi</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow p-6 max-w-sm text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <div className="text-red-600 font-semibold mb-2">Chyba připojení</div>
          <div className="text-gray-500 text-sm mb-4">{error}</div>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-green-500 text-white rounded-xl font-medium">
            Zkusit znovu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <Nav active={activeTab} setActive={handleSetActiveTab} />

      <main className="flex-1 py-6">
        {activeTab === 'home' && (
          <Home
            players={players}
            matches={matches}
            addMatch={addMatch}
            updateMatch={updateMatch}
            editingMatch={editingMatch}
            setEditingMatch={setEditingMatch}
            setActiveTab={handleSetActiveTab}
          />
        )}
        {activeTab === 'stats' && (
          <Stats players={players} matches={matches} setActiveTab={handleSetActiveTab} />
        )}
        {activeTab === 'history' && (
          <History
            players={players}
            matches={matches}
            deleteMatch={deleteMatch}
            setEditingMatch={setEditingMatch}
            setActiveTab={handleSetActiveTab}
          />
        )}
        {activeTab === 'players' && (
          <Players
            players={players}
            matches={matches}
            addPlayer={addPlayer}
            updatePlayer={updatePlayer}
            deletePlayer={deletePlayer}
            setPlayerAsMe={setPlayerAsMe}
          />
        )}
      </main>

      <footer className="text-center py-4 text-xs text-gray-400 border-t border-gray-100 bg-white">
        🎾 Master of Tenis · Data synchronizována v cloudu
      </footer>
    </div>
  );
}
