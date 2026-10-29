'use client'

import { motion } from 'motion/react'

export const PROTECTORS = [
  {
    id: 'tempered-glass',
    name: 'Tempered Glass Protector',
    inStock: true,
    features: [
      'Scratch protection for everyday use',
      'Designed for exact screen curvature',
      'Professional fitting at supported locations',
    ],
    productPrice: 299,
    installPrice: 99,
    totalPrice: 398,
  },
  {
    id: 'privacy-film',
    name: 'Privacy Film Protector',
    inStock: false,
    reason: 'Compatible, but currently unavailable for demo booking.',
    productPrice: 349,
    installPrice: 99,
    totalPrice: 448,
  },
]

export default function Step2Protector({ selectedPhone, selectedProtector, onSelectProtector, onNext }) {
  const currentPhoneName = selectedPhone ? `${selectedPhone.brand} ${selectedPhone.model}` : 'Samsung Galaxy S24'

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
          FOR {currentPhoneName.toUpperCase()}
        </span>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
          Choose your screen protector
        </h1>
        <p className="text-[15px] text-gray-500">
          Only compatible, in-stock options are shown. Prices below are demo pricing.
        </p>
      </div>

      {/* ── 2-Column Content ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left Column: Protector Options (2 cols wide) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Card 1: Tempered Glass (Available / Selected) */}
          <div
            onClick={() => onSelectProtector(PROTECTORS[0])}
            className={`relative bg-white rounded-2xl p-6 border transition-all cursor-pointer ${
              selectedProtector?.id === PROTECTORS[0].id
                ? 'border-[#4361EE] ring-2 ring-[#4361EE]/15 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {/* Top Right Checkmark */}
            {selectedProtector?.id === PROTECTORS[0].id && (
              <div className="absolute top-5 right-5 w-6 h-6 rounded-full bg-[#4361EE] text-white flex items-center justify-center shadow-sm">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M4 8.5L6.5 11L12 5.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}

            <div className="flex items-start gap-4 mb-4">
              {/* Shield Icon Box */}
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 text-[#4361EE]">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="M9 12l2 2 4-4"/>
                </svg>
              </div>

              <div>
                <span className="inline-block text-[11px] font-bold tracking-wider text-[#4361EE] uppercase mb-1">
                  SELECTED
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Tempered Glass Protector
                </h3>
                <ul className="space-y-1.5 text-xs text-gray-600 list-none p-0 m-0">
                  <li className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-emerald-600 shrink-0">
                      <path d="M3 8.5L6 11.5L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Scratch protection for everyday use
                  </li>
                  <li className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-emerald-600 shrink-0">
                      <path d="M3 8.5L6 11.5L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Designed for {currentPhoneName}
                  </li>
                  <li className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-emerald-600 shrink-0">
                      <path d="M3 8.5L6 11.5L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Professional fitting at supported locations
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-6">
                <span>Product <strong className="text-gray-900 font-semibold">₹299</strong></span>
                <span>Installation <strong className="text-gray-900 font-semibold">₹99</strong></span>
              </div>
              <div>
                Total <strong className="text-base text-gray-900 font-bold ml-1">₹398</strong>
              </div>
            </div>
          </div>

          {/* Card 2: Privacy Film Protector (Out of stock) */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 opacity-75">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-gray-800 m-0">
                Privacy Film Protector
              </h3>
              <span className="text-xs font-semibold text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full">
                Out of stock
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Compatible, but currently unavailable for demo booking.
            </p>
            <button
              disabled
              className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg text-xs font-semibold cursor-not-allowed border-none"
            >
              Unavailable
            </button>
          </div>
        </div>

        {/* Right Column: Your Selection Summary Box */}
        <div>
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-3">
            <h4 className="text-sm font-bold text-gray-900 m-0 pb-1">
              Your selection
            </h4>

            {/* Phone */}
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <div className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">
                Phone
              </div>
              <div className="text-sm font-bold text-gray-900 mt-0.5">
                {currentPhoneName}
              </div>
            </div>

            {/* Availability */}
            <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-100/60">
              <div className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">
                Availability
              </div>
              <div className="text-sm font-semibold text-emerald-600 mt-0.5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                In stock for demo booking
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Action ── */}
      <div className="flex justify-end">
        <button
          onClick={onNext}
          className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm bg-[#4361EE] text-white hover:bg-[#3451de] hover:translate-x-0.5 shadow-md cursor-pointer transition-all border-none"
        >
          <span>Continue</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </motion.div>
  )
}
