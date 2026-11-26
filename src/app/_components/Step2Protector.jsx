'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Image from 'next/image'

// Helper to extract or synthesize modern consumer-ready features from MongoDB product document
export function extractProductFeatures(item) {
  if (!item) return []

  // 1. If explicit features array is present in MongoDB and has items, use them
  if (Array.isArray(item.features) && item.features.length > 0) {
    return item.features.filter(Boolean)
  }

  const specs = item.specifications || {}
  const name = (item.name || '').toLowerCase()
  const categoryName = (item.categoryName || item.categoryId?.name || item.category || '').toLowerCase()
  const isFlip = /flip/i.test(name) || /flip/i.test(categoryName)
  const features = []

  // 2. Synthesize rich features from specifications
  if (specs.hardness) {
    features.push(`${specs.hardness} Hardness Surface Scratch Protection`)
  }
  if (specs.coverage) {
    features.push(`${specs.coverage} Full Screen Edge Coverage`)
  }
  if (specs.installation) {
    features.push(`${specs.installation} Certified Doorstep Fitting`)
  }
  if (specs.thickness) {
    features.push(`${specs.thickness} Ultra-Thin Touch Sensitivity`)
  }
  if (specs.material) {
    features.push(`High Grade ${specs.material} Construction`)
  }
  if (specs.fit) {
    features.push(`Laser Precision ${specs.fit} Alignment`)
  }

  // 3. Fallbacks if specifications didn't fill at least 4 features
  if (isFlip) {
    if (features.length < 4) {
      features.push('360° Shockproof Impact & Edge Shield')
      features.push('Built-in Storage Slot for Cards & Cash')
      features.push('Hands-Free Horizontal Media Kickstand')
      features.push('Doorstep Fitting & Screen Inspection Included')
    }
  } else {
    if (features.length < 4) {
      features.push('Oleophobic Anti-Fingerprint & Smudge-Free Coating')
      features.push('99.9% HD Optical Clarity with Zero Glare')
      features.push('Bubble-Free Doorstep Precision Installation')
      features.push('Shatter-Proof Multi-Layer Safety Glass')
    }
  }

  return Array.from(new Set(features)).slice(0, 4)
}

export const PROTECTORS = [
  {
    id: 'tempered-glass',
    name: 'Tempered Glass Protector',
    category: 'tempered-glass',
    inStock: true,
    features: [
      '9H Hardness Surface Scratch Protection',
      'Edge-to-Edge Full Screen Coverage',
      '0.3 mm Ultra-Thin Touch Sensitivity',
      'Bubble-Free Certified Doorstep Fitting',
    ],
    productPrice: 449,
    installPrice: 0,
    totalPrice: 449,
    icon: 'shield',
    image: 'https://res.cloudinary.com/cehmvz0u/image/upload/f_auto,q_auto/apexguard/product/6af9e6d09e7685f5efad4a40',
    stock: { quantity: 8, isLowStock: true, inStock: true },
  },
  {
    id: 'flip-cover',
    name: 'Flip Covers & Wallet Case',
    category: 'flip-cover',
    inStock: true,
    features: [
      '360° Shockproof Impact & Edge Shield',
      'Built-in Storage Slot for Cards & Cash',
      'Hands-Free Horizontal Media Kickstand',
      'Doorstep Fitting & Inspection Included',
    ],
    productPrice: 749,
    installPrice: 0,
    totalPrice: 749,
    icon: 'cover',
    image: 'https://res.cloudinary.com/cehmvz0u/image/upload/f_auto,q_auto/apexguard/product/flip_cover_default',
    stock: { quantity: 5, isLowStock: true, inStock: true },
  },
]

