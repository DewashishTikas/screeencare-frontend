'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  const handleNavClick = (anchorId) => {
    if (!isHomePage) {
      router.push(`/#${anchorId}`)
    } else {
      const el = document.getElementById(anchorId)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav className="w-full bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2.5 bg-transparent border-none cursor-pointer p-0 text-left no-underline"
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="7" fill="#4361EE" />
            <path d="M8 14.5L11.5 18L20 9.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-lg font-bold text-gray-900 tracking-tight">ScreenCare</span>
        </Link>

        {/* Nav Links */}
        <ul className="hidden md:flex list-none m-0 p-0 items-center gap-8">
          <li>
            <button
              type="button"
              onClick={() => handleNavClick('how-it-works')}
              className="bg-transparent border-none cursor-pointer text-gray-500 text-[15px] font-[450] hover:text-gray-900 transition-colors p-0"
            >
              How it works
            </button>
          </li>
          <li>
            <Link
              href="/book?step=1"
              className="no-underline text-gray-500 text-[15px] font-[450] hover:text-gray-900 transition-colors"
            >
              Supported devices
            </Link>
          </li>
          <li>
            <p className="no-underline text-gray-500 text-[15px] font-[450] hover:text-gray-900 transition-colors flex items-center gap-1.5 m-0">
              <span className="text-gray-400">Need help?</span>
              <span className="font-semibold text-gray-800">1800-123-456</span>
            </p>
          </li>
        </ul>

        {/* Actions (Sign in + CTA) - Always in the same original state */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-semibold text-gray-600 hover:text-gray-950 transition-colors bg-transparent border-none cursor-pointer no-underline"
          >
            Sign in
          </Link>

          <Link
            href="/book?step=1"
            className="inline-flex items-center px-5 py-2.5 bg-[#4361EE] text-white rounded-3xl text-sm font-medium hover:bg-[#3451de] hover:-translate-y-0.5 transition-all shadow-[0_2px_8px_rgba(67,97,238,0.25)] border-none cursor-pointer no-underline"
          >
            Book installation
          </Link>
        </div>
      </div>
    </nav>
  )
}
