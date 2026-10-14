'use client'

import { useState } from 'react'
import {
  TECHNICIANS, SERVICE_CENTERS, JOBS, CASES, CUSTOMERS, AI_INSIGHTS,
  getCenter, getCase, getCustomer, getTechnician
} from '@/lib/platformData'

const SKY = '#00a1e1'

const BADGE_STYLES = {
  'Top Rated': 'bg-yellow-100 text-yellow-800 border border-yellow-300',
  'Expert':    'bg-purple-100 text-purple-800 border border-purple-300',
  'Pro':       'bg-sky-100 text-sky-800 border border-sky-300',
  'Verified':  'bg-green-100 text-green-800 border border-green-300',
}

const STATUS_STYLES = {
  'available': { pill: 'bg-green-100 text-green-700 border border-green-300', border: 'border-green-400', dot: 'bg-green-500' },
  'on-job':    { pill: 'bg-blue-100 text-blue-700 border border-blue-300',  border: 'border-blue-400',  dot: 'bg-blue-500'  },
  'offline':   { pill: 'bg-gray-100 text-gray-500 border border-gray-300',  border: 'border-gray-300',  dot: 'bg-gray-400'  },
}

const CITY_MAP = {
  SC001: 'Mumbai', SC002: 'Navi Mumbai', SC003: 'Thane', SC004: 'Mumbai', SC005: 'Mumbai',
}

// Time slots 8AM–8PM in 2h blocks
const TIME_SLOTS = ['8am','10am','12pm','2pm','4pm','6pm','8pm']

function jobToTimeIndex(slot) {
  const map = { '08:00': 0, '10:00': 1, '11:00': 1.5, '12:00': 2, '14:00': 3, '16:00': 4, '18:00': 5 }
  if (!slot) return null
  const start = slot.split('–')[0]
  return map[start] ?? null
}

function jobDuration(slot) {
  if (!slot) return 1
  const [s, e] = slot.split('–')
  const toH = t => { const [h, m] = t.split(':').map(Number); return h + m / 60 }
  return toH(e) - toH(s)
}

