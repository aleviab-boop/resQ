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

function PhotoCard({ href, img, overlay, children }) {
  return (
    <Link href={href}
      className="rounded-2xl overflow-hidden relative flex flex-col min-h-[155px] hover:scale-[1.02] transition-transform duration-200"
      style={{ backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0" style={{ background: overlay }} />
      <div className="relative z-10 p-4 flex flex-col h-full min-h-[155px]">
        {children}
      </div>
    </Link>
  )
}

export default function DashboardWidgets() {
  const { user, bookings, devices } = useAuth()
  const [timer, setTimer] = useState(['--', '--', '--'])

  useEffect(() => {
    setTimer(getTimeLeft())
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

      {/* Card 1 — Booking */}
      <PhotoCard
        href={user ? '/my-bookings' : '/login'}
        img="/cards/booking.jpg"
        overlay="linear-gradient(160deg, rgba(14,80,150,0.72) 0%, rgba(10,20,60,0.85) 100%)">
        <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center text-lg flex-shrink-0">🔧</div>
        <div className="mt-3 flex-1">
          <div className="text-white font-bold text-sm leading-snug line-clamp-2">
            {user ? nextBooking.service : 'Book a service'}
          </div>
          <div className="text-white/65 text-[11px] mt-1">
            {user ? nextBooking.date : 'Schedule today'}
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-white/80 text-[11px] font-bold uppercase tracking-wide">{user ? 'Track' : 'Book'}</span>
          <span className="text-white/60">→</span>
        </div>
      </PhotoCard>

      {/* Card 2 — Flash sale */}
      <PhotoCard
        href="/all-services"
        img="/cards/flash.jpg"
        overlay="linear-gradient(160deg, rgba(180,20,20,0.75) 0%, rgba(80,0,0,0.90) 100%)">
        <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center text-lg flex-shrink-0">⚡</div>
        <div className="mt-3 flex-1">
          <div className="text-white font-bold text-sm">Flash Sale</div>
          <div className="text-white/65 text-[11px] mt-1">Up to 40% off today</div>
        </div>
        <div className="mt-3 flex items-center gap-1">
          {timer.map((v, i) => (
            <span key={i} className="flex items-center gap-0.5">
              <span className="bg-white/25 text-white font-bold text-xs px-1.5 py-1 rounded-md tabular-nums">{v}</span>
              {i < 2 && <span className="text-white/50 text-[10px] font-bold">:</span>}
            </span>
          ))}
        </div>
      </PhotoCard>

      {/* Card 3 — Devices / warranty */}
      {user && expiringDevice ? (
        <PhotoCard
          href="/care-plan"
          img="/cards/devices.jpg"
          overlay="linear-gradient(160deg, rgba(180,100,0,0.78) 0%, rgba(100,40,0,0.90) 100%)">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center text-lg flex-shrink-0">⚠️</div>
          <div className="mt-3 flex-1">
            <div className="text-white font-bold text-sm leading-snug line-clamp-2">
              {expiringDevice.brand} {expiringDevice.model}
            </div>
            <div className="text-white/65 text-[11px] mt-1">
              Warranty in {daysLeft(expiringDevice.purchaseDate, expiringDevice.warrantyYears)}d
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-white/80 text-[11px] font-bold uppercase tracking-wide">Protect</span>
            <span className="text-white/60">→</span>
          </div>
        </PhotoCard>
      ) : (
        <PhotoCard
          href={user ? '/my-devices' : '/login'}
          img="/cards/devices.jpg"
          overlay="linear-gradient(160deg, rgba(30,80,60,0.72) 0%, rgba(10,40,30,0.88) 100%)">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center text-lg flex-shrink-0">🏠</div>
          <div className="mt-3 flex-1">
            <div className="text-white font-bold text-sm">My Devices</div>
            <div className="text-white/65 text-[11px] mt-1">
              {user && devices?.length > 0
                ? `${devices.length} appliance${devices.length !== 1 ? 's' : ''} registered`
                : 'Track your appliances'}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-white/80 text-[11px] font-bold uppercase tracking-wide">Manage</span>
            <span className="text-white/60">→</span>
          </div>
        </PhotoCard>
      )}
    </div>
  )
}
