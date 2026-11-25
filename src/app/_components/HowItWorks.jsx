'use client'

import { useState, useRef } from 'react'
import { motion } from 'motion/react'

const steps = [
  {
    number: '1',
    title: 'Choose your phone',
    desc: 'Select your model and see compatible screen protectors.',
  },
  {
    number: '2',
    title: 'Book your slot',
    desc: 'Check your location and choose an available appointment.',
  },
  {
    number: '3',
    title: 'Doorstep fitting in 1 hour',
    desc: 'A certified installer arrives at your doorstep within 60 minutes and fits your protector with sterile precision.',
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.15,
      ease: 'easeOut',
    },
  }),
}

const colorThemes = {
  orange: {
    gradient: 'from-[#EA580C] via-[#F97316] to-[#C2410C]',
    shadow: 'hover:shadow-[0_16px_36px_rgba(234,88,12,0.28)]',
    numberText: 'text-[#EA580C]',
    badgeDefault: 'bg-orange-50 text-orange-600',
    descHover: 'text-orange-100',
  },
  purple: {
    gradient: 'from-[#7C3AED] via-[#8B5CF6] to-[#5B21B6]',
    shadow: 'hover:shadow-[0_16px_36px_rgba(124,58,237,0.28)]',
    numberText: 'text-[#7C3AED]',
    badgeDefault: 'bg-purple-50 text-purple-600',
    descHover: 'text-purple-100',
  },
  yellow: {
    gradient: 'from-[#F59E0B] via-[#EAB308] to-[#D97706]',
    shadow: 'hover:shadow-[0_16px_36px_rgba(245,158,11,0.28)]',
    numberText: 'text-[#D97706]',
    badgeDefault: 'bg-amber-50 text-amber-600',
    descHover: 'text-amber-100',
  },
}

function StepCard({ step, i }) {
  const cardRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const [coords, setCoords] = useState({ x: 0, y: 0 })

  // Alternate colors: 0 -> orange, 1 -> purple, 2 -> yellow
  const themeKeys = ['orange', 'purple', 'yellow']
  const currentTheme = colorThemes[themeKeys[i % themeKeys.length]]

  const handleMouseEnter = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative overflow-hidden bg-white border border-gray-200/90 rounded-2xl p-7 px-6 cursor-default transition-all duration-300 hover:border-transparent ${currentTheme.shadow}`}
      custom={i}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Spreading bubble originating directly from the cursor position */}
      <span
        className={`absolute rounded-full bg-gradient-to-br ${currentTheme.gradient} pointer-events-none z-0`}
        style={{
          left: `${coords.x}px`,
          top: `${coords.y}px`,
          width: '950px',
          height: '950px',
          transform: isHovered
            ? 'translate(-50%, -50%) scale(1)'
            : 'translate(-50%, -50%) scale(0)',
          opacity: isHovered ? 1 : 0,
          transition: 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease',
        }}
      />

      {/* Floating subtle translucent glass bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <span
          className="absolute bottom-[-15px] left-[15%] w-7 h-7 rounded-full bg-white/20 border border-white/40 shadow-inner pointer-events-none"
          style={{
            transform: isHovered ? 'translateY(-140px) scale(1.1)' : 'translateY(0) scale(0)',
            opacity: isHovered ? 0.9 : 0,
            transition: 'transform 0.85s ease-out 0.1s, opacity 0.4s ease 0.1s',
          }}
        />
        <span
          className="absolute bottom-[-25px] left-[50%] w-11 h-11 rounded-full bg-white/15 border border-white/30 shadow-inner pointer-events-none"
          style={{
            transform: isHovered ? 'translateY(-190px) scale(0.95)' : 'translateY(0) scale(0)',
            opacity: isHovered ? 0.8 : 0,
            transition: 'transform 1s ease-out 0.15s, opacity 0.4s ease 0.15s',
          }}
        />
        <span
          className="absolute bottom-[-10px] left-[80%] w-6 h-6 rounded-full bg-white/25 border border-white/50 shadow-inner pointer-events-none"
          style={{
            transform: isHovered ? 'translateY(-160px) scale(1.2)' : 'translateY(0) scale(0)',
            opacity: isHovered ? 0.9 : 0,
            transition: 'transform 0.9s ease-out 0.05s, opacity 0.4s ease 0.05s',
          }}
        />
      </div>

      <div className="relative z-10">
        <div
          className={`inline-flex items-center justify-center w-9 h-9 rounded-[10px] text-[15px] font-bold mb-5 transition-all duration-300 shadow-xs ${
            isHovered ? `bg-white ${currentTheme.numberText}` : currentTheme.badgeDefault
          }`}
        >
          {step.number}
        </div>
        <h3
          className={`text-[17px] font-semibold transition-colors duration-300 mb-2 font-heading ${
            isHovered ? 'text-white' : 'text-gray-900'
          }`}
        >
          {step.title}
        </h3>
        <p
          className={`text-sm leading-relaxed transition-colors duration-300 m-0 font-sans ${
            isHovered ? 'text-white/90' : 'text-gray-500'
          }`}
        >
          {step.desc}
        </p>
      </div>
    </motion.div>
  )
}

export default function HowItWorks() {
  return (
    <section className="py-20 px-6 bg-gray-50 max-sm:py-14 max-sm:px-4" id="how-it-works">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <span className="block text-[13px] font-semibold tracking-wide text-[#4361EE] uppercase mb-3">
            HOW IT WORKS
          </span>
          <h2 className="text-[28px] font-bold text-gray-900 tracking-tight mb-0 font-heading">
            Protection without the guesswork
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
          {steps.map((step, i) => (
            <StepCard key={step.number} step={step} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
