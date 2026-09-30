'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { allServices, slugify } from '@/lib/data'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const router = useRouter()

  function handleChange(e) {
    const q = e.target.value
    setQuery(q)
    if (q.trim().length < 2) { setResults([]); return }
    const matches = allServices.filter(s =>
      s.name.toLowerCase().includes(q.toLowerCase())
    ).slice(0, 6)
    setResults(matches)
  }

  function handleSelect(service) {
    router.push(`/services/${slugify(service.name)}`)
    setQuery('')
    setResults([])
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="flex items-center bg-white border border-gray-200 rounded-xl shadow-sm px-4 py-3 gap-3 focus-within:border-sky transition">
        <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onBlur={() => setTimeout(() => setResults([]), 150)}
          placeholder="Search for a service (e.g. AC service, TV installation…)"
          className="flex-1 text-sm outline-none text-gray-800 placeholder-gray-400 bg-transparent"
        />
        {query && (
          <button onClick={() => { setQuery(''); setResults([]) }} className="text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
        )}
      </div>

      {results.length > 0 && (
        <ul className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden">
          {results.map(s => (
            <li key={s.name}>
              <button
                onMouseDown={() => handleSelect(s)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-sky/5 text-left transition"
              >
                <img src={s.img} alt={s.name} className="w-8 h-8 object-contain flex-shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-gray-800">{s.name}</div>
                  <div className="text-xs text-gray-400">{s.price}</div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
