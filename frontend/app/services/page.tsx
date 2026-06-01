'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useAuth, useToast } from '@/store'
import { servicesApi } from '@/lib/api'

const SERVICES = [
  {
    emoji: '📋',
    title: 'Arrange For Me',
    tag: 'Prescription',
    desc: "Can't find your medicine? Upload your prescription and our licensed pharmacists will source it from certified suppliers — even rare, import, or discontinued medicines.",
    longDesc: "Whether it's a rare oncology drug, a discontinued brand, or an import-only product, our sourcing team has a 98% success rate. We contact verified distributors and manufacturers directly, keep you updated by WhatsApp, and deliver to your door within 4 hours on average. Completely free — you only pay for the medicine.",
    price: 'Free service — pay only for medicines',
    badge: 'Most Popular',
    badgeColor: 'bg-brand-red',
    type: 'prescription_delivery',
    gradient: 'from-teal-500 to-blue-600',
    stats: [{ label: 'Success Rate', val: '98%' }, { label: 'Avg. Time', val: '4 hrs' }, { label: 'Sourced', val: '10,000+' }],
    steps: ['Upload your prescription via WhatsApp or our website', 'Our pharmacist verifies and contacts certified suppliers', 'We confirm availability and price with you before ordering', 'Medicine delivered to your door — same day if in Karachi'],
  },
  {
    emoji: '🩺',
    title: 'Online Doctor Consultation',
    tag: 'Telehealth',
    desc: 'Speak to a qualified GP or pharmacist via video or chat. Get diagnoses, e-prescriptions, and referrals from home — same-day appointments available.',
    longDesc: 'Our panel includes PMDC-registered general practitioners and BPharm/PharmD-qualified clinical pharmacists. Consultations cover acute illness, chronic disease management, medication reviews, mental health check-ins, and second opinions. Every consultation ends with a written summary and e-prescription if required.',
    price: 'From Rs. 500 / session',
    badge: null,
    badgeColor: '',
    type: 'consultation',
    gradient: 'from-blue-600 to-violet-600',
    stats: [{ label: 'Response Time', val: '< 10 min' }, { label: 'Satisfaction', val: '4.9 ★' }, { label: 'Consultations', val: '25,000+' }],
    steps: ['Book online or walk in — same-day slots available', 'Video or chat session with a GP or pharmacist (15–30 min)', 'Receive written summary + e-prescription on WhatsApp', 'Follow-up included within 48 hours at no extra charge'],
  },
  {
    emoji: '🩸',
    title: 'Dow Lab Diagnostic Tests',
    tag: 'Lab Testing',
    desc: 'Book from 200+ blood tests including HbA1c, CBC, lipid profile, thyroid, and liver function. Home sample collection available — results within 24 hours.',
    longDesc: 'Hussain Healthcare is an authorized collection partner of Dow Diagnostic Laboratory — one of Pakistan\'s largest and most accredited lab networks. All samples are handled by trained phlebotomists and processed in DRAP-approved facilities. Results are delivered digitally and, on request, interpreted by our pharmacist.',
    price: 'Tests from Rs. 350',
    badge: 'Home Collection',
    badgeColor: 'bg-green-600',
    type: 'lab_test',
    gradient: 'from-rose-500 to-orange-500',
    stats: [{ label: 'Tests Available', val: '200+' }, { label: 'Results In', val: '24 hrs' }, { label: 'Certified', val: 'DRAP ✓' }],
    steps: ['Browse tests and book online or via WhatsApp', 'Certified phlebotomist visits your home at your chosen time', 'Sample sent to Dow Diagnostic Lab — fully accredited', 'Results on WhatsApp within 24 hours + free pharmacist review'],
  },
  {
    emoji: '💉',
    title: 'Vaccination Services',
    tag: 'Vaccinations',
    desc: 'Flu, Hepatitis A & B, Typhoid, Rabies, MMR, Varicella and travel vaccines — walk-in or by appointment. Childhood EPI boosters also available.',
    longDesc: 'All vaccines at Hussain Healthcare are stored in a validated cold chain, administered by trained healthcare professionals, and sourced from DRAP-authorised importers. We maintain a vaccination record card for each patient. Home vaccination visits are available for elderly or immobile patients.',
    price: 'From Rs. 800 / vaccine',
    badge: null,
    badgeColor: '',
    type: 'vaccination',
    gradient: 'from-green-600 to-teal-600',
    stats: [{ label: 'Vaccine Types', val: '20+' }, { label: 'Cold Chain', val: '2–8°C' }, { label: 'Walk-in', val: 'Available' }],
    steps: ['Walk in or book an appointment — no GP referral needed', 'Pharmacist screens for contraindications before administration', 'Vaccine administered by trained healthcare professional', 'Vaccination certificate issued immediately after'],
  },
  {
    emoji: '❤️',
    title: 'Free Blood Pressure Check',
    tag: 'Screening',
    desc: 'Walk in any time for a free, clinically accurate blood pressure and pulse screening. No appointment needed — know your numbers before they become a crisis.',
    longDesc: 'Hypertension affects 1 in 4 Pakistani adults — most of whom are unaware. Our free BP check uses a validated automatic digital monitor and takes under 3 minutes. If your reading is elevated, our pharmacist will provide immediate lifestyle advice and refer you to a GP if needed. We maintain a log to track your readings over time.',
    price: 'Completely free — no appointment needed',
    badge: 'Free',
    badgeColor: 'bg-green-600',
    type: 'bp_check',
    gradient: 'from-red-500 to-pink-600',
    stats: [{ label: 'Cost', val: 'Free' }, { label: 'Time Taken', val: '3 min' }, { label: 'Walk-in', val: 'Always' }],
    steps: ['Walk into any Hussain Healthcare branch — no booking needed', '3-minute validated BP and pulse reading', 'Pharmacist explains your numbers and flags any concerns', 'Readings logged for future comparison — bring your card next time'],
  },
  {
    emoji: '🌙',
    title: 'Medication Review',
    tag: 'Consultation',
    desc: 'A 20-minute one-on-one session with our senior pharmacist to review all your medicines, check for harmful interactions, and simplify your treatment plan.',
    longDesc: 'Polypharmacy — taking multiple medicines — is common among Pakistani patients managing chronic conditions. Our clinical pharmacists identify drug interactions, duplicate therapies, inappropriate doses, and medicines that may no longer be needed. We work with your doctor to produce an optimised medicine plan that is safer and simpler. Particularly valuable for patients over 60 or those taking 5+ medicines.',
    price: 'From Rs. 300',
    badge: null,
    badgeColor: '',
    type: 'consultation',
    gradient: 'from-indigo-600 to-purple-700',
    stats: [{ label: 'Session', val: '20 min' }, { label: 'Interactions', val: 'Checked' }, { label: 'Recommended', val: '60+ patients' }],
    steps: ['Book a 20-minute slot online, via WhatsApp, or in-store', 'Bring ALL your medicines — or a photo of them', 'Pharmacist reviews each medicine for safety and necessity', 'Receive a written medicine plan to share with your doctor'],
  },
  {
    emoji: '🏠',
    title: 'Home Medicine Delivery',
    tag: 'Delivery',
    desc: 'Same-day delivery across Karachi for orders placed before 5pm. Express 45-minute delivery available. All orders tracked in real time via WhatsApp.',
    longDesc: 'We deliver over 8,000 medicines, OTC products, supplements, medical devices, and baby products to all areas of Karachi. Orders above Rs. 5,000 deliver free. Our delivery partners are trained to handle temperature-sensitive products including insulin and certain vaccines in validated cold packs.',
    price: 'Free on orders above Rs. 5,000',
    badge: 'Express Available',
    badgeColor: 'bg-brand-blue',
    type: 'prescription_delivery',
    gradient: 'from-amber-500 to-orange-600',
    stats: [{ label: 'Delivery Time', val: 'Same Day' }, { label: 'Express', val: '45 min' }, { label: 'Coverage', val: 'All Karachi' }],
    steps: ['Order on our website, app, or WhatsApp', 'Pharmacist verifies prescription for Rx medicines', 'Order dispatched — track your rider in real time on WhatsApp', 'Delivered to your door with invoice and pharmacist note'],
  },
  {
    emoji: '🤱',
    title: 'Mother & Baby Clinic',
    tag: 'Specialist',
    desc: 'Pre-natal nutrition counselling, infant formula guidance, vaccination schedules, and postpartum care — supported by our women\'s health and paediatric pharmacists.',
    longDesc: 'New and expecting mothers face a barrage of conflicting advice. Our dedicated Mother & Baby clinic offers evidence-based guidance on prenatal vitamins, safe medicines during pregnancy and breastfeeding, infant feeding (breast vs formula), weaning nutrition, and childhood vaccination scheduling. Conducted by pharmacists with specialist training in women\'s health and paediatrics.',
    price: 'From Rs. 400 / session',
    badge: null,
    badgeColor: '',
    type: 'consultation',
    gradient: 'from-pink-500 to-fuchsia-600',
    stats: [{ label: 'Specialist', val: 'Paediatric' }, { label: 'Covers', val: '0–5 years' }, { label: 'Sessions', val: 'Online + In-store' }],
    steps: ['Book online or walk in with your baby or pregnancy questions', 'Pharmacist reviews your specific stage — trimester, newborn, toddler', 'Personalised feeding, supplement, and vaccination guidance', 'WhatsApp follow-up included — ask questions any time'],
  },
  {
    emoji: '🧪',
    title: 'Diabetes Management Clinic',
    tag: 'Chronic Care',
    desc: 'Monthly check-ins with our diabetes pharmacist — HbA1c tracking, blood glucose review, medicine optimisation, and diet coaching for Type 1 & 2 diabetics.',
    longDesc: 'Our structured diabetes management programme runs monthly. Each session includes a point-of-care HbA1c test (results in 5 minutes), a blood glucose log review, medicine assessment (including Metformin, insulin, SGLT-2 inhibitors), dietary coaching for Pakistani cuisine, and foot care education. Patients on our programme reduce HbA1c by an average of 1.2% within 3 months.',
    price: 'From Rs. 600 / monthly session',
    badge: 'New',
    badgeColor: 'bg-purple-600',
    type: 'consultation',
    gradient: 'from-blue-700 to-cyan-600',
    stats: [{ label: 'HbA1c Drop', val: '1.2% avg' }, { label: 'Monthly', val: 'Check-in' }, { label: 'Includes', val: 'HbA1c Test' }],
    steps: ['Enrol in our Diabetes Management Programme — 3-month package', 'Monthly session: HbA1c test + glucose log review + medicine check', 'Personalised diet and exercise plan for Pakistani lifestyle', 'WhatsApp check-in between sessions — always here for you'],
  },
]

