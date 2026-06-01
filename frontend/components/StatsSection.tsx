'use client'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const STATS = [
  { value: '25000', suffix: '+', label: 'Patients Served',    emoji: '👥', desc: 'Trusted families across Karachi' },
  { value: '8000',  suffix: '+', label: 'Medicines in Stock', emoji: '💊', desc: 'DRAP-verified genuine products' },
  { value: '98',    suffix: '%', label: 'Order Accuracy',     emoji: '✅', desc: 'Pharmacist-checked every order' },
  { value: '200',   suffix: '+', label: 'Diagnostic Tests',   emoji: '🧪', desc: 'Dow Lab certified partnership' },
  { value: '45',    suffix: 'min', label: 'Express Delivery', emoji: '⚡', desc: 'Fastest pharmacy in Karachi' },
]

function OdometerNumber({ value, suffix }: { value: string; suffix: string }) {
  const digits = value.split('')
  const containerRef = useRef<HTMLDivElement>(null)
  const stripsRef = useRef<HTMLDivElement[]>([])
  const [triggered, setTriggered] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTriggered(true); obs.disconnect() } },
      { threshold: 0.5 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!triggered) return
    stripsRef.current.forEach((strip, i) => {
      if (!strip) return
      const target = parseInt(digits[i])
      strip.style.transition = `transform 1.6s cubic-bezier(0.16,1,0.3,1) ${i * 0.12}s`
      strip.style.transform = `translateY(-${target * 44}px)`
    })
  }, [triggered]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={containerRef} className="flex items-baseline justify-center gap-0.5">
      <div className="flex items-start">
        {digits.map((d, i) => (
          <div key={i} className="overflow-hidden" style={{ height: 44 }}>
            <div
              ref={el => { if (el) stripsRef.current[i] = el }}
              className="flex flex-col"
            >
              {Array.from({ length: 10 }, (_, n) => (
                <span key={n} className="block font-poppins font-black text-3xl md:text-4xl leading-none" style={{ height: 44, lineHeight: '44px', background: 'linear-gradient(135deg,#1230a8,#1a3fd4,#7b2d8b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {n}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <span className="font-poppins font-black text-2xl md:text-3xl ml-0.5" style={{ background: 'linear-gradient(135deg,#1230a8,#7b2d8b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{suffix}</span>
    </div>
  )
}

export default function StatsSection() {
  return (
    <section className="py-16 md:py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f0f4ff] via-white to-[#f5f0ff]" />
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(26,63,212,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(26,63,212,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative w-[92%] max-w-[1400px] mx-auto">
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full font-inter tracking-wide mb-4 border"
            style={{ background: 'rgba(26,63,212,0.05)', borderColor: 'rgba(26,63,212,0.12)', color: '#1a3fd4' }}
          >
            🏆 Trusted by Karachi
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-poppins font-black text-2xl md:text-3xl text-charcoal tracking-tight"
          >
            Karachi Trusts Hussain Healthcare
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-mid-gray font-inter text-sm mt-2 max-w-md mx-auto"
          >
            Numbers that speak for themselves — verified by real patients
          </motion.p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 md:gap-5">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, ease: [0.32, 0.72, 0, 1] }}
              whileHover={{ y: -6, transition: { duration: 0.35, ease: [0.32, 0.72, 0, 1] } }}
              className="bg-white rounded-[22px] p-6 text-center shadow-[0_4px_32px_rgba(26,63,212,.08)] hover:shadow-[0_12px_48px_rgba(26,63,212,.15)] transition-shadow duration-500 flex flex-col items-center gap-3 ring-1 ring-black/[0.03] w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.875rem)] lg:w-[calc(20%-1rem)]"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center text-2xl">
                {s.emoji}
              </div>
              <OdometerNumber value={s.value} suffix={s.suffix} />
              <div>
                <p className="text-xs font-poppins font-bold text-charcoal">{s.label}</p>
                <p className="text-[10px] text-mid-gray font-inter mt-0.5 leading-snug">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
