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
  { name: 'Daikin FTKF35TV AC', daysLeft: 12 },
]

export default function DashboardWidgets() {
  const { user, bookings } = useAuth()
  if (!user) return null

  // Find the next upcoming booking (user-created or mock)
  const nextBooking = bookings?.find(b => b.status === 'upcoming') || MOCK_UPCOMING

  return (
    <div className="space-y-3">
      {/* Active booking widget */}
      <Link href="/my-bookings"
        className="block bg-gradient-to-r from-navy to-sky rounded-2xl p-4 hover:opacity-95 transition">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/70 text-xs font-semibold uppercase tracking-wide">Upcoming service</span>
          <span className="text-white/70 text-xs">→ Track</span>
        </div>
        <div className="text-white font-extrabold text-base leading-tight">{nextBooking.service}</div>
        <div className="flex items-center gap-3 mt-2 text-white/80 text-xs">
          <span>📅 {nextBooking.date}</span>
          <span>🕐 {nextBooking.time}</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
            {(nextBooking.tech?.name || nextBooking.tech || 'T').charAt(0)}
          </div>
          <span className="text-white/80 text-xs">{nextBooking.tech?.name || nextBooking.tech}</span>
        </div>
      </Link>

      {/* Warranty expiring nudge */}
      {WARRANTY_EXPIRING.map(w => (
        <div key={w.name} className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-xl flex-shrink-0">⚠️</div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-amber-800">{w.name}</div>
            <div className="text-xs text-amber-600 mt-0.5">Warranty expires in {w.daysLeft} days</div>
          </div>
          <div className="flex flex-col gap-1.5 flex-shrink-0">
            <Link href="/all-services?q=AC"
              className="bg-sky text-white text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-sky/90 transition text-center">
              Book Service
            </Link>
            <Link href="/care-plan"
              className="bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-amber-600 transition text-center">
              Protect
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
