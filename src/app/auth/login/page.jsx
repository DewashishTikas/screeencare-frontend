'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function GoogleAuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const task = searchParams.get('task')

  useEffect(() => {
    if (typeof window === 'undefined') return

    const broadcast = (data) => {
      // 1. Post to opener if connected
      if (window.opener) {
        try {
          window.opener.postMessage(data, '*')
        } catch {}
      }

      // 2. BroadcastChannel (works even if window.opener is disconnected by COOP)
      try {
        if ('BroadcastChannel' in window) {
          const channel = new BroadcastChannel('screencare_auth')
          channel.postMessage(data)
          channel.close()
        }
      } catch {}

      // 3. LocalStorage event as fallback
      try {
        localStorage.setItem(
          'screencare_auth_event',
          JSON.stringify({ ...data, timestamp: Date.now() })
        )
      } catch {}
    }

    if (task === 'success') {
      broadcast({ type: 'GOOGLE_AUTH_SUCCESS', task: 'success' })
      // Close window immediately
      window.close()
      // Fallback close attempts
      const timer = setTimeout(() => {
        window.close()
      }, 50)
      return () => clearTimeout(timer)
    } else if (task === 'passfail') {
      broadcast({
        type: 'GOOGLE_AUTH_ERROR',
        message: 'Account was registered using password. Please sign in with your email and password.',
      })
      window.close()
      setTimeout(() => window.close(), 50)
    } else if (task === 'fail') {
      broadcast({
        type: 'GOOGLE_AUTH_ERROR',
        message: 'Google authentication was cancelled or failed.',
      })
      window.close()
      setTimeout(() => window.close(), 50)
    } else {
      router.replace('/login')
    }
  }, [task, router])

  return (
    <>
      {/* Immediate inline script execution before React hydration */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            try {
              var params = new URLSearchParams(window.location.search);
              var task = params.get('task');
              var payload = task === 'success' 
                ? { type: 'GOOGLE_AUTH_SUCCESS', task: 'success' }
                : { type: 'GOOGLE_AUTH_ERROR', message: 'Authentication issue' };

              if (window.opener) {
                try { window.opener.postMessage(payload, '*'); } catch (e) {}
              }
              if ('BroadcastChannel' in window) {
                try {
                  var bc = new BroadcastChannel('screencare_auth');
                  bc.postMessage(payload);
                  bc.close();
                } catch (e) {}
              }
              try {
                localStorage.setItem('screencare_auth_event', JSON.stringify({ type: payload.type, timestamp: Date.now() }));
              } catch (e) {}
              window.close();
            } catch (err) {}
          `,
        }}
      />

      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-lg border border-gray-100 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
            <svg className="animate-spin h-6 w-6 text-[#4361EE]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Login Complete</h2>
          <p className="text-sm text-gray-500">Closing authentication window...</p>
          <button
            type="button"
            onClick={() => window.close()}
            className="mt-4 px-4 py-2 bg-[#4361EE] text-white rounded-lg text-xs font-medium hover:bg-blue-700 cursor-pointer border-none"
          >
            Close window
          </button>
        </div>
      </div>
    </>
  )
}

export default function GoogleAuthCallbackPage() {
  return (
    <Suspense fallback={null}>
      <GoogleAuthCallbackContent />
    </Suspense>
  )
}
