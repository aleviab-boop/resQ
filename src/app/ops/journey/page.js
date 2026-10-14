'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  CASES, JOBS, CONVERSATIONS,
  getCustomer, getTechnician,
  CHANNEL_ICONS,
} from '@/lib/platformData'

const STEPS = [
  { num: 1, name: 'Request received',      desc: 'Case created, customer contacted' },
  { num: 2, name: 'Centre assigned',       desc: 'Service centre selected, SLA started' },
  { num: 3, name: 'Promise committed',     desc: 'Slot booked, technician identified' },
  { num: 4, name: 'Customer updated',      desc: 'WhatsApp sent, confirmation received' },
  { num: 5, name: 'Technician dispatched', desc: 'Job started, en route' },
  { num: 6, name: 'Completion + feedback', desc: 'Visit done, NPS collected' },
]

const TYPE_FILTERS = ['All', 'Repair', 'Installation', 'Service', 'Recovery']

function deriveStep(kase, jobs, conv) {
  if (kase.status === 'resolved' || kase.status === 'completed') return 6
  if (jobs.some(j => j.status === 'in-progress')) return 5
  if (conv?.messages?.some(m => m.from === 'agent')) return 4
  if (jobs.some(j => j.status === 'scheduled')) return 3
  if (kase.centerId && kase.assignedTo) return 2
  return 1
}

function getSlaInfo(kase) {
  if (kase.slaBreached) return { label: '⚠️ Breached', cls: 'text-red-600 bg-red-50 border-red-200' }
  if (!kase.slaDeadline) return null
  const diff = new Date(kase.slaDeadline) - new Date()
  if (diff <= 0) return { label: '⚠️ Breached', cls: 'text-red-600 bg-red-50 border-red-200' }
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  if (h < 4)  return { label: `${h}h ${m}m left`, cls: 'text-red-600 bg-red-50 border-red-200' }
  if (h < 24) return { label: `${h}h left`,       cls: 'text-amber-600 bg-amber-50 border-amber-200' }
  return        { label: `${h}h left`,             cls: 'text-green-600 bg-green-50 border-green-200' }
}

function relTime(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 2) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d === 1) return 'yesterday'
  if (d < 7) return `${d}d ago`
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

const TYPE_BADGE = {
  installation: 'bg-purple-50 text-purple-700 border-purple-200',
  repair:       'bg-orange-50 text-orange-700 border-orange-200',
  service:      'bg-blue-50 text-blue-700 border-blue-200',
  maintenance:  'bg-teal-50 text-teal-700 border-teal-200',
  recovery:     'bg-pink-50 text-pink-700 border-pink-200',
}

