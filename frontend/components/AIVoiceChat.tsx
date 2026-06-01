'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart, useWishlist, useAuth, useSearch, useToast } from '@/store'

// Chat Log Type
type Message = {
  sender: 'user' | 'ai'
  text: string
  timestamp: Date
}

// Dialog Match Rules
const DIALOG_RULES = [
  // Clinical Matches (Pre-routed for premium pharmaceutical intelligence)
  {
    keywords: ['pain', 'ache', 'backache', 'joint', 'hurt', 'brufen', 'ibuprofen', 'inflammation', 'injury', 'panadol', 'dard', 'takleef'],
    action: 'search',
    searchPayload: 'Brufen',
    reply: () => "For pain relief and inflammation, Brufen 400mg Tablets by Abbott (Rs. 180) are highly effective and clinically trusted. I have updated the catalog to show Brufen. If you experience severe pain, please consult your doctor immediately."
  },
  {
    keywords: ['dry skin', 'moisturiser', 'cream', 'cerave', 'eczema', 'hydration', 'skin barrier', 'khushki', 'jild'],
    action: 'search',
    searchPayload: 'CeraVe',
    reply: () => "For dry skin and compromised skin barrier, I highly recommend CeraVe Moisturising Cream 250ml (Rs. 1,850). It contains 3 essential ceramides and hyaluronic acid. I have listed all CeraVe dermatological products on your screen."
  },
  {
    keywords: ['acne', 'pimples', 'face wash', 'cleanse', 'oily skin', 'foaming cleanser', 'himalaya', 'neem', 'daane', 'muhase'],
    action: 'search',
    searchPayload: 'Cleanser',
    reply: () => "For acne and deep skin purification, Himalaya Neem Face Wash (Rs. 420) uses natural neem and turmeric to combat breakouts. Alternatively, CeraVe Foaming Facial Cleanser (Rs. 1,650) is excellent for oily skin. Both are now visible in the catalog."
  },
  {
    keywords: ['diabetes', 'sugar', 'glucose', 'insulin', 'accu-chek', 'monitor', 'test kit', 'cheeni'],
    action: 'search',
    searchPayload: 'Accu-Chek',
    reply: () => "Managing blood sugar is vital. The Accu-Chek Instant Glucose Monitor Kit (Rs. 4,500) provides precise readings in 4 seconds. I have displayed the Accu-Chek kit on your screen, and we can also schedule a home blood collection with Dow Lab."
  },
  {
    keywords: ['blood pressure', 'hypertension', 'bp monitor', 'heart', 'philips', 'cardiovascular', 'dil', 'pressure'],
    action: 'search',
    searchPayload: 'Philips',
    reply: () => "For regular blood pressure tracking at home, the Philips Upper Arm BP Monitor (Rs. 7,800) is clinically validated and offers irregular heartbeat detection. I have displayed this monitor for you."
  },
  {
    keywords: ['vitamin', 'multivitamin', 'centrum', 'fatigue', 'weakness', 'zinc', 'calcium', 'effervescent', 'kamzori', 'taqat'],
    action: 'search',
    searchPayload: 'Centrum',
    reply: () => "To address fatigue and daily nutritional gaps, Centrum Adults Complete (Rs. 980) or Centrum Silver Adults 50+ (Rs. 2,100) are excellent daily choices. Pfizer Vitamin C 1000mg Effervescent (Rs. 375) is also perfect for seasonal immunity. I have loaded our entire multivitamin catalog."
  },
  {
    keywords: ['baby formula', 'infant', 'milk', 'aptamil', 'baby care', 'nappy', 'toddler', 'bacha', 'doodh'],
    action: 'search',
    searchPayload: 'Aptamil',
    reply: () => "For infant nutrition, Aptamil Stage 1 Infant Formula 400g (Rs. 3,200) is clinically researched and enriched with DHA and prebiotics. I have highlighted our baby care inventory for you."
  },
  {
    keywords: ['omega', 'fish oil', 'heart health', 'cholesterol', 'brain support', 'nature', 'machli', 'tel'],
    action: 'search',
    searchPayload: 'Omega-3',
    reply: () => "High-quality Nature's Way Omega-3 Fish Oil 1000mg (Rs. 1,650) provides essential EPA & DHA to support cardiovascular, cognitive, and joint health. I have displayed our wellness supplements."
  },
  {
    keywords: ['fever', 'temperature', 'thermometer', 'hot', 'cold and flu', 'bukhaar', 'garam'],
    action: 'search',
    searchPayload: 'Thermometer',
    reply: () => "If you have a fever, tracking temperature accurately is crucial. The Dr. Morepen Digital Thermometer Pro (Rs. 640) provides fast 10-second readings. I have listed the thermometer and cold relief products. Rest well and stay hydrated!"
  },
  // Structural Navigation & Directives
  {
    keywords: ['search', 'find', 'look for', 'show me', 'buy', 'get', 'dhundo', 'dikhao'],
    action: 'search',
    reply: (match: string) => `I have searched our pharmacy catalog for ${match}. The updated results are displayed on the main screen.`
  },
  {
    keywords: ['open cart', 'show cart', 'view cart', 'my cart', 'shopping cart', 'tokri'],
    action: 'open_cart',
    reply: () => "I'm opening your shopping cart right now."
  },
  {
    keywords: ['close cart', 'hide cart', 'band'],
    action: 'close_cart',
    reply: () => "Closing your shopping cart."
  },
  {
    keywords: ['clear cart', 'empty cart', 'clear my cart', 'khali'],
    action: 'clear_cart',
    reply: () => "I have emptied all products from your shopping cart."
  },
  {
    keywords: ['open wishlist', 'show wishlist', 'view wishlist', 'my wishlist', 'pasand'],
    action: 'open_wishlist',
    reply: () => "Opening your favorites and wishlist drawer."
  },
  {
    keywords: ['close wishlist', 'hide wishlist'],
    action: 'close_wishlist',
    reply: () => "Closing your wishlist drawer."
  },
  {
    keywords: ['book doctor', 'consultation', 'speak to doctor', 'online doctor', 'clinic doctor', 'video consultation', 'appointment', 'milna'],
    action: 'book_consultation',
    reply: () => "Certainly! I've opened our clinical consultation scheduler so you can secure a video session with a certified doctor."
  },
  {
    keywords: ['dow lab', 'blood test', 'lab test', 'lipid profile', 'hba1c', 'cholesterol test', 'test collection', 'khoon'],
    action: 'book_lab_test',
    reply: () => "I am opening the Dow Lab partnership test selector. A certified medical collector will visit your home for sample extraction."
  },
  {
    keywords: ['prescription', 'upload prescription', 'arrange medicine', 'send prescription', 'send rx', 'nuskha', 'parchi'],
    action: 'book_prescription',
    reply: () => "Opening our premium prescription sourcing portal. You can upload any prescription and we will arrange your medicines immediately."
  },
  {
    keywords: ['login', 'sign in', 'register', 'sign up', 'my account', 'clerk', 'daakhil'],
    action: 'open_auth',
    reply: () => "Opening our secure user authentication panel."
  },
  {
    keywords: ['location', 'address', 'where are you', 'branches', 'karachi', 'office', 'pata', 'kahan'],
    reply: () => "Hussain Healthcare is centered in Gulshan-e-Iqbal, Karachi. We provide standard home delivery across Karachi within 2 hours, and free shipping for orders exceeding Rs. 5,000!"
  },
  {
    keywords: ['phone', 'contact', 'whatsapp', 'helpline', 'number', 'baat'],
    reply: () => "You can reach us directly at our Karachi helpline 0311-113292, or tap the green WhatsApp desk icon next to me for direct chat."
  },
  {
    keywords: ['delivery', 'shipping', 'cost', 'fee', 'charge', 'kharcha'],
    reply: () => "Delivery is free throughout Karachi for all orders above Rs. 5,000! For orders under Rs. 5,000, our flat shipping rate is Rs. 200."
  },
  {
    keywords: ['return', 'refund', 'exchange', 'policy', 'returns', 'wapasi'],
    reply: () => "We offer a 7-day hassle-free return and refund policy for unsealed medicines and general health products. Let me know if you would like me to guide you to the Returns page."
  },
  {
    keywords: ['hello', 'hi', 'hey', 'greetings', 'anyone there', 'salam', 'adaab'],
    reply: () => "Hello! I am Aara, your AI Health Companion from Hussain Healthcare. Speak or type to ask me to search for products, manage your cart, or book lab tests!"
  }
]

