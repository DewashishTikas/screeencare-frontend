'use client'

import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import customerImg from '/public/hero-page.png'

export default function HeroSection() {
  const router = useRouter()

  return (
    <section className="bg-gray-50 py-16 px-6 md:py-20 sm:py-10 sm:px-4">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-15 items-center">
        {/* ── Left column ── */}
        <motion.div
          className="flex flex-col"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-3xl px-4 py-1.5 pl-2.5 text-[13px] font-medium text-gray-700 w-fit mb-6"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="8" fill="#4361EE" opacity="0.15" />
              <path d="M5 8L7 10L11 6" stroke="#4361EE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Careful installation at your doorstep</span>
          </motion.div>

          {/* Heading */}
          <h1 className="text-[44px] max-md:text-[34px] max-sm:text-[28px] font-bold leading-[1.15] tracking-tight text-gray-900 mb-5">
            A screen protector,<br />
            fitted at your doorstep.
          </h1>

          {/* Description */}
          <p className="text-base leading-relaxed text-gray-500 mb-7 max-w-[420px]">
            Choose a compatible protector, pick a convenient time, and
            get professional installation at a supported location.
          </p>

          {/* Buttons & Links */}
          <motion.div
            className="flex items-center gap-3 mb-9 max-sm:flex-col max-sm:items-start"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link
              href="/book?step=1"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#4361EE] text-white rounded-3xl text-sm font-medium no-underline shadow-[0_1px_3px_rgba(67,97,238,0.3)] hover:bg-[#3451de] hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(67,97,238,0.35)] transition-all"
            >
              <span>Book installation</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-3xl text-sm font-medium no-underline hover:border-gray-400 hover:bg-gray-50 transition-all"
            >
              How it works
            </Link>
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
    </section>
  )
}
