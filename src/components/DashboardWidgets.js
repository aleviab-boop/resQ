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

const DEVICE_SLUG = {
  'Air Conditioner': 'split-ac-jet-service',
  'Washing Machine': 'washing-machine-service',
  'Refrigerator': 'refrigerator-service',
  'LED TV': 'led-tv-repair',
  'Water Purifier': 'water-purifier-service',
}

function daysLeft(purchaseDate, warrantyYears) {
  if (!purchaseDate || !warrantyYears) return null
  const expiry = new Date(purchaseDate)
  expiry.setFullYear(expiry.getFullYear() + parseInt(warrantyYears))
  return Math.ceil((expiry - new Date()) / (1000 * 60 * 60 * 24))
}

export default function DashboardWidgets() {
  const { user, bookings, devices } = useAuth()
  if (!user) return null

  const nextBooking = bookings?.find(b => b.status === 'upcoming') || MOCK_UPCOMING

  // Devices with warranty expiring within 60 days
  const expiringDevices = devices.filter(d => {
    const left = daysLeft(d.purchaseDate, d.warrantyYears)
    return left !== null && left <= 60 && left > 0
  })

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

      {/* Warranty expiring — first expiring device, or empty state */}
      {expiringDevices.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-4 flex flex-col gap-1.5">
          <div className="text-2xl">⚠️</div>
          <div className="text-sm font-bold text-gray-800 leading-tight">{expiringDevices[0].brand} {expiringDevices[0].model}</div>
          <div className="text-xs text-gray-400">Expires in {daysLeft(expiringDevices[0].purchaseDate, expiringDevices[0].warrantyYears)} days</div>
          <div className="flex gap-2 mt-auto pt-2">
            <Link href={`/services/${DEVICE_SLUG[expiringDevices[0].type] || 'split-ac-jet-service'}`}
              className="flex-1 bg-sky text-white text-xs font-bold py-1.5 rounded-lg text-center hover:bg-sky/90 transition">
              Book
            </Link>
            <Link href="/care-plan"
              className="flex-1 bg-amber-500 text-white text-xs font-bold py-1.5 rounded-lg text-center hover:bg-amber-600 transition">
              Protect
            </Link>
          </div>
        </div>
      ) : (
        <Link href="/my-devices"
          className="bg-white rounded-2xl shadow-card p-4 hover:shadow-lg transition flex flex-col gap-1.5">
          <div className="text-2xl">📱</div>
          <div className="text-sm font-bold text-gray-800 leading-tight">My Devices</div>
          <div className="text-xs text-gray-400">{devices.length > 0 ? `${devices.length} device${devices.length !== 1 ? 's' : ''} registered` : 'Add your appliances'}</div>
          <div className="mt-auto pt-2">
            <span className="text-xs font-semibold text-sky">Manage →</span>
          </div>
        </Link>
      )}
    </div>
  )
}
