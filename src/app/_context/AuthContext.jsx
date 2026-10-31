'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

const AuthContext = createContext({
  user: null,
  loading: true,
  checkAuth: async () => {},
  logout: async () => {},
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const checkAuth = useCallback(async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKENDURL || 'http://localhost:4000'
      const res = await fetch(`${backendUrl}/auth`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (res.ok) {
        const data = await res.json()
        setUser(data)
        return data
      } else {
        setUser(null)
        return null
      }
    } catch (error) {
      console.warn('Backend authentication check unavailable:', error)
      setUser(null)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKENDURL || 'http://localhost:4000'
      await fetch(`${backendUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } catch (e) {
      console.error('Logout error:', e)
    } 
  }, [router])

  useEffect(() => {
    checkAuth()

    // Listen for auth events from other windows / popups
    let channel = null
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        channel = new BroadcastChannel('screencare_auth')
        channel.onmessage = (event) => {
          if (event.data?.type === 'GOOGLE_AUTH_SUCCESS' || event.data?.type === 'AUTH_SUCCESS') {
            checkAuth()
          } else if (event.data?.type === 'AUTH_LOGOUT') {
            setUser(null)
          }
        }
      }
    } catch {}

    const handleStorage = (event) => {
      if (event.key === 'screencare_auth_event') {
        checkAuth()
      }
    }
    window.addEventListener('storage', handleStorage)

    return () => {
      if (channel) channel.close()
      window.removeEventListener('storage', handleStorage)
    }
  }, [checkAuth])

  return (
    <AuthContext.Provider value={{ user, loading, checkAuth, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

