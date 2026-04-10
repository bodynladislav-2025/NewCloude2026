import { useState, useCallback } from 'react';
import { supabase, PARSE_FUNCTION_URL } from '../lib/supabase';
import { usePeriod } from '../hooks/usePeriod';
import PeriodSelector from '../components/PeriodSelector';
import ConfirmDialog from '../components/ConfirmDialog';
import { Upload as UploadIcon, FileSpreadsheet, Image, X, Check, AlertTriangle, Loader } from 'lucide-react';
import * as XLSX from 'xlsx';

const DATA_TYPES = [
  { value: 'sales',         label: 'Tržby / Zakázky' },
  { value: 'opportunities', label: 'Příležitosti (Pipeline)' },
  { value: 'invoices',      label: 'Faktury po splatnosti' },
  { value: 'mixed',         label: 'Smíšená data' },
];

const FILE_STATUS = {
  PENDING:   'pending',
  PARSING:   'parsing',
  PREVIEW:   'preview',
  SAVING:    'saving',
  SAVED:     'saved',
  ERROR:     'error',
};

export default function UploadPage() {
  const period = usePeriod();
  const [files, setFiles]           = useState([]);
  const [dragOver, setDragOver]     = useState(false);
  const [confirmOverwrite, setConfirmOverwrite] = useState(null);
  const [globalStatus, setGlobalStatus]         = useState('');

  function addFiles(newFiles) {
    const items = Array.from(newFiles).map(f => ({
      id:       Math.random().toString(36).slice(2),
      file:     f,
      name:     f.name,
      type:     detectFileType(f),
      dataType: 'sales',
      status:   FILE_STATUS.PENDING,
      preview:  null,
      error:    null,
    }));
    setFiles(prev => [...prev, ...items]);
  }

  function removeFile(id) {
    setFiles(prev => prev.filter(f => f.id !== id));
  }

  function updateFile(id, updates) {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  }

  async function parseFile(item) {
    updateFile(item.id, { status: FILE_STATUS.PARSING, error: null });
    try {
      let preview = null;
      if (item.type === 'screenshot') {
        preview = await parseScreenshot(item.file, item.dataType);
      } else {
        preview = await parseSpreadsheet(item.file, item.dataType);
      }
      updateFile(item.id, { status: FILE_STATUS.PREVIEW, preview });
    } catch (err) {
      updateFile(item.id, { status: FILE_STATUS.ERROR, error: err.message });
    }
  }

  async function parseAllPending() {
    const pending = files.filter(f => f.status === FILE_STATUS.PENDING);
    for (const item of pending) {
      await parseFile(item);
    }
  }

  async function saveFile(item) {
    updateFile(item.id, { status: FILE_STATUS.SAVING });
    try {
      const { year, month } = period;

      // Upsert period
      const { data: per, error: perErr } = await supabase
        .from('periods')
        .upsert({ year, month }, { onConflict: 'year,month' })
        .select('id')
        .single();
      if (perErr) throw perErr;

      // Check existing data for this period + data type → ask about overwrite
      await deleteExistingData(per.id, item.dataType);

      // Save file to storage (optional – ignore if bucket doesn't exist)
      const storagePath = `uploads/${year}-${month}/${Date.now()}-${item.name}`;
      await supabase.storage.from('uploads').upload(storagePath, item.file, { upsert: true }).catch(() => {});

      // Create upload record
      const { data: upload, error: upErr } = await supabase
        .from('uploads')
        .insert({
          period_id:    per.id,
          file_name:    item.name,
          file_type:    item.type === 'screenshot' ? 'screenshot' : item.name.endsWith('.csv') ? 'csv' : 'excel',
          data_type:    item.dataType,
          storage_path: storagePath,
          parsed_at:    new Date().toISOString(),
        })
        .select('id')
        .single();
      if (upErr) throw upErr;

      // Save parsed data rows
      await saveParsedData(per.id, upload.id, item.dataType, item.preview.rows);

      updateFile(item.id, { status: FILE_STATUS.SAVED });
    } catch (err) {
      console.error('Save error:', err);
      updateFile(item.id, { status: FILE_STATUS.ERROR, error: err.message });
    }
  }

  async function saveAll() {
    const ready = files.filter(f => f.status === FILE_STATUS.PREVIEW);
    setGlobalStatus(`Ukládám ${ready.length} souborů…`);
    for (const item of ready) await saveFile(item);
    setGlobalStatus('Všechna data uložena!');
    setTimeout(() => setGlobalStatus(''), 3000);
  }

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  }, []);

  const hasPending  = files.some(f => f.status === FILE_STATUS.PENDING);
  const hasPreview  = files.some(f => f.status === FILE_STATUS.PREVIEW);

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">Nahrát data</h1>
        <p className="text-sm text-slate-500 mt-0.5">Exporty z K2 (Excel, CSV) nebo screenshoty</p>
      </div>

      {/* Period + controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs text-slate-500 mb-1">Přiřadit k období</p>
          <PeriodSelector {...period} />
        </div>
        <div className="flex gap-2">
          {hasPending && (
            <button onClick={parseAllPending}
              className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
              <Loader className="w-4 h-4" /> Parsovat vše
            </button>
          )}
          {hasPreview && (
            <button onClick={saveAll}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              <Check className="w-4 h-4" /> Uložit vše
            </button>
          )}
        </div>
      </div>

      {globalStatus && (
        <div className="mb-4 px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
          {globalStatus}
        </div>
      )}

      {/* Drop zone */}
      <div
        onDrop={onDrop}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        className={`border-2 border-dashed rounded-xl p-8 text-center mb-4 transition-colors ${
          dragOver ? 'border-blue-400 bg-blue-50' : 'border-slate-300 hover:border-slate-400'
        }`}
      >
        <UploadIcon className="w-8 h-8 text-slate-400 mx-auto mb-3" />
        <p className="text-slate-600 font-medium mb-1">Přetáhněte soubory sem</p>
        <p className="text-slate-400 text-sm mb-4">nebo klikněte a vyberte soubory</p>
        <label className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          Vybrat soubory
          <input
            type="file"
            multiple
            accept=".xlsx,.xls,.csv,.png,.jpg,.jpeg,.webp"
            className="hidden"
            onChange={e => addFiles(e.target.files)}
          />
        </label>
        <p className="text-xs text-slate-400 mt-3">Excel, CSV, PNG, JPG, WebP</p>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-3">
          {files.map(item => (
            <FileItem
              key={item.id}
              item={item}
              onRemove={() => removeFile(item.id)}
              onTypeChange={dt => updateFile(item.id, { dataType: dt })}
              onParse={() => parseFile(item)}
              onSave={() => saveFile(item)}
              onEditRow={(idx, col, val) => updateFile(item.id, {
                preview: {
                  ...item.preview,
                  rows: item.preview.rows.map((r, i) => i === idx ? { ...r, [col]: val } : r),
                },
              })}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── File Item ─────────────────────────────────────────────────
function FileItem({ item, onRemove, onTypeChange, onParse, onSave, onEditRow }) {
  const [showPreview, setShowPreview] = useState(true);

  const statusIcon = {
    [FILE_STATUS.PENDING]:  <div className="w-2 h-2 rounded-full bg-slate-400" />,
    [FILE_STATUS.PARSING]:  <Loader className="w-4 h-4 text-blue-500 animate-spin" />,
    [FILE_STATUS.PREVIEW]:  <Check className="w-4 h-4 text-emerald-500" />,
    [FILE_STATUS.SAVING]:   <Loader className="w-4 h-4 text-blue-500 animate-spin" />,
    [FILE_STATUS.SAVED]:    <Check className="w-4 h-4 text-emerald-600" />,
    [FILE_STATUS.ERROR]:    <AlertTriangle className="w-4 h-4 text-red-500" />,
  };

  const statusLabel = {
    [FILE_STATUS.PENDING]:  'Čeká na zpracování',
    [FILE_STATUS.PARSING]:  'Parsování…',
    [FILE_STATUS.PREVIEW]:  'Připraveno k uložení',
    [FILE_STATUS.SAVING]:   'Ukládání…',
    [FILE_STATUS.SAVED]:    'Uloženo',
    [FILE_STATUS.ERROR]:    'Chyba',
  };

  return (
    <div className={`bg-white rounded-xl border ${item.status === FILE_STATUS.ERROR ? 'border-red-200' : item.status === FILE_STATUS.SAVED ? 'border-emerald-200' : 'border-slate-200'} overflow-hidden`}>
      <div className="px-4 py-3 flex items-center gap-3">
        {item.type === 'screenshot'
          ? <Image className="w-5 h-5 text-purple-500 flex-shrink-0" />
          : <FileSpreadsheet className="w-5 h-5 text-green-600 flex-shrink-0" />}

        <div className="flex-1 min-w-0">
          <p className="font-medium text-slate-800 truncate text-sm">{item.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            {statusIcon[item.status]}
            <span className="text-xs text-slate-500">{statusLabel[item.status]}</span>
          </div>
        </div>

        {/* Data type selector */}
        {item.status !== FILE_STATUS.SAVED && (
          <select
            value={item.dataType}
            onChange={e => onTypeChange(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {DATA_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1">
          {item.status === FILE_STATUS.PENDING && (
            <button onClick={onParse}
              className="px-2.5 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-200 transition-colors">
              Parsovat
            </button>
          )}
          {item.status === FILE_STATUS.PREVIEW && (
            <>
              <button onClick={() => setShowPreview(p => !p)}
                className="px-2.5 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-200 transition-colors">
                {showPreview ? 'Skrýt' : 'Náhled'}
              </button>
              <button onClick={onSave}
                className="px-2.5 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors">
                Uložit
              </button>
            </>
          )}
          {item.status !== FILE_STATUS.SAVING && item.status !== FILE_STATUS.SAVED && (
            <button onClick={onRemove}
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {item.status === FILE_STATUS.ERROR && item.error && (
        <div className="px-4 pb-3 text-sm text-red-600 bg-red-50 border-t border-red-100 py-2">
          {item.error}
        </div>
      )}

      {/* Preview table */}
      {item.status === FILE_STATUS.PREVIEW && item.preview && showPreview && (
        <PreviewTable rows={item.preview.rows} columns={item.preview.columns} onEditRow={onEditRow} />
      )}
    </div>
  );
}

// ── Preview Table ─────────────────────────────────────────────
function PreviewTable({ rows, columns, onEditRow }) {
  const [editing, setEditing] = useState(null); // { row, col }

  if (!rows || rows.length === 0) {
    return <div className="px-4 py-3 text-sm text-slate-500 border-t border-slate-100">Žádná data k zobrazení</div>;
  }

  return (
    <div className="border-t border-slate-100 overflow-x-auto max-h-64">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-slate-50 sticky top-0">
            {columns.map(col => (
              <th key={col} className="px-3 py-2 text-left font-medium text-slate-500 border-b border-slate-200 whitespace-nowrap">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, 50).map((row, i) => (
            <tr key={i} className="hover:bg-slate-50 border-b border-slate-100">
              {columns.map(col => (
                <td key={col} className="px-3 py-1.5">
                  {editing?.row === i && editing?.col === col ? (
                    <input
                      autoFocus
                      defaultValue={row[col] ?? ''}
                      onBlur={e => { onEditRow(i, col, e.target.value); setEditing(null); }}
                      onKeyDown={e => { if (e.key === 'Enter') e.target.blur(); }}
                      className="w-full border border-blue-400 rounded px-1 py-0.5 text-xs focus:outline-none"
                    />
                  ) : (
                    <span
                      className="cursor-pointer hover:underline text-slate-700"
                      onClick={() => setEditing({ row: i, col })}
                    >
                      {String(row[col] ?? '')}
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length > 50 && (
        <div className="px-3 py-2 text-xs text-slate-400">…a dalších {rows.length - 50} řádků</div>
      )}
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────
function detectFileType(file) {
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (['png', 'jpg', 'jpeg', 'webp'].includes(ext)) return 'screenshot';
  return 'spreadsheet';
}

async function parseScreenshot(file, dataType) {
  if (!PARSE_FUNCTION_URL) {
    throw new Error('Edge Function URL není konfigurována. Nastavte VITE_SUPABASE_URL v .env.local');
  }

  const { data: { session } } = await supabase.auth.getSession();
  const base64 = await fileToBase64(file);

  const res = await fetch(PARSE_FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token}`,
    },
    body: JSON.stringify({
      type: 'screenshot',
      dataType,
      imageBase64: base64,
      mimeType: file.type,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Chyba parsování: ${err}`);
  }

  return await res.json();
}

async function parseSpreadsheet(file, dataType) {
  const ab = await file.arrayBuffer();
  const wb = XLSX.read(ab, { type: 'array', cellDates: true });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const raw = XLSX.utils.sheet_to_json(sheet, { defval: '' });

  if (raw.length === 0) throw new Error('Soubor neobsahuje žádná data');

  const columns = Object.keys(raw[0]);
  const rows = raw.map(r => {
    const obj = {};
    columns.forEach(c => { obj[c] = r[c]; });
    return obj;
  });

  return { columns, rows };
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result).split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function deleteExistingData(periodId, dataType) {
  if (dataType === 'sales' || dataType === 'mixed') {
    await supabase.from('sales_data').delete().eq('period_id', periodId);
  }
  if (dataType === 'opportunities' || dataType === 'mixed') {
    await supabase.from('opportunities').delete().eq('period_id', periodId);
  }
  if (dataType === 'invoices' || dataType === 'mixed') {
    await supabase.from('invoices_aging').delete().eq('period_id', periodId);
  }
}

async function saveParsedData(periodId, uploadId, dataType, rows) {
  if (!rows || rows.length === 0) return;

  if (dataType === 'sales') {
    const records = rows.map(r => ({
      period_id:        periodId,
      upload_id:        uploadId,
      salesperson_name: String(r['Obchodník'] || r['Jméno'] || r['Salesperson'] || r['Prodejce'] || r['Name'] || 'Neznámý'),
      team:             String(r['Tým'] || r['Oddělení'] || r['Team'] || '') || null,
      revenue_czk:      parseCZK(r['Tržby'] || r['Marže'] || r['Obrat'] || r['Revenue'] || r['Hodnota'] || r['Částka'] || 0),
      orders_count:     parseInt(r['Zakázky'] || r['Počet'] || r['Orders'] || r['Count'] || 0) || 0,
    }));
    const { error } = await supabase.from('sales_data').insert(records);
    if (error) throw new Error(`Chyba ukládání tržeb: ${error.message}`);
  }

  if (dataType === 'opportunities') {
    const records = rows.map(r => ({
      period_id:        periodId,
      upload_id:        uploadId,
      partner_name:     String(r['Partner'] || r['Zákazník'] || r['Customer'] || r['Firma'] || r['Company'] || 'Neznámý'),
      value_czk:        parseCZK(r['Hodnota'] || r['Objem'] || r['Value'] || r['Amount'] || 0),
      status:           String(r['Stav'] || r['Fáze'] || r['Status'] || r['Stage'] || ''),
      created_at_k2:    parseDate(r['Datum'] || r['Vytvořeno'] || r['Created'] || null),
      salesperson_name: String(r['Obchodník'] || r['Přiřazeno'] || r['Salesperson'] || '') || null,
      is_closed:        isClosed(r['Stav'] || r['Status'] || ''),
    }));
    const { error } = await supabase.from('opportunities').insert(records);
    if (error) throw new Error(`Chyba ukládání příležitostí: ${error.message}`);
  }

  if (dataType === 'invoices') {
    const aging = { '0-30': 0, '31-60': 0, '61-90': 0, '90+': 0 };
    rows.forEach(r => {
      const keys = Object.keys(r);
      keys.forEach(k => {
        const kl = k.toLowerCase();
        if (kl.includes('0-30') || kl.includes('0 - 30') || kl.includes('do 30')) aging['0-30'] += parseCZK(r[k]);
        else if (kl.includes('31-60') || kl.includes('31 - 60')) aging['31-60'] += parseCZK(r[k]);
        else if (kl.includes('61-90') || kl.includes('61 - 90')) aging['61-90'] += parseCZK(r[k]);
        else if (kl.includes('90+') || kl.includes('nad 90') || kl.includes('over 90')) aging['90+'] += parseCZK(r[k]);
      });
    });
    const records = Object.entries(aging)
      .filter(([, v]) => v > 0)
      .map(([days_range, total_czk]) => ({ period_id: periodId, upload_id: uploadId, days_range, total_czk }));
    if (records.length > 0) {
      const { error } = await supabase.from('invoices_aging').insert(records);
      if (error) throw new Error(`Chyba ukládání faktur: ${error.message}`);
    }
  }
}

function parseCZK(val) {
  if (!val) return 0;
  const s = String(val).replace(/[^\d,-]/g, '').replace(',', '.');
  return Math.round(parseFloat(s) || 0);
}

function parseDate(val) {
  if (!val) return null;
  try { return new Date(val).toISOString().slice(0, 10); }
  catch { return null; }
}

function isClosed(status) {
  const s = String(status).toLowerCase();
  return ['uzavřeno', 'closed', 'won', 'vyhráno', 'realizováno'].some(k => s.includes(k));
}
