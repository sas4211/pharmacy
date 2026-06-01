'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const SECTIONS = [
  {
    title: 'Return Eligibility',
    content: 'Products must be returned within 7 days of delivery. Items must be unopened, in original packaging, with all seals intact. Prescription medicines, baby formula, and temperature-sensitive products are not eligible for return.',
  },
  {
    title: 'How to Initiate a Return',
    content: 'Contact our team via WhatsApp at +92 331 111 3292 or email info@hussainhealthcare.biz with your order number and reason for return. Our team will respond within 24 hours with collection arrangements.',
  },
  {
    title: 'Refund Processing',
    content: 'Approved refunds are processed within 3–5 business days to your original payment method. Cash-on-delivery orders receive refunds via EasyPaisa or bank transfer.',
  },
  {
    title: 'Non-Returnable Items',
    content: 'Prescription medicines, baby formula, temperature-sensitive products (insulin, certain vaccines), opened personal care items, and hazardous materials cannot be returned for safety and hygiene reasons.',
  },
  {
    title: 'Damaged or Incorrect Items',
    content: 'If you received a damaged or wrong item, contact us within 48 hours of delivery with photos. We will arrange a free replacement or full refund with no need to return the item.',
  },
]

const ELIGIBLE   = ['Unopened OTC medicines', 'Medical devices (unopened)', 'Supplements (sealed)', 'Personal care (sealed)', 'Baby accessories', 'Health books']
const INELIGIBLE = ['Prescription medicines', 'Baby formula', 'Opened/used items', 'Temperature-sensitive products', 'Customised orders', 'Hazardous materials']

export default function ReturnsPage() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-off-white">
      {/* Hero */}
      <div
        className="py-16 px-4 text-center"
        style={{ background: 'linear-gradient(135deg,#1230a8 0%,#1a3fd4 50%,#7b2d8b 100%)' }}
      >
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-5xl mb-4">↩️</div>
          <h1 className="font-poppins font-extrabold text-white text-3xl md:text-4xl">Returns &amp; Refunds</h1>
          <p className="text-white/75 font-inter text-sm mt-2 max-w-md mx-auto">
            7-day return window on eligible products. We make it simple and hassle-free.
          </p>
          <div className="flex gap-2 items-center justify-center mt-4 text-white/60 text-sm font-inter">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <span>/</span>
            <span className="text-white">Returns &amp; Refunds</span>
          </div>
        </motion.div>
      </div>

      <div className="w-[92%] max-w-[900px] mx-auto py-12">
        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { emoji: '📅', label: '7-Day Window', sub: 'Return period' },
            { emoji: '💸', label: '3–5 Days', sub: 'Refund processing' },
            { emoji: '📞', label: '24hr Response', sub: 'Support team' },
          ].map(s => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="bg-white rounded-[18px] p-5 text-center shadow-card"
            >
              <div className="text-3xl mb-1">{s.emoji}</div>
              <div className="font-poppins font-bold text-base text-brand-blue">{s.label}</div>
              <div className="text-xs text-mid-gray font-inter mt-0.5">{s.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* Accordion */}
        <div className="space-y-3 mb-10">
          {SECTIONS.map((sec, i) => (
            <motion.div
              key={sec.title}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
              className="bg-white rounded-[18px] shadow-card overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left"
              >
                <span className="font-poppins font-bold text-base text-charcoal">{sec.title}</span>
                <motion.span animate={{ rotate: open === i ? 180 : 0 }} className="text-mid-gray text-xl">▾</motion.span>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-sm text-mid-gray font-inter leading-relaxed">{sec.content}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Eligibility grids */}
        <div className="grid md:grid-cols-2 gap-5 mb-10">
          <div className="bg-green-50 rounded-[18px] p-6">
            <h3 className="font-poppins font-bold text-base text-green-700 mb-4">✅ Eligible for Return</h3>
            <ul className="space-y-2">
              {ELIGIBLE.map(i => (
                <li key={i} className="flex items-center gap-2 text-sm text-green-800 font-inter">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />{i}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-red-50 rounded-[18px] p-6">
            <h3 className="font-poppins font-bold text-base text-red-700 mb-4">❌ Not Eligible</h3>
            <ul className="space-y-2">
              {INELIGIBLE.map(i => (
                <li key={i} className="flex items-center gap-2 text-sm text-red-800 font-inter">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />{i}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div
          className="rounded-[18px] p-8 text-center"
          style={{ background: 'linear-gradient(135deg,#1230a8,#7b2d8b)' }}
        >
          <h3 className="font-poppins font-bold text-white text-xl mb-2">Need Help with a Return?</h3>
          <p className="text-white/75 font-inter text-sm mb-5">Our team is available Mon–Sun, 9am–9pm</p>
          <a
            href="https://wa.me/923311113292?text=Hi%2C%20I%20want%20to%20initiate%20a%20return"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25d366] text-white font-poppins font-bold text-sm px-6 py-3 rounded-xl hover:bg-green-600 transition"
          >
            💬 Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
