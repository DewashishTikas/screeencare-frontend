'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '../_context/AuthContext'
import Image from 'next/image'

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const { user, logout, loading } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNavClick = (anchorId) => {
    if (!isHomePage) {
      router.push(`/#${anchorId}`)
    } else {
      const el = document.getElementById(anchorId)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleBookClick = (e) => {
    e.preventDefault()
    if (!user) {
      router.push('/login?redirect=/book?step=1')
    } else {
      router.push('/book?step=1')
    }
  }

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }

  return (
    <nav className="w-full bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.03)] font-sans">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2.5 bg-transparent border-none cursor-pointer p-0 text-left no-underline"
        >
          <Image
            src="/logo.jpg"
            alt="ScreenCare"
            width={60}
            height={60}
            className="shrink-0"
          />
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
              href="/about"
              className="no-underline text-gray-500 text-[15px] font-[450] hover:text-gray-900 transition-colors flex items-center gap-1.5"
            >
              <span>About us</span>

            </Link>
          </li>
        </ul>

        {/* Actions (Sign in or Profile & Order Track) */}
        <div className="flex items-center gap-4">
          {!loading && user ? (
            <>
              {/* Order Track Button */}
              <Link
                href="/track"
                className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-gray-100/80 hover:bg-gray-200/70 rounded-xl transition-colors no-underline border border-gray-200/80"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                  <path d="M10 17h4V5H2v12h3m10 0h4a2 2 0 0 0 2-2v-4a2 2 0 0 0-.6-1.4L18 7h-3v10m-8 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm12 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
                </svg>
                <span>Track Order</span>
              </Link>

              {/* Book Installation CTA */}
              <Link
                href="/book?step=1"
                className="inline-flex items-center px-4 sm:px-5 py-2.5 bg-[#4361EE] text-white rounded-3xl text-sm font-medium hover:bg-[#3451de] hover:-translate-y-0.5 transition-all shadow-[0_2px_8px_rgba(67,97,238,0.25)] border-none cursor-pointer no-underline"
              >
                Book installation
              </Link>

              {/* User Profile Icon & Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#4361EE]/30 hover:border-[#4361EE] transition-all bg-blue-50 text-[#4361EE] font-bold text-sm overflow-hidden cursor-pointer shadow-xs"
                  aria-label="User account menu"
                >
                  {user.picture ? (
                    <Image
                      src={user.picture}
                      alt={user.name || 'User'}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <span>{getInitials(user.name)}</span>
                  )}
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-64 bg-white rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.12)] border border-gray-200/90 py-2.5 z-50 animate-fadeIn font-sans">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-[#4361EE] flex items-center justify-center font-bold text-sm shrink-0">
                        {user.picture ? (
                          <Image
                            src={user.picture}
                            alt=""
                            width={40}
                            height={40}
                            className="w-full h-full object-cover rounded-full"
                            unoptimized
                          />
                        ) : (
                          getInitials(user.name)
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-gray-900 truncate m-0 leading-tight">
                          {user.name || 'ScreenCare User'}
                        </p>
                        <p className="text-xs text-gray-500 truncate m-0 mt-0.5">
                          {user.email}
                        </p>
                        {user.role && (
                          <span className="inline-block mt-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#4361EE] border border-blue-100">
                            {user.role}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Links */}
                    <div className="py-1">
                      <Link
                        href="/track"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors no-underline"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                        </svg>
                        <span>Track Order</span>
                      </Link>

                      <Link
                        href="/technician"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-50 transition-colors no-underline"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                        </svg>
                        <span>Technician Portal</span>
                      </Link>

                      {user.role === 'admin' && (
                        <Link
                          href="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-indigo-700 hover:bg-indigo-50 transition-colors no-underline"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="7" height="7" rx="1" />
                            <rect x="14" y="3" width="7" height="7" rx="1" />
                            <rect x="3" y="14" width="7" height="7" rx="1" />
                            <rect x="14" y="14" width="7" height="7" rx="1" />
                          </svg>
                          <span>Admin Dashboard</span>
                        </Link>
                      )}
                    </div>

                    {/* Divider & Sign Out */}
                    <div className="pt-1 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => {
                          setDropdownOpen(false)
                          logout()
                          router.push('/login')
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors bg-transparent border-none cursor-pointer"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Not logged in: show Sign in & Book Installation */}
              <Link
                href="/login"
                className="text-sm font-semibold text-gray-600 hover:text-gray-950 transition-colors bg-transparent border-none cursor-pointer no-underline"
              >
                Sign in
              </Link>

              <button
                type="button"
                onClick={handleBookClick}
                className="inline-flex items-center px-5 py-2.5 bg-[#4361EE] text-white rounded-3xl text-sm font-medium hover:bg-[#3451de] hover:-translate-y-0.5 transition-all shadow-[0_2px_8px_rgba(67,97,238,0.25)] border-none cursor-pointer"
              >
                Book installation
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
