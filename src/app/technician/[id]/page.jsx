'use client'

import { Suspense, use, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const JOB_DATA = {
  'SP-1042': {
    id: 'SP-1042',
    status: 'In Progress',
    step: 3, // 1: Assigned, 2: Arrived, 3: Installing, 4: Done
    customerName: 'Aditya Sen',
    phoneNumber: '+91 98765 43210',
    serviceAddress: 'Flat 402, Blossom Heights, Sector 12, Kharghar, PIN 400706',
    phoneModel: 'Samsung Galaxy S24',
    protectorType: 'Tempered Glass Protector',
    technicianNotes: 'Ring the bell for Apt 4B. Near the Central Metro Station Gate 2.',
    payout: '₹99',
  },
  'SP-1045': {
    id: 'SP-1045',
    status: 'Assigned',
    step: 1,
    customerName: 'Sneha Reddy',
    phoneNumber: '+91 98201 12345',
    serviceAddress: 'H-202, Royal Palms Garden, Sector 4, Kharghar, PIN 400706',
    phoneModel: 'iPhone 15 Pro Max',
    protectorType: 'Privacy Glass Protector',
    technicianNotes: 'Call upon arrival at security gate.',
    payout: '₹99',
  },
  'SP-1049': {
    id: 'SP-1049',
    status: 'Assigned',
    step: 1,
    customerName: 'Kabir Malhotra',
    phoneNumber: '+91 98334 98765',
    serviceAddress: 'Flat 1204, City Villa, Sector 6, Kharghar East, PIN 400710',
    phoneModel: 'Pixel 8',
    protectorType: 'Matte Film Protector',
    technicianNotes: 'Customer requested installation on dining table.',
    payout: '₹120',
  },
}

export default function TechnicianJobDetails({ params }) {
  return (
    <Suspense fallback={null}>
      <TechnicianJobDetailsContent params={params} />
    </Suspense>
  )
}

function TechnicianJobDetailsContent({ params }) {
  const router = useRouter()
  const unwrappedParams = use(params)
  const jobId = unwrappedParams?.id || 'SP-1042'
  const job = JOB_DATA[jobId] || {
    ...JOB_DATA['SP-1042'],
    id: jobId,
  }

  // Active status step: 1: Assigned, 2: Arrived, 3: Installing, 4: Done
  const [currentStep, setCurrentStep] = useState(job.step || 3)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // 6 Checklist items (as shown in mockup image)
  const [checklist, setChecklist] = useState([
    { id: 1, text: `Correct phone model verified (${job.phoneModel})`, checked: true },
    { id: 2, text: `Correct protector verified (${job.protectorType.split(' ')[0]} Glass)`, checked: true },
    { id: 3, text: 'Phone screen inspected for pre-existing scratches', checked: true },
    { id: 4, text: 'Screen protector successfully installed (No bubbles)', checked: false },
    { id: 5, text: 'Final visual check & alignment verified', checked: false },
    { id: 6, text: 'Informed customer about basic care instructions', checked: false },
  ])

  const toggleChecklist = (id) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    )
  }

  const allChecked = checklist.every((item) => item.checked)

  const handleMarkComplete = () => {
    // If not all checked, check all and advance to Done
    if (!allChecked) {
      setChecklist((prev) => prev.map((item) => ({ ...item, checked: true })))
    }
    setCurrentStep(4)
    setShowSuccessModal(true)
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fc] pb-24 font-sans">
      {/* ── 1. Top Navigation Bar ── */}
      <header className="bg-white border-b border-gray-200 px-5 h-14 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        <Link
          href="/technician"
          className="flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors no-underline"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Back to Jobs</span>
        </Link>

        <h1 className="text-sm font-bold text-gray-900 tracking-tight">
          Job Details
        </h1>

        <span className="text-xs font-extrabold text-[#2563EB] bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-md">
          #{job.id}
        </span>
      </header>

      {/* ── Main Scrollable Content ── */}
      <main className="p-4 space-y-4">
        {/* ── 2. Current Status & Stepper Card ── */}
        <div className="bg-white rounded-2xl p-4.5 border border-gray-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-gray-700">Current Status</span>
            <span
              className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                currentStep === 4
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : currentStep === 3
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  currentStep === 4
                    ? 'bg-emerald-500'
                    : currentStep === 3
                    ? 'bg-amber-500 animate-pulse'
                    : 'bg-blue-500'
                }`}
              />
              <span>
                {currentStep === 4 ? 'Completed' : currentStep === 3 ? 'In Progress' : 'Assigned'}
              </span>
            </span>
          </div>

          {/* Stepper Progress Bar */}
          <div className="relative flex items-center justify-between pt-1 pb-1">
            {/* Step 1: Assigned */}
            <div className="flex flex-col items-center z-10">
              <div
                onClick={() => setCurrentStep(1)}
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors cursor-pointer ${
                  currentStep >= 1 ? 'bg-emerald-500 text-white shadow-xs' : 'bg-gray-200 text-gray-500'
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span className="text-[10px] font-bold text-gray-700 mt-1.5">Assigned</span>
            </div>

            {/* Line 1-2 */}
            <div
              className={`flex-1 h-0.5 mx-1 mb-4.5 transition-colors ${
                currentStep >= 2 ? 'bg-emerald-500' : 'bg-gray-200'
              }`}
            />

            {/* Step 2: Arrived */}
            <div className="flex flex-col items-center z-10">
              <div
                onClick={() => setCurrentStep(2)}
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors cursor-pointer ${
                  currentStep >= 2 ? 'bg-emerald-500 text-white shadow-xs' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {currentStep > 2 ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span>2</span>
                )}
              </div>
              <span className="text-[10px] font-bold text-gray-700 mt-1.5">Arrived</span>
            </div>

            {/* Line 2-3 */}
            <div
              className={`flex-1 h-0.5 mx-1 mb-4.5 transition-colors ${
                currentStep >= 3 ? 'bg-amber-400' : 'bg-gray-200'
              }`}
            />

            {/* Step 3: Installing */}
            <div className="flex flex-col items-center z-10">
              <div
                onClick={() => setCurrentStep(3)}
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors cursor-pointer ${
                  currentStep === 3
                    ? 'bg-amber-500 text-white ring-4 ring-amber-100 shadow-xs'
                    : currentStep > 3
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {currentStep > 3 ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                )}
              </div>
              <span
                className={`text-[10px] font-bold mt-1.5 ${
                  currentStep === 3 ? 'text-amber-600' : 'text-gray-700'
                }`}
              >
                Installing
              </span>
            </div>

            {/* Line 3-4 */}
            <div
              className={`flex-1 h-0.5 mx-1 mb-4.5 transition-colors ${
                currentStep >= 4 ? 'bg-emerald-500' : 'bg-gray-200'
              }`}
            />

            {/* Step 4: Done */}
            <div className="flex flex-col items-center z-10">
              <div
                onClick={() => setCurrentStep(4)}
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors cursor-pointer ${
                  currentStep >= 4 ? 'bg-emerald-500 text-white shadow-xs' : 'bg-gray-100 text-gray-400 border border-gray-300'
                }`}
              >
                {currentStep >= 4 ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span>4</span>
                )}
              </div>
              <span className="text-[10px] font-bold text-gray-400 mt-1.5">Done</span>
            </div>
          </div>
        </div>

        {/* ── 3. Customer & Device Info Card ── */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200/90 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100 text-xs font-bold text-gray-900">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span>Customer & Device Info</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-gray-400 block mb-0.5">Customer Name</span>
              <strong className="text-gray-900 font-bold text-sm block">
                {job.customerName}
              </strong>
            </div>

            <div>
              <span className="text-gray-400 block mb-0.5">Phone Number</span>
              <a
                href={`tel:${job.phoneNumber}`}
                className="text-[#2563EB] font-bold flex items-center gap-1 hover:underline no-underline"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>{job.phoneNumber}</span>
              </a>
            </div>
          </div>

          <div className="text-xs pt-1">
            <span className="text-gray-400 block mb-0.5">Service Address</span>
            <p className="text-gray-800 font-semibold leading-relaxed m-0">
              {job.serviceAddress}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs pt-1">
            <div>
              <span className="text-gray-400 block mb-0.5">Phone Model</span>
              <div className="flex items-center gap-1.5 text-gray-900 font-bold">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                  <rect x="5" y="2" width="14" height="20" rx="3" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
                <span>{job.phoneModel}</span>
              </div>
            </div>

            <div>
              <span className="text-gray-400 block mb-0.5">Protector Type</span>
              <strong className="text-gray-900 font-bold block">
                {job.protectorType}
              </strong>
            </div>
          </div>

          {/* Technician Notes Box */}
          <div className="bg-[#f0f5ff] border border-blue-100 rounded-xl p-3 flex items-start gap-2.5 text-xs text-blue-900 leading-relaxed">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 shrink-0 mt-0.5">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            <div>
              <strong className="font-bold block text-blue-950 mb-0.5">Technician Notes:</strong>
              <span>{job.technicianNotes}</span>
            </div>
          </div>
        </div>

        {/* ── 4. Installation Checklist Card ── */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200/90 shadow-2xs space-y-3.5">
          <div className="pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-900 mb-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
              <span>Installation Checklist</span>
            </div>
            <p className="text-[11px] text-gray-500 m-0 leading-normal">
              Technician must check and confirm every step before marking job as complete.
            </p>
          </div>

          {/* Checklist items */}
          <div className="space-y-3 pt-1">
            {checklist.map((item) => (
              <label
                key={item.id}
                onClick={() => toggleChecklist(item.id)}
                className="flex items-start gap-3 cursor-pointer select-none group text-xs text-gray-700 leading-snug"
              >
                <div
                  className={`w-4.5 h-4.5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors border ${
                    item.checked
                      ? 'bg-[#2563EB] border-[#2563EB] text-white'
                      : 'border-gray-300 bg-white group-hover:border-blue-400'
                  }`}
                >
                  {item.checked && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span className={item.checked ? 'text-gray-900 font-medium' : 'text-gray-600'}>
                  {item.text}
                </span>
              </label>
            ))}
          </div>
        </div>
      </main>

      {/* ── 5. Sticky Bottom Action Button ── */}
      <div className="fixed bottom-0 w-full max-w-md bg-white/95 backdrop-blur-md border-t border-gray-200 p-4 z-40 shadow-lg">
        <button
          type="button"
          onClick={handleMarkComplete}
          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm rounded-xl transition-all shadow-[0_2px_10px_rgba(16,185,129,0.3)] hover:shadow-[0_4px_14px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 cursor-pointer border-none"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>Mark Installation Complete</span>
        </button>
      </div>

      {/* ── 6. Job Completed Confirmation Modal ── */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xs w-full p-6 text-center shadow-xl animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="text-lg font-extrabold text-gray-900 mb-1">
              Installation Complete!
            </h3>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              Job #{job.id} for {job.customerName} has been recorded. Payout of {job.payout} added to your balance.
            </p>
            <button
              type="button"
              onClick={() => {
                setShowSuccessModal(false)
                router.push('/technician')
              }}
              className="w-full py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer border-none"
            >
              Back to Assigned Jobs
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

