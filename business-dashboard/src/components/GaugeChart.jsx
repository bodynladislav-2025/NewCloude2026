/**
 * SVG semi-circle gauge showing plan fulfillment %.
 */
export default function GaugeChart({ pct = 0, expectedPct = 0, label, sublabel }) {
  const clampedPct = Math.min(Math.max(pct, 0), 150); // cap at 150%
  const clampedExp = Math.min(Math.max(expectedPct, 0), 150);

  // SVG arc helpers (semi-circle 180°)
  const R = 70;
  const cx = 90;
  const cy = 90;

  function polarToXY(angleDeg) {
    const rad = ((angleDeg - 180) * Math.PI) / 180;
    return {
      x: cx + R * Math.cos(rad),
      y: cy + R * Math.sin(rad),
    };
  }

  function arcPath(startPct, endPct, radius = R) {
    const startAngle = (startPct / 100) * 180;
    const endAngle   = (endPct / 100) * 180;
    const start = polarToXY(startAngle);
    const end   = polarToXY(endAngle);
    const large = endAngle - startAngle > 180 ? 1 : 0;
    // Adjust for inner radius arc
    const rStr  = `${radius},${radius}`;
    return `M ${start.x} ${start.y} A ${rStr} 0 ${large} 1 ${end.x} ${end.y}`;
  }

  // Color based on ratio actual vs expected
  let trackColor = '#22c55e'; // green
  if (expectedPct > 0) {
    const ratio = pct / expectedPct;
    if (ratio < 0.85) trackColor = '#ef4444'; // red
    else if (ratio < 1.0) trackColor = '#f59e0b'; // yellow
  }

  const displayPct = Math.min(clampedPct, 100);

  // Needle angle
  const needleAngle = (clampedPct / 100) * 180 - 180;
  const needleRad = (needleAngle * Math.PI) / 180;
  const needleX = cx + (R - 15) * Math.cos(needleRad);
  const needleY = cy + (R - 15) * Math.sin(needleRad);

  // Expected marker
  const expAngle = (clampedExp / 100) * 180 - 180;
  const expRad = (expAngle * Math.PI) / 180;
  const expX1 = cx + (R - 6) * Math.cos(expRad);
  const expY1 = cy + (R - 6) * Math.sin(expRad);
  const expX2 = cx + (R + 6) * Math.cos(expRad);
  const expY2 = cy + (R + 6) * Math.sin(expRad);

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 180 100" className="w-full max-w-[200px]" aria-label={`Plnění ${pct.toFixed(1)} %`}>
        {/* Background track */}
        <path d={arcPath(0, 100)} fill="none" stroke="#e2e8f0" strokeWidth="12" strokeLinecap="round" />

        {/* Filled arc */}
        {displayPct > 0 && (
          <path d={arcPath(0, displayPct)} fill="none" stroke={trackColor} strokeWidth="12" strokeLinecap="round" />
        )}

        {/* Expected % marker */}
        {expectedPct > 0 && (
          <line x1={expX1} y1={expY1} x2={expX2} y2={expY2}
            stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
        )}

        {/* Needle */}
        <line x1={cx} y1={cy} x2={needleX} y2={needleY}
          stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="4" fill="#1e293b" />

        {/* Labels on arc ends */}
        <text x="14" y="96" fontSize="9" fill="#94a3b8" textAnchor="middle">0 %</text>
        <text x="166" y="96" fontSize="9" fill="#94a3b8" textAnchor="middle">100 %</text>
      </svg>

      {/* Center label */}
      <div className="-mt-4 text-center">
        <div className="text-3xl font-bold text-slate-900">
          {pct.toLocaleString('cs-CZ', { maximumFractionDigits: 1 })}
          <span className="text-lg font-medium text-slate-500">&nbsp;%</span>
        </div>
        {label && <div className="text-sm font-medium text-slate-700 mt-0.5">{label}</div>}
        {sublabel && <div className="text-xs text-slate-500 mt-0.5">{sublabel}</div>}
      </div>
    </div>
  );
}
