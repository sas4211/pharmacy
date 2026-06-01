'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { useAuth, useToast, useSearch } from '@/store'
import { prescriptionsApi } from '@/lib/api'
import MeshGradient from '@/components/MeshGradient'

const SLIDES = [
  {
    tag: 'Free Delivery Above Rs. 5,000',
    svgIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-white">
        <rect x="1" y="3" width="15" height="13" rx="2" ry="2" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    headline: 'Your Health.\nOur Priority.',
    sub: 'Genuine medicines, vitamins & devices — delivered to your doorstep across Karachi. Open 7 days, 9am–9pm.',
    cta: 'Shop Now',
    badge: '1,500+ Medicines',
    action: 'shop',
    bgImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=80',
    personImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=700&q=85',
    personLabel: 'Dr. Aisha Rehman',
    personRole: 'Clinical Pharmacist',
    tint: 'linear-gradient(135deg, rgba(18,48,168,0.92) 0%, rgba(26,63,212,0.70) 50%, rgba(123,45,139,0.40) 100%)',
    accent: '#1a3fd4',
    meshColors: ['rgba(26,63,212,0.15)', 'rgba(123,45,139,0.10)', 'rgba(39,85,232,0.08)'],
    stats: [{ val: '1,500+', label: 'Medicines' }, { val: '7 Days', label: 'Open Weekly' }, { val: '9AM–9PM', label: 'Store Hours' }],
  },
  {
    tag: '45-Minute Express Delivery',
    svgIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-white">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    headline: 'Need It Fast?\nWe Deliver.',
    sub: 'Order before 8 PM and get express delivery in under 45 minutes anywhere in Karachi. Real-time order tracking included.',
    cta: 'Order Express',
    badge: 'Rs. 400 delivery',
    action: 'shop',
    bgImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1600&q=80',
    personImage: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=700&q=85',
    personLabel: 'Muhammad Bilal',
    personRole: 'Senior Pharmacist',
    tint: 'linear-gradient(135deg, rgba(180,20,35,0.92) 0%, rgba(123,45,139,0.70) 50%, rgba(26,63,212,0.30) 100%)',
    accent: '#e63946',
    meshColors: ['rgba(230,57,70,0.12)', 'rgba(123,45,139,0.10)', 'rgba(180,20,35,0.08)'],
    stats: [{ val: '45 min', label: 'Express ETA' }, { val: 'Rs. 400', label: 'Flat Fee' }, { val: '24/7', label: 'Tracking' }],
  },
  {
    tag: 'Arrange For Me — Free Service',
    svgIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-white">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M16 13H8M16 17H8M10 9H8" />
      </svg>
    ),
    headline: "Can't Find\nYour Medicine?",
    sub: 'Upload your prescription and our pharmacists will source any medicine from certified suppliers — even hard-to-find ones.',
    cta: 'Upload Prescription',
    badge: 'Free Service',
    action: 'prescription',
    bgImage: 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&w=1600&q=80',
    personImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=700&q=85',
    personLabel: 'Dr. Sara Malik',
    personRole: 'Prescription Specialist',
    tint: 'linear-gradient(135deg, rgba(80,20,100,0.92) 0%, rgba(123,45,139,0.70) 50%, rgba(26,63,212,0.30) 100%)',
    accent: '#7b2d8b',
    meshColors: ['rgba(123,45,139,0.15)', 'rgba(80,20,100,0.10)', 'rgba(168,85,247,0.08)'],
    stats: [{ val: 'Free', label: 'Service Fee' }, { val: '2 hrs', label: 'Review Time' }, { val: 'DRAP', label: 'Certified' }],
  },
  {
    tag: 'Dow Lab Partnership',
    svgIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-white">
        <path d="M4.5 16.5c-1.5 1.26-2.5 3.19-2.5 5.5h20c0-2.31-1-4.24-2.5-5.5" />
        <path d="M12 2v10M8 5h8" />
        <circle cx="12" cy="9" r="3" />
      </svg>
    ),
    headline: 'Lab Tests at\nYour Doorstep.',
    sub: 'Blood glucose, HbA1c, CBC, lipid profile and 200+ diagnostic tests. Sample collection at home, results in 24 hours.',
    cta: 'Book a Test',
    badge: 'Tests from Rs. 350',
    action: 'lab',
    bgImage: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1600&q=80',
    personImage: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=700&q=85',
    personLabel: 'Lab Specialist',
    personRole: 'Dow Lab Partner',
    tint: 'linear-gradient(135deg, rgba(5,80,55,0.92) 0%, rgba(10,124,89,0.70) 50%, rgba(26,63,212,0.30) 100%)',
    accent: '#0a7c59',
    meshColors: ['rgba(10,124,89,0.15)', 'rgba(34,197,94,0.08)', 'rgba(5,80,55,0.10)'],
    stats: [{ val: '200+', label: 'Test Types' }, { val: '24 hrs', label: 'Results' }, { val: 'Rs. 350', label: 'Starting' }],
  },
  {
    tag: 'Vitamins & Supplements',
    svgIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-white">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    headline: 'Fuel Your Body\nWith the Best.',
    sub: "Omega-3, Vitamin D, multivitamins, protein and immunity boosters — from trusted global brands at Pakistan's best prices.",
    cta: 'Explore Range',
    badge: '340+ Products',
    action: 'supplements',
    bgImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1600&q=80',
    personImage: 'https://images.unsplash.com/photo-1571772996211-2f02c9727629?auto=format&fit=crop&w=700&q=85',
    personLabel: 'Nutrition Expert',
    personRole: 'Wellness Consultant',
    tint: 'linear-gradient(135deg, rgba(18,48,168,0.92) 0%, rgba(26,63,212,0.70) 50%, rgba(123,45,139,0.40) 100%)',
    accent: '#1a3fd4',
    meshColors: ['rgba(26,63,212,0.12)', 'rgba(39,85,232,0.10)', 'rgba(123,45,139,0.06)'],
    stats: [{ val: '340+', label: 'Products' }, { val: 'Global', label: 'Brands' }, { val: 'Best', label: 'PKR Prices' }],
  },
]

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/* ── 3D Tilt Card ── */
function TiltCard({ personImage, personLabel, personRole, accent }: {
  personImage: string; personLabel: string; personRole: string; accent: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 22 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), { stiffness: 150, damping: 22 })

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  function onMouseLeave() { x.set(0); y.set(0) }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 900 }}
      initial={{ opacity: 0, x: 80, scale: 0.88 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.92 }}
      transition={{ duration: 0.65, ease: [0.32, 0.72, 0, 1] }}
      className="relative w-[260px] xl:w-[300px] shrink-0 cursor-pointer select-none"
    >
      {/* Glow */}
      <div className="absolute -inset-5 rounded-[2.5rem] blur-3xl opacity-35" style={{ background: accent }} />

      {/* Double Bezel Outer Shell */}
      <div 
        className="relative rounded-[2.2rem] p-2 bg-white/5 border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.5)] backdrop-blur-md"
        style={{ transform: 'translateZ(24px)', transformStyle: 'preserve-3d' }}
      >
        {/* Inner Core */}
        <div 
          className="relative rounded-[calc(2.2rem-0.5rem)] overflow-hidden bg-black/40 ring-1 ring-white/15"
          style={{ transform: 'translateZ(12px)' }}
        >
          <div className="relative h-[310px] xl:h-[360px]">
            <img
              src={personImage}
              alt={personLabel}
              className="w-full h-full object-cover object-top"
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
            {/* Cinematic gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            {/* Name badge */}
            <div className="absolute bottom-4 left-5 right-5">
              <p className="font-poppins font-bold text-white text-sm leading-tight tracking-tight">{personLabel}</p>
              <p className="text-white/60 font-inter text-xs mt-0.5">{personRole}</p>
            </div>
            {/* Verified badge */}
            <div className="absolute top-3 right-3 bg-white/15 backdrop-blur-xl border border-white/20 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
              <span className="text-green-400 text-xs font-bold">✓</span>
              <span className="text-white font-inter text-[10px] font-semibold tracking-wide">DRAP Licensed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating stat pill */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
        className="absolute -bottom-3 -left-5 bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.15)] px-4 py-2.5 flex items-center gap-2.5 ring-1 ring-black/5"
        style={{ transform: 'translateZ(48px)' }}
      >
        <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center text-yellow-600">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
        <div>
          <p className="font-poppins font-bold text-charcoal text-xs leading-none">4.9 / 5</p>
          <p className="text-mid-gray font-inter text-[10px] mt-0.5">2,400+ reviews</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0)
  const { user, openAuth } = useAuth()
  const toast = useToast()
  const { setQuery, setCategory } = useSearch()

  const next = useCallback(() => setCurrent(c => (c + 1) % SLIDES.length), [])
  const prev = useCallback(() => setCurrent(c => (c - 1 + SLIDES.length) % SLIDES.length), [])

  useEffect(() => {
    const t = setInterval(next, 6000)
    return () => clearInterval(t)
  }, [next])

  function openFilePicker() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/jpeg,image/png,image/webp,application/pdf'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      toast.show('Uploading prescription...', '...')
      const res = await prescriptionsApi.upload(file)
      if (res.ok) toast.show('Prescription uploaded! A pharmacist will review it within 2 hours.', 'OK')
      else toast.show(res.detail ?? 'Upload failed — please try again', 'X')
    }
    input.click()
  }

  function handleCta(action: string) {
    switch (action) {
      case 'shop':       setQuery(''); setCategory(null); scrollTo('products-section'); break
      case 'prescription':
        if (!user) { openAuth('login'); toast.show('Sign in to upload a prescription'); return }
        openFilePicker(); break
      case 'lab':        scrollTo('book-service'); break
      case 'supplements': setQuery(''); setCategory('Nutrition & Supplements'); scrollTo('products-section'); break
    }
  }

  const slide = SLIDES[current]

  return (
    <section className="py-5">
      <div className="w-[92%] max-w-[1400px] mx-auto">
        <div className="relative rounded-[28px] overflow-hidden h-[360px] md:h-[460px] xl:h-[520px]">

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
              className="absolute inset-0"
            >
              {/* ── Background image with Ken Burns ── */}
              <motion.img
                src={slide.bgImage}
                alt=""
                aria-hidden
                initial={{ scale: 1.1 }}
                animate={{ scale: 1.0 }}
                transition={{ duration: 10, ease: 'linear' }}
                className="absolute inset-0 w-full h-full object-cover object-center"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
              />

              {/* ── Cinematic overlays ── */}
              <div className="absolute inset-0" style={{ background: slide.tint }} />
              {/* Radial vignette */}
              <div className="absolute inset-0" style={{
                background: 'radial-gradient(ellipse at 30% 50%, transparent 30%, rgba(0,0,0,0.50) 100%)'
              }} />
              {/* Mesh gradient overlay for depth */}
              <MeshGradient colors={slide.meshColors} className="opacity-60" />
              {/* Film grain */}
              <div className="absolute inset-0 opacity-[0.035] pointer-events-none"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
                  backgroundSize: '128px' }} />

              {/* ── Content layout ── */}
              <div className="relative z-10 h-full flex items-center px-8 md:px-14 xl:px-20 gap-8 xl:gap-16">

                {/* Left — text */}
                <motion.div
                  initial={{ opacity: 0, x: -40, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, x: -20, filter: 'blur(4px)' }}
                  transition={{ duration: 0.6, delay: 0.1, ease: [0.32, 0.72, 0, 1] }}
                  className="flex-1 min-w-0"
                >
                  <span className="inline-flex items-center gap-2 bg-white/12 backdrop-blur-xl border border-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full mb-5 font-inter tracking-wide">
                    <span>{slide.svgIcon}</span>
                    {slide.tag}
                  </span>
                  <h2 className="font-poppins font-black text-white text-[1.85rem] md:text-[2.6rem] xl:text-[3rem] leading-[1.08] whitespace-pre-line mb-5 tracking-[-0.02em]"
                    style={{ textShadow: '0 4px 30px rgba(0,0,0,0.3)' }}>
                    {slide.headline}
                  </h2>
                  <p className="text-white/80 font-inter text-sm md:text-[15px] max-w-lg leading-relaxed mb-7">
                    {slide.sub}
                  </p>

                  <div className="flex items-center gap-3 mb-8">
                    <button
                      onClick={() => handleCta(slide.action)}
                      className="group inline-flex items-center gap-4 text-white font-poppins font-bold text-sm pl-7 pr-3 py-2 rounded-full transition-all duration-500 hover:-translate-y-0.5 active:scale-[0.97]"
                      style={{
                        background: slide.accent,
                        boxShadow: `0 8px 32px ${slide.accent}44`,
                        transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)',
                      }}
                    >
                      <span>{slide.cta}</span>
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center transition-all duration-500 group-hover:bg-white group-hover:text-black">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                          className="w-4 h-4 text-white transition-colors duration-500 group-hover:text-black group-hover:translate-x-0.5">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </div>
                    </button>
                    <span className="bg-white/12 backdrop-blur-xl border border-white/20 text-white/90 text-xs font-inter font-semibold px-4 py-3 rounded-2xl">
                      {slide.badge}
                    </span>
                  </div>

                  {/* Mini stats */}
                  <div className="hidden md:flex items-center gap-8">
                    {slide.stats.map((s, i) => (
                      <div key={s.label} className="flex items-center gap-3">
                        <div>
                          <p className="font-poppins font-extrabold text-white text-xl leading-none tracking-tight">{s.val}</p>
                          <p className="text-white/50 font-inter text-[11px] mt-1">{s.label}</p>
                        </div>
                        {i < slide.stats.length - 1 && (
                          <div className="w-px h-8 bg-white/15 ml-4" />
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Right — 3D person card */}
                <div className="hidden lg:flex items-center justify-center shrink-0">
                  <AnimatePresence mode="wait">
                    <TiltCard
                      key={current}
                      personImage={slide.personImage}
                      personLabel={slide.personLabel}
                      personRole={slide.personRole}
                      accent={slide.accent}
                    />
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* ── Nav arrows ── */}
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white transition-all duration-300 border border-white/15 active:scale-95"
            style={{ transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white transition-all duration-300 border border-white/15 active:scale-95"
            style={{ transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>

          {/* ── Progress bar ── */}
          <div className="absolute bottom-5 left-8 right-8 z-20 flex items-center gap-3">
            <div className="flex-1 flex gap-2">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="relative flex-1 h-1 rounded-full overflow-hidden bg-white/20"
                >
                  {i === current && (
                    <motion.div
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{ background: SLIDES[i].accent }}
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 6, ease: 'linear' }}
                    />
                  )}
                  {i < current && (
                    <div className="absolute inset-0 rounded-full bg-white/50" />
                  )}
                </button>
              ))}
            </div>
            <span className="text-white/40 font-inter text-xs tabular-nums font-medium">
              {String(current + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
