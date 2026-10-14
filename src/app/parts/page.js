'use client'

import { useState, useMemo } from 'react'

const PARTS = [
  { id: 'P001', name: 'PCB Controller Board — Samsung AC',   appliance: 'Air Conditioner', sku: 'PCB-SAMS-AC-01', city: 'Mumbai',    stock: 8,  reorderAt: 5,  avgMonthlyDemand: 12, price: 2400, age: 18, condition: 'Good' },
  { id: 'P002', name: 'Compressor — LG 1.5T',                appliance: 'Air Conditioner', sku: 'CMP-LG-15T-01',  city: 'Mumbai',    stock: 2,  reorderAt: 3,  avgMonthlyDemand: 4,  price: 8500, age: 6,  condition: 'Good' },
  { id: 'P003', name: 'Evaporator Coil — Voltas Split',       appliance: 'Air Conditioner', sku: 'EVP-VLT-SP-01', city: 'Delhi',     stock: 5,  reorderAt: 3,  avgMonthlyDemand: 6,  price: 3200, age: 12, condition: 'Good' },
  { id: 'P004', name: 'Thermostat — Whirlpool Fridge',        appliance: 'Refrigerator',    sku: 'THR-WHP-RF-01', city: 'Mumbai',    stock: 15, reorderAt: 5,  avgMonthlyDemand: 8,  price: 450,  age: 4,  condition: 'Good' },
  { id: 'P005', name: 'Compressor — Godrej 310L',             appliance: 'Refrigerator',    sku: 'CMP-GDJ-31-01', city: 'Bangalore', stock: 1,  reorderAt: 2,  avgMonthlyDemand: 3,  price: 7200, age: 24, condition: 'Defective' },
  { id: 'P006', name: 'Door Gasket — Samsung Double Door',    appliance: 'Refrigerator',    sku: 'GSK-SMS-DD-01', city: 'Delhi',     stock: 22, reorderAt: 8,  avgMonthlyDemand: 10, price: 380,  age: 8,  condition: 'Good' },
  { id: 'P007', name: 'Drum — LG Front Load 7kg',             appliance: 'Washing Machine', sku: 'DRM-LG-FL-01',  city: 'Mumbai',    stock: 3,  reorderAt: 2,  avgMonthlyDemand: 5,  price: 4100, age: 10, condition: 'Good' },
  { id: 'P008', name: 'Motor — Bosch WM',                    appliance: 'Washing Machine', sku: 'MOT-BSH-WM-01', city: 'Bangalore', stock: 0,  reorderAt: 3,  avgMonthlyDemand: 4,  price: 5600, age: 0,  condition: 'Out of stock' },
  { id: 'P009', name: 'Heating Element — IFB 6kg',            appliance: 'Washing Machine', sku: 'HTE-IFB-06-01', city: 'Chennai',   stock: 7,  reorderAt: 4,  avgMonthlyDemand: 6,  price: 920,  age: 14, condition: 'Good' },
  { id: 'P010', name: 'LED Panel — Sony 55"',                 appliance: 'LED TV',          sku: 'PNL-SNY-55-01', city: 'Mumbai',    stock: 4,  reorderAt: 3,  avgMonthlyDemand: 5,  price: 6800, age: 20, condition: 'Good' },
  { id: 'P011', name: 'T-Con Board — Samsung 43"',            appliance: 'LED TV',          sku: 'TCN-SMS-43-01', city: 'Delhi',     stock: 9,  reorderAt: 4,  avgMonthlyDemand: 7,  price: 1800, age: 16, condition: 'Good' },
  { id: 'P012', name: 'Magnetron — LG Microwave',             appliance: 'Microwave',       sku: 'MGT-LG-MW-01',  city: 'Bangalore', stock: 6,  reorderAt: 3,  avgMonthlyDemand: 4,  price: 2100, age: 8,  condition: 'Good' },
  { id: 'P013', name: 'PCB Board — Whirlpool Microwave',      appliance: 'Microwave',       sku: 'PCB-WHP-MW-01', city: 'Chennai',   stock: 2,  reorderAt: 3,  avgMonthlyDemand: 3,  price: 1650, age: 30, condition: 'Aged' },
  { id: 'P014', name: 'Heating Element — V-Guard Geyser',     appliance: 'Geyser',          sku: 'HTE-VGD-GZ-01', city: 'Mumbai',    stock: 18, reorderAt: 6,  avgMonthlyDemand: 9,  price: 680,  age: 5,  condition: 'Good' },
  { id: 'P015', name: 'Thermostat — Racold 25L',              appliance: 'Geyser',          sku: 'THR-RCL-25-01', city: 'Hyderabad', stock: 11, reorderAt: 5,  avgMonthlyDemand: 7,  price: 420,  age: 7,  condition: 'Good' },
]

