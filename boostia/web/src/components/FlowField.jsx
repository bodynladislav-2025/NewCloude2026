import { useEffect, useRef } from 'react'

// Hero pozadí: tenké linky tečou zleva a sbíhají se k jednomu bodu. Canvas 2D, strop 30 fps,
// mimo viewport se zastaví. Lehce se ohýbají ke kurzoru.
export default function FlowField({ focus = { x: 0.82, y: 0.46 } }) {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    let w = 0, h = 0, raf = 0, running = true, last = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const N = window.innerWidth < 768 ? 26 : 48
    const mouse = { x: -9999, y: -9999 }
    // Barvy bere z CSS proměnných, aby fungoval i světlý režim
    const rgb = (name) => { const h = getComputedStyle(document.documentElement).getPropertyValue(name).trim().replace('#', ''); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).join(',') }
    let FL = rgb('--color-flow'), AC = rgb('--color-accent')
    const onTheme = () => { FL = rgb('--color-flow'); AC = rgb('--color-accent') }
    window.addEventListener('boostia:theme', onTheme)
    const lines = Array.from({ length: N }, (_, i) => ({
      y0: (i + 0.5) / N, wob: Math.random() * Math.PI * 2, speed: 0.12 + Math.random() * 0.22,
      t: Math.random(), alpha: 0.1 + Math.random() * 0.3, c1: 0.25 + Math.random() * 0.2, c2: 0.5 + Math.random() * 0.2,
    }))
    const resize = () => {
      const r = canvas.getBoundingClientRect()
      w = r.width; h = r.height
      canvas.width = w * dpr; canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const bez = (p0, p1, p2, p3, t) => {
      const u = 1 - t
      return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3
    }
    const draw = (now) => {
      raf = requestAnimationFrame(draw)
      if (!running || now - last < 33) return
      const dt = Math.min((now - last) / 1000, 0.1); last = now
      ctx.clearRect(0, 0, w, h)
      const fx = w * focus.x, fy = h * focus.y
      for (const l of lines) {
        l.wob += dt * 0.4
        const y0 = l.y0 * h + Math.sin(l.wob) * 10
        let c1x = w * l.c1, c1y = y0 + Math.cos(l.wob * 0.7) * 14
        let c2x = w * l.c2, c2y = fy + (y0 - fy) * 0.25
        // přitažení řídicích bodů ke kurzoru v okruhu 180 px
        for (const p of [[c1x, c1y, 1], [c2x, c2y, 2]]) {
          const dx = mouse.x - p[0], dy = mouse.y - p[1], d = Math.hypot(dx, dy)
          if (d < 180) {
            const f = (1 - d / 180) * 0.35
            if (p[2] === 1) { c1x += dx * f; c1y += dy * f } else { c2x += dx * f; c2y += dy * f }
          }
        }
        ctx.beginPath(); ctx.moveTo(-10, y0); ctx.bezierCurveTo(c1x, c1y, c2x, c2y, fx, fy)
        ctx.strokeStyle = `rgba(${FL},${l.alpha})`; ctx.lineWidth = 1; ctx.stroke()
        // světelný puls putující po lince
        l.t += dt * l.speed; if (l.t > 1) l.t -= 1
        const px = bez(-10, c1x, c2x, fx, l.t), py = bez(y0, c1y, c2y, fy, l.t)
        ctx.beginPath(); ctx.arc(px, py, 1.6, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${AC},${0.25 + l.t * 0.7})`; ctx.fill()
      }
      // výstupní linka k výsledku
      const g = ctx.createLinearGradient(fx, fy, w, fy)
      g.addColorStop(0, `rgba(${AC},.9)`); g.addColorStop(1, `rgba(${AC},0)`)
      ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(w, fy); ctx.strokeStyle = g; ctx.lineWidth = 2; ctx.stroke()
      const rg = ctx.createRadialGradient(fx, fy, 0, fx, fy, 90)
      rg.addColorStop(0, `rgba(${AC},.22)`); rg.addColorStop(1, `rgba(${AC},0)`)
      ctx.fillStyle = rg; ctx.fillRect(fx - 90, fy - 90, 180, 180)
      ctx.beginPath(); ctx.arc(fx, fy, 4, 0, Math.PI * 2); ctx.fillStyle = `rgb(${AC})`; ctx.fill()
    }
    const onMove = (e) => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top }
    const io = new IntersectionObserver(([e]) => { running = e.isIntersecting })
    resize(); io.observe(canvas)
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove, { passive: true })
    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener('resize', resize); window.removeEventListener('pointermove', onMove); window.removeEventListener('boostia:theme', onTheme) }
  }, [focus.x, focus.y])
  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden="true" />
}
