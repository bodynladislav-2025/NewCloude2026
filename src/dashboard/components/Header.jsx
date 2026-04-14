import { useApp } from '../context/AppContext';
import { exportDashboardToPDF } from '../lib/exportPdf';
import { downloadHodnoceniTemplate } from '../lib/exportPdf';

export default function Header({ onUploadClick }) {
  const { usingDemoData, rawHodnoceni } = useApp();
  const hasData = rawHodnoceni.length > 0;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-[#EEEFF3]">
      <div className="max-w-screen-2xl mx-auto px-6 py-4 flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-base"
            style={{ background: 'linear-gradient(135deg,#E8308A,#7B3FF2)' }}
          >
            Q
          </div>
          <div>
            <div className="font-bold text-[#0F1629] text-sm leading-tight">CallQuality</div>
            <div className="text-[10px] text-[#9CA3AF] leading-tight">Dashboard</div>
          </div>
        </div>

        <div className="flex-1" />

        {usingDemoData && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-xs text-amber-700 font-medium">
            <span>Demo data</span>
          </div>
        )}

        <button
          onClick={downloadHodnoceniTemplate}
          className="hidden md:flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#0F1629] transition-colors px-3 py-2 rounded-xl hover:bg-[#FAFAFC]"
        >
          📥 Šablona
        </button>

        {hasData && (
          <button
            onClick={() => exportDashboardToPDF('dashboard-content')}
            className="flex items-center gap-1.5 text-sm font-medium text-[#7B3FF2] hover:text-[#5E29C9] px-3 py-2 rounded-xl hover:bg-[#F1EBFE] transition-colors"
          >
            <span>📊</span>
            <span className="hidden sm:inline">Export PDF</span>
          </button>
        )}

        <button
          onClick={onUploadClick}
          className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl text-white transition-all hover:opacity-90 active:scale-95"
          style={{ background: 'linear-gradient(135deg,#E8308A,#7B3FF2)' }}
        >
          <span>📂</span>
          <span className="hidden sm:inline">{hasData ? 'Aktualizovat data' : 'Nahrát data'}</span>
        </button>
      </div>
    </header>
  );
}
