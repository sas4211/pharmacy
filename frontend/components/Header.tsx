'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart, useWishlist, useAuth, useSearch } from '@/store'
import { productsApi } from '@/lib/api'
import { UserButton, useUser } from '@clerk/nextjs'
import type { Product } from '@/types'

const NAV_CATS = [
  { label: 'Medicine' },
  { label: 'Nutrition & Supplements' },
  { label: 'Skin Care' },
  { label: 'Baby Care' },
  { label: 'Medical Devices' },
  { label: 'Mother Care' },
  { label: 'Sexual Wellness' },
  { label: 'General Health' },
]

export default function Header() {
  const cart     = useCart()
  const wl       = useWishlist()
  const { user, openAuth } = useAuth()
  const search   = useSearch()
  const { user: clerkUser } = useUser()
  const [scrolled, setScrolled]   = useState(false)
  const [mobileOpen, setMobile]   = useState(false)
  const [activeNav, setActiveNav] = useState(0)
  const [query, setQuery]         = useState('')
  const [results, setResults]     = useState<Product[]>([])
  const [acOpen, setAcOpen]       = useState(false)
  // SSR-safe badge counts — hydrate from store only after mount
  const [cartCount, setCartCount]     = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const searchRef = useRef<HTMLDivElement>(null)

  // Keep badge counts in sync without SSR mismatch
  useEffect(() => {
    setCartCount(cart.count())
  }, [cart.items])

  useEffect(() => {
    setWishlistCount(wl.items.length)
  }, [wl.items])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setAcOpen(false)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  useEffect(() => {
    if (query.length < 2) { setAcOpen(false); return }
    const t = setTimeout(async () => {
      const res = await productsApi.list({ search: query, limit: 6 })
      if (res.ok && Array.isArray(res.data)) { setResults(res.data as Product[]); setAcOpen(true) }
    }, 280)
    return () => clearTimeout(t)
  }, [query])

  function handleSearchSelect(name: string) {
    setQuery(name)
    setAcOpen(false)
    search.setQuery(name)
  }

  function handleSearchSubmit() {
    setAcOpen(false)
    search.setQuery(query)
  }

  function handleCategoryClick(idx: number, label: string) {
    setActiveNav(idx)
    search.setCategory(activeNav === idx ? null : label)
  }

  return (
    <header
      className={`sticky top-0 z-[1000] transition-all duration-500 ${scrolled ? 'bg-white/85 backdrop-blur-xl shadow-[0_4px_40px_rgba(26,63,212,.12)] border-b border-light-gray/50' : 'bg-white shadow-[0_2px_20px_rgba(26,63,212,.08)]'}`}
      style={{ transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)' }}
    >
      <div className="w-[92%] max-w-[1280px] mx-auto">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-5 py-3.5">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shadow-[0_4px_14px_rgba(26,63,212,.3)] animate-pulse-glow"
              style={{ background: 'linear-gradient(135deg,#1230a8,#1a3fd4,#7b2d8b)' }}
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2v-5h2v5zm0-7h-2V7h2v2z"/>
              </svg>
            </div>
            <div className="font-poppins leading-tight">
              <span
                className="block text-[1.1rem] font-extrabold"
                style={{ background: 'linear-gradient(135deg,#1230a8,#1a3fd4,#7b2d8b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >Hussain Healthcare</span>
              <span className="block text-[0.65rem] font-medium text-mid-gray tracking-widest uppercase">Your Trusted Pharmacy</span>
            </div>
          </Link>

          {/* Search */}
          <div className="relative hidden md:block" ref={searchRef}>
            <div className={`flex items-center bg-off-white border rounded-xl overflow-hidden transition-colors ${acOpen ? 'border-brand-blue' : 'border-light-gray'}`}>
              <input
                type="text" value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearchSubmit()}
                placeholder="Search medicines, vitamins, devices…"
                className="flex-1 border-none bg-transparent outline-none px-4 py-2.5 text-sm font-inter text-charcoal placeholder-mid-gray"
              />
              <button
                onClick={handleSearchSubmit}
                className="px-4 py-2.5 text-white flex items-center"
                style={{ background: 'linear-gradient(135deg,#1230a8,#1a3fd4,#7b2d8b)' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </button>
            </div>
            <AnimatePresence>
              {acOpen && results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="absolute top-full left-0 right-0 bg-white rounded-xl shadow-2xl border border-light-gray mt-1 z-50 overflow-hidden"
                >
                  <div className="px-4 py-2 text-xs font-semibold text-mid-gray uppercase tracking-wide border-b border-light-gray">Suggestions</div>
                  {results.map(p => (
                    <button
                      key={p.id}
                      onClick={() => handleSearchSelect(p.name)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-off-white text-left transition"
                    >
                      <span className="text-xl">{p.emoji ?? '💊'}</span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm font-inter text-charcoal truncate">{p.name}</span>
                        <span className="text-xs text-mid-gray">{p.category?.name ?? 'Product'}</span>
                      </span>
                      <span className="text-sm font-poppins font-bold text-brand-red shrink-0">
                        Rs. {Number(p.price).toLocaleString()}
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {clerkUser ? (
              <div className="flex items-center gap-1.5">
                <Link href="/dashboard"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-brand-blue bg-blue-50 hover:bg-blue-100 transition font-poppins font-bold text-xs">
                  ⚡ Dashboard
                </Link>
                <UserButton appearance={{ elements: { avatarBox: 'w-9 h-9 rounded-xl' } }} />
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link href="/sign-in"
                  className="hidden sm:block text-xs font-poppins font-bold text-brand-blue px-3 py-1.5 rounded-xl hover:bg-blue-50 transition">
                  Sign In
                </Link>
                <Link href="/sign-up"
                  className="hidden sm:block text-xs font-poppins font-bold text-white px-3 py-1.5 rounded-xl transition"
                  style={{ background: 'linear-gradient(135deg,#1230a8,#1a3fd4)' }}>
                  Register
                </Link>
                <button
                  onClick={() => openAuth('login')}
                  className="sm:hidden w-9 h-9 rounded-xl flex items-center justify-center text-charcoal hover:bg-off-white transition"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                </button>
              </div>
            )}

            <button
              onClick={wl.openWishlist}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-charcoal hover:bg-off-white transition relative"
              title="Wishlist"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-red text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              onClick={cart.openCart}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-charcoal hover:bg-off-white transition relative"
              title="Cart"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-blue text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobile(m => !m)}
              className="w-10 h-10 rounded-xl flex flex-col items-center justify-center gap-1.5 md:hidden hover:bg-off-white transition-all duration-300 relative"
            >
              <span className={`block w-5 h-0.5 bg-charcoal transition-all duration-500 rounded-full ${mobileOpen ? 'rotate-45 translate-y-[4px]' : ''}`}/>
              <span className={`block w-5 h-0.5 bg-charcoal transition-all duration-500 rounded-full ${mobileOpen ? 'opacity-0 scale-0' : ''}`}/>
              <span className={`block w-5 h-0.5 bg-charcoal transition-all duration-500 rounded-full ${mobileOpen ? '-rotate-45 -translate-y-[4px]' : ''}`}/>
            </button>
          </div>
        </div>
      </div>

      {/* Category nav */}
      <nav className="border-t border-black/[0.04] bg-white">
        <div className="w-[92%] max-w-[1280px] mx-auto overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 py-3 min-w-max">
            {NAV_CATS.map((cat, i) => (
              <button
                key={cat.label}
                onClick={() => handleCategoryClick(i, cat.label)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] uppercase tracking-widest font-bold transition-all duration-500 whitespace-nowrap
                  ${activeNav === i && search.activeCategory === cat.label ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-charcoal hover:bg-black/[0.03]'}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
            className="md:hidden border-t border-light-gray overflow-hidden bg-white shadow-2xl"
          >
            <div className="p-6 space-y-3">
              {[
                { label: 'Home', href: '/' },
                { label: 'Clinical Services', href: '/services' },
                { label: 'Arrange For Me', href: '#' },
                { label: 'Dow Lab Tests', href: '#' },
                { label: 'Blogs & Articles', href: '/articles' },
                { label: 'Returns & Refunds', href: '/returns' },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                >
                  <Link href={item.href} className="flex items-center gap-3 px-5 py-3.5 rounded-2xl hover:bg-blue-50 font-poppins font-bold text-sm text-charcoal transition-all duration-300 border border-transparent hover:border-blue-100">
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
