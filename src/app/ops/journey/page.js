'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  CASES, JOBS, CONVERSATIONS,
  getCustomer, getTechnician,
} from '@/lib/platformData'
import OpsShell, { StatCard, SectionLabel } from '@/components/OpsShell'

// ── Step definitions ─────────────────────────────────────────────────────────
const STEPS = [
  { num: 1, name: 'Request received',      desc: 'Case created, customer contacted' },
  { num: 2, name: 'Centre assigned',       desc: 'Service centre selected, SLA started' },
  { num: 3, name: 'Promise committed',     desc: 'Slot booked, technician identified' },
  { num: 4, name: 'Customer updated',      desc: 'WhatsApp sent, confirmation received' },
  { num: 5, name: 'Technician dispatched', desc: 'Job started, en route' },
  { num: 6, name: 'Completion + feedback', desc: 'Visit done, NPS collected' },
]

// Top-border color per stage (inline style, avoids Tailwind purging)
const STEP_TOP_COLORS = ['#0ea5e9', '#3b82f6', '#8b5cf6', '#f59e0b', '#f97316', '#22c55e']
// Text accent color per stage
const STEP_TEXT_COLORS = ['text-sky-600', 'text-blue-600', 'text-violet-600', 'text-amber-600', 'text-orange-600', 'text-green-600']

const TYPE_FILTERS = ['All', 'Repair', 'Installation', 'Service', 'Recovery']

const TYPE_BADGE = {
  installation: 'bg-purple-50 text-purple-700 border-purple-200',
  repair:       'bg-orange-50 text-orange-700 border-orange-200',
  service:      'bg-blue-50 text-blue-700 border-blue-200',
  maintenance:  'bg-teal-50 text-teal-700 border-teal-200',
  recovery:     'bg-pink-50 text-pink-700 border-pink-200',
}

