'use client'
import { useState, useEffect, useRef } from 'react'
import { offerBanners } from '@/lib/data'

export default function OfferCarousel() {
  const [slide, setSlide] = useState(0)
  const touchX = useRef(null)
  // Each slide shows 2 banners; we loop through all banners one at a time
  const total = offerBanners.length

  useEffect(() => {
    const timer = setInterval(() => setSlide(s => (s + 1) % total), 4500)
    return () => clearInterval(timer)
  }, [total])

  function prev() { setSlide(s => (s - 1 + total) % total) }
  function next() { setSlide(s => (s + 1) % total) }

  function handleTouchStart(e) { touchX.current = e.touches[0].clientX }
  function handleTouchEnd(e) {
    if (touchX.current === null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev()
    touchX.current = null
  }

  const b1 = offerBanners[slide % total]
  const b2 = offerBanners[(slide + 1) % total]

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-gray-900">Offers</h2>
      </div>

      <div
        className="relative"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Two banners side by side with smooth fade transition */}
        <div className="grid grid-cols-2 gap-3">
          {[b1, b2].map((b, i) => (
            <div
              key={`${slide}-${i}`}
              className="rounded-2xl overflow-hidden shadow-card bg-gray-50"
              style={{ height: '180px' }}
            >
              <img
                src={b.img}
                alt={b.label}
                style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center' }}
              />
            </div>
          ))}
        </div>

        {/* Left arrow */}
        <button
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center z-10 text-lg"
        >‹</button>

        {/* Right arrow */}
        <button
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center z-10 text-lg"
        >›</button>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 mt-3">
          {offerBanners.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className={`rounded-full transition-all ${slide === i ? 'bg-sky w-4 h-2' : 'bg-gray-300 w-2 h-2'}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
