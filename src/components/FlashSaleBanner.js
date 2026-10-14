'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

// Sale ends at midnight today
function getTimeLeft() {
  const now = new Date()
  const end = new Date()
  end.setHours(23, 59, 59, 999)
  const diff = end - now
  if (diff <= 0) return { h: '00', m: '00', s: '00' }
  const h = String(Math.floor(diff / 3600000)).padStart(2, '0')
  const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0')
  const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0')
  return { h, m, s }
}

export default function FlashSaleBanner() {
  const [time, setTime] = useState(getTimeLeft())
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const iv = setInterval(() => setTime(getTimeLeft()), 1000)
    return () => clearInterval(iv)
  }, [])

  if (!visible) return null

  return (
    <div className="relative bg-gradient-to-r from-rose-500 via-orange-500 to-amber-400 rounded-2xl overflow-hidden">
      {/* Animated shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2s_infinite]" />

      <div className="relative flex items-center justify-between px-3 py-2.5 gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-lg flex-shrink-0">⚡</span>
          <div className="min-w-0">
            <div className="text-white font-extrabold text-xs leading-tight">Flash Sale — Up to 40% off</div>
            <div className="text-white/80 text-[10px] truncate">AC Jet ₹599 · Fridge ₹189 · Washer ₹349</div>
          </div>
        </div>

        {/* Countdown */}
        <div className="flex items-center gap-0.5 flex-shrink-0">
          {[time.h, time.m, time.s].map((v, i) => (
            <span key={i} className="flex items-center gap-0.5">
              <span className="bg-white/20 text-white font-extrabold text-xs px-1.5 py-0.5 rounded tabular-nums">{v}</span>
              {i < 2 && <span className="text-white font-bold text-xs">:</span>}
            </span>
          ))}
        </div>

        <Link href="/all-services"
          className="flex-shrink-0 bg-white text-orange-500 font-extrabold text-[10px] px-2.5 py-1.5 rounded-lg hover:bg-orange-50 transition">
          Shop
        </Link>

        <button onClick={() => setVisible(false)} className="flex-shrink-0 text-white/60 hover:text-white transition">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
