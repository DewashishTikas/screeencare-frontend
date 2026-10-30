'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'

export default function ConditionalNavbar() {
  const pathname = usePathname()

  // Hide the landing page navbar on admin, technician portal, login, signup, and auth routes
  const isAuthPage =
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname.startsWith('/auth')
  const isAdmin = pathname.startsWith('/admin')
  const isTechnician = pathname.startsWith('/technician')

  if (isAdmin || isAuthPage || isTechnician) return null

  return (
    <header className="sticky top-0 z-50 w-full">
      <Navbar />
    </header>
  )
}
