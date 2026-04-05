import { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import Header from './components/Header';
import Nav from './components/Nav';
import AddMatch from './sections/AddMatch';
import History from './sections/History';
import Players from './sections/Players';
import Stats from './sections/Stats';

export default function App() {
  const [players, setPlayers] = useLocalStorage('tennis_players', []);
  const [matches, setMatches] = useLocalStorage('tennis_matches', []);
  const [activeTab, setActiveTab] = useState('add');
  const [editingMatch, setEditingMatch] = useState(null);

  const handleSetActiveTab = (tab) => {
    setActiveTab(tab);
    if (tab !== 'add') setEditingMatch(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <Nav active={activeTab} setActive={handleSetActiveTab} />

      <main className="flex-1 py-6">
        {activeTab === 'add' && (
          <AddMatch
            players={players}
            matches={matches}
            setMatches={setMatches}
            editingMatch={editingMatch}
            setEditingMatch={setEditingMatch}
            setActiveTab={handleSetActiveTab}
          />
        )}
        {activeTab === 'stats' && (
          <Stats
            players={players}
            matches={matches}
            setActiveTab={handleSetActiveTab}
          />
        )}
        {activeTab === 'history' && (
          <History
            players={players}
            matches={matches}
            setMatches={setMatches}
            setEditingMatch={setEditingMatch}
            setActiveTab={handleSetActiveTab}
          />
        )}
        {activeTab === 'players' && (
          <Players
            players={players}
            setPlayers={setPlayers}
            matches={matches}
          />
        )}
      </main>

      <footer className="text-center py-4 text-xs text-gray-400 border-t border-gray-100 bg-white">
        🎾 TenisStats · Data uložena lokálně v prohlížeči
      </footer>
    </div>
  );
}
