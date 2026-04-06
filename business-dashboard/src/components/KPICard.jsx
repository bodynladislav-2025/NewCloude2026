import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const STATUS_STYLES = {
  green:   'bg-emerald-50 border-emerald-200',
  yellow:  'bg-amber-50  border-amber-200',
  red:     'bg-red-50    border-red-200',
  neutral: 'bg-white     border-slate-200',
};

const STATUS_BADGE = {
  green:  'bg-emerald-100 text-emerald-700',
  yellow: 'bg-amber-100   text-amber-700',
  red:    'bg-red-100     text-red-700',
};

export default function KPICard({
  title,
  value,
  subtitle,
  badge,
  status = 'neutral',
  trend,      // 'up' | 'down' | 'neutral'
  trendLabel,
  footer,
  children,
}) {
  return (
    <div className={`rounded-xl border p-5 ${STATUS_STYLES[status]}`}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <p className="text-sm font-medium text-slate-600">{title}</p>
        {badge && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${STATUS_BADGE[status] || 'bg-slate-100 text-slate-600'}`}>
            {badge}
          </span>
        )}
      </div>

      <p className="text-2xl font-bold text-slate-900 leading-tight">{value}</p>

      {subtitle && (
        <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
      )}

      {children}

      {(trend || footer) && (
        <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
          {trend && (
            <span className="flex items-center gap-1">
              {trend === 'up'      && <TrendingUp   className="w-3.5 h-3.5 text-emerald-500" />}
              {trend === 'down'    && <TrendingDown  className="w-3.5 h-3.5 text-red-500" />}
              {trend === 'neutral' && <Minus         className="w-3.5 h-3.5 text-slate-400" />}
              {trendLabel}
            </span>
          )}
          {footer && <span>{footer}</span>}
        </div>
      )}
    </div>
  );
}
