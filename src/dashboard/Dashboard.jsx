import { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import TabNav from './components/TabNav';
import FilterBar from './components/FilterBar';
import UploadZone from './components/UploadZone';
import OverviewView from './components/views/OverviewView';
import TeamView from './components/views/TeamView';
import DetailView from './components/views/DetailView';
import RisksView from './components/views/RisksView';

function DashboardInner() {
  const { activeView, rawHodnoceni, loadDemoData, usingDemoData } = useApp();
  const [showUpload, setShowUpload] = useState(false);

  // Auto-show upload zone if no data yet
  const hasData = rawHodnoceni.length > 0;

  useEffect(() => {
    if (!hasData) setShowUpload(true);
  }, [hasData]);

  const viewMap = {
    overview: <OverviewView />,
    team: <TeamView />,
    detail: <DetailView />,
    risks: <RisksView />,
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Header onUploadClick={() => setShowUpload(true)} />

      {hasData && (
        <>
          <TabNav />
          <FilterBar />
          <main className="max-w-screen-2xl mx-auto px-6 py-8" id="dashboard-content">
            {usingDemoData && (
              <div className="mb-6 flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-[16px] text-sm">
                <span className="text-amber-500 text-lg">⚡</span>
                <span className="text-amber-700 font-medium">Demo data — nahrajte vlastní soubory pro reálný report</span>
                <button
                  onClick={() => setShowUpload(true)}
                  className="ml-auto text-xs font-semibold text-amber-700 underline"
                >
                  Nahrát data
                </button>
              </div>
            )}
            {viewMap[activeView] || <OverviewView />}
          </main>
        </>
      )}

      {showUpload && (
        <UploadZone onClose={() => { if (hasData) setShowUpload(false); }} />
      )}
    </div>
  );
}

export default function Dashboard() {
  return (
    <AppProvider>
      <DashboardInner />
    </AppProvider>
  );
}
