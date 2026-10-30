'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import GoogleButton from '../GoogleButton'

// Client Component - only hydrated where interactive state and browser events are required
export default function AuthForm({ mode = 'signup' }) {
  const router = useRouter()
  const isSignup = mode === 'signup'

  // Form states
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSignup) {
      console.log(`${process.env.NEXT_PUBLIC_BACKENDURL}/auth/register`);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKENDURL}/auth/register`, {
        method: 'POST',
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          name: fullName, email, password
        })
      })
      if (res.status == 201) {
        setTimeout(() => {
          router.push('/login')
        }, 1000);
      }
      else if(res.status == 409){
        // toast message user already exist
      }
      else {
        console.log('Something went wrong');
      }
    } else {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKENDURL}/auth/login`, {
        method: 'POST',
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
           email, password
        })
      })
      const data = res.json()
      console.log(data);
      if (res.status == 201) {
        setTimeout(() => {
          router.push('/')
        }, 1000);
      }
      else if (res.status == 401){
        // Toast message Invalid credentials
      }
      else {
        console.log('Something went wrong');
      }
    }
  }

  const handleGoogleAuth = () => {
    alert(`Connecting with Google identity services... (Protocol verified)`)
    router.push('/book?step=1')
  }

  return (
    <div className="p-8 md:p-12 flex flex-col justify-center bg-white">
      <span className="block text-xs font-bold tracking-wider text-[#2563EB] uppercase mb-1.5">
        WELCOME TO SCREENCARE
      </span>

      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-1.5">
          {isSignup ? 'Create your account' : 'Sign in to your account'}
        </h1>
        <p className="text-xs md:text-sm text-gray-500 mb-6">
          {isSignup
            ? 'Save your details for a smoother booking and simple installation updates.'
            : 'Enter your email and password to access your bookings.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ── Full Name Field (Sign Up Only) ── */}
          {isSignup && (
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">
                Full name
              </label>
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 border border-gray-200 rounded-xl bg-gray-50/40 focus-within:bg-white focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#2563EB]/10 transition-all">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#9CA3AF"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <input
                  type="text"
                  required={isSignup}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full border-none outline-none text-sm text-gray-800 placeholder:text-gray-400 bg-transparent font-sans"
                />
              </div>
            </div>
          )}

          {/* ── Email Address Field ── */}
          <div>
            <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1.5">
              Email address
            </label>
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 border border-gray-200 rounded-xl bg-gray-50/40 focus-within:bg-white focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#2563EB]/10 transition-all">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9CA3AF"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 7l-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border-none outline-none text-sm text-gray-800 placeholder:text-gray-400 bg-transparent font-sans"
              />
            </div>
          </div>

          {/* ── Password Field ── */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide">
                {isSignup ? 'Create password' : 'Password'}
              </label>
              {!isSignup && (
                <Link
                  href="/forgot-password"
                  onClick={(e) => {
                    e.preventDefault()
                    alert('Password reset link sent to your email.')
                  }}
                  className="text-xs text-[#2563EB] hover:underline font-semibold no-underline"
                >
                  Forgot password?
                </Link>
              )}
            </div>
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 border border-gray-200 rounded-xl bg-gray-50/40 focus-within:bg-white focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#2563EB]/10 transition-all">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9CA3AF"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isSignup ? 'At least 8 characters' : 'Enter your password'}
                className="w-full border-none outline-none text-sm text-gray-800 placeholder:text-gray-400 bg-transparent font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer p-0"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {isSignup && (
              <p className="text-[11px] text-gray-400 mt-1.5 m-0">
                Use 8 or more characters with a mix of letters and numbers.
              </p>
            )}
          </div>

          {/* ── Submit Button ── */}
          <button
            type="submit"
            className="w-full py-3 bg-[#2563EB] hover:bg-[#1d4ed8] active:bg-[#1e40af] text-white font-bold rounded-xl text-sm transition-all shadow-[0_2px_8px_rgba(37,99,235,0.25)] hover:shadow-[0_4px_14px_rgba(37,99,235,0.35)] hover:-translate-y-0.5 border-none cursor-pointer mt-2"
          >
            {isSignup ? 'Create account' : 'Sign in'}
          </button>
        </form>

        {/* ── Divider ── */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-gray-400 font-semibold tracking-wider uppercase text-[11px]">
              OR CONTINUE WITH
            </span>
          </div>
        </div>

        {/* ── Google Official Protocol Button ── */}
        <GoogleButton
          label={isSignup ? 'Continue with Google' : 'Sign in with Google'}
          onClick={handleGoogleAuth}
        />

        {/* ── Secondary Bottom Navigation Switcher Link ── */}
        <div className="text-center mt-5 text-xs text-gray-500">
          <span>
            {isSignup ? 'Already have an account? ' : "Don't have an account? "}
          </span>
          <Link
            href={isSignup ? '/login' : '/signup'}
            className="text-[#2563EB] font-bold hover:underline no-underline"
          >
            {isSignup ? 'Sign in' : 'Create account'}
          </Link>
        </div>
      </div>
    </div>
  )
}
