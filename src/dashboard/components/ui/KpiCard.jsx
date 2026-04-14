/**
 * KPI Card — displays a metric with icon, value, trend and optional target
 */
export default function KpiCard({ icon, label, value, trend, target, color = 'purple', sub }) {
  const colorMap = {
    purple: { bg: '#F1EBFE', text: '#7B3FF2', border: '#D8C8FC' },
    magenta: { bg: '#FDE8F2', text: '#E8308A', border: '#F9C0DC' },
    blue: { bg: '#E7F0FC', text: '#3B7BE8', border: '#C0D7F8' },
    green: { bg: '#D1FAE5', text: '#059669', border: '#A7F3D0' },
    amber: { bg: '#FEF3C7', text: '#D97706', border: '#FDE68A' },
    red: { bg: '#FEE2E2', text: '#DC2626', border: '#FECACA' },
  };
  const c = colorMap[color] || colorMap.purple;

  return (
    <div className="bg-white rounded-[20px] border border-[#EEEFF3] p-5 flex flex-col gap-3 hover:shadow-[0_8px_24px_rgba(123,63,242,0.08)] transition-shadow">
      <div className="flex items-center justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style={{ backgroundColor: c.bg, color: c.text }}
        >
          {icon}
        </div>
        {trend != null && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
            trend.positive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
          }`}>
            {trend.positive ? '↑' : '↓'} {trend.label}
          </div>
        )}
      </div>
      <div>
        <div className="text-2xl font-bold text-[#0F1629]">{value}</div>
        <div className="text-sm text-[#6B7280] mt-0.5">{label}</div>
        {sub && <div className="text-xs text-[#9CA3AF] mt-1">{sub}</div>}
      </div>
      {target != null && (
        <div className="text-xs text-[#9CA3AF]">
          Cíl: <span style={{ color: c.text }} className="font-semibold">{target}</span>
        </div>
      )}
    </div>
  );
}
