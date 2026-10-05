'use client'
import { useState } from 'react'
import { lookupPincode } from '@/lib/pincodes'

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
  const [pincodeResult, setPincodeResult] = useState(null)
  const [pincodeError, setPincodeError] = useState('')

  const isPincode = /^\d{6}$/.test(query.trim())
  const filtered = isPincode ? [] : CITIES.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase())
  )

  function handleQueryChange(e) {
    const val = e.target.value
    setQuery(val)
    setPincodeResult(null)
    setPincodeError('')
    if (/^\d{6}$/.test(val.trim())) {
      const result = lookupPincode(val.trim())
      if (result) {
        setPincodeResult({
          name: result.area,
          addr: `${result.city}, ${result.state} – ${val.trim()}`,
        })
      } else {
        setPincodeError('Pincode not found. Try a different one.')
      }
    }
  }

  function selectCity(city) {
    setSelected({ name: city.name, addr: `${city.name}, ${city.addr}` })
    setOpen(false)
    setQuery('')
    // Clear pincode SLA when selecting by city name
    try { localStorage.removeItem('resq_pincode') } catch {}
  }

  function selectPincode() {
    if (!pincodeResult) return
    setSelected({ name: pincodeResult.name, addr: pincodeResult.addr })
    // Save pincode for SLA promise (FY26 Q1 roadmap feature)
    try { localStorage.setItem('resq_pincode', query.trim()) } catch {}
    setOpen(false)
    setQuery('')
    setPincodeResult(null)
  }

  return (
    <>
      <div
        className="bg-white border-b border-gray-100 px-4 py-2 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition"
        onClick={() => setOpen(true)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="#00a1e1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 flex-shrink-0">
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
          onClick={() => { setOpen(false); setQuery(''); setPincodeResult(null); setPincodeError('') }}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-6 pt-5 pb-3">
              <h3 className="font-bold text-lg text-gray-900">Select location</h3>
              <button
                onClick={() => { setOpen(false); setQuery(''); setPincodeResult(null); setPincodeError('') }}
                className="text-gray-400 hover:text-gray-700 text-2xl leading-none"
              >×</button>
            </div>

            <div className="px-6 pb-3">
              <input
                type="text"
                placeholder="Search city or enter 6-digit pincode…"
                value={query}
                onChange={handleQueryChange}
                autoFocus
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky"
              />
            </div>

            <div className="max-h-72 overflow-y-auto pb-4">

              {/* Pincode error */}
              {isPincode && pincodeError && (
                <div className="px-6 py-3 text-sm text-red-500">{pincodeError}</div>
              )}

              {/* Pincode result */}
              {pincodeResult && (
                <button
                  className="w-full text-left px-6 py-3 text-sm hover:bg-blue-50 transition"
                  onClick={selectPincode}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sky text-base">📍</span>
                    <div>
                      <div className="font-semibold text-gray-900">{pincodeResult.name}</div>
                      <div className="text-xs text-gray-400">{pincodeResult.addr}</div>
                    </div>
                  </div>
                </button>
              )}

              {/* City list */}
              {!isPincode && filtered.map(city => (
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

              {!isPincode && filtered.length === 0 && !query && CITIES.map(city => (
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

              {!isPincode && query && filtered.length === 0 && (
                <div className="px-6 py-4 text-sm text-gray-400">No results. Try a 6-digit pincode.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
