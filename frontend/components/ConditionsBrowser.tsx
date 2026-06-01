'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearch } from '@/store'

const TABS = [
  { id: 'All',         label: 'All',         emoji: '🏥' },
  { id: 'Pain',        label: 'Pain Relief',  emoji: '💊' },
  { id: 'Digestive',   label: 'Digestive',    emoji: '🫃' },
  { id: 'Respiratory', label: 'Respiratory',  emoji: '🫁' },
  { id: 'Chronic',     label: 'Chronic',      emoji: '❤️' },
  { id: 'Skin',        label: 'Skin',         emoji: '✨' },
  { id: 'Mental',      label: 'Mental Health',emoji: '🧠' },
  { id: 'Women',       label: "Women's",      emoji: '🌸' },
]

const CONDITIONS = [
  // Pain
  { name: 'Headache',       emoji: '🤕', cat: 'Pain',        count: 12, tip: 'Ibuprofen or paracetamol as first-line' },
  { name: 'Migraine',       emoji: '💫', cat: 'Pain',        count: 9,  tip: 'Triptans + dark rest for acute attacks' },
  { name: 'Back Pain',      emoji: '🔙', cat: 'Pain',        count: 15, tip: 'NSAIDs + physio exercises recommended' },
  { name: 'Arthritis',      emoji: '🦴', cat: 'Pain',        count: 21, tip: 'Glucosamine & omega-3 for joint support' },
  { name: 'Muscle Pain',    emoji: '💪', cat: 'Pain',        count: 11, tip: 'Topical diclofenac for localised pain' },
  { name: 'Dental Pain',    emoji: '🦷', cat: 'Pain',        count: 7,  tip: 'Clove oil + ibuprofen for temporary relief' },
  // Digestive
  { name: 'Acidity / GERD', emoji: '🔥', cat: 'Digestive',  count: 18, tip: 'PPIs for chronic; antacids for immediate relief' },
  { name: 'IBS',            emoji: '🫃', cat: 'Digestive',  count: 10, tip: 'Buscopan + dietary fibre management' },
  { name: 'Constipation',   emoji: '😣', cat: 'Digestive',  count: 14, tip: 'Lactulose + increased water intake' },
  { name: 'Nausea',         emoji: '🤢', cat: 'Digestive',  count: 9,  tip: 'Metoclopramide + ginger for mild cases' },
  { name: 'Diarrhoea',      emoji: '💧', cat: 'Digestive',  count: 12, tip: 'ORS rehydration is the critical first step' },
  { name: 'Ulcers',         emoji: '⚠️', cat: 'Digestive',  count: 8,  tip: 'H. pylori testing before starting PPIs' },
  // Respiratory
  { name: 'Cough & Cold',   emoji: '🤧', cat: 'Respiratory', count: 22, tip: 'Honey + steam for mild; antibiotics only if bacterial' },
  { name: 'Asthma',         emoji: '😮‍💨', cat: 'Respiratory', count: 17, tip: 'Salbutamol rescue inhaler + ICS preventer' },
  { name: 'Allergic Rhinitis',emoji: '🌼', cat: 'Respiratory', count: 12, tip: 'Intranasal corticosteroids are most effective' },
  { name: 'Sinusitis',      emoji: '👃', cat: 'Respiratory', count: 8,  tip: 'Saline irrigation + decongestants first' },
  { name: 'Bronchitis',     emoji: '🫁', cat: 'Respiratory', count: 9,  tip: 'Usually viral — antibiotics rarely needed' },
  { name: 'Sleep Apnoea',   emoji: '😴', cat: 'Respiratory', count: 5,  tip: 'CPAP therapy is gold standard treatment' },
  // Chronic
  { name: 'Diabetes',       emoji: '🩸', cat: 'Chronic',    count: 30, tip: 'Monitor HbA1c every 3 months; Metformin first-line' },
  { name: 'Hypertension',   emoji: '❤️', cat: 'Chronic',    count: 26, tip: 'ACE inhibitors + lifestyle change; check BP daily' },
  { name: 'Thyroid',        emoji: '🦋', cat: 'Chronic',    count: 18, tip: 'Levothyroxine dose adjusted by TSH levels' },
  { name: 'High Cholesterol',emoji: '🫀', cat: 'Chronic',    count: 15, tip: 'Statins + omega-3 + low-saturated fat diet' },
  { name: 'Heart Disease',  emoji: '💔', cat: 'Chronic',    count: 20, tip: 'Aspirin + statin + lifestyle modification' },
  { name: 'Anaemia',        emoji: '🩺', cat: 'Chronic',    count: 12, tip: 'Iron + Vitamin C for absorption; B12 if deficient' },
  // Skin
  { name: 'Acne',           emoji: '😞', cat: 'Skin',       count: 19, tip: 'Benzoyl peroxide + niacinamide first-line' },
  { name: 'Eczema',         emoji: '🤲', cat: 'Skin',       count: 14, tip: 'Daily emollient + mild corticosteroid for flares' },
  { name: 'Psoriasis',      emoji: '🧴', cat: 'Skin',       count: 9,  tip: 'Coal tar + moisturisers for mild cases' },
  { name: 'Fungal Infection',emoji: '🍄', cat: 'Skin',       count: 12, tip: 'Clotrimazole cream — keep area dry' },
  { name: 'Sun Damage',     emoji: '☀️', cat: 'Skin',       count: 8,  tip: 'SPF 50+ daily + Vitamin C serum for repair' },
  { name: 'Dandruff',       emoji: '❄️', cat: 'Skin',       count: 7,  tip: 'Ketoconazole or selenium sulphide shampoo' },
  // Mental Health
  { name: 'Anxiety',        emoji: '😰', cat: 'Mental',     count: 11, tip: 'Ashwagandha + magnesium for mild anxiety' },
  { name: 'Insomnia',       emoji: '🌙', cat: 'Mental',     count: 9,  tip: 'Melatonin 1–5mg + sleep hygiene practices' },
  { name: 'Stress',         emoji: '😫', cat: 'Mental',     count: 8,  tip: 'Adaptogens + B-complex vitamins effective' },
  { name: 'Depression',     emoji: '😔', cat: 'Mental',     count: 6,  tip: 'Always consult a doctor; do not self-medicate' },
  // Women's Health
  { name: 'PCOS',           emoji: '🌸', cat: 'Women',      count: 10, tip: 'Inositol + spearmint tea for hormonal support' },
  { name: 'Menstrual Pain', emoji: '🔴', cat: 'Women',      count: 13, tip: 'Ibuprofen + heat therapy; start 1 day early' },
  { name: 'Pregnancy Care', emoji: '🤱', cat: 'Women',      count: 18, tip: 'Folic acid 400mcg + iron from first trimester' },
  { name: 'Menopause',      emoji: '🦋', cat: 'Women',      count: 9,  tip: 'Evening primrose oil + calcium + Vit D' },
]

