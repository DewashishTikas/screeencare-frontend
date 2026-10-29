'use client'

import { useRef, useState } from 'react'
import { motion } from 'motion/react'

export default function VideoSection() {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(true)

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
    <section className="bg-gray-50 pt-12 px-6 md:px-6 sm:pt-8 sm:px-4">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          className="w-full rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.12)] relative group bg-black"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="relative w-full aspect-[16/7] max-sm:aspect-video overflow-hidden rounded-2xl bg-black">
            <video
              ref={videoRef}
              src="/hero-video.webm"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover rounded-2xl cursor-pointer"
              onClick={togglePlay}
            />

            {/* Play / Pause Overlay Button */}
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

            {/* Subtle caption pill */}
            <div className="absolute bottom-4 left-4 pointer-events-none bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-medium text-white/90 flex items-center gap-2 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Doorstep Installation Demo</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