const CITIES = ['All', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad']
const APPLIANCES = ['All', 'Air Conditioner', 'Refrigerator', 'Washing Machine', 'LED TV', 'Microwave', 'Geyser']

function getStockStatus(part) {
  if (part.stock === 0)                     return { label: 'Out of Stock',  color: 'bg-red-100 text-red-700 font-bold' }
  if (part.condition === 'Defective')        return { label: 'Defective',     color: 'bg-orange-100 text-orange-700' }
  if (part.condition === 'Aged')             return { label: 'Aged',          color: 'bg-gray-100 text-gray-600' }
  if (part.stock <= part.reorderAt)          return { label: 'Reorder Now',   color: 'bg-red-100 text-red-600' }
  if (part.stock <= part.reorderAt * 1.5)   return { label: 'Low Stock',     color: 'bg-amber-100 text-amber-700' }
  return                                            { label: 'OK',            color: 'bg-emerald-100 text-emerald-700' }
}

function getStockColor(part) {
  if (part.stock === 0)                    return 'text-red-600'
  if (part.stock <= part.reorderAt)        return 'text-red-500'
  if (part.stock <= part.reorderAt * 1.5) return 'text-amber-600'
  return 'text-emerald-600'
}

function getBarColor(part) {
  if (part.stock === 0)                    return 'bg-red-400'
  if (part.stock <= part.reorderAt)        return 'bg-red-400'
  if (part.stock <= part.reorderAt * 1.5) return 'bg-amber-400'
  return 'bg-emerald-400'
}

function FilterPill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
        active
          ? 'text-white shadow-sm'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
      style={active ? { backgroundColor: '#13347b' } : {}}
    >
      {label}
    </button>
  )
}