const FAQS = [
  { q: 'Do I need an appointment for most services?', a: 'Most services are walk-in friendly — blood pressure checks, consultations, and vaccinations can all be done without an appointment during opening hours (9am–9pm, 7 days a week). Booking in advance guarantees your preferred time slot.' },
  { q: 'Are your doctors and pharmacists qualified?', a: 'All our GPs are PMDC-registered. Our pharmacists hold BPharm or PharmD degrees from HEC-recognised Pakistani universities, with many holding additional specialist qualifications in clinical pharmacy, diabetes management, or dermatology.' },
  { q: 'Can I get a prescription through your online consultation?', a: 'Yes. Our GPs can issue e-prescriptions through online video consultations for most conditions. The prescription is sent to you digitally and can be filled at any Hussain Healthcare branch or via our delivery service.' },
  { q: 'How does home lab sample collection work?', a: 'After booking, a DRAP-certified phlebotomist visits your home at the scheduled time (we cover all Karachi areas). The sample is sent to Dow Diagnostic Lab and results are sent to you via WhatsApp within 24 hours, with a free pharmacist interpretation on request.' },
  { q: 'Is the Medication Review confidential?', a: 'Completely. All consultations are subject to patient confidentiality. Your medication record is held securely and is never shared without your consent.' },
  { q: 'I take many medicines. Can a pharmacist help simplify my regimen?', a: 'Absolutely — this is exactly what our Medication Review service is for. Polypharmacy (5+ medicines) is common in Pakistan and carries real risks of interactions and side effects. Our pharmacists specialise in rationalising complex regimens. Bring all your medicines — even supplements and herbal products.' },
]

