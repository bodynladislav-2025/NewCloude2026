import { formatScore } from '../../lib/calculations';

/**
 * Heat-colored tag for score values
 */
export default function HeatTag({ score }) {
  if (score == null || isNaN(score)) return <span className="text-gray-400 text-sm">—</span>;

  let bg, text;
  if (score >= 4.3) { bg = '#A7F3D0'; text = '#064E3B'; }
  else if (score >= 3.8) { bg = '#D1FAE5'; text = '#065F46'; }
  else if (score >= 3.3) { bg = '#FEF3C7'; text = '#92400E'; }
  else if (score >= 2.9) { bg = '#FED7AA'; text = '#9A3412'; }
  else { bg = '#FEE2E2'; text = '#991B1B'; }

  return (
    <span
      className="inline-block px-2 py-0.5 rounded-md text-xs font-bold"
      style={{ backgroundColor: bg, color: text }}
    >
      {formatScore(score)}
    </span>
  );
}
