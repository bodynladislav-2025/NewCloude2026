import { useState, useRef, useCallback } from 'react';
import { useApp } from '../context/AppContext';

function UploadSlot({ id, label, desc, icon, required, file, onFile, error }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(e => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) onFile(f);
  }, [onFile]);

  const statusIcon = file ? '✅' : error ? '❌' : null;

  return (
    <div
      className={`relative border-2 border-dashed rounded-[20px] p-6 text-center transition-all cursor-pointer ${
        dragging ? 'border-[#7B3FF2] bg-[#F1EBFE]' : file ? 'border-green-400 bg-green-50' : error ? 'border-red-300 bg-red-50' : 'border-[#EEEFF3] hover:border-[#7B3FF2] hover:bg-[#FAFAFC]'
      }`}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        className="hidden"
        onChange={e => { if (e.target.files[0]) onFile(e.target.files[0]); }}
      />
      <div className="text-3xl mb-3">{statusIcon || icon}</div>
      <div className="font-semibold text-[#0F1629] text-sm">
        {label}
        {required && <span className="text-[#E8308A] ml-1">*</span>}
      </div>
      {file ? (
        <div className="mt-2 text-xs text-green-700 font-medium truncate max-w-full">{file.name}</div>
      ) : (
        <div className="mt-1 text-xs text-[#9CA3AF]">{desc}</div>
      )}
      {error && <div className="mt-2 text-xs text-red-600">{error}</div>}
      {!file && <div className="mt-3 text-xs text-[#9CA3AF]">Přetáhněte nebo klikněte</div>}
    </div>
  );
}

export default function UploadZone({ onClose }) {
  const { loadFiles, loadDemoData, uploadError, isLoading } = useApp();
  const [aktivityFile, setAktivityFile] = useState(null);
  const [hodnoceniFile, setHodnoceniFile] = useState(null);
  const [obchodniciFile, setObchodniciFile] = useState(null);

  const canSubmit = !!(aktivityFile || hodnoceniFile || obchodniciFile) && !isLoading;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    await loadFiles(aktivityFile, hodnoceniFile, obchodniciFile);
    if (!uploadError) onClose?.();
  };

  const handleDemo = () => {
    loadDemoData();
    onClose?.();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[28px] w-full max-w-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg,#E8308A,#7B3FF2)' }}
          >
            Q
          </div>
          <h1 className="text-2xl font-bold text-[#0F1629]">CallQuality Dashboard</h1>
          <p className="text-[#6B7280] mt-2 text-sm">Nahrajte soubory pro generování interaktivního reportu</p>
        </div>

        {/* Upload Slots */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <UploadSlot
            id="aktivity"
            label="aktivity.csv"
            desc="Export aktivit z CRM"
            icon="📋"
            required={false}
            file={aktivityFile}
            onFile={setAktivityFile}
          />
          <UploadSlot
            id="hodnoceni"
            label="hodnoceni.xlsx"
            desc="Hodnocení hovorů"
            icon="⭐"
            required={false}
            file={hodnoceniFile}
            onFile={setHodnoceniFile}
          />
          <UploadSlot
            id="obchodnici"
            label="obchodnici.xlsx"
            desc="Kmenová data obchodníků"
            icon="👥"
            required={false}
            file={obchodniciFile}
            onFile={setObchodniciFile}
          />
        </div>

        <p className="text-center text-xs text-[#9CA3AF] mb-6">
          Nahrajte jeden nebo více souborů — všechna pole jsou volitelná
        </p>

        {uploadError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-sm text-red-700 text-center">
            {uploadError}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleDemo}
            className="flex-1 py-3 rounded-xl border border-[#EEEFF3] text-sm font-medium text-[#6B7280] hover:bg-[#FAFAFC] transition-colors"
          >
            Zobrazit demo data
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg,#E8308A,#7B3FF2)' }}
          >
            {isLoading ? 'Zpracovávám...' : 'Zobrazit dashboard'}
          </button>
        </div>
      </div>
    </div>
  );
}
