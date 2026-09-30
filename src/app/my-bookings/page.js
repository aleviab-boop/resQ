'use client'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const MOCK_BOOKINGS = [
  {
    id: 'BK2026001',
    service: 'Split AC Jet Service',
    appliance: 'Air Conditioner',
    date: 'Fri, 2 Oct 2026',
    time: '10:00 AM – 12:00 PM',
    address: '12, Sunset Residency, Lokhandwala, Mumbai',
    status: 'upcoming',
    price: '₹599',
    img: 'https://myjiostatic.cdn.jio.com/JPW/CDIT_Consumer/images/backend/compressed/splite_ac_Split_AC_Jet_Service.webp',
  },
  {
    id: 'BK2026002',
    service: 'LED TV 40–55 inch Cleaning',
    appliance: 'LED TV',
    date: 'Sat, 20 Sep 2026',
    time: '2:00 PM – 4:00 PM',
    address: '12, Sunset Residency, Lokhandwala, Mumbai',
    status: 'completed',
    price: '₹189',
    img: 'https://myjiostatic.cdn.jio.com/JPW/CDIT_Consumer/images/backend/compressed/TV_Tv_cleanning_copy.webp',
  },
  {
    id: 'BK2026003',
    service: 'Front Load WM Installation',
    appliance: 'Washing Machine',
    date: 'Mon, 15 Sep 2026',
    time: '11:00 AM – 1:00 PM',
    address: 'Reliance Corporate Park, Navi Mumbai',
    status: 'completed',
    price: '₹409',
    img: 'https://myjiostatic.cdn.jio.com/JPW/CDIT_Consumer/images/backend/compressed/front_Load_Washing_Machine_washing_machine_installation_.webp',
  },
  {
    id: 'BK2026004',
    service: 'Water Purifier Service with filter',
    appliance: 'Water Purifier',
    date: 'Thu, 10 Sep 2026',
    time: '9:00 AM – 11:00 AM',
    address: '12, Sunset Residency, Lokhandwala, Mumbai',
    status: 'cancelled',
    price: '₹309',
    img: 'https://myjiostatic.cdn.jio.com/JPW/CDIT_Consumer/images/backend/compressed/Water_Purifier_Water_Purifier_Service_with_Filter_(Parts_Extra).webp',
  },
]

const STATUS_CONFIG = {
  upcoming:  { label: 'Upcoming',  color: 'bg-blue-100 text-blue-700' },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-500' },
}

export default function MyBookingsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [tab, setTab] = useState('all')
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (mounted && !user) router.push('/login')
  }, [mounted, user, router])

  if (!mounted || !user) return null

  const filtered = tab === 'all' ? MOCK_BOOKINGS : MOCK_BOOKINGS.filter(b => b.status === tab)

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">
      <h1 className="text-xl font-bold text-gray-900">My Bookings</h1>

      {/* Tabs */}
      <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
        {[['all', 'All'], ['upcoming', 'Upcoming'], ['completed', 'Completed'], ['cancelled', 'Cancelled']].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setTab(val)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition ${
              tab === val ? 'bg-white text-navy shadow-sm' : 'text-gray-500'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Booking cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-4">📋</div>
          <div className="font-semibold text-gray-500">No bookings found</div>
          <button onClick={() => router.push('/all-services')}
            className="mt-4 text-sky text-sm font-semibold">Browse services →</button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(b => (
            <div key={b.id} className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="flex gap-4 p-4">
                <img src={b.img} alt={b.service}
                  className="w-16 h-16 object-cover rounded-xl flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-semibold text-gray-900 text-sm leading-tight">{b.service}</div>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold flex-shrink-0 ${STATUS_CONFIG[b.status].color}`}>
                      {STATUS_CONFIG[b.status].label}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Booking ID: {b.id}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current text-gray-400"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/></svg>
                    <span className="text-xs text-gray-500">{b.date} · {b.time}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current text-gray-400"><path d="M12 2C8.1 2 5 5.1 5 9c0 5.3 7 13 7 13s7-7.7 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5s2.5 1.1 2.5 2.5S13.4 11.5 12 11.5z"/></svg>
                    <span className="text-xs text-gray-500 truncate">{b.address}</span>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between">
                <span className="text-sm font-bold text-navy">{b.price}</span>
                <div className="flex gap-2">
                  {b.status === 'upcoming' && (
                    <button className="text-xs px-3 py-1.5 border border-red-300 text-red-500 rounded-lg font-semibold hover:bg-red-50 transition">
                      Cancel
                    </button>
                  )}
                  {b.status === 'upcoming' && (
                    <button className="text-xs px-3 py-1.5 border border-sky text-sky rounded-lg font-semibold hover:bg-sky/10 transition">
                      Reschedule
                    </button>
                  )}
                  {b.status === 'completed' && (
                    <button className="text-xs px-3 py-1.5 bg-navy text-white rounded-lg font-semibold hover:bg-navy/90 transition">
                      Book again
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
