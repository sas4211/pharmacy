'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import SpotlightCard from '@/components/SpotlightCard'
import BookingModal from '@/components/BookingModal'

const SERVICES = [
  {
    tag: 'Prescription Sourcing',
    title: 'Arrange Rare Medicines',
    desc: "Can't find your prescription? Upload it here and our specialized clinical pharmacists will source it from licensed importers.",
    price: 'Complimentary Sourcing',
    badge: 'Highly Requested',
    badgeColor: 'bg-red-500',
    type: 'prescription_delivery',
    gradient: 'from-emerald-950/80 to-blue-950/90',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&auto=format&fit=crop&q=80',
    svgIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    tag: 'Online Consultation',
    title: 'Qualified Doctor Session',
    desc: 'Consult a verified clinical GP or senior pharmacist within 10 minutes via encrypted video or chat. Same-day e-prescriptions.',
    price: 'From Rs. 500 / Session',
    badge: 'Same-day Session',
    badgeColor: 'bg-blue-600',
    type: 'consultation',
    gradient: 'from-blue-950/95 to-slate-900/90',
    image: 'https://images.unsplash.com/photo-1584515901187-601004502269?w=600&auto=format&fit=crop&q=80',
    svgIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M23 7a2 2 0 0 0-2-2H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V7Z" />
        <path d="M12 14a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        <path d="M6 16v-1a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" />
      </svg>
    ),
  },
  {
    tag: 'Dow Lab Partnership',
    title: 'Clinical Diagnostic Tests',
    desc: 'Complete lipid profile, HbA1c, thyroid panel, or CBC with professional, certified home sample collection. Verified results in 24 hours.',
    price: 'Tests from Rs. 350',
    badge: 'Home Collection',
    badgeColor: 'bg-purple-600',
    type: 'lab_test',
    gradient: 'from-purple-950/90 to-blue-950/90',
    image: 'https://images.unsplash.com/photo-1579154261294-a101a24d0e98?w=600&auto=format&fit=crop&q=80',
    svgIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M4.5 16.5c-1.5 1.26-2.5 3.19-2.5 5.5h20c0-2.31-1-4.24-2.5-5.5" />
        <path d="M12 2v10M8 5h8" />
        <path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      </svg>
    ),
  },
  {
    tag: 'Vaccinations',
    title: 'EPI & Travel Immunizations',
    desc: 'Childhood booster schedules, influenza vaccines, Hepatitis A/B, and typhoid immunizations administered by licensed vaccinators.',
    price: 'From Rs. 800 / Dose',
    badge: null,
    badgeColor: '',
    type: 'vaccination',
    gradient: 'from-teal-950/90 to-blue-950/90',
    image: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=600&auto=format&fit=crop&q=80',
    svgIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="m18 2 4 4M13 7l4 4M9 11l4 4M5 15l4 4M2 22l3-3" />
        <path d="M11 5 5 11" />
      </svg>
    ),
  },
  {
    tag: 'Free Screening',
    title: 'Blood Pressure Screening',
    desc: 'Walk in at our Karachi clinic for a completely free, automated BP and heart-rate monitoring screening by our senior pharmacist.',
    price: '100% Free Service',
    badge: 'Walk-in',
    badgeColor: 'bg-emerald-600',
    type: 'bp_check',
    gradient: 'from-rose-950/90 to-purple-950/90',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&auto=format&fit=crop&q=80',
    svgIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    ),
  },
  {
    tag: 'Clinical Consultation',
    title: 'Medication Review',
    desc: 'Book a comprehensive, one-on-one medical chart review session with our chief pharmacist to check for contraindications and interactions.',
    price: 'From Rs. 300 / Review',
    badge: 'Clinical',
    badgeColor: 'bg-indigo-600',
    type: 'consultation',
    gradient: 'from-blue-950/90 to-purple-950/90',
    image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=600&auto=format&fit=crop&q=80',
    svgIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
]

