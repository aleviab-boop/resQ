'use client'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const MOCK_NOTIFS = [
  {
    id: 1, icon: '✅', title: 'Booking Confirmed',
    body: 'Your Split AC Jet Service is confirmed for Fri, 2 Oct at 10:00 AM.',
    time: '2 hours ago', read: false, color: 'bg-green-100',
  },
  {
    id: 2, icon: '🔔', title: 'Technician Assigned',
    body: 'Ramesh Kumar has been assigned for your AC service. He will call you before arrival.',
    time: '3 hours ago', read: false, color: 'bg-blue-100',
  },
  {
    id: 3, icon: '🎉', title: 'Limited Time Offer!',
    body: 'Get AC Jet Service at ₹599 only. Book before 5 Oct and save ₹200.',
    time: 'Yesterday', read: true, color: 'bg-yellow-100',
  },
  {
    id: 4, icon: '⭐', title: 'Rate your experience',
    body: 'How was your LED TV Cleaning service on 20 Sep? Share your feedback.',
    time: '10 days ago', read: true, color: 'bg-purple-100',
  },
  {
    id: 5, icon: '📦', title: 'Service Completed',
    body: 'Your Front Load WM Installation on 15 Sep was completed successfully.',
    time: '15 days ago', read: true, color: 'bg-green-100',
  },
  {
    id: 6, icon: '💡', title: 'Maintenance Reminder',
    body: 'It\'s been 6 months since your last AC service. Book a cleaning to maintain efficiency.',
    time: '20 days ago', read: true, color: 'bg-sky-100',
  },
]

export default function NotificationsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  const [notifs, setNotifs] = useState(MOCK_NOTIFS)

  useEffect(() => {
    if (!user) router.push('/login')
  }, [user, router])

  if (!mounted || !user) return null

  const unreadCount = notifs.filter(n => !n.read).length

  function markAllRead() {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })))
  }

  function markRead(id) {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-xs text-gray-500 mt-0.5">{unreadCount} unread</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="text-sky text-sm font-semibold">
            Mark all read
          </button>
        )}
      </div>

      {notifs.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-4">🔔</div>
          <div className="font-semibold text-gray-500">No notifications yet</div>
        </div>
      ) : (
        <div className="space-y-3">
          {notifs.map(n => (
            <div
              key={n.id}
              onClick={() => markRead(n.id)}
              className={`flex gap-4 p-4 rounded-2xl cursor-pointer transition hover:shadow-md ${
                n.read ? 'bg-white' : 'bg-blue-50 border border-blue-100'
              }`}
            >
              <div className={`w-11 h-11 rounded-full ${n.color} flex items-center justify-center text-xl flex-shrink-0`}>
                {n.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold ${n.read ? 'text-gray-800' : 'text-navy'}`}>
                    {n.title}
                  </span>
                  {!n.read && <span className="w-2 h-2 bg-sky rounded-full flex-shrink-0" />}
                </div>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.body}</p>
                <div className="text-xs text-gray-400 mt-1">{n.time}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
