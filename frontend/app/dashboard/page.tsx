'use client'
import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import Link from 'next/link'
import SpotlightCard from '@/components/SpotlightCard'
import { ordersApi, prescriptionsApi, servicesApi } from '@/lib/api'
import type { Order, Prescription, ServiceBooking } from '@/types'

const STATUS_COLOR: Record<string, string> = {
  delivered:  'bg-green-100 text-green-700',
  confirmed:  'bg-purple-100 text-purple-700',
  pending:    'bg-amber-100 text-amber-700',
  in_transit: 'bg-blue-100 text-blue-700',
  cancelled:  'bg-red-100 text-red-700',
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-PK', { month: 'short', day: 'numeric', year: 'numeric' })
}

const QUICK_ACTIONS = [
  { label: 'Upload Prescription', emoji: '📤', href: '/dashboard/prescriptions', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { label: 'Book Consultation',   emoji: '🩺', href: '/services',                color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { label: 'Track My Order',      emoji: '📦', href: '/dashboard/orders',        color: 'bg-teal-50 text-teal-700 border-teal-200' },
  { label: 'Shop Medicines',      emoji: '💊', href: '/',                        color: 'bg-amber-50 text-amber-700 border-amber-200' },
]

const HEALTH_REMINDERS = [
  { text: 'HbA1c test due this month',  emoji: '🩸', urgency: 'medium' },
  { text: 'Metformin refill in 5 days', emoji: '💊', urgency: 'high' },
  { text: 'BP check overdue by 12 days',emoji: '❤️', urgency: 'high' },
]

export default function DashboardOverview() {
  const { user } = useUser()
  const hour     = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const [orders,        setOrders]        = useState<Order[]>([])
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [appointments,  setAppointments]  = useState<ServiceBooking[]>([])
  const [loading,       setLoading]       = useState(true)

  useEffect(() => {
    Promise.all([
      ordersApi.list(),
      prescriptionsApi.list(),
      servicesApi.list(),
    ]).then(([o, p, s]) => {
      if (o.ok && Array.isArray(o.data))        setOrders(o.data as Order[])
      if (p.ok && Array.isArray(p.data))        setPrescriptions(p.data as Prescription[])
      if (s.ok && Array.isArray(s.data))        setAppointments(s.data as ServiceBooking[])
      setLoading(false)
    })
  }, [])

  const inProgressOrders     = orders.filter(o => ['pending','confirmed','in_transit'].includes(o.status))
  const pendingPrescriptions = prescriptions.filter(p => p.status === 'pending' || p.status === 'reviewing')
  const upcomingAppointments = appointments.filter(a => a.status === 'confirmed' || a.status === 'pending')

  const STATS = [
    { label: 'Total Orders',  val: loading ? '…' : String(orders.length),        sub: loading ? '' : `${inProgressOrders.length} in progress`,    emoji: '📦', color: 'from-blue-500 to-blue-700',    href: '/dashboard/orders' },
    { label: 'Prescriptions', val: loading ? '…' : String(prescriptions.length), sub: loading ? '' : `${pendingPrescriptions.length} pending review`,emoji: '📋', color: 'from-purple-500 to-purple-700',href: '/dashboard/prescriptions' },
    { label: 'Appointments',  val: loading ? '…' : String(appointments.length),  sub: loading ? '' : `${upcomingAppointments.length} upcoming`,      emoji: '🩺', color: 'from-teal-500 to-teal-700',    href: '/dashboard/appointments' },
    { label: 'Health Points', val: '840',                                         sub: 'Rs. 840 redeemable',                                          emoji: '⭐', color: 'from-amber-500 to-orange-600', href: '/dashboard/health' },
  ]

  const recentOrders = orders.slice(0, 3)

  return (
    <div className="space-y-6 max-w-5xl mx-auto">

      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden p-6 md:p-8"
        style={{ background: 'linear-gradient(135deg,#0d1b6e 0%,#1a3fd4 55%,#7b2d8b 100%)' }}
      >
        <div className="absolute w-72 h-72 rounded-full bg-white/5 -top-20 -right-20" />
        <div className="absolute w-40 h-40 rounded-full bg-white/5 bottom-0 left-[30%]" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-white/60 font-inter text-sm mb-1">{greeting} 👋</p>
            <h1 className="font-poppins font-extrabold text-2xl md:text-3xl text-white">
              {user?.firstName ?? 'Patient'} {user?.lastName ?? ''}
            </h1>
            <p className="text-white/60 font-inter text-sm mt-1">
              Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-PK', { month: 'long', year: 'numeric' }) : 'recently'}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="bg-white/15 text-white text-xs font-inter px-3 py-1 rounded-full backdrop-blur-sm">⭐ 840 Health Points</span>
              <span className="bg-white/15 text-white text-xs font-inter px-3 py-1 rounded-full backdrop-blur-sm">🏆 Gold Member</span>
              <span className="bg-white/15 text-white text-xs font-inter px-3 py-1 rounded-full backdrop-blur-sm">✅ Verified Patient</span>
            </div>
          </div>
          <Link href="/services" className="shrink-0 bg-white text-brand-blue font-poppins font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-blue-50 transition shadow-lg">
            Book a Service →
          </Link>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(0,0,0,.15)' }}
          >
            <Link href={s.href}>
              <SpotlightCard className={`bg-gradient-to-br ${s.color} rounded-2xl p-5 cursor-pointer`}>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{s.emoji}</span>
                  <span className="text-white/60 text-[11px] font-inter">{s.sub}</span>
                </div>
                <div className="font-poppins font-extrabold text-3xl text-white mb-0.5">{s.val}</div>
                <div className="font-inter text-sm text-white/75">{s.label}</div>
              </SpotlightCard>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="font-poppins font-bold text-[15px] text-charcoal mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map((a) => (
            <Link key={a.label} href={a.href}>
              <motion.div
                whileHover={{ y: -3 }}
                className={`${a.color} border rounded-2xl p-4 flex flex-col items-center gap-2 text-center cursor-pointer transition-shadow hover:shadow-md`}
              >
                <span className="text-2xl">{a.emoji}</span>
                <span className="font-poppins font-semibold text-[12px] leading-snug">{a.label}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Health Reminders + Upcoming */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Health Reminders */}
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-poppins font-bold text-[15px] text-charcoal">Health Reminders</h2>
            <span className="text-xs font-inter text-mid-gray">AI-powered</span>
          </div>
          <div className="space-y-3">
            {HEALTH_REMINDERS.map((r, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${r.urgency === 'high' ? 'bg-red-50' : 'bg-amber-50'}`}>
                <span className="text-xl">{r.emoji}</span>
                <p className={`font-inter text-sm flex-1 ${r.urgency === 'high' ? 'text-red-700' : 'text-amber-700'}`}>{r.text}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.urgency === 'high' ? 'bg-red-200 text-red-700' : 'bg-amber-200 text-amber-700'}`}>
                  {r.urgency === 'high' ? 'Urgent' : 'Due soon'}
                </span>
              </div>
            ))}
          </div>
          <Link href="/dashboard/health" className="block mt-4 text-center text-brand-blue font-poppins font-bold text-sm hover:underline">
            View Health Profile →
          </Link>
        </motion.div>

        {/* Upcoming Appointments */}
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 }}
          className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-poppins font-bold text-[15px] text-charcoal">Upcoming</h2>
            <Link href="/dashboard/appointments" className="text-xs text-brand-blue font-inter hover:underline">See all</Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[0,1].map(i => <div key={i} className="h-16 bg-off-white rounded-xl animate-pulse" />)}
            </div>
          ) : upcomingAppointments.length === 0 ? (
            <div className="text-center py-6">
              <span className="text-3xl">🗓️</span>
              <p className="text-sm text-mid-gray font-inter mt-2">No upcoming appointments</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingAppointments.slice(0, 2).map((a, i) => (
                <div key={a.id} className="flex items-start gap-3 bg-off-white p-3 rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center text-xl shrink-0">
                    {a.is_online ? '🩺' : '🏥'}
                  </div>
                  <div>
                    <p className="font-poppins font-bold text-[13px] text-charcoal">{a.service_name}</p>
                    <p className="text-xs text-mid-gray font-inter">{a.is_online ? 'Online' : 'In-Store'}</p>
                    {a.booking_date && (
                      <p className="text-xs font-inter text-brand-blue mt-0.5">
                        📅 {fmtDate(a.booking_date)}{a.booking_time ? ` · ${a.booking_time}` : ''}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          <Link href="/services" className="block mt-4 text-center text-brand-blue font-poppins font-bold text-sm hover:underline">
            Book New Appointment →
          </Link>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-poppins font-bold text-[15px] text-charcoal">Recent Orders</h2>
          <Link href="/dashboard/orders" className="text-xs text-brand-blue font-inter hover:underline">View all</Link>
        </div>
        {loading ? (
          <div className="divide-y divide-gray-50">
            {[0,1,2].map(i => <div key={i} className="h-14 mx-5 my-2 bg-off-white rounded-xl animate-pulse" />)}
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-3xl">📦</span>
            <p className="font-poppins font-bold text-charcoal mt-2">No orders yet</p>
            <p className="text-mid-gray font-inter text-sm mt-1">Your orders will appear here</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentOrders.map((o) => {
              const statusKey = o.status.toLowerCase().replace(/ /g, '_')
              const statusLabel = o.status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
              return (
                <div key={o.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-off-white transition">
                  <div className="w-9 h-9 rounded-xl bg-brand-blue/10 flex items-center justify-center text-base shrink-0">📦</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-poppins font-semibold text-[13px] text-charcoal">#ORD-{o.id}</p>
                    <p className="text-xs text-mid-gray font-inter truncate">
                      {o.items.map(it => `${it.product_emoji ?? '💊'} ${it.product_name}`).join(', ')}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-full ${STATUS_COLOR[statusKey] ?? 'bg-gray-100 text-gray-600'}`}>
                      {statusLabel}
                    </span>
                    <p className="text-[11px] text-mid-gray font-inter mt-0.5">{fmtDate(o.created_at)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </motion.div>

    </div>
  )
}
