'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { getAllArticles } from '@/lib/articles'

export default function Articles() {
  const ARTICLES = getAllArticles().slice(0, 6)

  return (
    <section className="py-14 bg-white">
      <div className="w-[92%] max-w-[1280px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-poppins font-black text-2xl tracking-tight gradient-text-brand">Health Advice &amp; Expert Tips</h2>
            <p className="text-mid-gray font-inter text-sm mt-1">Evidence-based articles written by our pharmacists</p>
          </div>
          <Link href="/articles" className="text-brand-blue font-semibold text-sm font-inter hover:underline hidden sm:block">
            All Articles →
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {ARTICLES.map((a, i) => (
            <Link href={`/articles/${a.slug}`} key={a.slug}>
              <motion.article
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -6, transition: { duration: 0.35, ease: [0.32, 0.72, 0, 1] } }}
                className="bg-white rounded-[20px] overflow-hidden shadow-[0_4px_28px_rgba(26,63,212,.08)] hover:shadow-[0_16px_48px_rgba(26,63,212,.16)] transition-all duration-500 cursor-pointer group ring-1 ring-black/[0.04]"
              >
                <div className={`h-36 bg-gradient-to-br ${a.gradient} flex items-center justify-center text-6xl relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10" />
                  <span className="relative z-10">{a.emoji}</span>
                  <span className="absolute top-3 left-3 bg-white/20 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg font-poppins backdrop-blur-sm">
                    {a.tag}
                  </span>
                  <span className="absolute bottom-3 right-3 bg-black/20 text-white/80 text-[10px] font-inter px-2 py-0.5 rounded-md">
                    {a.read}
                  </span>
                </div>
                <div className="p-5">
                  <div className="text-xs text-mid-gray font-inter mb-2.5">📅 {a.date}</div>
                  <h3 className="font-poppins font-bold text-base text-charcoal leading-snug mb-2 group-hover:text-brand-blue transition-colors">
                    {a.title}
                  </h3>
                  <p className="text-sm text-mid-gray font-inter leading-relaxed mb-4 line-clamp-3">{a.excerpt}</p>
                  <span className="inline-flex items-center gap-1 text-brand-blue font-poppins font-bold text-sm hover:underline">
                    Read Article →
                  </span>
                </div>
              </motion.article>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8 sm:hidden">
          <Link href="/articles" className="text-brand-blue font-semibold text-sm font-inter hover:underline">All Articles →</Link>
        </div>
      </div>
    </section>
  )
}
