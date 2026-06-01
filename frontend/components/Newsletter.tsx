'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { newsletterApi } from '@/lib/api'
import { useToast } from '@/store'

const PERKS = [
  { icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m14.5 9.5-5 5" /><path d="M8.5 8.5c-.7-.7-1.8-.7-2.5 0s-.7 1.8 0 2.5l5.5 5.5c.7.7 1.8.7 2.5 0s.7-1.8 0-2.5z" /></svg>
  ), text: 'Weekly health tips from our pharmacists' },
  { icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>
  ), text: 'Exclusive subscriber-only discount codes' },
  { icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
  ), text: 'Flash sale alerts before they go live' },
]

export default function Newsletter() {
  const [email, setEmail]     = useState('')
  const [done, setDone]       = useState(false)
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await newsletterApi.subscribe(email)
    setLoading(false)
    if (res.ok || res.status === 409) {
      setDone(true); setEmail('')
      toast.show('Welcome to the Hussain Healthcare family! 💊')
      setTimeout(() => setDone(false), 5000)
    } else {
      toast.show(res.detail ?? 'Something went wrong — please try again', '✕')
    }
  }

  return (
    <section className="py-12 bg-off-white">
      <div className="w-[92%] max-w-[1280px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-[24px] overflow-hidden shadow-card ring-1 ring-black/[0.04]"
        >
          <div className="grid md:grid-cols-[1fr_1.1fr]">

            {/* Left — content */}
            <div
              className="p-8 md:p-10 flex flex-col justify-center"
              style={{ background: 'linear-gradient(135deg,#1230a8 0%,#1a3fd4 60%,#7b2d8b 100%)' }}
            >
              <span className="inline-block bg-white/20 text-white text-[11px] font-semibold px-3 py-1 rounded-full font-inter mb-4 w-fit">
                📬 Health Newsletter
              </span>
              <h3 className="font-poppins font-black text-white text-xl md:text-2xl leading-tight mb-3 tracking-[-0.01em]">
                Stay Healthy —<br />Stay Informed.
              </h3>
              <p className="text-white/75 font-inter text-sm mb-6 leading-relaxed">
                Join 12,000+ Pakistanis getting weekly health advice, exclusive deals, and early access to new products. Unsubscribe anytime — no spam, ever.
              </p>
              <div className="space-y-3">
                {PERKS.map(p => (
                  <div key={p.text} className="flex items-center gap-3 text-white/85 font-inter text-sm">
                    <span className="text-base">{p.icon}</span>
                    <span>{p.text}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-9 h-9 rounded-full bg-white/10 border-2 border-white/30 backdrop-blur-md flex items-center justify-center overflow-hidden">
                      <div className="w-full h-full bg-blue-600/20" />
                    </div>
                  ))}
                </div>
                <p className="text-white/60 font-inter text-[12px]">
                  <span className="text-white font-black tracking-wider">12,000+</span> citizens already reading
                </p>
              </div>
            </div>

            {/* Right — form */}
            <div className="p-8 md:p-14 flex flex-col justify-center bg-white">
              {done ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  className="text-center py-10"
                >
                  <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-10 h-10">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h4 className="font-poppins font-black text-2xl text-charcoal mb-3 tracking-tighter">Registration Complete</h4>
                  <p className="text-mid-gray font-inter text-sm leading-relaxed max-w-xs mx-auto">
                    Welcome to the family. Your first clinical health digest arrives this Sunday morning.
                  </p>
                </motion.div>
              ) : (
                <>
                  <h4 className="font-poppins font-black text-2xl text-charcoal mb-3 tracking-tighter">Get Your Clinical Digest</h4>
                  <p className="text-mid-gray font-inter text-sm mb-8 leading-relaxed max-w-sm">
                    Enter your email to receive weekly medical insights and early access to rare medicine sourcing.
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative group">
                      <input
                        type="email" required value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full px-6 py-4 border border-black/[0.06] rounded-2xl font-inter text-sm outline-none focus:border-blue-600/50 focus:ring-4 focus:ring-blue-600/5 transition-all duration-300 bg-black/[0.02]"
                      />
                    </div>
                    <button
                      type="submit" disabled={loading}
                      className="group w-full py-4 rounded-2xl text-white font-poppins font-black text-sm transition-all duration-500 hover:shadow-2xl hover:shadow-blue-600/20 active:scale-[.98] disabled:opacity-60 flex items-center justify-center gap-3"
                      style={{ background: 'linear-gradient(135deg,#0a1050,#1220a8)' }}
                    >
                      {loading ? 'Processing...' : (
                        <>
                          Subscribe for Free
                          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                        </>
                      )}
                    </button>
                  </form>
                  <div className="flex flex-wrap gap-4 mt-8 pt-8 border-t border-black/[0.04]">
                    {[{ txt: 'Weekly health data' }, { txt: 'Exclusive deals' }, { txt: 'Expert advice' }].map(b => (
                      <div key={b.txt} className="flex items-center gap-2 bg-black/[0.02] rounded-xl px-4 py-2">
                        <div className="w-1 h-1 rounded-full bg-blue-600" />
                        <span className="text-[10px] font-poppins font-bold text-mid-gray uppercase tracking-widest">{b.txt}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
