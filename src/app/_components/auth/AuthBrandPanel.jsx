// Server Component - renders the left brand column on server
export default function AuthBrandPanel({ mode = 'signup' }) {
  const isSignup = mode === 'signup'

  return (
    <div className="bg-[#2563EB] bg-gradient-to-br from-[#2563EB] via-[#215cdb] to-[#1d4ed8] p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
      {/* Subtle background circle decoration */}
      <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-white/5 pointer-events-none blur-2xl" />

      <div>
        {/* Phone Icon Box */}
        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[#2563EB] shadow-sm mb-8">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="5" y="2" width="14" height="20" rx="3" />
            <line x1="12" y1="18" x2="12.01" y2="18" />
          </svg>
        </div>

        {/* Tag & Heading */}
        <span className="block text-[11px] font-bold tracking-[0.16em] text-blue-200 uppercase mb-3">
          DOORSTEP PROTECTION
        </span>

        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight mb-4 tracking-tight">
            A better way to protect the phone you rely on.
          </h2>
          <p className="text-sm text-blue-100/90 leading-relaxed mb-8">
            {isSignup
              ? 'Create an account to keep every booking, appointment update, and installation detail in one secure place.'
              : 'Sign in to access your saved bookings, appointment schedule, and doorstep installation status.'}
          </p>
        </div>
      </div>

      {/* Feature Bullets */}
      <div className="space-y-4 pt-4 border-t border-white/15">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-white text-[#2563EB] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path
                d="M3.5 8.5L6.5 11.5L12.5 5.5"
                stroke="#2563EB"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white m-0">Clear appointment updates</h4>
            <p className="text-xs text-blue-100/80 m-0 mt-0.5">
              Review your scheduled installation anytime.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-white text-[#2563EB] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path
                d="M3.5 8.5L6.5 11.5L12.5 5.5"
                stroke="#2563EB"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white m-0">Your booking details, protected</h4>
            <p className="text-xs text-blue-100/80 m-0 mt-0.5">
              Access orders and support without sharing them publicly.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
