'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useCart, useWishlist, useToast, useSearch } from '@/store'
import { productsApi } from '@/lib/api'
import QuickViewModal, { type QuickViewProduct } from './QuickViewModal'
import ParticleButton from '@/components/ParticleButton'
import type { Product } from '@/types'
import { mapProductImage } from '@/lib/images'

const STATIC_PRODUCTS: QuickViewProduct[] = [
  { name: 'Moisturising Cream 250ml', iconType: 'skin', brand: 'CeraVe', price: 1850, was: 2200, rating: 4.5, desc: 'Lightweight, non-greasy moisturising cream developed with dermatologists. Contains hyaluronic acid and 3 essential ceramides.' },
  { name: 'Brufen 400mg Tablets (20s)', iconType: 'medicine', brand: 'Abbott', price: 180, rating: 4.7, desc: 'Brufen 400mg contains ibuprofen. Used for pain relief, fever reduction and anti-inflammatory treatment.' },
  { name: 'Blood Glucose Monitor Kit', iconType: 'device', brand: 'Accu-Chek', price: 4500, was: 5200, rating: 4.8, desc: 'Accu-Chek Instant blood glucose monitor with Bluetooth connectivity. Get results in 4 seconds.' },
  { name: 'Silver Multivitamin Adults 50+ (60 Tabs)', iconType: 'nutrition', brand: 'Centrum', price: 2100, rating: 4.6, desc: 'Complete multivitamin for adults 50+. Contains vitamins A, C, D, E, K and essential minerals including calcium and zinc.' },
  { name: 'Neem Face Wash 150ml', iconType: 'skin', brand: 'Himalaya', price: 420, was: 550, rating: 4.4, desc: 'Natural neem face wash that purifies skin, prevents pimples and keeps skin clean and fresh throughout the day.' },
  { name: 'Stage 1 Infant Formula 400g', iconType: 'baby', brand: 'Aptamil', price: 3200, rating: 4.9, desc: 'Aptamil Stage 1 is a whey-based infant formula for babies from birth. Enriched with DHA, ARA and prebiotics for healthy development.' },
  { name: 'Upper Arm Blood Pressure Monitor', iconType: 'device', brand: 'Philips', price: 7800, was: 9000, rating: 4.7, desc: 'Clinically validated upper arm blood pressure monitor with irregular heartbeat detection and memory for 2 users.' },
  { name: 'Omega-3 Fish Oil 1000mg (60 Caps)', iconType: 'nutrition', brand: "Nature's Way", price: 1650, rating: 4.5, desc: 'High-quality fish oil supplement providing 1000mg EPA & DHA per capsule. Supports heart, brain and joint health.' },
]

function stars(r: number) {
  return '★'.repeat(Math.floor(r)) + (r % 1 >= 0.5 ? '½' : '')
}

function mapIcon(p: Product): string {
  const cat = p.category?.name?.toLowerCase() || ''
  if (cat.includes('skin')) return 'skin'
  if (cat.includes('baby')) return 'baby'
  if (cat.includes('device')) return 'device'
  if (cat.includes('nutrition') || cat.includes('suppl')) return 'nutrition'
  if (cat.includes('mother')) return 'mother'
  return 'medicine'
}

function ProductIcon({ type, className }: { type?: string, className?: string }) {
  const icons: Record<string, React.ReactNode> = {
    skin: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-full h-full">
        <path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-11-7-11S5 10.7 5 15a7 7 0 0 0 7 7z" />
      </svg>
    ),
    baby: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-full h-full">
        <path d="M10 22h4M12 18v4M9 10a3 3 0 0 1 6 0M12 2v4M12 6a8 8 0 0 0-8 8v4h16v-4a8 8 0 0 0-8-8z" />
      </svg>
    ),
    device: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-full h-full">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    nutrition: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-full h-full">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    mother: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-full h-full">
        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" /><path d="M12 7v10M8 11h8" />
      </svg>
    ),
    medicine: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-full h-full">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m14.5 9.5-5 5" /><path d="M8.5 8.5c-.7-.7-1.8-.7-2.5 0s-.7 1.8 0 2.5l5.5 5.5c.7.7 1.8.7 2.5 0s.7-1.8 0-2.5z" />
      </svg>
    )
  }
  return <div className={className}>{icons[type || 'medicine'] || icons.medicine}</div>
}

function SkeletonCard() {
  return (
    <div className="bg-off-white rounded-[18px] overflow-hidden shadow-card flex flex-col animate-pulse">
      <div className="bg-gray-200 h-36" />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-3 bg-gray-200 rounded w-1/4" />
        <div className="h-4 bg-gray-200 rounded w-4/5" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="h-4 bg-gray-200 rounded w-1/3 mt-2" />
        <div className="h-8 bg-gray-200 rounded-xl mt-3" />
      </div>
    </div>
  )
}

