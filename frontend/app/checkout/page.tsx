'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart, useAuth, useToast } from '@/store'
import { ordersApi, paymentsApi } from '@/lib/api'
import type {
  CheckoutStep, PaymentMethod, DeliveryOption,
  DeliveryInfo, CardInfo, PlacedOrder, PaymentInfo,
} from '@/types'

// ─── constants ───────────────────────────────────────────────────────────────
const DELIVERY_OPTIONS: { id: DeliveryOption; label: string; sub: string; fee: number; eta: string }[] = [
  { id: 'standard', label: 'Standard Delivery', sub: 'Delivered to your door', fee: 200,  eta: '2–4 hours' },
  { id: 'express',  label: 'Express Delivery',  sub: 'Priority dispatch',      fee: 400,  eta: '45–60 min' },
  { id: 'pickup',   label: 'Store Pickup',       sub: 'Gulshan-e-Iqbal branch', fee: 0,    eta: 'Ready in 1 hr' },
]

const PAYMENT_METHODS: { id: PaymentMethod; label: string; sub: string; icon: string }[] = [
  { id: 'card',         label: 'Credit / Debit Card', sub: 'Visa, Mastercard, Amex',  icon: '💳' },
  { id: 'jazzcash',     label: 'JazzCash',             sub: 'Mobile wallet',           icon: '🟠' },
  { id: 'easypaisa',    label: 'Easypaisa',            sub: 'Mobile wallet',           icon: '🟢' },
  { id: 'bank_transfer',label: 'Bank Transfer',        sub: 'Direct bank deposit',     icon: '🏦' },
  { id: 'cod',          label: 'Cash on Delivery',     sub: 'Pay when you receive',    icon: '💵' },
]

const FREE_DELIVERY_THRESHOLD = 5000
const STEP_LABELS: CheckoutStep[] = ['cart', 'delivery', 'payment', 'confirmation']

// ─── helpers ─────────────────────────────────────────────────────────────────
function formatCard(v: string) {
  return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}
function formatExpiry(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 4)
  return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
}
function cardBrand(n: string) {
  const d = n.replace(/\s/g, '')
  if (/^4/.test(d)) return 'VISA'
  if (/^5[1-5]/.test(d)) return 'MC'
  if (/^3[47]/.test(d)) return 'AMEX'
  return null
}

// ─── sub-components ───────────────────────────────────────────────────────────
function StepBar({ current }: { current: CheckoutStep }) {
  const labels = ['Cart Review', 'Delivery', 'Payment', 'Confirmation']
  const idx    = STEP_LABELS.indexOf(current)
  return (
    <div className="flex items-center gap-0 mb-10">
      {labels.map((l, i) => (
        <div key={l} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1 min-w-[60px]">
            <motion.div
              animate={{
                background: i <= idx
                  ? 'linear-gradient(135deg,#1230a8,#1a3fd4)'
                  : '#e0e0f0',
                color: i <= idx ? '#fff' : '#6b7280',
                scale: i === idx ? 1.15 : 1,
              }}
              transition={{ duration: 0.3 }}
              className="w-9 h-9 rounded-full flex items-center justify-center font-poppins font-bold text-sm shadow-sm"
            >
              {i < idx ? '✓' : i + 1}
            </motion.div>
            <span className={`text-[11px] font-inter font-medium whitespace-nowrap
              ${i === idx ? 'text-[#1a3fd4]' : i < idx ? 'text-green-600' : 'text-[#6b7280]'}`}>
              {l}
            </span>
          </div>
          {i < labels.length - 1 && (
            <motion.div
              animate={{ background: i < idx ? '#1a3fd4' : '#e0e0f0' }}
              transition={{ duration: 0.4 }}
              className="flex-1 h-0.5 mx-1 mb-5 rounded-full"
            />
          )}
        </div>
      ))}
    </div>
  )
}

