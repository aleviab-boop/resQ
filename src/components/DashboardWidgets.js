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

  // Find the next upcoming booking (user-created or mock)
  const nextBooking = bookings?.find(b => b.status === 'upcoming') || MOCK_UPCOMING

  return (
    <div className="grid grid-cols-2 gap-3 items-start">
      {/* Active booking widget */}
      <Link href="/my-bookings"
        className="block bg-gradient-to-r from-navy to-sky rounded-2xl p-3 hover:opacity-95 transition h-full">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-white/70 text-[10px] font-semibold uppercase tracking-wide">Upcoming</span>
          <span className="text-white/70 text-[10px]">→ Track</span>
        </div>
        <div className="text-white font-extrabold text-sm leading-tight">{nextBooking.service}</div>
        <div className="flex flex-col gap-0.5 mt-1.5 text-white/80 text-[10px]">
          <span>📅 {nextBooking.date}</span>
          <span>🕐 {nextBooking.time}</span>
        </div>
        <div className="flex items-center gap-1.5 mt-2">
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
            {(nextBooking.tech?.name || nextBooking.tech || 'T').charAt(0)}
          </div>
          <span className="text-white/80 text-[10px] truncate">{nextBooking.tech?.name || nextBooking.tech}</span>
        </div>
      </Link>

      {/* Warranty expiring nudge */}
      {WARRANTY_EXPIRING.map(w => (
        <div key={w.name} className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex flex-col gap-2 h-full">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-base flex-shrink-0">⚠️</div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-amber-800 leading-tight truncate">{w.name}</div>
              <div className="text-[10px] text-amber-600 mt-0.5">Expires in {w.daysLeft} days</div>
            </div>
          </div>
          <div className="flex gap-1.5">
            <Link href={`/services/${w.serviceSlug}`}
              className="flex-1 bg-sky text-white text-[10px] font-bold py-1.5 rounded-lg hover:bg-sky/90 transition text-center">
              Book
            </Link>
            <Link href="/care-plan"
              className="flex-1 bg-amber-500 text-white text-[10px] font-bold py-1.5 rounded-lg hover:bg-amber-600 transition text-center">
              Protect
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
