'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion } from 'motion/react'
import Image from 'next/image'

export default function Step4ReviewTime({
  user,
  selectedPhone,
  selectedProtector,
  address = {},
  bookingDetails = {},
  onUpdateBookingDetails,
  onConfirm,
  onBack,
}) {
  // Generate real upcoming dates (next 7 days with available slots)
  // If today has already passed (all time slots are past, currentHour >= 19), do not show Today at all.
  const availableDates = useMemo(() => {
    const dates = []
    const now = new Date()
    const currentHour = now.getHours()
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
    const fullMonths = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ]

    // Latest appointment slot begins at 19:00 (7 PM). If currentHour >= 19, today has passed.
    // As per requirement "if date is passed don't show it", start from tomorrow.
    const isTodayPassed = currentHour >= 19
    const startDayOffset = isTodayPassed ? 1 : 0

    for (let i = 0; i < 7; i++) {
      const dayOffset = startDayOffset + i
      const d = new Date()
      d.setDate(d.getDate() + dayOffset)
      const isToday = dayOffset === 0
      const isTomorrow = dayOffset === 1
      const dayOfWeek = daysOfWeek[d.getDay()]
      const dayNum = String(d.getDate()).padStart(2, '0')
      const monthStr = months[d.getMonth()]
      const fullMonthStr = fullMonths[d.getMonth()]
      const weekdayLabel = isToday ? 'Today' : isTomorrow ? 'Tomorrow' : dayOfWeek

      dates.push({
        id: `date-${d.getFullYear()}-${d.getMonth() + 1}-${dayNum}`,
        month: monthStr,
        day: dayNum,
        weekday: weekdayLabel,
        full: `${weekdayLabel}, ${fullMonthStr} ${dayNum}`,
        isToday,
        available: true,
        status: 'Available',
      })
    }
    return dates
  }, [])

  // Standard time slots definition
  const RAW_SLOTS = useMemo(
    () => [
      { id: 'slot-1', startHour: 9, time: '09:00 AM - 11:00 AM', period: 'Morning' },
      { id: 'slot-2', startHour: 11, time: '11:00 AM - 01:00 PM', period: 'Midday' },
      { id: 'slot-3', startHour: 13, time: '01:00 PM - 03:00 PM', period: 'Afternoon' },
      { id: 'slot-4', startHour: 15, time: '03:00 PM - 05:00 PM', period: 'Evening' },
      { id: 'slot-5', startHour: 17, time: '05:00 PM - 07:00 PM', period: 'Late Evening' },
      { id: 'slot-6', startHour: 19, time: '07:00 PM - 09:00 PM', period: 'Night' },
    ],
    []
  )

  // Default to first available date
  const defaultDate = availableDates[0]
  const [selectedDate, setSelectedDate] = useState(() => {
    if (bookingDetails?.date?.id) {
      const match = availableDates.find((d) => d.id === bookingDetails.date.id)
      if (match) return match
    }
    return defaultDate
  })

  // Ensure selectedDate stays valid if availableDates change
  useEffect(() => {
    const isValid = availableDates.some((d) => d.id === selectedDate?.id)
    if (!isValid && availableDates.length > 0) {
      setSelectedDate(availableDates[0])
    }
  }, [availableDates, selectedDate])

  // Derive time slots availability based on selected date and current clock time
  const timeSlots = useMemo(() => {
    const now = new Date()
    const currentHour = now.getHours()
    const isToday = Boolean(selectedDate?.isToday)

    return RAW_SLOTS.map((slot) => {
      // If selected date is today and the slot start hour has already passed, disable it
      const hasPassed = Boolean(isToday && currentHour >= slot.startHour)
      const available = !hasPassed

      return {
        ...slot,
        available,
        status: hasPassed ? 'Passed' : 'Available',
      }
    })
  }, [RAW_SLOTS, selectedDate])

  // Initial slot selection
  const defaultSlot = timeSlots.find((s) => s.available) || timeSlots[0]
  const [selectedSlot, setSelectedSlot] = useState(bookingDetails.slot || defaultSlot)

  // Automatically adjust selectedSlot if the current selection is disabled / passed
  useEffect(() => {
    const isCurrentValid = timeSlots.some((s) => s.id === selectedSlot?.id && s.available)
    if (!isCurrentValid) {
      const nextAvailable = timeSlots.find((s) => s.available)
      if (nextAvailable) {
        setSelectedSlot(nextAvailable)
      }
    }
  }, [timeSlots, selectedSlot])

  const [instructions, setInstructions] = useState(bookingDetails.instructions || '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Resolve active phone and protector from props or fallback to localStorage
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

  const currentProtectorName = activeProtector
    ? activeProtector.name
    : 'Screen Protector'

  const totalPrice = activeProtector?.totalPrice || activeProtector?.productPrice || activeProtector?.price || 449

  const formattedAddress = [
    address.house,
    address.street,
    address.landmark,
    address.city,
    address.state,
    address.pincode ? `PIN ${address.pincode}` : '',
  ]
    .filter(Boolean)
    .join(', ')

  const handleConfirm = async () => {
    if (!selectedDate?.available || !selectedSlot?.available) return

    try {
      setIsSubmitting(true)
      const bookingId = `SC-${Date.now().toString().slice(-6)}`

      const fullBookingData = {
        bookingId,
        user: {
          id: user?._id || user?.id,
          name: address.fullName || user?.name || 'Customer',
          email: user?.email,
          phone: address.phone,
        },
        phoneName: currentPhoneName,
        selectedPhone: activePhone,
        protectorName: currentProtectorName,
        selectedProtector: activeProtector,
        shippingAddress: { ...address },
        addressString: formattedAddress,
        date: selectedDate,
        slot: selectedSlot,
        instructions: instructions.trim(),
        totalPrice,
        createdAt: new Date().toISOString(),
      }

      // Store in local storage for persistence across visits/track pages
      if (typeof window !== 'undefined') {
        localStorage.setItem('screencare_booking', JSON.stringify(fullBookingData))
      }

      // Send to backend order creation API if available
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKENDURL || 'http://localhost:4000'
        await fetch(`${backendUrl}/orders`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: [
              {
                productId: activeProtector?._id || activeProtector?.id,
                name: currentProtectorName,
                sku: activeProtector?.sku || 'SC-SKU-001',
                quantity: 1,
                price: totalPrice,
              },
            ],
            shippingAddress: {
              name: address.fullName || user?.name || 'Customer',
              phone: address.phone,
              house: address.house,
              street: address.street,
              city: address.city,
              state: address.state,
              pincode: address.pincode,
              landmark: address.landmark,
            },
            deliverySchedule: {
              date: selectedDate,
              slot: selectedSlot,
              instructions: instructions.trim(),
            },
            grandTotal: totalPrice,
          }),
        })
      } catch (err) {
        console.warn('Backend order sync note:', err)
      }

      onUpdateBookingDetails(fullBookingData)
      onConfirm()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4 }}
      className="max-w-[1150px] mx-auto py-10 px-6 font-sans text-gray-800"
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
          <span>Back to address details</span>
        </button>
      )}

      {/* ── Section Header ── */}
      <div className="mb-8">
        <span className="block text-xs sm:text-sm font-extrabold tracking-wider text-[#4361EE] uppercase mb-2">
          SCHEDULE & CONFIRM
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-2.5 font-heading">
          Select Appointment & Review
        </h1>
        <p className="text-base sm:text-lg text-gray-600 font-normal">
          Choose an available appointment slot. Past times on the current day are automatically disabled.
        </p>
      </div>

      {/* ── 2-Column Content ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Left Column: 1. Date, 2. Slot, 3. Instructions (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Date Selection */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 m-0 font-heading">
                <span>📅</span>
                <span>1. Select Appointment Date</span>
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {availableDates.map((item) => {
                const isSelected = selectedDate?.id === item.id

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedDate(item)}
                    className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#4361EE] ring-2 ring-[#4361EE]/15 shadow-sm bg-blue-50/20'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50 bg-white'
                    }`}
                  >
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                      {item.month}
                    </div>
                    <div
                      className={`text-2xl font-extrabold my-1 ${
                        isSelected ? 'text-[#4361EE]' : 'text-gray-900'
                      }`}
                    >
                      {item.day}
                    </div>
                    <div className="text-xs font-semibold text-gray-600">{item.weekday}</div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Section 2: Time Slot Selection (Past times disabled, rest enabled) */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 m-0 font-heading">
                <span>🕐</span>
                <span>2. Select Time Slot</span>
              </h3>
              <span className="text-xs font-medium text-gray-500">
                {selectedDate.isToday ? 'Past times are disabled' : 'All slots available'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {timeSlots.map((slot) => {
                const isSelected = selectedSlot.id === slot.id && slot.available
                const isAvailable = slot.available

                return (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={!isAvailable}
                    onClick={() => {
                      if (isAvailable) setSelectedSlot(slot)
                    }}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                      !isAvailable
                        ? 'border-gray-200 bg-gray-50/80 opacity-40 cursor-not-allowed text-gray-400 select-none'
                        : isSelected
                        ? 'border-[#4361EE] ring-2 ring-[#4361EE]/15 bg-blue-50/20 shadow-sm cursor-pointer'
                        : 'border-gray-200 bg-white hover:border-gray-300 cursor-pointer'
                    }`}
                  >
                    <div>
                      <div className={`text-sm font-bold ${!isAvailable ? 'text-gray-400' : 'text-gray-900'}`}>
                        {slot.time}
                      </div>
                      <div className="text-xs text-gray-400">{slot.period}</div>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                        !isAvailable
                          ? 'bg-gray-100 text-gray-400'
                          : isSelected
                          ? 'bg-[#4361EE] text-white'
                          : 'bg-emerald-50 text-emerald-700'
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
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-1 font-heading">
              <span>✏️</span>
              <span>3. Delivery Instructions</span>
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mb-3.5">
              Add any special directions for the technician (e.g. gate passcode, floor number, or landmark).
            </p>
            <textarea
              rows={3}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Ring Apt 3B doorbell. Call before arrival. 3rd floor, lift available."
              className="w-full p-4 rounded-2xl border border-gray-200 text-sm text-gray-800 bg-gray-50/40 focus:bg-white focus:border-[#4361EE] focus:ring-2 focus:ring-[#4361EE]/10 outline-none transition-all resize-none font-sans"
            />
          </div>
        </div>

        {/* Right Column: Order Summary & Review (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-[0_4px_16px_rgba(0,0,0,0.03)] space-y-5 sticky top-24">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 m-0 pb-1">
              Order Summary
            </h3>

            {/* Device & Protector item with Product Image */}
            <div className="flex items-start gap-4 bg-gray-50/90 p-4 rounded-2xl border border-gray-150">
              {activeProtector?.image ? (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-gray-200/80 p-2 shrink-0 flex items-center justify-center relative overflow-hidden shadow-2xs">
                  <Image
                    src={activeProtector.image}
                    alt={activeProtector.name || 'Product'}
                    width={72}
                    height={72}
                    className="w-full h-full object-contain"
                    unoptimized
                  />
                  <span className="absolute bottom-1 left-1 text-[8px] font-bold text-gray-400 bg-white/90 px-1 rounded border border-gray-200/60">
                    OEM
                  </span>
                </div>
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#4361EE] flex items-center justify-center shrink-0">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="5" y="2" width="14" height="20" rx="3" />
                    <line x1="12" y1="18" x2="12.01" y2="18" />
                  </svg>
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#4361EE]/10 text-[#4361EE] px-2 py-0.5 rounded">
                    {activeProtector?.categoryName || 'Accessory'}
                  </span>
                  {activeProtector?.sku && (
                    <span className="text-[10px] font-mono font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                      {activeProtector.sku}
                    </span>
                  )}
                </div>
                <div className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">
                  {currentProtectorName}
                </div>
                <div className="text-xs font-medium text-gray-500 mt-0.5">
                  For {currentPhoneName}
                </div>
                <div className="text-base font-extrabold text-[#4361EE] mt-1.5">
                  ₹{totalPrice}
                </div>
              </div>
            </div>

            {/* Schedule selected */}
            <div className="border-t border-gray-100 pt-4">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
                <span>📅</span>
                <span>APPOINTMENT TIME</span>
              </div>
              <div className="text-xs sm:text-sm font-bold text-gray-900">
                {selectedDate?.full} · {selectedSlot?.time}
              </div>
            </div>

            {/* Installation Address */}
            <div className="border-t border-gray-100 pt-4">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
                <span>📍</span>
                <span>INSTALLATION ADDRESS</span>
              </div>
              {address.fullName && (
                <div className="text-xs font-bold text-gray-900 mb-0.5">
                  {address.fullName} ({address.phone})
                </div>
              )}
              <p className="text-xs text-gray-600 leading-relaxed m-0 font-medium">
                {formattedAddress || 'No address provided'}
              </p>
            </div>

            {/* Total Price */}
            <div className="border-t border-gray-100 pt-4 flex justify-between items-baseline">
              <span className="text-base font-bold text-gray-900">Total Payable</span>
              <span className="text-2xl font-extrabold text-[#4361EE]">₹{totalPrice}</span>
            </div>

            {/* Confirm CTA */}
            <button
              type="button"
              disabled={isSubmitting || !selectedDate?.available || !selectedSlot?.available}
              onClick={handleConfirm}
              className={`w-full py-4 text-white font-bold rounded-2xl text-base transition-all border-none flex items-center justify-center gap-2 ${
                isSubmitting || !selectedDate?.available || !selectedSlot?.available
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-[#4361EE] hover:bg-[#3451de] shadow-[0_4px_14px_rgba(67,97,238,0.3)] hover:-translate-y-0.5 cursor-pointer'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Confirming Booking...</span>
                </>
              ) : (
                <>
                  <span>Confirm & Book Installation</span>
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3.5 8.5L6.5 11.5L12.5 5.5"
                      stroke="white"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </>
              )}
            </button>

            <p className="text-xs text-gray-400 text-center m-0">
              Pay securely via UPI, Card, or Cash at doorstep inspection.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
