'use client'
import { useEffect, useRef } from 'react'

interface Props {
  colors: string[]
  className?: string
}

export default function MeshGradient({ colors, className = '' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const blobs = colors.map(color => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: 0.32 + Math.random() * 0.22,
      color,
    }))

    function resize() {
      if (!canvas) return
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
    }
    resize()
    window.addEventListener('resize', resize)

    let animId: number
    function draw() {
      if (!canvas || !ctx) return
      const w = canvas.width, h = canvas.height
      ctx.clearRect(0, 0, w, h)
      blobs.forEach(b => {
        b.x += b.vx / w
        b.y += b.vy / h
        if (b.x < -0.2 || b.x > 1.2) b.vx *= -1
        if (b.y < -0.2 || b.y > 1.2) b.vy *= -1
        const grd = ctx.createRadialGradient(b.x * w, b.y * h, 0, b.x * w, b.y * h, b.r * Math.max(w, h))
        grd.addColorStop(0, b.color)
        grd.addColorStop(1, 'transparent')
        ctx.globalCompositeOperation = 'lighter'
        ctx.fillStyle = grd
        ctx.fillRect(0, 0, w, h)
        ctx.globalCompositeOperation = 'source-over'
      })
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animId)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return <canvas ref={canvasRef} className={`absolute inset-0 w-full h-full ${className}`} style={{ pointerEvents: 'none' }} />
}
