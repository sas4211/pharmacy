'use client'
import { motion } from 'framer-motion'

const FEATURES = [
  { icon: '⚡', text: 'Reorder in 2 taps — saved medicines & previous orders' },
  { icon: '📍', text: 'Live order tracking from dispatch to your door' },
  { icon: '📋', text: 'Instant prescription upload via camera' },
  { icon: '⏰', text: 'Medicine reminders with dose & refill alerts' },
  { icon: '🔒', text: 'Secure health records & prescription history' },
  { icon: '🎁', text: 'Exclusive app-only deals & early sale access' },
]

const STATS = [
  { val: '4.8★', label: 'App Store Rating' },
  { val: '50K+', label: 'Downloads' },
  { val: '1 min', label: 'Avg. Order Time' },
]

export default function AppDownload() {
  return (
    <section className="py-10">
      <div className="w-[92%] max-w-[1280px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-[24px] overflow-hidden p-8 md:p-12 ring-1 ring-white/10"
          style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1a3fd4 55%,#7b2d8b 100%)' }}
        >
          {/* Background blobs */}
          <div className="absolute w-96 h-96 rounded-full bg-white/5 top-[-100px] right-[-60px]" />
          <div className="absolute w-56 h-56 rounded-full bg-white/5 bottom-[-40px] left-[40%]" />

          <div className="relative z-10 grid md:grid-cols-[1fr_auto] gap-10 items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 bg-white/15 text-white text-xs font-semibold px-3 py-1 rounded-full font-inter mb-4 backdrop-blur-sm border border-white/20">
                📱 Hussain Healthcare App — Coming Soon
              </span>
              <h3 className="font-poppins font-black text-white text-2xl md:text-3xl leading-tight mb-3 tracking-[-0.01em]">
                Your Pharmacy,<br />In Your Pocket.
              </h3>
              <p className="text-white/75 font-inter text-sm mb-6 max-w-lg leading-relaxed">
                Manage your health from one app — order medicines, track deliveries, upload prescriptions, set reminders, and access your complete medical history anytime.
              </p>

              {/* Feature list */}
              <div className="grid sm:grid-cols-2 gap-2 mb-7 max-w-lg">
                {FEATURES.map(f => (
                  <div key={f.text} className="flex items-start gap-2.5 text-white/80 font-inter text-xs leading-snug">
                    <span className="text-sm shrink-0 mt-0.5">{f.icon}</span>
                    <span>{f.text}</span>
                  </div>
                ))}
              </div>

              {/* Download buttons */}
              <div className="flex gap-3 flex-wrap mb-6">
                {[
                  { icon: '🍎', small: 'Download on the', big: 'App Store' },
                  { icon: '🤖', small: 'Get it on', big: 'Google Play' },
                ].map(btn => (
                  <button
                    key={btn.big}
                    className="flex items-center gap-3 bg-white/12 hover:bg-white/22 border border-white/25 rounded-xl px-5 py-3 transition backdrop-blur-sm"
                  >
                    <span className="text-2xl">{btn.icon}</span>
                    <div className="text-left">
                      <div className="text-white/60 text-[10px] font-inter">{btn.small}</div>
                      <div className="text-white font-poppins font-bold text-sm">{btn.big}</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Stats */}
              <div className="flex gap-6">
                {STATS.map(s => (
                  <div key={s.label}>
                    <div className="font-poppins font-black text-white text-lg">{s.val}</div>
                    <div className="text-white/50 font-inter text-[10px]">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Phone mockup */}
            <div className="hidden md:flex flex-col items-center gap-4">
              <div
                className="w-48 h-80 rounded-[32px] border-4 border-white/20 flex flex-col items-center justify-between p-4 shadow-2xl animate-float-y"
                style={{ background: 'linear-gradient(160deg,#1e2a5a,#1a3fd4)' }}
              >
                {/* Status bar */}
                <div className="w-full flex justify-between text-white/50 text-[9px] font-inter px-1">
                  <span>9:41</span><span>●●●</span>
                </div>
                {/* App screen */}
                <div className="flex-1 flex flex-col items-center justify-center gap-3 w-full">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
                    style={{ background: 'linear-gradient(135deg,#1230a8,#7b2d8b)' }}>💊</div>
                  <div className="text-white font-poppins font-bold text-xs text-center">Hussain Healthcare</div>
                  <div className="w-full bg-white/10 rounded-lg p-2.5 space-y-1.5">
                    {['💊 Brufen 400mg', '🧴 CeraVe Cream', '🩸 Accu-Chek'].map(item => (
                      <div key={item} className="flex justify-between items-center text-[9px] text-white/70 font-inter">
                        <span>{item}</span>
                        <span className="text-green-400">✓</span>
                      </div>
                    ))}
                  </div>
                  <div className="w-full py-2 rounded-xl text-white text-[10px] font-bold text-center font-poppins"
                    style={{ background: 'linear-gradient(135deg,#e63946,#7b2d8b)' }}>
                    Order Now →
                  </div>
                </div>
                {/* Bottom bar */}
                <div className="w-10 h-1 bg-white/30 rounded-full" />
              </div>
              <div className="flex gap-1.5">
                {['⭐','⭐','⭐','⭐','⭐'].map((s,i) => <span key={i} className="text-yellow-400 text-sm">{s}</span>)}
              </div>
              <p className="text-white/50 font-inter text-[10px] text-center">"Best pharmacy app<br/>in Karachi" — App Store</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
