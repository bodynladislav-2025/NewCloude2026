import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MESICE } from '../utils/formatters';

export default function PeriodSelector({ year, month, prevMonth, nextMonth, setCurrentMonth, isCurrentMonth }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={prevMonth}
        className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        aria-label="Předchozí měsíc"
      >
        <ChevronLeft className="w-4 h-4 text-slate-600" />
      </button>

      <span className="font-semibold text-slate-800 min-w-[130px] text-center">
        {MESICE[month - 1]} {year}
      </span>

      <button
        onClick={nextMonth}
        className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        aria-label="Následující měsíc"
      >
        <ChevronRight className="w-4 h-4 text-slate-600" />
      </button>

      {!isCurrentMonth && (
        <button
          onClick={setCurrentMonth}
          className="ml-2 text-xs px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors font-medium"
        >
          Dnes
        </button>
      )}
    </div>
  );
}