function OrderSummary({
  items, subtotal, deliveryFee, total, deliveryOption,
}: {
  items: { name: string; emoji?: string; price: number; qty: number }[]
  subtotal: number; deliveryFee: number; total: number; deliveryOption?: DeliveryOption
}) {
  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_28px_rgba(26,63,212,.1)] p-6 sticky top-28">
      <h3 className="font-poppins font-bold text-base text-[#1e1e2e] mb-4">Order Summary</h3>

      <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1 mb-4">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#f5f4fb] rounded-xl flex items-center justify-center text-xl shrink-0">
              {item.emoji || '💊'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-inter text-xs text-[#1e1e2e] truncate font-medium">{item.name}</p>
              <p className="text-[11px] text-[#6b7280]">× {item.qty}</p>
            </div>
            <span className="font-poppins font-bold text-sm text-[#1a3fd4] shrink-0">
              Rs. {(item.price * item.qty).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-[#e0e0f0] pt-4 space-y-2.5 text-sm font-inter">
        <div className="flex justify-between text-[#6b7280]">
          <span>Subtotal</span>
          <span>Rs. {subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-[#6b7280]">
          <span>Delivery</span>
          <span className={deliveryFee === 0 ? 'text-green-600 font-semibold' : ''}>
            {deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee.toLocaleString()}`}
          </span>
        </div>
        {subtotal >= FREE_DELIVERY_THRESHOLD && deliveryOption !== 'pickup' && (
          <p className="text-[11px] text-green-600 font-medium">✓ Free delivery on orders above Rs. 5,000</p>
        )}
        <div className="border-t border-[#e0e0f0] pt-3 flex justify-between font-poppins font-bold text-base text-[#1e1e2e]">
          <span>Total</span>
          <span className="text-[#1a3fd4]">Rs. {total.toLocaleString()}</span>
        </div>
      </div>

      {/* Trust badges */}
      <div className="mt-5 grid grid-cols-3 gap-2">
        {[
          { icon: '🔒', label: 'Secure\nPayment' },
          { icon: '↩️', label: '7-Day\nReturns' },
          { icon: '🚚', label: 'Fast\nDelivery' },
        ].map(b => (
          <div key={b.label} className="bg-[#f5f4fb] rounded-xl p-2 flex flex-col items-center gap-1 text-center">
            <span className="text-base">{b.icon}</span>
            <span className="text-[10px] font-inter text-[#6b7280] leading-tight whitespace-pre-line">{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── main page ────────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const router  = useRouter()
  const cart    = useCart()
  const { user, openAuth } = useAuth()
  const toast   = useToast()

  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const [step, setStep]         = useState<CheckoutStep>('cart')
  const [payMethod, setPayMethod] = useState<PaymentMethod>('cod')
  const [placing, setPlacing]   = useState(false)
  const [placedOrder, setPlacedOrder] = useState<PlacedOrder | null>(null)
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null)

  // Stripe state
  const [stripeLoading, setStripeLoading] = useState(false)
  const [stripeClientSecret, setStripeClientSecret] = useState('')
  const [stripePublishableKey, setStripePublishableKey] = useState('')
  const [stripeError, setStripeError] = useState('')

  // Manual payment reference (JazzCash TxnID / Easypaisa TxnID / bank ref)
  const [paymentRef, setPaymentRef] = useState('')

  const [delivery, setDelivery] = useState<DeliveryInfo>({
    full_name: '', phone: '', address: '', city: 'Karachi',
    postal_code: '', option: 'standard', notes: '',
  })
  const [card, setCard] = useState<CardInfo>({ number: '', name: '', expiry: '', cvv: '' })
  const [errors, setErrors]     = useState<Record<string, string>>({})

  // Pre-fill from user profile
  useEffect(() => {
    if (user) setDelivery(d => ({ ...d, full_name: d.full_name || user.full_name, phone: d.phone || (user.phone ?? '') }))
  }, [user])

  // Load payment info (merchant accounts / bank details) when entering payment step
  useEffect(() => {
    if (step === 'payment' && !paymentInfo) {
      paymentsApi.info().then(res => {
        if (res.ok && res.data) setPaymentInfo(res.data as PaymentInfo)
      })
    }
  }, [step])

  // Create Stripe PaymentIntent when card method is selected
  useEffect(() => {
    if (step !== 'payment' || payMethod !== 'card') return
    if (stripeClientSecret) return   // already created
    setStripeLoading(true)
    setStripeError('')
    const amountPaisas = Math.round(total * 100)
    paymentsApi.stripeIntent(amountPaisas).then(res => {
      setStripeLoading(false)
      if (res.ok && res.data) {
        const d = res.data as { client_secret: string; publishable_key: string }
        setStripeClientSecret(d.client_secret)
        setStripePublishableKey(d.publishable_key)
      } else {
        setStripeError(res.detail ?? 'Card payments unavailable. Please choose another method.')
      }
    })
  }, [step, payMethod])

  // Redirect if cart empty and not on confirmation
  useEffect(() => {
    if (cart.items.length === 0 && step !== 'confirmation') router.push('/')
  }, [])

  const subtotal     = cart.total()
  const selectedDel  = DELIVERY_OPTIONS.find(o => o.id === delivery.option)!
  const deliveryFee  = subtotal >= FREE_DELIVERY_THRESHOLD && delivery.option !== 'express' ? 0 : selectedDel.fee
  const total        = subtotal + deliveryFee

  // ── Validation ──────────────────────────────────────────────────────────────
  function validateDelivery() {
    const e: Record<string, string> = {}
    if (!delivery.full_name.trim())  e.full_name = 'Full name is required'
    if (!delivery.phone.trim())      e.phone     = 'Phone number is required'
    if (!delivery.address.trim())    e.address   = 'Address is required'
    if (!delivery.city.trim())       e.city      = 'City is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function validatePayment() {
    const e: Record<string, string> = {}
    if (payMethod === 'card') {
      // Stripe handles card validation — just check if intent is ready
      if (stripeError)      e.stripe = stripeError
      if (!stripeClientSecret && !stripeError) e.stripe = 'Card payment is still loading, please wait.'
    } else if (payMethod === 'jazzcash' || payMethod === 'easypaisa') {
      if (!paymentRef.trim()) e.payment_ref = 'Please enter your transaction ID'
    } else if (payMethod === 'bank_transfer') {
      if (!paymentRef.trim()) e.payment_ref = 'Please enter your bank transfer reference number'
    }
    // COD: no validation needed
    setErrors(e)
    return Object.keys(e).length === 0
  }

  // ── Place order ─────────────────────────────────────────────────────────────
  async function placeOrder() {
    if (!user) { openAuth('login'); toast.show('Please sign in to place an order'); return }
    if (!validatePayment()) return
    setPlacing(true)

    let finalPaymentRef = paymentRef.trim()

    // ── Stripe card payment: confirm before creating order ──────────────────
    if (payMethod === 'card' && stripeClientSecret && stripePublishableKey) {
      try {
        const { loadStripe } = await import('@stripe/stripe-js')
        const stripe = await loadStripe(stripePublishableKey)
        if (!stripe) throw new Error('Stripe failed to load')

        const cardNumber = card.number.replace(/\s/g, '')
        const [expMonth, expYear] = card.expiry.split('/')
        const result = await stripe.confirmCardPayment(stripeClientSecret, {
          payment_method: {
            card: {
              number: cardNumber,
              exp_month: parseInt(expMonth),
              exp_year: parseInt('20' + expYear),
              cvc: card.cvv,
            } as unknown as import('@stripe/stripe-js').StripeCardElement,
            billing_details: { name: card.name },
          },
        })

        if (result.error) {
          toast.show(result.error.message ?? 'Card payment failed', '✕')
          setPlacing(false)
          return
        }
        finalPaymentRef = result.paymentIntent?.id ?? ''
      } catch (err) {
        toast.show('Card payment failed — please try again', '✕')
        setPlacing(false)
        return
      }
    }

    const address = `${delivery.full_name}, ${delivery.phone}\n${delivery.address}, ${delivery.city}${delivery.postal_code ? ' ' + delivery.postal_code : ''}`
    const notes   = [
      delivery.notes,
      `Payment: ${PAYMENT_METHODS.find(m => m.id === payMethod)?.label}`,
      `Delivery: ${selectedDel.label}`,
    ].filter(Boolean).join(' | ')

    const res = await ordersApi.place({
      items: cart.items.map(i => ({
        product_id:    i.product_id ?? null,
        product_name:  i.name,
        product_emoji: i.emoji,
        unit_price:    i.price,
        qty:           i.qty,
      })),
      delivery_address: address,
      notes,
      payment_method: payMethod,
      payment_ref:    finalPaymentRef || undefined,
    })
    setPlacing(false)

    if (res.ok && res.data) {
      const d = res.data as PlacedOrder
      setPlacedOrder(d)
      cart.clearCart()
      setStep('confirmation')
    } else if (res.status === 401) {
      toast.show('Session expired — please sign in again', '🔒')
      openAuth('login')
    } else {
      toast.show(res.detail ?? 'Order failed — please try again', '✕')
    }
  }

  // ── Step: Cart Review ────────────────────────────────────────────────────────
  const StepCart = (
    <motion.div key="cart" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
      <h2 className="font-poppins font-extrabold text-xl text-[#1e1e2e] mb-5">Review Your Cart</h2>
      <div className="space-y-3">
        {cart.items.map((item, idx) => (
          <motion.div
            key={item.name + idx}
            layout
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(26,63,212,.07)]"
          >
            <div className="w-14 h-14 bg-[#f5f4fb] rounded-xl flex items-center justify-center text-3xl shrink-0">
              {item.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-poppins font-semibold text-sm text-[#1e1e2e] truncate">{item.name}</p>
              <p className="text-xs text-[#6b7280] font-inter mt-0.5">Rs. {item.price.toLocaleString()} each</p>
            </div>
            {/* Qty controls */}
            <div className="flex items-center border border-[#e0e0f0] rounded-xl overflow-hidden shrink-0">
              <button
                onClick={() => cart.updateQty(idx, item.qty - 1)}
                className="w-8 h-8 flex items-center justify-center text-[#6b7280] hover:bg-[#f5f4fb] font-bold text-lg transition"
              >−</button>
              <span className="w-8 text-center font-poppins font-bold text-sm text-[#1e1e2e]">{item.qty}</span>
              <button
                onClick={() => cart.updateQty(idx, item.qty + 1)}
                className="w-8 h-8 flex items-center justify-center text-[#6b7280] hover:bg-[#f5f4fb] font-bold text-lg transition"
              >+</button>
            </div>
            <span className="font-poppins font-bold text-sm text-[#1a3fd4] shrink-0 w-20 text-right">
              Rs. {(item.price * item.qty).toLocaleString()}
            </span>
            <button
              onClick={() => cart.removeItem(idx)}
              className="text-[#6b7280] hover:text-red-500 text-sm shrink-0 ml-1 transition"
              title="Remove"
            >🗑</button>
          </motion.div>
        ))}
      </div>
      {!user && (
        <div className="mt-6 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
          <span className="text-2xl shrink-0">🔒</span>
          <div className="flex-1">
            <p className="font-poppins font-bold text-sm text-[#1e1e2e]">Sign in to continue</p>
            <p className="text-xs font-inter text-[#6b7280] mt-0.5">You need to be logged in to place an order.</p>
          </div>
          <button
            onClick={() => openAuth('login')}
            className="px-4 py-2 rounded-xl text-white font-poppins font-bold text-xs shadow hover:opacity-90 transition shrink-0"
            style={{ background: 'linear-gradient(135deg,#1230a8,#1a3fd4)' }}
          >Sign In</button>
        </div>
      )}
      <button
        onClick={() => { if (!user) { openAuth('login'); return } setStep('delivery') }}
        className="mt-4 w-full py-3.5 rounded-2xl text-white font-poppins font-bold text-sm shadow-lg hover:opacity-90 transition active:scale-[.98]"
        style={{ background: 'linear-gradient(135deg,#1230a8,#1a3fd4,#7b2d8b)' }}
      >Continue to Delivery →</button>
    </motion.div>
  )

  // ── Step: Delivery ──────────────────────────────────────────────────────────
  const inputCls = (k: string) =>
    `w-full px-4 py-3 border rounded-xl font-inter text-sm outline-none transition
     ${errors[k] ? 'border-red-400 bg-red-50' : 'border-[#e0e0f0] focus:border-[#1a3fd4]'}`

  const StepDelivery = (
    <motion.div key="delivery" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
      <h2 className="font-poppins font-extrabold text-xl text-[#1e1e2e] mb-5">Delivery Details</h2>

      {/* Delivery options */}
      <div className="grid sm:grid-cols-3 gap-3 mb-6">
        {DELIVERY_OPTIONS.map(opt => (
          <button
            key={opt.id}
            onClick={() => setDelivery(d => ({ ...d, option: opt.id }))}
            className={`p-4 rounded-2xl border-2 text-left transition-all
              ${delivery.option === opt.id
                ? 'border-[#1a3fd4] bg-blue-50 shadow-md'
                : 'border-[#e0e0f0] bg-white hover:border-[#1a3fd4]/40'}`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-poppins font-bold text-sm text-[#1e1e2e]">{opt.label}</span>
              {delivery.option === opt.id && (
                <span className="w-5 h-5 rounded-full bg-[#1a3fd4] flex items-center justify-center text-white text-[10px]">✓</span>
              )}
            </div>
            <p className="text-xs text-[#6b7280] font-inter">{opt.sub}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs font-inter text-[#6b7280]">⏱ {opt.eta}</span>
              <span className={`font-poppins font-bold text-sm ${opt.fee === 0 ? 'text-green-600' : 'text-[#1a3fd4]'}`}>
                {opt.fee === 0 ? 'FREE' : `Rs. ${opt.fee}`}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Address form */}
      <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(26,63,212,.07)] space-y-4">
        <h3 className="font-poppins font-bold text-sm text-[#1e1e2e]">Delivery Address</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-inter text-[#6b7280] mb-1.5 block">Full Name *</label>
            <input value={delivery.full_name} onChange={e => setDelivery(d => ({ ...d, full_name: e.target.value }))}
              placeholder="Muhammad Ali" className={inputCls('full_name')} />
            {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
          </div>
          <div>
            <label className="text-xs font-inter text-[#6b7280] mb-1.5 block">Phone Number *</label>
            <input value={delivery.phone} onChange={e => setDelivery(d => ({ ...d, phone: e.target.value }))}
              placeholder="03xx-xxxxxxx" className={inputCls('phone')} />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
        </div>
        <div>
          <label className="text-xs font-inter text-[#6b7280] mb-1.5 block">Street Address *</label>
          <input value={delivery.address} onChange={e => setDelivery(d => ({ ...d, address: e.target.value }))}
            placeholder="House #, Street #, Block, Area" className={inputCls('address')} />
          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-inter text-[#6b7280] mb-1.5 block">City *</label>
            <input value={delivery.city} onChange={e => setDelivery(d => ({ ...d, city: e.target.value }))}
              placeholder="Karachi" className={inputCls('city')} />
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
          </div>
          <div>
            <label className="text-xs font-inter text-[#6b7280] mb-1.5 block">Postal Code</label>
            <input value={delivery.postal_code} onChange={e => setDelivery(d => ({ ...d, postal_code: e.target.value }))}
              placeholder="75300" className={inputCls('postal_code')} />
          </div>
        </div>
        <div>
          <label className="text-xs font-inter text-[#6b7280] mb-1.5 block">Delivery Notes (optional)</label>
          <textarea value={delivery.notes} onChange={e => setDelivery(d => ({ ...d, notes: e.target.value }))}
            placeholder="Landmark, gate instructions, preferred time…"
            rows={2}
            className="w-full px-4 py-3 border border-[#e0e0f0] rounded-xl font-inter text-sm outline-none focus:border-[#1a3fd4] transition resize-none" />
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button onClick={() => setStep('cart')}
          className="px-6 py-3.5 rounded-2xl border-2 border-[#e0e0f0] text-[#1e1e2e] font-poppins font-bold text-sm hover:border-[#1a3fd4] transition">
          ← Back
        </button>
        <button
          onClick={() => { if (validateDelivery()) setStep('payment') }}
          className="flex-1 py-3.5 rounded-2xl text-white font-poppins font-bold text-sm shadow-lg hover:opacity-90 transition active:scale-[.98]"
          style={{ background: 'linear-gradient(135deg,#1230a8,#1a3fd4,#7b2d8b)' }}
        >Continue to Payment →</button>
      </div>
    </motion.div>
  )

  // ── Step: Payment ────────────────────────────────────────────────────────────
  const brand = cardBrand(card.number)
  const StepPayment = (
    <motion.div key="payment" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
      <h2 className="font-poppins font-extrabold text-xl text-[#1e1e2e] mb-5">Choose Payment Method</h2>

      {/* Method selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {PAYMENT_METHODS.map(m => (
          <button
            key={m.id}
            onClick={() => { setPayMethod(m.id); setErrors({}); setPaymentRef('') }}
            className={`p-4 rounded-2xl border-2 text-center transition-all flex flex-col items-center gap-2
              ${payMethod === m.id
                ? 'border-[#1a3fd4] bg-blue-50 shadow-md'
                : 'border-[#e0e0f0] bg-white hover:border-[#1a3fd4]/40'}`}
          >
            <span className="text-3xl">{m.icon}</span>
            <span className="font-poppins font-bold text-xs text-[#1e1e2e] leading-tight">{m.label}</span>
            <span className="text-[10px] font-inter text-[#6b7280]">{m.sub}</span>
            {payMethod === m.id && (
              <span className="w-5 h-5 rounded-full bg-[#1a3fd4] flex items-center justify-center text-white text-[10px]">✓</span>
            )}
          </button>
        ))}
      </div>

      {/* Payment form */}
      <AnimatePresence mode="wait">
        {/* ── Card form ── */}
        {payMethod === 'card' && (
          <motion.div key="card"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(26,63,212,.07)] space-y-4"
          >
            {/* Visual card preview */}
            <div
              className="relative h-44 rounded-2xl p-6 text-white overflow-hidden mb-2 select-none"
              style={{ background: 'linear-gradient(135deg,#1230a8 0%,#2755e8 50%,#7b2d8b 100%)' }}
            >
              <div className="absolute top-4 right-5 flex gap-1.5 opacity-60">
                {brand === 'VISA' && <span className="font-bold italic text-lg tracking-wider">VISA</span>}
                {brand === 'MC' && (
                  <div className="flex">
                    <div className="w-7 h-7 rounded-full bg-red-500 opacity-90" />
                    <div className="w-7 h-7 rounded-full bg-yellow-400 opacity-90 -ml-3" />
                  </div>
                )}
                {brand === 'AMEX' && <span className="font-bold text-sm tracking-wider">AMEX</span>}
                {!brand && <span className="text-white/50 text-sm">💳</span>}
              </div>
              <div className="absolute bottom-14 left-6 w-10 h-8 rounded-md bg-yellow-400/80 flex items-center justify-center">
                <div className="w-8 h-1.5 bg-yellow-600/40 rounded" />
              </div>
              <div className="absolute bottom-8 left-6 font-mono text-base tracking-[0.25em] font-bold">
                {card.number || '•••• •••• •••• ••••'}
              </div>
              <div className="absolute bottom-3 left-6 flex gap-8">
                <div>
                  <p className="text-[9px] opacity-60 uppercase tracking-wide">Card Holder</p>
                  <p className="font-poppins text-xs font-semibold">{card.name || 'YOUR NAME'}</p>
                </div>
                <div>
                  <p className="text-[9px] opacity-60 uppercase tracking-wide">Expires</p>
                  <p className="font-poppins text-xs font-semibold">{card.expiry || 'MM/YY'}</p>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-inter text-[#6b7280] mb-1.5 block">Card Number *</label>
              <input
                value={card.number}
                onChange={e => setCard(c => ({ ...c, number: formatCard(e.target.value) }))}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className={inputCls('card_number')}
              />
              {errors.card_number && <p className="text-red-500 text-xs mt-1">{errors.card_number}</p>}
            </div>
            <div>
              <label className="text-xs font-inter text-[#6b7280] mb-1.5 block">Name on Card *</label>
              <input
                value={card.name}
                onChange={e => setCard(c => ({ ...c, name: e.target.value.toUpperCase() }))}
                placeholder="MUHAMMAD ALI"
                className={inputCls('card_name')}
              />
              {errors.card_name && <p className="text-red-500 text-xs mt-1">{errors.card_name}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-inter text-[#6b7280] mb-1.5 block">Expiry Date *</label>
                <input
                  value={card.expiry}
                  onChange={e => setCard(c => ({ ...c, expiry: formatExpiry(e.target.value) }))}
                  placeholder="MM/YY"
                  maxLength={5}
                  className={inputCls('expiry')}
                />
                {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>}
              </div>
              <div>
                <label className="text-xs font-inter text-[#6b7280] mb-1.5 block">CVV *</label>
                <input
                  value={card.cvv}
                  onChange={e => setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                  placeholder="•••"
                  type="password"
                  maxLength={4}
                  className={inputCls('cvv')}
                />
                {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2 bg-[#f5f4fb] rounded-xl px-4 py-2.5">
              <span className="text-lg">🔒</span>
              <p className="text-[11px] font-inter text-[#6b7280] leading-snug">
                Your card details are encrypted with 256-bit SSL. We never store your full card number.
              </p>
            </div>
          </motion.div>
        )}

        {/* ── JazzCash / Easypaisa ── */}
        {(payMethod === 'jazzcash' || payMethod === 'easypaisa') && (
          <motion.div key="wallet"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(26,63,212,.07)] space-y-4"
          >
            {/* Brand header */}
            <div className="flex items-center gap-4 p-4 rounded-2xl"
              style={{ background: payMethod === 'jazzcash' ? 'linear-gradient(135deg,#ff6600,#ff9900)' : 'linear-gradient(135deg,#1a8a00,#34d058)' }}>
              <span className="text-4xl">{payMethod === 'jazzcash' ? '🟠' : '🟢'}</span>
              <div className="text-white">
                <p className="font-poppins font-bold text-base">{payMethod === 'jazzcash' ? 'JazzCash' : 'Easypaisa'}</p>
                <p className="text-xs opacity-80 font-inter">Send payment to the number below, then enter your transaction ID</p>
              </div>
            </div>

            {/* Merchant account */}
            <div className="bg-[#f5f4fb] rounded-xl p-4 space-y-2">
              <p className="text-xs font-inter font-semibold text-[#6b7280] uppercase tracking-wide">Send To</p>
              {paymentInfo ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-inter text-[#6b7280]">Account Number</span>
                    <span className="font-poppins font-bold text-[#1e1e2e] text-base tracking-wider">
                      {payMethod === 'jazzcash' ? paymentInfo.jazzcash_account : paymentInfo.easypaisa_account}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-inter text-[#6b7280]">Account Name</span>
                    <span className="font-inter font-semibold text-[#1e1e2e] text-sm">
                      {payMethod === 'jazzcash' ? paymentInfo.jazzcash_name : paymentInfo.easypaisa_name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-[#e0e0f0] pt-2 mt-1">
                    <span className="text-sm font-inter text-[#6b7280]">Amount</span>
                    <span className="font-poppins font-bold text-[#1a3fd4] text-base">Rs. {total.toLocaleString()}</span>
                  </div>
                </>
              ) : (
                <div className="h-16 flex items-center justify-center">
                  <span className="w-5 h-5 border-2 border-[#1a3fd4]/30 border-t-[#1a3fd4] rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* Transaction ID input */}
            <div>
              <label className="text-xs font-inter text-[#6b7280] mb-1.5 block">
                Transaction ID (TxnID) *
              </label>
              <input
                value={paymentRef}
                onChange={e => { setPaymentRef(e.target.value); setErrors(err => ({ ...err, payment_ref: '' })) }}
                placeholder="e.g. JCXXXXXXXXXXXX"
                className={inputCls('payment_ref')}
              />
              {errors.payment_ref && <p className="text-red-500 text-xs mt-1">{errors.payment_ref}</p>}
              <p className="text-[11px] font-inter text-[#6b7280] mt-1.5">
                After sending payment, enter the Transaction ID shown in your {payMethod === 'jazzcash' ? 'JazzCash' : 'Easypaisa'} app.
              </p>
            </div>
          </motion.div>
        )}

        {/* ── Bank Transfer ── */}
        {payMethod === 'bank_transfer' && (
          <motion.div key="bank"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(26,63,212,.07)] space-y-4"
          >
            {/* Header */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-[#1230a8] to-[#1a3fd4]">
              <span className="text-4xl">🏦</span>
              <div className="text-white">
                <p className="font-poppins font-bold text-base">Bank Transfer</p>
                <p className="text-xs opacity-80 font-inter">Transfer to our account and enter the reference below</p>
              </div>
            </div>

            {/* Bank details */}
            <div className="bg-[#f5f4fb] rounded-xl p-4 space-y-2.5">
              <p className="text-xs font-inter font-semibold text-[#6b7280] uppercase tracking-wide">Account Details</p>
              {paymentInfo ? (
                [
                  ['Bank', paymentInfo.bank_name],
                  ['Account Title', paymentInfo.bank_account_title],
                  ['Account Number', paymentInfo.bank_account_number],
                  ['IBAN', paymentInfo.bank_iban],
                  ['Branch', paymentInfo.bank_branch],
                ].map(([label, value]) => value ? (
                  <div key={label} className="flex items-start justify-between gap-4">
                    <span className="text-sm font-inter text-[#6b7280] shrink-0">{label}</span>
                    <span className="font-inter font-semibold text-[#1e1e2e] text-sm text-right">{value}</span>
                  </div>
                ) : null)
              ) : (
                <div className="h-16 flex items-center justify-center">
                  <span className="w-5 h-5 border-2 border-[#1a3fd4]/30 border-t-[#1a3fd4] rounded-full animate-spin" />
                </div>
              )}
              <div className="flex items-center justify-between border-t border-[#e0e0f0] pt-2 mt-1">
                <span className="text-sm font-inter text-[#6b7280]">Amount</span>
                <span className="font-poppins font-bold text-[#1a3fd4] text-base">Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            {/* Reference input */}
            <div>
              <label className="text-xs font-inter text-[#6b7280] mb-1.5 block">Transfer Reference / TRN *</label>
              <input
                value={paymentRef}
                onChange={e => { setPaymentRef(e.target.value); setErrors(err => ({ ...err, payment_ref: '' })) }}
                placeholder="e.g. FT2504060001234"
                className={inputCls('payment_ref')}
              />
              {errors.payment_ref && <p className="text-red-500 text-xs mt-1">{errors.payment_ref}</p>}
              <p className="text-[11px] font-inter text-[#6b7280] mt-1.5">
                Enter the transaction reference number from your bank's confirmation SMS or receipt.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
              <span className="text-lg shrink-0">⏱</span>
              <p className="text-[11px] font-inter text-amber-700 leading-snug">
                Bank transfers may take 1–2 business hours to verify. Your order will be processed after confirmation.
              </p>
            </div>
          </motion.div>
        )}

        {/* ── Cash on Delivery ── */}
        {payMethod === 'cod' && (
          <motion.div key="cod"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(26,63,212,.07)]"
          >
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-4xl">💵</div>
              <div>
                <p className="font-poppins font-bold text-base text-[#1e1e2e]">Cash on Delivery</p>
                <p className="text-sm text-[#6b7280] font-inter">Pay in cash when your order arrives</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { icon: '🚚', text: 'Rider brings your order to your door' },
                { icon: '💵', text: `Pay exactly Rs. ${total.toLocaleString()} in cash` },
                { icon: '📦', text: 'Collect your order and receipt' },
                { icon: '↩️', text: '7-day returns if not satisfied' },
              ].map(s => (
                <div key={s.icon} className="flex items-center gap-3 p-3 bg-[#f5f4fb] rounded-xl">
                  <span className="text-xl shrink-0">{s.icon}</span>
                  <span className="text-sm font-inter text-[#1e1e2e]">{s.text}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-[#6b7280] font-inter mt-4">
              * Please have exact change ready. Our riders cannot always provide change.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-3 mt-6">
        <button onClick={() => setStep('delivery')}
          className="px-6 py-3.5 rounded-2xl border-2 border-[#e0e0f0] text-[#1e1e2e] font-poppins font-bold text-sm hover:border-[#1a3fd4] transition">
          ← Back
        </button>
        <button
          onClick={placeOrder}
          disabled={placing}
          className="flex-1 py-3.5 rounded-2xl text-white font-poppins font-bold text-sm shadow-lg hover:opacity-90 transition active:scale-[.98] disabled:opacity-60 flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg,#1230a8,#1a3fd4,#7b2d8b)' }}
        >
          {placing
            ? (<><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processing…</>)
            : `🔒 Place Order — Rs. ${total.toLocaleString()}`}
        </button>
      </div>
    </motion.div>
  )

  // ── Step: Confirmation ───────────────────────────────────────────────────────
  const StepConfirmation = (
    <motion.div key="confirmation"
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
      className="text-center py-6"
    >
      <motion.div
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 20, delay: 0.15 }}
        className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center text-5xl mx-auto mb-6 shadow-lg"
      >✅</motion.div>
      <h2 className="font-poppins font-extrabold text-2xl text-[#1e1e2e] mb-2">Order Placed!</h2>
      {placedOrder && (
        <p className="text-[#6b7280] font-inter text-sm mb-1">
          Order <span className="font-bold text-[#1a3fd4]">#{placedOrder.id}</span> confirmed
        </p>
      )}
      <p className="text-[#6b7280] font-inter text-sm mb-8 max-w-sm mx-auto">
        Thank you for your order. Our team will prepare it right away.
        {delivery.option === 'express' ? ' Expected delivery: 45–60 minutes.' : ' Expected delivery: 2–4 hours.'}
      </p>

      {placedOrder && (
        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_28px_rgba(26,63,212,.1)] text-left max-w-sm mx-auto mb-8">
          <h3 className="font-poppins font-bold text-sm text-[#1e1e2e] mb-4">Order Details</h3>
          <div className="space-y-2 text-sm font-inter text-[#6b7280]">
            <div className="flex justify-between"><span>Order ID</span><span className="font-bold text-[#1e1e2e]">#{placedOrder.id}</span></div>
            <div className="flex justify-between"><span>Payment</span><span>{PAYMENT_METHODS.find(m => m.id === payMethod)?.label}</span></div>
            <div className="flex justify-between"><span>Delivery</span><span>{selectedDel.label}</span></div>
            <div className="flex justify-between border-t border-[#e0e0f0] pt-2 mt-2 font-poppins font-bold text-[#1e1e2e]">
              <span>Total Paid</span>
              <span className="text-[#1a3fd4]">Rs. {Number(placedOrder.total_amount).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={() => router.push('/')}
          className="px-8 py-3.5 rounded-2xl text-white font-poppins font-bold text-sm shadow-lg hover:opacity-90 transition"
          style={{ background: 'linear-gradient(135deg,#1230a8,#1a3fd4,#7b2d8b)' }}
        >Continue Shopping</button>
        <a
          href={`https://wa.me/923311113292?text=Hi%2C%20my%20order%20number%20is%20%23${placedOrder?.id}%2C%20I%27d%20like%20to%20track%20it`}
          target="_blank" rel="noopener noreferrer"
          className="px-8 py-3.5 rounded-2xl bg-[#25d366] text-white font-poppins font-bold text-sm shadow-lg hover:bg-green-600 transition"
        >💬 Track on WhatsApp</a>
      </div>
    </motion.div>
  )

  // ── Layout ──────────────────────────────────────────────────────────────────
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#f5f4fb] flex items-center justify-center">
        <span className="w-8 h-8 border-3 border-[#1a3fd4]/30 border-t-[#1a3fd4] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5f4fb] py-10">
      <div className="w-[92%] max-w-[1100px] mx-auto">
        <div className="mb-8">
          <h1 className="font-poppins font-extrabold text-2xl md:text-3xl text-[#1e1e2e]">Checkout</h1>
          <p className="text-[#6b7280] font-inter text-sm mt-1">
            {cart.items.length} item{cart.items.length !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        <StepBar current={step} />

        <div className={`grid gap-8 ${step !== 'confirmation' ? 'lg:grid-cols-[1fr_360px]' : ''}`}>
          {/* Main form */}
          <div>
            <AnimatePresence mode="wait">
              {step === 'cart'         && StepCart}
              {step === 'delivery'     && StepDelivery}
              {step === 'payment'      && StepPayment}
              {step === 'confirmation' && StepConfirmation}
            </AnimatePresence>
          </div>

          {/* Order summary sidebar (hidden on confirmation) */}
          {step !== 'confirmation' && (
            <div className="hidden lg:block">
              <OrderSummary
                items={cart.items}
                subtotal={subtotal}
                deliveryFee={deliveryFee}
                total={total}
                deliveryOption={delivery.option}
              />
            </div>
          )}
        </div>

        {/* Mobile order summary (always visible at bottom except confirmation) */}
        {step !== 'confirmation' && (
          <div className="lg:hidden mt-8">
            <OrderSummary
              items={cart.items}
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              total={total}
              deliveryOption={delivery.option}
            />
          </div>
        )}
      </div>
    </div>
  )
}
