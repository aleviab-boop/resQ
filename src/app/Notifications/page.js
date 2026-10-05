'use client'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

// Warranty nudge data (FY26 Q4 roadmap: spares brand warranty automation)
const MOCK_NOTIFS = [
  {
    id: 1, type: 'booking', icon: '✅', title: 'Booking Confirmed',
    body: 'Your Split AC Jet Service is confirmed for Fri, 2 Oct at 10:00 AM. Rahul Sharma will be your technician.',
    time: '2 hours ago', read: false, color: 'bg-green-100', cta: null,
  },
  {
    id: 2, type: 'booking', icon: '🛵', title: 'Technician On the Way',
    body: 'Rahul Sharma is on his way. ETA: 18 minutes. Track him live in My Bookings.',
    time: '3 hours ago', read: false, color: 'bg-blue-100', cta: { label: 'Track Now', href: '/my-bookings' },
  },
  {
    id: 3, type: 'warranty', icon: '⚠️', title: 'Warranty Expiring Soon',
    body: 'Your Daikin FTKF35TV AC warranty expires in 12 days (14 Oct 2026). Protect it with a resQ Care Plan before it\'s too late.',
    time: 'Today', read: false, color: 'bg-yellow-100', cta: { label: 'Get Care Plan', href: '/care-plan' },
    urgent: true,
  },
  {
    id: 4, type: 'warranty', icon: '🛡️', title: 'Warranty Expired — LG Refrigerator',
    body: 'Your LG GN-H702HLHU refrigerator warranty expired 45 days ago. An unexpected breakdown now means full repair costs. Secure it today.',
    time: '2 days ago', read: true, color: 'bg-red-100', cta: { label: 'View Plans', href: '/care-plan' },
    urgent: true,
  },
  {
    id: 5, type: 'offer', icon: '🎉', title: 'Limited Time Offer!',
    body: 'Get AC Jet Service at ₹599 only. Book before 7 Oct and save ₹200. Only 48 hours left.',
    time: 'Yesterday', read: true, color: 'bg-orange-100', cta: { label: 'Book Now', href: '/all-services' },
  },
  {
    id: 6, type: 'review', icon: '⭐', title: 'Rate your experience',
    body: 'How was your LED TV Cleaning service on 20 Sep? Your feedback helps us improve and helps other customers choose the right technician.',
    time: '10 days ago', read: true, color: 'bg-purple-100', cta: { label: 'Rate Now', href: '/my-bookings' },
  },
  {
    id: 7, type: 'booking', icon: '📦', title: 'Service Completed',
    body: 'Your Front Load WM Installation on 15 Sep was completed. Download your service report for warranty records.',
    time: '15 days ago', read: true, color: 'bg-green-100', cta: { label: 'Download Report', href: '/my-bookings' },
  },
  {
    id: 8, type: 'maintenance', icon: '💡', title: 'AC Maintenance Reminder',
    body: "It's been 6 months since your last AC service. Regular cleaning improves efficiency by up to 30% and extends compressor life.",
    time: '20 days ago', read: true, color: 'bg-sky-100', cta: { label: 'Book Service', href: '/all-services' },
  },
  {
    id: 9, type: 'warranty', icon: '📅', title: 'Annual Service Due — Water Purifier',
    body: 'Your Kent RO purifier is due for its annual filter replacement. Skipping this can affect water quality and void your warranty.',
    time: '25 days ago', read: true, color: 'bg-blue-100', cta: { label: 'Schedule Service', href: '/all-services' },
  },
]

const FILTER_TABS = [
  { id: 'all', label: 'All' },
  { id: 'warranty', label: '🛡️ Warranty' },
  { id: 'booking', label: '📋 Bookings' },
  { id: 'offer', label: '🎁 Offers' },
]

export default function NotificationsPage() {
  const { user, hydrated } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [notifs, setNotifs] = useState(MOCK_NOTIFS)
  const [filter, setFilter] = useState('all')

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => { if (hydrated && !user) router.push('/login') }, [mounted, user, router])
  if (!hydrated || !user) return null

  const filtered = filter === 'all' ? notifs : notifs.filter(n => n.type === filter)
  const unreadCount = notifs.filter(n => !n.read).length

  function markAllRead() { setNotifs(prev => prev.map(n => ({ ...n, read: true }))) }
  function markRead(id) { setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n)) }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
          {unreadCount > 0 && <p className="text-xs text-gray-500 mt-0.5">{unreadCount} unread</p>}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="text-sky text-sm font-semibold">Mark all read</button>
        )}
      </div>

      {/* Warranty alert banner — Q4 roadmap: spares brand warranty automation */}
      {notifs.some(n => n.type === 'warranty' && !n.read) && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-4 mb-5 flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <div className="flex-1">
            <div className="text-white font-bold text-sm">Warranty alerts need attention</div>
            <div className="text-white/80 text-xs mt-0.5">You have devices with expiring or expired warranties.</div>
          </div>
          <Link href="/my-devices" className="bg-white text-orange-600 text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-orange-50 transition flex-shrink-0">
            View Devices
          </Link>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 bg-gray-100 p-1 rounded-xl mb-5 overflow-x-auto">
        {FILTER_TABS.map(t => (
          <button key={t.id} onClick={() => setFilter(t.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-semibold transition ${filter === t.id ? 'bg-white text-navy shadow-sm' : 'text-gray-500'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-4">🔔</div>
          <div className="font-semibold text-gray-500">No notifications here</div>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(n => (
            <div key={n.id} onClick={() => markRead(n.id)}
              className={`rounded-2xl cursor-pointer transition hover:shadow-md overflow-hidden ${
                n.read ? 'bg-white' : n.urgent ? 'bg-amber-50 border border-amber-200' : 'bg-blue-50 border border-blue-100'
              }`}>
              <div className="flex gap-4 p-4">
                <div className={`w-11 h-11 rounded-full ${n.color} flex items-center justify-center text-xl flex-shrink-0`}>
                  {n.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-sm font-semibold ${n.read ? 'text-gray-800' : n.urgent ? 'text-amber-800' : 'text-navy'}`}>
                      {n.title}
                    </span>
                    {!n.read && <span className="w-2 h-2 bg-sky rounded-full flex-shrink-0" />}
                    {n.urgent && !n.read && <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">Action needed</span>}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.body}</p>
                  <div className="text-xs text-gray-400 mt-1">{n.time}</div>
                </div>
              </div>
              {n.cta && (
                <div className={`px-4 pb-3 border-t ${n.urgent && !n.read ? 'border-amber-100' : 'border-gray-100'}`}>
                  <Link href={n.cta.href}
                    className={`inline-block mt-2 text-xs font-bold px-4 py-2 rounded-xl transition ${
                      n.urgent && !n.read
                        ? 'bg-amber-500 text-white hover:bg-amber-600'
                        : 'bg-sky text-white hover:bg-sky/90'
                    }`}
                    onClick={e => e.stopPropagation()}>
                    {n.cta.label} →
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
