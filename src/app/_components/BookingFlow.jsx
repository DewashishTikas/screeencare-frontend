'use client'

import { useState, useEffect, Suspense } from 'react'
import { AnimatePresence } from 'motion/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '../_context/AuthContext'
import BookingProgress from './BookingProgress'
import Step1Model from './Step1Model'
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

  // Step 1 State: Load initial selectedPhone from localStorage if present
  const [selectedPhone, setSelectedPhone] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('screencare_selected_phone')
        if (saved) return JSON.parse(saved)
      } catch (e) {}
    }
    return null
  })

  // Category & Protector State (Flip Cover and Tempered Glass)
  const categoryParam = searchParams.get('category')
  const [selectedCategory, setSelectedCategory] = useState(() => {
    if (categoryParam) {
      return categoryParam.toLowerCase().includes('flip') ? 'flip-cover' : 'tempered-glass'
    }
    if (typeof window !== 'undefined') {
      try {
        const savedCat = localStorage.getItem('screencare_selected_category')
        if (savedCat) return savedCat
      } catch (e) {}
    }
    return 'tempered-glass'
  })

  const [selectedProtector, setSelectedProtector] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedProtector = localStorage.getItem('screencare_selected_protector')
        if (savedProtector) {
          const parsed = JSON.parse(savedProtector)
          if (parsed && (parsed.id || parsed._id)) return parsed
        }
      } catch (e) {}
    }
    const cat = categoryParam
      ? (categoryParam.toLowerCase().includes('flip') ? 'flip-cover' : 'tempered-glass')
      : 'tempered-glass'
    return (
      PROTECTORS.find((p) => p.category === cat || p.id === cat) ||
      PROTECTORS[0]
    )
  })

  // Persist selections to localStorage across page reloads
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (selectedPhone) {
        localStorage.setItem('screencare_selected_phone', JSON.stringify(selectedPhone))
      }
      if (selectedCategory) {
        localStorage.setItem('screencare_selected_category', selectedCategory)
      }
      if (selectedProtector) {
        localStorage.setItem('screencare_selected_protector', JSON.stringify(selectedProtector))
      }
    }
  }, [selectedPhone, selectedCategory, selectedProtector])

  // Helper to fetch live accessories for phone + category and synchronize state
  const syncPhoneAndCategoryProducts = async (phone, catId) => {
    if (!phone) return
    const phoneId = phone._id || phone.id
    if (!phoneId) return

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKENDURL || 'http://localhost:4000'
      const targetCat = catId || selectedCategory || 'tempered-glass'
      const catParam = `?category=${encodeURIComponent(targetCat)}`

      const res = await fetch(`${backendUrl}/phone/${phoneId}/accessories${catParam}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      if (res.ok) {
        const json = await res.json()
        const rawList = Array.isArray(json) ? json : json.data || []
        if (rawList.length > 0) {
          const normalized = rawList.map((item) => {
            const isFlip = /flip/i.test(item.name || item.categoryId?.name)
            const defaultImg = isFlip
              ? 'https://res.cloudinary.com/cehmvz0u/image/upload/f_auto,q_auto/apexguard/product/flip_cover_default'
              : 'https://res.cloudinary.com/cehmvz0u/image/upload/f_auto,q_auto/apexguard/product/6af9e6d09e7685f5efad4a40'

            const primaryImage =
              (item.image && typeof item.image === 'string' && !item.image.includes('unsplash.com') ? item.image.trim() : null) ||
              (Array.isArray(item.images) && item.images.length > 0 && !item.images[0].includes('unsplash.com') ? item.images[0].trim() : null) ||
              item.image ||
              defaultImg

            const price = typeof item.price === 'number' ? item.price : 449
            const quantity =
              item.stock?.quantity ??
              item.stock?.availableQuantity ??
              (typeof item.stock === 'number' ? item.stock : 8)
            const lowStockThreshold = item.stock?.lowStockThreshold ?? 10
            const isLowStock = quantity <= lowStockThreshold && quantity > 0

            const specs = item.specifications || {}
            let itemFeatures = []
            if (Array.isArray(item.features) && item.features.length > 0) {
              itemFeatures = item.features.filter(Boolean)
            } else {
              if (specs.hardness) itemFeatures.push(`${specs.hardness} Hardness Surface Scratch Protection`)
              if (specs.coverage) itemFeatures.push(`${specs.coverage} Full Screen Edge Coverage`)
              if (specs.installation) itemFeatures.push(`${specs.installation} Certified Doorstep Fitting`)
              if (specs.thickness) itemFeatures.push(`${specs.thickness} Ultra-Thin Touch Sensitivity`)
              if (itemFeatures.length < 4) {
                if (isFlip) {
                  itemFeatures.push('360° Shockproof Impact & Edge Shield')
                  itemFeatures.push('Built-in Storage Slot for Cards & Cash')
                } else {
                  itemFeatures.push('Oleophobic Anti-Fingerprint Coating')
                  itemFeatures.push('99.9% HD Optical Clarity')
                }
              }
            }

            return {
              id: item._id || item.id,
              _id: item._id || item.id,
              name: item.name || 'Screen Protector',
              description: item.description || '',
              category: targetCat,
              categoryName: targetCat === 'flip-cover' ? 'Flip Cover' : 'Tempered Glass',
              features: itemFeatures.slice(0, 4),
              specifications: specs,
              productPrice: price,
              installPrice: 0,
              totalPrice: price,
              icon: isFlip ? 'cover' : 'shield',
              image: primaryImage,
              stock: {
                quantity,
                availableQuantity: quantity,
                lowStockThreshold,
                isLowStock,
                inStock: quantity > 0,
              },
              inStock: quantity > 0,
              sku: item.sku || '',
            }
          })

          if (typeof window !== 'undefined') {
            localStorage.setItem('screencare_protector_products', JSON.stringify(normalized))
            localStorage.setItem('screencare_protector_category', targetCat)
            localStorage.setItem('screencare_protector_phone_id', phoneId)
            localStorage.setItem('screencare_selected_protector', JSON.stringify(normalized[0]))
          }
          setSelectedProtector(normalized[0])
          return
        }
      }
    } catch (err) {
      console.warn('Error syncing accessories in BookingFlow:', err)
    }

    const matched = PROTECTORS.find((p) => p.category === catId || p.id === catId)
    if (matched) {
      setSelectedProtector(matched)
      if (typeof window !== 'undefined') {
        localStorage.setItem('screencare_selected_protector', JSON.stringify(matched))
      }
    }
  }

  const handleSelectCategory = async (catId) => {
    setSelectedCategory(catId)
    if (typeof window !== 'undefined') {
      localStorage.setItem('screencare_selected_category', catId)
    }
    const currentPhone = selectedPhone || (() => {
      if (typeof window !== 'undefined') {
        try {
          const s = localStorage.getItem('screencare_selected_phone')
          if (s) return JSON.parse(s)
        } catch (e) {}
      }
      return null
    })()
    if (currentPhone) {
      await syncPhoneAndCategoryProducts(currentPhone, catId)
    }
  }

  const handleSelectPhone = async (phone) => {
    setSelectedPhone(phone)
    if (typeof window !== 'undefined') {
      localStorage.setItem('screencare_selected_phone', JSON.stringify(phone))
    }
    await syncPhoneAndCategoryProducts(phone, selectedCategory)
  }

  // Step 3 State (clean empty values by default, restored from localStorage if available)
  const [address, setAddress] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedAddr = localStorage.getItem('screencare_booking_address')
        if (savedAddr) return JSON.parse(savedAddr)
      } catch (e) {}
    }
    return {
      fullName: '',
      phone: '',
      pincode: '',
      house: '',
      street: '',
      landmark: '',
      city: '',
      state: '',
    }
  })

  useEffect(() => {
    if (typeof window !== 'undefined' && address && Object.values(address).some(Boolean)) {
      localStorage.setItem('screencare_booking_address', JSON.stringify(address))
    }
  }, [address])

  // Pre-fill user name and phone from session if available
  useEffect(() => {
    if (user) {
      setAddress((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        phone: prev.phone || user.phone || '',
      }))
    }
  }, [user])

  // Step 4 & 5 State (restored from localStorage if available)
  const [bookingDetails, setBookingDetails] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedDetails = localStorage.getItem('screencare_booking_details')
        if (savedDetails) return JSON.parse(savedDetails)
      } catch (e) {}
    }
    return {
      bookingId: '',
      user: null,
      date: null,
      slot: null,
      instructions: '',
      totalPrice: 449,
      phoneName: '',
      protectorName: '',
      addressString: '',
    }
  })

  useEffect(() => {
    if (typeof window !== 'undefined' && bookingDetails && bookingDetails.bookingId) {
      localStorage.setItem('screencare_booking_details', JSON.stringify(bookingDetails))
    }
  }, [bookingDetails])

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
              onSelectPhone={handleSelectPhone}
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
              onNext={handleNext}
            />
          )}

          {currentStep === 2 && (
            <Step2Protector
              key="step-2"
              selectedPhone={selectedPhone}
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
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
              selectedPhone={selectedPhone}
              selectedProtector={selectedProtector}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 4 && (
            <Step4ReviewTime
              key="step-4"
              user={user}
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
