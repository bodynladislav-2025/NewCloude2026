import { Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyState({ message = 'Žádná data pro toto období', showUploadLink = true }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
        <Upload className="w-7 h-7 text-slate-400" />
      </div>
      <p className="text-slate-600 font-medium">{message}</p>
      <p className="text-slate-400 text-sm mt-1">Nahrání exportů z K2 spustí dashboard</p>
      {showUploadLink && (
        <Link
          to="/upload"
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Nahrát data
        </Link>
      )}
    </div>
  );
}
