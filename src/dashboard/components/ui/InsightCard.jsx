/**
 * Insight card — AI-computed insight with color-coded border
 * type: improvement | weakness | action
 */
export default function InsightCard({ label, color, title, text }) {
  const colorMap = {
    green:  { border: '#10B981', bg: '#F0FDF4', labelBg: '#D1FAE5', labelText: '#065F46' },
    amber:  { border: '#F59E0B', bg: '#FFFBEB', labelBg: '#FEF3C7', labelText: '#92400E' },
    red:    { border: '#EF4444', bg: '#FFF5F5', labelBg: '#FEE2E2', labelText: '#991B1B' },
    purple: { border: '#7B3FF2', bg: '#F8F5FF', labelBg: '#F1EBFE', labelText: '#5E29C9' },
  };
  const c = colorMap[color] || colorMap.purple;

  return (
    <div
      className="rounded-[16px] p-4 border-l-4"
      style={{ backgroundColor: c.bg, borderColor: c.border }}
    >
      <div className="mb-2">
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase"
          style={{ backgroundColor: c.labelBg, color: c.labelText }}
        >
          {label}
        </span>
      </div>
      <div className="font-semibold text-[#0F1629] text-sm mb-1">{title}</div>
      <div className="text-xs text-[#6B7280]">{text}</div>
    </div>
  );
}
