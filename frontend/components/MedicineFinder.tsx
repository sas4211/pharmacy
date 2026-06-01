'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SYMPTOMS: Record<string, { e: string; n: string; c: string; p: string }[]> = {
  'Headache':       [{ e:'💊', n:'Brufen 400mg Tablets (20s)', c:'Pain Relief · Abbott', p:'Rs. 180' }, { e:'💊', n:'Panadol Extra Tablets (10s)', c:'Fever & Pain · GSK', p:'Rs. 95' }, { e:'🧪', n:'Migraleve Pink Tablets (24s)', c:'Migraine Relief · Bayer', p:'Rs. 320' }],
  'Fever':          [{ e:'💊', n:'Panadol Extra Tablets (10s)', c:'Fever & Pain · GSK', p:'Rs. 95' }, { e:'💊', n:'Brufen 400mg Tablets (20s)', c:'Anti-inflammatory · Abbott', p:'Rs. 180' }, { e:'🩺', n:'Digital Thermometer Pro', c:'Devices · Dr. Morepen', p:'Rs. 640' }],
  'Cold & Flu':     [{ e:'💊', n:'Vitamin C 1000mg Effervescent (10s)', c:'Immunity · Pfizer', p:'Rs. 375' }, { e:'🧪', n:'Vicks VapoRub 50g', c:'Decongestant · P&G', p:'Rs. 280' }, { e:'💊', n:'Panadol Cold & Flu (10s)', c:'Multi-symptom · GSK', p:'Rs. 130' }],
  'Stomach Pain':   [{ e:'💊', n:'Buscopan 10mg Tablets (10s)', c:'Antispasmodic · Bayer', p:'Rs. 220' }, { e:'💊', n:'Nexium 20mg Capsules (14s)', c:'Acid Reflux · AstraZeneca', p:'Rs. 480' }, { e:'💊', n:'ORS Sachet (5s)', c:'Rehydration · GSK', p:'Rs. 85' }],
  'Allergy':        [{ e:'💊', n:'Zyrtec 10mg Tablets (10s)', c:'Antihistamine · UCB', p:'Rs. 350' }, { e:'💊', n:'Clarinase Repetabs (10s)', c:'Nasal Decongestant · Merck', p:'Rs. 290' }, { e:'🧴', n:'Beconase Aqueous Nasal Spray', c:'Corticosteroid · GSK', p:'Rs. 620' }],
  'Acidity':        [{ e:'💊', n:'Nexium 20mg Capsules (14s)', c:'PPI · AstraZeneca', p:'Rs. 480' }, { e:'💊', n:'Gaviscon Advance Liquid 150ml', c:'Antacid · Reckitt', p:'Rs. 360' }, { e:'💊', n:'Eno Regular Sachets (6s)', c:'Fast Antacid · GSK', p:'Rs. 110' }],
  'Cough':          [{ e:'💊', n:'Benylin Chesty Cough Syrup 150ml', c:'Expectorant · Pfizer', p:'Rs. 280' }, { e:'🧪', n:'Strepsils Honey & Lemon (24s)', c:'Throat Relief · Reckitt', p:'Rs. 180' }, { e:'💊', n:'Ventolin Inhaler 100mcg', c:'Bronchodilator · GSK', p:'Rs. 550' }],
  'Diabetes':       [{ e:'🩸', n:'Accu-Chek Instant Glucose Monitor', c:'Glucometer · Roche', p:'Rs. 4,500' }, { e:'💊', n:'Metformin 500mg Tablets (30s)', c:'Antidiabetic · Sanofi', p:'Rs. 220' }, { e:'🥗', n:'Centrum Silver Multivitamin (60s)', c:'Supplements · Haleon', p:'Rs. 2,100' }],
  'Blood Pressure': [{ e:'🫁', n:'Philips Upper Arm BP Monitor', c:'Devices · Philips', p:'Rs. 7,800' }, { e:'💊', n:'Amlodipine 5mg Tablets (30s)', c:'Antihypertensive · GSK', p:'Rs. 180' }, { e:'🥗', n:'Omega-3 Fish Oil 1000mg (60s)', c:'Heart Health · Nature\'s Way', p:'Rs. 1,650' }],
  'Skin Issues':    [{ e:'🧴', n:'CeraVe Moisturising Cream 250ml', c:'Skin Repair · CeraVe', p:'Rs. 1,850' }, { e:'🌿', n:'Himalaya Neem Face Wash 150ml', c:'Purifying · Himalaya', p:'Rs. 420' }, { e:'✨', n:'Neutrogena Hydro Boost Water Gel', c:'Hydration · Neutrogena', p:'Rs. 1,400' }],
  'Joint Pain':     [{ e:'💊', n:'Voltaren Emulgel 100g', c:'Topical NSAID · Haleon', p:'Rs. 720' }, { e:'💊', n:'Brufen 600mg Tablets (20s)', c:'Anti-inflammatory · Abbott', p:'Rs. 240' }, { e:'🥗', n:'Glucosamine & Chondroitin (60s)', c:'Joint Support · Bayer', p:'Rs. 1,800' }],
  'Anxiety/Sleep':  [{ e:'🌙', n:'Melatonin 3mg Tablets (30s)', c:'Sleep Support · Now Foods', p:'Rs. 950' }, { e:'🥗', n:'Magnesium Glycinate 400mg (60s)', c:'Calming Mineral · Solgar', p:'Rs. 1,400' }, { e:'🌿', n:'Ashwagandha Root Extract (60s)', c:'Adaptogen · Himalaya', p:'Rs. 880' }],
  'Eye Care':       [{ e:'👁', n:'Systane Ultra Lubricant Eye Drops', c:'Dry Eyes · Alcon', p:'Rs. 580' }, { e:'👁', n:'Optrex Infected Eye Drops 10ml', c:'Antibiotic · Sanofi', p:'Rs. 320' }, { e:'🕶', n:'Bausch & Lomb Ocuvite (60s)', c:'Eye Vitamins · Bausch', p:'Rs. 1,200' }],
  'Women\'s Health':[ { e:'💊', n:'Folic Acid 400mcg Tablets (30s)', c:'Prenatal · Vitabiotics', p:'Rs. 380' }, { e:'🌸', n:'Evening Primrose Oil 1000mg (60s)', c:'Hormonal Balance · Nature\'s Aid', p:'Rs. 1,100' }, { e:'💊', n:'Iron + Vitamin C Tablets (30s)', c:'Anaemia Support · Abbott', p:'Rs. 420' }],
}

