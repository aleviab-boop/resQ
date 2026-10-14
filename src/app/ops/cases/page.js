'use client'
import { useState } from 'react'
import Link from 'next/link'
import {
  CASES,
  CASE_STATUS_COLORS,
  CHANNEL_ICONS,
  getCustomer,
  getTechnician,
} from '@/lib/platformData'

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
      <span className="flex items-center gap-0.5 text-red-600 text-xs font-semibold whitespace-nowrap">
        ⚠️ Breached
      </span>
    )
  }
  if (['resolved', 'completed', 'closed'].includes(c.status)) {
    return <span className="text-green-500 text-xs font-semibold">✓ On time</span>
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

export default function CasesPage() {
  const [statusFilter, setStatusFilter]   = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [channelFilter, setChannelFilter]  = useState('all')
  const [search, setSearch]               = useState('')

  // Stat tiles — computed from CASES
  const totalOpen    = CASES.filter(c => !['resolved', 'completed', 'closed'].includes(c.status)).length
  const slaBreached  = CASES.filter(c => c.slaBreached).length
  const partsAwaited = CASES.filter(c => c.status === 'parts-awaited').length
  const todayStr     = new Date().toDateString()
  const resolvedToday = CASES.filter(c =>
    ['resolved', 'completed'].includes(c.status) &&
    new Date(c.updatedAt).toDateString() === todayStr
  ).length

  // Client-side filter
  const filtered = CASES.filter(c => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false
    if (priorityFilter !== 'all' && c.priority !== priorityFilter) return false
    if (channelFilter !== 'all' && c.channel !== channelFilter) return false
    if (search.trim()) {
      const q = search.toLowerCase().trim()
      const customer = getCustomer(c.customerId)
      const matchId   = c.id.toLowerCase().includes(q)
      const matchName = customer?.name?.toLowerCase().includes(q)
      if (!matchId && !matchName) return false
    }
    return true
  })

  const SELECT_CLS = 'text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-screen-xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
          <Link href="/ops" className="hover:text-[#00a1e1] transition">Ops Hub</Link>
          <span>›</span>
          <span className="text-gray-600 font-medium">Case Management</span>
        </div>

        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900">Case Management</h1>
          <p className="text-gray-400 text-sm mt-0.5">All open, in-progress, and resolved service cases</p>
        </div>

        {/* Stat tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Open',     value: totalOpen,     color: 'text-gray-900',   bg: 'bg-white',      border: 'border-gray-100' },
            { label: 'SLA Breached',   value: slaBreached,   color: 'text-red-600',    bg: 'bg-red-50',     border: 'border-red-100'  },
            { label: 'Parts Awaited',  value: partsAwaited,  color: 'text-amber-600',  bg: 'bg-amber-50',   border: 'border-amber-100'},
            { label: 'Resolved Today', value: resolvedToday, color: 'text-green-600',  bg: 'bg-green-50',   border: 'border-green-100'},
          ].map(tile => (
            <div key={tile.label} className={`${tile.bg} border ${tile.border} rounded-xl p-4 shadow-sm`}>
              <div className={`text-3xl font-extrabold ${tile.color}`}>{tile.value}</div>
              <div className="text-xs text-gray-500 mt-1 font-medium">{tile.label}</div>
            </div>
          ))}
        </div>

        {/* Filter row */}
        <div className="bg-white border border-gray-100 rounded-xl p-4 mb-4 shadow-sm flex flex-wrap gap-3 items-center">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className={SELECT_CLS}>
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="parts-awaited">Parts Awaited</option>
            <option value="scheduled">Scheduled</option>
            <option value="resolved">Resolved</option>
            <option value="completed">Completed</option>
            <option value="closed">Closed</option>
          </select>

          <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className={SELECT_CLS}>
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select value={channelFilter} onChange={e => setChannelFilter(e.target.value)} className={SELECT_CLS}>
            <option value="all">All Channels</option>
            <option value="whatsapp">💬 WhatsApp</option>
            <option value="phone">📞 Phone</option>
            <option value="email">📧 Email</option>
            <option value="app">📱 App</option>
            <option value="store">🏪 Store</option>
            <option value="internal">🔒 Internal</option>
          </select>

          <input
            type="text"
            placeholder="Search by case ID or customer name…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />

          <Link
            href="/ops/cases/new"
            className="ml-auto px-4 py-1.5 rounded-lg text-sm font-semibold text-white bg-[#00a1e1] hover:bg-sky-500 transition flex-shrink-0"
          >
            + New Case
          </Link>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-300">
              <svg className="w-10 h-10 mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div className="font-semibold text-sm text-gray-400">No cases match your filters</div>
              <button
                onClick={() => { setStatusFilter('all'); setPriorityFilter('all'); setChannelFilter('all'); setSearch('') }}
                className="mt-2 text-xs text-[#00a1e1] hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[960px]">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Case ID', 'Customer', 'Title', 'Type', 'Status', 'Pri', 'Channel', 'SLA', 'Technician', 'Updated', ''].map(h => (
                      <th key={h} className="text-left text-[10px] font-bold text-gray-400 px-4 py-3 uppercase tracking-widest whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c, i) => {
                    const customer = getCustomer(c.customerId)
                    const tech     = getTechnician(c.assignedTo)
                    return (
                      <tr
                        key={c.id}
                        onClick={() => window.location.href = `/ops/cases/${c.id}`}
                        className={`border-b border-gray-50 hover:bg-sky-50/40 cursor-pointer transition group ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/20'}`}
                      >
                        {/* Case ID */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <Link
                            href={`/ops/cases/${c.id}`}
                            onClick={e => e.stopPropagation()}
                            className="font-mono font-bold text-[#00a1e1] hover:underline text-xs"
                          >
                            {c.id}
                          </Link>
                        </td>

                        {/* Customer */}
                        <td className="px-4 py-3">
                          <div className="font-semibold text-gray-800 text-xs leading-tight">{customer?.name ?? '—'}</div>
                          <div className="text-gray-400 text-[10px] mt-0.5">{customer?.phone}</div>
                        </td>

                        {/* Title */}
                        <td className="px-4 py-3 max-w-[220px]">
                          <span className="text-gray-700 text-xs line-clamp-1 block leading-snug">{c.title}</span>
                        </td>

                        {/* Type */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${TYPE_COLORS[c.type] ?? 'bg-gray-100 text-gray-600'}`}>
                            {c.type}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${CASE_STATUS_COLORS[c.status] ?? 'bg-gray-100 text-gray-500'}`}>
                            {c.status}
                          </span>
                        </td>

                        {/* Priority dot */}
                        <td className="px-4 py-3">
                          <span
                            className={`w-2.5 h-2.5 rounded-full block mx-auto ${PRIORITY_DOT[c.priority] ?? 'bg-gray-300'}`}
                            title={c.priority}
                          />
                        </td>

                        {/* Channel */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <span>{CHANNEL_ICONS[c.channel]}</span>
                            <span className="capitalize">{c.channel}</span>
                          </span>
                        </td>

                        {/* SLA */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <SLABadge c={c} />
                        </td>

                        {/* Technician */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-xs text-gray-600">{tech?.name ?? '—'}</span>
                        </td>

                        {/* Updated */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-xs text-gray-400">{relativeTime(c.updatedAt)}</span>
                        </td>

                        {/* Action */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <Link
                            href={`/ops/cases/${c.id}`}
                            onClick={e => e.stopPropagation()}
                            className="text-xs font-semibold text-[#00a1e1] group-hover:underline"
                          >
                            Open →
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-3 text-xs text-gray-400 text-right">
          Showing {filtered.length} of {CASES.length} cases
        </div>
      </div>
    </div>
  )
}
