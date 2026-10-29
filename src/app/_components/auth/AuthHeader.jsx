import Link from 'next/link'

// Server Component - rendered on server with zero client JS
export default function AuthHeader({ mode = 'signup' }) {
  const isSignup = mode === 'signup'

  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand Link */}
        <Link
          href="/"
          className="flex items-center gap-2.5 bg-transparent border-none cursor-pointer p-0 text-left no-underline group"
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="7" fill="#2563EB" />
            <path
              d="M8 14.5L11.5 18L20 9.5"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-lg font-bold text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors">
            ScreenCare
          </span>
        </Link>

        {/* Mode Navigation Switcher Link */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}
          </span>
          <Link
            href={isSignup ? '/login' : '/signup'}
            className="text-[#2563EB] hover:text-[#1d4ed8] font-semibold transition-colors no-underline"
          >
            {isSignup ? 'Sign in' : 'Create account'}
          </Link>
        </div>
      </div>
    </header>
  )
}
