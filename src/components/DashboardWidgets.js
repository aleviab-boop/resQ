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
    <div className="grid grid-cols-2 gap-3">
      {/* Upcoming booking card */}
      <Link href="/my-bookings"
        className="bg-white rounded-2xl shadow-card p-4 hover:shadow-lg transition flex flex-col gap-1.5">
        <div className="text-2xl">🔧</div>
        <div className="text-sm font-bold text-gray-800 leading-tight">{nextBooking.service}</div>
        <div className="text-xs text-gray-400">{nextBooking.date}</div>
        <div className="mt-auto pt-2">
          <span className="text-xs font-semibold text-sky">Track →</span>
        </div>
      </Link>

      {/* Warranty expiring card */}
      {WARRANTY_EXPIRING.map(w => (
        <div key={w.name} className="bg-white rounded-2xl shadow-card p-4 flex flex-col gap-1.5">
          <div className="text-2xl">⚠️</div>
          <div className="text-sm font-bold text-gray-800 leading-tight">{w.name}</div>
          <div className="text-xs text-gray-400">Expires in {w.daysLeft} days</div>
          <div className="flex gap-2 mt-auto pt-2">
            <Link href={`/services/${w.serviceSlug}`}
              className="flex-1 bg-sky text-white text-xs font-bold py-1.5 rounded-lg text-center hover:bg-sky/90 transition">
              Book
            </Link>
            <Link href="/care-plan"
              className="flex-1 bg-amber-500 text-white text-xs font-bold py-1.5 rounded-lg text-center hover:bg-amber-600 transition">
              Protect
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