function AssignModal({ tech, cases, onClose }) {
  const [selected, setSelected] = useState(null)
  const unassigned = cases.filter(c => !c.assignedTo || c.assignedTo === tech.id)
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Assign Job — {tech.name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">&times;</button>
        </div>
        <p className="text-sm text-gray-500 mb-3">Select a case to assign to this technician</p>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {CASES.filter(c => ['open','scheduled'].includes(c.status)).map(c => {
            const cust = getCustomer(c.customerId)
            return (
              <div
                key={c.id}
                onClick={() => setSelected(c.id)}
                className={`p-3 rounded-lg border cursor-pointer transition ${selected === c.id ? 'border-sky-500 bg-sky-50' : 'border-gray-200 hover:border-sky-300'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-800">{c.id}</span>
                  {c.slaBreached && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">SLA Breached</span>}
                </div>
                <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">{c.title}</p>
                <p className="text-xs text-gray-400">{cust?.name} · {cust?.city}</p>
              </div>
            )
          })}
        </div>
        <div className="flex gap-2 mt-4">
          <button
            disabled={!selected}
            className="flex-1 py-2 rounded-lg text-sm font-semibold text-white transition disabled:opacity-40"
            style={{ background: SKY }}
          >
            Confirm Assignment
          </button>
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default function DispatchPage() {
  const [cityFilter, setCityFilter] = useState('All')
  const [assignModal, setAssignModal] = useState(null) // tech object

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  const cities = ['All', 'Mumbai', 'Thane', 'Navi Mumbai']

  const filteredTechs = TECHNICIANS.filter(t => {
    if (cityFilter === 'All') return true
    return CITY_MAP[t.centerId] === cityFilter
  })

  const availableCount = TECHNICIANS.filter(t => t.status === 'available').length
  const onJobCount     = TECHNICIANS.filter(t => t.status === 'on-job').length
  const scheduledToday = JOBS.filter(j => j.scheduledDate === '2026-10-14').length
  const pendingAssign  = CASES.filter(c => c.status === 'open').length

  // Pending assignment cases (open + no tech or needing reassign)
  const pendingCases = CASES.filter(c => ['open'].includes(c.status))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30 shadow-sm">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">Dispatch Console</h1>
              <span className="flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse inline-block"></span>
                Live
              </span>
            </div>
            <span className="text-sm text-gray-500">{today}</span>
          </div>

          {/* City tabs */}
          <div className="flex items-center gap-1 mb-3">
            {cities.map(c => (
              <button
                key={c}
                onClick={() => setCityFilter(c)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${cityFilter === c ? 'text-white' : 'text-gray-600 bg-gray-100 hover:bg-gray-200'}`}
                style={cityFilter === c ? { background: SKY } : {}}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Summary bar */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Available Techs', value: availableCount, color: 'text-green-600' },
              { label: 'On Job', value: onJobCount, color: 'text-blue-600' },
              { label: 'Jobs Scheduled Today', value: scheduledToday, color: 'text-sky-600' },
              { label: 'Pending Assignment', value: pendingAssign, color: 'text-red-600' },
            ].map(s => (
              <div key={s.label} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5">
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-6 space-y-8">

        {/* SECTION 1 — TECHNICIAN STATUS BOARD */}
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Technician Status Board</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredTechs.map(tech => {
              const center = getCenter(tech.centerId)
              const s = STATUS_STYLES[tech.status] || STATUS_STYLES.offline
              const activeJob = tech.activeJobId ? JOBS.find(j => j.id === tech.activeJobId) : null
              const activeCase = activeJob ? getCase(activeJob.caseId) : null

              return (
                <div key={tech.id} className={`bg-white rounded-2xl border-2 ${s.border} shadow-sm p-4 flex flex-col gap-3`}>
                  {/* Top row */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-base">{tech.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${BADGE_STYLES[tech.badge]}`}>{tech.badge}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-yellow-500 text-sm">⭐</span>
                        <span className="text-sm font-semibold text-gray-700">{tech.rating}</span>
                        <span className="text-xs text-gray-400">· {tech.jobs} jobs · {tech.exp}</span>
                      </div>
                    </div>
                    <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${s.pill}`}>
                      <span className={`w-1.5 h-1.5 rounded-full inline-block ${s.dot}`}></span>
                      {tech.status === 'on-job' ? 'On Job' : tech.status.charAt(0).toUpperCase() + tech.status.slice(1)}
                    </span>
                  </div>

                  {/* Skill chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {tech.skills.map(sk => (
                      <span key={sk} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{sk}</span>
                    ))}
                  </div>

                  {/* Active job info */}
                  {tech.status === 'on-job' && activeCase && (
                    <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-blue-800">{activeJob.id}</span>
                        <span className="text-blue-600">In Progress</span>
                      </div>
                      <p className="text-xs text-gray-700 line-clamp-1">{activeCase.title}</p>
                      <div className="mt-2 h-1.5 bg-blue-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                      <p className="text-xs text-blue-500 mt-1">Slot: {activeJob.timeSlot}</p>
                    </div>
                  )}

                  {/* Bottom meta */}
                  <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-2">
                    <span>🕐 {tech.shift}</span>
                    <span>{center?.city} · {center?.name}</span>
                  </div>

                  {/* Assign button */}
                  <button
                    onClick={() => tech.status === 'available' && setAssignModal(tech)}
                    disabled={tech.status !== 'available'}
                    className="w-full py-2 rounded-xl text-sm font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed"
                    style={tech.status === 'available' ? { background: SKY, color: '#fff' } : { background: '#f3f4f6', color: '#9ca3af' }}
                  >
                    {tech.status === 'available' ? 'Assign Job' : tech.status === 'on-job' ? 'Currently On Job' : 'Offline'}
                  </button>
                </div>
              )
            })}
          </div>
        </section>

        {/* SECTION 2 — JOBS PENDING ASSIGNMENT */}
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Awaiting Assignment</h2>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {['Case ID', 'Customer', 'Type', 'Pincode', 'Required Skills', 'SLA Status', 'AI Recommendation', 'Action'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pendingCases.map(c => {
                  const cust = getCustomer(c.customerId)
                  const aiRec = AI_INSIGHTS.find(a => a.type === 'assignment' && a.summary.includes(c.id))
                  const isCritical = c.id === 'CS001'
                  const skillsNeeded = c.type === 'installation' ? ['AC', 'Window AC'] :
                                       c.type === 'recovery' ? ['Senior'] : ['General']

                  return (
                    <tr key={c.id} className={isCritical ? 'bg-red-50' : 'hover:bg-gray-50'}>
                      <td className="px-4 py-3 font-mono font-semibold text-gray-800">
                        <div className="flex items-center gap-2">
                          {isCritical && <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded font-bold">CRITICAL</span>}
                          {c.id}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-800">{cust?.name}</div>
                        {isCritical && <div className="text-xs text-red-600 font-medium">5 months pending · 3 contacts</div>}
                      </td>
                      <td className="px-4 py-3">
                        <span className="capitalize text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{c.type}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 font-mono text-xs">{cust?.pincode}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {skillsNeeded.map(sk => (
                            <span key={sk} className="text-xs bg-sky-50 text-sky-700 border border-sky-200 px-1.5 py-0.5 rounded">{sk}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {c.slaBreached
                          ? <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Breached</span>
                          : <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Within SLA</span>}
                      </td>
                      <td className="px-4 py-3">
                        {c.id === 'CS001'
                          ? <span className="text-xs text-purple-700 font-medium">→ T005 Rohan Nair (94%)</span>
                          : <span className="text-xs text-gray-400">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          className="text-xs font-semibold text-white px-3 py-1.5 rounded-lg transition"
                          style={{ background: SKY }}
                        >
                          Assign
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 3 — TODAY'S SCHEDULE */}
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Today's Schedule — 14 Oct 2026</h2>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-x-auto">
            <div className="min-w-[700px]">
              {/* Time header */}
              <div className="grid border-b border-gray-200" style={{ gridTemplateColumns: '160px repeat(6, 1fr)' }}>
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 border-r border-gray-200">Technician</div>
                {TIME_SLOTS.slice(0, -1).map(t => (
                  <div key={t} className="px-2 py-2 text-xs font-medium text-gray-500 border-r border-gray-100 text-center">{t}</div>
                ))}
              </div>

              {/* Tech rows */}
              {TECHNICIANS.map(tech => {
                const todayJobs = JOBS.filter(j => j.technicianId === tech.id && j.scheduledDate === '2026-10-14')
                return (
                  <div key={tech.id} className="grid border-b border-gray-100" style={{ gridTemplateColumns: '160px repeat(6, 1fr)' }}>
                    <div className="px-4 py-3 border-r border-gray-200 flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full inline-block ${STATUS_STYLES[tech.status]?.dot || 'bg-gray-300'}`}></span>
                      <div>
                        <div className="text-xs font-semibold text-gray-800">{tech.name}</div>
                        <div className="text-xs text-gray-400">{tech.shift}</div>
                      </div>
                    </div>
                    {/* 6 time slots */}
                    {[0,1,2,3,4,5].map(slotIdx => {
                      const job = todayJobs.find(j => {
                        const idx = jobToTimeIndex(j.timeSlot)
                        return idx !== null && Math.floor(idx) === slotIdx
                      })
                      return (
                        <div key={slotIdx} className="border-r border-gray-100 p-1 relative min-h-[52px]">
                          {job && (
                            <div
                              className="absolute inset-1 rounded-md text-white text-xs p-1.5 leading-tight"
                              style={{ background: job.status === 'in-progress' ? '#3b82f6' : job.status === 'completed' ? '#10b981' : SKY }}
                            >
                              <div className="font-semibold truncate">{job.id}</div>
                              <div className="truncate opacity-90">{job.type}</div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
            {/* Legend */}
            <div className="flex gap-4 px-4 py-3 border-t border-gray-100">
              {[['bg-blue-500', 'In Progress'], ['bg-emerald-500', 'Completed']].map(([bg, label]) => (
                <div key={label} className="flex items-center gap-1.5">
                  <span className={`w-3 h-3 rounded-sm inline-block ${bg}`}></span>
                  <span className="text-xs text-gray-500">{label}</span>
                </div>
              ))}
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm inline-block" style={{ background: SKY }}></span>
                <span className="text-xs text-gray-500">Scheduled</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4 — SERVICE CENTERS */}
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Service Centers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {SERVICE_CENTERS.map(sc => {
              const pct = Math.round((sc.activeEngineers / sc.capacity) * 100)
              const isHigh = pct >= 80
              return (
                <div key={sc.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-bold text-gray-900">{sc.name}</div>
                      <div className="text-xs text-gray-500">{sc.city} · Manager: {sc.manager}</div>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isHigh ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                      {pct}% capacity
                    </span>
                  </div>

                  {/* Capacity bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>{sc.activeEngineers} active engineers</span>
                      <span>of {sc.capacity} capacity</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${isHigh ? 'bg-amber-400' : 'bg-green-500'}`}
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Coverage pincodes */}
                  <div>
                    <div className="text-xs text-gray-500 mb-1 font-medium">Coverage Pincodes</div>
                    <div className="flex flex-wrap gap-1">
                      {sc.pincodes.map(pin => (
                        <span key={pin} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono">{pin}</span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-gray-400 border-t border-gray-100 pt-2">📞 {sc.phone}</div>
                </div>
              )
            })}
          </div>
        </section>
      </div>

      {/* Assign Modal */}
      {assignModal && (
        <AssignModal
          tech={assignModal}
          cases={CASES}
          onClose={() => setAssignModal(null)}
        />
      )}
    </div>
  )
}
