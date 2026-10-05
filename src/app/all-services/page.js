'use client'
import ServiceCard from '@/components/ServiceCard'
import { allAppliances, maintenanceServices, installationServices } from '@/lib/data'
import { useState } from 'react'

const APPLIANCE_KEYWORDS = {
  'Air Conditioner': ['ac', 'split ac', 'window ac', 'air conditioner'],
  'Air Cooler': ['air cooler', 'cooler'],
  'Washing Machine': ['washing machine', 'wm', 'front load', 'top load'],
  'Refrigerator': ['refrigerator', 'fridge', 'double door', 'side by side'],
  'LED TV': ['tv', 'led tv', 'television'],
  'Water Purifier': ['water purifier', 'purifier', 'ro'],
}

function matchesAppliance(service, appliance) {
  const keywords = APPLIANCE_KEYWORDS[appliance]
  if (!keywords) return false
  const name = service.name.toLowerCase()
  return keywords.some(k => name.includes(k))
}

export default function AllServices() {
  const [activeAppliance, setActiveAppliance] = useState(null)
  const [search, setSearch] = useState('')

  const allMaintenance = maintenanceServices
  const allInstallation = installationServices

  const q = search.trim().toLowerCase()

  const filteredMaintenance = allMaintenance.filter(s => {
    const matchesSearch = !q || s.name.toLowerCase().includes(q)
    const matchesFilter = !activeAppliance || matchesAppliance(s, activeAppliance)
    return matchesSearch && matchesFilter
  })

  const filteredInstallation = allInstallation.filter(s => {
    const matchesSearch = !q || s.name.toLowerCase().includes(q)
    const matchesFilter = !activeAppliance || matchesAppliance(s, activeAppliance)
    return matchesSearch && matchesFilter
  })

  function handleAppliance(name) {
    setActiveAppliance(prev => prev === name ? null : name)
    setTimeout(() => {
      document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">

      {/* Search bar */}
      <div className="relative">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
        </svg>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search services (e.g. AC jet, fridge cleaning...)"
          className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-sky outline-none text-sm bg-white shadow-sm"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">✕</button>
        )}
      </div>

      {/* All appliances grid */}
      <section>
        <h1 className="text-xl font-bold text-gray-900 mb-2">All appliances</h1>
        <p className="text-sm text-gray-400 mb-5">Tap an appliance to filter services</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {allAppliances.map((a) => (
            <button
              key={a.name}
              onClick={() => handleAppliance(a.name)}
              className={`rounded-card shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 flex flex-col items-center p-3 gap-2 cursor-pointer border-2 ${
                activeAppliance === a.name
                  ? 'border-sky bg-sky/5 shadow-card-hover -translate-y-1'
                  : 'border-transparent bg-white'
              }`}
            >
              <div style={{width:64,height:64,display:'flex',alignItems:'center',justifyContent:'center'}}>
                <img src={a.img} alt={a.name} style={{maxWidth:60,maxHeight:60,objectFit:'contain'}} loading="lazy" />
              </div>
              <span className={`text-xs font-semibold text-center leading-tight ${
                activeAppliance === a.name ? 'text-sky' : 'text-gray-700'
              }`}>{a.name}</span>
            </button>
          ))}
        </div>
        {activeAppliance && (
          <div className="mt-4 flex items-center gap-3">
            <span className="text-sm text-gray-600">Showing services for <b className="text-navy">{activeAppliance}</b></span>
            <button
              onClick={() => setActiveAppliance(null)}
              className="text-xs text-sky font-semibold border border-sky/30 px-3 py-1 rounded-full hover:bg-sky/5 transition"
            >
              Clear filter ×
            </button>
          </div>
        )}
      </section>

      {/* Services sections */}
      <div id="services-section" className="space-y-12">

        {/* Maintenance */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Maintenance services</h2>
          {filteredMaintenance.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredMaintenance.map(s => <ServiceCard key={s.name} service={s} />)}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl py-10 text-center text-gray-400">
              <div className="text-3xl mb-2">🔍</div>
              <div className="text-sm">No maintenance services found for {activeAppliance}</div>
            </div>
          )}
        </section>

        {/* Installation */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Installation services</h2>
          {filteredInstallation.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredInstallation.map(s => <ServiceCard key={s.name} service={s} />)}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl py-10 text-center text-gray-400">
              <div className="text-3xl mb-2">🔍</div>
              <div className="text-sm">No installation services found for {activeAppliance}</div>
            </div>
          )}
        </section>

      </div>
    </div>
  )
}
