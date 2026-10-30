'use client'

import { useState, useEffect, Suspense } from 'react'
import { AnimatePresence } from 'motion/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '../_context/AuthContext'
import BookingProgress from './BookingProgress'
import Step1Model, { SUPPORTED_PHONES } from './Step1Model'
import Step2Protector, { PROTECTORS } from './Step2Protector'
import Step3Address from './Step3Address'
import Step4ReviewTime from './Step4ReviewTime'
import Step5Confirmed from './Step5Confirmed'

function BookingFlowContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading } = useAuth()

  // Parse step from URL query param, default to 1
  const stepParam = parseInt(searchParams.get('step') || '1', 10)
  const currentStep = Math.min(Math.max(isNaN(stepParam) ? 1 : stepParam, 1), 5)

  // Auth protection check
  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?redirect=/book?step=${currentStep}`)
    }
  }, [loading, user, currentStep, router])

  // Step 1 State
  const modelParam = searchParams.get('model') || ''
  const initialPhone =
    SUPPORTED_PHONES.find((p) =>
      modelParam ? p.model.toLowerCase().includes(modelParam.toLowerCase()) : false
    ) || SUPPORTED_PHONES[0]

  const [selectedPhone, setSelectedPhone] = useState(initialPhone)

  // Step 2 State
  const [selectedProtector, setSelectedProtector] = useState(PROTECTORS[0])

  // Step 3 State
  const [address, setAddress] = useState({
    pincode: '560102',
    phone: '+91 98765 43210',
    house: '14B, Lakeview Apartments',
    street: 'HSR Layout, Sector 2',
    landmark: '',
  })

  // Step 4 & 5 State
  const [bookingDetails, setBookingDetails] = useState({
    bookingId: '#SP-1042',
    date: null,
    slot: null,
    instructions: '',
    totalPrice: 398,
    phoneName: 'Samsung Galaxy S24',
    protectorName: 'Tempered Glass Protector',
    addressString: '',
  })

  const goToStep = (stepNumber) => {
    router.push(`/book?step=${stepNumber}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNext = () => {
    goToStep(Math.min(currentStep + 1, 5))
  }

  const handleBack = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1)
    } else {
      router.push('/')
    }
  }

  const handleStepClick = (stepId) => {
    if (stepId < currentStep) {
      goToStep(stepId)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-10 h-10 border-3 border-blue-200 border-t-[#4361EE] rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-gray-600">Verifying session with backend...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-12 h-12 rounded-full bg-blue-50 text-[#4361EE] flex items-center justify-center mb-4">
          <svg className="animate-spin h-6 w-6 text-[#4361EE]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p className="text-sm text-gray-500">Sign-in required for booking. Redirecting to login...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      {/* ── Progress line bar with step indicator (Visible on steps 1-4) ── */}
      {currentStep < 5 && (
        <BookingProgress
          currentStep={currentStep}
          onStepClick={handleStepClick}
          onBack={handleBack}
          onHome={() => router.push('/')}
        />
      )}

      {/* ── Active Step Page Content ── */}
      <main className="py-4">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <Step1Model
              key="step-1"
              selectedPhone={selectedPhone}
              onSelectPhone={setSelectedPhone}
              onNext={handleNext}
            />
          )}

          {currentStep === 2 && (
            <Step2Protector
              key="step-2"
              selectedPhone={selectedPhone}
              selectedProtector={selectedProtector}
              onSelectProtector={setSelectedProtector}
              onNext={handleNext}
            />
          )}

          {currentStep === 3 && (
            <Step3Address
              key="step-3"
              address={address}
              onUpdateAddress={setAddress}
              onNext={handleNext}
            />
          )}

          {currentStep === 4 && (
            <Step4ReviewTime
              key="step-4"
              selectedPhone={selectedPhone}
              selectedProtector={selectedProtector}
              address={address}
              bookingDetails={bookingDetails}
              onUpdateBookingDetails={(details) =>
                setBookingDetails((prev) => ({ ...prev, ...details }))
              }
              onConfirm={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 5 && (
            <Step5Confirmed
              key="step-5"
              bookingDetails={bookingDetails}
              onReturnHome={() => router.push('/')}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

export default function BookingFlow() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8f9fb]" />}>
      <BookingFlowContent />
    </Suspense>
  )
}