export default function JourneyConsolePage() {
  const [typeFilter, setTypeFilter]   = useState('All')
  const [stepOverrides, setStepOverrides] = useState({})

  // Build enriched case data with computed step
  const caseStepData = useMemo(() => {
    return CASES.map(kase => {
      const jobs = JOBS.filter(j => j.caseId === kase.id)
      const conv = CONVERSATIONS.find(c => c.caseId === kase.id)
      const derived = deriveStep(kase, jobs, conv)
      const step = stepOverrides[kase.id] ?? derived
      const tech = getTechnician(kase.assignedTo)
      const cust = getCustomer(kase.customerId)
      const sla  = getSlaInfo(kase)
      return { kase, step, tech, cust, sla }
    })
  }, [stepOverrides])

  // Apply type filter
  const filteredCaseData = useMemo(() => {
    if (typeFilter === 'All') return caseStepData
    return caseStepData.filter(({ kase }) =>
      kase.type.toLowerCase() === typeFilter.toLowerCase()
    )
  }, [caseStepData, typeFilter])

  // Count per step (filtered)
  const stepCounts = useMemo(() => {
    const c = {}
    filteredCaseData.forEach(({ step }) => { c[step] = (c[step] || 0) + 1 })
    return c
  }, [filteredCaseData])

  // Activity feed — derive from real CASES + JOBS data, sorted by most recent
  const activityFeed = useMemo(() => {
    const events = []

    CASES.forEach(c => {
      const cust = getCustomer(c.customerId)
      let icon = '📬'
      let text = ''
      if (c.status === 'resolved' || c.status === 'completed') {
        icon = '✅'
        text = `${c.id} ${c.status} — ${cust?.name}: ${c.title.slice(0, 48)}`
      } else if (c.status === 'parts-awaited') {
        icon = '📦'
        text = `${c.id} parts awaited — Part ordered for ${cust?.name}`
      } else if (c.status === 'open') {
        icon = '📬'
        text = `${c.id} opened — ${cust?.name} contacted via ${c.channel}`
      } else {
        icon = '🔧'
        text = `${c.id} ${c.status.replace(/-/g, ' ')} — ${cust?.name}`
      }
      events.push({ icon, text, time: c.updatedAt || c.createdAt, id: 'case-' + c.id })
    })

    JOBS.forEach(j => {
      const tech = getTechnician(j.technicianId)
      const visit = j.visits?.[0]
      if (j.status === 'in-progress' && visit) {
        events.push({
          icon: '🔧',
          text: `${j.id} started — ${tech?.name} arrived at ${j.city} ${visit.arrivedAt}`,
          time: j.scheduledDate + 'T' + visit.arrivedAt + ':00',
          id:   'job-prog-' + j.id,
        })
      } else if (j.status === 'completed' && visit) {
        events.push({
          icon: '✅',
          text: `${j.id} completed — ${tech?.name}: ${(visit.diagnosis || 'visit done').slice(0, 50)}`,
          time: j.scheduledDate + 'T13:00:00',
          id:   'job-done-' + j.id,
        })
      }
    })

    // Deduplicate, sort newest first, take 10
    const seen = new Set()
    return events
      .filter(e => { if (seen.has(e.id)) return false; seen.add(e.id); return true })
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 10)
  }, [])

  function advanceStep(caseId, currentStep) {
    if (currentStep >= 6) return
    setStepOverrides(prev => ({ ...prev, [caseId]: currentStep + 1 }))
  }

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── PAGE HEADER ─────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-start justify-between gap-6 mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
              <Link href="/ops" className="hover:text-[#00a1e1] transition">Ops Hub</Link>
              <span>›</span>
              <span className="text-gray-700 font-semibold">Service Journey Console</span>
            </div>
            <h1 className="text-xl font-extrabold text-gray-900">Service Journey Console</h1>
            <p className="text-sm text-gray-500 mt-0.5">Active service jobs — {today}</p>
          </div>

          {/* Summary bar: case count per step */}
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {STEPS.map(s => (
              <div key={s.num} className="flex flex-col items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 min-w-[56px] text-center">
                <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">S{s.num}</span>
                <span className={`text-xl font-extrabold leading-tight ${
                  (stepCounts[s.num] || 0) > 0 ? 'text-[#00a1e1]' : 'text-gray-200'
                }`}>
                  {stepCounts[s.num] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Type filter chips */}
        <div className="flex gap-2">
          {TYPE_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setTypeFilter(f)}
              className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition ${
                typeFilter === f
                  ? 'bg-[#13347b] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
          <span className="ml-2 text-xs text-gray-400 self-center">
            {filteredCaseData.length} case{filteredCaseData.length !== 1 ? 's' : ''} shown
          </span>
        </div>
      </div>

      {/* ── PIPELINE (Kanban columns) ────────────────────────────────────── */}
      <div className="px-4 py-5 overflow-x-auto">
        <div className="flex gap-3" style={{ minWidth: 'max-content' }}>
          {STEPS.map(s => {
            const casesInStep = filteredCaseData.filter(d => d.step === s.num)
            const isComplete  = s.num === 6

            return (
              <div key={s.num} className="flex flex-col flex-shrink-0" style={{ width: 256 }}>

                {/* Column header */}
                <div
                  className={`rounded-t-xl px-4 py-3 ${
                    isComplete ? 'bg-green-600' : 'bg-[#00a1e1]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold text-white/60 uppercase tracking-wider">Step {s.num}</div>
                      <div className="text-sm font-bold text-white leading-tight mt-0.5">{s.name}</div>
                    </div>
                    <span className={`text-sm font-extrabold w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center ${
                      isComplete ? 'bg-green-100 text-green-700' : 'bg-white/20 text-white'
                    }`}>
                      {casesInStep.length}
                    </span>
                  </div>
                  <div className="text-[10px] text-white/50 mt-1 leading-tight">{s.desc}</div>
                </div>

                {/* Case cards */}
                <div
                  className={`flex-1 rounded-b-xl border border-t-0 p-2 space-y-2 overflow-y-auto ${
                    isComplete
                      ? 'bg-green-50/40 border-green-200'
                      : 'bg-sky-50/30 border-sky-200'
                  }`}
                  style={{ minHeight: 320 }}
                >
                  {casesInStep.length === 0 ? (
                    <div className="flex items-center justify-center py-10 text-gray-300 text-xs font-medium">
                      No cases
                    </div>
                  ) : (
                    casesInStep.map(({ kase, tech, cust, sla, step }) => (
                      <div
                        key={kase.id}
                        className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow"
                      >
                        {/* Row 1: case ID + type badge + priority dot + channel */}
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="font-mono text-[11px] font-bold text-gray-500">{kase.id}</span>
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            kase.priority === 'high'   ? 'bg-red-500' :
                            kase.priority === 'medium' ? 'bg-amber-400' : 'bg-gray-300'
                          }`} title={`${kase.priority} priority`} />
                          <span className="text-sm flex-shrink-0" title={kase.channel}>{CHANNEL_ICONS[kase.channel]}</span>
                          <span className={`ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded border flex-shrink-0 ${
                            TYPE_BADGE[kase.type] || 'bg-gray-100 text-gray-600 border-gray-200'
                          }`}>
                            {kase.type}
                          </span>
                        </div>

                        {/* Customer name */}
                        <div className="text-[12px] font-bold text-gray-900 leading-tight">{cust?.name}</div>

                        {/* Case title */}
                        <div className="text-[11px] text-gray-500 mt-0.5 leading-snug line-clamp-1 truncate">
                          {kase.title}
                        </div>

                        {/* SLA + Technician */}
                        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                          {sla && (
                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border leading-tight ${sla.cls}`}>
                              {sla.label}
                            </span>
                          )}
                          {tech && (
                            <span className="text-[10px] text-gray-400 truncate">{tech.name}</span>
                          )}
                        </div>

                        {/* Action row */}
                        <div className="flex items-center justify-between mt-2.5 gap-1">
                          <Link
                            href={`/ops/cases/${kase.id}`}
                            className="text-[10px] font-semibold text-[#00a1e1] hover:underline"
                          >
                            Open case →
                          </Link>
                          {step < 6 && (
                            <button
                              onClick={() => advanceStep(kase.id, step)}
                              className="text-[10px] font-bold bg-[#00a1e1] hover:bg-sky-500 text-white px-2 py-1 rounded-lg transition flex-shrink-0"
                            >
                              → Step {step + 1}
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── LIVE ACTIVITY FEED ──────────────────────────────────────────── */}
      <div className="px-6 pb-10">
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900 text-sm">Recent activity</h2>
            <span className="text-[10px] text-gray-400 italic bg-gray-100 px-2.5 py-1 rounded-full">
              Simulated real-time feed
            </span>
          </div>
          <div className="divide-y divide-gray-50">
            {activityFeed.map((ev, i) => (
              <div key={ev.id || i} className="flex items-start gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                <span className="text-base flex-shrink-0 mt-0.5">{ev.icon}</span>
                <span className="text-[12px] text-gray-700 flex-1 leading-snug">{ev.text}</span>
                <span className="text-[10px] text-gray-400 flex-shrink-0 mt-0.5 whitespace-nowrap">
                  {relTime(ev.time)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
