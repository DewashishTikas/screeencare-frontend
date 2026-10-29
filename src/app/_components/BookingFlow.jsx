'use client'

import { useState, Suspense } from 'react'
import { AnimatePresence } from 'motion/react'
import { useRouter, useSearchParams } from 'next/navigation'
import BookingProgress from './BookingProgress'
import Step1Model, { SUPPORTED_PHONES } from './Step1Model'
import Step2Protector, { PROTECTORS } from './Step2Protector'
import Step3Address from './Step3Address'
import Step4ReviewTime from './Step4ReviewTime'
import Step5Confirmed from './Step5Confirmed'

function BookingFlowContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Parse step from URL query param, default to 1
  const stepParam = parseInt(searchParams.get('step') || '1', 10)
  const currentStep = Math.min(Math.max(isNaN(stepParam) ? 1 : stepParam, 1), 5)

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
