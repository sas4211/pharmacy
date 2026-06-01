'use client'
import { UserProfile } from '@clerk/nextjs'
import { motion } from 'framer-motion'

export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div>
        <h1 className="font-poppins font-extrabold text-2xl text-charcoal">Account Settings</h1>
        <p className="text-mid-gray font-inter text-sm mt-0.5">Manage your profile, security, and preferences</p>
      </div>

      {/* Notification prefs */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-5 shadow-sm">
        <h2 className="font-poppins font-bold text-[15px] text-charcoal mb-4">Notification Preferences</h2>
        {[
          { label: 'Order updates & tracking',        sub: 'Get notified when your order status changes', on: true },
          { label: 'Prescription status',             sub: 'Alerts when your prescription is reviewed', on: true },
          { label: 'Medicine refill reminders',       sub: 'Reminded 7 days before your medicines run out', on: true },
          { label: 'Health appointment reminders',    sub: '24 hour reminder before each appointment', on: true },
          { label: 'Promotional offers',              sub: 'Flash sales, discounts and new products', on: false },
          { label: 'Health tips & articles',          sub: 'Weekly pharmacist-written health advice', on: false },
        ].map((n, i) => (
          <div key={n.label} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
            <div>
              <p className="font-poppins font-semibold text-[13px] text-charcoal">{n.label}</p>
              <p className="text-xs text-mid-gray font-inter">{n.sub}</p>
            </div>
            <div className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${n.on ? 'bg-brand-blue' : 'bg-gray-200'}`}>
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${n.on ? 'left-5' : 'left-0.5'}`} />
            </div>
          </div>
        ))}
      </motion.div>

      {/* Delivery address */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-poppins font-bold text-[15px] text-charcoal">Saved Addresses</h2>
          <button className="text-xs text-brand-blue font-poppins font-bold hover:underline">+ Add New</button>
        </div>
        {[
          { label: 'Home', addr: 'House 14, Block 5, Clifton, Karachi', default: true },
          { label: 'Office', addr: 'Suite 204, Dolmen Mall, Clifton, Karachi', default: false },
        ].map(a => (
          <div key={a.label} className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
            <span className="text-xl mt-0.5">{a.label === 'Home' ? '🏠' : '🏢'}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-poppins font-semibold text-[13px] text-charcoal">{a.label}</p>
                {a.default && <span className="text-[10px] bg-brand-blue text-white px-2 py-0.5 rounded-full font-bold">Default</span>}
              </div>
              <p className="text-xs text-mid-gray font-inter">{a.addr}</p>
            </div>
            <button className="text-xs text-mid-gray hover:text-brand-blue font-inter">Edit</button>
          </div>
        ))}
      </motion.div>

      {/* Clerk UserProfile for full account management */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="font-poppins font-bold text-[15px] text-charcoal mb-3">Profile & Security</h2>
        <UserProfile
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'shadow-sm rounded-2xl border-0',
              navbar: 'hidden',
              pageScrollBox: 'p-5',
            }
          }}
        />
      </motion.div>
    </div>
  )
}
