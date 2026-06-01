'use client'
import { motion } from 'framer-motion'
import { useSearch } from '@/store'

const CATS = [
  {
    name: 'Medicine',
    count: '1,500+ Products',
    desc: 'OTC & DRAP Approved Rx',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80',
    className: 'lg:col-span-2 lg:row-span-1',
    svgIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="m14.5 9.5-5 5" />
        <path d="M8.5 8.5c-.7-.7-1.8-.7-2.5 0s-.7 1.8 0 2.5l5.5 5.5c.7.7 1.8.7 2.5 0s.7-1.8 0-2.5z" />
      </svg>
    )
  },
  {
    name: 'Nutrition & Supplements',
    count: '340+ Products',
    desc: 'Pure Vitamins & Minerals',
    image: 'https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=500&auto=format&fit=crop&q=80',
    className: 'lg:col-span-2 lg:row-span-1',
    svgIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    )
  },
  {
    name: 'Skin Care',
    count: '180+ Products',
    desc: 'Dermatological Serums',
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=500&auto=format&fit=crop&q=80',
    className: 'lg:col-span-1',
    svgIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-11-7-11S5 10.7 5 15a7 7 0 0 0 7 7z" />
      </svg>
    )
  },
  {
    name: 'Baby Care',
    count: '120+ Products',
    desc: 'Organic Care & Formulas',
    image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=500&auto=format&fit=crop&q=80',
    className: 'lg:col-span-1',
    svgIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M10 22h4M12 18v4M9 10a3 3 0 0 1 6 0M12 2v4M12 6a8 8 0 0 0-8 8v4h16v-4a8 8 0 0 0-8-8z" />
      </svg>
    )
  },
  {
    name: 'Medical Devices',
    count: '80+ Products',
    desc: 'Precision BP & Monitors',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=500&auto=format&fit=crop&q=80',
    className: 'lg:col-span-1',
    svgIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    )
  },
  {
    name: 'Mother Care',
    count: '95+ Products',
    desc: 'Prenatal & Nursing Care',
    image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=500&auto=format&fit=crop&q=80',
    className: 'lg:col-span-1',
    svgIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
        <path d="M12 7v10M8 11h8" />
      </svg>
    )
  },
  {
    name: 'Sexual Wellness',
    count: '60+ Products',
    desc: 'Discreet Certified Care',
    image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=500&auto=format&fit=crop&q=80',
    className: 'lg:col-span-1',
    svgIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="M12 8v8M8 12h8" />
      </svg>
    )
  },
  {
    name: 'General Health',
    count: '200+ Products',
    desc: 'Essential First Aid Care',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&auto=format&fit=crop&q=80',
    className: 'lg:col-span-1',
    svgIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    )
  },
]

export default function Categories() {
  const { setCategory, activeCategory } = useSearch()

  function handleClick(name: string) {
    setCategory(activeCategory === name ? null : name)
    const el = document.getElementById('products-section')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="py-32 bg-[#FAF9F6] relative overflow-hidden">
      {/* Subtle organic background mesh */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-100/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-100/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-[92%] max-w-[1400px] mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="rounded-full px-4 py-1.5 text-[10px] uppercase tracking-[0.25em] font-extrabold bg-blue-600/10 text-blue-800 font-poppins mb-4 inline-block shadow-sm">
              Elite Selection
            </span>
            <h2 className="font-poppins font-black text-4xl md:text-5xl tracking-tighter text-charcoal mb-4 leading-none">
              Shop by Category
            </h2>
            <p className="text-mid-gray font-inter text-base max-w-xl leading-relaxed">
              Experience clinical excellence across 2,500+ DRAP-certified products, curated for precise medical and wellness needs.
            </p>
          </div>
          <a href="#" className="group inline-flex items-center gap-3 text-brand-blue font-bold text-xs uppercase tracking-widest font-poppins hover:text-blue-700 transition-all duration-500">
            View All Sectors 
            <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[10px] transition-all duration-500 group-hover:translate-x-1.5 group-hover:bg-blue-600 group-hover:text-white">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </a>
        </div>

        {/* Cinematic Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          {CATS.map((cat, i) => {
            const isActive = activeCategory === cat.name
            return (
              <motion.button
                key={cat.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.08, ease: [0.32, 0.72, 0, 1] }}
                whileHover={{ y: -8, transition: { duration: 0.4, ease: [0.32, 0.72, 0, 1] } }}
                onClick={() => handleClick(cat.name)}
                className={`group flex flex-col justify-end text-left h-[260px] rounded-[32px] overflow-hidden p-8 relative transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] select-none
                  ${cat.className || ''} 
                  ${isActive ? 'ring-2 ring-blue-600 shadow-[0_32px_64px_rgba(18,48,168,0.25)] scale-[1.02]' : 'ring-1 ring-black/[0.05] hover:shadow-[0_40px_80px_rgba(0,0,0,0.12)] bg-white'}`}
              >
                {/* Background Cinematic Image with Ken Burns Zoom */}
                <div className="absolute inset-0 z-0 overflow-hidden rounded-[32px]">
                  <motion.img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="w-full h-full object-cover grayscale opacity-[0.85] brightness-[0.45] transition-all duration-[2000ms] ease-out group-hover:scale-110 group-hover:grayscale-0 group-hover:opacity-100 group-hover:brightness-[0.35]"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  {/* High-end linear desaturated vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-10" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700 z-10" />
                  
                  {isActive && (
                    <div className="absolute inset-0 bg-blue-900/30 z-10 mix-blend-overlay" />
                  )}
                </div>

                {/* Double Bezel Floating Icon Frame (Hardware Aesthetic) */}
                <div className="absolute top-7 left-7 z-20">
                  <div className="rounded-[20px] p-1 bg-white/10 border border-white/20 shadow-xl backdrop-blur-xl">
                    <div className={`w-11 h-11 rounded-[16px] flex items-center justify-center transition-all duration-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]
                      ${isActive ? 'bg-blue-600 text-white shadow-[0_8px_20px_rgba(18,48,168,0.4)]' : 'bg-black/50 text-white group-hover:bg-blue-600 group-hover:text-white'}`}>
                      {cat.svgIcon}
                    </div>
                  </div>
                </div>

                {/* Floating details badge (top right) */}
                <div className="absolute top-7 right-7 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-[-8px] group-hover:translate-y-0">
                  <span className="rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white font-poppins text-[10px] font-bold px-3.5 py-1.5 tracking-widest uppercase shadow-lg">
                    {cat.count}
                  </span>
                </div>

                {/* Content Overlay */}
                <div className="relative z-20 flex flex-col gap-2 text-white">
                  <span className="text-[11px] text-white/50 font-extrabold font-poppins tracking-[0.15em] leading-none uppercase">
                    {cat.desc}
                  </span>
                  <h3 className="font-poppins font-black text-xl md:text-2xl leading-none tracking-tight text-white group-hover:text-blue-100 transition-colors duration-500">
                    {cat.name}
                  </h3>
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
