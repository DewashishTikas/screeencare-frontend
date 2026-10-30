'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import GoogleButton from '../GoogleButton'
import { useAuth } from '../../_context/AuthContext'

// Client Component - interactive state and Google auth popup handling
export default function AuthForm({ mode = 'signup' }) {
  const router = useRouter()
  const { checkAuth } = useAuth()
  const isSignup = mode === 'signup'

  // Form states
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const popupRef = useRef(null)

  // Initialize URL search params and Google Identity Services if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const errorParam = params.get('error')
      if (errorParam === 'passfail') {
        setErrorMessage('This account is registered with a password. Please sign in with your email and password.')
      } else if (errorParam === 'fail') {
        setErrorMessage('Google authentication was cancelled or failed.')
      }
    }

    // Optional: Load Google Identity Services client script for additional GSI support
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    if (!clientId) return

    const scriptId = 'google-gsi-client-script'
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script')
      script.id = scriptId
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.onload = () => {
        if (window.google?.accounts?.id) {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: async (response) => {
              if (response?.credential) {
                setGoogleLoading(true)
                setErrorMessage('')
                try {
                  const backendUrl = process.env.NEXT_PUBLIC_BACKENDURL || 'http://localhost:4000'
                  const res = await fetch(`${backendUrl}/auth/googleImplicit`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ idToken: response.credential }),
                  })
                  const data = await res.json()
                  if (res.ok) {
                    setSuccessMessage('Signed in with Google successfully!')
                    setTimeout(() => {
                      router.push('/')
                      router.refresh()
                    }, 800)
                  } else {
                    setErrorMessage(data?.error || 'Google sign-in failed.')
                  }
                } catch (err) {
                  console.error('Google implicit login error:', err)
                  setErrorMessage('Unable to connect to authentication server.')
                } finally {
                  setGoogleLoading(false)
                }
              }
            },
          })
        }
      }
      document.body.appendChild(script)
    }
  }, [router])

  // Email/Password Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    setLoading(true)

    const backendUrl = process.env.NEXT_PUBLIC_BACKENDURL || 'http://localhost:4000'

    try {
      if (isSignup) {
        const res = await fetch(`${backendUrl}/auth/register`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            name: fullName,
            email,
            password,
          }),
        })
        const data = await res.json().catch(() => ({}))

        if (res.status === 201 || res.status === 200) {
          setSuccessMessage('Account created successfully! Redirecting to login...')
          setTimeout(() => {
            router.push('/login')
          }, 1000)
        } else if (res.status === 409) {
          setErrorMessage(data?.error || 'User with this email already exists.')
        } else {
          setErrorMessage(data?.error || 'Registration failed. Please check your details.')
        }
      } else {
        const res = await fetch(`${backendUrl}/auth/login`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            email,
            password,
          }),
        })
        const data = await res.json().catch(() => ({}))

        if (res.status === 200 || res.status === 201) {
          await checkAuth()
          setSuccessMessage('Signed in successfully! Redirecting...')
          const target = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('redirect') || '/' : '/'
          setTimeout(() => {
            router.push(target)
            router.refresh()
          }, 800)
        } else if (res.status === 401 || res.status === 403) {
          setErrorMessage(data?.error || 'Invalid email or password.')
        } else {
          setErrorMessage(data?.error || 'Login failed. Please check your credentials.')
        }
      }
    } catch (err) {
      console.error('Auth error:', err)
      setErrorMessage('Could not connect to the server. Please ensure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  // Google Sign-In with Popup Handler
  const handleGoogleAuth = () => {
    setErrorMessage('')
    setSuccessMessage('')
    setGoogleLoading(true)

    const backendUrl = process.env.NEXT_PUBLIC_BACKENDURL || 'http://localhost:4000'

    // Centered popup geometry
    const width = 500
    const height = 650
    const left = window.screenX + Math.max(0, (window.outerWidth - width) / 2)
    const top = window.screenY + Math.max(0, (window.outerHeight - height) / 2)

    // Open backend Google OAuth flow endpoint in popup
    const popup = window.open(
      `${backendUrl}/auth/google`,
      'ScreenCareGoogleAuth',
      `width=${width},height=${height},left=${left},top=${top},status=no,menubar=no,toolbar=no`
    )
    popupRef.current = popup

    // If popup blocked by browser settings, fallback to redirect
    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      console.warn('Popup blocked by browser. Redirecting directly to Google login.')
      window.location.href = `${backendUrl}/auth/google`
      return
    }

    if (popup.focus) {
      popup.focus()
    }

    // Success and error handlers
    const handleAuthSuccess = async () => {
      cleanup()
      await checkAuth()
      setSuccessMessage('Signed in with Google successfully! Redirecting...')
      const target = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('redirect') || '/' : '/'
      setTimeout(() => {
        router.push(target)
        router.refresh()
      }, 700)
    }

    const handleAuthError = (msg) => {
      cleanup()
      setErrorMessage(msg || 'Google authentication failed.')
    }

    // 1. BroadcastChannel listener (works even if window.opener is disconnected by browser COOP)
    let channel = null
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        channel = new BroadcastChannel('screencare_auth')
        channel.onmessage = (event) => {
          if (event.data?.type === 'GOOGLE_AUTH_SUCCESS') {
            handleAuthSuccess()
          } else if (event.data?.type === 'GOOGLE_AUTH_ERROR') {
            handleAuthError(event.data.message)
          }
        }
      }
    } catch (e) {
      console.warn('BroadcastChannel not supported', e)
    }

    // 2. Storage event listener (fallback cross-window listener on same origin)
    const handleStorage = (event) => {
      if (event.key === 'screencare_auth_event' && event.newValue) {
        try {
          const data = JSON.parse(event.newValue)
          if (data.type === 'GOOGLE_AUTH_SUCCESS') {
            handleAuthSuccess()
          } else if (data.type === 'GOOGLE_AUTH_ERROR') {
            handleAuthError(data.message)
          }
        } catch {}
      }
    }
    window.addEventListener('storage', handleStorage)

    // 3. postMessage listener
    const handleMessage = (event) => {
      if (event.data?.type === 'GOOGLE_AUTH_SUCCESS') {
        handleAuthSuccess()
      } else if (event.data?.type === 'GOOGLE_AUTH_ERROR') {
        handleAuthError(event.data.message)
      }
    }
    window.addEventListener('message', handleMessage)

    // Monitor popup close event (e.g. user manually dismissed without finishing)
    const checkClosedInterval = setInterval(() => {
      if (popupRef.current && popupRef.current.closed) {
        cleanup()
      }
    }, 500)

    const cleanup = () => {
      window.removeEventListener('message', handleMessage)
      window.removeEventListener('storage', handleStorage)
      if (channel) {
        try {
          channel.close()
        } catch {}
      }
      clearInterval(checkClosedInterval)
      setGoogleLoading(false)
    }
  }

  return (
    <div className="p-8 md:p-12 flex flex-col justify-center bg-white" suppressHydrationWarning>
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

        {/* ── Status Banners ── */}
        {errorMessage && (
          <div className="mb-4 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2 animate-fadeIn">
            <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3.5 bg-green-50 border border-green-200 text-green-700 text-xs rounded-xl flex items-start gap-2 animate-fadeIn">
            <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" suppressHydrationWarning>
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
            disabled={loading}
            suppressHydrationWarning
            className="w-full py-3 bg-[#2563EB] hover:bg-[#1d4ed8] active:bg-[#1e40af] disabled:opacity-70 text-white font-bold rounded-xl text-sm transition-all shadow-[0_2px_8px_rgba(37,99,235,0.25)] hover:shadow-[0_4px_14px_rgba(37,99,235,0.35)] hover:-translate-y-0.5 border-none cursor-pointer mt-2 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{isSignup ? 'Creating account...' : 'Signing in...'}</span>
              </>
            ) : (
              <span>{isSignup ? 'Create account' : 'Sign in'}</span>
            )}
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

        {/* ── Google Official Protocol Button (with Popup & Loading state) ── */}
        <GoogleButton
          label={isSignup ? 'Continue with Google' : 'Sign in with Google'}
          onClick={handleGoogleAuth}
          loading={googleLoading}
          disabled={loading || googleLoading}
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
