'use client'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'

const MOCK_UPCOMING = {
  service: 'Split AC Jet Service',
  date: 'Fri, 2 Oct 2026',
  time: '10:00 AM – 12:00 PM',
  tech: 'Rahul Sharma',
  id: 'BK2026001',
}

const WARRANTY_EXPIRING = [
  { name: 'Daikin FTKF35TV AC', daysLeft: 12, serviceSlug: 'split-ac-jet-service' },
]

export default function DashboardWidgets() {
  const { user, bookings } = useAuth()
  if (!user) return null

  const nextBooking = bookings?.find(b => b.status === 'upcoming') || MOCK_UPCOMING

  return (
    <div className="space-y-2">
      {/* Upcoming booking — slim horizontal card */}
      <Link href="/my-bookings"
        className="flex items-center gap-3 bg-gradient-to-r from-navy to-sky rounded-xl px-4 py-3 hover:opacity-95 transition">
        <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 text-lg">🔧</div>
        <div className="flex-1 min-w-0">
          <div className="text-white font-bold text-sm leading-tight truncate">{nextBooking.service}</div>
          <div className="text-white/70 text-xs mt-0.5 truncate">{nextBooking.date} · {nextBooking.time}</div>
        </div>
        <div className="text-white/80 text-xs font-semibold flex-shrink-0 flex items-center gap-1">
          Track
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
        </div>
      </Link>

      {/* Warranty expiring — slim alert strip */}
      {WARRANTY_EXPIRING.map(w => (
        <div key={w.name} className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
          <span className="text-lg flex-shrink-0">⚠️</span>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-amber-800 truncate">{w.name}</div>
            <div className="text-[11px] text-amber-600 mt-0.5">Warranty expires in {w.daysLeft} days</div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Link href={`/services/${w.serviceSlug}`}
              className="bg-sky text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-sky/90 transition">
              Book
            </Link>
            <Link href="/care-plan"
              className="bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-amber-600 transition">
              Protect
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
