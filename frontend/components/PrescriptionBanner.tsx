'use client'
import { useAuth, useToast } from '@/store'
import { prescriptionsApi } from '@/lib/api'
import { useRef } from 'react'
import { motion } from 'framer-motion'

const STEPS = [
  { num: '01', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><rect x="3" y="2" width="18" height="20" rx="2" ry="2" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
  ), title: 'Upload Rx', desc: 'Photo, scan or PDF — any format accepted' },
  { num: '02', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
  ), title: 'We Verify', desc: 'Licensed pharmacist reviews within 2 hours' },
  { num: '03', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><rect x="1" y="3" width="15" height="13" rx="2" ry="2" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
  ), title: 'We Deliver', desc: 'Medicines dispatched from certified supplier' },
]

export default function PrescriptionBanner() {
  const { user, openAuth } = useAuth()
  const toast = useToast()
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const res = await prescriptionsApi.upload(file)
    if (res.ok) toast.show('Prescription uploaded! A pharmacist will review it within 2 hours.')
    else toast.show(res.detail ?? 'Upload failed — please try again', '✕')
    e.target.value = ''
  }

  function handleClick() {
    if (!user) { openAuth('login'); toast.show('Sign in to upload a prescription'); return }
    fileRef.current?.click()
  }

  return (
    <section id="prescription-banner" className="py-10">
      <div className="w-[92%] max-w-[1280px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-[24px] overflow-hidden p-8 md:p-12 ring-1 ring-white/10"
          style={{ background: 'linear-gradient(135deg,#1230a8 0%,#1a3fd4 50%,#7b2d8b 100%)' }}
        >
          {/* Blobs */}
          <div className="absolute w-64 h-64 rounded-full bg-white/8 top-[-80px] right-[180px]" />
          <div className="absolute w-36 h-36 rounded-full bg-white/8 bottom-[-50px] right-[380px]" />

          <div className="relative z-10 grid md:grid-cols-[1fr_auto] gap-10 items-center">
            <div>
              <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full font-inter mb-4 backdrop-blur-sm">
                📋 Arrange For Me — Free Service
              </span>
              <h3 className="font-poppins font-black text-white text-2xl md:text-3xl leading-tight mb-3 tracking-[-0.01em]">
                Can&apos;t Find Your Medicine?<br/>
                <span className="text-pink-300">We&apos;ll Source It For You.</span>
              </h3>
              <p className="text-white/80 font-inter text-sm mb-6 max-w-lg leading-relaxed">
                Upload any prescription — even for rare, import, or out-of-stock medicines. Our licensed pharmacists source it from DRAP-verified suppliers and deliver directly to your home. <strong className="text-white">98% success rate.</strong>
              </p>

              {/* Steps */}
              <div className="grid sm:grid-cols-3 gap-4 mb-7">
                {STEPS.map(s => (
                  <div key={s.num} className="bg-white/[0.08] rounded-xl p-4 backdrop-blur-sm border border-white/15 hover:bg-white/[0.12] transition-colors duration-300">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{s.icon}</span>
                      <span className="text-white/40 font-poppins font-bold text-xs">{s.num}</span>
                    </div>
                    <div className="font-poppins font-bold text-white text-sm">{s.title}</div>
                    <div className="text-white/60 font-inter text-xs mt-0.5">{s.desc}</div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 items-center">
                <button
                  onClick={handleClick}
                  className="inline-flex items-center gap-2 bg-[#e63946] text-white font-poppins font-bold text-sm px-6 py-3 rounded-xl hover:bg-[#c1121f] transition-all hover:-translate-y-0.5 shadow-[0_4px_16px_rgba(230,57,70,.4)]"
                >
                  📸 Upload Prescription
                </button>
                <a
                  href="https://wa.me/923311113292?text=Hi%2C%20I%20need%20help%20sourcing%20a%20medicine%20from%20my%20prescription"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25d366] text-white font-poppins font-bold text-sm px-5 py-3 rounded-xl hover:bg-green-600 transition-all hover:-translate-y-0.5"
                >
                  💬 WhatsApp Instead
                </a>
              </div>

              {/* Trust row */}
              <div className="flex flex-wrap gap-6 mt-8 border-t border-white/10 pt-6">
                {[
                  { icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5"><polyline points="20 6 9 17 4 12" /></svg>
                  ), text: 'DRAP Licensed' },
                  { icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  ), text: 'Confidential' },
                  { icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                  ), text: 'Free Service' },
                ].map(t => (
                  <div key={t.text} className="flex items-center gap-2 text-white/70 font-poppins font-bold text-[10px] uppercase tracking-widest">
                    <span className="text-white/40">{t.icon}</span><span>{t.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating prescription illustration (Hardware Aesthetic) */}
            <div className="hidden lg:flex flex-col items-center gap-5 animate-float-y">
              <div className="w-40 p-1.5 bg-white/10 rounded-[2rem] border border-white/20 backdrop-blur-xl shadow-2xl">
                <div className="bg-white rounded-[calc(2rem-0.375rem)] p-6 space-y-4 shadow-inner">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
                    </div>
                    <div>
                      <div className="h-2 w-16 bg-black/[0.08] rounded-full" />
                      <div className="h-1.5 w-10 bg-black/[0.04] rounded-full mt-1.5" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-1.5 w-full bg-black/[0.04] rounded-full" />
                    <div className="h-1.5 w-4/5 bg-black/[0.04] rounded-full" />
                    <div className="h-1.5 w-3/4 bg-black/[0.04] rounded-full" />
                  </div>
                  <div className="pt-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500/20" />
                      <div className="h-1.5 w-20 bg-blue-500/10 rounded-full" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500/20" />
                      <div className="h-1.5 w-16 bg-blue-500/10 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white/15 border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2.5 rounded-2xl font-poppins backdrop-blur-md shadow-xl">
                Verified Clinical Sourcing
              </div>
            </div>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            className="hidden"
            onChange={handleUpload}
          />
        </motion.div>
      </div>
    </section>
  )
}
