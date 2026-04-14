/**
 * Gradient progress bar
 */
export default function ProgressBar({ value, max = 100, label, sublabel, color = 'purple' }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  const gradients = {
    purple: 'linear-gradient(90deg,#7B3FF2,#E8308A)',
    magenta: 'linear-gradient(90deg,#E8308A,#F59E0B)',
    blue: 'linear-gradient(90deg,#3B7BE8,#7B3FF2)',
    green: 'linear-gradient(90deg,#10B981,#3B7BE8)',
    amber: 'linear-gradient(90deg,#F59E0B,#EF4444)',
  };

  const getColor = (pct) => {
    if (pct >= 45) return 'green';
    if (pct >= 35) return 'blue';
    if (pct >= 28) return 'amber';
    return 'amber';
  };

  const grad = gradients[color] || gradients[getColor(pct)];

  return (
    <div className="space-y-1">
      {(label || sublabel) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="text-[#0F1629] font-medium">{label}</span>}
          {sublabel && <span className="text-[#6B7280]">{sublabel}</span>}
        </div>
      )}
      <div className="h-2 bg-[#EEEFF3] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: grad }}
        />
      </div>
    </div>
  );
}
