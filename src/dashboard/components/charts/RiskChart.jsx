import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#EEEFF3] rounded-xl shadow-lg p-3 text-sm">
      <div className="font-semibold text-[#0F1629] mb-2">{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.fill }} />
          <span className="text-[#6B7280]">{p.name}:</span>
          <span className="font-semibold">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function RiskChart({ data }) {
  if (!data?.length) return (
    <div className="flex items-center justify-center h-48 text-[#9CA3AF] text-sm">Nedostatek dat</div>
  );

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#EEEFF3" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
        <Bar dataKey="rizikove_zakazka" name="Riziková zakázka" stackId="a" fill="#FED7AA" radius={[0, 0, 0, 0]} />
        <Bar dataKey="rizikove_zakaznik" name="Rizikový zákazník" stackId="a" fill="#F97316" radius={[0, 0, 0, 0]} />
        <Bar dataKey="rizikove_oba" name="Zakázka + zákazník" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
