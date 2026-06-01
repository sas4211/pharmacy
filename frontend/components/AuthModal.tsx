'use client'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuth, useToast, useCart, useWishlist } from '@/store'
import { authApi, cartApi, wishlistApi, setTokens, clearTokens } from '@/lib/api'
import type { User, CartItem, WishlistItem } from '@/types'

export default function AuthModal() {
  const { user, authOpen, authMode, closeAuth, setUser, toggleAuthMode } = useAuth()
  const toast = useToast()
  const cart  = useCart()
  const wl    = useWishlist()

  const [fullName, setFullName] = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function syncFromServer() {
    const [cartRes, wlRes] = await Promise.all([cartApi.get(), wishlistApi.get()])
    if (cartRes.ok && cartRes.data) {
      const d = cartRes.data as { items: { id: number; product_id?: number | null; product_name: string; product_emoji?: string; unit_price: number; qty: number }[] }
      cart.setItems(d.items.map((i) => ({
        id: i.id, product_id: i.product_id, name: i.product_name,
        emoji: i.product_emoji ?? '💊', price: Number(i.unit_price), qty: i.qty,
      })))
    }
    if (wlRes.ok && wlRes.data) {
      const d = wlRes.data as { id: number; product_id?: number | null; product_name: string; product_emoji?: string; unit_price: number }[]
      wl.setItems(d.map((i) => ({
        id: i.id, product_id: i.product_id, name: i.product_name,
        emoji: i.product_emoji ?? '💊', price: Number(i.unit_price),
      })))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setLoading(true)
    const res = authMode === 'login'
      ? await authApi.login({ email, password })
      : await authApi.register({ full_name: fullName, email, password })
    setLoading(false)
    if (!res.ok) { setError(res.detail ?? 'Something went wrong'); return }
    const d = res.data as { access_token: string; refresh_token: string }
    setTokens(d.access_token, d.refresh_token)
    const meRes = await authApi.me()
    if (meRes.ok) setUser(meRes.data as User)
    closeAuth()
    toast.show(`Welcome, ${authMode === 'register' ? fullName.split(' ')[0] : email.split('@')[0]}! 👋`)
    syncFromServer()
  }

  function handleLogout() {
    clearTokens(); setUser(null); closeAuth()
    toast.show('Signed out successfully')
  }

  return (
    <AnimatePresence>
      {authOpen && (
        <>
          <motion.div
            key="auth-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/55 z-[2000]"
            onClick={closeAuth}
          />
          <motion.div
            key="auth-modal"
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="fixed inset-0 flex items-center justify-center z-[2001] px-4"
          >
            <div className="bg-white rounded-[18px] p-8 w-full max-w-md shadow-2xl relative">
              <button
                onClick={closeAuth}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl font-bold"
              >✕</button>

              <div className="text-center mb-6">
                <div className="text-4xl mb-2">💊</div>
                {user ? (
                  <>
                    <h2 className="font-poppins font-bold text-xl text-brand-blue">Hi, {user.full_name.split(' ')[0]}!</h2>
                    <p className="text-mid-gray text-sm mt-1">{user.email}</p>
                    <button
                      onClick={handleLogout}
                      className="mt-5 w-full py-2.5 bg-red-50 text-red-700 rounded-xl font-poppins font-bold text-sm hover:bg-red-100 transition"
                    >Sign Out</button>
                  </>
                ) : (
                  <>
                    <h2 className="font-poppins font-bold text-xl text-brand-blue">
                      {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="text-mid-gray text-sm mt-1">
                      {authMode === 'login' ? 'Sign in to your account' : 'Join Hussain Healthcare'}
                    </p>
                  </>
                )}
              </div>

              {!user && (
                <>
                  {error && (
                    <div className="bg-red-50 text-red-700 px-4 py-2 rounded-xl text-sm mb-4">{error}</div>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {authMode === 'register' && (
                      <input
                        type="text" placeholder="Full Name" required value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        className="w-full px-4 py-3 border border-light-gray rounded-xl text-sm font-inter outline-none focus:border-brand-blue transition"
                      />
                    )}
                    <input
                      type="email" placeholder="Email address" required value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-light-gray rounded-xl text-sm font-inter outline-none focus:border-brand-blue transition"
                    />
                    <input
                      type="password" placeholder="Password" required value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-light-gray rounded-xl text-sm font-inter outline-none focus:border-brand-blue transition"
                    />
                    <button
                      type="submit" disabled={loading}
                      className="w-full py-3 rounded-xl font-poppins font-bold text-white text-sm disabled:opacity-60"
                      style={{ background: 'linear-gradient(135deg,#1230a8,#1a3fd4,#7b2d8b)' }}
                    >
                      {loading ? '…' : authMode === 'login' ? 'Sign In' : 'Create Account'}
                    </button>
                  </form>
                  <p className="text-center text-sm text-mid-gray mt-4">
                    {authMode === 'login' ? "Don't have an account?" : 'Already have an account?'}
                    <button onClick={() => { toggleAuthMode(); setError('') }} className="ml-1 text-brand-blue font-bold">
                      {authMode === 'login' ? 'Register' : 'Sign In'}
                    </button>
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
