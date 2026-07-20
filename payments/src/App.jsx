import { useState } from 'react';
import { CalendarDays, LockKeyhole, Repeat, Table2 } from 'lucide-react';
import { APP_PIN } from './config';
import LockScreen from './components/LockScreen';
import MonthView from './sections/MonthView';
import TemplatesView from './sections/TemplatesView';
import YearView from './sections/YearView';

const PIN_STORAGE_KEY = 'payments_pin';

const TABS = [
  { id: 'month', label: 'Měsíc', icon: CalendarDays },
  { id: 'templates', label: 'Šablona', icon: Repeat },
  { id: 'year', label: 'Rok', icon: Table2 },
];

export default function App() {
  const [unlocked, setUnlocked] = useState(
    () => localStorage.getItem(PIN_STORAGE_KEY) === APP_PIN
  );
  const [tab, setTab] = useState('month');

  const now = new Date();
  const current = { year: now.getFullYear(), month: now.getMonth() + 1 };
  const [view, setView] = useState(current);

  if (!unlocked) {
    return (
      <LockScreen
        onUnlock={(pin) => {
          localStorage.setItem(PIN_STORAGE_KEY, pin);
          setUnlocked(true);
        }}
      />
    );
  }

  const shift = (delta) => {
    setView(({ year, month }) => {
      const d = new Date(year, month - 1 + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() + 1 };
    });
  };

  return (
    <div className="min-h-dvh bg-slate-100 pb-6">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold text-slate-900">Měsíční platby</h1>
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem(PIN_STORAGE_KEY);
              setUnlocked(false);
            }}
            aria-label="Zamknout aplikaci"
            className="rounded-xl p-2 text-slate-400 active:text-slate-700"
          >
            <LockKeyhole size={18} />
          </button>
        </div>
        <nav className="mx-auto flex max-w-lg gap-1 px-4 pb-2">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-medium transition-colors ${
                tab === id ? 'bg-slate-900 text-white' : 'text-slate-600 active:bg-slate-100'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-lg px-4 pt-3">
        {tab === 'month' && (
          <MonthView
            year={view.year}
            month={view.month}
            isCurrentMonth={view.year === current.year && view.month === current.month}
            onPrev={() => shift(-1)}
            onNext={() => shift(1)}
            onToday={() => setView(current)}
          />
        )}
        {tab === 'templates' && <TemplatesView />}
        {tab === 'year' && (
          <YearView
            onOpenMonth={(year, month) => {
              setView({ year, month });
              setTab('month');
            }}
          />
        )}
      </main>
    </div>
  );
}
