'use client'
import { useState } from 'react'

const CITIES = [
  { name: 'Mumbai', addr: 'Maharashtra' },
  { name: 'Delhi', addr: 'New Delhi' },
  { name: 'Bangalore', addr: 'Karnataka' },
  { name: 'Hyderabad', addr: 'Telangana' },
  { name: 'Chennai', addr: 'Tamil Nadu' },
  { name: 'Kolkata', addr: 'West Bengal' },
  { name: 'Pune', addr: 'Maharashtra' },
  { name: 'Navi Mumbai', addr: 'Maharashtra' },
  { name: 'Ahmedabad', addr: 'Gujarat' },
  { name: 'Jaipur', addr: 'Rajasthan' },
]

export default function LocationBar() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState({ name: 'Reliance Corporate Park', addr: 'Navi Mumbai, Maharashtra, 400701' })

  const filtered = CITIES.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase())
  )

  function selectCity(city) {
    setSelected({ name: city.name, addr: `${city.name}, ${city.addr}` })
    setOpen(false)
    setQuery('')
  }

  return (
    <>
      <div
        className="bg-white border-b border-gray-100 px-4 py-2 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition"
        onClick={() => setOpen(true)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="#3DA8DC" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 flex-shrink-0">
          <path d="M12 2C8.1 2 5 5.1 5 9c0 5.3 7 13 7 13s7-7.7 7-13c0-3.9-3.1-7-7-7z"/>
          <circle cx="12" cy="9" r="2.5"/>
        </svg>
        <div>
          <div className="text-sm font-semibold text-gray-800">
            {selected.name} <span className="text-gray-400 text-xs">⌄</span>
          </div>
          <div className="text-xs text-gray-500">{selected.addr}</div>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => { setOpen(false); setQuery('') }}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-6 pt-5 pb-3">
              <h3 className="font-bold text-lg text-gray-900">Select location</h3>
              <button
                onClick={() => { setOpen(false); setQuery('') }}
                className="text-gray-400 hover:text-gray-700 text-2xl leading-none"
              >×</button>
            </div>

            <div className="px-6 pb-3">
              <input
                type="text"
                placeholder="Search city, area or pincode…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                autoFocus
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky"
              />
            </div>

            <div className="max-h-72 overflow-y-auto pb-4">
              {filtered.map(city => (
                <button
                  key={city.name}
                  className={`w-full text-left px-6 py-3 text-sm transition hover:bg-blue-50 ${
                    selected.name === city.name ? 'text-sky font-semibold bg-blue-50' : 'text-gray-700'
                  }`}
                  onClick={() => selectCity(city)}
                >
                  <div className="font-medium">{city.name}</div>
                  <div className="text-xs text-gray-400">{city.addr}</div>
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="px-6 py-4 text-sm text-gray-400">No results found</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
