'use client'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '@/context/AuthContext'

// Sequence of notifications fired for the demo live booking
const SEQUENCE = [
  { delay: 8000,  icon: '✅', title: 'Booking Confirmed', body: 'Your AC Jet Service is confirmed for today. Arjun Mehta is your technician.', type: 'booking' },
  { delay: 20000, icon: '🛵', title: 'Technician On the Way', body: 'Arjun Mehta has started heading to your location. ETA: ~12 minutes.', type: 'booking' },
  { delay: 40000, icon: '📍', title: 'Technician Nearby', body: 'Arjun Mehta is 3 mins away! Please be available at your door.', type: 'booking' },
  { delay: 60000, icon: '🔔', title: 'Technician Arrived', body: 'Arjun Mehta has arrived at your address. Please open the door.', type: 'booking' },
  { delay: 90000, icon: '🔧', title: 'Service In Progress', body: 'Your AC service has started. Sit back and relax!', type: 'booking' },
  { delay: 130000, icon: '🎉', title: 'Service Completed!', body: 'Your AC Jet Service is done. Download your report & rate your experience.', type: 'booking' },
]

const STORAGE_KEY = 'resq_push_notifs'

function saveNotif(notif) {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    const newNotif = { ...notif, id: Date.now(), time: 'Just now', read: false }
    localStorage.setItem(STORAGE_KEY, JSON.stringify([newNotif, ...existing]))
  } catch {}
}

function fireBrowserNotif(title, body, icon) {
  if (typeof window === 'undefined') return
  if (Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'resq-' + Date.now(),
      })
    } catch {}
  }
}

// In-app toast banner
function NotifToast({ notif, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 5000)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] w-[90vw] max-w-sm animate-slide-down">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 flex items-start gap-3 px-4 py-3.5">
        <div className="text-2xl flex-shrink-0">{notif.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-gray-900 text-sm">{notif.title}</div>
          <div className="text-xs text-gray-500 mt-0.5 leading-snug line-clamp-2">{notif.body}</div>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 flex-shrink-0 mt-0.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default function NotificationManager() {
  const { user } = useAuth()
  const [toast, setToast] = useState(null)
  const firedRef = useRef(false)
  const timersRef = useRef([])

  // Request permission once user is logged in
  useEffect(() => {
    if (!user) return
    if (typeof window === 'undefined') return
    if (Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [user])

  // Fire notification sequence once per session
  useEffect(() => {
    if (!user) return
    if (firedRef.current) return
    const sessionKey = 'resq_notif_session'
    if (sessionStorage.getItem(sessionKey)) return
    sessionStorage.setItem(sessionKey, '1')
    firedRef.current = true

    SEQUENCE.forEach(({ delay, icon, title, body, type }) => {
      const t = setTimeout(() => {
        // In-app toast
        setToast({ icon, title, body })
        // Browser push
        fireBrowserNotif(title, body)
        // Save to Notifications page
        saveNotif({ icon, title, body, type, color: 'bg-blue-100' })
        // Dispatch event so Notifications page can refresh
        window.dispatchEvent(new Event('resq-notif-update'))
      }, delay)
      timersRef.current.push(t)
    })

    return () => timersRef.current.forEach(clearTimeout)
  }, [user])

  if (!toast) return null

  return <NotifToast notif={toast} onClose={() => setToast(null)} />
}
