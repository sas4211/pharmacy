'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton, useUser } from '@clerk/nextjs'
import { motion, AnimatePresence } from 'framer-motion'

const NAV = [
  { href: '/dashboard',              icon: '⚡', label: 'Overview',        badge: null },
  { href: '/dashboard/orders',       icon: '📦', label: 'My Orders',       badge: '3' },
  { href: '/dashboard/prescriptions',icon: '📋', label: 'Prescriptions',   badge: '1' },
  { href: '/dashboard/appointments', icon: '🩺', label: 'Appointments',    badge: null },
  { href: '/dashboard/health',       icon: '❤️', label: 'Health Profile',  badge: null },
  { href: '/dashboard/settings',     icon: '⚙️', label: 'Settings',        badge: null },
]

const QUICK_STATS = [
  { label: 'Orders', val: '12', emoji: '📦' },
  { label: 'Points', val: '840', emoji: '⭐' },
  { label: 'Saved', val: 'Rs.2.4k', emoji: '💰' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user } = useUser()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#f4f6fb] flex">

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 sticky top-0 h-screen"
        style={{ background: 'linear-gradient(160deg,#0d1b6e 0%,#1a3fd4 50%,#7b2d8b 100%)' }}>

        {/* Logo */}
        <div className="px-5 pt-6 pb-4 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-lg backdrop-blur-sm">💊</div>
            <div>
              <p className="font-poppins font-bold text-white text-[13px] leading-none">Hussain Healthcare</p>
              <p className="text-white/50 text-[10px] font-inter mt-0.5">Patient Dashboard</p>
            </div>
          </Link>
        </div>

        {/* User card */}
        <div className="px-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-3 bg-white/10 rounded-2xl p-3 backdrop-blur-sm">
            <UserButton appearance={{ elements: { avatarBox: 'w-10 h-10 rounded-xl' } }} />
            <div className="flex-1 min-w-0">
              <p className="text-white font-poppins font-semibold text-sm truncate">
                {user?.firstName ?? 'Patient'}
              </p>
              <p className="text-white/50 font-inter text-[11px] truncate">
                {user?.primaryEmailAddress?.emailAddress ?? ''}
              </p>
            </div>
          </div>
          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-1.5 mt-3">
            {QUICK_STATS.map(s => (
              <div key={s.label} className="bg-white/8 rounded-xl p-2 text-center">
                <div className="text-base">{s.emoji}</div>
                <div className="text-white font-poppins font-bold text-[11px]">{s.val}</div>
                <div className="text-white/40 font-inter text-[9px]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map(item => {
            const active = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative ${
                    active
                      ? 'bg-white text-brand-blue shadow-lg'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className={`font-poppins font-semibold text-[13px] flex-1 ${active ? 'text-brand-blue' : ''}`}>
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${active ? 'bg-brand-blue text-white' : 'bg-white/20 text-white'}`}>
                      {item.badge}
                    </span>
                  )}
                  {active && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-brand-blue rounded-l-full" />}
                </motion.div>
              </Link>
            )
          })}
        </nav>

        {/* Bottom links */}
        <div className="px-3 pb-5 space-y-1 border-t border-white/10 pt-3">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition">
            <span className="text-lg">🏪</span>
            <span className="font-inter text-[13px]">Back to Shop</span>
          </Link>
          <Link href="/services" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition">
            <span className="text-lg">🩺</span>
            <span className="font-inter text-[13px]">Book a Service</span>
          </Link>
        </div>
      </aside>

      {/* ── Mobile header ── */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-50 px-4 py-3 flex items-center justify-between"
        style={{ background: 'linear-gradient(135deg,#0d1b6e,#1a3fd4)' }}>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-base">💊</div>
          <span className="font-poppins font-bold text-white text-sm">Dashboard</span>
        </Link>
        <div className="flex items-center gap-2">
          <UserButton />
          <button onClick={() => setMobileOpen(o => !o)} className="w-8 h-8 flex flex-col items-center justify-center gap-1.5">
            <span className={`block w-5 h-0.5 bg-white transition-transform ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-white transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-white transition-transform ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="lg:hidden fixed inset-0 z-40 w-72"
            style={{ background: 'linear-gradient(160deg,#0d1b6e,#1a3fd4 50%,#7b2d8b)' }}
          >
            <div className="pt-16 px-3 pb-4 space-y-1">
              {NAV.map(item => {
                const active = pathname === item.href
                return (
                  <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
                    <div className={`flex items-center gap-3 px-3 py-3 rounded-xl ${active ? 'bg-white' : 'text-white/80 hover:bg-white/10'}`}>
                      <span className="text-xl">{item.icon}</span>
                      <span className={`font-poppins font-semibold text-sm ${active ? 'text-brand-blue' : 'text-white'}`}>{item.label}</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {mobileOpen && <div className="lg:hidden fixed inset-0 z-30 bg-black/40" onClick={() => setMobileOpen(false)} />}

      {/* ── Main content ── */}
      <main className="flex-1 min-w-0 pt-0 lg:pt-0 mt-14 lg:mt-0 overflow-x-hidden">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="p-4 md:p-6 lg:p-8"
        >
          {children}
        </motion.div>
      </main>

    </div>
  )
}
