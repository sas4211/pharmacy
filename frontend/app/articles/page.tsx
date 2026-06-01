'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { getAllArticles } from '@/lib/articles'

const TAGS = ['All', 'Diabetes', 'Hypertension', 'Nutrition', 'Mental Health', 'Skin Care', 'Child Health', "Women's Health", 'Public Health', 'Ramadan Health', 'Weight & Fitness']

import { useState } from 'react'

export default function ArticlesPage() {
  const all = getAllArticles()
  const [active, setActive] = useState('All')
  const filtered = active === 'All' ? all : all.filter(a => a.tag === active)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-brand-blue to-blue-700 py-16">
        <div className="w-[92%] max-w-[1280px] mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link href="/" className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm font-inter mb-6 transition-colors">
              ← Back to Home
            </Link>
            <h1 className="font-poppins font-extrabold text-4xl text-white mb-3">Health Advice &amp; Expert Tips</h1>
            <p className="text-white/75 font-inter text-[16px] max-w-xl mx-auto">
              Evidence-based articles written by our clinical pharmacists — in plain language, for Pakistani patients.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="w-[92%] max-w-[1280px] mx-auto py-10">
        {/* Tag filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          {TAGS.map(t => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={`text-[12px] font-poppins font-bold px-3.5 py-1.5 rounded-full border transition-colors ${
                active === t
                  ? 'bg-brand-blue text-white border-brand-blue'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-brand-blue hover:text-brand-blue'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((a, i) => (
            <motion.div
              key={a.slug}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -5 }}
            >
              <Link href={`/articles/${a.slug}`}>
                <article className="bg-off-white rounded-[18px] overflow-hidden shadow-card hover:shadow-card-hover transition-all cursor-pointer group h-full flex flex-col">
                  <div className={`h-40 bg-gradient-to-br ${a.gradient} flex items-center justify-center text-6xl relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/10" />
                    <span className="relative z-10">{a.emoji}</span>
                    <span className="absolute top-3 left-3 bg-white/20 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg font-poppins backdrop-blur-sm">
                      {a.tag}
                    </span>
                    <span className="absolute bottom-3 right-3 bg-black/20 text-white/80 text-[10px] font-inter px-2 py-0.5 rounded-md">
                      {a.read}
                    </span>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="text-xs text-mid-gray font-inter mb-2">📅 {a.date}</div>
                    <h2 className="font-poppins font-bold text-base text-charcoal leading-snug mb-2 group-hover:text-brand-blue transition-colors">
                      {a.title}
                    </h2>
                    <p className="text-sm text-mid-gray font-inter leading-relaxed mb-4 line-clamp-3 flex-1">{a.excerpt}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-[12px] text-mid-gray font-inter">{a.author}</span>
                      <span className="text-brand-blue font-poppins font-bold text-sm">Read →</span>
                    </div>
                  </div>
                </article>
              </Link>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-mid-gray font-inter py-20">No articles in this category yet.</p>
        )}
      </div>
    </div>
  )
}
