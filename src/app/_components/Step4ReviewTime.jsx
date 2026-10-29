'use client'

import { useState } from 'react'
import { motion } from 'motion/react'

export const DATES = [
  { id: 'oct28', month: 'OCT', day: '28', weekday: 'Wed', full: 'Wednesday, Oct 28' },
  { id: 'oct29', month: 'OCT', day: '29', weekday: 'Thu', full: 'Thursday, Oct 29' },
  { id: 'oct30', month: 'OCT', day: '30', weekday: 'Fri', full: 'Friday, Oct 30' },
  { id: 'oct31', month: 'OCT', day: '31', weekday: 'Sat', full: 'Saturday, Oct 31' },
]

export const SLOTS = [
  { time: '09:00 AM', status: 'Available' },
  { time: '11:00 AM', status: 'Available' },
  { time: '01:00 PM', status: 'Available' },
  { time: '03:00 PM', status: 'Available' },
  { time: '05:00 PM', status: 'Booked' },
  { time: '07:00 PM', status: 'Available' },
]

export default function Step4ReviewTime({
  selectedPhone,
  selectedProtector,
  address,
  bookingDetails,
  onUpdateBookingDetails,
  onConfirm,
  onBack,
}) {
  const [selectedDate, setSelectedDate] = useState(bookingDetails.date || DATES[0])
  const [selectedSlot, setSelectedSlot] = useState(bookingDetails.slot || SLOTS[1])
  const [instructions, setInstructions] = useState(bookingDetails.instructions || '')

  const currentPhoneName = selectedPhone ? `${selectedPhone.brand} ${selectedPhone.model}` : 'Samsung Galaxy S24'
  const currentProtectorName = selectedProtector ? selectedProtector.name : 'Tempered Glass Protector'
  const protectorPrice = selectedProtector?.productPrice || 299
  const installPrice = selectedProtector?.installPrice || 99
  const totalPrice = protectorPrice + installPrice

  const formattedAddress = [
    address.house || 'Flat 402, Blossom Heights',
    address.street || 'Sector 12',
    address.landmark,
    `PIN ${address.pincode || '400706'}`,
  ].filter(Boolean).join(', ')

  const handleConfirm = () => {
    onUpdateBookingDetails({
      date: selectedDate,
      slot: selectedSlot,
      instructions,
      totalPrice,
      phoneName: currentPhoneName,
      protectorName: currentProtectorName,
      addressString: formattedAddress,
    })
    onConfirm()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4 }}
      className="max-w-[1150px] mx-auto py-10 px-6"
    >
      {/* ── Back button ── */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors mb-4 bg-transparent border-none cursor-pointer p-0"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Back to address details</span>
      </button>

      {/* ── Section Header ── */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
          Review Your Booking
        </h1>
        <p className="text-[15px] text-gray-500">
          Select an installation slot and review your price breakdown before confirming.
        </p>
      </div>

      {/* ── 2-Column Content ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Left Column: 1. Date, 2. Slot, 3. Instructions (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Date */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-4">
              <span>📅</span>
              <span>1. Select Date</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {DATES.map((item) => {
                const isSelected = selectedDate.id === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedDate(item)}
                    className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer bg-white ${
                      isSelected
                        ? 'border-[#4361EE] ring-2 ring-[#4361EE]/15 shadow-sm bg-blue-50/15'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                    }`}
                  >
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                      {item.month}
                    </div>
                    <div className={`text-2xl font-extrabold my-0.5 ${isSelected ? 'text-[#4361EE]' : 'text-gray-900'}`}>
                      {item.day}
                    </div>
                    <div className="text-xs font-semibold text-gray-500">
                      {item.weekday}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Section 2: Time Slot */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-4">
              <span>🕐</span>
              <span>2. Select Time Slot</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SLOTS.map((slot) => {
                const isSelected = selectedSlot.time === slot.time && slot.status !== 'Booked'
                const isBooked = slot.status === 'Booked'

                return (
                  <button
                    key={slot.time}
                    disabled={isBooked}
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                      isBooked
                        ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                        : isSelected
                        ? 'border-[#4361EE] ring-2 ring-[#4361EE]/15 bg-blue-50/15 cursor-pointer shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300 cursor-pointer'
                    }`}
                  >
                    <span className="text-sm font-bold text-gray-800">
                      {slot.time}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                        isBooked
                          ? 'bg-gray-200 text-gray-600'
                          : isSelected
                          ? 'bg-[#4361EE] text-white'
                          : 'bg-emerald-50 text-emerald-600'
                      }`}
                    >
                      {isSelected ? 'Selected' : slot.status}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Section 3: Delivery Instructions */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-1">
              <span>✏️</span>
              <span>3. Delivery Instructions (Optional)</span>
            </h3>
            <p className="text-xs text-gray-500 mb-3">
              Add any helpful details for the technician (e.g. gate code, floor, nearby landmark).
            </p>
            <textarea
              rows={3}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Ring the bell for Apt 4B. Near the Central Metro Station Gate 2."
              className="w-full p-3.5 rounded-xl border border-gray-200 text-sm text-gray-800 bg-gray-50/40 focus:bg-white focus:border-[#4361EE] focus:ring-2 focus:ring-[#4361EE]/10 outline-none transition-all resize-none font-sans"
            />
          </div>
        </div>

        {/* Right Column: Order Summary (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_4px_16px_rgba(0,0,0,0.03)] space-y-5 sticky top-28">
            <h3 className="text-base font-bold text-gray-900 m-0 pb-1">
              Order Summary
            </h3>

            {/* Device & Protector item */}
            <div className="flex items-start gap-3.5 bg-gray-50/70 p-3.5 rounded-xl border border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-[#4361EE] shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="5" y="2" width="14" height="20" rx="3" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">
                  {currentPhoneName}
                </div>
                <div className="text-xs text-gray-500">
                  {currentProtectorName}
                </div>
                <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-1">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Doorstep Installation Included
                </div>
              </div>
            </div>

            {/* Installation Address */}
            <div className="border-t border-gray-100 pt-4">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1 mb-1.5">
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" className="text-[#4361EE]">
                  <path d="M8 1.5C5.5 1.5 3.5 3.5 3.5 6C3.5 9.5 8 14.5 8 14.5C8 14.5 12.5 9.5 12.5 6C12.5 3.5 10.5 1.5 8 1.5ZM8 8C6.9 8 6 7.1 6 6C6 4.9 6.9 4 8 4C9.1 4 10 4.9 10 6C10 7.1 9.1 8 8 8Z" fill="currentColor"/>
                </svg>
                INSTALLATION ADDRESS
              </div>
              <p className="text-xs text-gray-700 leading-relaxed m-0 font-medium">
                {formattedAddress}
              </p>
            </div>

            {/* Price breakdown */}
            <div className="border-t border-gray-100 pt-4 space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Tempered Glass Protector</span>
                <span className="font-semibold text-gray-900">₹{protectorPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Professional Installation</span>
                <span className="font-semibold text-gray-900">₹{installPrice}</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Travel & Service Fee</span>
                <span>FREE</span>
              </div>
            </div>

            {/* Total */}
            <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline">
              <span className="text-sm font-bold text-gray-900">Total Amount</span>
              <span className="text-xl font-extrabold text-[#4361EE]">₹{totalPrice}</span>
            </div>

            {/* Cancellation Policy */}
            <div className="bg-blue-50/50 border border-blue-100/70 rounded-xl p-3 text-xs text-gray-600 flex items-start gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-[#4361EE] mt-0.5">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.6"/>
                <path d="M8 7V11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                <circle cx="8" cy="5" r="0.75" fill="currentColor"/>
              </svg>
              <div>
                <strong className="text-gray-900 block font-semibold">Cancellation Policy</strong>
                <span>Free cancellation up to 2 hours before your selected slot. No-show or late cancellations may incur a small convenience fee.</span>
              </div>
            </div>

            {/* Confirm CTA */}
            <button
              onClick={handleConfirm}
              className="w-full py-3.5 bg-[#4361EE] hover:bg-[#3451de] text-white font-bold rounded-xl text-sm transition-all shadow-[0_4px_14px_rgba(67,97,238,0.3)] hover:-translate-y-0.5 border-none cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Confirm & Book Installation</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3.5 8.5L6.5 11.5L12.5 5.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <p className="text-[11px] text-gray-400 text-center m-0">
              Pay securely via Cash, UPI, or Card at the time of installation.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
