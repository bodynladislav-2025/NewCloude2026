import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip, Legend,
} from 'recharts';

export default function RadarTeamChart({ teamAvg, topQuartile }) {
  if (!teamAvg) return <div className="flex items-center justify-center h-48 text-[#9CA3AF] text-sm">Nedostatek dat</div>;

  const data = [
    { subject: 'Profesionalita', team: teamAvg.profesionalita, top: topQuartile?.profesionalita },
    { subject: 'Obch. dovedno.', team: teamAvg.obchodni, top: topQuartile?.obchodni },
    { subject: 'Zjišť. potřeb', team: teamAvg.zjistovani, top: topQuartile?.zjistovani },
    { subject: 'Closing', team: teamAvg.closing, top: topQuartile?.closing },
  ];

  return (
    <ResponsiveContainer width="100%" height={260}>
      <RadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
        <PolarGrid stroke="#EEEFF3" />
        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#6B7280' }} />
        <Radar name="Tým průměr" dataKey="team" stroke="#7B3FF2" fill="#7B3FF2" fillOpacity={0.2} strokeWidth={2} />
        {topQuartile && (
          <Radar name="Top kvartil" dataKey="top" stroke="#E8308A" fill="#E8308A" fillOpacity={0.1} strokeWidth={2} strokeDasharray="4 2" />
        )}
        <Tooltip formatter={(v) => v?.toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
