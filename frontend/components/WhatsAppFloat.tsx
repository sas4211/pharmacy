'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const QUICK_ACTIONS = [
  { label: '💊 Order Medicines', text: 'Hi! I want to order some medicines. Please let me know how to proceed.' },
  { label: '📋 Send Prescription', text: 'Hello, I have a prescription to upload. Can you please check it and guide me?' },
  { label: '🩺 Book consultation', text: 'Hi, I\'d like to book an online consultation with a healthcare doctor.' },
  { label: '🔬 Dow Lab Tests', text: 'Hi! I want to book a lab diagnostic test with home collection.' }
]

export default function WhatsAppFloat() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [mounted, setMounted] = useState(false)
  const deskRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    const handleOutsideClick = (e: MouseEvent) => {
      if (deskRef.current && !deskRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  function handleSend() {
    const defaultText = "Hi Hussain Healthcare, I need assistance."
    const finalMsg = encodeURIComponent(message.trim() || defaultText)
    window.open(`https://wa.me/923311113292?text=${finalMsg}`, '_blank', 'noopener,noreferrer')
    setIsOpen(false)
  }

  if (!mounted) return null

  return (
    <div className="fixed bottom-6 right-6 z-[1900]" ref={deskRef}>
      {/* Expanded WhatsApp Desk Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="absolute bottom-20 right-0 w-[380px] max-w-[calc(100vw-2rem)] p-2 rounded-[2.5rem] bg-[#25d366]/8 border border-[#25d366]/25 shadow-[0_24px_50px_rgba(37,211,102,0.18)] backdrop-blur-xl"
            style={{ transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)' }}
          >
            {/* Concentric Double-Bezel Inner Core */}
            <div className="bg-white rounded-[calc(2.5rem-0.5rem)] overflow-hidden shadow-inner border border-light-gray flex flex-col">
              
              {/* Header */}
              <div 
                className="p-5 text-white flex items-center justify-between"
                style={{ background: 'linear-gradient(135deg, #0f9b4e, #25d366)' }}
              >
                <div className="flex items-center gap-3.5">
                  {/* Doctor Avatar / Badge */}
                  <div className="relative w-12 h-12 rounded-full border-2 border-white/30 bg-white/20 flex items-center justify-center text-xl overflow-hidden shrink-0 shadow-lg">
                    👩‍⚕️
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#39ff14] border-2 border-white animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-poppins font-extrabold text-sm tracking-tight text-white leading-tight">
                      Hussain Pharmacy Desk
                    </h3>
                    <p className="text-[11px] text-white/90 font-medium flex items-center gap-1 font-inter">
                      Dr. Sarah Khan <span className="opacity-70">(Clinical Pharmacist)</span>
                    </p>
                    <p className="text-[9px] text-[#39ff14] font-semibold mt-0.5 tracking-wider uppercase font-poppins">
                      ● Active Online
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xs transition duration-300 font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4 bg-off-white/40">
                {/* Micro Greeting */}
                <div className="bg-white rounded-2xl p-3 border border-light-gray shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
                  <p className="text-[12px] font-inter text-charcoal leading-relaxed">
                    Hello! Ask for medicines, prescription uploads, or lab testing support. How can I help you today?
                  </p>
                </div>

                {/* Quick actions grid */}
                <div className="space-y-1.5">
                  <p className="text-[10px] font-poppins font-bold text-mid-gray uppercase tracking-widest pl-1 mb-2">
                    Quick Service Inquiry
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {QUICK_ACTIONS.map((qa) => (
                      <button
                        key={qa.label}
                        onClick={() => setMessage(qa.text)}
                        className="text-left text-[11px] font-semibold font-poppins text-charcoal px-3 py-2.5 bg-white border border-light-gray rounded-xl hover:border-[#25d366] hover:bg-[#25d366]/5 hover:text-[#0f9b4e] transition duration-300 shadow-[0_2px_6px_rgba(0,0,0,0.01)] hover:-translate-y-0.5 active:scale-[0.98]"
                      >
                        {qa.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Message Area */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-poppins font-bold text-mid-gray uppercase tracking-widest pl-1">
                    Your Custom Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type details, symptoms, or medicine name..."
                    rows={3}
                    className="w-full text-[12px] font-inter text-charcoal px-3.5 py-3 rounded-2xl border border-light-gray outline-none focus:border-[#25d366] bg-white resize-none shadow-inner transition duration-300 placeholder:text-mid-gray/70"
                  />
                </div>

                {/* Submit Action (Button-in-Button Trailing Icon) */}
                <button
                  onClick={handleSend}
                  className="w-full pl-6 pr-2.5 py-2.5 rounded-full text-white font-poppins font-bold text-xs flex items-center justify-between shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-0.5 active:scale-[0.98] transition group"
                  style={{ background: 'linear-gradient(135deg, #0f9b4e, #25d366)' }}
                >
                  <span>Start WhatsApp Chat</span>
                  <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-semibold transition group-hover:translate-x-1 group-hover:scale-105">
                    →
                  </span>
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        animate={isOpen ? { rotate: 90 } : { rotate: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-[0_6px_25px_rgba(37,211,102,.45)] group focus:outline-none z-[1901]"
        style={{ 
          background: 'linear-gradient(135deg, #25d366, #128c7e)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}
        title="Chat on WhatsApp"
      >
        <div className="relative">
          <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-[#39ff14] border border-white animate-pulse" />
        </div>
      </motion.button>
    </div>
  )
}
