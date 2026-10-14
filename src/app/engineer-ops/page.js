'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { ENGINEER_POOL, AREA_LOAD, getCapacityStatus } from '@/lib/engineerLoad'

// Human-readable city names for pin prefixes
const AREA_NAMES = {
  '400': 'Mumbai',
  '110': 'Delhi',
  '122': 'Gurugram',
  '201': 'Noida',
  '560': 'Bangalore',
  '600': 'Chennai',
  '500': 'Hyderabad',
  '380': 'Ahmedabad',
  '411': 'Pune',
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    available: {
      dot: 'bg-emerald-500',
      pill: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
      label: 'Available',
    },
    'on-job': {
      dot: 'bg-amber-400',
      pill: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
      label: 'On job',
    },
    offline: {
      dot: 'bg-gray-300',
      pill: 'bg-gray-100 text-gray-500 ring-1 ring-gray-200',
      label: 'Offline',
    },
  }
  const s = map[status] || map.offline
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${s.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  )
}

// ─── Skills chips ─────────────────────────────────────────────────────────────
function SkillChips({ skills }) {
  const visible = skills.slice(0, 2)
  const extra = skills.length - 2
  return (
    <div className="flex flex-wrap gap-1">
      {visible.map((s) => (
        <span key={s} className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-xs font-medium">
          {s}
        </span>
      ))}
      {extra > 0 && (
        <span className="px-2 py-0.5 rounded-md bg-sky-light text-sky text-xs font-semibold">
          +{extra} more
        </span>
      )}
    </div>
  )
}