export default function ProductsGrid() {
  const cart    = useCart()
  const wl      = useWishlist()
  const toast   = useToast()
  const { query, activeCategory } = useSearch()
  const [products, setProducts] = useState<QuickViewProduct[]>(STATIC_PRODUCTS)
  const [loading, setLoading]   = useState(false)
  const [qv, setQv]             = useState<QuickViewProduct | null>(null)
  const [adding, setAdding]     = useState<string | null>(null)

  useEffect(() => {
    const params: Record<string, string | number | boolean> = { limit: 8 }
    if (query) {
      params.search = query
    } else if (activeCategory) {
      params.category = activeCategory
    } else {
      params.featured = true
    }

    setLoading(true)
    productsApi.list(params).then(res => {
      if (res.ok && Array.isArray(res.data) && (res.data as Product[]).length > 0) {
        setProducts((res.data as Product[]).map(p => ({
          product_id: p.id,
          name: p.name,
          iconType: mapIcon(p),
          brand: p.brand?.name,
          price: Number(p.price),
          was: p.original_price ? Number(p.original_price) : undefined,
          rating: Number(p.rating),
          desc: p.description ?? undefined,
        })))
      } else if (!res.ok) {
        setProducts(STATIC_PRODUCTS)
      }
      setLoading(false)
    })
  }, [query, activeCategory])

  function addToCart(p: QuickViewProduct) {
    cart.addItem({ name: p.name, price: p.price, product_id: p.product_id })
    toast.show(`${p.name} added to cart!`)
    setAdding(p.name)
    setTimeout(() => setAdding(null), 1200)
  }

  function toggleWishlist(p: QuickViewProduct) {
    const added = wl.toggle({ name: p.name, price: p.price, product_id: p.product_id })
    toast.show(added ? `${p.name} saved to wishlist!` : `${p.name} removed from wishlist`)
  }

  const title = query
    ? `Results for "${query}"`
    : activeCategory
      ? activeCategory
      : 'Featured Products'

  return (
    <section id="products-section" className="py-14 bg-white">
      <div className="w-[92%] max-w-[1280px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-poppins font-black text-2xl tracking-tight gradient-text-brand">{title}</h2>
          <a href="#" className="text-brand-blue font-semibold text-sm font-inter hover:underline">View All →</a>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {products.length === 0 ? (
              <div className="col-span-full text-center py-16 text-mid-gray font-inter">
                                <p>No products found for &quot;{query || activeCategory}&quot;</p>
              </div>
            ) : products.map((p, i) => {
              const inWl = wl.hasItem(p.name)
              const isAdding = adding === p.name
              return (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, ease: [0.32, 0.72, 0, 1] }}
                  whileHover={{ y: -6, transition: { duration: 0.35, ease: [0.32, 0.72, 0, 1] } }}
                  className="group p-1.5 bg-white ring-1 ring-black/[0.03] rounded-[24px] shadow-[0_4px_24px_rgba(26,63,212,.04)] hover:shadow-[0_16px_40px_rgba(26,63,212,.12)] transition-all duration-500 flex flex-col h-full"
                >
                  {/* Double Bezel Inner Core */}
                  <div className="bg-off-white/30 rounded-[18px] overflow-hidden flex flex-col flex-1">
                    <div className="relative bg-white flex items-center justify-center h-36 overflow-hidden select-none">
                      <img 
                        src={mapProductImage(p.name)} 
                        alt={p.name} 
                        className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-110"
                      />
                      {p.was && (
                        <span className="absolute top-3 left-3 bg-brand-red text-white text-[9px] font-bold px-2 py-0.5 rounded-lg font-poppins">Sale</span>
                      )}
                      <button
                        onClick={() => toggleWishlist(p)}
                        className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all shadow-sm
                          ${inWl ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-white text-mid-gray hover:text-red-400 border border-black/5'}`}
                      >{inWl ? '♥' : '♡'}</button>
                      <button
                        onClick={() => setQv(p)}
                        className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/95 text-brand-blue text-[10px] font-poppins font-bold px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition backdrop-blur-sm shadow-md whitespace-nowrap"
                      >Quick View</button>
                    </div>
                    <div className="p-4 flex flex-col flex-1 bg-white border-t border-black/[0.02]">
                      <div className="text-[10px] text-mid-gray font-inter font-bold uppercase tracking-wide">{p.brand}</div>
                      <div className="text-[10px] text-yellow-400 mt-0.5">{stars(p.rating ?? 4.5)}</div>
                      <div className="font-poppins font-bold text-sm text-charcoal mt-1 leading-snug flex-1">{p.name}</div>
                      <div className="flex items-baseline gap-1.5 mt-2">
                        <span className="font-poppins font-bold text-base text-brand-blue">Rs. {p.price.toLocaleString()}</span>
                        {p.was && <span className="text-xs text-mid-gray line-through">Rs. {p.was.toLocaleString()}</span>}
                      </div>
                      <div className="flex gap-2 mt-4">
                        <ParticleButton
                          onClick={() => addToCart(p)}
                          color="#1220a8"
                          type="particles"
                          className={`flex-1 py-2.5 rounded-xl text-white font-poppins font-bold text-xs transition
                            ${isAdding ? 'bg-green-500' : ''}`}
                          style={!isAdding ? { background: 'linear-gradient(135deg,#0a1050,#1220a8)' } : {}}
                        >
                          {isAdding ? '✓ Added!' : 'Add to Cart'}
                        </ParticleButton>
                        <button
                          onClick={() => setQv(p)}
                          className="w-9 h-9 rounded-xl border border-light-gray bg-off-white/40 flex items-center justify-center text-mid-gray hover:border-brand-blue hover:text-brand-blue transition text-xs font-bold shadow-sm"
                          title="Quick View"
                        >👁</button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
      <QuickViewModal product={qv} onClose={() => setQv(null)} />
    </section>
  )
}
