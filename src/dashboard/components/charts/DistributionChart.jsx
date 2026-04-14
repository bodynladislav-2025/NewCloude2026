import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const BAND_COLORS = ['#FEE2E2', '#FED7AA', '#FEF3C7', '#D1FAE5', '#A7F3D0'];

export default function DistributionChart({ data }) {
  if (!data?.length) return (
    <div className="flex items-center justify-center h-48 text-[#9CA3AF] text-sm">Nedostatek dat</div>
  );

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#EEEFF3" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip
          formatter={(v) => [v, 'Obchodníků']}
          contentStyle={{ borderRadius: 12, border: '1px solid #EEEFF3', fontSize: 12 }}
        />
        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={BAND_COLORS[i] || '#E7F0FC'} stroke={BAND_COLORS[i] ? BAND_COLORS[i].replace('E2', 'C2') : '#C0D7F8'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
