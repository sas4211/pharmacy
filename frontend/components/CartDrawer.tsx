'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useCart, useAuth, useToast } from '@/store'
import PaymentBadges from './PaymentBadges'
import { mapProductImage } from '@/lib/images'

export default function CartDrawer() {
  const router = useRouter()
  const { items, open, closeCart, removeItem, updateQty, count, total } = useCart()
  const { user, openAuth } = useAuth()
  const toast = useToast()

  function handleCheckout() {
    if (!user) {
      closeCart()
      openAuth('login')
      toast.show('Please sign in to checkout')
      return
    }
    closeCart()
    router.push('/checkout')
  }

  const cartTotal = total()
  const cartCount = count()

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="cart-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-[1400]"
            onClick={closeCart}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {open && (
          <motion.div
            key="cart-drawer"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-[400px] bg-white z-[1500] shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-light-gray">
              <h3 className="font-poppins font-bold text-lg text-charcoal">
                Your Cart <span className="text-brand-blue">({cartCount})</span>
              </h3>
              <button onClick={closeCart} className="text-mid-gray hover:text-charcoal text-xl font-bold">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-5 text-mid-gray">
                  <div className="w-20 h-20 bg-off-white rounded-full flex items-center justify-center text-mid-gray">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
                      <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
                      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                    </svg>
                  </div>
                  <p className="font-poppins font-bold text-sm tracking-widest uppercase opacity-40">Your cart is empty</p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  <div className="space-y-4">
                    {items.map((item, idx) => (
                      <motion.div
                        key={item.name + idx}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center gap-4 p-4 bg-off-white/50 rounded-2xl border border-black/[0.03] hover:bg-off-white transition-colors duration-300"
                      >
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-white flex items-center justify-center shadow-sm shrink-0 border border-black/[0.05] select-none">
                          <img 
                            src={mapProductImage(item.name)} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-poppins font-semibold text-sm text-charcoal truncate">{item.name}</h4>
                          <p className="text-xs text-mid-gray mt-0.5">
                            Rs. {(item.price * item.qty).toLocaleString()}
                          </p>
                          {/* Qty controls */}
                          <div className="flex items-center gap-2 mt-1.5">
                            <button
                              onClick={() => updateQty(idx, item.qty - 1)}
                              className="w-6 h-6 rounded-md bg-white border border-light-gray text-charcoal text-sm font-bold flex items-center justify-center hover:border-brand-blue hover:text-brand-blue transition"
                            >−</button>
                            <span className="text-xs font-poppins font-bold text-charcoal w-4 text-center">{item.qty}</span>
                            <button
                              onClick={() => updateQty(idx, item.qty + 1)}
                              className="w-6 h-6 rounded-md bg-white border border-light-gray text-charcoal text-sm font-bold flex items-center justify-center hover:border-brand-blue hover:text-brand-blue transition"
                            >+</button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(idx)}
                          className="text-mid-gray hover:text-red-500 text-sm shrink-0 transition p-1"
                        >✕</button>
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-light-gray p-5">
                {/* Subtotal */}
                <div className="flex justify-between items-center mb-1">
                  <span className="font-inter text-mid-gray text-sm">Subtotal</span>
                  <span className="font-poppins font-bold text-lg text-brand-blue">
                    Rs. {cartTotal.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-mid-gray font-inter mb-4">Delivery calculated at checkout</p>

                {/* Checkout button */}
                <button
                  onClick={handleCheckout}
                  className="w-full py-3 rounded-xl text-white font-poppins font-bold text-sm transition hover:opacity-90 active:scale-[.98]"
                  style={{ background: 'linear-gradient(135deg,#1230a8,#1a3fd4,#7b2d8b)' }}
                >
                  Proceed to Checkout →
                </button>

                {/* Payment methods */}
                <div className="mt-4 pt-4 border-t border-light-gray">
                  <p className="text-[10px] font-inter text-mid-gray uppercase tracking-widest mb-2">
                    We Accept
                  </p>
                  <PaymentBadges size="sm" theme="light" />
                </div>

                {/* Security note */}
                <div className="flex items-center gap-1.5 mt-3">
                  <svg viewBox="0 0 16 16" className="w-3 h-3 shrink-0 text-mid-gray" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M8 1L2 4v4c0 3.3 2.5 6.4 6 7 3.5-.6 6-3.7 6-7V4L8 1z"/>
                  </svg>
                  <p className="text-[10px] font-inter text-mid-gray">
                    256-bit SSL encrypted · Safe &amp; secure checkout
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
