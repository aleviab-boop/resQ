'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import OpsShell, { ActionBtn, StatCard } from '@/components/OpsShell'
import {
  CUSTOMERS,
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

function CarePlanDot({ active }) {
  if (active) {
    return (
      <span className="inline-flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
        <span className="text-xs text-green-700 font-semibold">Active</span>
      </span>
    )
  }
  return <span className="text-gray-300 text-xs">—</span>
}

// ─── summary stats ───────────────────────────────────────────────────────────

const total        = CUSTOMERS.length
const carePlan     = CUSTOMERS.filter(c => c.carePlan).length
const goldPlatinum = CUSTOMERS.filter(c => c.tier === 'Gold' || c.tier === 'Platinum').length
const atRisk       = CUSTOMERS.filter(c => c.tags.includes('at-risk')).length

// ─── filter chip config ──────────────────────────────────────────────────────

const TIER_CHIPS = ['All', 'Platinum', 'Gold', 'Silver', 'at-risk']

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

      let matchTier
      if (tierFilter === 'All')       matchTier = true
      else if (tierFilter === 'at-risk') matchTier = c.tags.includes('at-risk')
      else                               matchTier = c.tier === tierFilter

      const matchCity  = cityFilter   === 'All' || c.city === cityFilter
      const matchCare  = !carePlanOnly || c.carePlan

      return matchSearch && matchTier && matchCity && matchCare
    })
  }, [search, tierFilter, cityFilter, carePlanOnly])

  return (
    <OpsShell
      title="Customer 360"
      subtitle="Full customer timeline — orders, devices, cases, NPS"
      breadcrumb={[{ label: 'Customer 360' }]}
      actions={<ActionBtn href="/ops/cases/new" variant="primary">+ New case</ActionBtn>}
    >

      {/* ── Stats row ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Customers" value={total} />
        <StatCard label="Care Plan"       value={carePlan}     color="text-sky-600" />
        <StatCard label="Gold / Platinum" value={goldPlatinum} color="text-amber-600" />
        <StatCard label="At-Risk"         value={atRisk}       color="text-red-600" />
      </div>

      {/* ── Search + filters ────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">

        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search name or phone…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 bg-white shadow-sm"
          />
        </div>

        {/* City filter */}
        <select
          value={cityFilter}
          onChange={e => setCityFilter(e.target.value)}
          className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 bg-white shadow-sm text-gray-700"
        >
          {cities.map(c => <option key={c}>{c}</option>)}
        </select>

        {/* Care Plan toggle */}
        <label className="flex items-center gap-2 cursor-pointer select-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
          <input
            type="checkbox"
            checked={carePlanOnly}
            onChange={e => setCarePlanOnly(e.target.checked)}
            className="w-4 h-4 rounded accent-sky-500"
          />
          <span className="text-sm text-gray-700 font-medium">Care Plan only</span>
        </label>
      </div>

      {/* ── Tier filter chips ────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-5">
        {TIER_CHIPS.map(chip => {
          const active = tierFilter === chip
          return (
            <button
              key={chip}
              onClick={() => setTierFilter(chip)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                active
                  ? 'bg-[#13347b] text-white border-[#13347b] shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {chip === 'at-risk' ? 'At-Risk' : chip}
            </button>
          )
        })}
      </div>

      {/* ── Table ────────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-gray-100">
              {['Customer', 'Tier', 'City', 'Member Since', 'Total Spend', 'Care Plan', 'NPS', 'Devices', 'Open Cases', ''].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-16 text-center text-gray-400 text-sm">
                  No customers match your filters.
                </td>
              </tr>
            )}
            {filtered.map(c => {
              const initials   = c.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
              const devices    = getProductsForCustomer(c.id)
              const allCases   = getCasesForCustomer(c.id)
              const openCases  = allCases.filter(cs =>
                ['open', 'in-progress', 'parts-awaited', 'scheduled'].includes(cs.status)
              )

              return (
                <tr
                  key={c.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer group"
                  onClick={() => window.location.href = `/ops/customers/${c.id}`}
                >
                  {/* Customer identity */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#13347b] to-[#00a1e1] flex items-center justify-center flex-shrink-0">
                        <span className="text-[11px] font-bold text-white">{initials}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-gray-900 group-hover:text-[#13347b] transition-colors">{c.name}</div>
                        <div className="text-gray-500 text-xs mt-0.5">{c.phone}</div>
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mt-1">
                          {c.tags.map(tag => (
                            <span
                              key={tag}
                              className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                                tag === 'at-risk'
                                  ? 'bg-red-100 text-red-600'
                                  : tag === 'high-value'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-gray-100 text-gray-500'
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Tier */}
                  <td className="px-4 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${TIER_STYLES[c.tier] || 'bg-gray-100 text-gray-600'}`}>
                      {c.tier}
                    </span>
                  </td>

                  {/* City */}
                  <td className="px-4 py-4 text-sm text-gray-700">
                    <div>{c.city}</div>
                    <div className="text-gray-400 text-xs">{c.pincode}</div>
                  </td>

                  {/* Member Since */}
                  <td className="px-4 py-4 text-sm text-gray-700 whitespace-nowrap">
                    {formatDate(c.since)}
                  </td>

                  {/* Total Spend */}
                  <td className="px-4 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">
                    {formatRupees(c.totalSpend)}
                  </td>

                  {/* Care Plan */}
                  <td className="px-4 py-4">
                    <CarePlanDot active={c.carePlan} />
                  </td>

                  {/* NPS */}
                  <td className="px-4 py-4">
                    <NpsChip score={c.nps} />
                  </td>

                  {/* Devices */}
                  <td className="px-4 py-4 text-center text-sm text-gray-700 font-medium">
                    {devices.length}
                  </td>

                  {/* Open Cases */}
                  <td className="px-4 py-4 text-center">
                    {openCases.length > 0
                      ? <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-bold">
                          {openCases.length}
                        </span>
                      : <span className="text-gray-400 text-xs">0</span>
                    }
                  </td>

                  {/* Arrow */}
                  <td className="px-4 py-4">
                    <Link
                      href={`/ops/customers/${c.id}`}
                      onClick={e => e.stopPropagation()}
                      className="inline-flex items-center text-[#00a1e1] hover:text-[#13347b] transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
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
    </OpsShell>
  )
}
