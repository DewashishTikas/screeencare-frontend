'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

export default function ScrollVideoOverlay({ children }) {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(true)

  // Track window scroll in pixels directly
  const { scrollY } = useScroll()

  // 1. Video scales down smoothly to 0.92 for a 3D depth effect as content slides over
  const scale = useTransform(scrollY, [0, 450], [1, 0.92])
  // 2. Video opacity dims and COMPLETELY FADES OUT to 0 once covered by content
  const opacity = useTransform(scrollY, [0, 320, 520], [1, 0.45, 0])
  // 3. Subtle dark overlay fades in as content glides over the video
  const overlayOpacity = useTransform(scrollY, [0, 350], [0, 0.45])
  // 4. Subtle parallax Y translation for physical layering
  const videoY = useTransform(scrollY, [0, 500], [0, 40])
  // 5. Scroll prompt fades out in the first 80px of scroll
  const promptOpacity = useTransform(scrollY, [0, 80], [1, 0])
  const pointerEvents = useTransform(scrollY, (val) => (val > 450 ? 'none' : 'auto'))

  const togglePlay = () => {
    if (!videoRef.current) return
    if (videoRef.current.paused) {
      videoRef.current.play()
      setIsPlaying(true)
    } else {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }

  return (
    <div className="relative bg-gray-50 overflow-x-hidden">
      {/* ── 1. Sticky Video Section ── */}
      {/* Stays pinned at top-16 under navbar only while hero content overlays it */}
      <motion.div
        style={{ opacity, pointerEvents }}
        className="sticky top-0 z-0 w-full flex items-center justify-center px-2 sm:px-4 "
      >
        <motion.div
          style={{ scale, y: videoY }}
          className="w-full max-w-[1500px] aspect-[18/8.5] max-sm:aspect-video md:rounded-2xl overflow-hidden shadow-[0_16px_45px_rgba(0,0,0,0.14)] relative group bg-black"
        >
          <video
            ref={videoRef}
            src="/hero-video.webm"
            autoPlay
            loop
            muted
            playsInline
            onClick={togglePlay}
            className="w-full h-full object-cover cursor-pointer"
          />

          {/* Dimming overlay that darkens smoothly as content slides over */}
          <motion.div
            style={{ opacity: overlayOpacity }}
            className="absolute inset-0 bg-black pointer-events-none"
          />

          {/* Play/Pause Button */}
          <button
            type="button"
            onClick={togglePlay}
            className={`absolute inset-0 m-auto w-16 h-16 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg ${
              isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100 scale-105'
            }`}
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
          >
            {isPlaying ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="ml-1">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Bottom Center Scroll Prompt */}
          <motion.div
            style={{ opacity: promptOpacity }}
            className="absolute bottom-4 sm:bottom-5 inset-x-0 mx-auto w-fit pointer-events-none flex items-center gap-2 text-white/90 text-xs font-medium bg-black/50 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 shadow-sm"
          >
            <span>Scroll down to explore</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-bounce"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ── 2. Content Overlay Sheet ── */}
      {/* Fully opaque background, covers video completely and continues through the rest of the page */}
      <div className="relative z-10 mt-16 bg-gray-50 min-h-screen rounded-t-[32px] sm:rounded-t-[44px] shadow-[0_-20px_50px_rgba(0,0,0,0.12)] border-t border-gray-200/90">
        {/* Subtle tactile handle bar */}
        <div className="pt-3.5 pb-1 flex justify-center">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Content sections (Hero, Booking, HowItWorks, Footer) */}
        {children}
      </div>
    </div>
  )
}
