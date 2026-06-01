'use client'
import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

const MESSAGES = [
  { text: 'Free Delivery on orders above Rs. 5,000 — within Karachi',       cta: 'Shop Now',   action: 'scroll', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
      <rect x="1" y="3" width="15" height="13" rx="2" ry="2" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  )},
  { text: '100% Genuine Medicines — DRAP Licensed & Certified Pharmacy',     cta: 'Learn More', action: 'services', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m14.5 9.5-5 5" /><path d="M8.5 8.5c-.7-.7-1.8-.7-2.5 0s-.7 1.8 0 2.5l5.5 5.5c.7.7 1.8.7 2.5 0s.7-1.8 0-2.5z" />
    </svg>
  )},
  { text: 'Express Delivery in 45 Minutes — Karachi only',                   cta: 'Order Now',  action: 'scroll', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  )},
]

export default function AnnouncementBar() {
  const [idx, setIdx] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % MESSAGES.length), 5000)
    return () => clearInterval(t)
  }, [])

  function handleCta(action: string) {
    if (action === 'scroll') {
      if (window.location.pathname === '/') {
        document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else {
        router.push('/')
        setTimeout(() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 600)
      }
    } else {
      router.push('/services')
    }
  }

  const msg = MESSAGES[idx]

  return (
    <div
      className="text-white text-[11px] font-bold text-center py-2.5 px-4 overflow-hidden border-b border-white/10"
      style={{
        background: 'linear-gradient(90deg, #0a1050, #1220a8, #0a1050)',
        backgroundSize: '200% 100%',
        animation: 'gradientFlow 12s ease-in-out infinite',
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          className="inline-flex items-center gap-3 font-poppins tracking-[0.05em] uppercase"
        >
          <span className="opacity-80">{msg.icon}</span>
          <span>{msg.text}</span>
          <button
            onClick={() => handleCta(msg.action)}
            className="group flex items-center gap-1.5 bg-white/10 hover:bg-white/20 transition-all duration-300 px-3 py-1 rounded-full text-[10px] border border-white/20 ml-2"
          >
            {msg.cta}
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
