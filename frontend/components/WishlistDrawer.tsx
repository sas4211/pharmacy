'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { useWishlist, useCart, useToast } from '@/store'
import { mapProductImage } from '@/lib/images'

export default function WishlistDrawer() {
  const { items, open, closeWishlist, removeItem } = useWishlist()
  const cart  = useCart()
  const toast = useToast()

  function moveToCart(idx: number) {
    const item = items[idx]
    if (!item) return
    removeItem(idx)
    cart.addItem({ name: item.name, emoji: item.emoji, price: item.price, product_id: item.product_id })
    toast.show(`${item.name} moved to cart!`)
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="wl-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-[1400]"
            onClick={closeWishlist}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {open && (
          <motion.div
            key="wl-drawer"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-[380px] bg-white z-[1500] shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-light-gray">
              <h3 className="font-poppins font-bold text-lg text-charcoal">
                Wishlist <span className="text-brand-blue">({items.length})</span>
              </h3>
              <button onClick={closeWishlist} className="text-mid-gray hover:text-charcoal text-xl font-bold">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-mid-gray">
                  <span className="text-5xl">♡</span>
                  <p className="font-inter">Your wishlist is empty</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item, idx) => (
                    <motion.div
                      key={item.name + idx}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 p-3 bg-off-white rounded-xl"
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-white flex items-center justify-center shadow-sm shrink-0 select-none border border-black/5">
                        <img 
                          src={mapProductImage(item.name)} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-poppins font-semibold text-sm text-charcoal truncate">{item.name}</h4>
                        <button
                          onClick={() => moveToCart(idx)}
                          className="text-xs text-brand-blue font-bold mt-0.5 font-poppins"
                        >Move to Cart</button>
                      </div>
                      <button
                        onClick={() => removeItem(idx)}
                        className="text-mid-gray hover:text-red-500 text-sm shrink-0 transition"
                      >✕</button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
