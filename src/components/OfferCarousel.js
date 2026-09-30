'use client'
import { useState, useEffect } from 'react'
import { offerBanners } from '@/lib/data'

export default function OfferCarousel() {
  // Show 2 banners at a time; slide by 2
  const [startIdx, setStartIdx] = useState(0)
  const total = offerBanners.length

  useEffect(() => {
    const timer = setInterval(() => {
      setStartIdx(s => (s + 2) % total)
    }, 5000)
    return () => clearInterval(timer)
  }, [total])

  const left = offerBanners[startIdx % total]
  const right = offerBanners[(startIdx + 1) % total]

  function prev() { setStartIdx(s => (s - 2 + total) % total) }
  function next() { setStartIdx(s => (s + 2) % total) }

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-gray-900">Offers</h2>
      </div>
      <div className="relative">
        <div className="grid grid-cols-2 gap-3">
          {[left, right].map((b, i) => (
            <div key={i} className="rounded-2xl overflow-hidden shadow-card bg-white" style={{height: '180px'}}>
              <img
                src={b.img}
                alt={b.label}
                style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center'}}
              />
            </div>
          ))}
        </div>

        {/* Arrows */}
        <button
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center z-10"
        >‹</button>
        <button
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center z-10"
        >›</button>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 mt-2">
          {Array.from({length: Math.ceil(total / 2)}).map((_, i) => (
            <button
              key={i}
              onClick={() => setStartIdx(i * 2)}
              className={`rounded-full transition-all ${Math.floor(startIdx / 2) === i ? 'bg-sky w-4 h-2' : 'bg-gray-300 w-2 h-2'}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
