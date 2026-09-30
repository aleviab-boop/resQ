'use client'
import { useRef, useState } from 'react'

export default function VideoCard({ src, index }) {
  const ref = useRef(null)
  const [modal, setModal] = useState(false)

  function handleMouseEnter() { ref.current?.play() }
  function handleMouseLeave() { ref.current?.pause(); if (ref.current) ref.current.currentTime = 0 }

  return (
    <>
      <div
        className="relative rounded-card overflow-hidden cursor-pointer bg-gray-900 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => setModal(true)}
      >
        <video
          ref={ref}
          src={src}
          muted
          playsInline
          loop
          className="w-full h-44 object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/10 transition">
          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-navy ml-1">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
        <div className="absolute bottom-2 left-3 text-white text-xs font-medium">
          Customer #{index + 1}
        </div>
      </div>

      {/* Fullscreen modal */}
      {modal && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setModal(false)}
        >
          <video
            src={src}
            autoPlay
            controls
            className="max-w-full max-h-[90vh] rounded-xl"
            onClick={e => e.stopPropagation()}
          />
          <button
            className="absolute top-4 right-4 text-white text-3xl leading-none"
            onClick={() => setModal(false)}
          >×</button>
        </div>
      )}
    </>
  )
}
