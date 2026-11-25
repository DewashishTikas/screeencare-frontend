'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../_context/AuthContext'

const colorMap = {
  yellow: {
    gradient: 'from-[#F59E0B] via-[#EAB308] to-[#D97706]',
    shadow: 'hover:shadow-[0_16px_36px_rgba(245,158,11,0.28)]',
    accentText: 'text-[#D97706]',
    badgeDefault: 'bg-amber-50 text-amber-600',
  },
  purple: {
    gradient: 'from-[#7C3AED] via-[#8B5CF6] to-[#5B21B6]',
    shadow: 'hover:shadow-[0_16px_36px_rgba(124,58,237,0.28)]',
    accentText: 'text-[#7C3AED]',
    badgeDefault: 'bg-purple-50 text-purple-600',
  },
  orange: {
    gradient: 'from-[#EA580C] via-[#F97316] to-[#C2410C]',
    shadow: 'hover:shadow-[0_16px_36px_rgba(234,88,12,0.28)]',
    accentText: 'text-[#EA580C]',
    badgeDefault: 'bg-orange-50 text-orange-600',
  },
}

function AboutBubbleCard({ color = 'yellow', children, className = '' }) {
  const cardRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const [coords, setCoords] = useState({ x: 0, y: 0 })

  const handleMouseEnter = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  const currentTheme = colorMap[color] || colorMap.yellow

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative overflow-hidden bg-white rounded-2xl border border-gray-200/90 shadow-sm transition-all duration-300 cursor-default hover:border-transparent ${currentTheme.shadow} ${className}`}
    >
      {/* Spreading cursor-origin bubble */}
      <span
        className={`absolute rounded-full bg-gradient-to-br ${currentTheme.gradient} pointer-events-none z-0`}
        style={{
          left: `${coords.x}px`,
          top: `${coords.y}px`,
          width: '950px',
          height: '950px',
          transform: isHovered
            ? 'translate(-50%, -50%) scale(1)'
            : 'translate(-50%, -50%) scale(0)',
          opacity: isHovered ? 1 : 0,
          transition: 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease',
        }}
      />

      {/* Floating subtle translucent glass bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <span
          className="absolute bottom-[-15px] left-[15%] w-7 h-7 rounded-full bg-white/20 border border-white/40 shadow-inner pointer-events-none"
          style={{
            transform: isHovered ? 'translateY(-140px) scale(1.1)' : 'translateY(0) scale(0)',
            opacity: isHovered ? 0.9 : 0,
            transition: 'transform 0.85s ease-out 0.1s, opacity 0.4s ease 0.1s',
          }}
        />
        <span
          className="absolute bottom-[-25px] left-[50%] w-11 h-11 rounded-full bg-white/15 border border-white/30 shadow-inner pointer-events-none"
          style={{
            transform: isHovered ? 'translateY(-190px) scale(0.95)' : 'translateY(0) scale(0)',
            opacity: isHovered ? 0.8 : 0,
            transition: 'transform 1s ease-out 0.15s, opacity 0.4s ease 0.15s',
          }}
        />
        <span
          className="absolute bottom-[-10px] left-[80%] w-6 h-6 rounded-full bg-white/25 border border-white/50 shadow-inner pointer-events-none"
          style={{
            transform: isHovered ? 'translateY(-160px) scale(1.2)' : 'translateY(0) scale(0)',
            opacity: isHovered ? 0.9 : 0,
            transition: 'transform 0.9s ease-out 0.05s, opacity 0.4s ease 0.05s',
          }}
        />
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 h-full flex flex-col justify-between">
        {typeof children === 'function' ? children(isHovered, currentTheme) : children}
      </div>
    </div>
  )
}

export default function AboutPage() {
  const router = useRouter()
  const { user } = useAuth()

  const handleBookClick = () => {
    if (!user) {
      router.push('/login?redirect=/book?step=1')
    } else {
      router.push('/book?step=1')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      {/* ── 1. Hero Banner ── */}
      <section className="bg-gradient-to-b from-blue-50/70 via-white to-gray-50 pt-16 pb-20 px-6 border-b border-gray-100">
        <div className="max-w-[1000px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100/70 text-[#2563EB] text-xs font-bold px-3.5 py-1.5 rounded-full mb-6 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Guaranteed Service Within 1 Hour</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-[1.18] mb-6 font-heading">
            Professional Screen Protection, <br className="hidden sm:inline" />
            At Your Doorstep <span className="text-[#4361EE]">In Under 60 Minutes</span>.
          </h1>

          <p className="text-base sm:text-lg text-gray-600 max-w-[720px] mx-auto leading-relaxed mb-10">
            No more waiting in phone repair lines. No more frustrating dust bubbles from DIY kits.
            Apexguard dispatches verified, certified technicians equipped with mobile dust-free kits
            straight to your home, office, or coffee shop in 60 minutes or less.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button
              type="button"
              onClick={handleBookClick}
              className="px-8 py-3.5 bg-[#4361EE] hover:bg-[#3451de] text-white rounded-full font-semibold text-sm shadow-[0_4px_16px_rgba(67,97,238,0.3)] hover:shadow-[0_6px_20px_rgba(67,97,238,0.4)] hover:-translate-y-0.5 transition-all cursor-pointer border-none"
            >
              Book 1-Hour Installation
            </button>
            <Link
              href="/track"
              className="px-7 py-3.5 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 rounded-full font-semibold text-sm transition-all no-underline shadow-xs"
            >
              Track Existing Order
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2. Card Group 1: The 1-Hour Doorstep Promise ── */}
      <section className="max-w-[1140px] mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-wider text-[#4361EE] uppercase block mb-2">
            HOW WE DO IT IN 60 MINUTES
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight font-heading">
            From tap to doorstep in 3 precise steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 - Yellow Bubble */}
          <AboutBubbleCard color="yellow" className="p-8">
            {(isHovered, theme) => (
              <>
                <div
                  className={`w-12 h-12 rounded-xl font-bold text-lg flex items-center justify-center mb-6 transition-colors duration-300 shadow-xs ${isHovered
                      ? `bg-white ${theme.accentText}`
                      : theme.badgeDefault
                    }`}
                >
                  01
                </div>
                <div>
                  <h3
                    className={`text-lg font-bold mt-3 mb-2 font-heading transition-colors duration-300 ${isHovered ? 'text-white' : 'text-gray-900'
                      }`}
                  >
                    Instant Smart Dispatch
                  </h3>
                  <p
                    className={`text-sm leading-relaxed transition-colors duration-300 m-0 ${isHovered ? 'text-white/90' : 'text-gray-500'
                      }`}
                  >
                    Select your device and Guardex instantly matches your order with the nearest available stock of its exact tempered glass and flip cover, ensuring the right protection is ready to go.
                  </p>
                </div>
              </>
            )}
          </AboutBubbleCard>

          {/* Step 2 - Purple Bubble */}
          <AboutBubbleCard color="purple" className="p-8">
            {(isHovered, theme) => (
              <>
                <div
                  className={`w-12 h-12 rounded-xl font-bold text-lg flex items-center justify-center mb-6 transition-colors duration-300 shadow-xs ${isHovered
                      ? `bg-white ${theme.accentText}`
                      : theme.badgeDefault
                    }`}
                >
                  02
                </div>
                <div>
                  <h3
                    className={`text-lg font-bold mt-3 mb-2 font-heading transition-colors duration-300 ${isHovered ? 'text-white' : 'text-gray-900'
                      }`}
                  >
                    Protection On The Move
                  </h3>
                  <p
                    className={`text-sm leading-relaxed transition-colors duration-300 m-0 ${isHovered ? 'text-white/90' : 'text-gray-500'
                      }`}
                  >
                    Your order is dispatched directly to your doorstep, with real-time SMS updates and live tracking so you always know when your screen and device protection will arrive.
                  </p>
                </div>
              </>
            )}
          </AboutBubbleCard>

          {/* Step 3 - Orange Bubble */}
          <AboutBubbleCard color="orange" className="p-8">
            {(isHovered, theme) => (
              <>
                <div
                  className={`w-12 h-12 rounded-xl font-bold text-lg flex items-center justify-center mb-6 transition-colors duration-300 shadow-xs ${isHovered
                      ? `bg-white ${theme.accentText}`
                      : theme.badgeDefault
                    }`}
                >
                  03
                </div>
                <div>
                  <h3
                    className={`text-lg font-bold mt-3 mb-2 font-heading transition-colors duration-300 ${isHovered ? 'text-white' : 'text-gray-900'
                      }`}
                  >
                    Perfect Fit. Complete Protection.
                  </h3>
                  <p
                    className={`text-sm leading-relaxed transition-colors duration-300 m-0 ${isHovered ? 'text-white/90' : 'text-gray-500'
                      }`}
                  >
                    Our technician carefully installs your tempered glass with precise alignment and fits your flip cover securely, giving your device a clean finish and complete everyday protection.
                  </p>
                </div>
              </>
            )}
          </AboutBubbleCard>
        </div>
      </section>

      {/* ── 3. Card Group 2: Why Choose Apexguard (Trust Metrics) ── */}
      <section className="bg-white py-20 px-6 border-y border-gray-200/80">
        <div className="max-w-[1140px] mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold tracking-wider text-[#4361EE] uppercase block mb-2">
              WHY THOUSANDS TRUST US
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight font-heading">
              The gold standard in device care
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {/* Stat 1 - Purple Bubble */}
            <AboutBubbleCard color="purple" className="p-6">
              {(isHovered) => (
                <div className="flex flex-col items-center justify-center">
                  <span
                    className={`text-3xl sm:text-4xl font-extrabold block mb-2 font-heading transition-colors duration-300 ${isHovered ? 'text-white' : 'text-[#7C3AED]'
                      }`}
                  >
                    &lt; 60m
                  </span>
                  <h4
                    className={`font-bold text-sm mb-1 transition-colors duration-300 ${isHovered ? 'text-white' : 'text-gray-900'
                      }`}
                  >
                    Doorstep Arrival
                  </h4>
                  <p
                    className={`text-xs transition-colors duration-300 m-0 ${isHovered ? 'text-white/90' : 'text-gray-500'
                      }`}
                  >
                    Average technician arrival across all active zones
                  </p>
                </div>
              )}
            </AboutBubbleCard>

            {/* Stat 2 - Orange Bubble */}
            <AboutBubbleCard color="orange" className="p-6">
              {(isHovered) => (
                <div className="flex flex-col items-center justify-center">
                  <span
                    className={`text-3xl sm:text-4xl font-extrabold block mb-2 font-heading transition-colors duration-300 ${isHovered ? 'text-white' : 'text-orange-500'
                      }`}
                  >
                    99.8%
                  </span>
                  <h4
                    className={`font-bold text-sm mb-1 transition-colors duration-300 ${isHovered ? 'text-white' : 'text-gray-900'
                      }`}
                  >
                    Bubble-Free Rate
                  </h4>
                  <p
                    className={`text-xs transition-colors duration-300 m-0 ${isHovered ? 'text-white/90' : 'text-gray-500'
                      }`}
                  >
                    First-time zero-defect installation accuracy
                  </p>
                </div>
              )}
            </AboutBubbleCard>

            {/* Stat 3 - Yellow Bubble */}
            <AboutBubbleCard color="yellow" className="p-6">
              {(isHovered) => (
                <div className="flex flex-col items-center justify-center">
                  <span
                    className={`text-3xl sm:text-4xl font-extrabold block mb-2 font-heading transition-colors duration-300 ${isHovered ? 'text-white' : 'text-amber-500'
                      }`}
                  >
                    100%
                  </span>
                  <h4
                    className={`font-bold text-sm mb-1 transition-colors duration-300 ${isHovered ? 'text-white' : 'text-gray-900'
                      }`}
                  >
                    On-Spot Guarantee
                  </h4>
                  <p
                    className={`text-xs transition-colors duration-300 m-0 ${isHovered ? 'text-white/90' : 'text-gray-500'
                      }`}
                  >
                    Instant re-application if you are not completely satisfied
                  </p>
                </div>
              )}
            </AboutBubbleCard>

            {/* Stat 4 - Purple Bubble */}
            <AboutBubbleCard color="purple" className="p-6">
              {(isHovered) => (
                <div className="flex flex-col items-center justify-center">
                  <span
                    className={`text-3xl sm:text-4xl font-extrabold block mb-2 font-heading transition-colors duration-300 ${isHovered ? 'text-white' : 'text-[#7C3AED]'
                      }`}
                  >
                    4.9 ★
                  </span>
                  <h4
                    className={`font-bold text-sm mb-1 transition-colors duration-300 ${isHovered ? 'text-white' : 'text-gray-900'
                      }`}
                  >
                    Customer Rating
                  </h4>
                  <p
                    className={`text-xs transition-colors duration-300 m-0 ${isHovered ? 'text-white/90' : 'text-gray-500'
                      }`}
                  >
                    Based on thousands of certified installations
                  </p>
                </div>
              )}
            </AboutBubbleCard>
          </div>
        </div>
      </section>

      {/* ── 4. Bottom CTA ── */}
      <section className="max-w-[1000px] mx-auto mt-20 px-6">
        <div className="bg-[#4361EE] rounded-3xl p-8 sm:p-14 text-white text-center shadow-[0_16px_40px_rgba(67,97,238,0.25)] relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-4xl font-bold mb-4 font-heading">
              Need your phone protected right now?
            </h2>
            <p className="text-blue-100 text-sm sm:text-base max-w-[540px] mx-auto mb-8 leading-relaxed">
              Book in 30 seconds. A certified installer will arrive at your address with the exact protector for your device within 1 hour.
            </p>
            <button
              type="button"
              onClick={handleBookClick}
              className="px-8 py-3.5 bg-white text-[#4361EE] hover:bg-gray-100 rounded-full font-bold text-sm shadow-md hover:-translate-y-0.5 transition-all cursor-pointer border-none"
            >
              Book Doorstep Installation
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
