'use client'
import { motion } from 'framer-motion'
import { useRecent, useCart, useToast } from '@/store'
import { mapProductImage } from '@/lib/images'

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
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-off-white flex items-center justify-center mb-2 select-none border border-black/5">
                <img 
                  src={mapProductImage(item.name)} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                />
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
