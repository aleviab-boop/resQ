'use client'
import { useState } from 'react'

const centers = [
  { name: 'resQ Navi Mumbai', addr: 'Reliance Corporate Park, Thane Belapur Rd, Navi Mumbai 400701', phone: '1800 267 0999', hours: 'Mon–Sat 9AM–7PM' },
  { name: 'resQ Andheri', addr: 'SEEPZ, Andheri East, Mumbai 400093', phone: '1800 267 0999', hours: 'Mon–Sat 9AM–7PM' },
  { name: 'resQ Thane', addr: 'Viviana Mall, Thane West 400601', phone: '1800 267 0999', hours: 'Mon–Sat 10AM–8PM' },
  { name: 'resQ Pune', addr: 'Phoenix Marketcity, Wakad, Pune 411057', phone: '1800 267 0999', hours: 'Mon–Sat 10AM–8PM' },
  { name: 'resQ Bangalore', addr: 'Forum Mall, Koramangala, Bangalore 560095', phone: '1800 267 0999', hours: 'Mon–Sat 10AM–8PM' },
  { name: 'resQ Delhi', addr: 'Select Citywalk, Saket, New Delhi 110017', phone: '1800 267 0999', hours: 'Mon–Sat 10AM–8PM' },
]

export default function Locate() {
  const [query, setQuery] = useState('')
  const filtered = centers.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.addr.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Locate a resQ center</h1>
      <p className="text-gray-500 text-sm mb-6">Find the nearest resQ service center to you</p>

      <input
        type="text"
        placeholder="Search by city or area…"
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="w-full max-w-md border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky mb-8"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {filtered.map(c => (
          <div key={c.name} className="bg-white rounded-card shadow-card p-5">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 bg-sky-light rounded-full flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="#3DA8DC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M12 2C8.1 2 5 5.1 5 9c0 5.3 7 13 7 13s7-7.7 7-13c0-3.9-3.1-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>
                </svg>
              </div>
              <div>
                <div className="font-bold text-gray-900">{c.name}</div>
                <div className="text-xs text-gray-500 mt-0.5">{c.addr}</div>
              </div>
            </div>
            <div className="flex flex-col gap-1 text-xs text-gray-600 pl-13">
              <div>📞 {c.phone}</div>
              <div>🕐 {c.hours}</div>
            </div>
            <button className="mt-4 w-full border border-navy text-navy rounded-xl py-2.5 text-sm font-semibold hover:bg-sky-light transition">
              Get directions
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-2 text-center py-12 text-gray-400">
            No centers found for "{query}". Try a different city.
          </div>
        )}
      </div>

      {/* Toll free */}
      <div className="mt-10 bg-gradient-to-r from-navy to-sky rounded-2xl p-6 text-white text-center">
        <div className="text-lg font-bold mb-1">Call us toll-free</div>
        <div className="text-3xl font-extrabold mb-2">1800 267 0999</div>
        <div className="text-white/70 text-sm">Available 9AM–9PM, Monday to Saturday</div>
      </div>
    </div>
  )
}
