'use client'
import { useEffect } from 'react'
import { useAuth, useCart, useWishlist } from '@/store'
import { authApi, cartApi, wishlistApi } from '@/lib/api'
import type { User, CartItem, WishlistItem } from '@/types'

export default function Providers({ children }: { children: React.ReactNode }) {
  const { setUser } = useAuth()
  const cart = useCart()
  const wl   = useWishlist()

  useEffect(() => {
    const token = localStorage.getItem('hh_token')
    if (!token) return

    // Restore user session
    authApi.me().then(res => {
      if (res.ok && res.data) setUser(res.data as User)
    })

    // Sync cart & wishlist from server
    cartApi.get().then(res => {
      if (res.ok && res.data) {
        const d = res.data as { items: { id: number; product_id?: number | null; product_name: string; product_emoji?: string; unit_price: number; qty: number }[] }
        cart.setItems(d.items.map(i => ({
          id: i.id, product_id: i.product_id, name: i.product_name,
          emoji: i.product_emoji ?? '💊', price: Number(i.unit_price), qty: i.qty,
        })))
      }
    })

    wishlistApi.get().then(res => {
      if (res.ok && Array.isArray(res.data)) {
        wl.setItems((res.data as { id: number; product_id?: number | null; product_name: string; product_emoji?: string; unit_price: number }[]).map(i => ({
          id: i.id, product_id: i.product_id, name: i.product_name,
          emoji: i.product_emoji ?? '💊', price: Number(i.unit_price),
        })))
      }
    })
  }, [])

  return <>{children}</>
}
