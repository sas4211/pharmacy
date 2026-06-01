'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useSearch } from '@/store'

const BRANDS = [
  { emoji: '💊', name: 'Abbott',      count: '120+', origin: '🇺🇸 USA',           tag: 'Pharmaceuticals',     tip: 'Brufen, Duphaston, Influvac & more flagship medicines' },
  { emoji: '🧴', name: 'CeraVe',      count: '45+',  origin: '🇺🇸 USA',           tag: 'Dermatology',         tip: 'Dermatologist No.1 recommended skincare — ceramide-powered' },
  { emoji: '🌿', name: 'Himalaya',    count: '90+',  origin: '🇮🇳 India',         tag: 'Herbal Wellness',     tip: 'Trusted herbal formulas for digestive, skin & liver health' },
  { emoji: '🩸', name: 'Accu-Chek',   count: '18+',  origin: '🇩🇪 Germany',       tag: 'Diagnostics',         tip: 'Most accurate blood glucose monitors in Pakistan' },
  { emoji: '🥗', name: 'Centrum',     count: '30+',  origin: '🇺🇸 USA',           tag: 'Multivitamins',       tip: 'Complete daily multivitamin range for all life stages' },
  { emoji: '💙', name: 'Pfizer',      count: '200+', origin: '🇺🇸 USA',           tag: 'Global Pharma',       tip: 'World\'s leading pharmaceutical company — vaccines to OTC' },
  { emoji: '🍼', name: 'Aptamil',     count: '22+',  origin: '🇬🇧 UK',            tag: 'Infant Nutrition',    tip: 'Clinically researched infant formulas from birth to toddler' },
  { emoji: '⚕️', name: 'Philips',     count: '55+',  origin: '🇳🇱 Netherlands',   tag: 'Health Tech',         tip: 'Clinically validated BP monitors, nebulisers & health devices' },
  { emoji: '🌸', name: 'Neutrogena',  count: '65+',  origin: '🇺🇸 USA',           tag: 'Skin & Hair',         tip: 'Dermatologist-recommended skincare, SPF & hair care' },
  { emoji: '✨', name: "L'Oréal",     count: '80+',  origin: '🇫🇷 France',        tag: 'Beauty & Skin',       tip: 'Science-backed skincare & hair products from Paris' },
  { emoji: '🫀', name: 'GSK',         count: '150+', origin: '🇬🇧 UK',            tag: 'Consumer Health',     tip: 'Panadol, Sensodyne, Voltaren & Centrum — trusted globally' },
  { emoji: '🧪', name: 'Bayer',       count: '95+',  origin: '🇩🇪 Germany',       tag: 'Pharma & OTC',        tip: 'Aspirin, Canesten, Claritin & vitamins from 160+ years of science' },
  { emoji: '🌱', name: 'Reckitt',     count: '40+',  origin: '🇬🇧 UK',            tag: 'Hygiene & Health',    tip: 'Dettol, Gaviscon, Strepsils — household health essentials' },
  { emoji: '💫', name: 'Sanofi',      count: '70+',  origin: '🇫🇷 France',        tag: 'Chronic Disease',     tip: 'Metformin, insulin & cardiovascular medicines for chronic care' },
  { emoji: '🔵', name: 'AstraZeneca', count: '35+',  origin: '🇬🇧 UK',            tag: 'Biopharmaceuticals',  tip: 'Oncology, cardiovascular & respiratory specialist medicines' },
  { emoji: '🟢', name: 'Novartis',    count: '60+',  origin: '🇨🇭 Switzerland',   tag: 'Innovative Medicines', tip: 'Cutting-edge treatments for complex and rare conditions' },
]

export default function Brands() {
  const [hovered, setHovered] = useState<string | null>(null)
  const { setQuery, setCategory } = useSearch()

  function browseBrand(brandName: string) {
    setCategory(null)
    setQuery(brandName)
    const el = document.getElementById('products-section')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="py-14 bg-white">
      <div className="w-[92%] max-w-[1280px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-poppins font-black text-2xl tracking-tight gradient-text-brand mb-1">Shop by Brand</h2>
            <p className="text-mid-gray font-inter text-sm">100% genuine, DRAP-verified products from global healthcare leaders</p>
          </div>
          <a href="#" className="text-brand-blue font-semibold text-sm font-inter hover:underline hidden sm:block">
            All Brands →
          </a>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
          {BRANDS.map((b, i) => (
            <motion.button
              key={b.name}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -6, boxShadow: '0 12px 40px rgba(26,63,212,.16)', transition: { duration: 0.35, ease: [0.32, 0.72, 0, 1] } }}
              onHoverStart={() => setHovered(b.name)}
              onHoverEnd={() => setHovered(null)}
              onClick={() => browseBrand(b.name)}
              className="relative snap-start shrink-0 bg-off-white rounded-[18px] p-4 flex flex-col items-center gap-2 w-32 shadow-card ring-1 ring-black/[0.03] transition-all cursor-pointer group hover:bg-white overflow-hidden"
            >
              {/* Hover tip overlay */}
              {hovered === b.name && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-brand-blue/95 rounded-[18px] flex items-center justify-center p-3 z-10"
                >
                  <p className="text-white text-[10px] font-inter text-center leading-snug">
                    🛍️ {b.tip}
                  </p>
                </motion.div>
              )}
              <div className="w-12 h-12 bg-white group-hover:bg-off-white rounded-xl flex items-center justify-center text-3xl shadow-sm transition-colors">
                {b.emoji}
              </div>
              <span className="font-poppins font-bold text-xs text-charcoal text-center leading-tight group-hover:text-brand-blue transition-colors">
                {b.name}
              </span>
              <span className="text-[9px] text-mid-gray font-inter text-center leading-tight">{b.tag}</span>
              <div className="flex items-center justify-between w-full mt-1">
                <span className="text-[9px] text-mid-gray font-inter">{b.origin}</span>
                <span className="text-[9px] font-bold text-brand-blue font-poppins">{b.count}</span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Trust note */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-6 border-t border-light-gray">
          {[
            { icon: '✅', text: '100% Authentic Products' },
            { icon: '🏭', text: 'Direct from Authorized Distributors' },
            { icon: '🌡️', text: 'Cold-Chain Storage for Sensitive Products' },
            { icon: '📋', text: 'DRAP Registered Pharmacy' },
          ].map(t => (
            <div key={t.text} className="flex items-center gap-2 text-mid-gray font-inter text-xs">
              <span>{t.icon}</span><span>{t.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
