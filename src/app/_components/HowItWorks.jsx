'use client'

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
          <h2 className="text-[28px] font-bold text-gray-900 tracking-tight mb-0">
            Protection without the guesswork
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              className="bg-white border border-gray-200 rounded-2xl p-7 px-6 cursor-default hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)] transition-shadow"
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <div className="inline-flex items-center justify-center w-9 h-9 rounded-[10px] bg-[#4361EE]/8 text-[#4361EE] text-[15px] font-bold mb-5">
                {step.number}
              </div>
              <h3 className="text-[17px] font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm leading-relaxed text-gray-500 m-0">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
