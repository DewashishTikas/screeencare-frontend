import Image from 'next/image'
import Link from 'next/link'

// Server Component - rendered on server with zero client JS
export default function AuthHeader({ mode = 'signup' }) {
  const isSignup = mode === 'signup'

  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="max-w-[1200px] mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Brand Link */}
        <Link
          href="/"
          className="flex items-center gap-1.5 sm:gap-2.5 bg-transparent border-none cursor-pointer p-0 text-left no-underline group shrink-0"
        >
          <Image
            src="/logo.webp"
            alt="Apexguard"
            width={60}
            height={60}
            className="shrink-0 w-8 sm:w-[60px] h-auto"
          />
          <span className="text-sm sm:text-lg font-bold text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors whitespace-nowrap">
            Apexguard
          </span>
        </Link>

        {/* Mode Navigation Switcher Link */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm shrink-0">
          <span className="text-gray-500 whitespace-nowrap">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}
          </span>
          <Link
            href={isSignup ? '/login' : '/signup'}
            className="text-[#2563EB] hover:text-[#1d4ed8] font-semibold transition-colors no-underline whitespace-nowrap"
          >
            {isSignup ? 'Sign in' : 'Create account'}
          </Link>
        </div>
      </div>
    </header>
  )
}
