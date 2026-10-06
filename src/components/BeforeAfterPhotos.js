'use client'
import { useState, useRef, useEffect } from 'react'

// Mock before/after pairs per service type
const PHOTOS = {
  'AC':          { before: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80', after: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80' },
  'TV':          { before: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&q=80', after: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&q=80' },
  'Washing':     { before: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', after: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=600&q=80' },
  'Refrigerator':{ before: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600&q=80', after: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600&q=80' },
  'default':     { before: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80', after: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80' },
}

function getPhotos(serviceName) {
  if (!serviceName) return PHOTOS.default
  if (serviceName.includes('AC') || serviceName.includes('Air')) return PHOTOS.AC
  if (serviceName.includes('TV') || serviceName.includes('LED')) return PHOTOS.TV
  if (serviceName.includes('Washing') || serviceName.includes('WM')) return PHOTOS.Washing
  if (serviceName.includes('Refrigerator') || serviceName.includes('Fridge')) return PHOTOS.Refrigerator
  return PHOTOS.default
}

export default function BeforeAfterPhotos({ service }) {
  const [sliderPos, setSliderPos] = useState(50)
  const [dragging, setDragging] = useState(false)
  const containerRef = useRef()
  const { before, after } = getPhotos(service)

  function getPos(clientX) {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return 50
    return Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100))
  }

  function onMouseDown(e) { setDragging(true); e.preventDefault() }
  function onMouseMove(e) { if (dragging) setSliderPos(getPos(e.clientX)) }
  function onMouseUp() { setDragging(false) }
  function onTouchMove(e) { setSliderPos(getPos(e.touches[0].clientX)) }

  useEffect(() => {
    window.addEventListener('mouseup', onMouseUp)
    return () => window.removeEventListener('mouseup', onMouseUp)
  }, [])

  return (
    <div className="px-4 pb-4">
      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Before &amp; After</div>
      <div
        ref={containerRef}
        className="relative rounded-2xl overflow-hidden select-none cursor-col-resize"
        style={{ height: 180 }}
        onMouseMove={onMouseMove}
        onTouchMove={onTouchMove}
      >
        {/* After (full width base) */}
        <img src={after} alt="After" className="absolute inset-0 w-full h-full object-cover" />

        {/* Before (clipped to left of slider) */}
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPos}%` }}>
          <img src={before} alt="Before" className="absolute inset-0 w-full h-full object-cover" style={{ width: containerRef.current?.getBoundingClientRect().width || 400 }} />
        </div>

        {/* Slider line */}
        <div className="absolute top-0 bottom-0" style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}>
          <div className="w-0.5 h-full bg-white shadow-lg" />
          {/* Handle */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full shadow-xl flex items-center justify-center cursor-col-resize"
            onMouseDown={onMouseDown}
            onTouchStart={() => setDragging(true)}
            onTouchEnd={() => setDragging(false)}
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l-3 3 3 3m8-6l3 3-3 3"/>
            </svg>
          </div>
        </div>

        {/* Labels */}
        <span className="absolute top-2 left-2 bg-black/50 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">BEFORE</span>
        <span className="absolute top-2 right-2 bg-sky text-white text-[10px] font-bold px-2 py-0.5 rounded-full">AFTER</span>
      </div>
      <p className="text-[10px] text-gray-400 text-center mt-1.5">Drag slider to compare</p>
    </div>
  )
}
