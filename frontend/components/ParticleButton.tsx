'use client'
import { type ReactNode, type CSSProperties } from 'react'

interface Props {
  children: ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
  style?: CSSProperties
  color?: string
  type?: 'particles' | 'ring' | 'confetti'
  disabled?: boolean
}

function spawnParticles(cx: number, cy: number, color: string) {
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div')
    p.style.cssText = `position:fixed;width:7px;height:7px;border-radius:50%;background:${color};left:${cx}px;top:${cy}px;pointer-events:none;z-index:9999`
    document.body.appendChild(p)
    const angle = Math.random() * Math.PI * 2
    const dist = 35 + Math.random() * 70
    const dx = Math.cos(angle) * dist
    const dy = Math.sin(angle) * dist - 35
    p.style.transition = 'all 0.55s cubic-bezier(.16,1,.3,1)'
    p.offsetHeight // force reflow
    p.style.transform = `translate(${dx}px,${dy}px) scale(0)`
    p.style.opacity = '0'
    setTimeout(() => p.remove(), 600)
  }
}

function spawnRing(cx: number, cy: number, color: string) {
  const r = document.createElement('div')
  r.style.cssText = `position:fixed;border-radius:50%;pointer-events:none;z-index:9998;border:2px solid ${color};opacity:0;left:${cx}px;top:${cy}px;width:10px;height:10px;margin-left:-5px;margin-top:-5px`
  document.body.appendChild(r)
  r.style.transition = 'all 0.45s cubic-bezier(.16,1,.3,1)'
  r.offsetHeight
  r.style.width = '110px'
  r.style.height = '110px'
  r.style.marginLeft = '-55px'
  r.style.marginTop = '-55px'
  r.style.opacity = '1'
  setTimeout(() => { r.style.opacity = '0' }, 180)
  setTimeout(() => r.remove(), 550)
}

function spawnConfetti(cx: number, cy: number) {
  const colors = ['#1a3fd4', '#7b2d8b', '#e63946', '#22c55e', '#f59e0b', '#06b6d4']
  for (let i = 0; i < 28; i++) {
    const c = document.createElement('div')
    c.style.cssText = `position:fixed;width:6px;height:11px;border-radius:2px;background:${colors[Math.floor(Math.random() * colors.length)]};left:${cx}px;top:${cy}px;pointer-events:none;z-index:9999`
    document.body.appendChild(c)
    const dx = (Math.random() - 0.5) * 180
    const dy = -50 - Math.random() * 110
    const rot = Math.random() * 720
    c.style.transition = 'all 0.75s cubic-bezier(.16,1,.3,1)'
    c.offsetHeight
    c.style.transform = `translate(${dx}px,${dy}px) rotate(${rot}deg) scale(0)`
    c.style.opacity = '0'
    setTimeout(() => c.remove(), 850)
  }
}

export default function ParticleButton({ children, onClick, className = '', style, color = '#1a3fd4', type = 'particles', disabled }: Props) {
  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    if (type === 'particles') spawnParticles(cx, cy, color)
    else if (type === 'ring') spawnRing(cx, cy, color)
    else if (type === 'confetti') spawnConfetti(cx, cy)
    onClick?.(e)
  }

  return (
    <button onClick={handleClick} className={className} style={style} disabled={disabled}>
      {children}
    </button>
  )
}
