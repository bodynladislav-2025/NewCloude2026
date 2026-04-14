/**
 * Circular avatar with initials and optional gradient
 */
export default function AvatarBadge({ initials, gradient, size = 40, className = '' }) {
  const defaultGrad = 'linear-gradient(135deg,#E8308A,#7B3FF2)';
  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        background: gradient || defaultGrad,
        fontSize: size * 0.35,
      }}
    >
      {initials}
    </div>
  );
}
