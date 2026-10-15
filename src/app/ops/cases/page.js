'use client'
import { useState } from 'react'
import Link from 'next/link'
import OpsShell, { ActionBtn, StatCard } from '@/components/OpsShell'
import {
  CASES,
  CASE_STATUS_COLORS,
  getCustomer,
  getTechnician,
} from '@/lib/platformData'

// ─── type badge colors ───────────────────────────────────────────────────────

const TYPE_COLORS = {
  installation: 'bg-blue-100 text-blue-700',
  repair:       'bg-orange-100 text-orange-700',
  service:      'bg-teal-100 text-teal-700',
  maintenance:  'bg-violet-100 text-violet-700',
  recovery:     'bg-purple-100 text-purple-700',
}

const PRIORITY_DOT = {
  high:   'bg-red-500',
  medium: 'bg-amber-400',
  low:    'bg-gray-300',
}

// ─── helpers ────────────────────────────────────────────────────────────────

function relativeTime(dateStr) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  if (diffMins < 2) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 30) return `${diffDays}d ago`
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function SLABadge({ c }) {
  if (c.slaBreached) {
    return (
      <span className="inline-flex items-center gap-1 text-red-600 text-xs font-semibold whitespace-nowrap">
        <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
        Breached
      </span>
    )
  }
  if (['resolved', 'completed', 'closed'].includes(c.status)) {
    return (
      <span className="inline-flex items-center gap-1 text-green-600 text-xs font-semibold whitespace-nowrap">
        <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        On time
      </span>
    )
  }
  const deadline = new Date(c.slaDeadline)
  const now = new Date()
  const hoursLeft = Math.max(0, Math.round((deadline - now) / 3600000))
  const isClose = hoursLeft < 12
  return (
    <span className={`text-xs font-semibold whitespace-nowrap ${isClose ? 'text-amber-600' : 'text-green-600'}`}>
      {hoursLeft}h left
    </span>
  )
}

// ─── status tab config ───────────────────────────────────────────────────────

const STATUS_TABS = [
  { label: 'All',           value: 'all' },
  { label: 'Open',          value: 'open' },
  { label: 'In Progress',   value: 'in-progress' },
  { label: 'Parts Awaited', value: 'parts-awaited' },
  { label: 'Scheduled',     value: 'scheduled' },
  { label: 'Resolved',      value: 'resolved' },
]

// ─── component ───────────────────────────────────────────────────────────────

export default function CasesPage() {
  const [statusFilter,   setStatusFilter]   = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [search,         setSearch]         = useState('')

  // ── Stat counts ────────────────────────────────────────────────────────────
  const countOpen       = CASES.filter(c => c.status === 'open').length
  const countInProgress = CASES.filter(c => c.status === 'in-progress').length
  const countResolved   = CASES.filter(c => ['resolved', 'completed', 'closed'].includes(c.status)).length
  const countBreached   = CASES.filter(c => c.slaBreached).length

  // ── Filtered rows ──────────────────────────────────────────────────────────
  const filtered = CASES.filter(c => {
    if (statusFilter !== 'all') {
      // "Resolved" tab matches resolved/completed/closed
      if (statusFilter === 'resolved') {
        if (!['resolved', 'completed', 'closed'].includes(c.status)) return false
      } else {
        if (c.status !== statusFilter) return false
      }
    }
    if (priorityFilter !== 'all' && c.priority !== priorityFilter) return false
    if (search.trim()) {
      const q = search.toLowerCase().trim()
      const customer = getCustomer(c.customerId)
      const matchId   = c.id.toLowerCase().includes(q)
      const matchName = customer?.name?.toLowerCase().includes(q)
      if (!matchId && !matchName) return false
    }
    return true
  })

  return (
    <OpsShell
      title="Case Management"
      subtitle="Create, assign, track and escalate service cases"
      breadcrumb={[{ label: 'Cases' }]}
      actions={<ActionBtn href="/ops/cases/new" variant="primary">+ New case</ActionBtn>}
    >

      {/* ── Stats row ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard label="Open"        value={countOpen}       color="text-gray-900" />
        <StatCard label="In Progress" value={countInProgress} color="text-sky-600" />
        <StatCard label="Resolved"    value={countResolved}   color="text-green-600" />
        <StatCard label="SLA Breached" value={countBreached}  color="text-red-600" />
      </div>

      {/* ── Status tabs ─────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-4">
        {STATUS_TABS.map(tab => {
          const active = statusFilter === tab.value
          return (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                active
                  ? 'bg-[#13347b] text-white border-[#13347b] shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* ── Secondary filters ───────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">

        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by case ID or customer name…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 bg-white shadow-sm"
          />
        </div>

        {/* Priority filter */}
        <select
          value={priorityFilter}
          onChange={e => setPriorityFilter(e.target.value)}
          className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 bg-white shadow-sm text-gray-700"
        >
          <option value="all">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        {/* Clear filters */}
        {(statusFilter !== 'all' || priorityFilter !== 'all' || search.trim()) && (
          <button
            onClick={() => { setStatusFilter('all'); setPriorityFilter('all'); setSearch('') }}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors font-medium"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* ── Cases table ─────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-300">
            <svg className="w-10 h-10 mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div className="font-semibold text-sm text-gray-400">No cases match your filters</div>
            <button
              onClick={() => { setStatusFilter('all'); setPriorityFilter('all'); setSearch('') }}
              className="mt-2 text-xs text-[#00a1e1] hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px]">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Case ID', 'Customer', 'Type', 'Priority', 'Status', 'Technician', 'SLA', 'Updated', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(c => {
                  const customer = getCustomer(c.customerId)
                  const tech     = getTechnician(c.assignedTo)
                  return (
                    <tr
                      key={c.id}
                      onClick={() => window.location.href = `/ops/cases/${c.id}`}
                      className="hover:bg-gray-50 cursor-pointer transition-colors group"
                    >
                      {/* Case ID */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Link
                          href={`/ops/cases/${c.id}`}
                          onClick={e => e.stopPropagation()}
                          className="font-mono font-bold text-[#00a1e1] hover:text-[#13347b] text-xs transition-colors"
                        >
                          {c.id}
                        </Link>
                      </td>

                      {/* Customer */}
                      <td className="px-4 py-3">
                        <div className="font-semibold text-sm text-gray-800">{customer?.name ?? '—'}</div>
                        <div className="text-gray-400 text-[11px] mt-0.5">{customer?.phone}</div>
                      </td>

                      {/* Type badge */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${TYPE_COLORS[c.type] ?? 'bg-gray-100 text-gray-600'}`}>
                          {c.type}
                        </span>
                      </td>

                      {/* Priority dot */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${PRIORITY_DOT[c.priority] ?? 'bg-gray-300'}`}
                            title={c.priority}
                          />
                          <span className="text-xs text-gray-500 capitalize">{c.priority}</span>
                        </div>
                      </td>

                      {/* Status chip */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${CASE_STATUS_COLORS[c.status] ?? 'bg-gray-100 text-gray-500'}`}>
                          {c.status}
                        </span>
                      </td>

                      {/* Technician */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm text-gray-700">{tech?.name ?? '—'}</span>
                      </td>

                      {/* SLA */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <SLABadge c={c} />
                      </td>

                      {/* Updated */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm text-gray-400">{relativeTime(c.updatedAt)}</span>
                      </td>

                      {/* Arrow */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Link
                          href={`/ops/cases/${c.id}`}
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
          </div>
        )}

        {/* Footer count */}
        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
          Showing {filtered.length} of {CASES.length} cases
        </div>
      </div>
    </OpsShell>
  )
}
