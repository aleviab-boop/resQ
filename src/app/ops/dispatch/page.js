'use client'

import { useState } from 'react'
import {
  TECHNICIANS, SERVICE_CENTERS, JOBS, CASES, CUSTOMERS, AI_INSIGHTS,
  ORDERS, PRODUCTS,
  getCenter, getCase, getCustomer, getTechnician, getProduct
} from '@/lib/platformData'

const SKY = '#00a1e1'
const NAVY = '#13347b'

const BADGE_STYLES = {
  'Top Rated': 'bg-yellow-100 text-yellow-800 border border-yellow-300',
  'Expert':    'bg-purple-100 text-purple-800 border border-purple-300',
  'Pro':       'bg-sky-100 text-sky-800 border border-sky-300',
  'Verified':  'bg-green-100 text-green-800 border border-green-300',
}

const STATUS_STYLES = {
  'available': { pill: 'bg-green-100 text-green-700 border border-green-300', border: 'border-green-400', dot: 'bg-green-500' },
  'on-job':    { pill: 'bg-blue-100 text-blue-700 border border-blue-300',    border: 'border-blue-400',  dot: 'bg-blue-500'  },
  'offline':   { pill: 'bg-gray-100 text-gray-500 border border-gray-300',    border: 'border-gray-300',  dot: 'bg-gray-400'  },
}

const CITY_MAP = {
  SC001: 'Mumbai', SC002: 'Navi Mumbai', SC003: 'Thane', SC004: 'Mumbai', SC005: 'Mumbai',
}

const TIME_SLOTS = ['8am','10am','12pm','2pm','4pm','6pm','8pm']

// ─── Promise Engine constants ─────────────────────────────────────────────────
const APPLIANCE_SKILLS = {
  'Air Conditioner':  ['AC'],
  'Window AC':        ['Window AC', 'AC'],
  'Cassette AC':      ['Cassette AC', 'AC'],
  'Refrigerator':     ['Refrigerator'],
  'Washing Machine':  ['Washing Machine', 'WM'],
  'Dishwasher':       ['Dishwasher'],
  'LED TV':           ['LED TV'],
  'Home Theatre':     ['Home Theatre', 'LED TV'],
  'Microwave':        ['Microwave'],
}

const PROMISE_TIME_WINDOWS = ['09:00–11:00', '11:00–13:00', '14:00–16:00']

function getNextDays(n) {
  const today = new Date('2026-10-15')
  const days = []
  for (let i = 1; i <= n; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    days.push({
      iso: d.toISOString().split('T')[0],
      label: d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
    })
  }
  return days
}

function computeSlots(pincode, requiredSkills) {
  const coveringCenters = SERVICE_CENTERS.filter(sc => sc.pincodes.includes(pincode))
  const centerIds = coveringCenters.map(sc => sc.id)
  const matchingTechs = TECHNICIANS.filter(t =>
    centerIds.includes(t.centerId) &&
    t.status !== 'offline' &&
    requiredSkills.some(s => t.skills.includes(s))
  )
  const days = getNextDays(5)
  const slots = []
  days.forEach(day => {
    PROMISE_TIME_WINDOWS.forEach(tw => {
      if (!coveringCenters.length) {
        slots.push({ day, timeWindow: tw, available: false, reason: 'No service center covers this pincode' })
        return
      }
      if (!matchingTechs.length) {
        slots.push({ day, timeWindow: tw, available: false, reason: `No ${requiredSkills[0]} specialist available in this area for this date` })
        return
      }
      const seed = (day.iso + tw).split('').reduce((a, c) => a + c.charCodeAt(0), 0)
      const rand = (seed % 10) / 10
      if (rand < 0.28) {
        slots.push({ day, timeWindow: tw, available: false, reason: `All ${requiredSkills[0]} specialists booked for this slot` })
        return
      }
      const tech = matchingTechs[seed % matchingTechs.length]
      slots.push({
        day, timeWindow: tw, available: true,
        techId: tech.id, techName: tech.name, techRating: tech.rating,
        eta: `~${15 + (seed % 25)} min`,
        partsAvailable: rand > 0.45,
        skillMatch: requiredSkills.every(s => tech.skills.includes(s)) ? 'Full match' : 'Partial match',
        center: coveringCenters[seed % coveringCenters.length]?.name,
      })
    })
  })
  return { coveringCenters, matchingTechs, days, slots }
}

