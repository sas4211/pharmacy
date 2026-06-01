import Link from 'next/link'
import PaymentBadges from './PaymentBadges'

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white pt-24 pb-8 relative overflow-hidden">
      {/* Cinematic noise overlay for footer */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none noise-overlay" />
      
      <div className="w-[92%] max-w-[1400px] mx-auto relative z-10">

        {/* ── Checkout CTA strip (Cinematic Double Bezel) ── */}
        <div className="mb-20 rounded-[32px] overflow-hidden p-1.5 bg-white/5 border border-white/10 shadow-2xl shadow-black/40">
          <div className="rounded-[calc(32px-0.5rem)] relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#0a1050 0%,#1220a8 50%,#7b2d8b 100%)' }}>
            {/* Mesh gradient overlay */}
            <div className="absolute inset-0 opacity-40 mix-blend-overlay bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 px-10 py-10">
              <div className="flex items-center gap-6 text-center lg:text-left">
                <div className="w-16 h-16 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center text-white backdrop-blur-xl shrink-0 shadow-inner">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
                    <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                  </svg>
                </div>
                <div>
                  <p className="font-poppins font-black text-xl md:text-2xl text-white leading-tight tracking-tighter">Ready to place your order?</p>
                  <p className="text-white/70 font-inter text-base mt-1 max-w-lg">
                    Free delivery on orders above <span className="text-white font-bold">Rs. 5,000</span> · Genuine medicines sourced daily.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <Link
                  href="/checkout"
                  className="group inline-flex items-center gap-4 bg-white text-brand-blue font-poppins font-black text-sm px-8 py-4 rounded-2xl hover:bg-blue-50 transition-all duration-500 shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:-translate-y-1 active:scale-95"
                >
                  Proceed to Checkout
                  <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center transition-all duration-500 group-hover:translate-x-1">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </div>
            </div>
            
            <div className="relative z-10 flex flex-wrap items-center justify-center lg:justify-start gap-8 px-10 pb-6 border-t border-white/10 pt-5 bg-black/10">
              {[
                { icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                ), text: 'SSL Encrypted' },
                { icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
                ), text: 'Cash on Delivery' },
                { icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><polyline points="3 3 3 8 8 8" /></svg>
                ), text: '7-Day Returns' },
                { icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                ), text: 'Same-Day Delivery' },
              ].map(b => (
                <div key={b.text} className="flex items-center gap-2.5 text-white/80 font-poppins font-bold text-[10px] uppercase tracking-widest">
                  <span className="opacity-60">{b.icon}</span><span>{b.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">

          {/* Brand */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg"
                style={{ background: 'linear-gradient(135deg,#1220a8,#7b2d8b)' }}
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2v-5h2v5zm0-7h-2V7h2v2z"/>
                </svg>
              </div>
              <div className="font-poppins">
                <div className="font-black text-lg tracking-tighter">Hussain Healthcare</div>
                <div className="text-[10px] text-white/40 tracking-[0.2em] uppercase font-bold">Trusted Pharmacy</div>
              </div>
            </div>
            <p className="text-white/50 font-inter text-sm leading-relaxed max-w-xs">
              Karachi's elite online pharmacy. Delivering clinical-grade medicines and professional wellness care to your doorstep with precision.
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2.5">
              {[
                { icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                ), label: 'SSL Secured' },
                { icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3"><polyline points="20 6 9 17 4 12" /></svg>
                ), label: 'DRAP Licensed' },
              ].map(b => (
                <div key={b.label} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                  <span className="text-blue-400">{b.icon}</span>
                  <span className="text-white/60 font-poppins text-[10px] font-bold uppercase tracking-wider">{b.label}</span>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div className="flex gap-3">
              {[
                { label: (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                ), title: 'Facebook' },
                { label: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                ), title: 'Instagram' },
                { label: (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></svg>
                ), title: 'LinkedIn' },
              ].map((s, i) => (
                <a
                  key={i}
                  href="#"
                  title={s.title}
                  className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 hover:bg-blue-600 hover:border-blue-600 flex items-center justify-center text-white transition-all duration-500 shadow-lg"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h5 className="font-poppins font-black text-xs uppercase tracking-[0.2em] mb-7 text-white/40">Navigation</h5>
            <ul className="space-y-4">
              {[
                { label: 'Home', href: '/' },
                { label: 'About Us', href: '#' },
                { label: 'Arrange For Me', href: '#' },
                { label: 'Dow Lab Tests', href: '#' },
                { label: 'Blogs & Articles', href: '/articles' },
                { label: 'Returns Policy', href: '/returns' },
              ].map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="text-white/60 hover:text-white font-inter text-sm transition-colors duration-300 flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h5 className="font-poppins font-black text-xs uppercase tracking-[0.2em] mb-7 text-white/40">Sectors</h5>
            <ul className="space-y-4">
              {[
                'Medicine', 'Nutritions & Supplements', 'Skin Care', 'Baby Care', 'Medical Devices', 'Mother Care'
              ].map(c => (
                <li key={c}>
                  <a href="#" className="text-white/60 hover:text-white font-inter text-sm transition-colors duration-300 flex items-center gap-2 group">
                    <span className="w-1.5 h-[1px] bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {c}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-8">
            <div>
              <h5 className="font-poppins font-black text-xs uppercase tracking-[0.2em] mb-7 text-white/40">Headquarters</h5>
              <div className="space-y-4">
                {[
                  { icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  ), text: 'Block 4, Gulshan-e-Iqbal,\nKarachi, Pakistan' },
                  { icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                  ), text: '+92 331 111 3292' },
                ].map((c, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <span className="text-blue-500 mt-1 shrink-0">{c.icon}</span>
                    <p className="text-white/60 font-inter text-sm leading-relaxed whitespace-pre-line">{c.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery info */}
            <div className="bg-white/5 border border-white/10 rounded-[20px] p-5 space-y-3">
              <p className="text-white/90 font-poppins font-black text-[10px] uppercase tracking-widest">Global Logistics</p>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-white/50 font-inter text-xs">
                  <div className="w-1 h-1 rounded-full bg-blue-500" />
                  <span>Standard: 2–4 hrs</span>
                </div>
                <div className="flex items-center gap-3 text-white/50 font-inter text-xs">
                  <div className="w-1 h-1 rounded-full bg-red-500" />
                  <span>Express: 45–60 min</span>
                </div>
                <div className="flex items-center gap-3 text-green-400 font-inter text-xs font-bold">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span>Free delivery above Rs. 5,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Payment & Security strip ── */}
        <div className="border-t border-white/10 pt-10 mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">

            {/* Accepted payments */}
            <div>
              <p className="text-white/30 font-poppins font-black text-[10px] uppercase tracking-[0.25em] mb-5">
                Authorized Payment Partners
              </p>
              <PaymentBadges size="md" theme="dark" />
            </div>

            {/* Security assurances */}
            <div className="flex flex-col items-start lg:items-end gap-5">
              <p className="text-white/30 font-poppins font-black text-[10px] uppercase tracking-[0.25em]">
                System Security & Compliance
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  ), label: '256-bit SSL' },
                  { icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                  ), label: 'PCI Compliant' },
                  { icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                  ), label: 'DRAP #PHL-2024' },
                ].map(b => (
                  <div
                    key={b.label}
                    className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2"
                  >
                    <span className="text-blue-500">{b.icon}</span>
                    <span className="text-white/60 font-poppins text-[10px] font-bold tracking-wider">{b.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-white/30 font-inter text-xs text-center md:text-left">
            © 2026 Hussain Healthcare Private Limited. All clinical operations are DRAP licensed.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {['Privacy Policy','Terms of Service','Sitemap','Refunds'].map(l => (
              <a key={l} href="#" className="text-white/30 hover:text-white/60 font-poppins font-bold text-[10px] uppercase tracking-widest transition-colors duration-300">{l}</a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  )
}
