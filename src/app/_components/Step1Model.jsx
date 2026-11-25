'use client'

import Image from 'next/image'
import { motion } from 'motion/react'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect, useCallback, useRef } from 'react'

export default function Step1Model({
  selectedPhone,
  onSelectPhone,
  selectedCategory = 'tempered-glass',
  onSelectCategory,
  onNext,
}) {
  const [phones, setPhones] = useState([])
  const [brands, setBrands] = useState(['All brands'])
  const [loading, setLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [activeBrand, setActiveBrand] = useState('All brands')
  const searchParams = useSearchParams()
  const isInitialLoad = useRef(true)

  const CATEGORIES = [
    {
      id: 'tempered-glass',
      name: 'Tempered Glass',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      ),
    },
    {
      id: 'flip-cover',
      name: 'Flip Cover',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="3" />
          <line x1="9" y1="2" x2="9" y2="22" />
        </svg>
      ),
    },
  ]

  // 1. Fetch available brands on mount from backend
  useEffect(() => {
    async function fetchBrands() {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKENDURL || 'http://localhost:4000'
        const res = await fetch(`${backendUrl}/phone/brands`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        if (res.ok) {
          const json = await res.json()
          const brandData = Array.isArray(json) ? json : json.data || []
          const brandNames = brandData.map((b) => b.name).filter(Boolean)
          if (brandNames.length > 0) {
            setBrands(['All brands', ...brandNames])
          }
        }
      } catch (err) {
        console.error('Error fetching brands list:', err)
      }
    }
    fetchBrands()
  }, [])

  // 2. Debounce search query changes by 350ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 350)
    return () => clearTimeout(handler)
  }, [searchQuery])

  // 3. Fetch phone models from backend based on debounced search & active brand
  const fetchPhones = useCallback(
    async (searchTerm, brandFilter, signal) => {
      try {
        if (isInitialLoad.current) {
          setLoading(true)
        } else {
          setIsSearching(true)
        }
        setError(null)

        const backendUrl = process.env.NEXT_PUBLIC_BACKENDURL || 'http://localhost:4000'
        const params = new URLSearchParams()
        params.set('limit', '50')

        if (searchTerm && searchTerm.trim()) {
          params.set('search', searchTerm.trim())
        }

        if (brandFilter && brandFilter !== 'All brands') {
          params.set('brandName', brandFilter)
        }

        const res = await fetch(`${backendUrl}/phone?${params.toString()}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal,
        })

        if (!res.ok) {
          throw new Error(`Failed to load phone models (${res.status})`)
        }

        const json = await res.json()
        const rawList = Array.isArray(json) ? json : json.data || []

        // Normalize backend phone documents
        const normalized = rawList.map((p) => ({
          id: p._id || p.id,
          _id: p._id || p.id,
          brand:
            p.brandName ||
            (typeof p.brandId === 'object' && p.brandId !== null
              ? p.brandId.name
              : p.brand || 'Other'),
          model: p.name || p.model || 'Unknown Model',
          status: p.status === 'active' ? 'Supported' : p.status || 'Supported',
          image: p.image || null,
        }))

        setPhones(normalized)

        // On initial load, auto-select model if query param matches, or restore from localStorage, or pick first
        if (isInitialLoad.current && normalized.length > 0) {
          const modelQuery = searchParams.get('model') || ''
          const matched = modelQuery
            ? normalized.find((p) =>
                p.model.toLowerCase().includes(modelQuery.toLowerCase())
              )
            : null

          if (matched) {
            onSelectPhone(matched)
            if (typeof window !== 'undefined') {
              localStorage.setItem('screencare_selected_phone', JSON.stringify(matched))
            }
          } else if (!selectedPhone) {
            let savedPhone = null
            if (typeof window !== 'undefined') {
              try {
                const s = localStorage.getItem('screencare_selected_phone')
                if (s) savedPhone = JSON.parse(s)
              } catch (e) {}
            }
            if (savedPhone) {
              const inList = normalized.find((p) => p.id === (savedPhone.id || savedPhone._id))
              onSelectPhone(inList || savedPhone)
            } else {
              onSelectPhone(normalized[0])
            }
          }
          isInitialLoad.current = false
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error fetching phones from backend:', err)
          setError('Unable to load phone models from the server. Please check that the backend is running.')
        }
      } finally {
        setLoading(false)
        setIsSearching(false)
      }
    },
    [searchParams, selectedPhone, onSelectPhone]
  )

  // Trigger backend request whenever debouncedSearch or activeBrand changes
  useEffect(() => {
    const controller = new AbortController()
    fetchPhones(debouncedSearch, activeBrand, controller.signal)
    return () => controller.abort()
  }, [debouncedSearch, activeBrand, fetchPhones])

  // Fetch accessories for a specific phone and category from backend and sync to localStorage
  const fetchProtectorsForPhoneAndCategory = useCallback(async (phone, catId) => {
    if (!phone) return null
    const phoneId = phone._id || phone.id
    if (!phoneId) return null

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKENDURL || 'http://localhost:4000'
      const targetCat = catId || selectedCategory || 'tempered-glass'
      const catParam = `?category=${encodeURIComponent(targetCat)}`

      const res = await fetch(`${backendUrl}/phone/${phoneId}/accessories${catParam}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!res.ok) return null

      const json = await res.json()
      const rawList = Array.isArray(json) ? json : json.data || []

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

      if (typeof window !== 'undefined' && normalized.length > 0) {
        localStorage.setItem('screencare_protector_products', JSON.stringify(normalized))
        localStorage.setItem('screencare_protector_category', targetCat)
        localStorage.setItem('screencare_protector_phone_id', phoneId)
        localStorage.setItem('screencare_selected_protector', JSON.stringify(normalized[0]))
      }

      return normalized
    } catch (err) {
      console.warn('Error fetching accessories in Step 1:', err)
      return null
    }
  }, [selectedCategory])

  const handleCategoryClick = async (catId) => {
    onSelectCategory?.(catId)
    if (typeof window !== 'undefined') {
      localStorage.setItem('screencare_selected_category', catId)
    }
    // When changing product category from previous page, immediately send request for this phone
    if (selectedPhone) {
      await fetchProtectorsForPhoneAndCategory(selectedPhone, catId)
    }
  }

  const handlePhoneClick = async (phone) => {
    onSelectPhone(phone)
    if (typeof window !== 'undefined') {
      localStorage.setItem('screencare_selected_phone', JSON.stringify(phone))
    }
    // When changing phone model from previous page, immediately send request for this product
    await fetchProtectorsForPhoneAndCategory(phone, selectedCategory)
  }

  // Handle continue: send backend request for the phone and product category and make available in step 2
  const handleContinue = async () => {
    if (!selectedPhone) return
    try {
      setIsSubmitting(true)
      if (typeof window !== 'undefined') {
        localStorage.setItem('screencare_selected_phone', JSON.stringify(selectedPhone))
        localStorage.setItem('screencare_selected_category', selectedCategory)
      }
      await fetchProtectorsForPhoneAndCategory(selectedPhone, selectedCategory)
    } catch (err) {
      console.warn('Backend request on continue:', err)
    } finally {
      setIsSubmitting(false)
      onNext()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4 }}
      className={`max-w-[920px] mx-auto py-10 px-6 font-sans ${selectedPhone ? 'pb-28' : ''}`}
    >
      {/* ── Section Header ── */}
      <div className="mb-6">
        <span className="block text-xs font-bold tracking-wider text-[#4361EE] uppercase mb-2">
          DEVICE COMPATIBILITY
        </span>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2 font-heading">
          Which phone do you use?
        </h1>
        <p className="text-[15px] text-gray-500">
          Choose an exact model so we can show protectors that fit correctly.
        </p>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center justify-between mb-6 shadow-xs">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => fetchPhones(debouncedSearch, activeBrand)}
            className="text-xs font-semibold px-3.5 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-colors cursor-pointer border-none"
          >
            Retry
          </button>
        </div>
      )}

      {/* ── Category Selection (Tempered Glass & Flip Cover) ── */}
      <div className="mb-6">
        <label className="block text-xs font-bold tracking-wider text-gray-700 uppercase mb-3">
          1. Select Category
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CATEGORIES.map((cat) => {
            const isCategoryActive = selectedCategory === cat.id
            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`relative p-5 rounded-2xl border transition-all cursor-pointer bg-white ${
                  isCategoryActive
                    ? 'border-[#4361EE] ring-2 ring-[#4361EE]/15 shadow-md bg-blue-50/15'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                {/* Checkmark Badge */}
                {isCategoryActive && (
                  <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#4361EE] text-white flex items-center justify-center shadow-xs">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M4 8.5L6.5 11L12 5.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}

                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                      isCategoryActive
                        ? 'bg-[#4361EE] text-white'
                        : 'bg-gray-100 text-[#4361EE]'
                    }`}
                  >
                    {cat.icon}
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-gray-900 m-0">
                      {cat.name}
                    </h3>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Search & Filter Box ── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.03)] mb-6">
        <label className="block text-sm font-semibold text-gray-800 mb-2.5">
          2. Search supported models for {selectedCategory === 'flip-cover' ? 'Flip Cover' : 'Tempered Glass'}
        </label>

        {/* Search Input with Debounced Backend Request */}
        <div className="flex items-center gap-2.5 px-3.5 py-3 border border-gray-200 rounded-xl bg-white focus-within:border-[#4361EE] focus-within:ring-2 focus-within:ring-[#4361EE]/10 transition-all mb-4">
          {/* Search Icon or Spinner */}
          {isSearching ? (
            <div className="w-4 h-4 border-2 border-[#4361EE] border-t-transparent rounded-full animate-spin shrink-0" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="shrink-0">
              <circle cx="9" cy="9" r="6" stroke="#9CA3AF" strokeWidth="1.7" />
              <path d="M14 14L18 18" stroke="#9CA3AF" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          )}

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search iPhone, Galaxy, Pixel, or brand..."
            className="w-full border-none outline-none text-sm text-gray-800 placeholder:text-gray-400 bg-transparent font-sans"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-xs text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer px-1 py-0.5 rounded"
              title="Clear search"
            >
              Clear
            </button>
          )}
        </div>

        {/* Brand Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {brands.map((brand) => (
            <button
              key={brand}
              type="button"
              onClick={() => setActiveBrand(brand)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border cursor-pointer ${
                activeBrand === brand
                  ? 'bg-[#4361EE] text-white border-[#4361EE] shadow-sm'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* ── Initial Loading Spinner ── */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-xs mb-6">
          <div className="w-9 h-9 border-3 border-[#4361EE] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm text-gray-500 font-medium">Loading supported models from backend...</p>
        </div>
      )}

      {/* ── Empty State ── */}
      {!loading && phones.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200/80 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center mx-auto mb-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-gray-800 mb-1">No models found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
            {searchQuery
              ? `No phone models matching "${searchQuery}" was found.`
              : 'No phone models currently match the selected criteria.'}
          </p>
          {(searchQuery || activeBrand !== 'All brands') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                setActiveBrand('All brands')
              }}
              className="text-xs font-semibold px-4 py-2 bg-[#4361EE] text-white rounded-xl hover:bg-[#3451de] transition-colors border-none cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}

      {/* ── Quick Selection Strip (Top Accessible Action) ── */}
      {selectedPhone && !loading && phones.length > 0 && (
        <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 mb-5 flex items-center justify-between gap-4 shadow-xs animate-fadeIn">
          <div className="flex items-center gap-3 min-w-0">
            {selectedPhone.image ? (
              <div className="w-10 h-10 rounded-xl bg-white border border-blue-200 overflow-hidden shrink-0 flex items-center justify-center">
                <Image
                  src={selectedPhone.image}
                  alt={selectedPhone.model}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-white text-[#4361EE] border border-blue-200 flex items-center justify-center shrink-0 font-bold text-sm">
                📱
              </div>
            )}
            <div className="min-w-0">
              <span className="text-[11px] font-extrabold text-[#4361EE] uppercase tracking-wider block">
                Selected Device
              </span>
              <span className="text-sm sm:text-base font-extrabold text-gray-900 truncate block">
                {selectedPhone.brand} {selectedPhone.model}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleContinue}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4361EE] hover:bg-[#3451de] text-white rounded-xl font-bold text-xs sm:text-sm shadow-xs hover:-translate-y-0.5 transition-all cursor-pointer border-none shrink-0"
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <span>Continue</span>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </>
            )}
          </button>
        </div>
      )}

      {/* ── Phone Cards Grid ── */}
      {!loading && phones.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {phones.map((phone) => {
            const isSelected =
              (selectedPhone?._id && selectedPhone._id === phone._id) ||
              (selectedPhone?.id && selectedPhone.id === phone.id)

            return (
              <div
                key={phone.id || phone._id}
                onClick={() => handlePhoneClick(phone)}
                className={`relative p-5 rounded-2xl border transition-all cursor-pointer select-none bg-white ${
                  isSelected
                    ? 'border-[#4361EE] ring-2 ring-[#4361EE]/15 shadow-md bg-blue-50/10'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                {/* Checkmark icon on selected */}
                {isSelected && (
                  <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#4361EE] text-white flex items-center justify-center shadow-sm">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M4 8.5L6.5 11L12 5.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}

                {/* Phone Image (centered, larger) */}
                <div className="flex justify-center mb-4">
                  {phone.image ? (
                    <Image
                      src={phone.image}
                      alt={phone.model}
                      width={200}
                      height={200}
                      className="rounded-xl object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center text-[#4361EE]">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="5" y="2" width="14" height="20" rx="3" />
                        <line x1="12" y1="18" x2="12.01" y2="18" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="text-xs text-gray-500 font-medium">{phone.brand}</div>
                <div className="text-base font-bold text-gray-900 mt-0.5 mb-1.5 font-heading">
                  {phone.model}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Bottom Action ── */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleContinue}
          disabled={!selectedPhone || isSubmitting}
          className={`inline-flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm transition-all border-none ${
            selectedPhone && !isSubmitting
              ? 'bg-[#4361EE] text-white hover:bg-[#3451de] hover:translate-x-0.5 shadow-md cursor-pointer'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Loading products...</span>
            </>
          ) : (
            <>
              <span>Continue</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </>
          )}
        </button>
      </div>

      {/* ── Floating Sticky Bottom Bar for Instant Continue Access Across Long Catalogs ── */}
      {selectedPhone && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/90 shadow-[0_-4px_24px_rgba(0,0,0,0.09)] py-3 px-4 sm:px-6">
          <div className="max-w-[920px] mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              {selectedPhone.image ? (
                <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
                  <Image
                    src={selectedPhone.image}
                    alt={selectedPhone.model}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#4361EE] flex items-center justify-center shrink-0 text-base font-bold">
                  📱
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-extrabold text-emerald-700 uppercase tracking-wider">
                    Selected
                  </span>
                </div>
                <div className="text-sm sm:text-base font-extrabold text-gray-900 truncate">
                  {selectedPhone.brand} {selectedPhone.model}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleContinue}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 bg-[#4361EE] hover:bg-[#3451de] text-white rounded-xl font-bold text-sm sm:text-base shadow-[0_2px_12px_rgba(67,97,238,0.35)] hover:-translate-y-0.5 transition-all cursor-pointer border-none shrink-0"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Loading accessories...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 8H13M13 8L9 4M13 8L9 12"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </motion.div>
  )
}
