'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useToast } from '@/store'
import BookingModal from '@/components/BookingModal'

const CARDS = [
  {
    gradient: 'linear-gradient(135deg,#1230a8,#2755e8)',
    emoji: '🩺',
    tag: 'Online Consultation',
    title: 'Speak to a Doctor\nor Pharmacist — Now',
    desc: 'Get a diagnosis, e-prescription, or referral within minutes. Our GPs and pharmacists are available 7 days a week via video or chat.',
    price: 'From Rs. 500 per session',
    stats: [{ label: 'Response Time', val: '< 10 min' }, { label: 'Satisfaction', val: '4.9 ★' }],
    type: 'consultation',
  },
  {
    gradient: 'linear-gradient(135deg,#7b2d8b,#1a3fd4)',
    emoji: '🧪',
    tag: 'Dow Lab Partnership',
    title: 'Lab Tests with\nHome Collection',
    desc: 'Book from 200+ diagnostic tests — blood glucose, HbA1c, CBC, lipid profiles, thyroid and more. A certified collector visits your home.',
    price: 'Tests from Rs. 350',
    stats: [{ label: 'Tests Available', val: '200+' }, { label: 'Results In', val: '24 hrs' }],
    type: 'lab_test',
  },
  {
    gradient: 'linear-gradient(135deg,#0a7c59,#1a3fd4)',
    emoji: '📋',
    tag: 'Arrange For Me',
    title: 'We\'ll Source Any\nMedicine For You',
    desc: 'Upload a prescription for rare, import, or out-of-stock medicines. Our team contacts certified suppliers and delivers directly to your door.',
    price: 'Free service — pay only for medicines',
    stats: [{ label: 'Success Rate', val: '98%' }, { label: 'Avg. Time', val: '4 hrs' }],
    type: 'prescription_delivery',
  },
]

export default function BookService() {
  const toast = useToast()
  const [activeService, setActiveService] = useState<typeof CARDS[0] | null>(null)

  function book(card: typeof CARDS[0]) {
    setActiveService(card)
  }

  useEffect(() => {
    const handleOpenBooking = (e: Event) => {
      const customEvent = e as CustomEvent<string>
      const type = customEvent.detail
      const card = CARDS.find(c => c.type === type)
      if (card) {
        setActiveService(card)
      }
    }
    window.addEventListener('open-booking-modal', handleOpenBooking)
    return () => window.removeEventListener('open-booking-modal', handleOpenBooking)
  }, [])

  return (
    <>
    <section id="book-service" className="py-14 bg-off-white">
      <div className="w-[92%] max-w-[1280px] mx-auto">
        <div className="mb-8">
          <h2 className="font-poppins font-black text-2xl tracking-tight gradient-text-brand mb-1">Book a Health Service</h2>
          <p className="text-mid-gray font-inter text-sm">Professional healthcare — online and in-clinic — available 7 days a week</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {CARDS.map((card, i) => (
            <motion.div
              key={card.tag}
              initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ y: -6, boxShadow: '0 24px 60px rgba(26,63,212,.25)', transition: { duration: 0.4, ease: [0.32, 0.72, 0, 1] } }}
              className="relative rounded-[22px] p-7 overflow-hidden flex flex-col gap-4 cursor-pointer ring-1 ring-white/10"
              style={{ background: card.gradient }}
              onClick={() => book(card)}
            >
              {/* Blobs */}
              <div className="absolute w-56 h-56 rounded-full bg-white/10 top-[-80px] right-[-50px]" />
              <div className="absolute w-28 h-28 rounded-full bg-white/8 bottom-[-30px] right-[100px]" />

              <div className="relative z-10">
                <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full font-inter mb-3 backdrop-blur-sm">
                  {card.tag}
                </span>
                <div className="text-5xl mb-3">{card.emoji}</div>
                <h3 className="font-poppins font-black text-white text-xl whitespace-pre-line leading-tight mb-2">
                  {card.title}
                </h3>
                <p className="text-white/80 font-inter text-sm leading-relaxed">{card.desc}</p>

                {/* Stats row */}
                <div className="flex gap-4 mt-4">
                  {card.stats.map(s => (
                    <div key={s.label} className="bg-white/15 rounded-xl px-3 py-2 backdrop-blur-sm">
                      <div className="font-poppins font-bold text-white text-sm">{s.val}</div>
                      <div className="text-white/60 text-[10px] font-inter">{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="text-white/60 text-xs font-inter mt-3 mb-4">{card.price}</div>

                <button className="inline-flex items-center gap-2 bg-[#e63946] text-white font-poppins font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-[#c1121f] transition hover:-translate-y-0.5 shadow-[0_4px_14px_rgba(230,57,70,.4)]">
                  Book Now →
                </button>
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
