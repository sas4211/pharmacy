import Link from 'next/link'

const SERVICES = [
  {
    title: 'Free Delivery',
    desc: 'On orders above Rs. 5,000 across Karachi',
    svgIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="1" y="3" width="15" height="13" rx="2" ry="2" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    )
  },
  {
    title: 'Express Delivery',
    desc: 'Priority dispatch in under 45 minutes',
    svgIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    )
  },
  {
    title: 'Arrange For Me',
    desc: 'Sourcing of rare and import prescription medicines',
    svgIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M16 13H8M16 17H8M10 9H8" />
      </svg>
    )
  },
  {
    title: 'Dow Lab Partner',
    desc: 'Diagnostic testing with home sample collection',
    svgIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M4.5 16.5c-1.5 1.26-2.5 3.19-2.5 5.5h20c0-2.31-1-4.24-2.5-5.5" />
        <path d="M12 2v10M8 5h8" />
        <circle cx="12" cy="9" r="3" />
      </svg>
    )
  },
  {
    title: '7-Day Returns',
    desc: 'Hassle-free returns on eligible unsealed products',
    href: '/returns',
    svgIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <polyline points="3 3 3 8 8 8" />
      </svg>
    )
  },
]

export default function ServicesStrip() {
  return (
    <section className="py-16 bg-[#FAF9F6] border-y border-black/[0.05] relative overflow-hidden">
      <div className="w-[92%] max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {SERVICES.map(s => {
            const inner = (
              <div 
                className="flex items-center gap-5 bg-white rounded-[24px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.03)] hover:shadow-[0_24px_56px_rgba(18,48,168,0.08)] border border-black/[0.04] transition-all duration-700 h-full group select-none"
                style={{ transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)' }}
              >
                {/* Micro-Double Bezel Icon Enclosure */}
                <div className="rounded-[16px] p-0.5 bg-black/[0.02] border border-black/[0.05] group-hover:border-blue-600/10 transition-colors duration-500">
                  <div className="w-12 h-12 rounded-[14px] bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-all duration-700 scale-100 group-hover:scale-105 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]">
                    {s.svgIcon}
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-poppins font-black text-sm text-charcoal tracking-tight leading-none group-hover:text-blue-700 transition-colors duration-500">
                    {s.title}
                  </h4>
                  <p className="text-[11px] text-mid-gray font-inter mt-2 leading-snug">
                    {s.desc}
                  </p>
                </div>
              </div>
            )
            return s.href ? (
              <Link href={s.href} key={s.title} className="no-underline block h-full">{inner}</Link>
            ) : (
              <div key={s.title} className="h-full">{inner}</div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
