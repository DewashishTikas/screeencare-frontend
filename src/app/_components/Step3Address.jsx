'use client'

import { motion } from 'motion/react'
import Image from 'next/image'

export default function Step3Address({
  address = {},
  onUpdateAddress,
  selectedPhone,
  selectedProtector,
  onNext,
  onBack,
}) {
  const handleChange = (field, value) => {
    onUpdateAddress({ ...address, [field]: value })
  }

  const isFormValid =
    address.fullName?.trim() &&
    address.phone?.trim() &&
    address.pincode?.trim() &&
    address.house?.trim() &&
    address.street?.trim() &&
    address.city?.trim() &&
    address.state?.trim()

  const activePhone = selectedPhone || (() => {
    if (typeof window !== 'undefined') {
      try {
        const s = localStorage.getItem('screencare_selected_phone')
        if (s) return JSON.parse(s)
      } catch (e) {}
    }
    return null
  })()

  const activeProtector = selectedProtector || (() => {
    if (typeof window !== 'undefined') {
      try {
        const s = localStorage.getItem('screencare_selected_protector')
        if (s) return JSON.parse(s)
      } catch (e) {}
    }
    return null
  })()

  const currentPhoneName = activePhone
    ? `${activePhone.brand || ''} ${activePhone.model || ''}`.trim()
    : 'Selected Device'

  const formattedAddressPreview = [
    address.house,
    address.street,
    address.landmark,
    address.city,
    address.state,
    address.pincode ? `PIN: ${address.pincode}` : '',
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4 }}
      className="max-w-[1050px] mx-auto py-10 px-6 font-sans text-gray-800"
    >
      {/* ── Back button ── */}
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors mb-4 bg-transparent border-none cursor-pointer p-0"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Back to product selection</span>
        </button>
      )}

      {/* ── Section Header ── */}
      <div className="mb-8">
        <span className="block text-xs sm:text-sm font-extrabold tracking-wider text-[#4361EE] uppercase mb-2">
          INSTALLATION ADDRESS
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-2.5 font-heading">
          Where should we install it?
        </h1>
        <p className="text-base sm:text-lg text-gray-600 font-normal">
          Enter your exact doorstep location where our technician will visit to fit your screen protector.
        </p>
      </div>

      {/* ── 2-Column Content ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 mb-8">
        {/* Left Column: Form Fields (7 cols wide) */}
        <div className="lg:col-span-7 bg-white border border-gray-200 rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-5">
          {/* Row 1: Full Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={address.fullName || ''}
                onChange={(e) => handleChange('fullName', e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 bg-gray-50/40 focus:bg-white focus:border-[#4361EE] focus:ring-2 focus:ring-[#4361EE]/10 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                Contact Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={address.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 bg-gray-50/40 focus:bg-white focus:border-[#4361EE] focus:ring-2 focus:ring-[#4361EE]/10 outline-none transition-all"
              />
            </div>
          </div>

          {/* Row 2: PIN Code & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                PIN Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={6}
                value={address.pincode || ''}
                onChange={(e) => handleChange('pincode', e.target.value.replace(/\D/g, ''))}
                placeholder="6-digit postal code"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 bg-gray-50/40 focus:bg-white focus:border-[#4361EE] focus:ring-2 focus:ring-[#4361EE]/10 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={address.city || ''}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder="e.g. Bangalore, Mumbai"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 bg-gray-50/40 focus:bg-white focus:border-[#4361EE] focus:ring-2 focus:ring-[#4361EE]/10 outline-none transition-all"
              />
            </div>
          </div>

          {/* Row 3: State */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
              State <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={address.state || ''}
              onChange={(e) => handleChange('state', e.target.value)}
              placeholder="e.g. Karnataka, Maharashtra, Delhi"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 bg-gray-50/40 focus:bg-white focus:border-[#4361EE] focus:ring-2 focus:ring-[#4361EE]/10 outline-none transition-all"
            />
          </div>

          {/* Row 4: House / Building / Flat No. */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
              Flat, House No., Building Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={address.house || ''}
              onChange={(e) => handleChange('house', e.target.value)}
              placeholder="e.g. Flat 302, Green Valley Apartments"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 bg-gray-50/40 focus:bg-white focus:border-[#4361EE] focus:ring-2 focus:ring-[#4361EE]/10 outline-none transition-all"
            />
          </div>

          {/* Row 5: Street / Sector / Area */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
              Street, Sector, Area or Colony <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={address.street || ''}
              onChange={(e) => handleChange('street', e.target.value)}
              placeholder="e.g. 17th Cross, HSR Layout Sector 2"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 bg-gray-50/40 focus:bg-white focus:border-[#4361EE] focus:ring-2 focus:ring-[#4361EE]/10 outline-none transition-all"
            />
          </div>

          {/* Row 6: Landmark */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
              Nearby Landmark <span className="text-gray-400 font-normal lowercase">(optional)</span>
            </label>
            <input
              type="text"
              value={address.landmark || ''}
              onChange={(e) => handleChange('landmark', e.target.value)}
              placeholder="e.g. Opposite Central Mall, Near Metro Gate 2"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 bg-gray-50/40 focus:bg-white focus:border-[#4361EE] focus:ring-2 focus:ring-[#4361EE]/10 outline-none transition-all"
            />
          </div>
        </div>

        {/* Right Column: Live Booking & Address Summary (5 cols wide) */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-5 sticky top-24">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 m-0 pb-1">
              Booking Overview
            </h3>

            {/* Selected Device & Product with Image */}
            <div className="flex items-start gap-3.5 bg-gray-50/80 p-3.5 rounded-2xl border border-gray-100">
              {activeProtector?.image ? (
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-gray-200/80 p-1.5 shrink-0 flex items-center justify-center relative shadow-2xs">
                  <Image
                    src={activeProtector.image}
                    alt={activeProtector.name || ''}
                    width={56}
                    height={56}
                    className="w-full h-full object-contain"
                    unoptimized
                  />
                  <span className="absolute bottom-1 left-1 text-[8px] font-bold text-gray-400 bg-white/90 px-1 rounded border border-gray-200/60">
                    OEM
                  </span>
                </div>
              ) : (
                <div className="w-16 h-16 rounded-xl bg-blue-50 text-[#4361EE] flex items-center justify-center shrink-0">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="5" y="2" width="14" height="20" rx="3" />
                  </svg>
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#4361EE]/10 text-[#4361EE] px-1.5 py-0.5 rounded">
                    {activeProtector?.categoryName || 'Accessory'}
                  </span>
                  {activeProtector?.sku && (
                    <span className="text-[10px] font-mono font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                      {activeProtector.sku}
                    </span>
                  )}
                </div>
                <div className="text-sm font-bold text-gray-900 truncate">
                  {activeProtector?.name || 'Screen Protector'}
                </div>
                <div className="text-xs text-gray-500 font-medium">For {currentPhoneName}</div>
                <div className="text-sm font-extrabold text-[#4361EE] mt-1">
                  ₹{activeProtector?.totalPrice || activeProtector?.price || 449}
                </div>
              </div>
            </div>

            {/* Live Address Preview */}
            <div className="border-t border-gray-100 pt-4">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-[#4361EE]">
                  <path
                    d="M8 1.5C5.5 1.5 3.5 3.5 3.5 6C3.5 9.5 8 14.5 8 14.5C8 14.5 12.5 9.5 12.5 6C12.5 3.5 10.5 1.5 8 1.5ZM8 8C6.9 8 6 7.1 6 6C6 4.9 6.9 4 8 4C9.1 4 10 4.9 10 6C10 7.1 9.1 8 8 8Z"
                    fill="currentColor"
                  />
                </svg>
                <span>ADDRESS PREVIEW</span>
              </div>

              {formattedAddressPreview ? (
                <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 text-xs sm:text-sm text-gray-800 leading-relaxed font-medium">
                  {address.fullName && (
                    <div className="font-bold text-gray-900 mb-1">{address.fullName} ({address.phone})</div>
                  )}
                  <div>{formattedAddressPreview}</div>
                </div>
              ) : (
                <div className="bg-gray-50/60 p-4 rounded-xl border border-dashed border-gray-200 text-xs text-gray-400 text-center">
                  Fill in the fields on the left to see your formatted address preview here.
                </div>
              )}
            </div>

            {/* Step info banner */}
            <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3.5 text-xs text-blue-900 flex items-center gap-2">
              <span className="text-base">📅</span>
              <span>Next step: Select your preferred appointment date and time slot.</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Action ── */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onNext}
          disabled={!isFormValid}
          className={`inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-base transition-all border-none ${
            isFormValid
              ? 'bg-[#4361EE] text-white hover:bg-[#3451de] hover:translate-x-0.5 shadow-md cursor-pointer'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <span>Continue to Select Date & Slot</span>
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
            <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </motion.div>
  )
}
