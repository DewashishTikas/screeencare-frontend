import AuthBrandPanel from './auth/AuthBrandPanel'
import AuthForm from './auth/AuthForm'
import AuthFooter from './auth/AuthFooter'

// Server Component (SSR) - outer layout, brand panel, and footer render on server
export default function AuthPage({ initialMode = 'signup' }) {
  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col justify-between">
      {/* ── Main Split Container with original navigation bar above ── */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="max-w-[1020px] w-full bg-white rounded-3xl shadow-[0_16px_50px_rgba(0,0,0,0.06)] border border-gray-200/80 overflow-hidden grid grid-cols-1 md:grid-cols-2">
          {/* ── Left Column: Brand Feature Card (Server-Side Rendered) ── */}
          <AuthBrandPanel mode={initialMode} />

          {/* ── Right Column: Interactive Form ('use client' only where needed) ── */}
          <AuthForm mode={initialMode} />
        </div>
      </div>

      {/* ── Footer (Server-Side Rendered) ── */}
      <AuthFooter />
    </div>
  )
}
