const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api/v1'

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('hh_token')
}

export function setTokens(access: string, refresh: string) {
  localStorage.setItem('hh_token', access)
  localStorage.setItem('hh_refresh', refresh)
}

export function clearTokens() {
  localStorage.removeItem('hh_token')
  localStorage.removeItem('hh_refresh')
}

export async function apiFetch<T = unknown>(
  path: string,
  init: RequestInit = {},
): Promise<{ data: T | null; ok: boolean; status: number; detail?: string }> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
  }
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  try {
    const res = await fetch(API_BASE + path, { ...init, headers })
    let data: T | null = null
    let detail: string | undefined

    try {
      const json = await res.json()
      if (res.ok) data = json as T
      else detail = (json as { detail?: string }).detail
    } catch {
      // no body
    }

    return { data, ok: res.ok, status: res.status, detail }
  } catch {
    return { data: null, ok: false, status: 0, detail: 'Network error — is the API running?' }
  }
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authApi = {
  register: (body: { full_name: string; email: string; password: string; phone?: string }) =>
    apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(body) }),

  login: (body: { email: string; password: string }) =>
    apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(body) }),

  me: () => apiFetch('/auth/me'),
}

// ── Products ──────────────────────────────────────────────────────────────────
export const productsApi = {
  list: (params: Record<string, string | number | boolean>) => {
    const qs = new URLSearchParams(
      Object.entries(params).map(([k, v]) => [k, String(v)])
    ).toString()
    return apiFetch(`/products?${qs}`)
  },
  get: (id: number) => apiFetch(`/products/${id}`),
  categories: () => apiFetch('/products/categories'),
  brands: () => apiFetch('/products/brands'),
  conditions: (category?: string) =>
    apiFetch(`/products/conditions${category ? `?category=${category}` : ''}`),
}

// ── Cart ──────────────────────────────────────────────────────────────────────
export const cartApi = {
  get: () => apiFetch('/cart'),
  add: (item: { product_id?: number | null; product_name: string; product_emoji?: string; unit_price: number; qty: number }) =>
    apiFetch('/cart/add', { method: 'POST', body: JSON.stringify(item) }),
  update: (id: number, qty: number) =>
    apiFetch(`/cart/${id}`, { method: 'PATCH', body: JSON.stringify({ qty }) }),
  remove: (id: number) => apiFetch(`/cart/${id}`, { method: 'DELETE' }),
  clear: () => apiFetch('/cart', { method: 'DELETE' }),
}

// ── Wishlist ───────────────────────────────────────────────────────────────────
export const wishlistApi = {
  get: () => apiFetch('/wishlist'),
  add: (item: { product_id?: number | null; product_name: string; product_emoji?: string; unit_price: number }) =>
    apiFetch('/wishlist/add', { method: 'POST', body: JSON.stringify(item) }),
  remove: (id: number) => apiFetch(`/wishlist/${id}`, { method: 'DELETE' }),
}

// ── Orders ────────────────────────────────────────────────────────────────────
export const ordersApi = {
  list: () => apiFetch('/orders'),
  place: (body: {
    items: { product_id?: number | null; product_name: string; product_emoji?: string; unit_price: number; qty: number }[]
    delivery_address?: string
    notes?: string
    payment_method?: string
    payment_ref?: string
  }) => apiFetch('/orders', { method: 'POST', body: JSON.stringify(body) }),
  cancel: (id: number) => apiFetch(`/orders/${id}/cancel`, { method: 'PATCH' }),
}

// ── Payments ──────────────────────────────────────────────────────────────────
export const paymentsApi = {
  info: () => apiFetch('/payments/info'),
  stripeIntent: (amount_pkr: number) =>
    apiFetch('/payments/stripe/intent', { method: 'POST', body: JSON.stringify({ amount_pkr }) }),
}

// ── Prescriptions ─────────────────────────────────────────────────────────────
export const prescriptionsApi = {
  list: () => apiFetch('/prescriptions'),
  upload: async (file: File, notes?: string) => {
    const token = getToken()
    const fd = new FormData()
    fd.append('file', file)
    if (notes) fd.append('notes', notes)
    const res = await fetch(`${API_BASE}/prescriptions`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: fd,
    })
    const json = await res.json().catch(() => ({}))
    return { data: res.ok ? json : null, ok: res.ok, status: res.status, detail: json.detail }
  },
}

// ── Services ──────────────────────────────────────────────────────────────────
export const servicesApi = {
  list: () => apiFetch('/services'),
  book: (body: { service_type: string; service_name: string; is_online?: boolean; notes?: string }) =>
    apiFetch('/services', { method: 'POST', body: JSON.stringify(body) }),
  cancel: (id: number) => apiFetch(`/services/${id}/cancel`, { method: 'PATCH' }),
}

// ── Newsletter ────────────────────────────────────────────────────────────────
export const newsletterApi = {
  subscribe: (email: string) =>
    apiFetch('/newsletter/subscribe', { method: 'POST', body: JSON.stringify({ email }) }),
}