// ─── Time helpers (existing) ──────────────────────────────────────────────────
function jobToTimeIndex(slot) {
  const map = { '08:00': 0, '10:00': 1, '11:00': 1.5, '12:00': 2, '14:00': 3, '16:00': 4, '18:00': 5 }
  if (!slot) return null
  const start = slot.split('–')[0]
  return map[start] ?? null
}

// ─── Assign Modal (existing) ──────────────────────────────────────────────────
function AssignModal({ tech, cases, onClose }) {
  const [selected, setSelected] = useState(null)
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

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DispatchPage() {
  // Existing state
  const [cityFilter, setCityFilter]   = useState('All')
  const [assignModal, setAssignModal] = useState(null)

  // Promise Engine state
  const [pincode, setPincode]           = useState('')
  const [applianceType, setApplianceType] = useState('Air Conditioner')
  const [slotsResult, setSlotsResult]   = useState(null)
  const [bookedSlot, setBookedSlot]     = useState(null)

  // Delivery Coordination state
  const [coordOrderId, setCoordOrderId]   = useState(null)
  const [coordSlot, setCoordSlot]         = useState('')
  const [coordConfirmed, setCoordConfirmed] = useState({})

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
  const pendingCases   = CASES.filter(c => ['open'].includes(c.status))

  // Promise Engine
  const requiredSkills = APPLIANCE_SKILLS[applianceType] || ['General']

  const handleCheckAvailability = () => {
    if (!pincode.trim()) return
    const result = computeSlots(pincode.trim(), requiredSkills)
    setSlotsResult(result)
    setBookedSlot(null)
  }

  // Delivery coordination
  const pendingInstallOrders = ORDERS.filter(o => o.status === 'delivered-pending-install')

  const daysSince = (dateStr) => {
    const then = new Date(dateStr)
    const now = new Date('2026-10-15')
    return Math.floor((now - then) / (1000 * 60 * 60 * 24))
  }

  // Slot options from promise engine for coordination
  const coordSlotOptions = slotsResult
    ? slotsResult.slots.filter(s => s.available).map(s => `${s.day.label} · ${s.timeWindow} · ${s.techName}`)
    : []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── HEADER ── */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30 shadow-sm">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">Dispatch Console</h1>
              <span className="flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                Simulated data
              </span>
            </div>
            <span className="text-sm text-gray-500">{today}</span>
          </div>

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

          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Available Techs', value: availableCount, color: 'text-green-600' },
              { label: 'On Job',          value: onJobCount,     color: 'text-blue-600' },
              { label: 'Jobs Today',      value: scheduledToday, color: 'text-sky-600' },
              { label: 'Pending Assign',  value: pendingAssign,  color: 'text-red-600' },
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

        {/* ── SECTION 1: Technician Status Board ── */}
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Technician Status Board</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredTechs.map(tech => {
              const center    = getCenter(tech.centerId)
              const s         = STATUS_STYLES[tech.status] || STATUS_STYLES.offline
              const activeJob  = tech.activeJobId ? JOBS.find(j => j.id === tech.activeJobId) : null
              const activeCase = activeJob ? getCase(activeJob.caseId) : null
              return (
                <div key={tech.id} className={`bg-white rounded-2xl border-2 ${s.border} shadow-sm p-4 flex flex-col gap-3`}>
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
                  <div className="flex flex-wrap gap-1.5">
                    {tech.skills.map(sk => (
                      <span key={sk} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{sk}</span>
                    ))}
                  </div>
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
                  <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-2">
                    <span>🕐 {tech.shift}</span>
                    <span>{center?.city} · {center?.name}</span>
                  </div>
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

        {/* ── SECTION 2: Awaiting Assignment ── */}
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Awaiting Assignment</h2>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {['Case ID','Customer','Type','Pincode','Required Skills','SLA Status','AI Recommendation','Action'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pendingCases.map(c => {
                  const cust       = getCustomer(c.customerId)
                  const isCritical = c.id === 'CS001'
                  const skillsNeeded = c.type === 'installation' ? ['AC','Window AC'] :
                                       c.type === 'recovery'     ? ['Senior'] : ['General']
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
                        <button className="text-xs font-semibold text-white px-3 py-1.5 rounded-lg transition" style={{ background: SKY }}>
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

        {/* ── SECTION 3: Today's Schedule ── */}
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Today's Schedule — 14 Oct 2026</h2>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-x-auto">
            <div className="min-w-[700px]">
              <div className="grid border-b border-gray-200" style={{ gridTemplateColumns: '160px repeat(6, 1fr)' }}>
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 border-r border-gray-200">Technician</div>
                {TIME_SLOTS.slice(0, -1).map(t => (
                  <div key={t} className="px-2 py-2 text-xs font-medium text-gray-500 border-r border-gray-100 text-center">{t}</div>
                ))}
              </div>
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
            <div className="flex gap-4 px-4 py-3 border-t border-gray-100">
              {[['bg-blue-500','In Progress'],['bg-emerald-500','Completed']].map(([bg, label]) => (
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

        {/* ── SECTION 4: Service Centers ── */}
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Service Centers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {SERVICE_CENTERS.map(sc => {
              const pct    = Math.round((sc.activeEngineers / sc.capacity) * 100)
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
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>{sc.activeEngineers} active engineers</span>
                      <span>of {sc.capacity} capacity</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${isHigh ? 'bg-amber-400' : 'bg-green-500'}`} style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
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

        {/* ── SECTION 5: Promise Engine — Slot Availability ── */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-lg font-bold text-gray-800">Promise Engine — Slot Availability</h2>
            <span className="text-xs bg-sky-100 text-sky-700 border border-sky-200 px-2 py-0.5 rounded-full font-medium">Simulation</span>
          </div>

          {/* Input row */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-4">
            <div className="flex flex-wrap gap-4 items-end">
              {/* Pincode */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Customer Pincode</label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 400053"
                  value={pincode}
                  onChange={e => setPincode(e.target.value.replace(/\D/g, ''))}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 w-36"
                  style={{ '--tw-ring-color': SKY }}
                />
              </div>

              {/* Appliance type */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Appliance Type</label>
                <select
                  value={applianceType}
                  onChange={e => setApplianceType(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': SKY }}
                >
                  {Object.keys(APPLIANCE_SKILLS).map(a => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </div>

              {/* Required skills (auto) */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Required Skills</label>
                <div className="flex gap-1.5 pt-1">
                  {requiredSkills.map(s => (
                    <span key={s} className="text-xs font-medium px-2.5 py-1 rounded-full border text-white" style={{ background: NAVY, borderColor: NAVY }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={handleCheckAvailability}
                disabled={pincode.length < 6}
                className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: SKY }}
              >
                Check Availability
              </button>
            </div>
          </div>

          {/* Results: calendar grid */}
          {slotsResult && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Coverage info */}
              <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-4 flex-wrap">
                {slotsResult.coveringCenters.length > 0 ? (
                  <span className="text-xs text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full font-medium">
                    ✓ {slotsResult.coveringCenters.map(c => c.name).join(', ')} covers pincode {pincode}
                  </span>
                ) : (
                  <span className="text-xs text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full font-medium">
                    ✕ Pincode {pincode} not covered by any service center
                  </span>
                )}
                <span className="text-xs text-gray-500">
                  {slotsResult.matchingTechs.length} {applianceType} specialist{slotsResult.matchingTechs.length !== 1 ? 's' : ''} available
                </span>
              </div>

              {/* Calendar grid: days × time windows */}
              <div className="overflow-x-auto">
                <div className="min-w-[680px]">
                  {/* Day headers */}
                  <div className="grid border-b border-gray-200" style={{ gridTemplateColumns: '120px repeat(5, 1fr)' }}>
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 border-r border-gray-200">Time Slot</div>
                    {slotsResult.days.map(d => (
                      <div key={d.iso} className="px-2 py-2 text-xs font-semibold text-gray-700 border-r border-gray-100 text-center">{d.label}</div>
                    ))}
                  </div>

                  {/* Time window rows */}
                  {PROMISE_TIME_WINDOWS.map(tw => (
                    <div key={tw} className="grid border-b border-gray-100" style={{ gridTemplateColumns: '120px repeat(5, 1fr)' }}>
                      <div className="px-3 py-3 text-xs font-medium text-gray-500 border-r border-gray-200 flex items-center">{tw}</div>
                      {slotsResult.days.map(d => {
                        const slot = slotsResult.slots.find(s => s.day.iso === d.iso && s.timeWindow === tw)
                        if (!slot) return <div key={d.iso} className="border-r border-gray-100 p-2"></div>
                        const isBooked = bookedSlot && bookedSlot.day.iso === d.iso && bookedSlot.timeWindow === tw

                        return (
                          <div key={d.iso} className="border-r border-gray-100 p-2 min-h-[80px]">
                            {isBooked ? (
                              <div className="h-full bg-green-50 border border-green-300 rounded-lg p-2 flex flex-col gap-1">
                                <span className="text-xs font-bold text-green-700">✓ Booked</span>
                                <span className="text-xs text-green-600">{slot.techName}</span>
                              </div>
                            ) : slot.available ? (
                              <div className="h-full bg-sky-50 border border-sky-200 rounded-lg p-2 flex flex-col gap-1.5">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-semibold text-gray-800 truncate">{slot.techName}</span>
                                  <span className="text-xs text-yellow-600 font-medium shrink-0 ml-1">⭐{slot.techRating}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${slot.skillMatch === 'Full match' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {slot.skillMatch}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500">ETA {slot.eta}</div>
                                {slot.partsAvailable
                                  ? <span className="text-xs text-green-600">Parts in stock</span>
                                  : <span className="text-xs text-amber-600">Parts TBC</span>}
                                <button
                                  onClick={() => setBookedSlot(slot)}
                                  className="mt-auto w-full text-xs font-semibold text-white rounded py-1 transition hover:opacity-90"
                                  style={{ background: SKY }}
                                >
                                  Book
                                </button>
                              </div>
                            ) : (
                              <div className="h-full bg-gray-50 border border-gray-200 rounded-lg p-2 flex flex-col justify-center">
                                <span className="text-xs font-medium text-gray-400">Unavailable</span>
                                <span className="text-xs text-gray-400 mt-0.5 leading-snug">{slot.reason}</span>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Booked confirmation card */}
              {bookedSlot && (
                <div className="mx-5 my-4 p-4 bg-green-50 border border-green-300 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-green-600 text-lg">✓</span>
                    <span className="text-sm font-bold text-green-800">Slot committed</span>
                  </div>
                  <p className="text-sm text-green-700">
                    <strong>{bookedSlot.techName}</strong> will receive WhatsApp confirmation (simulated) for{' '}
                    <strong>{bookedSlot.day.label} · {bookedSlot.timeWindow}</strong>.
                  </p>
                </div>
              )}

              <p className="text-xs text-gray-400 px-5 pb-4 pt-2">
                Slot calculation uses pincode coverage, technician availability, skills, and current workload. Parts check is simulated.
              </p>
            </div>
          )}
        </section>

        {/* ── SECTION 6: Delivery Coordination ── */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-lg font-bold text-gray-800">Delivery Coordination</h2>
            <span className="text-xs bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
              {pendingInstallOrders.length} Pending Installation
            </span>
          </div>

          <div className="space-y-4">
            {pendingInstallOrders.map(order => {
              const product  = PRODUCTS.find(p => p.id === order.productId)
              const customer = CUSTOMERS.find(c => c.id === order.customerId)
              const linkedCase = CASES.find(c => c.orderId === order.id)
              const days     = daysSince(order.deliveryDate)
              const isCoordinating = coordOrderId === order.id
              const isConfirmed    = coordConfirmed[order.id]

              return (
                <div key={order.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-start justify-between flex-wrap gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs text-gray-400">{order.id}</span>
                        <span className="text-xs bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                          Delivered — Install Pending
                        </span>
                        {days > 7 && (
                          <span className="text-xs bg-red-100 text-red-600 border border-red-200 px-2 py-0.5 rounded-full font-medium">
                            {days} days overdue
                          </span>
                        )}
                      </div>
                      <div className="text-base font-bold text-gray-900">
                        {product?.brand} {product?.model} — {product?.type}
                      </div>
                      <div className="text-sm text-gray-500 mt-0.5">
                        Customer: {customer?.name} · {customer?.city} · {customer?.pincode}
                      </div>
                      <div className="text-sm text-gray-500">
                        Delivered: {order.deliveryDate} via {order.deliveryPartner} · <strong>{days} days since delivery</strong>
                      </div>
                      {linkedCase && (
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <span className="text-xs text-gray-400">Linked case:</span>
                          <span className="text-xs font-semibold text-sky-700 font-mono">{linkedCase.id}</span>
                          <span className="text-xs text-gray-500">— {linkedCase.title}</span>
                        </div>
                      )}
                    </div>

                    {!isConfirmed && (
                      <button
                        onClick={() => setCoordOrderId(isCoordinating ? null : order.id)}
                        className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition shrink-0"
                        style={{ background: isCoordinating ? '#6b7280' : NAVY }}
                      >
                        {isCoordinating ? 'Cancel' : 'Coordinate Installation'}
                      </button>
                    )}
                  </div>

                  {/* Inline coordination panel */}
                  {isCoordinating && !isConfirmed && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm font-semibold text-gray-700 mb-3">Select Installation Slot</p>

                      {coordSlotOptions.length > 0 ? (
                        <div className="space-y-2 mb-3">
                          {coordSlotOptions.slice(0, 6).map(opt => (
                            <label key={opt} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:border-sky-300 transition">
                              <input
                                type="radio"
                                name={`slot-${order.id}`}
                                value={opt}
                                checked={coordSlot === opt}
                                onChange={() => setCoordSlot(opt)}
                                className="accent-sky-500"
                              />
                              <span className="text-sm text-gray-700">{opt}</span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3 text-sm text-amber-700">
                          No slots loaded — use Promise Engine above to check availability for pincode{' '}
                          <strong>{customer?.pincode}</strong> first.
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <span>Linked to delivery order:</span>
                        <span className="font-mono font-semibold text-gray-700">{order.id}</span>
                      </div>

                      <button
                        onClick={() => {
                          if (!coordSlot && coordSlotOptions.length > 0) return
                          setCoordConfirmed(prev => ({ ...prev, [order.id]: true }))
                          setCoordOrderId(null)
                          setCoordSlot('')
                        }}
                        disabled={coordSlotOptions.length > 0 && !coordSlot}
                        className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ background: SKY }}
                      >
                        Confirm Coordination
                      </button>
                    </div>
                  )}

                  {/* Confirmed summary card */}
                  {isConfirmed && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
                        <span className="text-green-600 text-xl mt-0.5">✓</span>
                        <div>
                          <p className="text-sm font-bold text-green-800">Installation linked to delivery</p>
                          <p className="text-sm text-green-700 mt-0.5">
                            {coordConfirmed[order.id] === true
                              ? `Slot confirmed for order ${order.id}.`
                              : `Slot: ${coordConfirmed[order.id]}`}
                            {' '}Customer will receive WhatsApp update (simulated).
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
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
