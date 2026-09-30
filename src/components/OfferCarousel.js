'use client'
import { useState, useEffect, useRef } from 'react'
import { offerBanners } from '@/lib/data'

export default function OfferCarousel() {
  const [slide, setSlide] = useState(0)
  const touchX = useRef(null)
  const total = offerBanners.length   // 4 banners

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

  return (
    <section>
      <h2 className="text-lg font-bold text-gray-900 mb-3">Offers</h2>

      <div
        className="relative"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Clipping wrapper */}
        <div style={{ overflow: 'hidden', borderRadius: '16px' }}>
          {/*
            Track: total items each 50% of original container width.
            Track total width = total * 50% of container.
            To move by one item (= 50% of container), translate by (1/total)*100% of track.
          */}
          <div
            style={{
              display: 'flex',
              width: `${total * 50}%`,
              transform: `translateX(-${(slide / total) * 100}%)`,
              transition: 'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
          >
            {offerBanners.map((b, i) => (
              <div
                key={i}
                style={{ width: `${100 / total}%`, flexShrink: 0, padding: '0 6px' }}
              >
                <div
                  style={{
                    height: '185px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    background: '#f9fafb',
                  }}
                >
                  <img
                    src={b.img}
                    alt={b.label}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      objectPosition: 'center',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
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
              className={`rounded-full transition-all duration-300 ${
                slide === i ? 'bg-sky w-4 h-2' : 'bg-gray-300 w-2 h-2'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
