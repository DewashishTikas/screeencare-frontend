'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../_context/AuthContext'

export default function BookingSection() {
  const [modelQuery, setModelQuery] = useState('')
  const router = useRouter()
  const { user } = useAuth()

  const handleSubmit = (e) => {
    e.preventDefault()
    const query = modelQuery.trim()
    const bookUrl = query ? `/book?step=1&model=${encodeURIComponent(query)}` : '/book?step=1'
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(bookUrl)}`)
    } else {
      router.push(bookUrl)
    }
  }

  return (
    <section className="py-20 px-6 bg-white max-sm:py-14 max-sm:px-4" id="book">
      <div className="max-w-225 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span className="block text-[13px] font-semibold tracking-wide text-[#4361EE] uppercase mb-3">
            START A BOOKING
          </span>
          <h2 className="text-[28px] font-bold text-gray-900 mb-2 tracking-tight">
            Find your phone model
          </h2>
          <p className="text-[15px] text-gray-500 mb-8">
            We&apos;ll show only protectors designed for your device.
          </p>

          <motion.form
            onSubmit={handleSubmit}
            className="flex items-center gap-3 bg-white border border-gray-200 rounded-[14px] py-2 pr-2 pl-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] focus-within:border-[#4361EE] focus-within:shadow-[0_2px_12px_rgba(67,97,238,0.12)] transition-all max-sm:flex-col max-sm:p-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <div className="flex items-center gap-2.5 flex-1 max-sm:w-full max-sm:py-1">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
                <circle cx="9" cy="9" r="6" stroke="#9CA3AF" strokeWidth="1.5" />
                <path d="M14 14L18 18" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                value={modelQuery}
                onChange={(e) => setModelQuery(e.target.value)}
                placeholder="e.g., iPhone 15 Pro, Samsung S24..."
                className="w-full border-none outline-none text-base text-gray-900 placeholder:text-gray-400 bg-transparent font-sans"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center px-7 py-3 bg-[#4361EE] text-white rounded-xl text-sm font-medium border-none cursor-pointer shadow-[0_2px_6px_rgba(67,97,238,0.3)] hover:bg-[#3451de] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(67,97,238,0.35)] transition-all max-sm:w-full"
            >
              Check availability
            </button>
          </motion.form>
        </motion.div>
      </div>
    </section>
  )
}
