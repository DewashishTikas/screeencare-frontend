'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../_context/AuthContext'

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

          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-[1.18] mb-6">
            Professional Screen Protection, <br className="hidden sm:inline" />
            At Your Doorstep <span className="text-[#4361EE]">In Under 60 Minutes</span>.
          </h1>

          <p className="text-base sm:text-lg text-gray-600 max-w-[720px] mx-auto leading-relaxed mb-10">
            No more waiting in phone repair lines. No more frustrating dust bubbles from DIY kits.
            ScreenCare dispatches verified, certified technicians equipped with mobile dust-free kits
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

      {/* ── 2. The 1-Hour Doorstep Promise ── */}
      <section className="max-w-[1140px] mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-wider text-[#4361EE] uppercase block mb-2">
            HOW WE DO IT IN 60 MINUTES
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            From tap to doorstep in 3 precise steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white p-8 rounded-2xl border border-gray-200/80 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#4361EE] font-bold text-lg flex items-center justify-center mb-6">
              01
            </div>
            <div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                Minute 0 – 5
              </span>
              <h3 className="text-lg font-bold text-gray-900 mt-3 mb-2">Instant Smart Dispatch</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                As soon as you select your device, our localized dispatch algorithm matches the nearest installer who already has your phone’s exact protector in stock.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-8 rounded-2xl border border-gray-200/80 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#4361EE] font-bold text-lg flex items-center justify-center mb-6">
              02
            </div>
            <div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                Minute 5 – 45
              </span>
              <h3 className="text-lg font-bold text-gray-900 mt-3 mb-2">Technician On The Move</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Our technician travels directly to your doorstep. You receive real-time SMS and map tracking so you know their arrival minute to the dot.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-8 rounded-2xl border border-gray-200/80 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#4361EE] font-bold text-lg flex items-center justify-center mb-6">
              03
            </div>
            <div>
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                Minute 45 – 60
              </span>
              <h3 className="text-lg font-bold text-gray-900 mt-3 mb-2">10-Minute Sterile Fitting</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Using microscopic dust-isolating jigs, the technician cleans and laser-aligns your glass with 100% bubble-free perfection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Why Choose ScreenCare ── */}
      <section className="bg-white py-20 px-6 border-y border-gray-200/80">
        <div className="max-w-[1140px] mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold tracking-wider text-[#4361EE] uppercase block mb-2">
              WHY THOUSANDS TRUST US
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              The gold standard in device care
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#4361EE] block mb-2">&lt; 60m</span>
              <h4 className="font-bold text-gray-900 text-sm mb-1">Doorstep Arrival</h4>
              <p className="text-xs text-gray-500">Average technician arrival across all active zones</p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-600 block mb-2">99.8%</span>
              <h4 className="font-bold text-gray-900 text-sm mb-1">Bubble-Free Rate</h4>
              <p className="text-xs text-gray-500">First-time zero-defect installation accuracy</p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#4361EE] block mb-2">100%</span>
              <h4 className="font-bold text-gray-900 text-sm mb-1">On-Spot Guarantee</h4>
              <p className="text-xs text-gray-500">Instant re-application if you are not completely satisfied</p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
              <span className="text-3xl sm:text-4xl font-extrabold text-amber-500 block mb-2">4.9 ★</span>
              <h4 className="font-bold text-gray-900 text-sm mb-1">Customer Rating</h4>
              <p className="text-xs text-gray-500">Based on thousands of certified installations</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Bottom CTA ── */}
      <section className="max-w-[1000px] mx-auto mt-20 px-6">
        <div className="bg-[#4361EE] rounded-3xl p-8 sm:p-14 text-white text-center shadow-[0_16px_40px_rgba(67,97,238,0.25)] relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-4xl font-bold mb-4">
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

