'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function TrackInstallationContent({ bookingDetails = {} }) {
  const searchParams = useSearchParams()
  const queryBookingId = searchParams?.get('bookingId')
  const queryPhone = searchParams?.get('phone')
  const queryProtector = searchParams?.get('protector')
  const queryPrice = searchParams?.get('price')

  const bookingId = bookingDetails.bookingId || queryBookingId || '#SP-1042'
  const phone = bookingDetails.phoneName || queryPhone || 'Samsung Galaxy S24'
  const protector = bookingDetails.protectorName || queryProtector || 'Tempered Glass Protector'
  const time =
    bookingDetails.date && bookingDetails.slot
      ? `${bookingDetails.date.full || bookingDetails.date} · ${bookingDetails.slot.time || bookingDetails.slot}`
      : 'Wednesday, Oct 28 · 11:00 AM - 12:00 PM'
  const address =
    bookingDetails.addressString ||
    'Flat 402, Blossom Heights, Sector 12, Near Metro Station, PIN 400706'
  const price = bookingDetails.totalPrice || queryPrice || 398

  // Interactive states
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [ratingSubmitted, setRatingSubmitted] = useState(false)

  const [issueCategory, setIssueCategory] = useState('Technician Delay')
  const [issueDescription, setIssueDescription] = useState('')
  const [ticketSubmitted, setTicketSubmitted] = useState(false)
  const [ticketId, setTicketId] = useState('#TCK-8492')

  const handleRatingSubmit = (e) => {
    e.preventDefault()
    if (rating === 0) {
      alert('Please select a star rating first.')
      return
    }
    setRatingSubmitted(true)
  }

  const handleTicketSubmit = (e) => {
    e.preventDefault()
    if (!issueDescription.trim()) {
      alert('Please enter a description for your issue.')
      return
    }
    const newId = `#TCK-${Math.floor(1000 + Math.random() * 9000)}`
    setTicketId(newId)
    setTicketSubmitted(true)
  }

  const handleCancelBooking = () => {
    const confirmed = window.confirm(
      'Are you sure you want to cancel this booking? Cancellations up to 2 hours before the slot are completely free.'
    )
    if (confirmed) {
      alert('Your booking cancellation request has been received. Our team is processing it.')
    }
  }

  const scrollToSupport = () => {
    const el = document.getElementById('support-ticket-card')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-gray-800 pb-16">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
       

        {/* ── Header Title Row with Status Badge ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Track Your Installation
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Real-time updates for your Screen Protector installation.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200/80 shadow-2xs self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>Technician Assigned</span>
          </div>
        </div>

        {/* ── Main 2-Column Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8 items-start">
          {/* ════ Left Column: Installation Progress (7 cols) ════ */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200/90 p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            {/* Card Title */}
            <div className="flex items-center gap-2.5 pb-5 border-b border-gray-100 mb-6">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
              <h2 className="text-base font-bold text-gray-900 m-0">Installation Progress</h2>
            </div>

            {/* Stepper Timeline */}
            <div className="relative pl-8 space-y-7 before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-[2px] before:bg-gray-200">
              {/* ── Step 1: Confirmed (Done) ── */}
              <div className="relative">
                <div className="absolute -left-8 top-0.5 w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 m-0">Booking Confirmed</h3>
                  <p className="text-xs text-gray-500 mt-1 mb-1.5 leading-relaxed">
                    We received your request and reserved your screen protector.
                  </p>
                  <span className="text-[11px] font-semibold text-blue-600">Oct 27, 04:30 PM</span>
                </div>
              </div>

              {/* ── Step 2: Technician Assigned (Active) ── */}
              <div className="relative">
                <div className="absolute -left-8 top-0.5 w-7 h-7 rounded-full bg-[#2563EB] text-white flex items-center justify-center shadow-xs ring-4 ring-blue-50">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 m-0">Technician Assigned</h3>
                  <p className="text-xs text-gray-500 mt-1 mb-3 leading-relaxed">
                    Your expert technician, <span className="font-semibold text-gray-800">Rahul Sharma</span>, has been assigned to your booking.
                  </p>

                  {/* Technician Profile Card */}
                  <div className="bg-[#f4f7fe]/80 border border-blue-100 rounded-xl p-3.5 flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-xs shrink-0 border-2 border-white">
                        RS
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-gray-900">Rahul Sharma</div>
                        <div className="text-[11px] font-medium text-amber-700 flex items-center gap-1 mt-0.5">
                          <span>★ 4.9 Rating</span>
                          <span className="text-gray-400 font-normal">(120+ installs)</span>
                        </div>
                      </div>
                    </div>

                    <a
                      href="tel:+919876543210"
                      className="w-9 h-9 rounded-lg bg-white border border-gray-200 text-blue-600 hover:bg-blue-50 hover:border-blue-200 flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                      title="Call Technician"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </a>
                  </div>

                  <span className="text-[11px] font-semibold text-blue-600">Oct 27, 04:35 PM</span>
                </div>
              </div>

              {/* ── Step 3: Technician On the Way (Pending) ── */}
              <div className="relative opacity-65">
                <div className="absolute -left-8 top-0.5 w-7 h-7 rounded-full bg-white border-2 border-gray-300 text-gray-400 flex items-center justify-center">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 m-0">Technician On the Way</h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Technician will head to your location during your selected slot.
                  </p>
                </div>
              </div>

              {/* ── Step 4: Technician Arrived (Pending) ── */}
              <div className="relative opacity-65">
                <div className="absolute -left-8 top-0.5 w-7 h-7 rounded-full bg-white border-2 border-gray-300 text-gray-400 flex items-center justify-center">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 m-0">Technician Arrived</h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Rahul will mark arrival and inspect your device before applying.
                  </p>
                </div>
              </div>

              {/* ── Step 5: Installation in Progress (Pending) ── */}
              <div className="relative opacity-65">
                <div className="absolute -left-8 top-0.5 w-7 h-7 rounded-full bg-white border-2 border-gray-300 text-gray-400 flex items-center justify-center">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 m-0">Installation in Progress</h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Professional application and UV curing (if applicable).
                  </p>
                </div>
              </div>

              {/* ── Step 6: Installation Completed (Pending) ── */}
              <div className="relative opacity-65">
                <div className="absolute -left-8 top-0.5 w-7 h-7 rounded-full bg-white border-2 border-gray-300 text-gray-400 flex items-center justify-center">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                    <line x1="4" y1="22" x2="4" y2="15" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 m-0">Installation Completed</h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Verify the fit, pay the technician, and submit your review.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ════ Right Column: Stacked Cards (5 cols) ════ */}
          <div className="lg:col-span-5 space-y-6">
            {/* ── Card 1: Booking Details ── */}
            <div className="bg-white rounded-2xl border border-gray-200/90 p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                <h2 className="text-sm font-bold text-gray-900 m-0">Booking Details</h2>
                <span className="text-[11px] font-extrabold font-mono text-[#2563EB] bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded">
                  {bookingId}
                </span>
              </div>

              <div className="space-y-4">
                {/* Device & Protector */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0 mt-0.5">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="5" y="2" width="14" height="20" rx="3" />
                      <line x1="12" y1="18" x2="12.01" y2="18" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-gray-900">{phone}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{protector}</div>
                  </div>
                </div>

                {/* Date & Slot */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0 mt-0.5">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-gray-900">{time.split('·')[0] || time}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{time.split('·')[1] || '11:00 AM - 12:00 PM'}</div>
                  </div>
                </div>

                {/* Installation Address */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0 mt-0.5">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-gray-900">Installation Address</div>
                    <div className="text-xs text-gray-500 mt-0.5 leading-snug">{address}</div>
                  </div>
                </div>
              </div>

              {/* Amount to pay row */}
              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">Amount to Pay (UPI/Cash)</span>
                <span className="text-base sm:text-lg font-extrabold text-gray-900">₹{price}</span>
              </div>
            </div>

            {/* ── Card 2: Need to make changes? ── */}
            <div className="bg-white rounded-2xl border border-gray-200/90 p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <div className="flex items-center gap-2 mb-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 m-0">Need to make changes?</h3>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                You can reschedule or cancel your appointment free of charge up to 2 hours before your scheduled slot.
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={scrollToSupport}
                  className="flex-1 py-2 px-3 rounded-xl border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <span>Support Ticket</span>
                </button>

                <button
                  type="button"
                  onClick={handleCancelBooking}
                  className="flex-1 py-2 px-3 rounded-xl border border-red-200 hover:border-red-300 bg-white hover:bg-red-50/50 text-red-600 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                  <span>Cancel Booking</span>
                </button>
              </div>
            </div>

            {/* ── Card 3: Rate Your Installation ── */}
            <div className="bg-white rounded-2xl border border-gray-200/90 p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <div className="flex items-center gap-2 mb-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 m-0">Rate Your Installation</h3>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                Once your technician Rahul Sharma completes the installation, please share your feedback to help us maintain high-quality doorstep service.
              </p>

              {ratingSubmitted ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-center text-xs text-emerald-800 font-medium">
                  ✓ Thank you! Your rating and feedback have been recorded.
                </div>
              ) : (
                <form onSubmit={handleRatingSubmit} className="space-y-3">
                  {/* Star row */}
                  <div className="flex items-center justify-center gap-2 py-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        className="bg-transparent border-none cursor-pointer p-0 text-xl transition-transform hover:scale-110"
                      >
                        <span className={star <= (hoverRating || rating) ? 'text-amber-400' : 'text-gray-300'}>
                          ★
                        </span>
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={2}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Optional written feedback..."
                    className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20 outline-none resize-none placeholder:text-gray-400 bg-gray-50/40"
                  />

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#059669] hover:bg-[#047857] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer border-none shadow-xs"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Submit Rating</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* ════ Bottom Full-Width Card: Create Support Ticket ════ */}
        <div id="support-ticket-card" className="bg-white rounded-2xl border border-gray-200/90 p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] mb-12">
          <div className="flex items-start gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0 mt-0.5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 m-0">Create Support Ticket</h2>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Have an issue with your scheduling, technician arrival, or payment? Let us know, and our support team will resolve it immediately.
              </p>
            </div>
          </div>

          {ticketSubmitted ? (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
              <div className="text-sm font-bold text-blue-900 mb-1">Ticket Submitted Successfully!</div>
              <p className="text-xs text-blue-700 m-0">
                Ticket reference: <span className="font-mono font-bold">{ticketId}</span>. Our doorstep support team is reviewing it and will reach out via call or SMS.
              </p>
            </div>
          ) : (
            <form onSubmit={handleTicketSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Booking ID
                  </label>
                  <input
                    type="text"
                    disabled
                    value={bookingId}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-xs font-mono font-bold text-gray-600 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Issue Category
                  </label>
                  <select
                    value={issueCategory}
                    onChange={(e) => setIssueCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-medium text-gray-800 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20 outline-none"
                  >
                    <option value="Technician Delay">Technician Delay</option>
                    <option value="Wrong Protector Model">Wrong Protector Model</option>
                    <option value="Reschedule Request">Reschedule Request</option>
                    <option value="Address Update">Address Update</option>
                    <option value="Payment or Pricing Query">Payment or Pricing Query</option>
                    <option value="Cancellation Request">Cancellation Request</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Description of the issue
                </label>
                <textarea
                  rows={4}
                  required
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  placeholder="Please describe your issue in detail so we can help you faster..."
                  className="w-full p-3.5 text-xs rounded-xl border border-gray-200 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20 outline-none resize-none placeholder:text-gray-400"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-xs font-semibold rounded-xl inline-flex items-center gap-2 transition-colors cursor-pointer border-none shadow-xs"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  <span>Submit Ticket</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* ── Footer ── */}
        <footer className="text-center text-xs text-gray-400 pt-4">
          © 2026 ScreenCare Doorstep Services. All rights reserved.
        </footer>
      </div>
    </div>
  )
}

export default function TrackInstallation(props) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8f9fb]" />}>
      <TrackInstallationContent {...props} />
    </Suspense>
  )
}

