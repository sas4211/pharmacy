'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { type Article, type ArticleSection } from '@/lib/articles'

/* ─── Section renderers ─────────────────────────────────────────────────────── */
function Section({ s, i }: { s: ArticleSection; i: number }) {
  if (s.type === 'para') return (
    <motion.p
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 + i * 0.04 }}
      className="text-[17px] text-gray-700 leading-relaxed font-inter"
    >
      {s.content}
    </motion.p>
  )

  if (s.type === 'heading') return (
    <motion.h2
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.05 + i * 0.04 }}
      className="text-xl font-poppins font-bold text-charcoal mt-2 border-l-4 border-brand-blue pl-4"
    >
      {s.content}
    </motion.h2>
  )

  if (s.type === 'list') return (
    <motion.ul
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.05 + i * 0.04 }}
      className="space-y-2.5 pl-2"
    >
      {s.items?.map((item, j) => (
        <li key={j} className="flex gap-2.5 text-[16px] text-gray-700 font-inter leading-relaxed">
          <span className="mt-1.5 w-2 h-2 rounded-full bg-brand-blue shrink-0" />
          {item}
        </li>
      ))}
    </motion.ul>
  )

  if (s.type === 'tip') return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.05 + i * 0.04 }}
      className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-[15px] text-blue-800 font-inter leading-relaxed"
    >
      {s.content}
    </motion.div>
  )

  if (s.type === 'warning') return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.05 + i * 0.04 }}
      className="bg-amber-50 border border-amber-300 rounded-xl p-4 text-[15px] text-amber-900 font-inter leading-relaxed"
    >
      {s.content}
    </motion.div>
  )

  if (s.type === 'quote') return (
    <motion.blockquote
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 + i * 0.04 }}
      className="border-l-4 border-brand-blue pl-5 italic text-[17px] text-gray-600 font-inter leading-relaxed bg-gray-50 py-3 pr-4 rounded-r-xl"
    >
      {s.content}
    </motion.blockquote>
  )

  if (s.type === 'products') return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 + i * 0.04 }}
      className="bg-off-white rounded-2xl border border-gray-100 p-5 space-y-3"
    >
      <p className="text-xs font-poppins font-bold text-brand-blue uppercase tracking-wider mb-1">
        Pharmacist-Recommended Products
      </p>
      {s.products?.map((p, j) => (
        <div key={j} className="flex gap-4 items-start bg-white rounded-xl p-3.5 shadow-sm hover:shadow-md transition-shadow">
          <span className="text-3xl shrink-0">{p.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <p className="font-poppins font-semibold text-[14px] text-charcoal">{p.name}</p>
                <p className="text-xs text-mid-gray font-inter">{p.brand}</p>
              </div>
              <span className="font-poppins font-bold text-[14px] text-brand-blue whitespace-nowrap">{p.price}</span>
            </div>
            <p className="text-[13px] text-gray-500 font-inter mt-1 leading-snug">{p.why}</p>
          </div>
        </div>
      ))}
    </motion.div>
  )

  return null
}

/* ─── Related card ───────────────────────────────────────────────────────────── */
function RelatedCard({ a }: { a: Article }) {
  return (
    <Link href={`/articles/${a.slug}`}>
      <div className="flex gap-3 items-start group cursor-pointer py-3 border-b border-gray-100 last:border-0">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${a.gradient} flex items-center justify-center text-xl shrink-0`}>
          {a.emoji}
        </div>
        <div>
          <span className="text-[11px] font-poppins font-bold text-brand-blue uppercase tracking-wider">{a.tag}</span>
          <p className="text-[13px] font-inter font-medium text-charcoal leading-snug group-hover:text-brand-blue transition-colors line-clamp-2">
            {a.title}
          </p>
          <p className="text-[11px] text-mid-gray font-inter mt-0.5">{a.read}</p>
        </div>
      </div>
    </Link>
  )
}

/* ─── Main client component ─────────────────────────────────────────────────── */
export default function ArticleClient({ article, related }: { article: Article; related: Article[] }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero banner */}
      <div className={`bg-gradient-to-br ${article.gradient} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/25" />
        <div className="relative w-[92%] max-w-[1280px] mx-auto py-14 md:py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm font-inter mb-6 transition-colors"
            >
              ← Back to Home
            </Link>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-white/20 text-white text-[12px] font-bold px-3 py-1 rounded-full font-poppins backdrop-blur-sm">
                {article.tag}
              </span>
              <span className="bg-white/20 text-white text-[12px] font-inter px-3 py-1 rounded-full backdrop-blur-sm">
                {article.read}
              </span>
              <span className="bg-white/20 text-white text-[12px] font-inter px-3 py-1 rounded-full backdrop-blur-sm">
                📅 {article.date}
              </span>
            </div>
            <h1 className="font-poppins font-extrabold text-3xl md:text-4xl text-white leading-tight max-w-3xl mb-4">
              {article.title}
            </h1>
            <p className="text-white/80 font-inter text-[16px] max-w-2xl leading-relaxed mb-6">
              {article.excerpt}
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center text-lg font-bold text-white backdrop-blur-sm">
                {article.author.charAt(0)}
              </div>
              <div>
                <p className="text-white font-poppins font-semibold text-[14px]">{article.author}</p>
                <p className="text-white/70 font-inter text-[12px]">{article.authorRole}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Body */}
      <div className="w-[92%] max-w-[1280px] mx-auto py-12">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Article content */}
          <article className="flex-1 min-w-0 space-y-6">
            {article.sections.map((s, i) => (
              <Section key={i} s={s} i={i} />
            ))}

            {/* CTA strip */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div>
                <p className="font-poppins font-bold text-charcoal">Have a question for our pharmacist?</p>
                <p className="text-sm text-mid-gray font-inter">Free consultations available in-store or via WhatsApp.</p>
              </div>
              <a
                href="https://wa.me/923311113292"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-poppins font-bold text-sm px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap"
              >
                💬 Ask on WhatsApp
              </a>
            </motion.div>
          </article>

          {/* Sidebar */}
          <aside className="lg:w-72 shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="bg-off-white rounded-2xl p-5 border border-gray-100">
                <p className="font-poppins font-bold text-[13px] text-charcoal uppercase tracking-wider mb-3">
                  More Articles
                </p>
                {related.map(a => <RelatedCard key={a.slug} a={a} />)}
              </div>

              <div className="bg-brand-blue rounded-2xl p-5 text-white">
                <p className="font-poppins font-bold text-[15px] mb-1">Free Pharmacist Review</p>
                <p className="text-white/80 font-inter text-[13px] leading-relaxed mb-4">
                  Not sure which medicines or supplements are right for you? Our clinical pharmacists offer free 1-on-1 consultations.
                </p>
                <a
                  href="/book"
                  className="block text-center bg-white text-brand-blue font-poppins font-bold text-[13px] py-2 rounded-xl hover:bg-blue-50 transition-colors"
                >
                  Book Free Consultation
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
