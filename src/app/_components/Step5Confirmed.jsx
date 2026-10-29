'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import Link from 'next/link'

export default function Step5Confirmed({ bookingDetails = {}, onReturnHome }) {
  const [copied, setCopied] = useState(false)

  const bookingId = bookingDetails.bookingId || '#SP-1042'
  const phone = bookingDetails.phoneName || 'Samsung Galaxy S24'
  const protector = bookingDetails.protectorName || 'Tempered Glass Protector'
  const time =
    bookingDetails.date && bookingDetails.slot
      ? `${bookingDetails.date.full || bookingDetails.date} · ${bookingDetails.slot.time || bookingDetails.slot}`
      : 'Wednesday, Oct 28 · 11:00 AM - 12:00 PM'
  const address =
    bookingDetails.addressString ||
    'Flat 402, Blossom Heights, Sector 12, Near Metro Station, PIN 400706'
  const price = bookingDetails.totalPrice || 398

  const handleCopyId = () => {
    navigator.clipboard.writeText(bookingId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Create track URL with current booking details
  const trackUrl = `/track?bookingId=${encodeURIComponent(bookingId)}&phone=${encodeURIComponent(phone)}&protector=${encodeURIComponent(protector)}&price=${encodeURIComponent(price)}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="max-w-[620px] mx-auto py-10 px-4 sm:px-6"
    >
      <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-center">
        {/* ── Green Animated Checkmark ── */}
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-4 shadow-2xs">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        {/* ── Status Pill ── */}
        <span className="inline-block text-[11px] font-bold tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-3.5 py-1 rounded-full uppercase mb-2">
          BOOKING CONFIRMED
        </span>

        {/* ── Title & Intro ── */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
          Your Installation Is Booked!
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-[460px] mx-auto mb-6 leading-relaxed">
          We have reserved your slot. A professional technician will visit your location to fit your screen protector.
        </p>

        {/* ── Booking Summary Box ── */}
        <div className="bg-slate-50/80 border border-slate-200/70 rounded-2xl p-5 text-left space-y-4 mb-6">
          <div className="flex justify-between items-center border-b border-slate-200/60 pb-3">
            <div>
              <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider block">
                Booking Reference
              </span>
              <span className="text-sm font-extrabold text-gray-900 font-mono tracking-tight">
                {bookingId}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyId}
              className="text-xs font-semibold text-[#2563EB] hover:text-[#1d4ed8] bg-white border border-gray-200 hover:border-blue-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              {copied ? '✓ Copied' : 'Copy ID'}
            </button>
          </div>

          <div>
            <div className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1">
              Device & Protector
            </div>
            <div className="text-xs sm:text-sm font-bold text-gray-800 flex items-center gap-2">
              <span className="text-base">📱</span>
              <span>{phone} · {protector}</span>
            </div>
          </div>

          <div>
            <div className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1">
              Appointment Schedule
            </div>
            <div className="text-xs sm:text-sm font-bold text-gray-800 flex items-center gap-2">
              <span className="text-base">📅</span>
              <span>{time}</span>
            </div>
          </div>

          <div>
            <div className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1">
              Installation Address
            </div>
            <div className="text-xs sm:text-sm font-medium text-gray-700 flex items-start gap-2 leading-snug">
              <span className="shrink-0 text-base mt-0.5">📍</span>
              <span>{address}</span>
            </div>
          </div>

          <div className="border-t border-slate-200/60 pt-3 flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">Total to Pay (Doorstep UPI/Cash)</span>
            <span className="text-base font-bold text-gray-900">₹{price}</span>
          </div>
        </div>

        {/* ── Informational Tip Pill ── */}
        <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3 text-left flex items-start gap-2.5 mb-6">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <p className="text-xs text-blue-900 leading-relaxed m-0">
            <span className="font-semibold">Next Step:</span> Your assigned technician will call 15 minutes prior to arrival to confirm entry details.
          </p>
        </div>

        {/* ── Actions: Navigates to new URL /track without the progress bar ── */}
        <div className="space-y-3">
          <Link
            href={trackUrl}
            className="w-full py-3.5 px-6 bg-[#2563EB] hover:bg-[#1d4ed8] active:bg-[#1e40af] text-white font-bold rounded-xl text-sm transition-all shadow-[0_2px_10px_rgba(37,99,235,0.25)] hover:shadow-[0_4px_14px_rgba(37,99,235,0.35)] hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer no-underline border-none"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>Track Your Order</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>

          <button
            type="button"
            onClick={onReturnHome}
            className="w-full py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-all border-none cursor-pointer"
          >
            Return to Home
          </button>
        </div>

        {/* ── Help text ── */}
        <p className="text-xs text-gray-400 mt-6 m-0">
          Need to reschedule or have questions? Contact support via{' '}
          <Link href="/support" className="text-[#2563EB] underline font-medium">
            Support Desk
          </Link>{' '}
          or call 1800-123-456.
        </p>
      </div>

      <p className="text-xs text-gray-400 text-center mt-6">
        © 2026 ScreenCare Doorstep Services. All rights reserved.
      </p>
    </motion.div>
  )
}
