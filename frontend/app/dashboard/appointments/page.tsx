'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { servicesApi } from '@/lib/api'
import { useToast } from '@/store'
import type { ServiceBooking } from '@/types'

const SERVICE_EMOJI: Record<string, string> = {
  consultation:  '🩺',
  lab_test:      '🧪',
  vaccination:   '💉',
  medication_review: '🌙',
  bp_check:      '❤️',
  delivery:      '🚚',
}

function getEmoji(type: string) {
  return SERVICE_EMOJI[type.toLowerCase()] ?? '🏥'
}

function fmtDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-PK', { month: 'short', day: 'numeric', year: 'numeric' })
}

function Stars({ n }: { n: number }) {
  return <span className="text-amber-400 text-xs">{'★'.repeat(n)}{'☆'.repeat(5 - n)}</span>
}

export default function AppointmentsPage() {
  const [bookings,    setBookings]    = useState<ServiceBooking[]>([])
  const [loading,     setLoading]     = useState(true)
  const [fetchError,  setFetchError]  = useState<string | null>(null)
  const [cancelling,  setCancelling]  = useState<number | null>(null)
  const toast = useToast()

  useEffect(() => {
    servicesApi.list().then(r => {
      if (r.ok && Array.isArray(r.data)) {
        setBookings(r.data as ServiceBooking[])
      } else if (!r.ok) {
        setFetchError(r.status === 401 ? 'Please sign in to view appointments.' : (r.detail ?? 'Failed to load appointments.'))
      }
      setLoading(false)
    })
  }, [])

  async function handleCancel(id: number) {
    setCancelling(id)
    const r = await servicesApi.cancel(id)
    if (r.ok) {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b))
      toast.show('Appointment cancelled', '✓')
    } else {
      toast.show(r.detail ?? 'Could not cancel appointment', '✕')
    }
    setCancelling(null)
  }

  const upcoming = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending')
  const past     = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled')

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-poppins font-extrabold text-2xl text-charcoal">My Appointments</h1>
          <p className="text-mid-gray font-inter text-sm mt-0.5">
            {loading ? 'Loading…' : `${upcoming.length} upcoming · ${past.length} completed`}
          </p>
        </div>
        <Link href="/services"
          className="bg-brand-blue text-white font-poppins font-bold text-sm px-4 py-2 rounded-xl hover:bg-blue-700 transition shadow-sm">
          + Book New
        </Link>
      </div>

      {/* Upcoming */}
      <div>
        <h2 className="font-poppins font-bold text-[14px] text-charcoal uppercase tracking-wider mb-3">Upcoming</h2>
        {loading ? (
          <div className="space-y-3">
            {[0,1].map(i => <div key={i} className="h-32 bg-white rounded-2xl animate-pulse shadow-sm" />)}
          </div>
        ) : fetchError ? (
          <div className="text-center py-10 bg-red-50 border border-red-200 rounded-2xl">
            <span className="text-4xl">⚠️</span>
            <p className="font-poppins font-bold text-red-700 mt-3">{fetchError}</p>
          </div>
        ) : upcoming.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl shadow-sm">
            <span className="text-4xl">🗓️</span>
            <p className="font-poppins font-bold text-charcoal mt-3">No upcoming appointments</p>
            <p className="text-mid-gray font-inter text-sm mt-1">Book a service to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map((a, i) => (
              <motion.div key={a.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm shrink-0">
                    {getEmoji(a.service_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <p className="font-poppins font-bold text-[14px] text-charcoal">{a.service_name}</p>
                        <p className="text-sm font-inter text-mid-gray">{a.is_online ? 'Online' : 'In-Store'}</p>
                      </div>
                      <span className="bg-green-100 text-green-700 text-[11px] font-bold px-2.5 py-1 rounded-full capitalize">
                        {a.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-3">
                      {a.booking_date && (
                        <span className="bg-white text-charcoal text-xs font-inter px-3 py-1 rounded-lg shadow-sm">
                          📅 {fmtDate(a.booking_date)}
                        </span>
                      )}
                      {a.booking_time && (
                        <span className="bg-white text-charcoal text-xs font-inter px-3 py-1 rounded-lg shadow-sm">
                          🕐 {a.booking_time}
                        </span>
                      )}
                      <span className="bg-white text-charcoal text-xs font-inter px-3 py-1 rounded-lg shadow-sm">
                        📍 {a.is_online ? 'Video Call' : 'In-Store'}
                      </span>
                    </div>
                    {a.notes && (
                      <p className="text-xs font-inter text-mid-gray mt-2">📝 {a.notes}</p>
                    )}
                    <div className="flex gap-2 mt-3">
                      {a.is_online && (
                        <button className="text-xs bg-brand-blue text-white font-poppins font-bold px-4 py-1.5 rounded-lg hover:bg-blue-700 transition">
                          Join Video Call
                        </button>
                      )}
                      <button
                        onClick={() => handleCancel(a.id)}
                        disabled={cancelling === a.id}
                        className="text-xs text-red-500 font-poppins font-semibold px-3 py-1.5 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
                      >
                        {cancelling === a.id ? 'Cancelling…' : 'Cancel'}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Past */}
      {!loading && past.length > 0 && (
        <div>
          <h2 className="font-poppins font-bold text-[14px] text-charcoal uppercase tracking-wider mb-3">Past Appointments</h2>
          <div className="space-y-3">
            {past.map((a, i) => (
              <motion.div key={a.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.08 }}
                className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4 hover:shadow-md transition">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xl shrink-0">
                  {getEmoji(a.service_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-poppins font-bold text-[13px] text-charcoal">{a.service_name}</p>
                  <p className="text-xs text-mid-gray font-inter">
                    {a.is_online ? 'Online' : 'In-Store'} · {fmtDate(a.booking_date ?? a.created_at)}
                  </p>
                  {a.status === 'completed' && <Stars n={5} />}
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full capitalize ${
                    a.status === 'completed' ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-700'
                  }`}>{a.status}</span>
                  {a.status === 'completed' && (
                    <Link href="/services" className="block text-xs text-brand-blue font-inter hover:underline mt-1 text-right">
                      Book again
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="bg-gradient-to-br from-brand-blue to-purple-700 rounded-2xl p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="font-poppins font-bold text-[15px]">Need a consultation?</p>
          <p className="text-white/70 font-inter text-sm mt-0.5">Same-day appointments available — online or in-store</p>
        </div>
        <Link href="/services" className="bg-white text-brand-blue font-poppins font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-blue-50 transition whitespace-nowrap">
          Book Now →
        </Link>
      </div>
    </div>
  )
}
