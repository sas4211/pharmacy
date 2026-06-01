'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '@/store'
import { prescriptionsApi } from '@/lib/api'
import type { Prescription } from '@/types'

const STATUS_STYLES: Record<string, string> = {
  approved:  'bg-green-100 text-green-700',
  reviewing: 'bg-amber-100 text-amber-700',
  pending:   'bg-amber-100 text-amber-700',
  expired:   'bg-red-100 text-red-700',
  rejected:  'bg-red-100 text-red-700',
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-PK', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function PrescriptionsPage() {
  const [dragging,  setDragging]  = useState(false)
  const [uploading, setUploading] = useState(false)
  const [rxList,    setRxList]    = useState<Prescription[]>([])
  const [loading,   setLoading]   = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const toast = useToast()

  useEffect(() => {
    prescriptionsApi.list().then(r => {
      if (r.ok && Array.isArray(r.data)) setRxList(r.data as Prescription[])
      setLoading(false)
    })
  }, [])

  async function handleFile(file: File) {
    if (!file) return
    setUploading(true)
    toast.show('Uploading prescription…', '⏳')
    const res = await prescriptionsApi.upload(file)
    setUploading(false)
    if (res.ok) {
      toast.show('Prescription uploaded! A pharmacist will review it within 2 hours. ✓')
      // Refresh list
      prescriptionsApi.list().then(r => {
        if (r.ok && Array.isArray(r.data)) setRxList(r.data as Prescription[])
      })
    } else {
      toast.show(res.detail ?? 'Upload failed — please try again', '✕')
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault(); setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-poppins font-extrabold text-2xl text-charcoal">My Prescriptions</h1>
        <p className="text-mid-gray font-inter text-sm mt-0.5">Upload and manage your prescriptions securely</p>
      </div>

      {/* Upload zone */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          dragging ? 'border-brand-blue bg-blue-50' : 'border-gray-200 bg-white hover:border-brand-blue hover:bg-blue-50/50'
        }`}
      >
        <input ref={inputRef} type="file" accept="image/*,application/pdf" className="hidden"
          onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        {uploading ? (
          <div className="space-y-2">
            <div className="w-10 h-10 border-3 border-brand-blue border-t-transparent rounded-full animate-spin mx-auto" style={{ borderWidth: 3 }} />
            <p className="font-poppins font-semibold text-brand-blue text-sm">Uploading…</p>
          </div>
        ) : (
          <>
            <div className="w-14 h-14 bg-brand-blue/10 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3">📤</div>
            <p className="font-poppins font-bold text-[15px] text-charcoal">Drop prescription here or click to upload</p>
            <p className="text-sm text-mid-gray font-inter mt-1">Accepts JPG, PNG, PDF — up to 10MB</p>
            <p className="text-xs text-brand-blue font-inter mt-2 font-semibold">🔒 Encrypted & HIPAA-compliant storage</p>
          </>
        )}
      </motion.div>

      {/* Prescription list */}
      <div>
        <h2 className="font-poppins font-bold text-[15px] text-charcoal mb-3">Prescription History</h2>

        {loading ? (
          <div className="space-y-3">
            {[0,1,2].map(i => <div key={i} className="h-20 bg-white rounded-2xl animate-pulse shadow-sm" />)}
          </div>
        ) : rxList.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
            <span className="text-4xl">📋</span>
            <p className="font-poppins font-bold text-charcoal mt-3">No prescriptions yet</p>
            <p className="text-mid-gray font-inter text-sm mt-1">Upload your first prescription above</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {rxList.map((rx, i) => {
                const statusKey   = rx.status.toLowerCase()
                const statusLabel = rx.status.charAt(0).toUpperCase() + rx.status.slice(1)

                return (
                  <motion.div
                    key={rx.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="bg-white rounded-2xl p-4 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow"
                  >
                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-xl shrink-0">📋</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <p className="font-poppins font-bold text-[13px] text-charcoal">#RX-{rx.id}</p>
                          <p className="text-sm font-inter text-mid-gray truncate">{rx.original_filename}</p>
                        </div>
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${STATUS_STYLES[statusKey] ?? 'bg-gray-100 text-gray-600'}`}>
                          {statusLabel}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <span className="text-[11px] text-mid-gray font-inter">📅 {fmtDate(rx.created_at)}</span>
                      </div>
                      {rx.notes && (
                        <p className="text-[12px] font-inter text-mid-gray mt-1">📝 {rx.notes}</p>
                      )}
                      {rx.pharmacist_notes && (
                        <p className="text-[12px] font-inter text-brand-blue mt-1">ℹ️ {rx.pharmacist_notes}</p>
                      )}
                      {!rx.pharmacist_notes && statusKey === 'pending' && (
                        <p className="text-[12px] font-inter text-amber-600 mt-1">⏳ Under review by pharmacist</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5 shrink-0">
                      {statusKey === 'approved' && (
                        <button className="text-[11px] bg-brand-blue text-white font-poppins font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-700 transition">
                          Reorder
                        </button>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Info card */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-3">
        <span className="text-2xl shrink-0">ℹ️</span>
        <div>
          <p className="font-poppins font-bold text-[13px] text-blue-800">How prescriptions work</p>
          <p className="text-sm font-inter text-blue-700 mt-0.5 leading-relaxed">
            Upload a clear photo or scan of your prescription. Our licensed pharmacist reviews it within 2 hours. Once approved, medicines can be dispensed. Prescriptions are stored securely and can be reused within their validity period.
          </p>
        </div>
      </div>
    </div>
  )
}
