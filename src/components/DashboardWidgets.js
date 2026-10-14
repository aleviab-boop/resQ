'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'

const MOCK_UPCOMING = {
  service: 'Split AC Jet Service',
  date: 'Fri, 2 Oct 2026',
  time: '10:00 AM – 12:00 PM',
  tech: 'Rahul Sharma',
}

function getTimeLeft() {
  const now = new Date()
  const end = new Date()
  end.setHours(23, 59, 59, 999)
  const diff = end - now
  if (diff <= 0) return '00:00:00'
  const h = String(Math.floor(diff / 3600000)).padStart(2, '0')
  const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0')
  const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0')
  return `${h}:${m}:${s}`
}

function daysLeft(purchaseDate, warrantyYears) {
  if (!purchaseDate || !warrantyYears) return null
  const expiry = new Date(purchaseDate)
  expiry.setFullYear(expiry.getFullYear() + parseInt(warrantyYears))
  return Math.ceil((expiry - new Date()) / (1000 * 60 * 60 * 24))
}

export default function DashboardWidgets() {
  const { user, bookings, devices } = useAuth()
  const [timer, setTimer] = useState(getTimeLeft())

  useEffect(() => {
    const iv = setInterval(() => setTimer(getTimeLeft()), 1000)
    return () => clearInterval(iv)
  }, [])

  const nextBooking = bookings?.find(b => b.status === 'upcoming') || MOCK_UPCOMING

  const expiringDevice = devices?.find(d => {
    const left = daysLeft(d.purchaseDate, d.warrantyYears)
    return left !== null && left <= 60 && left > 0
  })

  const [h, m, s] = timer.split(':')

  return (
    <div className="grid grid-cols-3 gap-3">

      {/* Card 1 — Upcoming booking */}
      <Link href={user ? '/my-bookings' : '/login'}
        className="bg-gradient-to-br from-sky to-navy rounded-2xl p-4 flex flex-col gap-1 hover:opacity-95 transition">
        <div className="text-xl mb-1">🔧</div>
        <div className="text-white font-bold text-sm leading-tight line-clamp-2">
          {user ? nextBooking.service : 'Book a service'}
        </div>
        <div className="text-white/70 text-xs mt-0.5">
          {user ? nextBooking.date : 'Schedule today'}
        </div>
        <div className="mt-auto pt-3 text-white/80 text-xs font-semibold">
          {user ? 'Track →' : 'Book →'}
        </div>
      </Link>

      {/* Card 2 — Flash sale */}
      <Link href="/all-services"
        className="bg-gradient-to-br from-orange-400 to-rose-500 rounded-2xl p-4 flex flex-col gap-1 hover:opacity-95 transition">
        <div className="text-xl mb-1">⚡</div>
        <div className="text-white font-bold text-sm leading-tight">Flash Sale</div>
        <div className="text-white/80 text-xs">Up to 40% off</div>
        <div className="mt-auto pt-2 flex items-center gap-1">
          {[h, m, s].map((v, i) => (
            <span key={i} className="flex items-center gap-0.5">
              <span className="bg-white/20 text-white font-bold text-[11px] px-1.5 py-0.5 rounded tabular-nums">{v}</span>
              {i < 2 && <span className="text-white/70 text-xs">:</span>}
            </span>
          ))}
        </div>
      </Link>

      {/* Card 3 — Devices / warranty */}
      {user && expiringDevice ? (
        <Link href="/my-devices"
          className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-4 flex flex-col gap-1 hover:opacity-95 transition">
          <div className="text-xl mb-1">⚠️</div>
          <div className="text-white font-bold text-sm leading-tight line-clamp-2">
            {expiringDevice.brand} {expiringDevice.model}
          </div>
          <div className="text-white/80 text-xs">
            Warranty in {daysLeft(expiringDevice.purchaseDate, expiringDevice.warrantyYears)}d
          </div>
          <div className="mt-auto pt-3 text-white/80 text-xs font-semibold">Protect →</div>
        </Link>
      ) : (
        <Link href={user ? '/my-devices' : '/login'}
          className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-4 flex flex-col gap-1 hover:opacity-95 transition">
          <div className="text-xl mb-1">📱</div>
          <div className="text-white font-bold text-sm leading-tight">My Devices</div>
          <div className="text-white/70 text-xs">
            {user && devices?.length > 0 ? `${devices.length} registered` : 'Track warranty'}
          </div>
          <div className="mt-auto pt-3 text-white/80 text-xs font-semibold">Manage →</div>
        </Link>
      )}
    </div>
  )
}
