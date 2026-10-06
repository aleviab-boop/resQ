'use client'
import Link from 'next/link'
import { slugify } from '@/lib/data'
import BookingFlow from './BookingFlow'
import { useState } from 'react'

// Deterministic fake-but-realistic rating from service name
function getServiceMeta(name) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  const rating = (4.4 + (h % 7) * 0.1).toFixed(1)          // 4.4 – 5.0
  const reviews = 120 + (h % 880)                            // 120 – 999
  return { rating, reviews }
}

export default function ServiceCard({ service }) {
  const [booking, setBooking] = useState(false)
  const { rating, reviews } = getServiceMeta(service.name)
  const hasSavings = service.savings && service.marketPrice

  return (
    <>
      <div className="bg-white rounded-card shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col">
        {/* Image */}
        <Link href={`/services/${slugify(service.name)}`} className="block relative">
          <img
            src={service.img}
            alt={service.name}
            style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }}
            loading="lazy"
          />
          {/* Savings badge */}
          {hasSavings && (
            <span className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow">
              Save {service.savings}
            </span>
          )}
          {/* "X booked recently" badge */}
          {service.badge && (
            <span className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm">
              🔥 {service.badge}
            </span>
          )}
        </Link>

        {/* Info */}
        <div className="p-3 flex flex-col flex-1">
          <Link href={`/services/${slugify(service.name)}`}>
            <div className="text-sm font-semibold text-gray-800 leading-snug mb-1">{service.name}</div>
          </Link>

          {/* Rating row */}
          <div className="flex items-center gap-1 mb-1.5">
            <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            <span className="text-xs font-bold text-gray-700">{rating}</span>
            <span className="text-xs text-gray-400">({reviews})</span>
          </div>

          {/* Price row */}
          <div className="flex items-center gap-2 mt-auto">
            <span className="text-sky font-bold text-sm">{service.price}</span>
            {hasSavings && (
              <span className="text-gray-400 line-through text-xs">{service.marketPrice}</span>
            )}
          </div>

          {/* Book now button */}
          <button
            onClick={() => setBooking(true)}
            className="mt-2.5 w-full py-2 bg-navy text-white text-xs font-bold rounded-xl hover:bg-navy/90 transition"
          >
            Book now
          </button>

          {/* 45 min banner */}
          <div className="mt-2 flex items-center justify-center gap-1.5 rounded-lg py-1.5 border border-sky"
            style={{ background: '#e8f7fd' }}>
            <span className="text-xs">⚡</span>
            <span className="text-[10px] font-bold" style={{ color: '#00a1e1' }}>Get serviced in 45 mins</span>
          </div>
        </div>
      </div>

      {booking && (
        <BookingFlow service={service} onClose={() => setBooking(false)} />
      )}
    </>
  )
}
