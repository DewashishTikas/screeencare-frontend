'use client'

import { useState, useMemo } from 'react'
import { motion } from 'motion/react'

export const SUPPORTED_PHONES = [
  { id: 's24', brand: 'Samsung', model: 'Galaxy S24', status: 'Supported' },
  { id: 'ip15', brand: 'Apple', model: 'iPhone 15', status: 'Supported' },
  { id: 'px8', brand: 'Google', model: 'Pixel 8', status: 'Supported' },
  { id: 'ip15pro', brand: 'Apple', model: 'iPhone 15 Pro', status: 'Supported' },
  { id: 's23', brand: 'Samsung', model: 'Galaxy S23', status: 'Supported' },
  { id: 'px7', brand: 'Google', model: 'Pixel 7', status: 'Supported' },
]

export default function Step1Model({ selectedPhone, onSelectPhone, onNext }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeBrand, setActiveBrand] = useState('All brands')

  const brands = ['All brands', 'Apple', 'Samsung', 'Google']

  const filteredPhones = useMemo(() => {
    return SUPPORTED_PHONES.filter((phone) => {
      const matchesBrand = activeBrand === 'All brands' || phone.brand === activeBrand
      const matchesSearch =
        phone.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        phone.brand.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesBrand && matchesSearch
    })
  }, [searchQuery, activeBrand])

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4 }}
      className="max-w-[920px] mx-auto py-10 px-6"
    >
      {/* ── Section Header ── */}
      <div className="mb-6">
        <span className="block text-xs font-bold tracking-wider text-[#4361EE] uppercase mb-2">
          DEVICE COMPATIBILITY
        </span>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
          Which phone do you use?
        </h1>
        <p className="text-[15px] text-gray-500">
          Choose an exact model so we can show protectors that fit correctly.
        </p>
      </div>

      {/* ── Search & Filter Box ── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.03)] mb-6">
        <label className="block text-sm font-semibold text-gray-800 mb-2.5">
          Search supported models
        </label>

        {/* Input */}
        <div className="flex items-center gap-2.5 px-3.5 py-3 border border-gray-200 rounded-xl bg-white focus-within:border-[#4361EE] focus-within:ring-2 focus-within:ring-[#4361EE]/10 transition-all mb-4">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="shrink-0">
            <circle cx="9" cy="9" r="6" stroke="#9CA3AF" strokeWidth="1.7" />
            <path d="M14 14L18 18" stroke="#9CA3AF" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search iPhone, Galaxy, Pixel..."
            className="w-full border-none outline-none text-sm text-gray-800 placeholder:text-gray-400 bg-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Brand Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => setActiveBrand(brand)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border cursor-pointer ${
                activeBrand === brand
                  ? 'bg-[#4361EE] text-white border-[#4361EE] shadow-sm'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* ── Phone Cards Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {filteredPhones.map((phone) => {
          const isSelected = selectedPhone?.id === phone.id
          return (
            <div
              key={phone.id}
              onClick={() => onSelectPhone(phone)}
              className={`relative p-5 rounded-2xl border transition-all cursor-pointer select-none bg-white ${
                isSelected
                  ? 'border-[#4361EE] ring-2 ring-[#4361EE]/15 shadow-md bg-blue-50/10'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              {/* Checkmark icon on selected */}
              {isSelected && (
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#4361EE] text-white flex items-center justify-center shadow-sm">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M4 8.5L6.5 11L12 5.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}

              {/* Phone Icon */}
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-4 text-[#4361EE]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="3" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
              </div>

              <div className="text-xs text-gray-500 font-medium">{phone.brand}</div>
              <div className="text-base font-bold text-gray-900 mt-0.5 mb-1.5">{phone.model}</div>
              <div className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {phone.status}
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Info Banner ── */}
      <div className="bg-blue-50/60 border border-blue-100/80 rounded-xl p-4 flex items-start gap-3 text-sm text-gray-600 mb-8">
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="shrink-0 text-[#4361EE] mt-0.5">
          <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.6" />
          <path d="M10 9V14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="10" cy="6" r="1" fill="currentColor" />
        </svg>
        <span>
          Can&apos;t find your model? We don&apos;t support every phone yet, and unsupported models can&apos;t be booked.
        </span>
      </div>

      {/* ── Bottom Action ── */}
      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={!selectedPhone}
          className={`inline-flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm transition-all border-none ${
            selectedPhone
              ? 'bg-[#4361EE] text-white hover:bg-[#3451de] hover:translate-x-0.5 shadow-md cursor-pointer'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
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