function SummaryCard({ label, value, sub, valueClass }) {
  return (
    <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
      <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">{label}</p>
      <p className={`text-3xl font-bold ${valueClass ?? 'text-gray-800'}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

export default function PartsPage() {
  const [cityFilter, setCityFilter]      = useState('All')
  const [applianceFilter, setApplianceFilter] = useState('All')

  const filtered = useMemo(() => {
    return PARTS.filter(p => {
      const cityOk      = cityFilter === 'All' || p.city === cityFilter
      const applianceOk = applianceFilter === 'All' || p.appliance === applianceFilter
      return cityOk && applianceOk
    })
  }, [cityFilter, applianceFilter])

  // Summary counts (always from full dataset)
  const totalSKUs       = PARTS.length
  const belowReorder    = PARTS.filter(p => p.stock <= p.reorderAt && p.stock > 0).length
  const outOfStock      = PARTS.filter(p => p.stock === 0).length
  const defectiveAged   = PARTS.filter(p => p.condition !== 'Good' && p.condition !== 'Out of stock').length

  const alertCount = outOfStock + defectiveAged

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f4f6fb' }}>
      <div className="max-w-screen-xl mx-auto px-6 py-8">

        {/* ── Header ── */}
        <div className="mb-7">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🔧</span>
            <h1 className="text-2xl font-bold" style={{ color: '#13347b' }}>
              Spare Parts Inventory
            </h1>
          </div>
          <p className="text-sm text-gray-500 ml-9">
            Location-aware stock tracking · Demand-mapped alerts
          </p>
        </div>

        {/* ── Alert banner ── */}
        {alertCount > 0 && (
          <div className="mb-6 flex items-center gap-3 rounded-xl px-5 py-3.5 border border-red-200 bg-red-50">
            <span className="text-lg">⚠️</span>
            <p className="text-sm font-medium text-red-700">
              {alertCount} item{alertCount > 1 ? 's' : ''} need immediate attention —{' '}
              {outOfStock > 0 && <span>{outOfStock} out of stock</span>}
              {outOfStock > 0 && defectiveAged > 0 && <span>, </span>}
              {defectiveAged > 0 && <span>{defectiveAged} defective or aged</span>}
            </p>
          </div>
        )}

        {/* ── Summary cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-7">
          <SummaryCard
            label="Total SKUs"
            value={totalSKUs}
            sub="across all locations"
          />
          <SummaryCard
            label="Below Reorder Level"
            value={belowReorder}
            sub="need restocking soon"
            valueClass={belowReorder > 0 ? 'text-red-600' : 'text-gray-800'}
          />
          <SummaryCard
            label="Out of Stock"
            value={outOfStock}
            sub="zero units remaining"
            valueClass={outOfStock > 0 ? 'text-red-600' : 'text-gray-800'}
          />
          <SummaryCard
            label="Defective / Aged"
            value={defectiveAged}
            sub="condition flag raised"
            valueClass={defectiveAged > 0 ? 'text-amber-600' : 'text-gray-800'}
          />
        </div>

        {/* ── Filters ── */}
        <div className="bg-white rounded-2xl px-5 py-4 mb-5 flex flex-wrap gap-y-3 gap-x-6" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide mr-1">City</span>
            {CITIES.map(c => (
              <FilterPill
                key={c}
                label={c}
                active={cityFilter === c}
                onClick={() => setCityFilter(c)}
              />
            ))}
          </div>
          <div className="w-px bg-gray-200 hidden sm:block" />
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide mr-1">Appliance</span>
            {APPLIANCES.map(a => (
              <FilterPill
                key={a}
                label={a === 'Air Conditioner' ? 'AC' : a}
                active={applianceFilter === a}
                onClick={() => setApplianceFilter(a)}
              />
            ))}
          </div>
        </div>

        {/* ── Parts table ── */}
        <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: '#f8faff' }}>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">SKU</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">Part Name</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">Appliance</th>
                  <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">City</th>
                  <th className="text-center px-4 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">Stock</th>
                  <th className="text-center px-4 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">Reorder At</th>
                  <th className="text-center px-4 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">Mo. Demand</th>
                  <th className="text-center px-4 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">Age (mo)</th>
                  <th className="text-center px-4 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">Condition</th>
                  <th className="text-center px-4 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center py-12 text-gray-400 text-sm">
                      No parts match the selected filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((part, idx) => {
                    const status   = getStockStatus(part)
                    const barPct   = Math.min(100, (part.stock / (part.reorderAt * 2)) * 100)
                    const barColor = getBarColor(part)
                    const numColor = getStockColor(part)
                    return (
                      <tr
                        key={part.id}
                        className={`transition-colors hover:bg-sky-50/40 ${idx % 2 === 1 ? 'bg-gray-50/40' : ''}`}
                      >
                        {/* SKU */}
                        <td className="px-5 py-3.5">
                          <span className="font-mono text-xs text-gray-500 bg-gray-100 rounded px-2 py-0.5">
                            {part.sku}
                          </span>
                        </td>

                        {/* Part name */}
                        <td className="px-4 py-3.5 max-w-[220px]">
                          <p className="font-medium text-gray-800 text-xs leading-snug">{part.name}</p>
                        </td>

                        {/* Appliance */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="text-xs text-gray-600">{part.appliance}</span>
                        </td>

                        {/* City */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="text-xs font-medium text-gray-700">{part.city}</span>
                        </td>

                        {/* Stock level */}
                        <td className="px-4 py-3.5 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className={`text-lg font-bold leading-none ${numColor}`}>
                              {part.stock}
                            </span>
                            <div className="w-12 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${barColor}`}
                                style={{ width: `${barPct}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Reorder at */}
                        <td className="px-4 py-3.5 text-center">
                          <span className="text-sm text-gray-500">{part.reorderAt}</span>
                        </td>

                        {/* Monthly demand */}
                        <td className="px-4 py-3.5 text-center">
                          <div className="inline-flex items-center gap-1">
                            <span className="text-sm text-gray-700 font-medium">{part.avgMonthlyDemand}</span>
                            <span className="text-xs text-gray-400">/mo</span>
                          </div>
                        </td>

                        {/* Age */}
                        <td className="px-4 py-3.5 text-center">
                          <span className={`text-sm ${part.age >= 24 ? 'text-amber-600 font-medium' : 'text-gray-600'}`}>
                            {part.age}
                          </span>
                        </td>

                        {/* Condition */}
                        <td className="px-4 py-3.5 text-center">
                          <span
                            className={`text-xs font-medium ${
                              part.condition === 'Good'
                                ? 'text-emerald-600'
                                : part.condition === 'Defective'
                                ? 'text-orange-600'
                                : part.condition === 'Aged'
                                ? 'text-gray-500'
                                : 'text-red-600'
                            }`}
                          >
                            {part.condition}
                          </span>
                        </td>

                        {/* Status pill */}
                        <td className="px-4 py-3.5 text-center">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-xs whitespace-nowrap ${status.color}`}>
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table footer */}
          <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Showing {filtered.length} of {PARTS.length} parts
              {(cityFilter !== 'All' || applianceFilter !== 'All') && (
                <span>
                  {' '}· filtered by{' '}
                  {cityFilter !== 'All' && <strong>{cityFilter}</strong>}
                  {cityFilter !== 'All' && applianceFilter !== 'All' && ' + '}
                  {applianceFilter !== 'All' && <strong>{applianceFilter === 'Air Conditioner' ? 'AC' : applianceFilter}</strong>}
                </span>
              )}
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> OK
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Low
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> Critical
              </span>
            </div>
          </div>
        </div>

        {/* ── Price reference note ── */}
        <p className="text-xs text-gray-400 mt-4 text-right">
          Prices shown are unit costs in INR · Data as of Oct 2026
        </p>
      </div>
    </div>
  )
}
