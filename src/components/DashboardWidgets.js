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
  if (diff <= 0) return ['00', '00', '00']
  return [
    String(Math.floor(diff / 3600000)).padStart(2, '0'),
    String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0'),
    String(Math.floor((diff % 60000) / 1000)).padStart(2, '0'),
  ]
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

  return (
    <div className="grid grid-cols-3 gap-3">

      {/* Card 1 — Upcoming booking */}
      <Link href={user ? '/my-bookings' : '/login'}
        className="rounded-2xl p-4 flex flex-col min-h-[150px] hover:opacity-95 transition"
        style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #1e40af 100%)' }}>
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
          🔧
        </div>
        <div className="mt-3 flex-1">
          <div className="text-white font-bold text-sm leading-snug line-clamp-2">
            {user ? nextBooking.service : 'Book a service'}
          </div>
          <div className="text-white/65 text-[11px] mt-1 leading-tight">
            {user ? nextBooking.date : 'Schedule today'}
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-white/80 text-[11px] font-bold tracking-wide uppercase">
            {user ? 'Track' : 'Book'}
          </span>
          <span className="text-white/60 text-sm">→</span>
        </div>
      </Link>

      {/* Card 2 — Flash sale */}
      <Link href="/all-services"
        className="rounded-2xl p-4 flex flex-col min-h-[150px] hover:opacity-95 transition"
        style={{ background: 'linear-gradient(135deg, #f97316 0%, #e11d48 100%)' }}>
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
          ⚡
        </div>
        <div className="mt-3 flex-1">
          <div className="text-white font-bold text-sm leading-snug">Flash Sale</div>
          <div className="text-white/65 text-[11px] mt-1">Up to 40% off today</div>
        </div>
        <div className="mt-3 flex items-center gap-1">
          {timer.map((v, i) => (
            <span key={i} className="flex items-center gap-0.5">
              <span className="bg-white/25 text-white font-bold text-xs px-1.5 py-1 rounded-lg tabular-nums leading-none">{v}</span>
              {i < 2 && <span className="text-white/50 text-[10px] font-bold">:</span>}
            </span>
          ))}
        </div>
      </Link>

      {/* Card 3 — Devices / warranty */}
      {user && expiringDevice ? (
        <Link href="/care-plan"
          className="rounded-2xl p-4 flex flex-col min-h-[150px] hover:opacity-95 transition"
          style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
            ⚠️
          </div>
          <div className="mt-3 flex-1">
            <div className="text-white font-bold text-sm leading-snug line-clamp-2">
              {expiringDevice.brand} {expiringDevice.model}
            </div>
            <div className="text-white/65 text-[11px] mt-1 leading-tight">
              Warranty expires in {daysLeft(expiringDevice.purchaseDate, expiringDevice.warrantyYears)} days
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-white/80 text-[11px] font-bold tracking-wide uppercase">Protect</span>
            <span className="text-white/60 text-sm">→</span>
          </div>
        </Link>
      ) : (
        <Link href={user ? '/my-devices' : '/login'}
          className="rounded-2xl p-4 flex flex-col min-h-[150px] hover:opacity-95 transition"
          style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' }}>
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
            🏠
          </div>
          <div className="mt-3 flex-1">
            <div className="text-white font-bold text-sm leading-snug">My Devices</div>
            <div className="text-white/65 text-[11px] mt-1 leading-tight">
              {user && devices?.length > 0 ? `${devices.length} appliance${devices.length !== 1 ? 's' : ''} registered` : 'Track your appliances'}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-white/80 text-[11px] font-bold tracking-wide uppercase">Manage</span>
            <span className="text-white/60 text-sm">→</span>
          </div>
        </Link>
      )}
    </div>
  )
}
