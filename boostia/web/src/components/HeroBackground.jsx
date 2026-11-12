import { lazy, Suspense, useEffect, useState } from 'react'
import { isLowEnd, prefersReducedMotion } from '../lib/motion'

const FlowField = lazy(() => import('./FlowField'))

// Statická záloha se stejným motivem: zobrazí se hned, na slabých zařízeních a při omezeném pohybu zůstane.
function FlowFallback() {
  const ys = [8, 18, 28, 38, 50, 62, 72, 82, 92]
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" className="absolute inset-0 h-full w-full">
      {ys.map((y, i) => (
        <path key={i} d={`M0 ${y} C 35 ${y}, 60 ${46 + (y - 46) * 0.25}, 82 46`} fill="none" stroke="#4DA3FF" strokeOpacity={0.12 + (i % 3) * 0.06} strokeWidth="1" vectorEffect="non-scaling-stroke" />
      ))}
      <path d="M82 46 H100" stroke="#C8FF3E" strokeOpacity=".7" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

export default function HeroBackground({ animated = true }) {
  const [live, setLive] = useState(false)
  useEffect(() => {
    if (!animated || prefersReducedMotion() || isLowEnd()) return
    // Canvas se načte až po prvním vykreslení, aby nezdržel headline a CTA.
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 300))
    const id = idle(() => setLive(true))
    return () => (window.cancelIdleCallback || clearTimeout)(id)
  }, [animated])
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 opacity-70 [mask-image:linear-gradient(to_right,transparent,#000_30%,#000)] lg:[mask-image:linear-gradient(to_right,transparent_10%,#000_55%)]">
        {live ? <Suspense fallback={<FlowFallback />}><FlowField /></Suspense> : <FlowFallback />}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />
    </div>
  )
}
