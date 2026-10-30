'use client'

/**
 * Google Sign-In Button following Google's official Identity Brand Guidelines:
 * - Official 4-color Google "G" logo (Blue #4285F4, Green #34A853, Yellow #FBBC05, Red #EA4335)
 * - Clear space and correct proportions (18x18px logo)
 * - Standard Roboto/system typography with #3c4043 neutral color
 * - Neutral border (#dadce0) with subtle elevation on hover
 */
export default function GoogleButton({ label = 'Continue with Google', onClick, disabled = false, loading = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      suppressHydrationWarning
      className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-gray-50/80 active:bg-gray-100 disabled:opacity-70 disabled:cursor-not-allowed border border-[#dadce0] rounded-xl text-sm font-medium text-[#3c4043] transition-all shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:shadow-[0_1px_3px_rgba(60,64,67,0.15)] cursor-pointer select-none font-sans"
    >
      {loading ? (
        <svg className="animate-spin h-4.5 w-4.5 text-[#4285F4]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        /* Official Google 4-Color G Logo SVG */
        <svg
          className="shrink-0"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            fill="#4285F4"
            d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.616z"
          />
          <path
            fill="#34A853"
            d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
          />
          <path
            fill="#FBBC05"
            d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.347 2.825.957 4.039l3.007-2.332z"
          />
          <path
            fill="#EA4335"
            d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"
          />
        </svg>
      )}
      <span className="font-medium tracking-[0.2px]">{loading ? 'Connecting with Google...' : label}</span>
    </button>
  )
}

