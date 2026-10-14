'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

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
    <div className="flex items-center gap-3 bg-gray-900 rounded-xl px-4 py-3">
      {/* Left — icon + label */}
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 text-sm">⚡</div>
        <div className="min-w-0">
          <div className="text-white font-bold text-xs leading-tight">Flash Sale — Up to 40% off</div>
          <div className="text-gray-400 text-[11px] mt-0.5 truncate">AC Jet ₹599 · Fridge ₹189 · Washer ₹349</div>
        </div>
      </div>

      {/* Countdown */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {[time.h, time.m, time.s].map((v, i) => (
          <span key={i} className="flex items-center gap-1">
            <span className="bg-gray-800 text-orange-400 font-bold text-xs px-1.5 py-1 rounded-md tabular-nums">{v}</span>
            {i < 2 && <span className="text-gray-600 font-bold text-xs">:</span>}
          </span>
        ))}
      </div>

      <Link href="/all-services"
        className="flex-shrink-0 bg-orange-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg hover:bg-orange-600 transition">
        Shop
      </Link>

      <button onClick={() => setVisible(false)} className="flex-shrink-0 text-gray-600 hover:text-gray-400 transition">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>
  )
}
