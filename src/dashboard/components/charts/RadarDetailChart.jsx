import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip, Legend,
} from 'recharts';

export default function RadarDetailChart({ obchodnikStats, teamAvg, topQuartile }) {
  if (!obchodnikStats) return (
    <div className="flex items-center justify-center h-48 text-[#9CA3AF] text-sm">Vyberte obchodníka</div>
  );

  const data = [
    {
      subject: 'Profesionalita',
      individual: obchodnikStats.profesionalita,
      team: teamAvg?.profesionalita,
      top: topQuartile?.profesionalita,
    },
    {
      subject: 'Obch. dovedno.',
      individual: obchodnikStats.obchodni,
      team: teamAvg?.obchodni,
      top: topQuartile?.obchodni,
    },
    {
      subject: 'Zjišť. potřeb',
      individual: obchodnikStats.zjistovani,
      team: teamAvg?.zjistovani,
      top: topQuartile?.zjistovani,
    },
    {
      subject: 'Closing',
      individual: obchodnikStats.closing,
      team: teamAvg?.closing,
      top: topQuartile?.closing,
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
        <PolarGrid stroke="#EEEFF3" />
        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#6B7280' }} />
        <Radar name={obchodnikStats.prijmeni} dataKey="individual" stroke="#E8308A" fill="#E8308A" fillOpacity={0.25} strokeWidth={2.5} />
        {teamAvg && (
          <Radar name="Tým průměr" dataKey="team" stroke="#7B3FF2" fill="#7B3FF2" fillOpacity={0.1} strokeWidth={1.5} strokeDasharray="4 2" />
        )}
        {topQuartile && (
          <Radar name="Top kvartil" dataKey="top" stroke="#10B981" fill="#10B981" fillOpacity={0.05} strokeWidth={1.5} strokeDasharray="2 4" />
        )}
        <Tooltip formatter={(v) => v?.toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
