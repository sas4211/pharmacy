'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useCart, useToast } from '@/store'

const VITALS = [
  { label: 'Blood Glucose', val: '118', unit: 'mg/dL', status: 'Normal', emoji: '🩸', color: 'text-green-600', bg: 'bg-green-50', date: 'Apr 1' },
  { label: 'Blood Pressure', val: '128/82', unit: 'mmHg', status: 'Elevated', emoji: '❤️', color: 'text-amber-600', bg: 'bg-amber-50', date: 'Mar 28' },
  { label: 'HbA1c',          val: '7.1',   unit: '%',    status: 'Near Target', emoji: '🧪', color: 'text-blue-600', bg: 'bg-blue-50', date: 'Mar 20' },
  { label: 'Weight',         val: '78',    unit: 'kg',   status: 'Healthy',  emoji: '⚖️', color: 'text-purple-600', bg: 'bg-purple-50', date: 'Mar 15' },
]

const MEDICINES = [
  { name: 'Metformin 500mg',   freq: 'Twice daily with meals', refillIn: '5 days',  emoji: '💊', urgent: true },
  { name: 'Thyroxine 50mcg',   freq: 'Once daily, empty stomach', refillIn: '18 days', emoji: '🦋', urgent: false },
  { name: 'Amlodipine 5mg',    freq: 'Once daily',             refillIn: '12 days', emoji: '❤️', urgent: false },
  { name: 'Omega-3 1000mg',    freq: 'Once daily with food',   refillIn: '22 days', emoji: '🌊', urgent: false },
]

const CONDITIONS = ['Type 2 Diabetes', 'Hypertension', 'Hypothyroidism']
const ALLERGIES  = ['Penicillin', 'Sulfa drugs']

const HEALTH_FIELDS = [
  { label: 'Blood Group',   val: 'B+',       emoji: '🩸' },
  { label: 'Height',        val: '172 cm',   emoji: '📏' },
  { label: 'Age',           val: '45 years', emoji: '🎂' },
  { label: 'BMI',           val: '26.4',     emoji: '⚖️' },
]

export default function HealthPage() {
  const [editOpen, setEditOpen] = useState(false)
  const addItem = useCart((s) => s.addItem)
  const openCart = useCart((s) => s.openCart)
  const showToast = useToast((s) => s.show)

  function handleReorder(m: typeof MEDICINES[0]) {
    addItem({ name: m.name, emoji: m.emoji, price: 0 })
    openCart()
    showToast(`${m.name} added to cart`, '💊')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-poppins font-extrabold text-2xl text-charcoal">Health Profile</h1>
          <p className="text-mid-gray font-inter text-sm mt-0.5">Your personal medical summary</p>
        </div>
        <button onClick={() => setEditOpen(o => !o)}
          className="text-sm bg-brand-blue text-white font-poppins font-bold px-4 py-2 rounded-xl hover:bg-blue-700 transition shadow-sm">
          ✏️ Edit Profile
        </button>
      </div>

      {/* Quick info */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {HEALTH_FIELDS.map((f, i) => (
            <div key={f.label} className="bg-off-white rounded-xl p-3 text-center">
              <span className="text-2xl">{f.emoji}</span>
              <p className="font-poppins font-bold text-base text-charcoal mt-1">{f.val}</p>
              <p className="text-xs text-mid-gray font-inter">{f.label}</p>
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-[11px] font-poppins font-bold text-charcoal uppercase tracking-wider mb-2">Chronic Conditions</p>
            <div className="flex flex-wrap gap-1.5">
              {CONDITIONS.map(c => (
                <span key={c} className="bg-red-50 text-red-700 text-xs font-inter px-2.5 py-1 rounded-lg border border-red-200">{c}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[11px] font-poppins font-bold text-charcoal uppercase tracking-wider mb-2">Known Allergies</p>
            <div className="flex flex-wrap gap-1.5">
              {ALLERGIES.map(a => (
                <span key={a} className="bg-amber-50 text-amber-700 text-xs font-inter px-2.5 py-1 rounded-lg border border-amber-200">⚠️ {a}</span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Vitals */}
      <div>
        <h2 className="font-poppins font-bold text-[15px] text-charcoal mb-3">Latest Vitals</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {VITALS.map((v, i) => (
            <motion.div key={v.label} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }}
              className={`${v.bg} rounded-2xl p-4 flex items-center gap-4`}>
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm shrink-0">{v.emoji}</div>
              <div className="flex-1">
                <p className="text-xs text-mid-gray font-inter">{v.label}</p>
                <p className={`font-poppins font-extrabold text-xl ${v.color}`}>{v.val} <span className="text-sm font-inter font-normal text-mid-gray">{v.unit}</span></p>
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-bold ${v.color}`}>{v.status}</span>
                  <span className="text-[10px] text-mid-gray font-inter">· {v.date}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Current medicines */}
      <div>
        <h2 className="font-poppins font-bold text-[15px] text-charcoal mb-3">Current Medicines</h2>
        <div className="space-y-2">
          {MEDICINES.map((m, i) => (
            <motion.div key={m.name} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
              className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center text-xl shrink-0">{m.emoji}</div>
              <div className="flex-1 min-w-0">
                <p className="font-poppins font-bold text-[13px] text-charcoal">{m.name}</p>
                <p className="text-xs text-mid-gray font-inter">{m.freq}</p>
              </div>
              <div className="text-right shrink-0 flex flex-col items-end gap-1">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${m.urgent ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                  Refill in {m.refillIn}
                </span>
                <button onClick={() => handleReorder(m)} className="text-[11px] text-brand-blue font-inter hover:underline">Reorder</button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-3">
        <span className="text-xl shrink-0">🔒</span>
        <p className="text-sm font-inter text-blue-800 leading-relaxed">
          Your health data is encrypted and never shared without your consent. This information helps our pharmacists provide personalised care.
        </p>
      </div>
    </div>
  )
}
