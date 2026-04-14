import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const COLORS = {
  profesionalita: '#E8308A',
  obchodni: '#7B3FF2',
  zjistovani: '#3B7BE8',
  closing: '#10B981',
  celkove: '#0F1629',
};

const LABELS = {
  profesionalita: 'Profesionalita',
  obchodni: 'Obchod. dovednosti',
  zjistovani: 'Zjišťování potřeb',
  closing: 'Closing',
  celkove: 'Celkové skóre',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#EEEFF3] rounded-xl shadow-lg p-3 text-sm">
      <div className="font-semibold text-[#0F1629] mb-2">{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-[#6B7280]">{LABELS[p.dataKey]}:</span>
          <span className="font-semibold">{p.value?.toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
        </div>
      ))}
    </div>
  );
};

export default function ScoreTrendChart({ data, lines = ['profesionalita', 'obchodni'] }) {
  if (!data?.length) return (
    <div className="flex items-center justify-center h-48 text-[#9CA3AF] text-sm">Nedostatek dat pro graf</div>
  );

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#EEEFF3" />
        <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
        <YAxis domain={[2, 5]} tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
          formatter={(value) => LABELS[value] || value}
        />
        {lines.map(key => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={COLORS[key]}
            strokeWidth={2.5}
            dot={{ r: 4, fill: COLORS[key], strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
