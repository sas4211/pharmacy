'use client'
import { motion } from 'framer-motion'
import { useRecent, useCart, useToast } from '@/store'

export default function RecentlyViewed() {
  const { items } = useRecent()
  const cart  = useCart()
  const toast = useToast()
  if (!items.length) return null

  return (
    <section className="py-10 bg-off-white">
      <div className="w-[92%] max-w-[1280px] mx-auto">
        <h2 className="font-poppins font-black text-xl tracking-tight gradient-text-brand mb-5">Recently Viewed</h2>
        <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory">
          {items.map((item, i) => (
            <motion.div
              key={item.name + i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}
              className="snap-start shrink-0 bg-white rounded-[18px] p-4 w-40 shadow-card ring-1 ring-black/[0.03] flex flex-col items-center gap-2 text-center hover:shadow-card-hover transition-all"
              style={{ transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)' }}
            >
              <div className="w-12 h-12 rounded-xl bg-off-white flex items-center justify-center text-blue-600 mb-2">
                {item.emoji || (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m14.5 9.5-5 5" /><path d="M8.5 8.5c-.7-.7-1.8-.7-2.5 0s-.7 1.8 0 2.5l5.5 5.5c.7.7 1.8.7 2.5 0s.7-1.8 0-2.5z" /></svg>
                )}
              </div>
              <div className="font-poppins font-semibold text-xs text-charcoal leading-snug">{item.name}</div>
              <div className="font-poppins font-bold text-sm text-brand-red">Rs. {item.price.toLocaleString()}</div>
              <button
                onClick={() => { cart.addItem({ name: item.name, emoji: item.emoji, price: item.price }); toast.show(`${item.name} added to cart!`) }}
                className="w-full py-1.5 rounded-lg text-white font-poppins font-bold text-[11px]"
                style={{ background: 'linear-gradient(135deg,#1230a8,#1a3fd4)' }}
              >Add to Cart</button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
