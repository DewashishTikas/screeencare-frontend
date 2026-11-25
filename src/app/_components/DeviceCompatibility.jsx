'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'

export const BRANDS = [
  {
    id: 'apple',
    name: 'Apple',
    logoSrc: '/apple-logo.webp',
    logoAlt: 'Apple',
  },
  {
    id: 'samsung',
    name: 'Samsung',
    logoSrc: '/samsung-logo.png',
    logoAlt: 'Samsung',
  },
  {
    id: 'infinix',
    name: 'Infinix',
    logoSrc: '/infinix-logo.jpg',
    logoAlt: 'Infinix',
  },
  {
    id: 'oppo',
    name: 'Oppo',
    logoSrc: '/oppo-logo.svg',
    logoAlt: 'Oppo',
  },
  {
    id: 'poco',
    name: 'Poco',
    logoSrc: '/poco-logo.webp',
    logoAlt: 'Poco',
  },
  {
    id: 'redmi',
    name: 'Redmi',
    logoSrc: '/redmi-logo.webp',
    logoAlt: 'Redmi',
  },
]

export default function DeviceCompatibility() {
  const [selectedBrand, setSelectedBrand] = useState('apple')
  const sectionRef = useRef(null)
  const trackRef = useRef(null)

  // Track vertical scroll progress across this pinned section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Fixed horizontal scrolling: as user scrolls down, the cards smoothly slide to the right
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-48%'])
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['16%', '100%'])

  const scrollToBuyInstallation = (brandId) => {
    if (brandId) {
      setSelectedBrand(brandId)
    }
    const targetEl = document.getElementById('book-installation') || document.getElementById('buy-installation') || document.getElementById('product-categories')
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' })
      window.history.pushState(null, '', '#book-installation')
    }
  }

  const scrollManual = (direction) => {
    if (trackRef.current) {
      const amount = direction === 'left' ? -280 : 280
      trackRef.current.scrollBy({ left: amount, behavior: 'smooth' })
    }
  }

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[170vh] sm:min-h-[190vh] bg-white border-t border-gray-100"
      id="device-compatibility"
    >
      {/* Anchor for backward compatibility */}
      <div id="book" className="absolute -top-16" />

      {/* ── Sticky Viewport Container: Fixed on screen while scrolling down ── */}
      <div className="sticky top-16 h-[calc(100vh-4rem)] flex flex-col justify-center items-center py-4 sm:py-6 overflow-hidden bg-white/98 backdrop-blur-md">
        <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 flex flex-col justify-between h-full max-h-[640px]">
          {/* ── Top Header matching the user's screenshot ── */}
          <div className="text-center max-w-2xl mx-auto pt-2">
            <span className="block text-[11px] sm:text-[12px] font-bold tracking-[0.2em] text-[#2563EB] uppercase mb-2">
              DEVICE COMPATIBILITY
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight font-heading mb-2">
              Compatible with Your Device
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto leading-relaxed m-0">
              Select your brand below to view premium tempered glass and flip covers built precisely for your model.
            </p>

            {/* Scroll Indicator & Manual Nav Arrows */}
            <div className="mt-3 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => scrollManual('left')}
                className="w-7 h-7 rounded-full border border-gray-200 bg-white hover:bg-gray-100 text-gray-600 flex items-center justify-center text-xs transition-colors cursor-pointer"
                title="Scroll left"
              >
                ←
              </button>
              <div className="w-36 h-1 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  style={{ width: progressWidth }}
                  className="h-full bg-[#2563EB] rounded-full"
                />
              </div>
              <button
                type="button"
                onClick={() => scrollManual('right')}
                className="w-7 h-7 rounded-full border border-gray-200 bg-white hover:bg-gray-100 text-gray-600 flex items-center justify-center text-xs transition-colors cursor-pointer"
                title="Scroll right"
              >
                →
              </button>
            </div>
          </div>

          {/* ── Fixed Horizontal Scrolling Track ── */}
          {/* Clean minimal cards: Logo + Smartphone Icon + Brand Name (No description, No models, No tagging) */}
          <div
            ref={trackRef}
            className="w-full overflow-x-auto overflow-y-hidden py-4 scrollbar-none"
          >
            <motion.div
              style={{ x }}
              className="flex items-center gap-4 sm:gap-6 px-4 sm:px-8 w-max"
            >
              {BRANDS.map((brand) => {
                const isSelected = selectedBrand === brand.id

                return (
                  <div
                    key={brand.id}
                    onClick={() => scrollToBuyInstallation(brand.id)}
                    className={`w-[210px] sm:w-[240px] md:w-[260px] h-[190px] sm:h-[210px] rounded-2xl bg-white border p-6 flex flex-col items-center justify-between transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1.5 cursor-pointer select-none group text-center ${
                      isSelected
                        ? 'border-[#2563EB] ring-2 ring-[#2563EB]/25 bg-blue-50/20'
                        : 'border-blue-100/90 hover:border-blue-300'
                    }`}
                  >


                    {/* Official Brand Logo from public/ */}
                    <div className="h-10 flex items-center justify-center my-auto px-2">
                      <Image
                        src={brand.logoSrc}
                        alt={brand.logoAlt}
                        width={120}
                        height={36}
                        className="max-h-20 w-auto object-contain transition-transform group-hover:scale-105 duration-300"
                      />
                    </div>

                    {/* Brand Name */}
                    <div className="pt-2 border-t border-gray-100/80 w-full">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 font-heading m-0 group-hover:text-[#2563EB] transition-colors">
                        {brand.name}
                      </h3>
                    </div>
                  </div>
                )
              })}
            </motion.div>
          </div>

          {/* ── Bottom CTA Button: Moves smoothly to Hero / Book Installation ── */}
          <div className="text-center pb-2">
            <Link
              href="#book-installation"
              onClick={(e) => {
                const targetEl = document.getElementById('book-installation')
                if (targetEl) {
                  e.preventDefault()
                  targetEl.scrollIntoView({ behavior: 'smooth' })
                  window.history.pushState(null, '', '#book-installation')
                }
              }}
              className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 sm:py-4 bg-[#2563EB] hover:bg-[#1d4ed8] active:bg-[#1e40af] text-white rounded-2xl text-sm sm:text-base font-bold shadow-[0_4px_16px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_22px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 transition-all cursor-pointer no-underline border-none"
            >
              <span>Select Your Phone Brand to Start</span>
              <span className="text-lg">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
