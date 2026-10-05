'use client'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const DEFAULT_ADDRESSES = [
  { id: 1, label: 'Home', line: '12, Sunset Residency, Lokhandwala Complex', city: 'Mumbai, Maharashtra 400053', default: true },
  { id: 2, label: 'Work', line: 'Reliance Corporate Park, Block D', city: 'Navi Mumbai, Maharashtra 400701', default: false },
]

export default function ProfilePage() {
  const { user, logout, hydrated, updateUser } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [addresses, setAddresses] = useState(DEFAULT_ADDRESSES)
  const [editingName, setEditingName] = useState(false)
  const [name, setName] = useState('')
  const [savedFeedback, setSavedFeedback] = useState(false)
  const [showAddAddress, setShowAddAddress] = useState(false)
  const [newAddr, setNewAddr] = useState({ label: 'Home', line: '', city: '' })

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (hydrated && !user) { router.push('/login'); return }
    if (user) setName(user.name)
  }, [mounted, hydrated, user, router])

  if (!hydrated || !user) return null

  function handleLogout() {
    logout()
    router.push('/')
  }

  function saveName() {
    if (!name.trim()) return
    updateUser({ name: name.trim() })
    setEditingName(false)
    setSavedFeedback(true)
    setTimeout(() => setSavedFeedback(false), 2000)
  }

  function addAddress() {
    if (!newAddr.line || !newAddr.city) return
    setAddresses(prev => [...prev, { ...newAddr, id: Date.now(), default: false }])
    setNewAddr({ label: 'Home', line: '', city: '' })
    setShowAddAddress(false)
  }

  function removeAddress(id) {
    setAddresses(prev => prev.filter(a => a.id !== id))
  }

  function setDefault(id) {
    setAddresses(prev => prev.map(a => ({ ...a, default: a.id === id })))
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-xl font-bold text-gray-900">My Profile</h1>

      {savedFeedback && (
        <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-3 flex items-center gap-2 text-green-700 text-sm font-semibold">
          <span>✓</span> Profile updated!
        </div>
      )}

      {/* Avatar & basic info */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-navy flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
            {(name || user.name).charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            {editingName ? (
              <div className="flex items-center gap-2">
                <input
                  className="text-lg font-bold text-gray-900 border-b-2 border-sky outline-none flex-1 min-w-0 bg-transparent"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && saveName()}
                  autoFocus
                />
                <button onClick={saveName} className="text-sky text-sm font-bold flex-shrink-0 bg-sky/10 px-3 py-1 rounded-lg">Save</button>
                <button onClick={() => { setEditingName(false); setName(user.name) }} className="text-gray-400 text-sm flex-shrink-0">✕</button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="text-lg font-bold text-gray-900 truncate">{user.name}</div>
                <button onClick={() => setEditingName(true)} className="text-sky text-xs font-semibold flex-shrink-0 border border-sky/30 px-2 py-0.5 rounded-lg hover:bg-sky/5 transition">
                  Edit
                </button>
              </div>
            )}
            <div className="text-sm text-gray-500 mt-0.5">{user.phone}</div>
            <div className="text-xs text-gray-400 mt-1">Member since Sep 2026 · resQ Plus</div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mt-5 border-t border-gray-100 pt-5">
          {[['5', 'Bookings'], ['2', 'Devices'], ['1', 'Care Plan']].map(([val, label]) => (
            <div key={label} className="text-center">
              <div className="text-xl font-extrabold text-navy">{val}</div>
              <div className="text-xs text-gray-400 font-medium mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Saved addresses */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900">Saved addresses</h2>
          <button onClick={() => setShowAddAddress(v => !v)} className="text-sky text-sm font-semibold">
            {showAddAddress ? 'Cancel' : '+ Add new'}
          </button>
        </div>

        {showAddAddress && (
          <div className="mb-4 bg-gray-50 rounded-2xl p-4 space-y-3">
            <div className="flex gap-2">
              {['Home', 'Work', 'Other'].map(l => (
                <button key={l} onClick={() => setNewAddr(a => ({ ...a, label: l }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-2 transition ${newAddr.label === l ? 'border-sky bg-sky/5 text-sky' : 'border-gray-200 text-gray-600'}`}>
                  {l === 'Home' ? '🏠' : l === 'Work' ? '🏢' : '📍'} {l}
                </button>
              ))}
            </div>
            <input
              value={newAddr.line}
              onChange={e => setNewAddr(a => ({ ...a, line: e.target.value }))}
              placeholder="Street address, building name..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky"
            />
            <input
              value={newAddr.city}
              onChange={e => setNewAddr(a => ({ ...a, city: e.target.value }))}
              placeholder="City, State, PIN code"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky"
            />
            <button onClick={addAddress} disabled={!newAddr.line || !newAddr.city}
              className={`w-full py-3 rounded-xl font-bold text-sm transition ${newAddr.line && newAddr.city ? 'bg-sky text-white hover:bg-sky/90' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
              Save address
            </button>
          </div>
        )}

        <div className="space-y-3">
          {addresses.map(addr => (
            <div key={addr.id} className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 hover:border-sky/30 transition">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 font-bold ${addr.default ? 'bg-sky text-white' : 'bg-gray-100 text-gray-500'}`}>
                {addr.label === 'Home' ? '🏠' : addr.label === 'Work' ? '🏢' : '📍'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-gray-800">{addr.label}</span>
                  {addr.default && <span className="text-xs bg-sky/10 text-sky px-2 py-0.5 rounded-full font-medium">Default</span>}
                </div>
                <div className="text-xs text-gray-500 mt-0.5 truncate">{addr.line}</div>
                <div className="text-xs text-gray-400">{addr.city}</div>
                {!addr.default && (
                  <button onClick={() => setDefault(addr.id)} className="text-xs text-sky font-semibold mt-1 hover:underline">
                    Set as default
                  </button>
                )}
              </div>
              <button onClick={() => removeAddress(addr.id)} className="text-gray-300 hover:text-red-400 text-lg leading-none flex-shrink-0">×</button>
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
          { icon: '🛡️', label: 'Care Plan', href: '/care-plan' },
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
        🚪 Logout
      </button>
    </div>
  )
}
