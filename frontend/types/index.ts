export interface User {
  id: number
  full_name: string
  email: string
  phone: string | null
  is_active: boolean
  is_admin: boolean
  created_at: string
}

export interface Category {
  id: number
  name: string
  slug: string
  emoji: string | null
  item_count: number
}

export interface Brand {
  id: number
  name: string
  slug: string
  emoji: string | null
  product_count: number
}

export interface Product {
  id: number
  name: string
  slug: string
  emoji: string | null
  description: string | null
  price: number
  original_price: number | null
  stock: number
  rating: number
  review_count: number
  is_featured: boolean
  is_flash_sale: boolean
  flash_discount_pct: number | null
  requires_prescription: boolean
  tags: string[] | null
  brand: Brand | null
  category: Category | null
  created_at: string
}

export interface CartItem {
  id?: number
  product_id?: number | null
  name: string
  emoji?: string
  price: number
  qty: number
}

export interface WishlistItem {
  id?: number
  product_id?: number | null
  name: string
  emoji?: string
  price: number
}

export interface Order {
  id: number
  status: string
  total_amount: number
  delivery_fee: number
  delivery_address: string | null
  notes: string | null
  items: OrderItem[]
  created_at: string
}

export interface OrderItem {
  id: number
  product_id: number | null
  product_name: string
  product_emoji: string | null
  unit_price: number
  qty: number
  subtotal: number
}

export interface Prescription {
  id: number
  original_filename: string
  status: string
  notes: string | null
  pharmacist_notes: string | null
  created_at: string
}

export interface ServiceBooking {
  id: number
  service_type: string
  service_name: string
  booking_date: string | null
  booking_time: string | null
  status: string
  patient_name: string | null
  patient_phone: string | null
  notes: string | null
  is_online: boolean
  created_at: string
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface ToastState {
  message: string
  visible: boolean
  icon?: string
}

// ── Checkout ──────────────────────────────────────────────────────────────────
export type PaymentMethod = 'card' | 'jazzcash' | 'easypaisa' | 'bank_transfer' | 'cod'
export type DeliveryOption = 'standard' | 'express' | 'pickup'
export type CheckoutStep = 'cart' | 'delivery' | 'payment' | 'confirmation'

export interface DeliveryInfo {
  full_name: string
  phone: string
  address: string
  city: string
  postal_code: string
  option: DeliveryOption
  notes: string
}

export interface CardInfo {
  number: string
  name: string
  expiry: string
  cvv: string
}

export interface PlacedOrder {
  id: number
  total_amount: number
  delivery_fee: number
  status: string
  payment_method: string | null
  payment_status: string
  created_at: string
  items: OrderItem[]
}

export interface PaymentInfo {
  jazzcash_account: string
  jazzcash_name: string
  easypaisa_account: string
  easypaisa_name: string
  bank_name: string
  bank_account_title: string
  bank_account_number: string
  bank_iban: string
  bank_branch: string
}
