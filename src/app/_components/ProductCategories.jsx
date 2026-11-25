'use client'

import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../_context/AuthContext'
import Image from 'next/image'

export default function ProductCategories() {
  const router = useRouter()
  const { user } = useAuth()

  const handleCategoryClick = (category) => {
    const targetUrl = `/book?step=1&category=${category}`
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(targetUrl)}`)
    } else {
      router.push(targetUrl)
    }
  }

  return (
    <section
      className="py-20 px-6 bg-slate-50/60 border-t border-gray-100 relative"
      id="buy-installation"
    >
      {/* Secondary anchor for backwards compatibility */}
      <div id="product-categories" className="absolute -top-16" />

      <div className="max-w-[1200px] mx-auto w-full">
        {/* Header Section */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Eyebrow */}
          <span className="inline-block text-[12px] font-bold tracking-widest text-[#2563EB] uppercase mb-2.5">
            BUY INSTALLATION & PRODUCTS
          </span>

          {/* Heading */}
          <h2 className="text-3xl md:text-[38px] font-bold text-gray-900 tracking-tight leading-tight font-heading mb-3">
            Protect Your Phone, Your Way
          </h2>

          {/* Subtitle */}
          <p className="text-[15px] sm:text-base text-gray-500 leading-relaxed max-w-xl mx-auto mb-4">
            Select your preferred screen protection. Certified technician visits your doorstep to fit it with zero bubble guarantee.
          </p>

          {/* Brand Tagline */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50/90 border border-blue-200/60 text-xs font-semibold text-[#2563EB] shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
            <span className="tracking-wide">Guard it, Style it, Love it.</span>
          </div>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 lg:gap-8 w-full">
          {/* Card 1: Tempered Glass */}
          <motion.div
            onClick={() => handleCategoryClick('tempered-glass')}
            className="w-full bg-white rounded-3xl border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer group"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Visual Header - Full Width */}
            <div className="w-full relative overflow-hidden bg-gray-50/40">
              <Image
                src="/tempered-glass-category.png"
                alt="Tempered Glass"
                width={700}
                height={400}
                className="w-auto h-90 block object-cover group-hover:scale-102 transition-transform duration-500"
                priority
              />
            </div>

            {/* Content Details */}
            <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between bg-white border-t border-gray-100">
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900 font-heading">
                    Tempered Glass
                  </h3>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed font-sans m-0">
                  Crystal-clear 9H screen protection designed to guard your display from everyday scratches, drops, and impact.
                </p>
              </div>

            </div>
          </motion.div>

          {/* Card 2: Flip Covers */}
          <motion.div
            onClick={() => handleCategoryClick('flip-cover')}
            className="w-full bg-white rounded-3xl border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer group"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Visual Header - Full Width */}
            <div className="w-full relative overflow-hidden bg-gray-50/40">
              <Image
                src="/flip-cover-category.png"
                alt="Flip Covers"
                width={700}
                height={400}
                className="w-auto h-90 block object-cover group-hover:scale-102 transition-transform duration-500"
                priority
              />
            </div>

            {/* Content Details */}
            <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between bg-white border-t border-gray-100">
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900 font-heading">
                    Flip Covers
                  </h3>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed font-sans m-0">
                  Stylish, durable protection for your phone&apos;s screen, back, and edges — built for everyday luxury and grip.
                </p>
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
