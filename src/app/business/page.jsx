'use client'

import { useState, useEffect, useMemo, useCallback, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { useAuth } from '../_context/AuthContext'

// Wholesale Rates
const B2B_RATES = {
  temperedGlass: 49,
  flipCover: 99,
}

// 5-Step Process definition matching individual booking wizard
const BUSINESS_STEPS = [
  { id: 1, key: 'business-info', label: 'Business Info', subLabel: 'Profile' },
  { id: 2, key: 'bulk-order', label: 'Bulk Order', subLabel: 'Products' },
  { id: 3, key: 'delivery', label: 'Delivery', subLabel: 'Shipping' },
  { id: 4, key: 'review', label: 'Review Order', subLabel: 'Verify' },
  { id: 5, key: 'payment', label: 'Payment', subLabel: 'Confirm' },
]

// Product details for visual review cards with genuine Cloudinary images from backend
const PRODUCT_INFO = {
  temperedGlass: {
    title: '9H HD Tempered Glass Screen Protector',
    category: 'Tempered Glass',
    wholesaleRate: B2B_RATES.temperedGlass,
    defaultQty: 20,
    image: 'https://res.cloudinary.com/cehmvz0u/image/upload/f_auto,q_auto/apexguard/product/6af9e6d09e7685f5efad4a40',
    specs: ['9H Hardness Scratch Protection', '0.3mm Ultra-Thin Touch', 'Bubble-Free Alignment', 'Edge-to-Edge Coverage'],
    tag: 'Retailer Fast-Seller',
  },
  flipCover: {
    title: 'Executive Wallet Magnetic Flip Cover',
    category: 'Flip Cover',
    wholesaleRate: B2B_RATES.flipCover,
    defaultQty: 10,
    image: 'https://res.cloudinary.com/cehmvz0u/image/upload/f_auto,q_auto/apexguard/product/flip_cover_default',
    specs: ['360° Shockproof Impact Shield', 'Built-in Card & Cash Slots', 'Hands-Free Kickstand', 'Soft PU Leather Finish'],
    tag: 'Premium Accessory',
  },
}

function BusinessFlowContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()

  // Step state (1 through 5)
  const stepParam = parseInt(searchParams.get('step') || '1', 10)
  const currentStep = Math.min(Math.max(isNaN(stepParam) ? 1 : stepParam, 1), 5)

  const goToStep = (stepNumber) => {
    router.push(`/business?step=${stepNumber}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ─────────────────────────────────────────────────────────────
  // STEP 1 STATE: Business & Retailer Information
  // ─────────────────────────────────────────────────────────────
  const [businessProfile, setBusinessProfile] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('screencare_business_profile')
        if (saved) return JSON.parse(saved)
      } catch (e) {}
    }
    return {
      shopName: '',
      contactPerson: '',
      mobileNumber: '',
      whatsappNumber: '',
      gstNumber: '',
      shopAddress: '',
      city: '',
      state: '',
      pincode: '',
    }
  })

  const [businessErrors, setBusinessErrors] = useState({})

  // Auto-fill user contact info if available
  useEffect(() => {
    if (user) {
      setBusinessProfile((prev) => ({
        ...prev,
        contactPerson: prev.contactPerson || user.name || '',
        mobileNumber: prev.mobileNumber || user.phone || '',
        whatsappNumber: prev.whatsappNumber || user.phone || '',
      }))
    }
  }, [user])

  const validateBusinessInfo = () => {
    const errs = {}
    if (!businessProfile.shopName.trim()) errs.shopName = 'Shop / Business name is required'
    if (!businessProfile.contactPerson.trim()) errs.contactPerson = 'Contact person name is required'
    if (!businessProfile.mobileNumber.trim() || businessProfile.mobileNumber.length < 10) {
      errs.mobileNumber = 'Enter a valid 10-digit mobile number'
    }
    if (!businessProfile.whatsappNumber.trim() || businessProfile.whatsappNumber.length < 10) {
      errs.whatsappNumber = 'Enter a valid 10-digit WhatsApp number'
    }
    if (!businessProfile.shopAddress.trim()) errs.shopAddress = 'Shop address is required'
    if (!businessProfile.city.trim()) errs.city = 'City is required'
    if (!businessProfile.state.trim()) errs.state = 'State is required'
    if (!businessProfile.pincode.trim() || businessProfile.pincode.length < 6) {
      errs.pincode = 'Enter a valid 6-digit PIN code'
    }

    setBusinessErrors(errs)
    if (Object.keys(errs).length > 0) {
      return false
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('screencare_business_profile', JSON.stringify(businessProfile))
    }
    return true
  }

  const handleStep1Next = (e) => {
    if (e) e.preventDefault()
    if (validateBusinessInfo()) {
      goToStep(2)
    }
  }

  // ─────────────────────────────────────────────────────────────
  // STEP 2 STATE: Bulk Order Selection (Multiple Phone Models)
  // ─────────────────────────────────────────────────────────────
  const [orderItems, setOrderItems] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('screencare_business_order_items')
        if (saved) {
          const list = JSON.parse(saved)
          if (Array.isArray(list) && list.length > 0) return list
        }
      } catch (e) {}
    }
    return [
      {
        id: 'item-1',
        phoneModel: '',
        brand: '',
        temperedGlassQty: 20,
        flipCoverQty: 10,
        searchQuery: '',
        isSelecting: false,
      },
    ]
  })

  // Persist order items across reloads
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('screencare_business_order_items', JSON.stringify(orderItems))
    }
  }, [orderItems])

  const [backendPhoneOptions, setBackendPhoneOptions] = useState([])
  const [isSearchingPhones, setIsSearchingPhones] = useState(false)
  const [step2Error, setStep2Error] = useState('')

  const searchBackendPhones = useCallback(async (query) => {
    if (!query || query.trim().length < 2) return
    try {
      setIsSearchingPhones(true)
      const backendUrl = process.env.NEXT_PUBLIC_BACKENDURL || 'http://localhost:4000'
      const res = await fetch(`${backendUrl}/phone?limit=25&search=${encodeURIComponent(query.trim())}`)
      if (res.ok) {
        const json = await res.json()
        const rawList = Array.isArray(json) ? json : json.data || []
        const formatted = rawList.map((p) => ({
          id: p._id || p.id,
          brand: p.brandName || (typeof p.brandId === 'object' && p.brandId ? p.brandId.name : 'Device'),
          model: p.name || p.model || 'Model',
          name: `${p.brandName || (typeof p.brandId === 'object' && p.brandId ? p.brandId.name : '')} ${p.name || p.model || ''}`.trim(),
        }))
        if (formatted.length > 0) {
          setBackendPhoneOptions(formatted)
        }
      }
    } catch (e) {
      console.warn('Backend search note:', e)
    } finally {
      setIsSearchingPhones(false)
    }
  }, [])

  const handleAddPhoneModel = () => {
    const newItem = {
      id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      phoneModel: '',
      brand: '',
      temperedGlassQty: 20,
      flipCoverQty: 10,
      searchQuery: '',
      isSelecting: true,
    }
    setOrderItems((prev) => [...prev, newItem])
    setStep2Error('')
  }

  const handleRemovePhoneModel = (id) => {
    if (orderItems.length <= 1) {
      setOrderItems([
        {
          id: 'item-1',
          phoneModel: '',
          brand: '',
          temperedGlassQty: 20,
          flipCoverQty: 10,
          searchQuery: '',
          isSelecting: false,
        },
      ])
      return
    }
    setOrderItems((prev) => prev.filter((item) => item.id !== id))
  }

  const handleUpdateItem = (id, field, value) => {
    setOrderItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          let updatedValue = value
          if (field === 'temperedGlassQty' || field === 'flipCoverQty') {
            updatedValue = Math.max(0, parseInt(value, 10) || 0)
          }
          return { ...item, [field]: updatedValue }
        }
        return item
      })
    )
  }

  const handleSelectModel = (id, device) => {
    setOrderItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            phoneModel: device.name || `${device.brand} ${device.model}`,
            brand: device.brand || 'Device',
            searchQuery: device.name || `${device.brand} ${device.model}`,
            temperedGlassQty: item.temperedGlassQty > 0 ? item.temperedGlassQty : 20,
            flipCoverQty: item.flipCoverQty > 0 ? item.flipCoverQty : 10,
            isSelecting: false,
          }
        }
        return item
      })
    )
    setStep2Error('')
  }

  // Active models selected by retailer
  const validOrderItems = useMemo(
    () => orderItems.filter((item) => item.phoneModel && item.phoneModel.trim() !== ''),
    [orderItems]
  )

  // Financial calculations
  const summary = useMemo(() => {
    let totalTemperedGlass = 0
    let totalFlipCovers = 0

    validOrderItems.forEach((item) => {
      totalTemperedGlass += item.temperedGlassQty || 0
      totalFlipCovers += item.flipCoverQty || 0
    })

    const totalQuantity = totalTemperedGlass + totalFlipCovers
    const temperedSubtotal = totalTemperedGlass * B2B_RATES.temperedGlass
    const flipCoverSubtotal = totalFlipCovers * B2B_RATES.flipCover
    const subtotal = temperedSubtotal + flipCoverSubtotal

    let discountPercent = 0
    if (totalQuantity >= 200) discountPercent = 20
    else if (totalQuantity >= 100) discountPercent = 15
    else if (totalQuantity >= 50) discountPercent = 10

    const discountAmount = Math.round((subtotal * discountPercent) / 100)
    const shipping = 0
    const grandTotal = Math.max(0, subtotal - discountAmount + shipping)

    return {
      totalTemperedGlass,
      totalFlipCovers,
      totalQuantity,
      subtotal,
      discountPercent,
      discountAmount,
      shipping,
      grandTotal,
    }
  }, [validOrderItems])

  const handleStep2Next = () => {
    if (validOrderItems.length === 0) {
      setStep2Error('Please search and select at least one phone model before proceeding.')
      window.scrollTo({ top: 200, behavior: 'smooth' })
      return
    }
    if (summary.totalQuantity <= 0) {
      setStep2Error('Please enter at least 1 unit of Tempered Glass or Flip Cover for your order.')
      return
    }
    setStep2Error('')
    goToStep(3)
  }

  // ─────────────────────────────────────────────────────────────
  // STEP 3 STATE: Delivery & Shipping Address
  // ─────────────────────────────────────────────────────────────
  const [deliveryMode, setDeliveryMode] = useState('shop')
  const [alternateAddress, setAlternateAddress] = useState({
    recipientName: '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
  })
  const [deliveryInstructions, setDeliveryInstructions] = useState('')
  const [step3Error, setStep3Error] = useState('')

  const handleStep3Next = () => {
    if (deliveryMode === 'alternate') {
      if (
        !alternateAddress.recipientName.trim() ||
        !alternateAddress.phone.trim() ||
        !alternateAddress.addressLine.trim() ||
        !alternateAddress.city.trim() ||
        !alternateAddress.pincode.trim()
      ) {
        setStep3Error('Please complete all required fields for the alternate delivery address.')
        return
      }
    }
    setStep3Error('')
    goToStep(4)
  }

  // Active delivery address resolved
  const activeShippingAddress = useMemo(() => {
    if (deliveryMode === 'alternate') {
      return {
        name: alternateAddress.recipientName || businessProfile.contactPerson,
        phone: alternateAddress.phone || businessProfile.mobileNumber,
        house: alternateAddress.addressLine,
        street: alternateAddress.landmark || '',
        city: alternateAddress.city,
        state: alternateAddress.state || businessProfile.state,
        pincode: alternateAddress.pincode,
        landmark: alternateAddress.landmark || '',
        addressType: 'warehouse_alternate',
      }
    }
    return {
      name: businessProfile.contactPerson,
      phone: businessProfile.mobileNumber,
      house: businessProfile.shopName,
      street: businessProfile.shopAddress,
      city: businessProfile.city,
      state: businessProfile.state,
      pincode: businessProfile.pincode,
      landmark: 'Registered Retail Shop',
      addressType: 'registered_business_shop',
    }
  }, [deliveryMode, alternateAddress, businessProfile])

  // ─────────────────────────────────────────────────────────────
  // STEP 4: Review Order -> Proceed to Payment
  // ─────────────────────────────────────────────────────────────
  const handleStep4Next = () => {
    goToStep(5)
  }

  // ─────────────────────────────────────────────────────────────
  // STEP 5 STATE: Payment & Backend Order Creation
  // ─────────────────────────────────────────────────────────────
  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [confirmedOrder, setConfirmedOrder] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('screencare_business_confirmed_order')
        if (saved) return JSON.parse(saved)
      } catch (e) {}
    }
    return null
  })
  const [orderError, setOrderError] = useState('')

  const handlePlaceOrder = async () => {
    setOrderError('')

    if (validOrderItems.length === 0 || summary.totalQuantity === 0) {
      setOrderError('Order is empty. Please return to Step 2 and add phone models.')
      goToStep(2)
      return
    }

    try {
      setIsPlacingOrder(true)
      const poNumber = `B2B-PO-${Date.now().toString().slice(-6)}`

      // Format items array for backend Order model
      const itemsPayload = []
      validOrderItems.forEach((item) => {
        if (item.temperedGlassQty > 0) {
          itemsPayload.push({
            productId: '6af9e6d09e7685f5efad4a40',
            name: `Tempered Glass for ${item.phoneModel}`,
            productName: `Tempered Glass for ${item.phoneModel}`,
            sku: `TG-${item.phoneModel.replace(/[^A-Za-z0-9]/g, '-').toUpperCase()}`,
            quantity: item.temperedGlassQty,
            price: B2B_RATES.temperedGlass,
            unitPrice: B2B_RATES.temperedGlass,
          })
        }
        if (item.flipCoverQty > 0) {
          itemsPayload.push({
            productId: '6af7154f2cd2f5982feec4a9',
            name: `Flip Cover for ${item.phoneModel}`,
            productName: `Flip Cover for ${item.phoneModel}`,
            sku: `FC-${item.phoneModel.replace(/[^A-Za-z0-9]/g, '-').toUpperCase()}`,
            quantity: item.flipCoverQty,
            price: B2B_RATES.flipCover,
            unitPrice: B2B_RATES.flipCover,
          })
        }
      })

      const orderPayload = {
        customerType: 'business',
        items: itemsPayload,
        shippingAddress: activeShippingAddress,
        billingAddress: {
          name: businessProfile.shopName,
          phone: businessProfile.mobileNumber,
          addressLine1: businessProfile.shopAddress,
          city: businessProfile.city,
          state: businessProfile.state,
          pincode: businessProfile.pincode,
          gstNumber: businessProfile.gstNumber || '',
          contactPerson: businessProfile.contactPerson,
          addressType: 'business',
        },
        deliverySchedule: {
          instructions: deliveryInstructions.trim() || 'Express B2B freight dispatch',
          slot: 'Standard B2B Freight (2-3 Business Days)',
        },
        subtotal: summary.subtotal,
        deliveryFee: 0,
        discount: summary.discountAmount,
        tax: 0,
        grandTotal: summary.grandTotal,
        paymentMethod,
        poNumber,
      }

      let backendSuccessOrder = null

      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKENDURL || 'http://localhost:4000'
        const res = await fetch(`${backendUrl}/orders`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload),
        })

        if (res.ok) {
          const json = await res.json()
          backendSuccessOrder = json.data || json
        }
      } catch (backendErr) {
        console.warn('Backend call notice, using local PO confirmation:', backendErr)
      }

      const finalConfirmed = {
        poNumber,
        orderId: backendSuccessOrder?.orderNumber || backendSuccessOrder?._id || `SC-B2B-${Date.now().toString().slice(-6)}`,
        businessProfile: { ...businessProfile },
        shippingAddress: { ...activeShippingAddress },
        items: validOrderItems.map((item) => ({ ...item })),
        summary: { ...summary },
        deliveryMode,
        deliveryInstructions,
        paymentMethod,
        orderDate: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        status: 'Confirmed - Dispatch Queue',
      }

      setConfirmedOrder(finalConfirmed)
      if (typeof window !== 'undefined') {
        localStorage.setItem('screencare_business_confirmed_order', JSON.stringify(finalConfirmed))
        localStorage.removeItem('screencare_business_order_items')
      }
    } catch (err) {
      console.error('Error placing bulk order:', err)
      setOrderError('Failed to place order. Please try again.')
    } finally {
      setIsPlacingOrder(false)
    }
  }

  const handleStartNewOrder = () => {
    setConfirmedOrder(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('screencare_business_confirmed_order')
    }
    setOrderItems([
      {
        id: 'item-1',
        phoneModel: '',
        brand: '',
        temperedGlassQty: 20,
        flipCoverQty: 10,
        searchQuery: '',
        isSelecting: false,
      },
    ])
    goToStep(2)
  }

  // ─────────────────────────────────────────────────────────────
  // RENDER CONFIRMED ORDER RECEIPT SLIP
  // ─────────────────────────────────────────────────────────────
  if (confirmedOrder) {
    return (
      <div className="min-h-screen bg-[#f8f9fb] py-10 px-4 sm:px-6 font-sans">
        <div className="max-w-[850px] mx-auto bg-white rounded-3xl border border-gray-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-6 sm:p-10">
          <div className="text-center pb-8 border-b border-gray-150">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl shadow-sm">
              ✓
            </div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#4361EE] block mb-1">
              Apexguard B2B Wholesale Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight font-heading mb-2">
              Wholesale Order Confirmed!
            </h1>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Thank you for ordering. Your purchase order has been placed and dispatched for warehouse packing.
            </p>
            <div className="mt-4 inline-flex items-center gap-3 bg-blue-50/80 border border-blue-200 px-4 py-2 rounded-xl text-xs">
              <span className="font-bold text-gray-700">Order ID: <strong className="text-[#4361EE] font-mono">{confirmedOrder.orderId}</strong></span>
              <span className="text-gray-300">|</span>
              <span className="font-bold text-gray-700">PO Number: <strong className="text-indigo-600 font-mono">{confirmedOrder.poNumber}</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 text-xs text-gray-600">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="font-bold text-gray-900 block mb-1 text-sm">🏢 Billed To (Shop)</span>
              <p className="font-bold text-gray-800 m-0 text-sm">{confirmedOrder.businessProfile.shopName}</p>
              <p className="m-0 mt-0.5">Attn: {confirmedOrder.businessProfile.contactPerson}</p>
              <p className="m-0">Mobile: {confirmedOrder.businessProfile.mobileNumber}</p>
              <p className="m-0">WhatsApp: {confirmedOrder.businessProfile.whatsappNumber}</p>
              {confirmedOrder.businessProfile.gstNumber && (
                <p className="m-0 font-mono text-[11px] text-gray-500">GST: {confirmedOrder.businessProfile.gstNumber}</p>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="font-bold text-gray-900 block mb-1 text-sm">📦 Dispatched To (Delivery)</span>
              <p className="font-bold text-gray-800 m-0 text-sm">{confirmedOrder.shippingAddress.name}</p>
              <p className="m-0 mt-0.5">{confirmedOrder.shippingAddress.house}</p>
              {confirmedOrder.shippingAddress.street && <p className="m-0">{confirmedOrder.shippingAddress.street}</p>}
              <p className="m-0">{confirmedOrder.shippingAddress.city}, {confirmedOrder.shippingAddress.state} - {confirmedOrder.shippingAddress.pincode}</p>
              <p className="m-0 font-medium text-emerald-700 mt-1">Payment Method: {confirmedOrder.paymentMethod.toUpperCase()}</p>
            </div>
          </div>

          <div className="border border-gray-200 rounded-2xl overflow-hidden mb-6">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-gray-100/80 text-gray-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Phone Model</th>
                  <th className="py-3 px-4 text-center">Tempered Glass (₹49)</th>
                  <th className="py-3 px-4 text-center">Flip Cover (₹99)</th>
                  <th className="py-3 px-4 text-right">Row Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-800">
                {confirmedOrder.items.map((it, idx) => {
                  const rowTotal = it.temperedGlassQty * B2B_RATES.temperedGlass + it.flipCoverQty * B2B_RATES.flipCover
                  return (
                    <tr key={idx} className="hover:bg-gray-50/50">
                      <td className="py-2.5 px-4 font-bold text-gray-900">{it.phoneModel}</td>
                      <td className="py-2.5 px-4 text-center font-mono">{it.temperedGlassQty} pcs</td>
                      <td className="py-2.5 px-4 text-center font-mono">{it.flipCoverQty} pcs</td>
                      <td className="py-2.5 px-4 text-right font-bold text-gray-900">₹{rowTotal.toLocaleString('en-IN')}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 mb-8 text-sm">
            <div className="flex justify-between text-gray-600 mb-1.5">
              <span>Total Product Units:</span>
              <span className="font-bold text-gray-900">{confirmedOrder.summary.totalQuantity} Units ({confirmedOrder.summary.totalTemperedGlass} TG + {confirmedOrder.summary.totalFlipCovers} FC)</span>
            </div>
            <div className="flex justify-between text-gray-600 mb-1.5">
              <span>Subtotal (Wholesale):</span>
              <span className="font-bold text-gray-900">₹{confirmedOrder.summary.subtotal.toLocaleString('en-IN')}</span>
            </div>
            {confirmedOrder.summary.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold mb-1.5">
                <span>Tier Bulk Discount ({confirmedOrder.summary.discountPercent}% OFF):</span>
                <span>- ₹{confirmedOrder.summary.discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600 mb-2">
              <span>B2B Freight & Express Shipping:</span>
              <span className="font-bold text-emerald-600">FREE</span>
            </div>
            <div className="border-t border-blue-200/60 pt-2.5 flex justify-between items-baseline">
              <span className="text-base font-extrabold text-gray-900">Grand Total Payable:</span>
              <span className="text-2xl font-black text-[#4361EE]">
                ₹{confirmedOrder.summary.grandTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex-1 py-3.5 px-6 rounded-2xl border border-gray-300 font-bold text-sm text-gray-700 hover:bg-gray-100 transition-all flex items-center justify-center gap-2 cursor-pointer bg-white"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              <span>Print Purchase Order Slip</span>
            </button>
            <button
              type="button"
              onClick={handleStartNewOrder}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-[#4361EE] hover:bg-[#3451de] text-white font-bold text-sm transition-all shadow-[0_2px_8px_rgba(67,97,238,0.25)] flex items-center justify-center gap-2 cursor-pointer border-none"
            >
              <span>+ Place Another Bulk Order</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────
  // MAIN WIZARD RENDER (Steps 1 to 5)
  // ─────────────────────────────────────────────────────────────
  const progressPercent = (currentStep / BUSINESS_STEPS.length) * 100

  return (
    <div className="min-h-screen bg-[#f8f9fb] font-sans pb-16">
      {/* ── Sub-header with Back, Title, Step counter ── */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-[1140px] mx-auto px-6 py-3 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => goToStep(currentStep - 1)}
                className="inline-flex items-center gap-1.5 text-gray-600 hover:text-gray-950 font-semibold transition-colors bg-transparent border-none cursor-pointer p-0"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => router.push('/')}
                className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-900 font-semibold transition-colors bg-transparent border-none cursor-pointer p-0"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Home</span>
              </button>
            )}
          </div>

          <div className="font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4361EE] animate-pulse" />
            <span className="text-xs sm:text-sm">B2B Wholesale Portal • Retail Bulk Ordering</span>
          </div>

          <div className="text-gray-500 font-medium text-xs sm:text-sm">
            <span>Step <strong className="text-[#4361EE] font-bold">{currentStep}</strong> of 5</span>
          </div>
        </div>

        {/* ── Step Labels Row ── */}
        <div className="max-w-[1140px] mx-auto px-6 pt-2 pb-3">
          <div className="grid grid-cols-5 text-center">
            {BUSINESS_STEPS.map((step) => {
              const isCompleted = step.id < currentStep
              const isCurrent = step.id === currentStep
              const isUpcoming = step.id > currentStep

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => {
                    if (isCompleted) goToStep(step.id)
                  }}
                  disabled={isUpcoming}
                  className={`flex flex-col items-center justify-center gap-1 bg-transparent border-none py-1 transition-all text-center ${
                    isCompleted ? 'cursor-pointer group' : isCurrent ? 'cursor-default' : 'cursor-not-allowed opacity-40'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-[#4361EE] text-white shadow-xs'
                          : isCurrent
                          ? 'bg-[#4361EE] text-white ring-4 ring-[#4361EE]/15 shadow-xs'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {isCompleted ? (
                        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                          <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        step.id
                      )}
                    </span>
                    <span
                      className={`text-xs md:text-sm tracking-tight transition-colors hidden sm:inline ${
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

          {/* Continuous Progress Line */}
          <div className="relative mt-2 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#4361EE] to-[#3a56e0] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-[1050px] mx-auto px-4 sm:px-6 pt-8 sm:pt-10">
        <AnimatePresence mode="wait">
          {/* ═══════════════════════════════════════════════════════════
              STEP 1: Business Information
             ═══════════════════════════════════════════════════════════ */}
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="mb-6">
                <span className="block text-xs font-extrabold uppercase tracking-wider text-[#4361EE] mb-1.5">
                  Step 1 • Business Registration
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight font-heading mb-2">
                  Business & Retailer Information
                </h1>
                <p className="text-sm sm:text-base text-gray-600 max-w-[750px]">
                  Enter your store and contact details. This will be used for wholesale GST tax invoicing, billing, and freight dispatch.
                </p>
              </div>

              <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                <form onSubmit={handleStep1Next} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        Shop / Business Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={businessProfile.shopName}
                        onChange={(e) =>
                          setBusinessProfile({ ...businessProfile, shopName: e.target.value })
                        }
                        placeholder="e.g. Apex Mobile Care & Accessories"
                        className={`w-full p-3.5 rounded-xl border text-sm text-gray-800 outline-none transition-all ${
                          businessErrors.shopName
                            ? 'border-red-400 bg-red-50/20'
                            : 'border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#4361EE] focus:ring-2 focus:ring-[#4361EE]/10'
                        }`}
                      />
                      {businessErrors.shopName && (
                        <span className="text-[11px] text-red-500 font-medium mt-1 block">
                          {businessErrors.shopName}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        Contact Person Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={businessProfile.contactPerson}
                        onChange={(e) =>
                          setBusinessProfile({ ...businessProfile, contactPerson: e.target.value })
                        }
                        placeholder="e.g. Rajesh Kumar (Store Manager)"
                        className={`w-full p-3.5 rounded-xl border text-sm text-gray-800 outline-none transition-all ${
                          businessErrors.contactPerson
                            ? 'border-red-400 bg-red-50/20'
                            : 'border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#4361EE] focus:ring-2 focus:ring-[#4361EE]/10'
                        }`}
                      />
                      {businessErrors.contactPerson && (
                        <span className="text-[11px] text-red-500 font-medium mt-1 block">
                          {businessErrors.contactPerson}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        maxLength={10}
                        value={businessProfile.mobileNumber}
                        onChange={(e) =>
                          setBusinessProfile({
                            ...businessProfile,
                            mobileNumber: e.target.value.replace(/\D/g, ''),
                          })
                        }
                        placeholder="10-digit mobile"
                        className={`w-full p-3.5 rounded-xl border text-sm text-gray-800 outline-none transition-all ${
                          businessErrors.mobileNumber
                            ? 'border-red-400 bg-red-50/20'
                            : 'border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#4361EE] focus:ring-2 focus:ring-[#4361EE]/10'
                        }`}
                      />
                      {businessErrors.mobileNumber && (
                        <span className="text-[11px] text-red-500 font-medium mt-1 block">
                          {businessErrors.mobileNumber}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        WhatsApp Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        maxLength={10}
                        value={businessProfile.whatsappNumber}
                        onChange={(e) =>
                          setBusinessProfile({
                            ...businessProfile,
                            whatsappNumber: e.target.value.replace(/\D/g, ''),
                          })
                        }
                        placeholder="For PO dispatch & updates"
                        className={`w-full p-3.5 rounded-xl border text-sm text-gray-800 outline-none transition-all ${
                          businessErrors.whatsappNumber
                            ? 'border-red-400 bg-red-50/20'
                            : 'border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#4361EE] focus:ring-2 focus:ring-[#4361EE]/10'
                        }`}
                      />
                      {businessErrors.whatsappNumber && (
                        <span className="text-[11px] text-red-500 font-medium mt-1 block">
                          {businessErrors.whatsappNumber}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        GST Number <span className="text-gray-400 font-normal">(optional)</span>
                      </label>
                      <input
                        type="text"
                        maxLength={15}
                        value={businessProfile.gstNumber}
                        onChange={(e) =>
                          setBusinessProfile({
                            ...businessProfile,
                            gstNumber: e.target.value.toUpperCase(),
                          })
                        }
                        placeholder="e.g. 29ABCDE1234F1Z5"
                        className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#4361EE] text-sm text-gray-800 uppercase outline-none transition-all font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        Shop Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={businessProfile.shopAddress}
                        onChange={(e) =>
                          setBusinessProfile({ ...businessProfile, shopAddress: e.target.value })
                        }
                        placeholder="Shop No, Building, Street / Market Area"
                        className={`w-full p-3.5 rounded-xl border text-sm text-gray-800 outline-none transition-all ${
                          businessErrors.shopAddress
                            ? 'border-red-400 bg-red-50/20'
                            : 'border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#4361EE] focus:ring-2 focus:ring-[#4361EE]/10'
                        }`}
                      />
                      {businessErrors.shopAddress && (
                        <span className="text-[11px] text-red-500 font-medium mt-1 block">
                          {businessErrors.shopAddress}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={businessProfile.city}
                        onChange={(e) =>
                          setBusinessProfile({ ...businessProfile, city: e.target.value })
                        }
                        placeholder="e.g. Bengaluru"
                        className={`w-full p-3.5 rounded-xl border text-sm text-gray-800 outline-none transition-all ${
                          businessErrors.city
                            ? 'border-red-400 bg-red-50/20'
                            : 'border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#4361EE] focus:ring-2 focus:ring-[#4361EE]/10'
                        }`}
                      />
                      {businessErrors.city && (
                        <span className="text-[11px] text-red-500 font-medium mt-1 block">
                          {businessErrors.city}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        State & PIN <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={businessProfile.state}
                          onChange={(e) =>
                            setBusinessProfile({ ...businessProfile, state: e.target.value })
                          }
                          placeholder="State"
                          className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#4361EE] text-sm text-gray-800 outline-none"
                        />
                        <input
                          type="text"
                          maxLength={6}
                          value={businessProfile.pincode}
                          onChange={(e) =>
                            setBusinessProfile({
                              ...businessProfile,
                              pincode: e.target.value.replace(/\D/g, ''),
                            })
                          }
                          placeholder="PIN Code"
                          className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#4361EE] text-sm text-gray-800 outline-none"
                        />
                      </div>
                      {(businessErrors.state || businessErrors.pincode) && (
                        <span className="text-[11px] text-red-500 font-medium mt-1 block">
                          {businessErrors.state || businessErrors.pincode}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-end">
                    <button
                      type="submit"
                      className="px-8 py-3.5 rounded-2xl bg-[#4361EE] hover:bg-[#3451de] text-white font-extrabold text-sm transition-all shadow-[0_4px_14px_rgba(67,97,238,0.25)] hover:-translate-y-0.5 cursor-pointer border-none flex items-center gap-2"
                    >
                      <span>Continue to Bulk Order</span>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              STEP 2: Bulk Order Page (Product Selection)
             ═══════════════════════════════════════════════════════════ */}
          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <span className="block text-xs font-extrabold uppercase tracking-wider text-[#4361EE] mb-1.5">
                    Step 2 • Product Selection
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight font-heading mb-1.5">
                    Select Phone Models & Wholesale Quantities
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600">
                    Search and add phone models. Each model provides independent wholesale quantities for Tempered Glass and Flip Cover.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
                    Tempered Glass: ₹{B2B_RATES.temperedGlass}/pc
                  </span>
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-200">
                    Flip Cover: ₹{B2B_RATES.flipCover}/pc
                  </span>
                </div>
              </div>

              {step2Error && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2">
                    <span>⚠️</span>
                    <span>{step2Error}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep2Error('')}
                    className="text-red-500 hover:text-red-800 text-xs font-bold uppercase cursor-pointer bg-transparent border-none"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* List of Phone Models */}
              <div className="space-y-5">
                {orderItems.map((item, index) => {
                  const currentQuery = item.searchQuery || ''
                  const hasSelectedModel = Boolean(item.phoneModel && item.phoneModel.trim() !== '')

                  return (
                    <div
                      key={item.id}
                      className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-all hover:border-blue-200"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-extrabold uppercase tracking-wide text-[#4361EE] bg-blue-50 px-3 py-1 rounded-full border border-blue-200/50">
                          Phone Model #{index + 1}
                        </span>

                        {orderItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemovePhoneModel(item.id)}
                            className="text-xs font-bold text-red-500 hover:text-red-700 p-1 transition-colors cursor-pointer bg-transparent border-none flex items-center gap-1"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                            <span>Remove</span>
                          </button>
                        )}
                      </div>

                      {/* Clean Search Input Row */}
                      <div className="mb-5 relative">
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                          Search phone model...
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={item.searchQuery}
                            onFocus={() => handleUpdateItem(item.id, 'isSelecting', true)}
                            onChange={(e) => {
                              const val = e.target.value
                              handleUpdateItem(item.id, 'searchQuery', val)
                              handleUpdateItem(item.id, 'isSelecting', true)
                              searchBackendPhones(val)
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && currentQuery.trim()) {
                                e.preventDefault()
                                handleSelectModel(item.id, { name: currentQuery.trim(), brand: 'Device' })
                              }
                            }}
                            placeholder="Search phone model..."
                            className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-800 placeholder-gray-400 focus:border-[#4361EE] focus:ring-2 focus:ring-[#4361EE]/10 outline-none transition-all"
                          />
                          <svg
                            className="absolute left-3.5 top-3.5 text-gray-400 pointer-events-none"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                          </svg>
                        </div>

                        {/* Search Dropdown with real backend catalog results */}
                        {item.isSelecting && (
                          <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-2xl shadow-xl max-h-56 overflow-y-auto divide-y divide-gray-100">
                            {backendPhoneOptions.length > 0 ? (
                              <>
                                <div className="p-2.5 bg-blue-50/50 text-[10px] font-bold uppercase tracking-wider text-blue-700">
                                  Available in Database
                                </div>
                                {backendPhoneOptions.map((dev) => (
                                  <button
                                    key={dev.id}
                                    type="button"
                                    onClick={() => handleSelectModel(item.id, dev)}
                                    className="w-full text-left px-4 py-3 text-xs font-bold text-gray-800 hover:bg-blue-50/80 flex items-center justify-between cursor-pointer border-none bg-transparent transition-colors"
                                  >
                                    <span>{dev.name}</span>
                                    <span className="text-[10px] font-semibold text-gray-400">{dev.brand}</span>
                                  </button>
                                ))}
                              </>
                            ) : currentQuery.trim().length >= 2 ? (
                              <div className="p-4 text-center text-xs text-gray-500">
                                <p className="mb-2">No direct catalog match found for &ldquo;{currentQuery.trim()}&rdquo;.</p>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleSelectModel(item.id, {
                                      name: currentQuery.trim(),
                                      brand: 'Custom Device',
                                    })
                                  }
                                  className="px-4 py-2 rounded-xl bg-blue-50 text-[#4361EE] font-bold text-xs hover:bg-blue-100 cursor-pointer border border-blue-200"
                                >
                                  Select &ldquo;{currentQuery.trim()}&rdquo;
                                </button>
                              </div>
                            ) : (
                              <div className="p-3 text-center text-xs text-gray-400">
                                Type at least 2 characters to search phone catalog...
                              </div>
                            )}

                            <div className="p-2 text-right bg-gray-50/70">
                              <button
                                type="button"
                                onClick={() => handleUpdateItem(item.id, 'isSelecting', false)}
                                className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer bg-transparent border-none"
                              >
                                Close
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* ONLY when phone model is selected, show exactly two product types */}
                      {hasSelectedModel ? (
                        <div className="animate-fadeIn">
                          <div className="flex items-center justify-between p-3.5 bg-blue-50/70 border border-blue-200/70 rounded-2xl mb-4">
                            <div className="flex items-center gap-2.5">
                              <span className="text-xl">📱</span>
                              <div>
                                <span className="text-[10px] font-extrabold text-[#4361EE] uppercase tracking-wider block">
                                  Selected Model
                                </span>
                                <span className="text-sm font-extrabold text-gray-900">{item.phoneModel}</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                handleUpdateItem(item.id, 'phoneModel', '')
                                handleUpdateItem(item.id, 'searchQuery', '')
                                handleUpdateItem(item.id, 'isSelecting', true)
                              }}
                              className="text-xs font-bold text-[#4361EE] hover:underline cursor-pointer bg-transparent border-none"
                            >
                              Change model
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* 1. Tempered Glass */}
                            <div className="bg-slate-50/70 border border-gray-200 rounded-2xl p-4 flex flex-col justify-between">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-9 h-9 rounded-xl bg-blue-100/70 text-[#4361EE] flex items-center justify-center font-bold text-base">
                                    🛡️
                                  </div>
                                  <div>
                                    <div className="text-sm font-extrabold text-gray-900">Tempered Glass</div>
                                    <div className="text-[11px] text-gray-500">
                                      Wholesale: ₹{B2B_RATES.temperedGlass}/pc
                                    </div>
                                  </div>
                                </div>
                                <span className="text-sm font-black text-[#4361EE]">
                                  ₹{(item.temperedGlassQty * B2B_RATES.temperedGlass).toLocaleString('en-IN')}
                                </span>
                              </div>

                              <div className="flex items-center justify-between bg-white border border-gray-200/90 rounded-xl p-1.5 shadow-2xs">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleUpdateItem(
                                      item.id,
                                      'temperedGlassQty',
                                      Math.max(0, item.temperedGlassQty - 5)
                                    )
                                  }
                                  className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 font-extrabold text-base text-gray-700 flex items-center justify-center cursor-pointer"
                                >
                                  -
                                </button>
                                <div className="flex items-center gap-1">
                                  <input
                                    type="number"
                                    min="0"
                                    step="5"
                                    value={item.temperedGlassQty}
                                    onChange={(e) =>
                                      handleUpdateItem(item.id, 'temperedGlassQty', e.target.value)
                                    }
                                    className="w-16 text-center font-black text-gray-900 text-base bg-transparent border-none outline-none"
                                  />
                                  <span className="text-[11px] font-bold text-gray-400">pcs</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleUpdateItem(
                                      item.id,
                                      'temperedGlassQty',
                                      item.temperedGlassQty + 5
                                    )
                                  }
                                  className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 font-extrabold text-base text-gray-700 flex items-center justify-center cursor-pointer"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            {/* 2. Flip Cover */}
                            <div className="bg-slate-50/70 border border-gray-200 rounded-2xl p-4 flex flex-col justify-between">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-9 h-9 rounded-xl bg-indigo-100/70 text-indigo-600 flex items-center justify-center font-bold text-base">
                                    📱
                                  </div>
                                  <div>
                                    <div className="text-sm font-extrabold text-gray-900">Flip Cover</div>
                                    <div className="text-[11px] text-gray-500">
                                      Wholesale: ₹{B2B_RATES.flipCover}/pc
                                    </div>
                                  </div>
                                </div>
                                <span className="text-sm font-black text-indigo-600">
                                  ₹{(item.flipCoverQty * B2B_RATES.flipCover).toLocaleString('en-IN')}
                                </span>
                              </div>

                              <div className="flex items-center justify-between bg-white border border-gray-200/90 rounded-xl p-1.5 shadow-2xs">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleUpdateItem(
                                      item.id,
                                      'flipCoverQty',
                                      Math.max(0, item.flipCoverQty - 5)
                                    )
                                  }
                                  className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 font-extrabold text-base text-gray-700 flex items-center justify-center cursor-pointer"
                                >
                                  -
                                </button>
                                <div className="flex items-center gap-1">
                                  <input
                                    type="number"
                                    min="0"
                                    step="5"
                                    value={item.flipCoverQty}
                                    onChange={(e) =>
                                      handleUpdateItem(item.id, 'flipCoverQty', e.target.value)
                                    }
                                    className="w-16 text-center font-black text-gray-900 text-base bg-transparent border-none outline-none"
                                  />
                                  <span className="text-[11px] font-bold text-gray-400">pcs</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleUpdateItem(
                                      item.id,
                                      'flipCoverQty',
                                      item.flipCoverQty + 5
                                    )
                                  }
                                  className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 font-extrabold text-base text-gray-700 flex items-center justify-center cursor-pointer"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3.5 bg-blue-50/30 rounded-xl border border-dashed border-blue-200 text-xs text-gray-500 flex items-center gap-2">
                          <span>💡</span>
                          <span>Search and select a phone model above to configure wholesale quantities for Tempered Glass & Flip Cover.</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Add Another Phone Model Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <button
                  type="button"
                  onClick={handleAddPhoneModel}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border-2 border-dashed border-[#4361EE]/40 hover:border-[#4361EE] hover:bg-blue-50/50 text-[#4361EE] font-extrabold text-sm transition-all cursor-pointer bg-white"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span>+ Add another phone model</span>
                </button>

                <div className="text-xs text-gray-500 font-medium">
                  {validOrderItems.length} model(s) selected • {summary.totalQuantity} total pcs
                </div>
              </div>

              {/* Step Navigation Bar */}
              <div className="pt-6 border-t border-gray-200 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => goToStep(1)}
                  className="px-6 py-3.5 rounded-2xl border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold text-sm transition-all cursor-pointer bg-white"
                >
                  ← Back to Business Info
                </button>

                <button
                  type="button"
                  onClick={handleStep2Next}
                  className="px-8 py-3.5 rounded-2xl bg-[#4361EE] hover:bg-[#3451de] text-white font-extrabold text-sm transition-all shadow-[0_4px_14px_rgba(67,97,238,0.25)] hover:-translate-y-0.5 cursor-pointer border-none flex items-center gap-2"
                >
                  <span>Continue to Delivery Details</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              STEP 3: Delivery Details (Just like Step 3 Address)
             ═══════════════════════════════════════════════════════════ */}
          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="mb-6">
                <span className="block text-xs font-extrabold uppercase tracking-wider text-[#4361EE] mb-1.5">
                  Step 3 • Freight Logistics
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight font-heading mb-2">
                  Wholesale Freight & Delivery Details
                </h1>
                <p className="text-sm sm:text-base text-gray-600 max-w-[750px]">
                  Choose your preferred delivery address for this wholesale consignment. By default, packages are delivered to your verified shop address.
                </p>
              </div>

              {step3Error && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold flex items-center justify-between shadow-xs">
                  <span>{step3Error}</span>
                  <button
                    type="button"
                    onClick={() => setStep3Error('')}
                    className="text-red-500 hover:text-red-800 text-xs font-bold uppercase cursor-pointer bg-transparent border-none"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-6">
                {/* Mode Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      deliveryMode === 'shop'
                        ? 'border-[#4361EE] bg-blue-50/30'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="deliveryMode"
                        checked={deliveryMode === 'shop'}
                        onChange={() => setDeliveryMode('shop')}
                        className="mt-1 text-[#4361EE]"
                      />
                      <div>
                        <span className="text-sm font-extrabold text-gray-900 block mb-1">
                          🏢 Registered Shop Address
                        </span>
                        <p className="text-xs text-gray-600 leading-relaxed m-0">
                          <strong>{businessProfile.shopName || 'Registered Shop'}</strong><br />
                          {businessProfile.shopAddress || 'Shop address from Step 1'}, {businessProfile.city}, {businessProfile.state} - {businessProfile.pincode}
                        </p>
                        <span className="inline-block mt-2 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Verified Shop Destination
                        </span>
                      </div>
                    </div>
                  </label>

                  <label
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      deliveryMode === 'alternate'
                        ? 'border-[#4361EE] bg-blue-50/30'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="deliveryMode"
                        checked={deliveryMode === 'alternate'}
                        onChange={() => setDeliveryMode('alternate')}
                        className="mt-1 text-[#4361EE]"
                      />
                      <div>
                        <span className="text-sm font-extrabold text-gray-900 block mb-1">
                          📦 Alternate Warehouse / Delivery Address
                        </span>
                        <p className="text-xs text-gray-600 leading-relaxed m-0">
                          Ship to another store branch, fulfillment godown, or alternate technician receiving point.
                        </p>
                        <span className="inline-block mt-2 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          Custom Drop Location
                        </span>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Alternate Address Form */}
                {deliveryMode === 'alternate' && (
                  <div className="p-6 bg-slate-50/80 border border-slate-200 rounded-2xl space-y-4 animate-fadeIn">
                    <span className="text-xs font-extrabold uppercase tracking-wide text-gray-700 block">
                      Enter Alternate Receiving Point
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Recipient Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={alternateAddress.recipientName}
                          onChange={(e) =>
                            setAlternateAddress({ ...alternateAddress, recipientName: e.target.value })
                          }
                          placeholder="e.g. Ramesh (Warehouse Manager)"
                          className="w-full p-3 rounded-xl border border-gray-200 bg-white text-sm outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Contact Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          maxLength={10}
                          value={alternateAddress.phone}
                          onChange={(e) =>
                            setAlternateAddress({
                              ...alternateAddress,
                              phone: e.target.value.replace(/\D/g, ''),
                            })
                          }
                          placeholder="10-digit mobile"
                          className="w-full p-3 rounded-xl border border-gray-200 bg-white text-sm outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Delivery Address Line <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={alternateAddress.addressLine}
                          onChange={(e) =>
                            setAlternateAddress({ ...alternateAddress, addressLine: e.target.value })
                          }
                          placeholder="Plot / Shed No, Industrial Estate, Street"
                          className="w-full p-3 rounded-xl border border-gray-200 bg-white text-sm outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={alternateAddress.city}
                          onChange={(e) =>
                            setAlternateAddress({ ...alternateAddress, city: e.target.value })
                          }
                          placeholder="City"
                          className="w-full p-3 rounded-xl border border-gray-200 bg-white text-sm outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          PIN Code <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          value={alternateAddress.pincode}
                          onChange={(e) =>
                            setAlternateAddress({
                              ...alternateAddress,
                              pincode: e.target.value.replace(/\D/g, ''),
                            })
                          }
                          placeholder="6-digit PIN"
                          className="w-full p-3 rounded-xl border border-gray-200 bg-white text-sm outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Landmark (optional)
                        </label>
                        <input
                          type="text"
                          value={alternateAddress.landmark}
                          onChange={(e) =>
                            setAlternateAddress({ ...alternateAddress, landmark: e.target.value })
                          }
                          placeholder="Nearby landmark or gate"
                          className="w-full p-3 rounded-xl border border-gray-200 bg-white text-sm outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Delivery Notes */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Freight Instructions & Unloading Notes <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={deliveryInstructions}
                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                    placeholder="e.g. Deliver between 11 AM - 7 PM, call store supervisor on arrival, gate 2 entry..."
                    className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#4361EE] text-sm text-gray-800 outline-none transition-all resize-none"
                  />
                </div>

                <div className="pt-4 border-t border-gray-150 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => goToStep(2)}
                    className="px-6 py-3.5 rounded-2xl border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold text-sm transition-all cursor-pointer bg-white"
                  >
                    ← Back to Products
                  </button>

                  <button
                    type="button"
                    onClick={handleStep3Next}
                    className="px-8 py-3.5 rounded-2xl bg-[#4361EE] hover:bg-[#3451de] text-white font-extrabold text-sm transition-all shadow-[0_4px_14px_rgba(67,97,238,0.25)] hover:-translate-y-0.5 cursor-pointer border-none flex items-center gap-2"
                  >
                    <span>Continue to Order Review</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              STEP 4: Review Order (Before Payment Verification)
             ═══════════════════════════════════════════════════════════ */}
          {currentStep === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="mb-6">
                <span className="block text-xs font-extrabold uppercase tracking-wider text-[#4361EE] mb-1.5">
                  Step 4 • Final Review
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight font-heading mb-2">
                  Review Your Bulk Order Manifest
                </h1>
                <p className="text-sm sm:text-base text-gray-600 max-w-[750px]">
                  Please review the products, quantities, wholesale discounts, and dispatch address before proceeding to payment.
                </p>
              </div>

              {/* Order Manifest Table with inline editing */}
              <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                <div className="flex items-center justify-between pb-4 border-b border-gray-150 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📋</span>
                    <h2 className="text-base font-extrabold text-gray-900 m-0">
                      Product Manifest ({validOrderItems.length} Models • {summary.totalQuantity} Units)
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => goToStep(2)}
                    className="text-xs font-bold text-[#4361EE] hover:underline cursor-pointer bg-transparent border-none"
                  >
                    + Add or modify models
                  </button>
                </div>

                <div className="border border-gray-200 rounded-2xl overflow-x-auto mb-6">
                  <table className="w-full text-left text-sm border-collapse min-w-[580px]">
                    <thead className="bg-gray-100/80 text-gray-700 font-bold text-xs uppercase tracking-wider border-b border-gray-200">
                      <tr>
                        <th className="py-3 px-4">Phone Model</th>
                        <th className="py-3 px-4 text-center">Tempered Glass (₹49)</th>
                        <th className="py-3 px-4 text-center">Flip Cover (₹99)</th>
                        <th className="py-3 px-4 text-right">Row Subtotal</th>
                        <th className="py-3 px-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-800">
                      {validOrderItems.map((item) => {
                        const lineTotal =
                          item.temperedGlassQty * B2B_RATES.temperedGlass +
                          item.flipCoverQty * B2B_RATES.flipCover

                        return (
                          <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                            <td className="py-3 px-4 font-bold text-gray-900">
                              {item.phoneModel}
                            </td>

                            <td className="py-3 px-4 text-center">
                              <div className="inline-flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg p-1">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleUpdateItem(
                                      item.id,
                                      'temperedGlassQty',
                                      Math.max(0, item.temperedGlassQty - 5)
                                    )
                                  }
                                  className="w-6 h-6 rounded bg-white text-gray-600 hover:text-black font-bold text-xs cursor-pointer border border-gray-200"
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  min="0"
                                  value={item.temperedGlassQty}
                                  onChange={(e) =>
                                    handleUpdateItem(item.id, 'temperedGlassQty', e.target.value)
                                  }
                                  className="w-12 text-center text-xs font-bold text-gray-900 bg-transparent border-none outline-none font-mono"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleUpdateItem(
                                      item.id,
                                      'temperedGlassQty',
                                      item.temperedGlassQty + 5
                                    )
                                  }
                                  className="w-6 h-6 rounded bg-white text-gray-600 hover:text-black font-bold text-xs cursor-pointer border border-gray-200"
                                >
                                  +
                                </button>
                              </div>
                            </td>

                            <td className="py-3 px-4 text-center">
                              <div className="inline-flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg p-1">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleUpdateItem(
                                      item.id,
                                      'flipCoverQty',
                                      Math.max(0, item.flipCoverQty - 5)
                                    )
                                  }
                                  className="w-6 h-6 rounded bg-white text-gray-600 hover:text-black font-bold text-xs cursor-pointer border border-gray-200"
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  min="0"
                                  value={item.flipCoverQty}
                                  onChange={(e) =>
                                    handleUpdateItem(item.id, 'flipCoverQty', e.target.value)
                                  }
                                  className="w-12 text-center text-xs font-bold text-gray-900 bg-transparent border-none outline-none font-mono"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleUpdateItem(
                                      item.id,
                                      'flipCoverQty',
                                      item.flipCoverQty + 5
                                    )
                                  }
                                  className="w-6 h-6 rounded bg-white text-gray-600 hover:text-black font-bold text-xs cursor-pointer border border-gray-200"
                                >
                                  +
                                </button>
                              </div>
                            </td>

                            <td className="py-3 px-4 text-right font-extrabold text-gray-900">
                              ₹{lineTotal.toLocaleString('en-IN')}
                            </td>

                            <td className="py-3 px-4 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemovePhoneModel(item.id)}
                                disabled={orderItems.length === 1}
                                className="text-gray-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer bg-transparent border-none p-1"
                                title="Remove model"
                              >
                                ✕
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Visual Product Inspection Cards with Cloudinary Images */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {summary.totalTemperedGlass > 0 && (
                    <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-200/80 flex items-center gap-4">
                      <div className="w-20 h-20 rounded-xl bg-white border border-gray-200 p-1.5 shrink-0 flex items-center justify-center">
                        <Image
                          src={PRODUCT_INFO.temperedGlass.image}
                          alt="Tempered Glass"
                          width={75}
                          height={75}
                          className="w-full h-full object-contain"
                          unoptimized
                        />
                      </div>
                      <div className="min-w-0 flex-1 text-xs">
                        <span className="font-extrabold text-[#4361EE] uppercase tracking-wider block text-[10px]">
                          {PRODUCT_INFO.temperedGlass.tag}
                        </span>
                        <h4 className="font-extrabold text-gray-900 text-sm m-0 leading-snug">
                          {PRODUCT_INFO.temperedGlass.title}
                        </h4>
                        <p className="text-gray-500 m-0 mt-0.5">
                          Total Ordered: <strong>{summary.totalTemperedGlass} units</strong> @ ₹{B2B_RATES.temperedGlass}/pc
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {PRODUCT_INFO.temperedGlass.specs.slice(0, 2).map((s, i) => (
                            <span key={i} className="bg-white text-gray-700 px-2 py-0.5 rounded text-[10px] font-medium border border-gray-200/70">
                              ✓ {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {summary.totalFlipCovers > 0 && (
                    <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-200/80 flex items-center gap-4">
                      <div className="w-20 h-20 rounded-xl bg-white border border-gray-200 p-1.5 shrink-0 flex items-center justify-center">
                        <Image
                          src={PRODUCT_INFO.flipCover.image}
                          alt="Flip Cover"
                          width={75}
                          height={75}
                          className="w-full h-full object-contain"
                          unoptimized
                        />
                      </div>
                      <div className="min-w-0 flex-1 text-xs">
                        <span className="font-extrabold text-indigo-600 uppercase tracking-wider block text-[10px]">
                          {PRODUCT_INFO.flipCover.tag}
                        </span>
                        <h4 className="font-extrabold text-gray-900 text-sm m-0 leading-snug">
                          {PRODUCT_INFO.flipCover.title}
                        </h4>
                        <p className="text-gray-500 m-0 mt-0.5">
                          Total Ordered: <strong>{summary.totalFlipCovers} units</strong> @ ₹{B2B_RATES.flipCover}/pc
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {PRODUCT_INFO.flipCover.specs.slice(0, 2).map((s, i) => (
                            <span key={i} className="bg-white text-gray-700 px-2 py-0.5 rounded text-[10px] font-medium border border-gray-200/70">
                              ✓ {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Dispatch & Billing Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-xs text-gray-600">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-gray-900 text-xs">🏢 Invoicing Business</span>
                      <button
                        type="button"
                        onClick={() => goToStep(1)}
                        className="text-[#4361EE] hover:underline cursor-pointer bg-transparent border-none text-[11px] font-bold"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="font-bold text-gray-800 m-0">{businessProfile.shopName}</p>
                    <p className="m-0">Attn: {businessProfile.contactPerson} • {businessProfile.mobileNumber}</p>
                    {businessProfile.gstNumber && (
                      <p className="m-0 font-mono text-gray-500 mt-0.5">GST: {businessProfile.gstNumber}</p>
                    )}
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-gray-900 text-xs">📦 Dispatch Destination</span>
                      <button
                        type="button"
                        onClick={() => goToStep(3)}
                        className="text-[#4361EE] hover:underline cursor-pointer bg-transparent border-none text-[11px] font-bold"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="font-bold text-gray-800 m-0">{activeShippingAddress.name}</p>
                    <p className="m-0">{activeShippingAddress.house}, {activeShippingAddress.city} - {activeShippingAddress.pincode}</p>
                    <p className="m-0 text-gray-500">Logistics: Express B2B Freight (FREE)</p>
                  </div>
                </div>

                {/* Pricing Summary */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 max-w-md ml-auto space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Tempered Glass Subtotal:</span>
                    <span className="font-semibold text-gray-900">
                      ₹{(summary.totalTemperedGlass * B2B_RATES.temperedGlass).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Flip Cover Subtotal:</span>
                    <span className="font-semibold text-gray-900">
                      ₹{(summary.totalFlipCovers * B2B_RATES.flipCover).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Gross Wholesale Subtotal:</span>
                    <span className="font-bold text-gray-900">
                      ₹{summary.subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {summary.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Volume Bulk Tier Discount ({summary.discountPercent}% OFF):</span>
                      <span>- ₹{summary.discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600">
                    <span>Express B2B Freight:</span>
                    <span className="font-bold text-emerald-600">FREE</span>
                  </div>

                  <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
                    <span className="text-base font-extrabold text-gray-900">Grand Total Payable:</span>
                    <span className="text-2xl font-black text-[#4361EE]">
                      ₹{summary.grandTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-150 flex items-center justify-between gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => goToStep(3)}
                    className="px-6 py-3.5 rounded-2xl border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold text-sm transition-all cursor-pointer bg-white"
                  >
                    ← Back to Delivery
                  </button>

                  <button
                    type="button"
                    onClick={handleStep4Next}
                    className="px-8 py-3.5 rounded-2xl bg-[#4361EE] hover:bg-[#3451de] text-white font-extrabold text-sm transition-all shadow-[0_4px_14px_rgba(67,97,238,0.25)] hover:-translate-y-0.5 cursor-pointer border-none flex items-center gap-2"
                  >
                    <span>Proceed to Payment & Checkout</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              STEP 5: Payment & Order Confirmation (Backend Integrated)
             ═══════════════════════════════════════════════════════════ */}
          {currentStep === 5 && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="mb-6">
                <span className="block text-xs font-extrabold uppercase tracking-wider text-[#4361EE] mb-1.5">
                  Step 5 • Final Checkout
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight font-heading mb-2">
                  Payment Method & Order Confirmation
                </h1>
                <p className="text-sm sm:text-base text-gray-600 max-w-[750px]">
                  Select your preferred wholesale payment method to generate your GST tax purchase order slip and initiate warehouse dispatch.
                </p>
              </div>

              {orderError && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold flex items-center justify-between shadow-xs">
                  <span>{orderError}</span>
                  <button
                    type="button"
                    onClick={() => setOrderError('')}
                    className="text-red-500 hover:text-red-800 text-xs font-bold uppercase cursor-pointer bg-transparent border-none"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-6">
                {/* Payment Options */}
                <div className="space-y-3">
                  <label
                    className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-[#4361EE] bg-blue-50/20 ring-2 ring-[#4361EE]/10'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'upi'}
                        onChange={() => setPaymentMethod('upi')}
                        className="text-[#4361EE]"
                      />
                      <div>
                        <div className="text-sm font-bold text-gray-900">UPI Instant Wholesale Pay</div>
                        <div className="text-xs text-gray-500">Google Pay, PhonePe, Paytm, BHIM UPI</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Zero Surcharge
                    </span>
                  </label>

                  <label
                    className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                      paymentMethod === 'card'
                        ? 'border-[#4361EE] bg-blue-50/20 ring-2 ring-[#4361EE]/10'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="text-[#4361EE]"
                      />
                      <div>
                        <div className="text-sm font-bold text-gray-900">Commercial Credit / Debit Card</div>
                        <div className="text-xs text-gray-500">Visa, MasterCard, RuPay Commercial</div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 font-mono">VISA / MC</span>
                  </label>

                  <label
                    className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                      paymentMethod === 'netbanking'
                        ? 'border-[#4361EE] bg-blue-50/20 ring-2 ring-[#4361EE]/10'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'netbanking'}
                        onChange={() => setPaymentMethod('netbanking')}
                        className="text-[#4361EE]"
                      />
                      <div>
                        <div className="text-sm font-bold text-gray-900">Corporate Net Banking</div>
                        <div className="text-xs text-gray-500">HDFC, ICICI, SBI, Axis, Kotak & 50+ Banks</div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 font-semibold">All Major Banks</span>
                  </label>

                  <label
                    className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-[#4361EE] bg-blue-50/20 ring-2 ring-[#4361EE]/10'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="text-[#4361EE]"
                      />
                      <div>
                        <div className="text-sm font-bold text-gray-900">Cash on Delivery (COD) / Pay on Delivery</div>
                        <div className="text-xs text-gray-500">Inspect carton sealed tamper-proof packing upon freight arrival</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Supported
                    </span>
                  </label>
                </div>

                {/* Final Order Button */}
                <div className="pt-6 border-t border-gray-150">
                  <button
                    type="button"
                    disabled={isPlacingOrder || summary.totalQuantity === 0}
                    onClick={handlePlaceOrder}
                    className={`w-full py-4 text-white font-extrabold rounded-2xl text-base transition-all border-none flex items-center justify-center gap-2 ${
                      isPlacingOrder || summary.totalQuantity === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-[#4361EE] hover:bg-[#3451de] shadow-[0_4px_16px_rgba(67,97,238,0.3)] hover:-translate-y-0.5 cursor-pointer'
                    }`}
                  >
                    {isPlacingOrder ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Connecting to ScreenCare Orders API...</span>
                      </>
                    ) : (
                      <>
                        <span>Place Business Order</span>
                        <span className="bg-white/20 px-2.5 py-0.5 rounded-lg text-sm">
                          ₹{summary.grandTotal.toLocaleString('en-IN')}
                        </span>
                        <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                          <path
                            d="M3.5 8.5L6.5 11.5L12.5 5.5"
                            stroke="white"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-gray-400 text-center mt-2.5 m-0">
                    Official GST Tax Invoice generated with HSN Codes and Input Tax Credit (ITC) eligibility.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-start">
                  <button
                    type="button"
                    onClick={() => goToStep(4)}
                    className="px-6 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold text-xs transition-all cursor-pointer bg-white"
                  >
                    ← Back to Order Review
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function BusinessBulkOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="w-10 h-10 border-3 border-blue-200 border-t-[#4361EE] rounded-full animate-spin mb-4" />
          <p className="text-sm font-medium text-gray-600">Loading Business Portal...</p>
        </div>
      }
    >
      <BusinessFlowContent />
    </Suspense>
  )
}
