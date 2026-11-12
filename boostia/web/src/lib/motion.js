export const EASE = [0.22, 1, 0.36, 1]

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const isTouch = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

export const isDesktop = () =>
  typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches

// Slabé zařízení nebo pomalé připojení: těžké efekty se vypínají.
export function isLowEnd() {
  if (typeof navigator === 'undefined') return false
  const c = navigator.connection || {}
  return (
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4 && isTouch()) ||
    (navigator.deviceMemory && navigator.deviceMemory <= 2) ||
    c.saveData === true ||
    ['slow-2g', '2g', '3g'].includes(c.effectiveType)
  )
}
