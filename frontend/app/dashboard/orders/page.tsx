'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ordersApi } from '@/lib/api'
import { useToast } from '@/store'
import type { Order } from '@/types'

const STATUS_COLORS: Record<string, string> = {
  delivered:  'bg-green-100 text-green-700',
  in_transit: 'bg-blue-100 text-blue-700',
  confirmed:  'bg-purple-100 text-purple-700',
  pending:    'bg-amber-100 text-amber-700',
  cancelled:  'bg-red-100 text-red-700',
}

const TIMELINE_STEPS = ['pending', 'confirmed', 'in_transit', 'delivered']
const STEP_LABELS: Record<string, string> = {
  pending:    'Order Placed',
  confirmed:  'Confirmed',
  in_transit: 'Dispatched',
  delivered:  'Delivered',
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-PK', { month: 'short', day: 'numeric', year: 'numeric' })
}

function OrderTimeline({ status }: { status: string }) {
  const currentIdx = TIMELINE_STEPS.indexOf(status)
  return (
    <div className="space-y-0">
      {TIMELINE_STEPS.map((step, j) => {
        const done = currentIdx >= j
        return (
          <div key={step} className="flex gap-3 items-start">
            <div className="flex flex-col items-center">
              <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center ${done ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'}`}>
                {done && <span className="text-white text-[8px]">✓</span>}
              </div>
              {j < TIMELINE_STEPS.length - 1 && <div className={`w-0.5 h-7 mt-0.5 ${done ? 'bg-green-300' : 'bg-gray-200'}`} />}
            </div>
            <div className="pb-4">
              <p className={`font-poppins font-semibold text-[13px] ${done ? 'text-charcoal' : 'text-mid-gray'}`}>{STEP_LABELS[step]}</p>
              <p className="text-[11px] font-inter text-mid-gray">{done && step === status ? 'Completed' : done ? '✓' : 'Pending'}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

const FILTERS = ['All', 'Pending', 'Confirmed', 'In Transit', 'Delivered', 'Cancelled']

export default function OrdersPage() {
  const [orders,   setOrders]   = useState<Order[]>([])
  const [loading,  setLoading]  = useState(true)
  const [filter,   setFilter]   = useState('All')
  const [expanded, setExpanded] = useState<number | null>(null)
  const [cancelling, setCancelling] = useState<number | null>(null)
  const toast = useToast()

  useEffect(() => {
    ordersApi.list().then(r => {
      if (r.ok && Array.isArray(r.data)) setOrders(r.data as Order[])
      setLoading(false)
    })
  }, [])

  async function handleCancel(id: number) {
    setCancelling(id)
    const r = await ordersApi.cancel(id)
    if (r.ok) {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'cancelled' } : o))
      toast.show('Order cancelled successfully', '✓')
    } else {
      toast.show(r.detail ?? 'Could not cancel order', '✕')
    }
    setCancelling(null)
  }

  const filtered = filter === 'All'
    ? orders
    : orders.filter(o => o.status.toLowerCase().replace(/_/g,' ') === filter.toLowerCase())

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div>
        <h1 className="font-poppins font-extrabold text-2xl text-charcoal">My Orders</h1>
        <p className="text-mid-gray font-inter text-sm mt-0.5">
          {loading ? 'Loading…' : `${orders.length} order${orders.length !== 1 ? 's' : ''} placed`}
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-[12px] font-poppins font-bold px-3.5 py-1.5 rounded-full border transition-colors ${
              filter === f ? 'bg-brand-blue text-white border-brand-blue' : 'bg-white text-gray-500 border-gray-200 hover:border-brand-blue hover:text-brand-blue'
            }`}>
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[0,1,2].map(i => <div key={i} className="h-20 bg-white rounded-2xl animate-pulse shadow-sm" />)}
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {filtered.map((o, i) => {
            const statusKey   = o.status.toLowerCase()
            const statusLabel = o.status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
            const canCancel   = statusKey === 'pending' || statusKey === 'confirmed'

            return (
              <motion.div
                key={o.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ delay: i * 0.06 }}
                className="bg-white rounded-2xl shadow-sm overflow-hidden"
              >
                {/* Order header */}
                <div className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-off-white transition"
                  onClick={() => setExpanded(expanded === o.id ? null : o.id)}>
                  <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center text-xl shrink-0">📦</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-poppins font-bold text-[14px] text-charcoal">#ORD-{o.id}</span>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${STATUS_COLORS[statusKey] ?? 'bg-gray-100 text-gray-600'}`}>
                        {statusLabel}
                      </span>
                    </div>
                    <p className="text-xs text-mid-gray font-inter mt-0.5 truncate">
                      {o.items.map(it => `${it.product_emoji ?? '💊'} ${it.product_name}`).join(', ')}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-poppins font-bold text-sm text-brand-blue">
                      Rs. {(o.total_amount + o.delivery_fee).toLocaleString()}
                    </p>
                    <p className="text-[11px] text-mid-gray font-inter">{fmtDate(o.created_at)}</p>
                  </div>
                  <span className={`text-mid-gray transition-transform ${expanded === o.id ? 'rotate-180' : ''}`}>▾</span>
                </div>

                {/* Expanded detail */}
                <AnimatePresence initial={false}>
                  {expanded === o.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden border-t border-gray-100"
                    >
                      <div className="px-5 py-4 space-y-4">
                        {/* Items */}
                        <div>
                          <p className="text-[11px] font-poppins font-bold text-charcoal uppercase tracking-wider mb-2">Items Ordered</p>
                          {o.items.map((it) => (
                            <div key={it.id} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                              <span className="text-sm font-inter text-charcoal">
                                {it.product_emoji ?? '💊'} {it.product_name}
                              </span>
                              <div className="flex items-center gap-4 text-sm font-inter">
                                <span className="text-mid-gray">×{it.qty}</span>
                                <span className="font-poppins font-bold text-charcoal">Rs. {it.subtotal.toLocaleString()}</span>
                              </div>
                            </div>
                          ))}
                          <div className="flex justify-between pt-2 text-sm">
                            <span className="text-mid-gray font-inter">Delivery fee</span>
                            <span className="font-poppins font-semibold text-charcoal">
                              {o.delivery_fee === 0 ? 'Free' : `Rs. ${o.delivery_fee.toLocaleString()}`}
                            </span>
                          </div>
                        </div>

                        {/* Timeline */}
                        {statusKey !== 'cancelled' && (
                          <div>
                            <p className="text-[11px] font-poppins font-bold text-charcoal uppercase tracking-wider mb-3">Tracking</p>
                            <OrderTimeline status={statusKey} />
                          </div>
                        )}

                        {o.delivery_address && (
                          <p className="text-xs font-inter text-mid-gray">📍 {o.delivery_address}</p>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-gray-100 gap-2 flex-wrap">
                          <span className="text-xs font-inter text-mid-gray">
                            Placed: {fmtDate(o.created_at)}
                          </span>
                          <div className="flex gap-2">
                            {canCancel && (
                              <button
                                onClick={() => handleCancel(o.id)}
                                disabled={cancelling === o.id}
                                className="text-xs text-red-500 font-poppins font-semibold px-3 py-1.5 rounded-lg hover:bg-red-50 transition border border-red-200 disabled:opacity-50"
                              >
                                {cancelling === o.id ? 'Cancelling…' : 'Cancel Order'}
                              </button>
                            )}
                            <button className="text-xs bg-brand-blue text-white font-poppins font-bold px-4 py-1.5 rounded-lg hover:bg-blue-700 transition">
                              Reorder
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </AnimatePresence>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl">
          <span className="text-4xl">📦</span>
          <p className="font-poppins font-bold text-charcoal mt-3">No {filter} orders</p>
          <p className="text-mid-gray font-inter text-sm mt-1">Your orders will appear here</p>
        </div>
      )}
    </div>
  )
}