// Activity event type badges
const EVENT_BADGES = {
  done:   { label: 'Done',   cls: 'bg-green-100 text-green-700' },
  parts:  { label: 'Parts',  cls: 'bg-amber-100 text-amber-700' },
  new:    { label: 'New',    cls: 'bg-sky-100 text-sky-700' },
  update: { label: 'Update', cls: 'bg-gray-100 text-gray-600' },
  active: { label: 'Active', cls: 'bg-orange-100 text-orange-700' },
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function deriveStep(kase, jobs, conv) {
  if (kase.status === 'resolved' || kase.status === 'completed') return 6
  if (jobs.some(j => j.status === 'in-progress')) return 5
  if (conv?.messages?.some(m => m.from === 'agent')) return 4
  if (jobs.some(j => j.status === 'scheduled')) return 3
  if (kase.centerId && kase.assignedTo) return 2
  return 1
}

function getSlaInfo(kase) {
  if (kase.slaBreached) return { label: 'Breached', cls: 'text-red-600 bg-red-50 border-red-200' }
  if (!kase.slaDeadline) return null
  const diff = new Date(kase.slaDeadline) - new Date()
  if (diff <= 0) return { label: 'Breached', cls: 'text-red-600 bg-red-50 border-red-200' }
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  if (h < 4)  return { label: `${h}h ${m}m left`, cls: 'text-red-600 bg-red-50 border-red-200' }
  if (h < 24) return { label: `${h}h left`,        cls: 'text-amber-600 bg-amber-50 border-amber-200' }
  return        { label: `${h}h left`,              cls: 'text-green-600 bg-green-50 border-green-200' }
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

// ── Page ──────────────────────────────────────────────────────────────────────
export default function JourneyConsolePage() {
  const [typeFilter, setTypeFilter]     = useState('All')
  const [stepOverrides, setStepOverrides] = useState({})

  // Build enriched case data with computed step
  const caseStepData = useMemo(() => {
    return CASES.map(kase => {
      const jobs  = JOBS.filter(j => j.caseId === kase.id)
      const conv  = CONVERSATIONS.find(c => c.caseId === kase.id)
      const derived = deriveStep(kase, jobs, conv)
      const step  = stepOverrides[kase.id] ?? derived
      const tech  = getTechnician(kase.assignedTo)
      const cust  = getCustomer(kase.customerId)
      const sla   = getSlaInfo(kase)
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

  // Unfiltered counts for stat cards
  const allStepCounts = useMemo(() => {
    const c = {}
    caseStepData.forEach(({ step }) => { c[step] = (c[step] || 0) + 1 })
    return c
  }, [caseStepData])

  // Activity feed derived from CASES + JOBS
  const activityFeed = useMemo(() => {
    const events = []

    CASES.forEach(c => {
      const cust = getCustomer(c.customerId)
      let type = 'update'
      let text = ''
      if (c.status === 'resolved' || c.status === 'completed') {
        type = 'done'
        text = `${c.id} ${c.status} — ${cust?.name}: ${c.title.slice(0, 48)}`
      } else if (c.status === 'parts-awaited') {
        type = 'parts'
        text = `${c.id} parts awaited — Part ordered for ${cust?.name}`
      } else if (c.status === 'open') {
        type = 'new'
        text = `${c.id} opened — ${cust?.name} contacted via ${c.channel}`
      } else {
        type = 'update'
        text = `${c.id} ${c.status.replace(/-/g, ' ')} — ${cust?.name}`
      }
      events.push({ type, text, time: c.updatedAt || c.createdAt, id: 'case-' + c.id })
    })

    JOBS.forEach(j => {
      const tech  = getTechnician(j.technicianId)
      const visit = j.visits?.[0]
      if (j.status === 'in-progress' && visit) {
        events.push({
          type: 'active',
          text: `${j.id} started — ${tech?.name} arrived at ${j.city} ${visit.arrivedAt}`,
          time: j.scheduledDate + 'T' + visit.arrivedAt + ':00',
          id:   'job-prog-' + j.id,
        })
      } else if (j.status === 'completed' && visit) {
        events.push({
          type: 'done',
          text: `${j.id} completed — ${tech?.name}: ${(visit.diagnosis || 'visit done').slice(0, 50)}`,
          time: j.scheduledDate + 'T13:00:00',
          id:   'job-done-' + j.id,
        })
      }
    })

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

  const incomingCount  = (allStepCounts[1] || 0) + (allStepCounts[2] || 0)
  const activeCount    = (allStepCounts[3] || 0) + (allStepCounts[4] || 0) + (allStepCounts[5] || 0)
  const completedCount = allStepCounts[6] || 0

  return (
    <OpsShell
      title="Service Journey"
      subtitle="End-to-end case pipeline — 6 stages"
      breadcrumb={[{ label: 'Journey' }]}
      noPad
    >

      {/* ── Stat row + filter chips (padded section) ─────────────────────── */}
      <div className="max-w-7xl mx-auto w-full px-5 sm:px-6 pt-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <StatCard label="Total Cases"  value={caseStepData.length} sub="all active" />
          <StatCard label="Incoming"     value={incomingCount}       sub="steps 1–2" color="text-sky-600" />
          <StatCard label="In Service"   value={activeCount}         sub="steps 3–5" color="text-orange-500" />
          <StatCard label="Completed"    value={completedCount}      sub="step 6"    color="text-green-600" />
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          {TYPE_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setTypeFilter(f)}
              className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition ${
                typeFilter === f
                  ? 'bg-[#13347b] text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {f}
            </button>
          ))}
          <span className="ml-2 text-xs text-gray-400 self-center">
            {filteredCaseData.length} case{filteredCaseData.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* ── Kanban (full-width horizontal scroll) ────────────────────────── */}
      <div className="px-4 pb-6 overflow-x-auto">
        <div className="flex gap-3" style={{ minWidth: 'max-content' }}>
          {STEPS.map((s, si) => {
            const casesInStep = filteredCaseData.filter(d => d.step === s.num)
            const topColor    = STEP_TOP_COLORS[si]
            const textColor   = STEP_TEXT_COLORS[si]

            return (
              <div key={s.num} className="flex flex-col flex-shrink-0" style={{ width: 256 }}>
                {/* Column card */}
                <div
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col"
                  style={{ borderTop: `3px solid ${topColor}` }}
                >
                  {/* Column header */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Step {s.num}</div>
                        <div className={`text-sm font-bold leading-tight mt-0.5 ${textColor}`}>{s.name}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5 leading-tight">{s.desc}</div>
                      </div>
                      <span
                        className={`text-sm font-extrabold w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center ${
                          casesInStep.length > 0 ? 'text-white' : 'bg-gray-100 text-gray-300'
                        }`}
                        style={casesInStep.length > 0 ? { background: topColor } : {}}
                      >
                        {casesInStep.length}
                      </span>
                    </div>
                  </div>

                  {/* Case cards */}
                  <div className="p-2 space-y-2 flex-1" style={{ minHeight: 320 }}>
                    {casesInStep.length === 0 ? (
                      <div className="flex items-center justify-center py-10 text-gray-300 text-xs font-medium">
                        No cases
                      </div>
                    ) : (
                      casesInStep.map(({ kase, tech, cust, sla, step }) => (
                        <div
                          key={kase.id}
                          className="bg-gray-50 border border-gray-100 rounded-xl p-3 hover:border-gray-200 hover:shadow-sm transition-all"
                        >
                          {/* Row 1: case ID + type badge + priority dot + channel */}
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <span className="font-mono text-[11px] font-bold text-gray-500">{kase.id}</span>
                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                              kase.priority === 'high'   ? 'bg-red-500' :
                              kase.priority === 'medium' ? 'bg-amber-400' : 'bg-gray-300'
                            }`} title={`${kase.priority} priority`} />
                            <span className={`ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded border flex-shrink-0 ${
                              TYPE_BADGE[kase.type] || 'bg-gray-100 text-gray-600 border-gray-200'
                            }`}>
                              {kase.type}
                            </span>
                          </div>

                          {/* Customer name */}
                          <div className="text-[12px] font-bold text-gray-900 leading-tight">{cust?.name}</div>

                          {/* Case title */}
                          <div className="text-[11px] text-gray-500 mt-0.5 leading-snug truncate">
                            {kase.title}
                          </div>

                          {/* Channel badge */}
                          <div className="mt-1">
                            <span className="text-[10px] font-medium bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200">
                              {kase.channel}
                            </span>
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
                              className="text-[10px] font-semibold hover:underline"
                              style={{ color: '#00a1e1' }}
                            >
                              Open case
                            </Link>
                            {step < 6 && (
                              <button
                                onClick={() => advanceStep(kase.id, step)}
                                className="text-[10px] font-bold text-white px-2 py-1 rounded-lg transition flex-shrink-0 hover:opacity-90"
                                style={{ background: topColor }}
                              >
                                Step {step + 1}
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Activity feed ────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto w-full px-5 sm:px-6 pb-10">
        <SectionLabel>Recent Activity</SectionLabel>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <span className="text-sm font-bold text-gray-800">Live activity feed</span>
            <span className="text-[10px] text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
              Simulated real-time
            </span>
          </div>
          <div className="divide-y divide-gray-50">
            {activityFeed.map((ev, i) => {
              const badge = EVENT_BADGES[ev.type] || EVENT_BADGES.update
              return (
                <div key={ev.id || i} className="flex items-start gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5 ${badge.cls}`}>
                    {badge.label}
                  </span>
                  <span className="text-[12px] text-gray-700 flex-1 leading-snug">{ev.text}</span>
                  <span className="text-[10px] text-gray-400 flex-shrink-0 mt-0.5 whitespace-nowrap">
                    {relTime(ev.time)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

    </OpsShell>
  )
}