export default function PharmacyServices() {
  const [activeService, setActiveService] = useState<typeof SERVICES[0] | null>(null)

  function bookService(s: typeof SERVICES[0]) {
    setActiveService(s)
  }

  return (
    <>
    <section className="py-32 bg-white relative overflow-hidden">
      {/* Decorative gradient glowing mesh */}
      <div className="absolute bottom-[-100px] left-[-100px] w-[600px] h-[600px] bg-blue-50/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-[92%] max-w-[1400px] mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="rounded-full px-4 py-1.5 text-[10px] uppercase tracking-[0.25em] font-extrabold bg-blue-600/10 text-blue-800 font-poppins mb-4 inline-block shadow-sm">
              Clinical Authority
            </span>
            <h2 className="font-poppins font-black text-4xl md:text-5xl tracking-tighter text-charcoal mb-4 leading-none">
              Professional Care Services
            </h2>
            <p className="text-mid-gray font-inter text-base max-w-xl leading-relaxed">
              Hussain Healthcare redefines the pharmacy experience through licensed GP consultations and specialty medical sourcing.
            </p>
          </div>
          <Link href="/services" className="group inline-flex items-center gap-3 text-brand-blue font-bold text-xs uppercase tracking-widest font-poppins hover:text-blue-700 transition-all duration-500">
            Explore All Services 
            <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[10px] transition-all duration-500 group-hover:translate-x-1.5 group-hover:bg-blue-600 group-hover:text-white">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
              whileHover={{ y: -10, transition: { duration: 0.4, ease: [0.32, 0.72, 0, 1] } }}
              className={i === 0 ? "md:col-span-2 lg:col-span-2" : ""}
            >
              {/* Double Bezel Outer Shell Enclosure */}
              <div 
                className="group relative rounded-[2.5rem] p-2 bg-black/[0.03] border border-black/[0.06] hover:border-blue-600/20 hover:shadow-[0_40px_80px_rgba(18,48,168,0.12)] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] cursor-pointer h-full"
                onClick={() => bookService(s)}
              >
                {/* Inner Core Container */}
                <div className="relative rounded-[calc(2.5rem-0.5rem)] overflow-hidden bg-white ring-1 ring-black/[0.02] p-8 flex flex-col md:flex-row lg:flex-col gap-8 h-full">
                  
                  {/* Card Header & Background Cinematic Visual */}
                  <div className={`relative h-[220px] rounded-[24px] overflow-hidden shrink-0 ${i === 0 ? "md:w-1/2 lg:w-full" : "w-full"}`}>
                    <motion.img 
                      src={s.image} 
                      alt={s.title} 
                      className="w-full h-full object-cover grayscale opacity-[0.9] brightness-[0.45] transition-all duration-[2000ms] group-hover:scale-110 group-hover:grayscale-0 group-hover:opacity-100 group-hover:brightness-[0.35]"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    {/* Linear glass shade gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                    
                    {s.badge && (
                      <span className={`absolute top-5 right-5 ${s.badgeColor} text-white text-[10px] font-extrabold uppercase tracking-[0.2em] px-4 py-2 rounded-2xl font-poppins shadow-xl backdrop-blur-md`}>
                        {s.badge}
                      </span>
                    )}

                    {/* Floating Double Bezel Icon inside core */}
                    <div className="absolute bottom-5 left-5">
                      <div className="rounded-[18px] p-1 bg-white/10 border border-white/20 backdrop-blur-xl">
                        <div className="w-11 h-11 rounded-[14px] bg-blue-600 text-white flex items-center justify-center shadow-2xl shadow-blue-600/40">
                          {s.svgIcon}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 flex flex-col gap-3">
                    <span className="text-[11px] font-black text-blue-600 font-poppins uppercase tracking-[0.25em] leading-none">
                      {s.tag}
                    </span>
                    <h3 className="font-poppins font-black text-2xl text-charcoal leading-tight tracking-tighter">
                      {s.title}
                    </h3>
                    <p className="text-sm text-mid-gray font-inter leading-relaxed max-w-md">
                      {s.desc}
                    </p>
                    
                    {/* Footer - Symmetrical with Nested Circular Arrow Button */}
                    <div className="flex items-center justify-between pt-6 border-t border-black/[0.05] mt-auto">
                      <span className="text-xs font-black text-charcoal font-poppins tracking-wider uppercase">
                        {s.price}
                      </span>
                      <div className="flex items-center gap-3 group-hover:text-blue-600 transition-colors duration-500">
                        <span className="text-sm font-bold font-poppins text-charcoal group-hover:text-blue-600">Secure Booking</span>
                        <div className="w-9 h-9 rounded-full bg-black/[0.04] border border-black/[0.06] group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white flex items-center justify-center transition-all duration-500">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-[2px] group-hover:translate-y-[-2px]">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <BookingModal service={activeService} onClose={() => setActiveService(null)} />
    </>
  )
}