const SYMPTOM_EMOJIS: Record<string, string> = {
  'Headache': '🤕', 'Fever': '🌡️', 'Cold & Flu': '🤧', 'Stomach Pain': '🤢',
  'Allergy': '😤', 'Acidity': '🔥', 'Cough': '😮‍💨', 'Diabetes': '🩸',
  'Blood Pressure': '❤️', 'Skin Issues': '✨', 'Joint Pain': '🦴',
  'Anxiety/Sleep': '🌙', 'Eye Care': '👁', 'Women\'s Health': '🌸',
}

export default function MedicineFinder() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <section className="py-14 bg-off-white">
      <div className="w-[92%] max-w-[1280px] mx-auto">
        <div className="mb-6">
          <h2 className="font-poppins font-black text-2xl tracking-tight gradient-text-brand mb-1">Medicine Finder</h2>
          <p className="text-mid-gray font-inter text-sm">Select a symptom — our pharmacists recommend the right products</p>
        </div>
        <div className="bg-white rounded-[20px] p-6 shadow-card ring-1 ring-black/[0.04] grid md:grid-cols-[1fr_1.3fr] gap-6">

          {/* Symptoms grid */}
          <div>
            <div className="text-sm font-poppins font-semibold text-charcoal mb-4">What are you feeling?</div>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(SYMPTOMS).map(sym => (
                <button
                  key={sym}
                  onClick={() => setSelected(sym === selected ? null : sym)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-inter transition-all border text-left
                    ${selected === sym
                      ? 'bg-brand-blue text-white border-brand-blue shadow-md'
                      : 'bg-off-white text-charcoal border-light-gray hover:border-brand-blue hover:bg-blue-50'}`}
                >
                  <span className="text-base shrink-0">{SYMPTOM_EMOJIS[sym]}</span>
                  <span className="truncate text-xs font-medium">{sym}</span>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-mid-gray font-inter mt-4 leading-snug">
              ⚕️ These suggestions are informational. Always consult a pharmacist or doctor before starting any medicine.
            </p>
          </div>

          {/* Recommended products */}
          <div>
            <div className="text-sm font-poppins font-semibold text-charcoal mb-4">
              {selected ? `Recommended for ${selected}` : 'Recommended Products'}
            </div>
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key={selected}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  {SYMPTOMS[selected].map((r, i) => (
                    <motion.div
                      key={r.n}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-center gap-3 p-3.5 bg-off-white rounded-xl hover:shadow-sm transition-shadow cursor-pointer group"
                    >
                      <span className="text-2xl shrink-0">{r.e}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-poppins font-semibold text-sm text-charcoal truncate group-hover:text-brand-blue transition-colors">
                          {r.n}
                        </div>
                        <div className="text-xs text-mid-gray font-inter mt-0.5">{r.c}</div>
                      </div>
                      <span className="font-poppins font-bold text-sm text-brand-red shrink-0">{r.p}</span>
                    </motion.div>
                  ))}
                  <p className="text-xs text-mid-gray font-inter pt-1">
                    Prices are indicative. Final price at checkout.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-48 text-mid-gray font-inter gap-3"
                >
                  <span className="text-4xl">🔍</span>
                  <p className="text-sm text-center">Select a symptom on the left<br/>to see pharmacist recommendations</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