export default function ServicesPage() {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [faqOpen, setFaqOpen] = useState<string | null>(null)
  const { user, openAuth } = useAuth()
  const toast = useToast()

  async function bookService(s: typeof SERVICES[0]) {
    if (!user) {
      window.open(
        `https://wa.me/923311113292?text=${encodeURIComponent(`Hi! I'd like to book: ${s.title}`)}`,
        '_blank'
      )
      toast.show('Opening WhatsApp to book your service')
      return
    }
    const res = await servicesApi.book({ service_type: s.type, service_name: s.title, is_online: s.type === 'consultation' })
    if (res.ok && res.data) {
      const d = res.data as { id: number }
      toast.show(`${s.title} booked! Reference: #${d.id}`)
    } else {
      toast.show(res.detail ?? 'Booking failed — please sign in and try again', '✕')
    }
  }

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ── */}
      <div className="bg-gradient-to-br from-brand-blue to-violet-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute w-96 h-96 rounded-full bg-white/5 top-[-100px] right-[-80px]" />
        <div className="absolute w-64 h-64 rounded-full bg-white/5 bottom-[-60px] left-[10%]" />
        <div className="relative w-[92%] max-w-[1280px] mx-auto py-16 md:py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Link href="/" className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm font-inter mb-6 transition-colors">
              ← Back to Home
            </Link>
            <h1 className="font-poppins font-extrabold text-4xl md:text-5xl text-white leading-tight mb-4 max-w-2xl">
              Pharmacy Services<br />
              <span className="text-white/70">Beyond the Medicine Shelf</span>
            </h1>
            <p className="text-white/80 font-inter text-[16px] max-w-xl leading-relaxed mb-8">
              From online consultations and lab tests to home delivery and vaccination — comprehensive healthcare for every stage of your life, in Karachi and beyond.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://wa.me/923311113292"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-poppins font-bold text-sm px-5 py-2.5 rounded-xl transition-colors"
              >
                💬 Book via WhatsApp
              </a>
              <a
                href="tel:+923311113292"
                className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-poppins font-bold text-sm px-5 py-2.5 rounded-xl transition-colors backdrop-blur-sm"
              >
                📞 Call +92 331 111 3292
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Quick stats strip ── */}
      <div className="bg-off-white border-b border-light-gray">
        <div className="w-[92%] max-w-[1280px] mx-auto py-5 flex flex-wrap justify-center gap-8">
          {[
            { val: '9 Services', label: 'Available' },
            { val: '7 Days/Week', label: '9am – 9pm' },
            { val: '25,000+', label: 'Consultations Done' },
            { val: 'Free', label: 'BP Check — Walk In' },
            { val: 'All Karachi', label: 'Home Delivery' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="font-poppins font-extrabold text-lg text-brand-blue">{s.val}</div>
              <div className="text-xs text-mid-gray font-inter">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Services grid ── */}
      <div className="w-[92%] max-w-[1280px] mx-auto py-14">
        <div className="mb-8">
          <h2 className="font-poppins font-extrabold text-2xl text-charcoal mb-1">All Services</h2>
          <p className="text-mid-gray font-inter text-sm">Click any service to see full details and how to book</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((s, i) => {
            const isOpen = expanded === s.title
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-off-white rounded-[18px] overflow-hidden shadow-card hover:shadow-card-hover transition-all flex flex-col"
              >
                {/* Card header with gradient */}
                <div className={`bg-gradient-to-br ${s.gradient} p-5 relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="relative z-10 flex items-start justify-between">
                    <div>
                      <div className="text-4xl mb-2">{s.emoji}</div>
                      <span className="bg-white/20 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg font-poppins backdrop-blur-sm">
                        {s.tag}
                      </span>
                    </div>
                    {s.badge && (
                      <span className={`${s.badgeColor} text-white text-[10px] font-bold px-2.5 py-1 rounded-lg font-poppins`}>
                        {s.badge}
                      </span>
                    )}
                  </div>
                  {/* Stats row */}
                  <div className="relative z-10 flex gap-2 mt-4 flex-wrap">
                    {s.stats.map(st => (
                      <div key={st.label} className="bg-white/15 rounded-lg px-2.5 py-1.5 backdrop-blur-sm">
                        <div className="font-poppins font-bold text-white text-xs">{st.val}</div>
                        <div className="text-white/60 text-[9px] font-inter">{st.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card body */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-poppins font-bold text-[15px] text-charcoal mb-1">{s.title}</h3>
                  <p className="text-sm text-mid-gray font-inter leading-relaxed mb-3">{s.desc}</p>

                  {/* Expandable detail */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="text-sm text-gray-600 font-inter leading-relaxed mb-4 border-t border-light-gray pt-3">
                          {s.longDesc}
                        </p>
                        <div className="space-y-2 mb-4">
                          <p className="text-[11px] font-poppins font-bold text-charcoal uppercase tracking-wider">How it works</p>
                          {s.steps.map((step, j) => (
                            <div key={j} className="flex gap-2.5 items-start">
                              <span className="w-5 h-5 rounded-full bg-brand-blue text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                {j + 1}
                              </span>
                              <p className="text-[13px] text-gray-600 font-inter leading-snug">{step}</p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mt-auto pt-3 border-t border-light-gray flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-brand-blue font-poppins">{s.price}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setExpanded(isOpen ? null : s.title)}
                        className="text-xs text-mid-gray font-poppins font-semibold hover:text-brand-blue transition-colors"
                      >
                        {isOpen ? 'Less ↑' : 'Details ↓'}
                      </button>
                      <button
                        onClick={() => bookService(s)}
                        className="bg-brand-blue text-white font-poppins font-bold text-xs px-3.5 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Book Now →
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className="bg-off-white py-14">
        <div className="w-[92%] max-w-[860px] mx-auto">
          <h2 className="font-poppins font-extrabold text-2xl text-charcoal mb-2">Frequently Asked Questions</h2>
          <p className="text-mid-gray font-inter text-sm mb-8">Everything you need to know about our services</p>
          <div className="space-y-3">
            {FAQS.map(f => (
              <div key={f.q} className="bg-white rounded-[14px] shadow-sm overflow-hidden">
                <button
                  onClick={() => setFaqOpen(faqOpen === f.q ? null : f.q)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left gap-3"
                >
                  <span className="font-poppins font-semibold text-[14px] text-charcoal">{f.q}</span>
                  <span className="text-brand-blue font-bold text-lg shrink-0">{faqOpen === f.q ? '−' : '+'}</span>
                </button>
                <AnimatePresence initial={false}>
                  {faqOpen === f.q && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-sm text-gray-600 font-inter leading-relaxed border-t border-light-gray pt-3">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom CTA ── */}
      <div className="bg-gradient-to-br from-brand-blue to-violet-700 py-14">
        <div className="w-[92%] max-w-[860px] mx-auto text-center">
          <h2 className="font-poppins font-extrabold text-3xl text-white mb-3">Not Sure Which Service You Need?</h2>
          <p className="text-white/75 font-inter text-[15px] mb-8 max-w-lg mx-auto leading-relaxed">
            Message us on WhatsApp and describe your situation — our pharmacist will recommend the right service for you, completely free.
          </p>
          <a
            href="https://wa.me/923311113292"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-poppins font-bold px-7 py-3.5 rounded-xl transition-colors text-[15px] shadow-lg"
          >
            💬 Chat With a Pharmacist
          </a>
        </div>
      </div>

    </div>
  )
}
