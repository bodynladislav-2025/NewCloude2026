/**
 * PillBadge — colored pill label
 * variant: ok | watch | risk | magenta | purple | blue | green | amber | gray
 */
export default function PillBadge({ children, variant = 'gray' }) {
  const styles = {
    ok:      'bg-green-100 text-green-700',
    watch:   'bg-amber-100 text-amber-700',
    risk:    'bg-red-100 text-red-700',
    magenta: 'bg-[#FDE8F2] text-[#E8308A]',
    purple:  'bg-[#F1EBFE] text-[#7B3FF2]',
    blue:    'bg-[#E7F0FC] text-[#3B7BE8]',
    green:   'bg-green-100 text-green-700',
    amber:   'bg-amber-100 text-amber-700',
    gray:    'bg-gray-100 text-gray-600',
    red:     'bg-red-100 text-red-700',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[variant] || styles.gray}`}>
      {children}
    </span>
  );
}

export function getRizikoPill(riziko) {
  if (!riziko || riziko === 'none') return null;
  if (riziko === 'zakázka+zákazník') return <PillBadge variant="risk">⚠ {riziko}</PillBadge>;
  if (riziko === 'zákazník') return <PillBadge variant="risk">⚠ zákazník</PillBadge>;
  return <PillBadge variant="watch">⚡ zakázka</PillBadge>;
}