export default function ConditionsBrowser() {
  const [activeTab, setActiveTab] = useState('All')
  const [hovered, setHovered] = useState<string | null>(null)
  const { setQuery, setCategory } = useSearch()

  function browseCondition(conditionName: string) {
    setCategory(null)
    setQuery(conditionName)
    const el = document.getElementById('products-section')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const filtered = activeTab === 'All'
    ? CONDITIONS
    : CONDITIONS.filter(c => c.cat === activeTab)

  return (
    <section className="py-14 bg-white">
      <div className="w-[92%] max-w-[1280px] mx-auto">
        <div className="mb-6">
          <h2 className="font-poppins font-black text-2xl tracking-tight gradient-text-brand mb-1">Browse by Health Condition</h2>
          <p className="text-mid-gray font-inter text-sm">Find the right medicines for your condition — curated by our pharmacists</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-7">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-poppins font-semibold transition-all
                ${activeTab === tab.id ? 'text-white shadow-md' : 'bg-off-white text-charcoal hover:bg-light-gray'}`}
              style={activeTab === tab.id ? { background: 'linear-gradient(135deg,#1a3fd4,#7b2d8b)' } : {}}
            >
              <span>{tab.emoji}</span>{tab.label}
            </button>
          ))}
        </div>

        {/* Conditions grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3"
          >
            {filtered.map((c, i) => (
              <motion.button
                key={c.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                whileHover={{ y: -4 }}
                onHoverStart={() => setHovered(c.name)}
                onHoverEnd={() => setHovered(null)}
                onClick={() => browseCondition(c.name)}
                className="relative bg-off-white rounded-[14px] p-4 flex flex-col gap-1.5 cursor-pointer hover:shadow-card ring-1 ring-black/[0.03] transition-all overflow-hidden group text-left w-full"
              >
                {/* Hover tip overlay */}
                {hovered === c.name && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-brand-blue/95 rounded-[14px] flex items-center justify-center p-3 z-10"
                  >
                    <p className="text-white text-[10px] font-inter text-center leading-snug">
                      💡 {c.tip}
                    </p>
                  </motion.div>
                )}
                <span className="text-2xl">{c.emoji}</span>
                <div className="font-poppins font-bold text-xs text-charcoal leading-snug">{c.name}</div>
                <div className="text-[10px] text-mid-gray font-inter">{c.count} medicines</div>
                <div className="text-[10px] font-bold text-brand-blue font-poppins mt-auto">Browse →</div>
              </motion.button>
            ))}
          </motion.div>
        </AnimatePresence>

        <p className="text-[11px] text-mid-gray font-inter mt-5 text-center">
          ⚕️ Hover any condition to see pharmacist tips. Always consult a licensed healthcare professional before starting treatment.
        </p>
      </div>
    </section>
  )
}
