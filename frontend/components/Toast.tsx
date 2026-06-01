'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { useToast } from '@/store'

export default function Toast() {
  const { message, visible, icon } = useToast()
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="toast"
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.9 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2 bg-[#1e1e2e] text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-semibold font-poppins"
        >
          <span className="text-green-400 text-base">{icon}</span>
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
