// Reusable payment method badges — used in Footer and CartDrawer
// size="sm" → compact row for cart; size="md" → full footer strip

interface Props {
  size?: 'sm' | 'md'
  theme?: 'light' | 'dark'   // dark = on charcoal footer, light = on white drawer
}

export default function PaymentBadges({ size = 'md', theme = 'dark' }: Props) {
  const h    = size === 'sm' ? 'h-7'  : 'h-9'
  const px   = size === 'sm' ? 'px-2' : 'px-3'
  const text = size === 'sm' ? 'text-[9px]' : 'text-[10px]'

  return (
    <div className="flex flex-wrap gap-2 items-center">

      {/* ── Visa ── */}
      <div
        className={`flex items-center justify-center ${h} ${px} rounded-md bg-white shadow-sm`}
        style={{ minWidth: size === 'sm' ? 42 : 52 }}
        aria-label="Visa"
      >
        <svg viewBox="0 0 78 25" className={size === 'sm' ? 'h-3.5' : 'h-4'}>
          <rect width="78" height="25" rx="4" fill="white"/>
          <text
            x="5" y="19"
            fontFamily="Arial,sans-serif" fontWeight="900" fontStyle="italic"
            fontSize="20" fill="#1A1F71" letterSpacing="-1"
          >VISA</text>
        </svg>
      </div>

      {/* ── Mastercard ── */}
      <div
        className={`flex items-center justify-center gap-1.5 ${h} ${px} rounded-md bg-white shadow-sm`}
        style={{ minWidth: size === 'sm' ? 42 : 56 }}
        aria-label="Mastercard"
      >
        <div className="relative flex items-center" style={{ width: 28, height: 18 }}>
          <div className="absolute left-0 w-[18px] h-[18px] rounded-full bg-[#EB001B]" />
          <div className="absolute left-[10px] w-[18px] h-[18px] rounded-full bg-[#F79E1B] opacity-90" />
        </div>
        {size === 'md' && (
          <span className={`font-bold text-[#1e1e2e] ${text} leading-none`} style={{ fontFamily: 'Arial,sans-serif' }}>
            mastercard
          </span>
        )}
      </div>

      {/* ── Amex ── */}
      <div
        className={`flex items-center justify-center ${h} ${px} rounded-md shadow-sm`}
        style={{ minWidth: size === 'sm' ? 42 : 52, background: '#016FD0' }}
        aria-label="American Express"
      >
        <svg viewBox="0 0 60 18" className={size === 'sm' ? 'h-3' : 'h-3.5'}>
          <text
            x="1" y="14"
            fontFamily="Arial,sans-serif" fontWeight="800"
            fontSize="14" fill="white" letterSpacing="2"
          >AMEX</text>
        </svg>
      </div>

      {/* ── JazzCash ── */}
      <div
        className={`flex items-center justify-center gap-1 ${h} ${px} rounded-md shadow-sm`}
        style={{ minWidth: size === 'sm' ? 54 : 68, background: 'linear-gradient(135deg,#BF0000,#E4002B)' }}
        aria-label="JazzCash"
      >
        {/* J-circle mark */}
        <div className={`${size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} rounded-full bg-white/20 flex items-center justify-center shrink-0`}>
          <span className={`text-white font-black ${size === 'sm' ? 'text-[7px]' : 'text-[8px]'}`} style={{ fontFamily: 'Arial,sans-serif' }}>J</span>
        </div>
        <span className={`font-bold text-white ${text} tracking-wide`} style={{ fontFamily: 'Arial,sans-serif' }}>
          JazzCash
        </span>
      </div>

      {/* ── Easypaisa ── */}
      <div
        className={`flex items-center justify-center gap-1 ${h} ${px} rounded-md shadow-sm`}
        style={{ minWidth: size === 'sm' ? 60 : 76, background: '#1DB05A' }}
        aria-label="Easypaisa"
      >
        {/* EP leaf/check mark */}
        <svg
          viewBox="0 0 14 14"
          className={`${size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} shrink-0`}
          fill="none"
        >
          <circle cx="7" cy="7" r="6.5" stroke="white" strokeWidth="1.2" fill="white" fillOpacity="0.15"/>
          <path d="M4 7.2 L6.2 9.5 L10 5" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className={`font-bold text-white ${text} tracking-wide`} style={{ fontFamily: 'Arial,sans-serif' }}>
          Easypaisa
        </span>
      </div>

      {/* ── Cash on Delivery ── */}
      <div
        className={`flex items-center justify-center gap-1 ${h} ${px} rounded-md shadow-sm
          ${theme === 'dark' ? 'bg-white/10 border border-white/20' : 'bg-gray-100 border border-gray-200'}`}
        style={{ minWidth: size === 'sm' ? 60 : 80 }}
        aria-label="Cash on Delivery"
      >
        <svg
          viewBox="0 0 16 16"
          className={`${size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} shrink-0`}
          fill="none"
          stroke={theme === 'dark' ? 'white' : '#374151'}
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="1" y="4" width="14" height="9" rx="1.5"/>
          <circle cx="8" cy="8.5" r="2"/>
          <path d="M4 4V3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v1"/>
        </svg>
        <span
          className={`font-semibold ${text} whitespace-nowrap ${theme === 'dark' ? 'text-white/80' : 'text-gray-600'}`}
          style={{ fontFamily: 'Arial,sans-serif' }}
        >
          {size === 'sm' ? 'COD' : 'Cash on Delivery'}
        </span>
      </div>

    </div>
  )
}
