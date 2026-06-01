'use client'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

type Service = {
  tag: string
  title: string
  svgIcon?: React.ReactNode
  emoji?: string
  type: string
  price: string
  gradient: string
}

type Props = {
  service: Service | null
  onClose: () => void
}

const TIME_SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM']

export default function BookingModal({ service, onClose }: Props) {
  const [name, setName]       = useState('')
  const [phone, setPhone]     = useState('')
  const [date, setDate]       = useState('')
  const [slot, setSlot]       = useState('')
  const [notes, setNotes]     = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors]   = useState<Record<string, string>>({})

  function validate() {
    const e: Record<string, string> = {}
    if (!name.trim())  e.name  = 'Full name is required'
    if (!phone.trim()) e.phone = 'Phone number is required'
    if (!date)         e.date  = 'Please select a date'
    if (!slot)         e.slot  = 'Please choose a time slot'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSubmitted(true)
  }

  function handleClose() {
    setSubmitted(false)
    setName(''); setPhone(''); setDate(''); setSlot(''); setNotes(''); setErrors({})
    onClose()
  }

  const today = new Date().toISOString().split('T')[0]

  if (!service) return null

  return (
    <AnimatePresence>
      {service && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[2000] backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ type: 'spring', stiffness: 340, damping: 30 }}
            className="fixed inset-0 z-[2001] flex items-center justify-center px-4 py-8 overflow-y-auto"
          >
            <div className="bg-white rounded-[22px] w-full max-w-lg shadow-2xl overflow-hidden my-auto">

              {/* Header */}
              <div className="p-6 text-white relative" style={{ background: service.gradient }}>
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white text-sm transition"
                >✕</button>
                <div className="mb-4">
                  {service.svgIcon ? (
                    <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md">
                      <div className="w-6 h-6">{service.svgIcon}</div>
                    </div>
                  ) : (
                    <div className="text-4xl">{service.emoji}</div>
                  )}
                </div>
                <span className="inline-block bg-white/20 text-white text-[11px] font-bold px-2.5 py-1 rounded-full font-inter mb-2 uppercase tracking-widest">
                  {service.tag}
                </span>
                <h2 className="font-poppins font-black text-2xl text-white leading-tight tracking-tighter whitespace-pre-line">
                  {service.title}
                </h2>
                <p className="text-white/70 text-xs font-inter mt-1 font-bold uppercase tracking-wider">{service.price}</p>
              </div>

              {submitted ? (
                /* ── Success state ── */
                <div className="p-10 text-center">
                  <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center text-green-600 mx-auto mb-6 shadow-inner border border-green-100">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-10 h-10">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 className="font-poppins font-black text-2xl text-charcoal mb-3 tracking-tighter">Booking Confirmed!</h3>
                  <p className="text-mid-gray font-inter text-sm mb-1 leading-relaxed">
                    Thank you, <span className="font-bold text-charcoal">{name}</span>.
                  </p>
                  <p className="text-mid-gray font-inter text-sm mb-8 leading-relaxed max-w-sm mx-auto">
                    Our clinical team will contact you at <span className="font-bold text-charcoal">{phone}</span> within 15 minutes to finalize your schedule.
                  </p>
                  <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 text-left mb-8">
                    <p className="text-[10px] font-poppins font-black text-blue-600 mb-3 uppercase tracking-[0.2em]">Clinical Summary</p>
                    <div className="space-y-2.5 text-xs font-inter text-gray-600">
                      <div className="flex justify-between"><span>Service</span><span className="font-bold text-charcoal">{service.tag}</span></div>
                      <div className="flex justify-between"><span>Scheduled Date</span><span className="font-bold text-charcoal">{date}</span></div>
                      <div className="flex justify-between"><span>Priority Slot</span><span className="font-bold text-charcoal">{slot}</span></div>
                    </div>
                  </div>
                  <a
                    href={`https://wa.me/923311113292?text=${encodeURIComponent(`Hi! I've booked ${service.tag} for ${date} at ${slot}. My name is ${name}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-[#25d366] hover:bg-[#128c7e] text-white font-poppins font-black text-sm px-8 py-4 rounded-2xl transition-all duration-500 shadow-xl shadow-green-500/20 mb-4 w-full justify-center group"
                  >
                    Confirm via WhatsApp
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </a>
                  <button onClick={handleClose} className="w-full text-mid-gray font-poppins font-bold text-[11px] uppercase tracking-widest hover:text-charcoal transition-colors">
                    Return to Services
                  </button>
                </div>
              ) : (
                /* ── Form ── */
                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                  {/* Name */}
                  <div>
                    <label className="block text-[10px] font-poppins font-black text-charcoal mb-2 uppercase tracking-widest">Patient Full Name *</label>
                    <input
                      type="text" value={name} onChange={e => setName(e.target.value)}
                      placeholder="e.g. Ahmed Khan"
                      className={`w-full px-5 py-4 rounded-2xl border text-sm font-inter outline-none transition-all duration-300 ${errors.name ? 'border-red-400 bg-red-50' : 'border-black/[0.06] bg-black/[0.02] focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5'}`}
                    />
                    {errors.name && <p className="text-red-500 text-[10px] font-bold mt-2 uppercase tracking-wider">{errors.name}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-[10px] font-poppins font-black text-charcoal mb-2 uppercase tracking-widest">Contact Number *</label>
                    <input
                      type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                      placeholder="+92 3XX XXXXXXX"
                      className={`w-full px-5 py-4 rounded-2xl border text-sm font-inter outline-none transition-all duration-300 ${errors.phone ? 'border-red-400 bg-red-50' : 'border-black/[0.06] bg-black/[0.02] focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5'}`}
                    />
                    {errors.phone && <p className="text-red-500 text-[10px] font-bold mt-2 uppercase tracking-wider">{errors.phone}</p>}
                  </div>

                  {/* Date + Time slot */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-poppins font-black text-charcoal mb-2 uppercase tracking-widest">Preferred Date *</label>
                      <input
                        type="date" value={date} onChange={e => setDate(e.target.value)} min={today}
                        className={`w-full px-5 py-4 rounded-2xl border text-sm font-inter outline-none transition-all duration-300 ${errors.date ? 'border-red-400 bg-red-50' : 'border-black/[0.06] bg-black/[0.02] focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5'}`}
                      />
                      {errors.date && <p className="text-red-500 text-[10px] font-bold mt-2 uppercase tracking-wider">{errors.date}</p>}
                    </div>
                    <div>
                      <label className="block text-[10px] font-poppins font-black text-charcoal mb-2 uppercase tracking-widest">Time Slot *</label>
                      <select
                        value={slot} onChange={e => setSlot(e.target.value)}
                        className={`w-full px-5 py-4 rounded-2xl border text-sm font-inter outline-none transition-all duration-300 bg-black/[0.02] ${errors.slot ? 'border-red-400 bg-red-50' : 'border-black/[0.06] focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5'}`}
                      >
                        <option value="">Select Slot</option>
                        {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      {errors.slot && <p className="text-red-500 text-[10px] font-bold mt-2 uppercase tracking-wider">{errors.slot}</p>}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-[10px] font-poppins font-black text-charcoal mb-2 uppercase tracking-widest">Clinical Notes <span className="text-mid-gray font-normal lowercase">(optional)</span></label>
                    <textarea
                      value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                      placeholder="Symptoms, medicine name, or test type..."
                      className="w-full px-5 py-4 rounded-2xl border border-black/[0.06] bg-black/[0.02] focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 text-sm font-inter outline-none transition-all duration-300 resize-none"
                    />
                  </div>

                  {/* Reassurance */}
                  <div className="flex items-start gap-3 bg-blue-50/50 border border-blue-100 rounded-2xl p-4 text-[11px] text-blue-700 font-inter leading-relaxed">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                    </div>
                    <span>Data is encrypted and shared only with our clinical team. A verification call will follow within 15 minutes.</span>
                  </div>

                  <button
                    type="submit"
                    className="group w-full py-4 rounded-2xl font-poppins font-black text-white text-sm transition-all duration-500 shadow-xl shadow-black/10 hover:shadow-blue-600/20 active:scale-[.98] flex items-center justify-center gap-3"
                    style={{ background: service.gradient }}
                  >
                    Confirm Appointment
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