export default function AIVoiceChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [inputText, setInputText] = useState('')
  const [chatLog, setChatLog] = useState<Message[]>([
    {
      sender: 'ai',
      text: "Hello! I'm Aara, your AI Clinical Companion. Ask me to find medicines, open your cart, or book an online doctor!",
      timestamp: new Date()
    }
  ])
  const [mounted, setMounted] = useState(false)
  const [voiceSupported, setVoiceSupported] = useState(false)
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])

  // Zustand Store integrations
  const cart = useCart()
  const wl = useWishlist()
  const auth = useAuth()
  const search = useSearch()
  const toast = useToast()

  const chatEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Use refs to avoid stale closures in event callbacks
  const handleQueryRef = useRef<(q: string) => void>()
  const speakTextRef = useRef<(t: string) => void>()

  // Text-To-Speech function with Chrome thread fix & Garbage Collection protection
  function speakText(text: string) {
    if (typeof window === 'undefined' || !window.speechSynthesis || isMuted) return
    
    window.speechSynthesis.cancel()
    setIsSpeaking(false)

    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text)
      activeUtteranceRef.current = utterance
      
      const voices = availableVoices.length ? availableVoices : window.speechSynthesis.getVoices()
      const selectedVoice = voices.find(
        v => v.name.includes('Google UK English Female') || 
             v.name.includes('Google US English') ||
             v.name.includes('Female') || 
             v.lang.startsWith('en')
      )

      if (selectedVoice) utterance.voice = selectedVoice
      utterance.pitch = 1.05
      utterance.rate = 0.98

      utterance.onstart = () => setIsSpeaking(true)
      const resetSpeaking = () => { setIsSpeaking(false); activeUtteranceRef.current = null }
      utterance.onend = resetSpeaking
      utterance.onerror = (err) => { console.error('Speech synthesis error:', err); resetSpeaking() }

      window.speechSynthesis.speak(utterance)
    }, 50)
  }

  // Core Dialogue Handler
  function handleUserQuery(query: string) {
    if (!query.trim()) return

    const userMsg: Message = { sender: 'user', text: query, timestamp: new Date() }
    setChatLog(prev => [...prev, userMsg])

    let aiResponse = "I'm sorry, I couldn't fully process that medical inquiry. Please feel free to ask me to search for medicines, open your cart, or book consultations."
    const cleanQuery = query.toLowerCase().trim()

    let matched = false
    for (const rule of DIALOG_RULES) {
      const hit = rule.keywords.find(kw => cleanQuery.includes(kw))
      if (hit) {
        matched = true
        let payload = ''
        
        if (rule.action === 'search') {
          if ((rule as any).searchPayload) {
            payload = (rule as any).searchPayload
          } else {
            const idx = cleanQuery.indexOf(hit)
            const searchPart = query.substring(idx + hit.length).trim()
            payload = searchPart || 'medicine'
          }
          search.setQuery(payload)
          aiResponse = typeof rule.reply === 'function' ? (rule.reply as any)(payload) : rule.reply
        } else if (rule.action === 'open_cart') {
          cart.openCart(); aiResponse = rule.reply('')
        } else if (rule.action === 'close_cart') {
          cart.closeCart(); aiResponse = rule.reply('')
        } else if (rule.action === 'clear_cart') {
          cart.clearCart(); aiResponse = rule.reply('')
        } else if (rule.action === 'open_wishlist') {
          wl.openWishlist(); aiResponse = rule.reply('')
        } else if (rule.action === 'close_wishlist') {
          wl.closeWishlist(); aiResponse = rule.reply('')
        } else if (rule.action === 'book_consultation') {
          window.dispatchEvent(new CustomEvent('open-booking-modal', { detail: 'consultation' }))
          aiResponse = rule.reply('')
        } else if (rule.action === 'book_lab_test') {
          window.dispatchEvent(new CustomEvent('open-booking-modal', { detail: 'lab_test' }))
          aiResponse = rule.reply('')
        } else if (rule.action === 'book_prescription') {
          window.dispatchEvent(new CustomEvent('open-booking-modal', { detail: 'prescription_delivery' }))
          aiResponse = rule.reply('')
        } else if (rule.action === 'open_auth') {
          auth.openAuth('login'); aiResponse = rule.reply('')
        } else {
          aiResponse = (rule.reply as any)('')
        }
        break
      }
    }

    if (!matched && cleanQuery.length > 2 && !cleanQuery.includes('what') && !cleanQuery.includes('how') && !cleanQuery.includes('where')) {
      search.setQuery(query)
      aiResponse = `Searching for "${query}" in our pharmacy catalog. Please check the central layout for live matching products.`
    }

    setTimeout(() => {
      const aiMsg: Message = { sender: 'ai', text: aiResponse, timestamp: new Date() }
      setChatLog(prev => [...prev, aiMsg])
      speakTextRef.current?.(aiResponse)
    }, 450)
  }

  // Update refs to latest handlers
  useEffect(() => {
    handleQueryRef.current = handleUserQuery
    speakTextRef.current = speakText
  })

  // Check speech recognition support
  useEffect(() => {
    setMounted(true)

    if (typeof window === 'undefined') return

    // Pre-load SpeechSynthesis voices
    if (window.speechSynthesis) {
      const loadVoices = () => {
        setAvailableVoices(window.speechSynthesis.getVoices())
      }
      loadVoices()
      window.speechSynthesis.onvoiceschanged = loadVoices
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (SpeechRecognition) {
      setVoiceSupported(true)
      const rec = new SpeechRecognition()
      rec.continuous = false
      rec.interimResults = true
      rec.lang = 'en-US'

      rec.onstart = () => {
        setIsListening(true)
        if (window.speechSynthesis) window.speechSynthesis.cancel()
      }

      rec.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => (result as any)[0])
          .map((result: any) => result.transcript)
          .join('')
        
        if (event.results[0].isFinal) {
          handleQueryRef.current?.(transcript)
        }
      }

      rec.onerror = (e: any) => {
        setIsListening(false)
        console.error('Speech recognition error:', e.error)
        
        const errorMessages: Record<string, string> = {
          'not-allowed': 'Microphone access denied. Please enable it in browser settings.',
          'network': 'Network error. Speech recognition requires an internet connection.',
          'no-speech': 'No speech detected. Please try speaking again.',
          'service-not-allowed': 'Speech service not allowed. This might require HTTPS.'
        }
        
        if (e.error !== 'no-speech') {
          toast.show(errorMessages[e.error] || `Voice error: ${e.error}`, '⚠️')
        }
      }

      rec.onend = () => setIsListening(false)
      recognitionRef.current = rec
    }
  }, [availableVoices.length])

  // Auto-scroll chat log
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chatLog, isOpen])

  // Speak microphone activation
  function toggleListening() {
    if (!voiceSupported) {
      toast.show('Speech recognition is not supported on this browser.', '⚠️')
      return
    }
    if (isListening) {
      recognitionRef.current.stop()
    } else {
      try {
        recognitionRef.current.start()
      } catch (err) {
        console.error('Failed to start speech recognition', err)
      }
    }
  }

  // Keyboard Submission
  function handleTextSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!inputText.trim()) return
    handleUserQuery(inputText)
    setInputText('')
  }

  if (!mounted) return null

  return (
    <div className="fixed bottom-6 right-24 z-[2000]">
      {/* Expanded AI Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="absolute bottom-20 right-0 w-[420px] max-w-[calc(100vw-2rem)] p-2 rounded-[2.5rem] bg-[#1a3fd4]/8 border border-[#1a3fd4]/20 shadow-[0_24px_50px_rgba(26,63,212,0.18)] backdrop-blur-xl z-[2100]"
            style={{ transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)' }}
          >
            {/* Concentric Double-Bezel Inner Core (Dark OLED theme) */}
            <div className="bg-[#0a0a0d] text-white rounded-[calc(2.5rem-0.5rem)] overflow-hidden shadow-2xl border border-white/5 flex flex-col h-[520px]">
              
              {/* Header */}
              <div 
                className="p-5 text-white flex items-center justify-between border-b border-white/5"
                style={{ background: 'linear-gradient(135deg, #0d1b4f, #1230a8)' }}
              >
                <div className="flex items-center gap-3.5">
                  {/* Glowing AI Orb Avatar */}
                  <div className="relative w-11 h-11 rounded-full border border-white/20 bg-black/40 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                    <div 
                      className="absolute inset-0.5 rounded-full animate-spin-slow opacity-80"
                      style={{ background: 'linear-gradient(135deg, #1230a8, #1a3fd4, #7b2d8b, #e066ff)' }}
                    />
                    <span className="relative z-10 text-sm">✨</span>
                    {/* Pulsing ring */}
                    <span className="absolute inset-0 rounded-full border border-[#7b2d8b]/50 animate-ping opacity-60" />
                  </div>
                  <div>
                    <h3 className="font-poppins font-extrabold text-sm tracking-tight text-white leading-tight">
                      Aara Health AI
                    </h3>
                    <p className="text-[10px] text-white/60 font-medium font-inter">
                      Karachi Pharmacy Virtual Guide
                    </p>
                  </div>
                </div>

                {/* Header Actions */}
                <div className="flex items-center gap-1.5">
                  {/* Mute Toggle */}
                  <button 
                    onClick={() => {
                      const next = !isMuted
                      setIsMuted(next)
                      if (next && window.speechSynthesis) window.speechSynthesis.cancel()
                      toast.show(next ? 'Speech Synthesis Muted' : 'Speech Synthesis Active', next ? '🔇' : '🔊')
                    }}
                    className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white text-xs transition duration-300 font-bold"
                    title={isMuted ? "Unmute Assistant" : "Mute Assistant"}
                  >
                    {isMuted ? '🔇' : '🔊'}
                  </button>
                  {/* Close Panel */}
                  <button 
                    onClick={() => {
                      setIsOpen(false)
                      if (window.speechSynthesis) window.speechSynthesis.cancel()
                    }}
                    className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white text-xs transition duration-300 font-bold"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Chat Log History */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
                {chatLog.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[85%] px-4 py-3 rounded-2xl text-[12px] leading-relaxed font-inter shadow-md
                        ${msg.sender === 'user' 
                          ? 'bg-[#1a3fd4] text-white rounded-tr-none' 
                          : 'bg-white/5 border border-white/5 text-white/95 rounded-tl-none'}`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Dynamic Kinetic Sound Visualizer Wave */}
              <div className="px-5 py-3 border-t border-white/5 bg-white/[0.01] flex items-center justify-center gap-3">
                <div className="flex items-center gap-1.5 h-6">
                  {/* Siri-like visualizer bars */}
                  {[...Array(5)].map((_, i) => (
                    <motion.span
                      key={i}
                      animate={
                        isListening 
                          ? { height: [6, 20, 6], scaleY: [1, 1.4, 1] } 
                          : isSpeaking 
                          ? { height: [6, 16, 6], scaleY: [1, 1.2, 1] }
                          : { height: 4, scaleY: 1 }
                      }
                      transition={{ 
                        repeat: Infinity, 
                        duration: isListening ? 0.6 + i * 0.1 : 0.8 + i * 0.1,
                        ease: 'easeInOut'
                      }}
                      className={`w-0.5 rounded-full block transition-colors
                        ${isListening ? 'bg-[#39ff14]' : isSpeaking ? 'bg-[#e066ff]' : 'bg-white/20'}`}
                    />
                  ))}
                </div>
                <p className="text-[10px] font-poppins font-bold tracking-widest text-white/40 uppercase">
                  {isListening ? 'Listening...' : isSpeaking ? 'Speaking Response...' : 'Aara AI Copilot'}
                </p>
              </div>

              {/* Controller Box (Mic + Text Input Area) */}
              <div className="p-4 bg-black/40 border-t border-white/5 flex items-center gap-3">
                {/* Microphone Button */}
                <motion.button
                  onClick={toggleListening}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  className={`w-12 h-12 rounded-full shrink-0 flex items-center justify-center shadow-lg transition duration-300 relative
                    ${isListening 
                      ? 'bg-[#39ff14]/15 border border-[#39ff14]/40 text-[#39ff14]' 
                      : 'bg-white/10 hover:bg-white/15 border border-white/10 text-white'}`}
                  title="Click to speak"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                    <line x1="12" x2="12" y1="19" y2="22"/>
                  </svg>
                  {isListening && (
                    <span className="absolute inset-0 rounded-full border border-[#39ff14] animate-ping opacity-75" />
                  )}
                </motion.button>

                {/* Text Fallback Form */}
                <form onSubmit={handleTextSubmit} className="flex-1 flex items-center bg-white/5 border border-white/10 rounded-full overflow-hidden px-4 py-1.5 focus-within:border-[#1a3fd4] transition">
                  <input
                    type="text"
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    placeholder={isListening ? "Listening to your voice..." : "Type custom health query..."}
                    disabled={isListening}
                    className="flex-1 bg-transparent border-none outline-none text-[12px] font-inter text-white placeholder-white/40"
                  />
                  <button 
                    type="submit" 
                    disabled={isListening}
                    className="w-8 h-8 rounded-full bg-[#1a3fd4] hover:bg-[#1230a8] flex items-center justify-center text-white transition shrink-0 shadow-md active:scale-95 disabled:opacity-40"
                  >
                    →
                  </button>
                </form>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating breathing AI Orb Trigger */}
      <motion.button
        onClick={() => {
          setIsOpen(!isOpen)
          if (isOpen && window.speechSynthesis) window.speechSynthesis.cancel()
        }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        animate={isOpen ? { rotate: 180 } : { rotate: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-[0_6px_25px_rgba(26,63,212,.4)] group focus:outline-none relative"
        style={{ 
          background: 'linear-gradient(135deg, #1230a8, #1a3fd4, #7b2d8b)',
          border: '1px solid rgba(255,255,255,0.15)'
        }}
        title="Open Hussain AI Assistant"
      >
        {/* Breathing animated radial rings */}
        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#1230a8] to-[#7b2d8b] animate-pulse opacity-45 pointer-events-none scale-105" />
        
        <div className="relative">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" x2="12" y1="19" y2="22"/>
          </svg>
          <span className="absolute -top-1.5 -right-1.5 w-2 h-2 rounded-full bg-[#39ff14] animate-ping" />
        </div>
      </motion.button>
    </div>
  )
}