export default function Step2Protector({
  selectedPhone,
  selectedCategory,
  onSelectCategory,
  selectedProtector,
  onSelectProtector,
  onNext,
}) {
  const targetCategory = selectedCategory || 'tempered-glass'
  const activePhoneId = selectedPhone?._id || selectedPhone?.id

  // Initialize products from cached localStorage if it matches current phone and category
  const [products, setProducts] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const cachedCat = localStorage.getItem('screencare_protector_category')
        const cachedPhone = localStorage.getItem('screencare_protector_phone_id')
        const cached = localStorage.getItem('screencare_protector_products')
        if (
          cached &&
          (!cachedCat || cachedCat === targetCategory) &&
          (!cachedPhone || !activePhoneId || cachedPhone === activePhoneId)
        ) {
          const list = JSON.parse(cached)
          if (Array.isArray(list) && list.length > 0) return list
        }
      } catch (e) {}
    }
    return []
  })

  const [loading, setLoading] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const cachedCat = localStorage.getItem('screencare_protector_category')
        const cachedPhone = localStorage.getItem('screencare_protector_phone_id')
        const cached = localStorage.getItem('screencare_protector_products')
        if (
          cached &&
          (!cachedCat || cachedCat === targetCategory) &&
          (!cachedPhone || !activePhoneId || cachedPhone === activePhoneId)
        ) {
          const list = JSON.parse(cached)
          if (Array.isArray(list) && list.length > 0) return false
        }
      } catch (e) {}
    }
    return true
  })
  const [error, setError] = useState(null)

  // Image preview & interactive zoom modal state
  const [previewProduct, setPreviewProduct] = useState(null)
  const [previewImageIndex, setPreviewImageIndex] = useState(0)
  const [zoomScale, setZoomScale] = useState(1)

  const handleOpenPreview = (product, imgIndex = 0) => {
    setPreviewProduct(product)
    setPreviewImageIndex(imgIndex)
    setZoomScale(1)
  }

  const handleClosePreview = () => {
    setPreviewProduct(null)
    setZoomScale(1)
  }

  const handleToggleZoom = () => {
    setZoomScale((prev) => (prev > 1.2 ? 1 : 2))
  }

  const handleZoomIn = () => {
    setZoomScale((prev) => Math.min(prev + 0.5, 3))
  }

  const handleZoomOut = () => {
    setZoomScale((prev) => Math.max(prev - 0.5, 1))
  }

  // Keyboard accessibility: Close preview on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && previewProduct) {
        handleClosePreview()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [previewProduct])

  // Resolve phone from props or localStorage
  const activePhone = selectedPhone || (() => {
    if (typeof window !== 'undefined') {
      try {
        const s = localStorage.getItem('screencare_selected_phone')
        if (s) return JSON.parse(s)
      } catch (e) {}
    }
    return null
  })()

  const currentPhoneName = activePhone
    ? `${activePhone.brand || ''} ${activePhone.model || ''}`.trim()
    : 'Selected Device'

  // Fetch products from backend for this phone and category
  const fetchProducts = useCallback(async () => {
    let phone = selectedPhone
    if (!phone && typeof window !== 'undefined') {
      try {
        const savedPhone = localStorage.getItem('screencare_selected_phone')
        if (savedPhone) phone = JSON.parse(savedPhone)
      } catch (e) {}
    }

    if (!phone?._id && !phone?.id) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const backendUrl = process.env.NEXT_PUBLIC_BACKENDURL || 'http://localhost:4000'
      const phoneId = phone._id || phone.id
      const currentCat = selectedCategory || 'tempered-glass'
      const catParam = `?category=${encodeURIComponent(currentCat)}`

      const res = await fetch(`${backendUrl}/phone/${phoneId}/accessories${catParam}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!res.ok) {
        throw new Error(`Failed to load products (${res.status})`)
      }

      const json = await res.json()
      const list = Array.isArray(json) ? json : json.data || []

      // Normalize products with images, specifications, pricing and stock info
      const normalized = list.map((item) => {
        const isFlip = /flip/i.test(item.name || item.categoryId?.name)
        const defaultImg = isFlip
          ? 'https://res.cloudinary.com/cehmvz0u/image/upload/f_auto,q_auto/apexguard/product/flip_cover_default'
          : 'https://res.cloudinary.com/cehmvz0u/image/upload/f_auto,q_auto/apexguard/product/6af9e6d09e7685f5efad4a40'

        // Prioritize actual image sent by backend in the tempered glass and flip cover
        const primaryImage =
          (item.image && typeof item.image === 'string' && !item.image.includes('unsplash.com') ? item.image.trim() : null) ||
          (Array.isArray(item.images) && item.images.length > 0 && !item.images[0].includes('unsplash.com') ? item.images[0].trim() : null) ||
          item.image ||
          defaultImg

        const price = typeof item.price === 'number' ? item.price : 449

        const rawStock = item.stock || {}
        const quantity =
          typeof rawStock.quantity === 'number'
            ? rawStock.quantity
            : typeof rawStock.availableQuantity === 'number'
            ? rawStock.availableQuantity
            : 8

        const isLowStock = quantity < 10

        const itemFeatures = extractProductFeatures(item)

        return {
          id: item._id || item.id,
          _id: item._id || item.id,
          name: item.name || (isFlip ? 'Premium Wallet Flip Cover' : '9H HD Tempered Glass Protector'),
          sku: item.sku || (isFlip ? 'FC-PRO-CASE' : 'TG-PRO-GLASS'),
          description:
            item.description ||
            (isFlip
              ? 'Durable 360° drop protection with built-in card slots and kickstand.'
              : 'Ultra-tough 9H scratch-resistant glass with crystal-clear high definition display.'),
          price,
          productPrice: price,
          installPrice: 0,
          totalPrice: price,
          images: Array.isArray(item.images) && item.images.length > 0 ? item.images : [primaryImage],
          image: primaryImage,
          categoryName:
            item.categoryId?.name ||
            (isFlip ? 'Flip Cover' : 'Tempered Glass'),
          specifications: item.specifications || {},
          features: itemFeatures,
          stock: {
            ...rawStock,
            quantity,
            availableQuantity: quantity,
            isLowStock,
            inStock: quantity > 0,
          },
          inStock: quantity > 0,
        }
      })

      setProducts(normalized)

      // Save normalized product list in localStorage
      if (typeof window !== 'undefined' && normalized.length > 0) {
        localStorage.setItem('screencare_protector_products', JSON.stringify(normalized))
        localStorage.setItem('screencare_protector_category', currentCat)
        localStorage.setItem('screencare_protector_phone_id', phoneId)
      }

      // Preserve existing selectedProtector if it matches the new category & phone, or select first
      let currentProtector = selectedProtector
      if (!currentProtector && typeof window !== 'undefined') {
        try {
          const s = localStorage.getItem('screencare_selected_protector')
          if (s) currentProtector = JSON.parse(s)
        } catch (e) {}
      }

      if (normalized.length > 0) {
        const targetId = currentProtector?._id || currentProtector?.id
        const found = targetId
          ? normalized.find((p) => (p._id || p.id) === targetId)
          : null

        if (found) {
          onSelectProtector(found)
          if (typeof window !== 'undefined') {
            localStorage.setItem('screencare_selected_protector', JSON.stringify(found))
          }
        } else {
          // Changed product/phone from previous page -> automatically select the first matching accessory
          onSelectProtector(normalized[0])
          if (typeof window !== 'undefined') {
            localStorage.setItem('screencare_selected_protector', JSON.stringify(normalized[0]))
          }
        }
      }
    } catch (err) {
      console.error('Error fetching accessories for phone:', err)
      if (products.length === 0) {
        setError('Failed to fetch accessories from server. Please retry.')
      }
    } finally {
      setLoading(false)
    }
  }, [selectedPhone, selectedCategory, onSelectProtector])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleSelectProduct = (item) => {
    onSelectProtector(item)
    if (typeof window !== 'undefined') {
      localStorage.setItem('screencare_selected_protector', JSON.stringify(item))
    }
  }

  const handleContinue = () => {
    if (selectedProtector && typeof window !== 'undefined') {
      localStorage.setItem('screencare_selected_protector', JSON.stringify(selectedProtector))
    }
    onNext()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4 }}
      className="max-w-[1050px] mx-auto pt-10 pb-28 px-6 font-sans text-gray-800"
    >
      {/* ── Section Header (Enlarged fonts) ── */}
      <div className="mb-7">
        <span className="block text-xs sm:text-sm font-extrabold tracking-wider text-[#4361EE] uppercase mb-2">
          FOR {currentPhoneName.toUpperCase()}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-2.5 font-heading">
          Choose your protection
        </h1>
        <p className="text-base sm:text-lg text-gray-600 font-normal">
          Showing verified compatible accessories fetched directly for your {currentPhoneName}.
        </p>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm sm:text-base flex items-center justify-between mb-6 shadow-xs">
          <span>{error}</span>
          <button
            type="button"
            onClick={fetchProducts}
            className="text-xs sm:text-sm font-semibold px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-colors cursor-pointer border-none"
          >
            Retry
          </button>
        </div>
      )}

      {/* ── 2-Column Content ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 mb-8">
        {/* Left Column: Product Options (2 cols wide) */}
        <div className="lg:col-span-2 space-y-5">
          {/* Loading Skeleton */}
          {loading && (
            <div className="space-y-4">
              {[1, 2].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-2xl p-6 border border-gray-200 animate-pulse flex items-center gap-5"
                >
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gray-200 shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-1/3" />
                    <div className="h-6 bg-gray-200 rounded w-2/3" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && products.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3 text-gray-400">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">No products found</h3>
              <p className="text-sm text-gray-500 mb-4">
                No accessories found for this specific category and device.
              </p>
              <button
                type="button"
                onClick={fetchProducts}
                className="text-sm font-semibold px-5 py-2.5 bg-[#4361EE] text-white rounded-xl hover:bg-[#3451de] border-none cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}

          {/* Product Cards List */}
          {!loading &&
            products.map((item) => {
              const isSelected =
                (selectedProtector?._id && selectedProtector._id === item._id) ||
                (selectedProtector?.id && selectedProtector.id === item.id)

              const stockQty = item.stock?.quantity ?? item.stock?.availableQuantity ?? 50
              const isLowStock = stockQty < 10 && stockQty > 0
              const featuresList =
                Array.isArray(item.features) && item.features.length > 0
                  ? item.features
                  : extractProductFeatures(item)

              // Filter specifications to customer-relevant specs
              const filteredSpecs = Object.entries(item.specifications || {}).filter(
                ([k]) => !/^(pricingBasis|compatibility)$/i.test(k)
              )

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectProduct(item)}
                  className={`relative rounded-3xl p-6 sm:p-7 md:p-8 border transition-all duration-200 cursor-pointer select-none group ${
                    isSelected
                      ? 'bg-gradient-to-br from-blue-50/40 via-white to-indigo-50/20 border-[#4361EE] ring-2 ring-[#4361EE]/20 shadow-[0_10px_30px_rgba(67,97,238,0.14)]'
                      : 'bg-white border-gray-200/90 hover:border-gray-300 hover:shadow-[0_8px_25px_rgba(0,0,0,0.05)]'
                  }`}
                >
                  {/* Top Bar: Badges, SKU, Stock, and Select State */}
                  <div className="flex items-center justify-between gap-3 flex-wrap mb-4 pb-3 border-b border-gray-150/70">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Category Pill */}
                      <span className="text-xs font-bold tracking-wider uppercase bg-[#4361EE]/10 text-[#4361EE] px-3 py-1 rounded-full border border-[#4361EE]/20">
                        {item.categoryName}
                      </span>

                      {/* SKU Monospace Tag */}
                      {item.sku && (
                        <span className="text-[11px] font-mono font-semibold text-gray-500 bg-gray-100/90 px-2.5 py-1 rounded-md border border-gray-200/70">
                          SKU: {item.sku}
                        </span>
                      )}

                      {/* Stock Status Badge */}
                      {isLowStock ? (
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                          ⚡ Only {stockQty} left in stock!
                        </span>
                      ) : item.inStock ? (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          In Stock ({stockQty} units)
                        </span>
                      ) : (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 border border-rose-200">
                          <span className="w-2 h-2 rounded-full bg-rose-500" />
                          Out of stock
                        </span>
                      )}
                    </div>

                    {/* Active Selected Pill */}
                   </div>

                  {/* Middle Content: Image + Details */}
                  <div className="flex flex-col sm:flex-row items-start gap-6 mb-5">
                    {/* Modern Product Image Container with Zoom Preview Trigger */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOpenPreview(item)
                      }}
                      className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl bg-white border border-gray-200/80 p-3 shrink-0 flex items-center justify-center relative overflow-hidden shadow-2xs group/img cursor-zoom-in hover:border-[#4361EE] hover:shadow-md transition-all"
                      title="Click to preview & zoom"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={170}
                        height={170}
                        className="w-full h-full object-contain group-hover/img:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                      {/* Hover Zoom Overlay Pill */}
                      <div className="absolute inset-0 bg-black/35 backdrop-blur-[1.5px] opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-gray-900 text-xs font-bold shadow-lg">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            <line x1="11" y1="8" x2="11" y2="14" />
                            <line x1="8" y1="11" x2="14" y2="11" />
                          </svg>
                          <span>Preview & Zoom</span>
                        </span>
                      </div>
                      <span className="absolute bottom-2 left-2 text-[10px] font-bold text-gray-500 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded border border-gray-200/60 shadow-2xs">
                        100% Genuine
                      </span>
                    </div>

                    {/* Product Heading & Description */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-1.5 leading-snug font-heading group-hover:text-[#4361EE] transition-colors">
                        {item.name}
                      </h3>

                      <p className="text-sm sm:text-base text-gray-600 mb-3 leading-relaxed">
                        {item.description}
                      </p>

                      {/* ── Key Features with Modern Check Marks ── */}
                      <div className="mt-3.5 mb-3">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 block mb-2">
                          Key Features & Highlights
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {featuresList.map((feat, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2.5 bg-gray-50/80 hover:bg-gray-100/70 p-2.5 rounded-xl border border-gray-150 transition-colors"
                            >
                              <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                                <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                                  <path
                                    d="M3.5 8.5L6.5 11.5L12.5 5.5"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                              <span className="text-xs sm:text-sm font-semibold text-gray-800 leading-tight">
                                {feat}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Specifications Pills Strip */}
                      {filteredSpecs.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {filteredSpecs.map(([key, val]) => (
                            <span
                              key={key}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-gray-100/90 text-gray-700 px-2.5 py-1 rounded-lg border border-gray-200/60"
                            >
                              <span className="text-gray-400 capitalize">{key}:</span>
                              <span className="text-gray-900">{String(val)}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pricing & Selection Footer */}
                  <div className="border-t border-gray-150/70 pt-4 flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-heading">
                          ₹{item.price}
                        </span>

                      </div>
                      <span className="text-xs text-gray-500 font-medium block mt-0.5">
                        Doorstep installation & screen inspection included • 0 hidden fees
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSelectProduct(item)
                      }}
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all border-none cursor-pointer ${
                        isSelected
                          ? 'bg-[#4361EE] text-white shadow-md hover:bg-[#3451de]'
                          : 'bg-gray-100 text-gray-800 hover:bg-[#4361EE] hover:text-white'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                            <path
                              d="M3.5 8.5L6.5 11.5L12.5 5.5"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span>Selected Protection</span>
                        </>
                      ) : (
                        <span>Select Protection</span>
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
        </div>

        {/* Right Column: Your Selection Summary Box */}
        <div>
          <div className="bg-white border border-gray-200/90 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4 sticky top-24">
            <h4 className="text-base sm:text-lg font-bold text-gray-900 m-0 pb-1">
              Your selection
            </h4>

            {/* Selected Phone */}
            <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-150">
              <div className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                Target Device
              </div>
              <div className="text-base font-extrabold text-gray-900 mt-0.5">
                {currentPhoneName}
              </div>
            </div>

            {/* Selected Product with Thumbnail */}
            <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-150">
              <div className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2.5">
                Chosen Protection
              </div>
              <div className="flex items-start gap-3.5">
                {selectedProtector?.image && (
                  <div
                    onClick={() => handleOpenPreview(selectedProtector)}
                    className="w-14 h-14 rounded-xl overflow-hidden bg-white border border-gray-200/80 p-1 shrink-0 flex items-center justify-center cursor-zoom-in hover:border-[#4361EE] hover:shadow-xs transition-all"
                    title="Click to preview & zoom"
                  >
                    <Image
                      src={selectedProtector.image}
                      alt={selectedProtector.name || ''}
                      width={52}
                      height={52}
                      className="w-full h-full object-contain"
                      unoptimized
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">
                    {selectedProtector?.name || 'Please select a protector'}
                  </div>

                  <div className="text-base font-extrabold text-[#4361EE] mt-1">
                    ₹{selectedProtector?.totalPrice || selectedProtector?.price || 449}
                  </div>
                </div>
              </div>

              {/* Mini Features List with Checkmarks in Summary */}
              {selectedProtector && (
                <div className="mt-3.5 pt-3 border-t border-gray-200/70 space-y-1.5">
                  {(
                    selectedProtector.features || extractProductFeatures(selectedProtector)
                  ).slice(0, 3).map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-medium text-gray-700">
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-emerald-500 shrink-0">
                        <path
                          d="M3.5 8.5L6.5 11.5L12.5 5.5"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="truncate">{f}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Stock Notification in Summary if less than 10 */}
            {selectedProtector?.stock && (
              <div
                className={`rounded-2xl p-4 border ${
                  selectedProtector.stock.quantity < 10 && selectedProtector.stock.quantity > 0
                    ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                    : 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                }`}
              >
                <div className="text-[11px] font-bold uppercase tracking-wider">
                  Stock Availability
                </div>
                <div className="text-sm font-bold mt-1 flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      selectedProtector.stock.quantity < 10 && selectedProtector.stock.quantity > 0
                        ? 'bg-amber-500 animate-pulse'
                        : 'bg-emerald-500'
                    }`}
                  />
                  {selectedProtector.stock.quantity < 10 && selectedProtector.stock.quantity > 0
                    ? `Only ${selectedProtector.stock.quantity} items left in stock!`
                    : `In Stock (${selectedProtector.stock.quantity} units available)`}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Floating Sticky Bottom Bar for Instant Continue Access ── */}
      {selectedProtector && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/90 shadow-[0_-4px_24px_rgba(0,0,0,0.09)] py-3 px-4 sm:px-6">
          <div className="max-w-[1050px] mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              {selectedProtector.image ? (
                <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center p-1 shadow-xs">
                  <Image
                    src={selectedProtector.image}
                    alt={selectedProtector.name || ''}
                    width={48}
                    height={48}
                    className="w-full h-full object-contain"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#4361EE] flex items-center justify-center shrink-0 text-base font-bold">
                  🛡️
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
                  {selectedProtector.name}
                  <span className="ml-2 text-[#4361EE]">
                    ₹{selectedProtector.totalPrice || selectedProtector.price || 449}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleContinue}
              disabled={!selectedProtector}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 bg-[#4361EE] hover:bg-[#3451de] text-white rounded-xl font-bold text-sm sm:text-base shadow-[0_2px_12px_rgba(67,97,238,0.35)] hover:-translate-y-0.5 transition-all cursor-pointer border-none shrink-0"
            >
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
            </button>
          </div>
        </div>
      )}
      {/* ── Image Preview & Interactive Zoom Lightbox with Mini Animation ── */}
      <AnimatePresence>
        {previewProduct && (
          <motion.div
            key="preview-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onClick={handleClosePreview}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          >
            {/* Modal Dialog with Mini Pop/Spring Opening Animation */}
            <motion.div
              key="preview-modal"
              initial={{ opacity: 0, scale: 0.86, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.86, y: 18 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-[660px] w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100 relative"
            >
              {/* Modal Top Header */}
              <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100 bg-gray-50/70">
                <div className="flex items-center gap-2.5 min-w-0 pr-4">
                  <span className="text-xs font-bold tracking-wider uppercase bg-[#4361EE]/10 text-[#4361EE] px-2.5 py-0.5 rounded-md shrink-0">
                    {previewProduct.categoryName || 'Accessory'}
                  </span>
                  <h3 className="text-sm sm:text-base font-extrabold text-gray-900 truncate m-0 font-heading">
                    {previewProduct.name}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={handleClosePreview}
                  className="w-8 h-8 rounded-full bg-gray-200/80 hover:bg-gray-300 text-gray-700 flex items-center justify-center transition-colors cursor-pointer border-none shrink-0"
                  title="Close preview (Esc)"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 3L13 13M13 3L3 13"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>

              {/* Main Zoom Canvas Area */}
              <div className="relative flex-1 min-h-[320px] sm:min-h-[420px] max-h-[480px] bg-gradient-to-b from-gray-50/60 to-gray-100/40 flex items-center justify-center overflow-hidden p-6 select-none">
                <div
                  onClick={handleToggleZoom}
                  className={`relative w-full h-full max-w-[380px] max-h-[380px] flex items-center justify-center transition-transform duration-200 ease-out ${
                    zoomScale > 1.2 ? 'cursor-zoom-out' : 'cursor-zoom-in'
                  }`}
                  style={{
                    transform: `scale(${zoomScale})`,
                  }}
                  title={zoomScale > 1.2 ? 'Click to zoom out' : 'Click to zoom in'}
                >
                  <Image
                    src={
                      (Array.isArray(previewProduct.images) && previewProduct.images.length > 0
                        ? previewProduct.images[previewImageIndex] || previewProduct.images[0]
                        : previewProduct.image) || previewProduct.image
                    }
                    alt={previewProduct.name}
                    width={380}
                    height={380}
                    className="max-w-full max-h-full object-contain pointer-events-none drop-shadow-md"
                    unoptimized
                  />
                </div>

                {/* Floating Interactive Zoom Controls Bar */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md border border-gray-200/90 rounded-full px-3.5 py-1.5 shadow-lg flex items-center gap-2 text-xs font-bold text-gray-700">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleZoomOut()
                    }}
                    disabled={zoomScale <= 1}
                    className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed border-none bg-transparent cursor-pointer"
                    title="Zoom Out (-)"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setZoomScale(1)
                    }}
                    className="px-2 py-0.5 rounded-md hover:bg-gray-100 font-mono transition-colors border-none bg-transparent cursor-pointer text-xs font-bold text-gray-800"
                    title="Reset Zoom"
                  >
                    {Math.round(zoomScale * 100)}%
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleZoomIn()
                    }}
                    disabled={zoomScale >= 3}
                    className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed border-none bg-transparent cursor-pointer"
                    title="Zoom In (+)"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>

                  <span className="text-[11px] text-gray-400 font-normal border-l border-gray-200 pl-2 hidden sm:inline">
                    Click image to toggle 2x
                  </span>
                </div>
              </div>

              {/* Multiple Thumbnails Strip (if product has multiple images) */}
              {Array.isArray(previewProduct.images) && previewProduct.images.length > 1 && (
                <div className="flex items-center justify-center gap-2.5 px-6 py-2.5 bg-gray-50/60 border-t border-gray-100 overflow-x-auto">
                  {previewProduct.images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setPreviewImageIndex(idx)
                        setZoomScale(1)
                      }}
                      className={`w-12 h-12 rounded-xl p-1 bg-white border transition-all cursor-pointer overflow-hidden ${
                        previewImageIndex === idx
                          ? 'border-[#4361EE] ring-2 ring-[#4361EE]/20 shadow-xs'
                          : 'border-gray-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={img}
                        alt=""
                        width={40}
                        height={40}
                        className="w-full h-full object-contain"
                        unoptimized
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Modal Bottom Footer: Pricing & Select CTA */}
              <div className="px-5 sm:px-6 py-3.5 bg-white border-t border-gray-100 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-gray-900 font-heading">
                    ₹{previewProduct.totalPrice || previewProduct.price}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                    Doorstep installation included
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    handleSelectProduct(previewProduct)
                    handleClosePreview()
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#4361EE] hover:bg-[#3451de] text-white text-xs sm:text-sm font-bold shadow-md transition-all border-none cursor-pointer flex items-center gap-2"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3.5 8.5L6.5 11.5L12.5 5.5"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Select This Protection</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
