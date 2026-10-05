'use client'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const ADDRESSES = [
  { id: 1, label: 'Home', line: '12, Sunset Residency, Lokhandwala Complex', city: 'Mumbai, Maharashtra 400053', default: true },
  { id: 2, label: 'Work', line: 'Reliance Corporate Park, Block D', city: 'Navi Mumbai, Maharashtra 400701', default: false },
]

export default function ProfilePage() {
  const { user, logout, hydrated } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [addresses, setAddresses] = useState(ADDRESSES)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (hydrated && !user) { router.push('/login'); return }
    if (user) setName(user.name)
  }, [mounted, user, router])

  if (!hydrated || !user) return null

  function handleLogout() {
    logout()
    router.push('/')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <h1 className="text-xl font-bold text-gray-900">My Profile</h1>

      {/* Avatar & basic info */}
      <div className="bg-white rounded-2xl shadow-card p-6 flex items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-navy flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          {editing ? (
            <input
              className="text-lg font-bold text-gray-900 border-b-2 border-sky outline-none w-full mb-1"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          ) : (
            <div className="text-lg font-bold text-gray-900">{user.name}</div>
          )}
          <div className="text-sm text-gray-500">{user.phone}</div>
          <div className="text-xs text-gray-400 mt-1">Member since Sep 2026</div>
        </div>
        <button
          onClick={() => setEditing(v => !v)}
          className="text-sky text-sm font-semibold"
        >
          {editing ? 'Save' : 'Edit'}
        </button>
      </div>

      {/* Saved addresses */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900">Saved addresses</h2>
          <button className="text-sky text-sm font-semibold">+ Add new</button>
        </div>
        <div className="space-y-3">
          {addresses.map(addr => (
            <div key={addr.id} className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 hover:border-sky/30 transition">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 font-bold ${addr.default ? 'bg-sky text-white' : 'bg-gray-100 text-gray-500'}`}>
                {addr.label === 'Home' ? '🏠' : '🏢'}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-800">{addr.label}</span>
                  {addr.default && <span className="text-xs bg-sky/10 text-sky px-2 py-0.5 rounded-full font-medium">Default</span>}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{addr.line}</div>
                <div className="text-xs text-gray-400">{addr.city}</div>
              </div>
              <button className="text-gray-400 hover:text-red-400 text-xs">Remove</button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="bg-white rounded-2xl shadow-card divide-y divide-gray-100">
        {[
          { icon: '📋', label: 'My Bookings', href: '/my-bookings' },
          { icon: '📱', label: 'My Devices', href: '/my-devices' },
          { icon: '🔔', label: 'Notifications', href: '/Notifications' },
          { icon: '🛒', label: 'Cart', href: '/CartDetails' },
          { icon: '📄', label: 'Terms of Service', href: '/terms' },
        ].map(item => (
          <a key={item.label} href={item.href}
            className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition">
            <span className="text-lg">{item.icon}</span>
            <span className="text-sm font-medium text-gray-800">{item.label}</span>
            <svg viewBox="0 0 24 24" className="w-4 h-4 ml-auto fill-current text-gray-400"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
          </a>
        ))}
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full py-4 rounded-2xl border-2 border-red-200 text-red-500 font-bold text-sm hover:bg-red-50 transition"
      >
        Logout
      </button>
    </div>
  )
}
