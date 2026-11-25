'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import customerImg from '/public/hero-page.webp'
import { useAuth } from '../_context/AuthContext'

export default function HeroSection() {
  const router = useRouter()
  const { user } = useAuth()
  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  const handleIndividualClick = async () => {
    try {
      setIsCheckingAuth(true)
      const backendUrl = process.env.NEXT_PUBLIC_BACKENDURL || 'http://localhost:4000'
      const res = await fetch(`${backendUrl}/auth`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (res.ok) {
        const userData = await res.json()
        if (userData && (userData.email || userData.name || userData.role)) {
          // User is authenticated -> show booking section step 1 for individual
          router.push('/book?step=1')
          return
        }
      }

      // Not logged in -> show toast and redirect to login page
      setToastMessage('Please log in to continue with your booking.')
      setTimeout(() => {
        router.push('/login?redirect=/book?step=1&message=' + encodeURIComponent('Please sign in to proceed with your booking.'))
      }, 1200)
    } catch (error) {
      console.error('Auth check error:', error)
      setToastMessage('Please log in to continue with your booking.')
      setTimeout(() => {
        router.push('/login?redirect=/book?step=1&message=' + encodeURIComponent('Please sign in to proceed with your booking.'))
      }, 1200)
    } finally {
      setIsCheckingAuth(false)
    }
  }

  return (
    <section id="book-installation" className="bg-gray-50 py-16 px-6 md:py-20 sm:py-10 sm:px-4">
      <div id="hero" className="sr-only" />
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-15 items-center">
        {/* ── Left column ── */}
        <motion.div
          className="flex flex-col"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          {/* Badges & Tagline */}
          <div className="flex flex-wrap items-center gap-2.5 mb-6">
            <motion.div
              className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200/80 rounded-3xl px-3.5 py-1.5 text-[13px] font-semibold text-[#4361EE] w-fit shadow-xs"
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>⚡ Doorstep in Under 1 Hour</span>
            </motion.div>

            <motion.div
              className="inline-flex items-center gap-1.5 bg-white border border-gray-200/80 rounded-3xl px-3.5 py-1.5 text-[12px] font-semibold text-gray-700 w-fit shadow-xs"
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <span>🛡️ Guard it, Style it, Love it</span>
            </motion.div>
          </div>

          {/* Heading */}
          <h1 className="text-[44px] max-md:text-[34px] max-sm:text-[28px] font-bold leading-[1.15] tracking-tight text-gray-900 mb-5 font-heading">
            A screen protector,<br />
            fitted at your doorstep.
          </h1>

          {/* Description */}
          <p className="text-base leading-relaxed text-gray-500 mb-7 max-w-[420px]">
            Choose a compatible protector, pick a convenient time, and
            get certified professional installation at your doorstep within 60 minutes.
          </p>

          {/* Buttons: For Individual & For Business with icons */}
          <motion.div
            className="flex items-center gap-3.5 mb-9 max-sm:flex-col max-sm:items-stretch"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {/* For Individual Button */}
            <button
              type="button"
              onClick={handleIndividualClick}
              disabled={isCheckingAuth}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#4361EE] hover:bg-[#3451de] text-white rounded-3xl text-sm font-semibold shadow-[0_2px_10px_rgba(67,97,238,0.3)] hover:shadow-[0_4px_16px_rgba(67,97,238,0.4)] hover:-translate-y-0.5 transition-all cursor-pointer border-none disabled:opacity-80 disabled:cursor-wait"
            >
              {isCheckingAuth ? (
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              )}
              <span>{isCheckingAuth ? 'Verifying...' : 'For Individual'}</span>
            </button>

            {/* For Business Button */}
            <button
              type="button"
              onClick={() => setIsBusinessModalOpen(true)}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-white text-gray-800 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-3xl text-sm font-semibold shadow-xs hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              <span>For Business</span>
            </button>
          </motion.div>

          {/* Features */}
          <motion.div
            className="flex gap-10 max-sm:flex-col max-sm:gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.55 }}
          >
            <div className="flex flex-col gap-0.5">
              <strong className="text-sm font-semibold text-gray-900">Compatible</strong>
              <span className="text-[13px] text-gray-400">device matching</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <strong className="text-sm font-semibold text-gray-900">Transparent</strong>
              <span className="text-[13px] text-gray-400">upfront pricing</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <strong className="text-sm font-semibold text-gray-900">Convenient</strong>
              <span className="text-[13px] text-gray-400">appointment slots</span>
            </div>
          </motion.div>
        </motion.div>

        {/* ── Right column ── */}
        <motion.div
          className="flex flex-col gap-3"
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
        >
          <div className="rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.08)] bg-white p-4">
            <Image
              src={customerImg}
              alt="Technician installing screen protector on phone"
              className="w-full h-auto block object-cover rounded-xl"
              priority
            />
          </div>

          <motion.div
            className="grid grid-cols-2 gap-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Link
              href="/book?step=1"
              className="bg-white border border-gray-200 rounded-xl p-4 px-5 flex flex-col gap-1 hover:shadow-md transition-shadow cursor-pointer no-underline text-inherit"
            >
              <span className="text-xs text-gray-400">From selection to booking</span>
              <strong className="text-sm font-semibold text-gray-900">A simple 3-step flow</strong>
            </Link>
            <Link
              href="/book?step=3"
              className="bg-white border border-gray-200 rounded-xl p-4 px-5 flex flex-col gap-1 hover:shadow-md transition-shadow cursor-pointer no-underline text-inherit"
            >
              <span className="text-xs text-gray-400">Demo availability</span>
              <strong className="text-sm font-semibold text-gray-900">Check your area</strong>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Business Inquiry Modal ── */}
      <AnimatePresence>
        {isBusinessModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsBusinessModalOpen(false)}
          >
            <motion.div
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden"
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsBusinessModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center cursor-pointer transition-colors border-none"
              >
                ✕
              </button>

              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#4361EE] flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>

              <span className="text-[11px] font-bold tracking-widest text-[#4361EE] uppercase block mb-1">
                CORPORATE & FLEET PROTECTION
              </span>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                ScreenCare for Business
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                Equip your company smartphones and team devices with certified doorstep screen protection and premium flip covers.
              </p>

              <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-2xl border border-gray-100 text-xs text-gray-700">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Bulk discounts for orders with 10+ devices</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>On-site office visits & certified batch installation</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>GST compliant corporate invoice & priority support</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/business"
                  className="flex-1 py-3 px-4 rounded-xl bg-[#4361EE] hover:bg-[#3451de] text-white text-sm font-semibold text-center no-underline transition-all shadow-xs flex items-center justify-center gap-1.5"
                >
                  <span>Open B2B Portal</span>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <a
                  href="tel:1800123456"
                  className="flex-1 py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold text-center border-none cursor-pointer transition-all no-underline flex items-center justify-center"
                >
                  Call 1800-123-456
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Toast Notification (Not Logged In) ── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3.5 px-6 py-4 bg-gray-900/95 backdrop-blur-md text-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-gray-700/60 font-sans pointer-events-auto"
          >
            <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-white m-0 leading-tight">Please Sign In</p>
              <p className="text-xs text-gray-300 m-0 mt-0.5">{toastMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
