'use client'

import { motion } from 'motion/react'

export const STEPS = [
  { id: 1, key: 'model', label: 'Model', subLabel: 'Phone' },
  { id: 2, key: 'protector', label: 'Protector', subLabel: 'Glass' },
  { id: 3, key: 'address', label: 'Address', subLabel: 'Location' },
  { id: 4, key: 'review', label: 'Review & Time', subLabel: 'Schedule' },
  { id: 5, key: 'confirm', label: 'Confirm', subLabel: 'Done' },
]

export default function BookingProgress({ currentStep, onStepClick, onBack, onHome }) {
  // Calculate percentage of progress line
  // Step 1: 20%, Step 2: 40%, Step 3: 60%, Step 4: 80%, Step 5: 100%
  const progressPercent = (currentStep / STEPS.length) * 100

  return (
    <div className="bg-white border-b border-gray-200">
      {/* ── Sub-header with Back, Title, Step counter ── */}
      <div className="max-w-[1200px] mx-auto px-6 py-3 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          {currentStep > 1 && currentStep < 5 ? (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-gray-600 hover:text-gray-950 font-medium transition-colors bg-transparent border-none cursor-pointer p-0"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Back</span>
            </button>
          ) : currentStep === 1 ? (
            <button
              onClick={onHome}
              className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-900 font-medium transition-colors bg-transparent border-none cursor-pointer p-0"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Exit booking</span>
            </button>
          ) : (
            <span className="text-gray-400 font-medium">Booking Completed</span>
          )}
        </div>

        <div className="font-semibold text-gray-900 tracking-tight flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#4361EE] animate-pulse"></span>
          <span>ScreenCare Doorstep Booking</span>
        </div>

        <div className="text-gray-500 font-medium text-xs md:text-sm">
          {currentStep < 5 ? (
            <span>Step <strong className="text-[#4361EE] font-bold">{currentStep}</strong> of 4</span>
          ) : (
            <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md text-xs">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Completed
            </span>
          )}
        </div>
      </div>

      {/* ── Step Labels Row ── */}
      <div className="max-w-[1200px] mx-auto px-6 pt-2 pb-3">
        <div className="grid grid-cols-5 text-center">
          {STEPS.map((step) => {
            const isCompleted = step.id < currentStep
            const isCurrent = step.id === currentStep
            const isUpcoming = step.id > currentStep

            return (
              <button
                key={step.id}
                onClick={() => {
                  if (isCompleted) {
                    onStepClick(step.id)
                  }
                }}
                disabled={isUpcoming}
                className={`flex flex-col items-center justify-center gap-1 bg-transparent border-none py-1 transition-all text-center ${
                  isCompleted ? 'cursor-pointer group' : isCurrent ? 'cursor-default' : 'cursor-not-allowed opacity-40'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  {/* Step status icon / number */}
                  <span
                    className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-[#4361EE] text-white shadow-sm'
                        : isCurrent
                        ? 'bg-[#4361EE] text-white ring-4 ring-[#4361EE]/15 shadow-sm'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {isCompleted ? (
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      step.id
                    )}
                  </span>
                  <span
                    className={`text-xs md:text-sm tracking-tight transition-colors ${
                      isCurrent
                        ? 'font-bold text-[#4361EE]'
                        : isCompleted
                        ? 'font-semibold text-gray-700 group-hover:text-[#4361EE]'
                        : 'font-normal text-gray-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {/* ── Continuous Horizontal Progress Bar (As in Image 3) ── */}
        <div className="relative mt-2 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#4361EE] to-[#3a56e0] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.45, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </div>
  )
}
