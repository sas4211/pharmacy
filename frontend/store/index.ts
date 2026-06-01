'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, WishlistItem, User } from '@/types'

// ── Toast ─────────────────────────────────────────────────────────────────────
interface ToastStore {
  message: string
  visible: boolean
  icon: string
  show: (msg: string, icon?: string) => void
  hide: () => void
}

let toastTimer: ReturnType<typeof setTimeout>
export const useToast = create<ToastStore>((set) => ({
  message: '',
  visible: false,
  icon: '✓',
  show(msg, icon = '✓') {
    clearTimeout(toastTimer)
    set({ message: msg, visible: true, icon })
    toastTimer = setTimeout(() => set({ visible: false }), 2400)
  },
  hide: () => set({ visible: false }),
}))

// ── Auth ──────────────────────────────────────────────────────────────────────
interface AuthStore {
  user: User | null
  authOpen: boolean
  authMode: 'login' | 'register'
  setUser: (u: User | null) => void
  openAuth: (mode?: 'login' | 'register') => void
  closeAuth: () => void
  toggleAuthMode: () => void
}

export const useAuth = create<AuthStore>((set, get) => ({
  user: null,
  authOpen: false,
  authMode: 'login',
  setUser: (u) => set({ user: u }),
  openAuth: (mode = 'login') => set({ authOpen: true, authMode: mode }),
  closeAuth: () => set({ authOpen: false }),
  toggleAuthMode: () =>
    set({ authMode: get().authMode === 'login' ? 'register' : 'login' }),
}))

// ── Cart ──────────────────────────────────────────────────────────────────────
interface CartStore {
  items: CartItem[]
  open: boolean
  addItem: (item: Omit<CartItem, 'qty'> & { qty?: number }) => void
  removeItem: (idx: number) => void
  updateQty: (idx: number, qty: number) => void
  setItems: (items: CartItem[]) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  total: () => number
  count: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      open: false,
      addItem(item) {
        const items = get().items
        const idx = items.findIndex((i) => i.name === item.name)
        if (idx > -1) {
          const next = [...items]
          next[idx] = { ...next[idx], qty: next[idx].qty + (item.qty ?? 1) }
          set({ items: next })
        } else {
          set({ items: [...items, { ...item, qty: item.qty ?? 1 }] })
        }
      },
      removeItem(idx) {
        const items = [...get().items]
        items.splice(idx, 1)
        set({ items })
      },
      updateQty(idx, qty) {
        const items = [...get().items]
        if (qty <= 0) { items.splice(idx, 1) } else { items[idx] = { ...items[idx], qty } }
        set({ items })
      },
      setItems: (items) => set({ items }),
      clearCart: () => set({ items: [] }),
      openCart: () => set({ open: true }),
      closeCart: () => set({ open: false }),
      total: () => get().items.reduce((s, i) => s + i.price * i.qty, 0),
      count: () => get().items.reduce((s, i) => s + i.qty, 0),
    }),
    { name: 'hh-cart' }
  )
)

// ── Wishlist ──────────────────────────────────────────────────────────────────
interface WishlistStore {
  items: WishlistItem[]
  open: boolean
  toggle: (item: WishlistItem) => boolean  // returns true if added
  removeItem: (idx: number) => void
  setItems: (items: WishlistItem[]) => void
  hasItem: (name: string) => boolean
  openWishlist: () => void
  closeWishlist: () => void
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      open: false,
      toggle(item) {
        const items = get().items
        const idx = items.findIndex((i) => i.name === item.name)
        if (idx > -1) {
          const next = [...items]
          next.splice(idx, 1)
          set({ items: next })
          return false
        } else {
          set({ items: [...items, item] })
          return true
        }
      },
      removeItem(idx) {
        const items = [...get().items]
        items.splice(idx, 1)
        set({ items })
      },
      setItems: (items) => set({ items }),
      hasItem: (name) => get().items.some((i) => i.name === name),
      openWishlist: () => set({ open: true }),
      closeWishlist: () => set({ open: false }),
    }),
    { name: 'hh-wishlist' }
  )
)

// ── Search / Filter ───────────────────────────────────────────────────────────
interface SearchStore {
  query: string
  activeCategory: string | null
  setQuery: (q: string) => void
  setCategory: (c: string | null) => void
}

export const useSearch = create<SearchStore>((set) => ({
  query: '',
  activeCategory: null,
  setQuery: (q) => set({ query: q }),
  setCategory: (c) => set({ activeCategory: c }),
}))

// ── Recently Viewed ───────────────────────────────────────────────────────────
interface RecentItem {
  name: string; emoji?: string; price: number; brand?: string; rating?: number; desc?: string; was?: number
}
interface RecentStore {
  items: RecentItem[]
  add: (item: RecentItem) => void
}
export const useRecent = create<RecentStore>()(
  persist(
    (set, get) => ({
      items: [],
      add(item) {
        const filtered = get().items.filter((i) => i.name !== item.name)
        set({ items: [item, ...filtered].slice(0, 8) })
      },
    }),
    { name: 'hh-recent' }
  )
)
