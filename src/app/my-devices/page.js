'use client'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

const brands = ['Samsung', 'LG', 'Sony', 'Whirlpool', 'Voltas', 'Daikin', 'Haier', 'Godrej', 'Panasonic', 'Bosch']
const categories = ['Air Conditioner', 'Refrigerator', 'Washing Machine', 'LED TV', 'Water Purifier', 'Air Cooler', 'Laptop', 'Mobile', 'Microwave']

export default function MyDevices() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-6xl mb-5">📱</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your devices, all in one place</h2>
        <p className="text-gray-500 mb-8 max-w-sm">Sign in to add and manage your home appliances — get reminders, track service history, and book services faster.</p>
        <Link href="/login" className="bg-navy text-white font-bold px-8 py-4 rounded-xl hover:bg-navy-dark transition">
          Login to view devices
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My devices</h1>
        <button className="bg-navy text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-navy-dark transition">
          + Add device
        </button>
      </div>

      {/* Empty state */}
      <div className="bg-white rounded-2xl shadow-card p-12 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-sky-light rounded-full flex items-center justify-center text-4xl mb-5">📺</div>
        <h3 className="font-bold text-gray-900 text-lg mb-2">No devices added yet</h3>
        <p className="text-gray-500 text-sm mb-6 max-w-sm">Add your appliances to track warranties, get maintenance reminders, and book services with one tap.</p>

        <div className="w-full max-w-md text-left space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Device category</label>
            <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky">
              <option value="">Select category</option>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Brand</label>
            <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky">
              <option value="">Select brand</option>
              {brands.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Model (optional)</label>
            <input type="text" placeholder="e.g. 1.5 Ton 5 Star Split AC" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky" />
          </div>
          <button className="w-full bg-navy text-white font-bold py-3.5 rounded-xl hover:bg-navy-dark transition">
            Add device
          </button>
        </div>
      </div>
    </div>
  )
}
