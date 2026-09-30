'use client'
import { useState, useEffect, useRef } from 'react'
import { offerBanners } from '@/lib/data'

export default function OfferCarousel() {
  const [slide, setSlide] = useState(0)
  const touchX = useRef(null)
  const total = offerBanners.length

  useEffect(() => {
    const timer = setInterval(() => setSlide(s => (s + 1) % total), 4500)
    return () => clearInterval(timer)
  }, [total])

  function handleTouchStart(e) { touchX.current = e.touches[0].clientX }
  function handleTouchEnd(e) {
    if (touchX.current === null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 40) setSlide(s => dx < 0 ? (s + 1) % total : (s - 1 + total) % total)
    touchX.current = null
  }

  return (
    <div className="relative overflow-hidden rounded-card shadow-card">
      <div
        className="flex carousel-track"
        style={{ transform: `translateX(-${slide * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {offerBanners.map((b, i) => (
          <div key={i} className="min-w-full relative bg-white" style={{height:'220px'}}>
            <img src={b.img} alt={b.label} style={{width:'100%',height:'100%',objectFit:'contain',objectPosition:'center'}} />
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {offerBanners.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlide(i)}
            className={`rounded-full transition-all ${i === slide ? 'bg-white w-5 h-2' : 'bg-white/50 w-2 h-2'}`}
          />
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={() => setSlide(s => (s - 1 + total) % total)}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center"
      >‹</button>
      <button
        onClick={() => setSlide(s => (s + 1) % total)}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center"
      >›</button>
    </div>
  )
}
