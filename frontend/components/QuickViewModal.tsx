'use client'
import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useCart, useWishlist, useToast, useRecent } from '@/store'
import { mapProductImage } from '@/lib/images'

export interface QuickViewProduct {
  name: string
  emoji?: string
  iconType?: string
  brand?: string
  rating?: number
  price: number
  was?: number
  desc?: string
  product_id?: number
}

interface Props {
  product: QuickViewProduct | null
  onClose: () => void
}

export default function QuickViewModal({ product, onClose }: Props) {
  const [qty, setQty] = useState(1)
  const cart     = useCart()
  const wl       = useWishlist()
  const toast    = useToast()
  const recent   = useRecent()
  const inWl     = product ? wl.hasItem(product.name) : false

  useEffect(() => {
    if (product) { setQty(1); recent.add(product) }
  }, [product])

  if (!product) return null

  const stars = '★'.repeat(Math.floor(product.rating ?? 4.5)) + ((product.rating ?? 4.5) % 1 >= 0.5 ? '½' : '')

  function addToCart() {
    cart.addItem({ name: product!.name, emoji: product!.emoji, price: product!.price, product_id: product!.product_id, qty })
    toast.show(`${product!.name} × ${qty} added to cart!`)
    onClose()
  }

  function toggleWishlist() {
    const added = wl.toggle({ name: product!.name, emoji: product!.emoji, price: product!.price, product_id: product!.product_id })
    toast.show(added ? `${product!.name} saved to wishlist!` : `${product!.name} removed from wishlist`)
  }

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            key="qv-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/55 z-[1800]"
            onClick={onClose}
          />
          <motion.div
            key="qv-modal"
            initial={{ opacity: 0, scale: 0.88, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            className="fixed inset-0 flex items-center justify-center z-[1900] px-4"
          >
            <div className="bg-white rounded-[18px] p-6 w-full max-w-lg shadow-2xl relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-mid-gray hover:text-charcoal text-xl font-bold"
              >✕</button>
              <div className="flex gap-6 items-start">
                <div className="w-32 h-32 bg-off-white rounded-2xl overflow-hidden flex items-center justify-center shrink-0 select-none border border-black/5">
                  <img 
                    src={mapProductImage(product.name)} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-mid-gray font-inter uppercase tracking-wide">{product.brand}</p>
                  <h3 className="font-poppins font-bold text-lg text-charcoal mt-0.5 leading-snug">{product.name}</h3>
                  <div className="text-yellow-400 text-sm mt-1">{stars}</div>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="font-poppins font-bold text-xl text-brand-blue">
                      Rs. {product.price.toLocaleString()}
                    </span>
                    {product.was && (
                      <span className="text-sm text-mid-gray line-through">Rs. {product.was.toLocaleString()}</span>
                    )}
                  </div>
                  {product.desc && (
                    <p className="text-sm text-mid-gray font-inter mt-2 leading-relaxed">{product.desc}</p>
                  )}
                  <div className="flex items-center gap-3 mt-4">
                    <span className="text-sm font-inter text-charcoal">Qty:</span>
                    <div className="flex items-center border border-light-gray rounded-xl overflow-hidden">
                      <button
                        onClick={() => setQty(q => Math.max(1, q - 1))}
                        className="w-9 h-9 flex items-center justify-center text-mid-gray hover:bg-off-white font-bold text-lg"
                      >−</button>
                      <span className="w-10 text-center font-poppins font-semibold text-sm">{qty}</span>
                      <button
                        onClick={() => setQty(q => q + 1)}
                        className="w-9 h-9 flex items-center justify-center text-mid-gray hover:bg-off-white font-bold text-lg"
                      >+</button>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={addToCart}
                      className="flex-1 py-2.5 rounded-xl text-white font-poppins font-bold text-sm"
                      style={{ background: 'linear-gradient(135deg,#1230a8,#1a3fd4,#7b2d8b)' }}
                    >Add to Cart</button>
                    <button
                      onClick={toggleWishlist}
                      className={`w-11 h-11 rounded-xl border flex items-center justify-center text-xl transition
                        ${inWl ? 'bg-red-50 border-red-200 text-red-500' : 'border-light-gray text-mid-gray hover:text-red-400'}`}
                    >{inWl ? '♥' : '♡'}</button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