// ─── Area capacity card ───────────────────────────────────────────────────────
function AreaCard({ prefix, data }) {
  const pct = data.queued / data.capacity
  const pctClamped = Math.min(pct, 1)

  let barColor, badgeStyle, badgeLabel
  if (pct < 0.5) {
    barColor = 'bg-emerald-500'
    badgeStyle = 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
    badgeLabel = 'High availability'
  } else if (pct < 0.8) {
    barColor = 'bg-amber-400'
    badgeStyle = 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
    badgeLabel = 'Moderate load'
  } else {
    barColor = 'bg-red-500'
    badgeStyle = 'bg-red-50 text-red-700 ring-1 ring-red-200'
    badgeLabel = 'Near capacity'
  }

  const cityName = AREA_NAMES[prefix] || `PIN ${prefix}`

  return (
    <div className="bg-white rounded-2xl shadow-card p-5 flex flex-col gap-3 hover:shadow-card-hover transition-shadow duration-200">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-base font-bold text-gray-900">{cityName}</p>
          <p className="text-xs text-gray-400 font-mono mt-0.5">PIN {prefix}xxx</p>
        </div>
        <span className={`shrink-0 px-2 py-1 rounded-full text-xs font-semibold ${badgeStyle}`}>
          {badgeLabel}
        </span>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-gray-500 font-medium">Queue</span>
          <span className="text-xs font-bold text-gray-700">{data.queued} / {data.capacity} jobs</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${Math.round(pctClamped * 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1.5 text-right">
          {Math.round(pctClamped * 100)}% utilised
        </p>
      </div>

      <div className="flex items-center gap-3 pt-1 border-t border-gray-50">
        <div className="flex items-center gap-1.5">
          <span className="text-base">👷</span>
          <span className="text-xs text-gray-600 font-medium">{data.engineers} engineers</span>
        </div>
        <div className="w-px h-4 bg-gray-200" />
        <div className="flex items-center gap-1.5">
          <span className="text-base">⏱</span>
          <span className="text-xs text-gray-600 font-medium">avg {data.avgEta} min ETA</span>
        </div>
      </div>
    </div>
  )
}

// ─── Summary tile ─────────────────────────────────────────────────────────────
function SummaryTile({ label, value, dotColor, icon }) {
  return (
    <div className="bg-white rounded-2xl shadow-card p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${dotColor}`}>
        {icon}
      </div>
      <div>
        <p className="text-3xl font-extrabold text-gray-900 leading-none">{value}</p>
        <p className="text-sm text-gray-500 mt-1 font-medium">{label}</p>
      </div>
    </div>
  )
}

// ─── Star rating ──────────────────────────────────────────────────────────────
function StarRating({ value }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-500">
      ★ {value.toFixed(1)}
    </span>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function EngineerOpsPage() {
  const [timestamp, setTimestamp] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTimestamp(
        now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
      )
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  // Summary counts
  const total = ENGINEER_POOL.length
  const available = ENGINEER_POOL.filter((e) => e.status === 'available').length
  const onJob = ENGINEER_POOL.filter((e) => e.status === 'on-job').length
  const offline = ENGINEER_POOL.filter((e) => e.status === 'offline').length

  // Sort engineer roster: available → on-job → offline
  const sortedPool = useMemo(() => {
    const order = { available: 0, 'on-job': 1, offline: 2 }
    return [...ENGINEER_POOL].sort((a, b) => order[a.status] - order[b.status])
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Nav breadcrumb ── */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-sky transition-colors font-medium">resQ</Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">Engineer Ops</span>
          <span className="ml-auto inline-flex items-center gap-1.5 text-xs bg-navy text-white px-2.5 py-1 rounded-full font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">

        {/* ── Page header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Engineer Ops</h1>
            <p className="text-sm text-gray-500 mt-0.5">Live technician availability, area load &amp; job queue</p>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-xl shadow-card px-4 py-2.5 self-start sm:self-auto">
            <svg className="w-4 h-4 text-sky" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs text-gray-500 font-medium">Last updated:</span>
            <span className="text-xs font-bold text-gray-900 font-mono tabular-nums">{timestamp || '—'}</span>
          </div>
        </div>

        {/* ── Summary tiles ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryTile
            label="Total engineers"
            value={total}
            dotColor="bg-navy/10 text-navy"
            icon="👥"
          />
          <SummaryTile
            label="Available now"
            value={available}
            dotColor="bg-emerald-50 text-emerald-600"
            icon="✅"
          />
          <SummaryTile
            label="On job"
            value={onJob}
            dotColor="bg-amber-50 text-amber-500"
            icon="🔧"
          />
          <SummaryTile
            label="Offline"
            value={offline}
            dotColor="bg-gray-100 text-gray-400"
            icon="🔴"
          />
        </div>

        {/* ── Area capacity grid ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Area Capacity</h2>
              <p className="text-xs text-gray-400 mt-0.5">Job queue vs capacity by service zone</p>
            </div>
            <span className="text-xs text-gray-400 font-medium">{Object.keys(AREA_LOAD).length} zones</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {Object.entries(AREA_LOAD).map(([prefix, data]) => (
              <AreaCard key={prefix} prefix={prefix} data={data} />
            ))}
          </div>
        </section>

        {/* ── Engineer roster ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Engineer Roster</h2>
              <p className="text-xs text-gray-400 mt-0.5">All {total} engineers · sorted by availability</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Available</span>
              <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> On job</span>
              <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-300" /> Offline</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            {/* Table header */}
            <div className="hidden md:grid grid-cols-[1fr_1fr_120px_1fr_80px_1fr_80px] gap-4 px-6 py-3 border-b border-gray-100 bg-gray-50">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Name</span>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Area</span>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</span>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Active job</span>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">ETA</span>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Skills</span>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Rating</span>
            </div>

            {/* Table rows */}
            <div className="divide-y divide-gray-50">
              {sortedPool.map((eng, idx) => (
                <div
                  key={eng.id}
                  className={`grid grid-cols-1 md:grid-cols-[1fr_1fr_120px_1fr_80px_1fr_80px] gap-3 md:gap-4 px-6 py-4 hover:bg-gray-50/80 transition-colors duration-100 ${
                    eng.status === 'offline' ? 'opacity-60' : ''
                  }`}
                >
                  {/* Name + ID */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky to-navy flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {eng.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{eng.name}</p>
                      <p className="text-xs text-gray-400 font-mono">{eng.id} · {eng.jobs} jobs</p>
                    </div>
                  </div>

                  {/* Area */}
                  <div className="flex items-center">
                    <div>
                      <p className="text-sm text-gray-700 font-medium">{eng.area}</p>
                      <p className="text-xs text-gray-400">{AREA_NAMES[eng.pinPrefix] || eng.pinPrefix}</p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center">
                    <StatusBadge status={eng.status} />
                  </div>

                  {/* Active job */}
                  <div className="flex items-center">
                    {eng.activeJob ? (
                      <span className="text-sm text-gray-700 font-medium leading-tight">{eng.activeJob}</span>
                    ) : (
                      <span className="text-sm text-gray-300 font-medium">—</span>
                    )}
                  </div>

                  {/* ETA */}
                  <div className="flex items-center">
                    {eng.eta !== null ? (
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-amber-600">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {eng.eta}m
                      </span>
                    ) : (
                      <span className="text-sm text-gray-300">—</span>
                    )}
                  </div>

                  {/* Skills */}
                  <div className="flex items-center">
                    <SkillChips skills={eng.skills} />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center">
                    <StarRating value={eng.rating} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Footer note ── */}
        <div className="flex items-start gap-3 bg-sky-light border border-sky/20 rounded-xl px-5 py-4">
          <svg className="w-4 h-4 text-sky mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-sky/90 font-medium leading-relaxed">
            Data refreshes every 60 seconds in production. Currently showing simulated load.
          </p>
        </div>

      </div>
    </div>
  )
}
