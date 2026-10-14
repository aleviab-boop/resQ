'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  CUSTOMERS,
  PRODUCTS,
  CASES,
  getProductsForCustomer,
  getCasesForCustomer,
} from '@/lib/platformData'

// ─── helpers ────────────────────────────────────────────────────────────────

function formatRupees(n) {
  return '₹' + n.toLocaleString('en-IN')
}

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

const TIER_STYLES = {
  Platinum: 'bg-purple-100 text-purple-700 border border-purple-300',
  Gold:     'bg-amber-100  text-amber-700  border border-amber-300',
  Silver:   'bg-gray-100   text-gray-600   border border-gray-300',
  Bronze:   'bg-orange-100 text-orange-700 border border-orange-300',
}

function NpsChip({ score }) {
  if (score === null || score === undefined)
    return <span className="text-gray-400 text-sm">—</span>
  const color =
    score >= 8 ? 'bg-green-100 text-green-700' :
    score >= 6 ? 'bg-amber-100 text-amber-700' :
                 'bg-red-100   text-red-700'
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${color}`}>
      {score}
    </span>
  )
}

// ─── summary tiles ───────────────────────────────────────────────────────────

const total        = CUSTOMERS.length
const carePlan     = CUSTOMERS.filter(c => c.carePlan).length
const goldPlatinum = CUSTOMERS.filter(c => c.tier === 'Gold' || c.tier === 'Platinum').length
const atRisk       = CUSTOMERS.filter(c => c.tags.includes('at-risk')).length

const SUMMARY_TILES = [
  { label: 'Total Customers', value: total,        color: 'text-navy' },
  { label: 'Care Plan',       value: carePlan,      color: 'text-sky' },
  { label: 'Gold / Platinum', value: goldPlatinum,  color: 'text-amber-600' },
  { label: 'At-Risk',         value: atRisk,        color: 'text-red-600' },
]

// ─── component ───────────────────────────────────────────────────────────────

export default function CustomersPage() {
  const [search,       setSearch]       = useState('')
  const [tierFilter,   setTierFilter]   = useState('All')
  const [cityFilter,   setCityFilter]   = useState('All')
  const [carePlanOnly, setCarePlanOnly] = useState(false)

  const cities = useMemo(() => {
    const unique = [...new Set(CUSTOMERS.map(c => c.city))].sort()
    return ['All', ...unique]
  }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return CUSTOMERS.filter(c => {
      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.phone.replace(/\s/g, '').includes(q.replace(/\s/g, ''))

      const matchTier  = tierFilter   === 'All' || c.tier === tierFilter
      const matchCity  = cityFilter   === 'All' || c.city === cityFilter
      const matchCare  = !carePlanOnly || c.carePlan

      return matchSearch && matchTier && matchCity && matchCare
    })
  }, [search, tierFilter, cityFilter, carePlanOnly])

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900">Customers</h1>
        <p className="text-gray-400 mt-1 text-sm">Customer 360 directory</p>
      </div>

      {/* ── Summary tiles ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {SUMMARY_TILES.map(t => (
          <div key={t.label} className="bg-white rounded-2xl shadow-card p-5 flex flex-col gap-1">
            <div className={`text-3xl font-extrabold ${t.color}`}>{t.value}</div>
            <div className="text-gray-500 text-xs font-medium">{t.label}</div>
          </div>
        ))}
      </div>

      {/* ── Filter row ─────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search name or phone…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky/30 bg-white"
          />
        </div>

        {/* Tier filter */}
        <select
          value={tierFilter}
          onChange={e => setTierFilter(e.target.value)}
          className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky/30 bg-white"
        >
          {['All','Bronze','Silver','Gold','Platinum'].map(t => (
            <option key={t}>{t}</option>
          ))}
        </select>

        {/* City filter */}
        <select
          value={cityFilter}
          onChange={e => setCityFilter(e.target.value)}
          className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky/30 bg-white"
        >
          {cities.map(c => <option key={c}>{c}</option>)}
        </select>

        {/* Care Plan toggle */}
        <label className="flex items-center gap-2 cursor-pointer select-none bg-white border border-gray-200 rounded-xl px-4 py-2.5">
          <input
            type="checkbox"
            checked={carePlanOnly}
            onChange={e => setCarePlanOnly(e.target.checked)}
            className="accent-sky w-4 h-4"
          />
          <span className="text-sm text-gray-700 font-medium">Care Plan only</span>
        </label>
      </div>

      {/* ── Table ──────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-left">
              {['Customer', 'Tier', 'City', 'Member Since', 'Total Spend', 'Care Plan', 'NPS', 'Devices', 'Open Cases', ''].map(h => (
                <th key={h} className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-12 text-center text-gray-400">
                  No customers match your filters.
                </td>
              </tr>
            )}
            {filtered.map(c => {
              const devices   = getProductsForCustomer(c.id)
              const allCases  = getCasesForCustomer(c.id)
              const openCases = allCases.filter(cs =>
                ['open', 'in-progress', 'parts-awaited', 'scheduled'].includes(cs.status)
              )

              return (
                <tr
                  key={c.id}
                  className="hover:bg-sky-light/40 transition-colors cursor-pointer group"
                  onClick={() => window.location.href = `/ops/customers/${c.id}`}
                >
                  {/* Customer identity */}
                  <td className="px-4 py-4">
                    <div className="font-semibold text-gray-900 group-hover:text-navy">{c.name}</div>
                    <div className="text-gray-500 text-xs mt-0.5">{c.phone}</div>
                    <div className="text-gray-400 text-xs">{c.email}</div>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {c.tags.map(tag => (
                        <span
                          key={tag}
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium
                            ${tag === 'at-risk'
                              ? 'bg-red-100 text-red-600'
                              : tag === 'high-value'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-gray-100 text-gray-500'}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Tier */}
                  <td className="px-4 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${TIER_STYLES[c.tier] || 'bg-gray-100 text-gray-600'}`}>
                      {c.tier}
                    </span>
                  </td>

                  {/* City + Pincode */}
                  <td className="px-4 py-4">
                    <div className="text-gray-800">{c.city}</div>
                    <div className="text-gray-400 text-xs">{c.pincode}</div>
                  </td>

                  {/* Member Since */}
                  <td className="px-4 py-4 text-gray-600 whitespace-nowrap">
                    {formatDate(c.since)}
                  </td>

                  {/* Total Spend */}
                  <td className="px-4 py-4 font-semibold text-gray-900 whitespace-nowrap">
                    {formatRupees(c.totalSpend)}
                  </td>

                  {/* Care Plan */}
                  <td className="px-4 py-4">
                    {c.carePlan
                      ? <span className="text-green-600 font-bold text-base">✓</span>
                      : <span className="text-gray-300 font-bold text-base">—</span>}
                  </td>

                  {/* NPS */}
                  <td className="px-4 py-4">
                    <NpsChip score={c.nps} />
                  </td>

                  {/* Devices */}
                  <td className="px-4 py-4 text-center text-gray-700 font-medium">
                    {devices.length}
                  </td>

                  {/* Open Cases */}
                  <td className="px-4 py-4 text-center">
                    {openCases.length > 0
                      ? <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-bold">
                          {openCases.length}
                        </span>
                      : <span className="text-gray-400 text-xs">0</span>}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4">
                    <Link
                      href={`/ops/customers/${c.id}`}
                      onClick={e => e.stopPropagation()}
                      className="text-sky hover:text-navy font-semibold text-sm whitespace-nowrap"
                    >
                      View 360 →
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {/* Footer count */}
        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
          Showing {filtered.length} of {CUSTOMERS.length} customers
        </div>
      </div>
    </div>
  )
}
