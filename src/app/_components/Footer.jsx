
'use client'

import { motion } from 'motion/react'
import Link from 'next/link'

export default function Footer() {
  return (
    <motion.footer
      className="bg-gray-100 border-t border-gray-200 py-10 px-6 max-sm:py-8 max-sm:px-4"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-[1200px] mx-auto flex items-center justify-between max-md:flex-col max-md:gap-6 max-md:text-center">
        <div className="flex flex-col gap-1">
          <strong className="text-base font-bold text-gray-900">ScreenCare</strong>
          <span className="text-[13px] text-gray-400">Doorstep screen-protector installation.</span>
        </div>
        <nav className="flex gap-7 max-md:flex-wrap max-md:justify-center max-md:gap-4">
          <Link href="/about" className="text-[13px] text-gray-500 no-underline hover:text-gray-900 transition-colors">
            About us
          </Link>
          <Link href="/contact" className="text-[13px] text-gray-500 no-underline hover:text-gray-900 transition-colors">
            Contact
          </Link>
          <Link href="/faqs" className="text-[13px] text-gray-500 no-underline hover:text-gray-900 transition-colors">
            FAQs
          </Link>
          <Link href="/cancellation" className="text-[13px] text-gray-500 no-underline hover:text-gray-900 transition-colors">
            Cancellation policy
          </Link>
          <Link href="/privacy" className="text-[13px] text-gray-500 no-underline hover:text-gray-900 transition-colors">
            Privacy
          </Link>
        </nav>
      </div>
    </motion.footer>
  )
}
