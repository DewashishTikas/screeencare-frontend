'use client'

import { motion } from 'motion/react'

export default function Step3Address({ address, onUpdateAddress, onNext }) {
  const handleChange = (field, value) => {
    onUpdateAddress({ ...address, [field]: value })
  }

  const isFormValid = address.pincode && address.phone && address.house && address.street

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4 }}
      className="max-w-[1050px] mx-auto py-10 px-6"
    >
      {/* ── Section Header ── */}
      <div className="mb-6">
        <span className="block text-xs font-bold tracking-wider text-[#4361EE] uppercase mb-2">
          SERVICE LOCATION
        </span>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
          Where should we install it?
        </h1>
        <p className="text-[15px] text-gray-500">
          We&apos;ll use these details only to check whether doorstep installation is supported.
        </p>
      </div>

      {/* ── 2-Column Content ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left Column: Form Fields (2 cols wide) */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-4">
          {/* Row 1: PIN code & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                PIN code
              </label>
              <input
                type="text"
                value={address.pincode}
                onChange={(e) => handleChange('pincode', e.target.value)}
                placeholder="560102"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 bg-gray-50/50 focus:bg-white focus:border-[#4361EE] focus:ring-2 focus:ring-[#4361EE]/10 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                Contact phone
              </label>
              <input
                type="text"
                value={address.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 bg-gray-50/50 focus:bg-white focus:border-[#4361EE] focus:ring-2 focus:ring-[#4361EE]/10 outline-none transition-all"
              />
            </div>
          </div>

          {/* Row 2: House or building */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
              House or building
            </label>
            <input
              type="text"
              value={address.house}
              onChange={(e) => handleChange('house', e.target.value)}
              placeholder="14B, Lakeview Apartments"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 bg-gray-50/50 focus:bg-white focus:border-[#4361EE] focus:ring-2 focus:ring-[#4361EE]/10 outline-none transition-all"
            />
          </div>

          {/* Row 3: Street or locality */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
              Street or locality
            </label>
            <input
              type="text"
              value={address.street}
              onChange={(e) => handleChange('street', e.target.value)}
              placeholder="HSR Layout, Sector 2"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 bg-gray-50/50 focus:bg-white focus:border-[#4361EE] focus:ring-2 focus:ring-[#4361EE]/10 outline-none transition-all"
            />
          </div>

          {/* Row 4: Area or landmark */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
              Area or landmark <span className="text-gray-400 font-normal lowercase">(optional)</span>
            </label>
            <input
              type="text"
              value={address.landmark}
              onChange={(e) => handleChange('landmark', e.target.value)}
              placeholder="e.g. near the metro station"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 bg-gray-50/50 focus:bg-white focus:border-[#4361EE] focus:ring-2 focus:ring-[#4361EE]/10 outline-none transition-all"
            />
          </div>
        </div>

        {/* Right Column: Coverage Box */}
        <div>
          <div className="bg-emerald-50/30 border border-emerald-400/50 rounded-2xl p-6 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                    <path d="M3.5 8.5L6.5 11.5L12.5 5.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 m-0">
                    Available in this area
                  </h4>
                  <p className="text-xs text-gray-500 m-0 mt-0.5">
                    Demo coverage check complete for PIN {address.pincode || '560102'}.
                  </p>
                </div>
              </div>

              <hr className="border-t border-emerald-200/60 my-4" />

              <p className="text-xs text-gray-600 leading-relaxed m-0">
                Next, choose an appointment that works for you.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-emerald-200/50 text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.8"/>
                <path d="M8 5V8.5L10 10.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              <span>Instant slot confirmation on the next step</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Demo Info Banner ── */}
      <div className="bg-blue-50/60 border border-blue-100/80 rounded-xl p-4 flex items-start gap-3 text-sm text-gray-600 mb-8">
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="shrink-0 text-[#4361EE] mt-0.5">
          <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.6" />
          <path d="M10 9V14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="10" cy="6" r="1" fill="currentColor" />
        </svg>
        <span>
          Availability and address are revalidated before a booking is created. This is a clearly labeled demo check.
        </span>
      </div>

      {/* ── Bottom Action ── */}
      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={!isFormValid}
          className={`inline-flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm transition-all border-none ${
            isFormValid
              ? 'bg-[#4361EE] text-white hover:bg-[#3451de] hover:translate-x-0.5 shadow-md cursor-pointer'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <span>Continue to review</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </motion.div>
  )
}
