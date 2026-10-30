'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import TechnicianJobDetails from '../[id]/page'

function JobRedirect() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id') || 'SP-1042'
  return <TechnicianJobDetails params={Promise.resolve({ id })} />
}

export default function TechnicianJobPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-gray-500">Loading job...</div>}>
      <JobRedirect />
    </Suspense>
  )
}

