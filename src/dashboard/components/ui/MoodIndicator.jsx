import { formatScore } from '../../lib/calculations';

/**
 * Displays customer mood start → end with visual indicator
 */
export default function MoodIndicator({ start, end, showDelta = true }) {
  const delta = end - start;
  const icons = ['', '😠', '😕', '😐', '🙂', '😊'];

  return (
    <div className="flex items-center gap-2">
      <span className="text-lg" title={`Start: ${formatScore(start)}`}>{icons[Math.round(start)] || '?'}</span>
      <div className="flex flex-col items-center">
        <div className={`text-xs font-bold ${delta > 0 ? 'text-green-600' : delta < 0 ? 'text-red-500' : 'text-gray-400'}`}>
          {delta > 0 ? '↑' : delta < 0 ? '↓' : '→'}
        </div>
      </div>
      <span className="text-lg" title={`Konec: ${formatScore(end)}`}>{icons[Math.round(end)] || '?'}</span>
      {showDelta && (
        <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${delta > 0 ? 'bg-green-100 text-green-700' : delta < 0 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
          {delta > 0 ? '+' : ''}{delta.toFixed(1)}
        </span>
      )}
    </div>
  );
}

/**
 * Compact delta-only version for tables
 */
export function MoodDelta({ start, end }) {
  const delta = end - start;
  if (delta > 0) return <span className="text-green-600 font-semibold text-sm">↑ +{delta.toFixed(1)}</span>;
  if (delta < 0) return <span className="text-red-500 font-semibold text-sm">↓ {delta.toFixed(1)}</span>;
  return <span className="text-gray-400 text-sm">→ 0</span>;
}
