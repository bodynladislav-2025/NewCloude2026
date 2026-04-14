import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer,
} from 'recharts';

export default function DetailTrendChart({ data, obchodnik, teamData }) {
  if (!data?.length) return (
    <div className="flex items-center justify-center h-48 text-[#9CA3AF] text-sm">Nedostatek dat pro graf</div>
  );

  // Merge individual and team data
  const merged = data.map(d => {
    const t = teamData?.find(td => td.month === d.month);
    return { ...d, teamCelkove: t?.celkove };
  });

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={merged} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#EEEFF3" />
        <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
        <YAxis domain={[2, 5]} tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
        <Tooltip
          formatter={(v, name) => [
            v?.toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
            name,
          ]}
          contentStyle={{ borderRadius: 12, border: '1px solid #EEEFF3', fontSize: 12 }}
        />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
        <ReferenceLine y={4.0} stroke="#10B981" strokeDasharray="6 3" strokeOpacity={0.5} label={{ value: 'Cíl 4,0', position: 'right', fontSize: 10, fill: '#10B981' }} />
        <Line
          type="monotone"
          dataKey="celkove"
          name={obchodnik}
          stroke="#E8308A"
          strokeWidth={2.5}
          dot={{ r: 5, fill: '#E8308A', strokeWidth: 0 }}
          activeDot={{ r: 7 }}
        />
        {teamData && (
          <Line
            type="monotone"
            dataKey="teamCelkove"
            name="Průměr týmu"
            stroke="#7B3FF2"
            strokeWidth={1.5}
            strokeDasharray="5 3"
            dot={false}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}
