'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useCart, useToast } from '@/store'
import { mapProductImage } from '@/lib/images'

const FLASH_PRODUCTS = [
  { emoji: '🧴', brand: 'Neutrogena', name: 'Hydro Boost Water Gel 50ml', price: 1400, was: 2000, discount: 30, sold: 72, left: 8,
    desc: 'Oil-free gel with hyaluronic acid — intense hydration for all skin types' },
  { emoji: '💊', brand: 'Pfizer', name: 'Vitamin C 1000mg Effervescent (10s)', price: 375, was: 500, discount: 25, sold: 55, left: 18,
    desc: 'High-dose Vitamin C for immunity, energy & collagen production' },
  { emoji: '🩺', brand: 'Dr. Morepen', name: 'Digital Thermometer Pro', price: 640, was: 800, discount: 20, sold: 88, left: 3,
    desc: 'Fast 10-second reading with flexible tip — clinically accurate' },
  { emoji: '✨', brand: "L'Oréal", name: 'Revitalift Day Cream SPF 30', price: 1560, was: 2400, discount: 35, sold: 40, left: 24,
    desc: 'Anti-ageing SPF moisturiser with Pro-Retinol — dermatologist tested' },
  { emoji: '🥗', brand: 'Centrum', name: 'Adults Complete Multivitamin (30s)', price: 980, was: 1400, discount: 30, sold: 63, left: 11,
    desc: '26 vitamins & minerals in one tablet — complete daily nutrition' },
  { emoji: '🧴', brand: 'CeraVe', name: 'Foaming Facial Cleanser 236ml', price: 1650, was: 2100, discount: 21, sold: 45, left: 20,
    desc: 'Non-comedogenic cleanser with ceramides for oily & normal skin' },
]

function pad(n: number) { return String(n).padStart(2, '0') }

export default function FlashSale() {
  const cart  = useCart()
  const toast = useToast()
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 })
  const [adding, setAdding] = useState<string | null>(null)

  useEffect(() => {
    function tick() {
      const end = new Date(); end.setHours(23, 59, 59, 0)
      const diff = Math.max(0, end.getTime() - Date.now())
      setTime({ h: Math.floor(diff / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) })
    }
    tick(); const t = setInterval(tick, 1000); return () => clearInterval(t)
  }, [])

  function addToCart(p: typeof FLASH_PRODUCTS[0]) {
    cart.addItem({ name: p.name, emoji: p.emoji, price: p.price })
    toast.show(`${p.name} added to cart!`)
    setAdding(p.name)
    setTimeout(() => setAdding(null), 1200)
  }

  return (
    <section className="py-12 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0d2b94 0%, #1a3fd4 40%, #7b2d8b 100%)' }}>
      <div className="w-[92%] max-w-[1280px] mx-auto">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <span className="inline-block bg-[#e63946] text-white text-xs font-bold px-3 py-1 rounded-full mb-2 tracking-wide font-poppins animate-flash-pulse">
              ⚡ FLASH SALE — Today Only
            </span>
            <h2 className="font-poppins font-extrabold text-white text-2xl">Today&apos;s Hot Deals</h2>
            <p className="text-white/60 font-inter text-sm mt-1">Hand-picked by our pharmacists — limited stock</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/70 text-sm font-inter">Ends in:</span>
            {[{ v: time.h, l: 'HRS' }, { v: time.m, l: 'MIN' }, { v: time.s, l: 'SEC' }].map((t, i) => (
              <div key={t.l} className="flex items-center gap-1">
                {i > 0 && <span className="text-white/50 font-bold text-lg">:</span>}
                <div className="bg-white/15 backdrop-blur-sm rounded-xl px-3 py-2 text-center min-w-[52px] border border-white/20">
                  <div className="font-poppins font-extrabold text-white text-xl tabular-nums">{pad(t.v)}</div>
                  <div className="text-white/60 text-[9px] font-semibold tracking-widest">{t.l}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {FLASH_PRODUCTS.map((p, i) => {
            const isAdding = adding === p.name
            const urgency = p.left <= 5
            return (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, ease: [0.32, 0.72, 0, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.35, ease: [0.32, 0.72, 0, 1] } }}
                className="group p-1.5 bg-[#050508] border border-white/10 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.4)] flex flex-col h-full"
              >
                {/* Double Bezel Inner Core */}
                <div className="bg-white/[0.02] rounded-[18px] overflow-hidden flex flex-col flex-1 p-4">
                  {/* Product Image Bezel with overlay badge */}
                  <div className="relative rounded-2xl h-32 overflow-hidden bg-black/10 select-none mb-3">
                    <img 
                      src={mapProductImage(p.name)} 
                      alt={p.name} 
                      className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-110"
                    />
                    <span className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-rose-600 text-white text-[9px] font-bold px-2 py-1 rounded-lg font-poppins shadow-md">
                      -{p.discount}%
                    </span>
                  </div>
                  <div className="text-[10px] text-white/40 font-inter font-bold uppercase tracking-wider mt-2">{p.brand}</div>
                  <div className="font-poppins font-semibold text-sm text-white mt-1 leading-snug flex-1">{p.name}</div>
                  <p className="text-[11px] text-white/60 font-inter mt-1.5 leading-snug line-clamp-2">{p.desc}</p>
                  <div className="flex items-baseline gap-2 mt-3">
                    <span className="font-poppins font-bold text-base text-rose-400">Rs. {p.price.toLocaleString()}</span>
                    <span className="text-xs text-white/30 line-through">Rs. {p.was.toLocaleString()}</span>
                  </div>
                  {/* Stock bar */}
                  <div className="mt-3.5 bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${urgency ? 'bg-gradient-to-r from-red-500 to-rose-500 shadow-[0_0_10px_#f43f5e]' : 'bg-gradient-to-r from-blue-500 to-teal-500'}`} style={{ width: `${p.sold}%` }} />
                  </div>
                  <div className={`text-[10px] font-inter mt-1.5 ${urgency ? 'text-rose-400 font-bold animate-pulse' : 'text-white/40'}`}>
                    {urgency ? `🔥 Only ${p.left} left!` : `${p.sold}% sold — ${p.left} remaining`}
                  </div>
                  <button
                    onClick={() => addToCart(p)}
                    className={`mt-4 w-full py-2.5 rounded-xl text-white font-poppins font-bold text-xs transition ${isAdding ? 'bg-green-500' : 'hover:opacity-90 shadow-md'}`}
                    style={!isAdding ? { background: 'linear-gradient(135deg,#0a1050,#1220a8)' } : {}}
                  >
                    {isAdding ? '✓ Added!' : 'Add to Cart'}
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
