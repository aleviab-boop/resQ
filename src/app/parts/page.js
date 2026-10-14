'use client'

import { useState, useMemo } from 'react'
import { PARTS_INVENTORY, SERVICE_CENTERS, CASES } from '@/lib/platformData'

// ── Map platformData to the shape this page expects ───────────────────────────
const CENTER_CITY = Object.fromEntries(SERVICE_CENTERS.map(sc => [sc.id, sc.city]))
const CENTER_NAME = Object.fromEntries(SERVICE_CENTERS.map(sc => [sc.id, sc.name]))

const PARTS = PARTS_INVENTORY.map(p => ({
  ...p,
  appliance: p.category,
  age: p.ageMonths ?? 0,
  avgMonthlyDemand: p.demand ?? 0,
  city: CENTER_CITY[p.centerId] ?? 'Mumbai',
}))

// ── Mock movement log ─────────────────────────────────────────────────────────
const MOVEMENTS_INIT = [
  { id: 'MV001', type: 'reservation', partId: 'PT006', partName: 'PCB Board — Whirlpool AC', sku: 'PCB-WHP-AC-01', qty: 1, jobId: 'JB003', caseId: 'CS008', technicianId: 'T001', from: null, to: 'SC001', status: 'confirmed',        timestamp: '2026-10-14T10:18:00', approvedBy: 'Auto' },
  { id: 'MV002', type: 'reservation', partId: 'PT003', partName: 'Drum Bearing — Bosch WM',  sku: 'BRN-BSH-WM-01', qty: 1, jobId: 'JB004', caseId: 'CS003', technicianId: 'T004', from: null, to: 'SC004', status: 'in-transit',       timestamp: '2026-10-11T16:00:00', approvedBy: 'Suresh Patil' },
  { id: 'MV003', type: 'consumption', partId: 'PT002', partName: 'Compressor — LG 1.5T',     sku: 'CMP-LG-15T-01', qty: 1, jobId: 'JB_CS005_V1', caseId: 'CS005', technicianId: 'T002', from: 'SC001', to: null, status: 'completed',  timestamp: '2026-10-09T13:00:00', approvedBy: 'Auto' },
  { id: 'MV004', type: 'transfer',    partId: 'PT001', partName: 'PCB Controller Board — Samsung AC', sku: 'PCB-SAMS-AC-01', qty: 2, jobId: null, caseId: null, technicianId: null, from: 'SC001', to: 'SC004', status: 'pending-approval', timestamp: '2026-10-14T08:00:00', approvedBy: null },
  { id: 'MV005', type: 'return',      partId: 'PT005', partName: 'Compressor — Godrej 310L', sku: 'CMP-GDJ-31-01', qty: 1, jobId: null, caseId: 'CS005', technicianId: 'T002', from: null, to: 'SC001', status: 'defective',       timestamp: '2026-10-09T14:00:00', approvedBy: 'Auto' },
]

// ── Reference data for modals ─────────────────────────────────────────────────
const OPEN_CASES = CASES
  .filter(c => !['resolved', 'completed', 'closed'].includes(c.status))
  .map(c => ({ id: c.id, title: c.title }))

const SC_LIST = SERVICE_CENTERS.map(sc => ({ id: sc.id, name: sc.name }))

const CITIES     = ['All', ...Array.from(new Set(PARTS.map(p => p.city))).sort()]
const APPLIANCES = ['All', 'AC', 'Refrigerator', 'WM', 'LED TV', 'Microwave', 'Geyser']
const APPL_MAP   = { AC: 'AC', Refrigerator: 'Refrigerator', WM: 'WM', 'LED TV': 'LED TV', Microwave: 'Microwave', Geyser: 'Geyser' }

// ── Movement type / status configs ────────────────────────────────────────────
const MV_TYPE = {
  reservation: { label: 'Reservation', color: 'bg-blue-100 text-blue-700' },
  consumption:  { label: 'Consumption', color: 'bg-purple-100 text-purple-700' },
  transfer:     { label: 'Transfer',    color: 'bg-amber-100 text-amber-700' },
  return:       { label: 'Return',      color: 'bg-gray-100 text-gray-600' },
}
const MV_STATUS = {
  confirmed:          { label: 'Confirmed',         color: 'bg-emerald-100 text-emerald-700' },
  'in-transit':       { label: 'In Transit',        color: 'bg-blue-100 text-blue-700' },
  'pending-approval': { label: 'Pending Approval',  color: 'bg-amber-100 text-amber-700' },
  completed:          { label: 'Completed',          color: 'bg-gray-100 text-gray-500' },
  defective:          { label: 'Defective Return',  color: 'bg-red-100 text-red-700' },
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function getStockStatus(part) {
  if (part.stock === 0)                    return { label: 'Out of Stock', color: 'bg-red-100 text-red-700 font-bold' }
  if (part.condition === 'Defective')      return { label: 'Defective',    color: 'bg-orange-100 text-orange-700' }
  if (part.condition === 'Aged')           return { label: 'Aged',         color: 'bg-gray-100 text-gray-600' }
  if (part.stock <= part.reorderAt)        return { label: 'Reorder Now',  color: 'bg-red-100 text-red-600' }
  if (part.stock <= part.reorderAt * 1.5) return { label: 'Low Stock',    color: 'bg-amber-100 text-amber-700' }
  return                                          { label: 'OK',           color: 'bg-emerald-100 text-emerald-700' }
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
function fmt(ts) {
  const d = new Date(ts)
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' }) +
    ' ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })
}

// ── Shared sub-components ─────────────────────────────────────────────────────
function FilterPill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
        active ? 'text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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

// ── Reserve Modal ─────────────────────────────────────────────────────────────
function ReserveModal({ part, onClose, onReserve }) {
  const [caseId, setCaseId] = useState('')
  const [job, setJob]       = useState('no-job')
  const [qty, setQty]       = useState(1)
  const [done, setDone]     = useState(false)

  function submit(e) {
    e.preventDefault()
    if (!caseId) return
    onReserve(part, { caseId, jobId: job === 'no-job' ? null : job, qty })
    setDone(true)
  }

  const caseTitle = OPEN_CASES.find(c => c.id === caseId)?.title ?? ''

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-start justify-center pt-20 px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-7 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-gray-900">Reserve Part</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">&#x2715;</button>
        </div>
        <div className="bg-gray-50 rounded-xl px-4 py-3 mb-5">
          <p className="text-xs text-gray-500 mb-0.5">Part</p>
          <p className="text-sm font-semibold text-gray-800">{part.name}</p>
          <p className="text-xs font-mono text-gray-400 mt-0.5">{part.sku}</p>
        </div>
        {done ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-800 font-medium">
            Reserved — {qty} unit{qty > 1 ? 's' : ''} held for {caseTitle}. Part pulled from available stock.
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Linked Case *</label>
              <select value={caseId} onChange={e => setCaseId(e.target.value)} required
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-200">
                <option value="">Select a case…</option>
                {OPEN_CASES.map(c => (
                  <option key={c.id} value={c.id}>{c.id} — {c.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Linked Job</label>
              <select value={job} onChange={e => setJob(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-200">
                <option value="no-job">No job yet</option>
                <option value="JB001">JB001 — Diagnosis visit</option>
                <option value="JB002">JB002 — Repair visit</option>
                <option value="JB003">JB003 — Diagnosis + repair</option>
                <option value="JB004">JB004 — Diagnosis completed</option>
                <option value="JB005">JB005 — Installation scheduled</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Quantity</label>
              <input type="number" min={1} max={part.stock || 1} value={qty}
                onChange={e => setQty(Number(e.target.value))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-200" />
              <p className="text-xs text-gray-400 mt-1">{part.stock} units available</p>
            </div>
            <button type="submit"
              className="w-full py-3 rounded-xl text-white text-sm font-bold transition hover:opacity-90"
              style={{ backgroundColor: '#13347b' }}>
              Reserve for case
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

// ── Transfer Modal ────────────────────────────────────────────────────────────
function TransferModal({ part, fromCenterId, onClose, onTransfer }) {
  const [to, setTo]   = useState('')
  const [qty, setQty] = useState(1)

  function submit(e) {
    e.preventDefault()
    if (!to) return
    onTransfer(part, { from: fromCenterId, to, qty })
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-start justify-center pt-20 px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-7 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-gray-900">Request Transfer</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">&#x2715;</button>
        </div>
        <div className="bg-gray-50 rounded-xl px-4 py-3 mb-5">
          <p className="text-xs text-gray-500 mb-0.5">Part</p>
          <p className="text-sm font-semibold text-gray-800">{part.name}</p>
          <p className="text-xs font-mono text-gray-400 mt-0.5">{part.sku}</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">From centre</label>
            <input readOnly value={`${fromCenterId} — ${CENTER_NAME[fromCenterId] ?? fromCenterId}`}
              className="w-full border border-gray-100 rounded-xl px-3 py-2.5 text-sm bg-gray-50 text-gray-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">To centre *</label>
            <select value={to} onChange={e => setTo(e.target.value)} required
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-200">
              <option value="">Select destination…</option>
              {SC_LIST.filter(s => s.id !== fromCenterId).map(s => (
                <option key={s.id} value={s.id}>{s.id} — {s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Quantity</label>
            <input type="number" min={1} max={part.stock || 1} value={qty}
              onChange={e => setQty(Number(e.target.value))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-200" />
            <p className="text-xs text-gray-400 mt-1">{part.stock} units available</p>
          </div>
          <button type="submit"
            className="w-full py-3 rounded-xl text-sm font-bold text-white transition hover:opacity-90"
            style={{ backgroundColor: '#00a1e1' }}>
            Request transfer
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Request Part overlay ──────────────────────────────────────────────────────
function RequestModal({ onClose, onSubmitted }) {
  const CATEGORIES = ['AC', 'Refrigerator', 'WM', 'LED TV', 'Microwave', 'Geyser', 'Other']
  const [form, setForm] = useState({ name: '', sku: '', category: 'AC', qty: 1, reason: 'repair', caseId: '', urgency: 'normal' })
  function set(field, val) { setForm(prev => ({ ...prev, [field]: val })) }

  function submit(e) {
    e.preventDefault()
    onSubmitted()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-start justify-center overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl p-8 max-w-lg w-full mt-20 mx-4 mb-8 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Request Part</h2>
            <p className="text-xs text-gray-400 mt-0.5">Procurement will review within 2 hours</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&#x2715;</button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Part name / search *</label>
            <input required value={form.name} onChange={e => set('name', e.target.value)}
              placeholder="e.g. PCB Board — Whirlpool AC"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">SKU</label>
              <input value={form.sku} onChange={e => set('sku', e.target.value)}
                placeholder="e.g. PCB-WHP-AC-01"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
              <select value={form.category} onChange={e => set('category', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Quantity *</label>
              <input type="number" min={1} required value={form.qty}
                onChange={e => set('qty', Number(e.target.value))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Reason</label>
              <select value={form.reason} onChange={e => set('reason', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200">
                <option value="repair">Repair</option>
                <option value="installation">Installation</option>
                <option value="stock">Stock replenishment</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Linked case</label>
            <select value={form.caseId} onChange={e => set('caseId', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200">
              <option value="">No case linked</option>
              {OPEN_CASES.map(c => (
                <option key={c.id} value={c.id}>{c.id} — {c.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">Urgency</label>
            <div className="flex gap-3">
              {['normal', 'urgent', 'emergency'].map(u => (
                <button key={u} type="button" onClick={() => set('urgency', u)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold capitalize transition border ${
                    form.urgency === u
                      ? u === 'emergency' ? 'bg-red-500 text-white border-red-500'
                      : u === 'urgent'    ? 'bg-amber-400 text-white border-amber-400'
                      : 'text-white border-transparent'
                      : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                  }`}
                  style={form.urgency === u && u === 'normal' ? { backgroundColor: '#13347b', borderColor: '#13347b' } : {}}>
                  {u}
                </button>
              ))}
            </div>
          </div>
          <button type="submit"
            className="w-full py-3 rounded-xl text-white text-sm font-bold mt-2 transition hover:opacity-90"
            style={{ backgroundColor: '#13347b' }}>
            Submit request
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Demand Planning Tab ───────────────────────────────────────────────────────
function DemandPlanningTab() {
  const [poStates, setPoStates] = useState({})

  function requestPO(partId) {
    setPoStates(prev => ({ ...prev, [partId]: true }))
  }

  // Section 1: city demand summary
  const cityMap = {}
  PARTS_INVENTORY.forEach(p => {
    const city = p.city || 'Mumbai'
    if (!cityMap[city]) cityMap[city] = { demand: 0, count: 0 }
    cityMap[city].demand += p.demand || 0
    cityMap[city].count  += 1
  })
  const cities = Object.entries(cityMap).sort((a, b) => b[1].demand - a[1].demand)
  const maxCityDemand = Math.max(...cities.map(([, d]) => d.demand), 1)

  // Section 2: stockout risk — days of stock remaining
  const stockRisk = PARTS_INVENTORY.map(p => {
    const days = p.stock === 0 ? -1 : p.demand > 0 ? Math.round(p.stock / p.demand * 30) : 999
    return { ...p, daysRemaining: days }
  }).sort((a, b) => a.daysRemaining - b.daysRemaining)

  // Section 3: demand by appliance type
  const APPL_TYPES = ['Air Conditioner', 'Refrigerator', 'Washing Machine', 'LED TV', 'Microwave', 'Geyser']
  const applianceData = APPL_TYPES.map(type => {
    const pts = PARTS_INVENTORY.filter(p => p.appliance === type)
    return {
      type,
      stock:  pts.reduce((s, p) => s + p.stock, 0),
      demand: pts.reduce((s, p) => s + (p.demand || 0), 0),
    }
  })
  const maxAppl = Math.max(...applianceData.flatMap(a => [a.stock, a.demand]), 1)

  // Section 4: reorder recommendations
  const reorderList = PARTS_INVENTORY.filter(p => p.stock <= p.reorderAt)

  return (
    <div className="space-y-8">

      {/* ── Section 1: city demand ── */}
      <div className="bg-white rounded-2xl p-6" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <h2 className="text-base font-bold text-gray-900 mb-1">Demand by city</h2>
        <p className="text-xs text-gray-400 mb-5">Total monthly demand across all parts · sorted by volume</p>
        <div className="space-y-3">
          {cities.map(([city, data]) => (
            <div key={city} className="flex items-center gap-3">
              <div className="w-24 text-right text-xs font-semibold text-gray-700 shrink-0">{city}</div>
              <div className="flex-1 h-7 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full flex items-center px-3 transition-all"
                  style={{ width: `${Math.max(4, (data.demand / maxCityDemand) * 100)}%`, backgroundColor: '#00a1e1' }}
                >
                  <span className="text-[10px] font-bold text-white whitespace-nowrap">{data.demand}</span>
                </div>
              </div>
              <span className="text-xs text-gray-400 shrink-0">{data.count} SKUs</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 2: stockout risk ── */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Stockout risk — next 30 days</h2>
          <p className="text-xs text-gray-400 mt-0.5">Sorted by days remaining (worst first)</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: '#f8faff' }}>
                {['Part name', 'SKU', 'City', 'Stock', 'Mo. demand', 'Days remaining', 'Risk'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stockRisk.map((p, idx) => {
                const isOut = p.stock === 0
                const days  = p.daysRemaining
                const riskColor = isOut ? 'bg-red-100 text-red-700 font-bold' :
                  days < 7  ? 'bg-red-100 text-red-700' :
                  days < 15 ? 'bg-amber-100 text-amber-700' :
                              'bg-emerald-100 text-emerald-700'
                const riskLabel = isOut ? 'Out of stock' : days < 7 ? 'Critical' : days < 15 ? 'At risk' : 'OK'
                const daysDisplay = isOut
                  ? <span className="text-red-600 font-bold text-xs">Out of stock</span>
                  : <span className={`text-xs font-semibold ${days < 7 ? 'text-red-600' : days < 15 ? 'text-amber-600' : 'text-emerald-600'}`}>{days}d</span>
                return (
                  <tr key={p.id} className={`hover:bg-sky-50/20 transition-colors ${idx % 2 === 1 ? 'bg-gray-50/30' : ''}`}>
                    <td className="px-4 py-3 text-xs font-medium text-gray-800 max-w-[180px]">{p.name}</td>
                    <td className="px-4 py-3"><span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-500">{p.sku}</span></td>
                    <td className="px-4 py-3 text-xs text-gray-600">{p.city}</td>
                    <td className="px-4 py-3 text-center text-sm font-bold text-gray-800">{p.stock}</td>
                    <td className="px-4 py-3 text-center text-xs text-gray-600">{p.demand}/mo</td>
                    <td className="px-4 py-3 text-center">{daysDisplay}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${riskColor}`}>{riskLabel}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Section 3: demand by appliance type ── */}
      <div className="bg-white rounded-2xl p-6" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <h2 className="text-base font-bold text-gray-900 mb-1">Demand by appliance type</h2>
        <p className="text-xs text-gray-400 mb-5">Current stock vs monthly demand · deficit in red</p>
        <div className="space-y-5">
          {applianceData.map(({ type, stock, demand }) => {
            const isDeficit = demand > stock
            const stockPct  = (stock  / maxAppl) * 100
            const demandPct = (demand / maxAppl) * 100
            return (
              <div key={type}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-gray-700">{type}</span>
                  {isDeficit && <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Deficit</span>}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 w-14 text-right shrink-0">Stock</span>
                    <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                      {stock > 0
                        ? <div className="h-full rounded-full bg-gray-400 flex items-center px-2" style={{ width: `${Math.max(2, stockPct)}%` }}>
                            <span className="text-[10px] font-bold text-white">{stock}</span>
                          </div>
                        : <div className="h-full" style={{ width: '2px', backgroundColor: '#d1d5db' }} />
                      }
                    </div>
                    {stock === 0 && <span className="text-[10px] text-gray-400">0</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 w-14 text-right shrink-0">Demand</span>
                    <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                      {demand > 0
                        ? <div className="h-full rounded-full flex items-center px-2" style={{ width: `${Math.max(2, demandPct)}%`, backgroundColor: '#00a1e1' }}>
                            <span className="text-[10px] font-bold text-white">{demand}</span>
                          </div>
                        : <div className="h-full" style={{ width: '2px', backgroundColor: '#00a1e1' }} />
                      }
                    </div>
                    {demand === 0 && <span className="text-[10px] text-gray-400">0</span>}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="flex items-center gap-5 mt-5 pt-4 border-t border-gray-100">
          <span className="flex items-center gap-1.5 text-[10px] text-gray-500">
            <span className="w-4 h-3 rounded-sm inline-block bg-gray-400" /> Stock
          </span>
          <span className="flex items-center gap-1.5 text-[10px] text-gray-500">
            <span className="w-4 h-3 rounded-sm inline-block" style={{ backgroundColor: '#00a1e1' }} /> Demand
          </span>
        </div>
        <p className="text-[10px] text-gray-400 mt-2">
          Forecast based on historical demand data. Seasonal variation not modelled.
        </p>
      </div>

      {/* ── Section 4: reorder recommendations ── */}
      <div className="bg-white rounded-2xl p-6" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <h2 className="text-base font-bold text-gray-900 mb-1">Recommended reorder actions</h2>
        <p className="text-xs text-gray-400 mb-5">Parts at or below reorder level</p>
        <div className="space-y-3">
          {reorderList.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">All parts are above reorder levels.</div>
          ) : reorderList.map(p => {
            const qty  = p.reorderAt * 2
            const cost = p.price * qty
            const done = poStates[p.id]
            return (
              <div key={p.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl border border-gray-100"
                style={{ background: '#f9fafb' }}>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">{p.name}</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="font-mono text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{p.sku}</span>
                    <span className="text-xs text-gray-500">{p.city}</span>
                    <span className="text-xs text-gray-500">Current stock: {p.stock}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-gray-600">Order <strong className="text-gray-800">{qty} units</strong></p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Estimated cost: ₹{new Intl.NumberFormat('en-IN').format(cost)}
                  </p>
                  {done ? (
                    <span className="inline-block mt-2 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      Purchase order requested (simulated)
                    </span>
                  ) : (
                    <button
                      onClick={() => requestPO(p.id)}
                      className="mt-2 text-xs font-bold px-4 py-1.5 rounded-lg text-white transition hover:opacity-90"
                      style={{ backgroundColor: '#00a1e1' }}
                    >
                      Request PO
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Movements tab ─────────────────────────────────────────────────────────────
function MovementsTab({ movements, onApprove, onReject, onReceive }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: '#f8faff' }}>
              {['ID', 'Type', 'Part', 'Qty', 'Job / Case', 'From → To', 'Status', 'Timestamp', 'Approver', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {movements.length === 0 ? (
              <tr><td colSpan={10} className="text-center py-12 text-gray-400 text-sm">No movements recorded.</td></tr>
            ) : movements.map((mv, idx) => {
              const typeTag   = MV_TYPE[mv.type]    ?? { label: mv.type,   color: 'bg-gray-100 text-gray-600' }
              const statusTag = MV_STATUS[mv.status] ?? { label: mv.status, color: 'bg-gray-100 text-gray-500' }
              return (
                <tr key={mv.id} className={`transition-colors hover:bg-sky-50/30 ${idx % 2 === 1 ? 'bg-gray-50/30' : ''}`}>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="font-mono text-xs text-gray-500">{mv.id}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ${typeTag.color}`}>{typeTag.label}</span>
                  </td>
                  <td className="px-4 py-3.5 max-w-[180px]">
                    <p className="font-medium text-gray-800 text-xs leading-snug">{mv.partName}</p>
                    <p className="font-mono text-gray-400 text-xs mt-0.5">{mv.sku}</p>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="text-sm font-bold text-gray-700">{mv.qty}</span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {mv.jobId  && <p className="text-xs text-gray-700 font-medium">{mv.jobId}</p>}
                    {mv.caseId && <p className="text-xs text-gray-400">{mv.caseId}</p>}
                    {!mv.jobId && !mv.caseId && <span className="text-xs text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="text-xs text-gray-500">
                      {mv.from ? (CENTER_NAME[mv.from] ?? mv.from) : '—'}{' → '}
                      {mv.to   ? (CENTER_NAME[mv.to]   ?? mv.to)   : '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${statusTag.color}`}>{statusTag.label}</span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="text-xs text-gray-500">{fmt(mv.timestamp)}</span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="text-xs text-gray-600">{mv.approvedBy ?? '—'}</span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {mv.status === 'pending-approval' && (
                      <div className="flex gap-1.5">
                        <button onClick={() => onApprove(mv.id)}
                          className="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition">
                          Approve
                        </button>
                        <button onClick={() => onReject(mv.id)}
                          className="text-xs font-bold px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition">
                          Reject
                        </button>
                      </div>
                    )}
                    {mv.status === 'in-transit' && (
                      <button onClick={() => onReceive(mv.id)}
                        className="text-xs font-bold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition">
                        Mark Received
                      </button>
                    )}
                    {['completed', 'defective', 'confirmed'].includes(mv.status) && (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="px-5 py-3 border-t border-gray-100">
        <p className="text-xs text-gray-400">{movements.length} movement records · state is local (simulated)</p>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function PartsPage() {
  const [cityFilter, setCityFilter]           = useState('All')
  const [applianceFilter, setApplianceFilter] = useState('All')
  const [activeTab, setActiveTab]             = useState('inventory')
  const [movements, setMovements]             = useState(MOVEMENTS_INIT)
  const [reserveModal, setReserveModal]       = useState(null)   // part | null
  const [transferModal, setTransferModal]     = useState(null)   // part | null
  const [showRequest, setShowRequest]         = useState(false)
  const [toast, setToast]                     = useState(null)

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 5000)
  }

  // ── Movement mutations ──
  function handleApprove(mvId) {
    setMovements(prev => prev.map(m => m.id === mvId ? { ...m, status: 'confirmed', approvedBy: 'Agent' } : m))
    showToast('Transfer approved.')
  }
  function handleReject(mvId) {
    setMovements(prev => prev.filter(m => m.id !== mvId))
    showToast('Transfer rejected and removed from log.')
  }
  function handleReceive(mvId) {
    setMovements(prev => prev.map(m => m.id === mvId ? { ...m, status: 'completed' } : m))
    showToast('Movement marked as received.')
  }
  function handleReserve(part, data) {
    const caseTitle = OPEN_CASES.find(c => c.id === data.caseId)?.title ?? data.caseId
    setMovements(prev => [{
      id: `MV${Date.now()}`, type: 'reservation',
      partId: part.id, partName: part.name, sku: part.sku,
      qty: data.qty, jobId: data.jobId, caseId: data.caseId,
      technicianId: null, from: null, to: part.centerId ?? 'SC001',
      status: 'confirmed', timestamp: new Date().toISOString(), approvedBy: 'Auto',
    }, ...prev])
    setReserveModal(null)
    showToast(`Reserved — ${data.qty} unit${data.qty > 1 ? 's' : ''} held for ${caseTitle}. Part pulled from available stock.`)
  }
  function handleTransfer(part, data) {
    const destName = CENTER_NAME[data.to] ?? data.to
    setMovements(prev => [{
      id: `MV${Date.now()}`, type: 'transfer',
      partId: part.id, partName: part.name, sku: part.sku,
      qty: data.qty, jobId: null, caseId: null, technicianId: null,
      from: data.from, to: data.to,
      status: 'pending-approval', timestamp: new Date().toISOString(), approvedBy: null,
    }, ...prev])
    setTransferModal(null)
    showToast(`Transfer requested — ${data.qty} unit${data.qty > 1 ? 's' : ''} to ${destName}. Pending manager approval.`)
  }

  // ── Filtered inventory ──
  const filtered = useMemo(() => {
    return PARTS.filter(p => {
      const cityOk = cityFilter === 'All' || p.city === cityFilter
      const appl   = applianceFilter === 'All' || p.appliance === applianceFilter
      return cityOk && appl
    })
  }, [cityFilter, applianceFilter])

  // ── Summary stats ──
  const totalSKUs     = PARTS.length
  const belowReorder  = PARTS.filter(p => p.stock <= p.reorderAt && p.stock > 0).length
  const outOfStock    = PARTS.filter(p => p.stock === 0).length
  const defectiveAged = PARTS.filter(p => !['Good', 'Out of stock', 'Out of Stock', 'In Transit'].includes(p.condition)).length
  const alertCount    = outOfStock + defectiveAged

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f4f6fb' }}>
      <div className="max-w-screen-xl mx-auto px-6 py-8">

        {/* ── Header ── */}
        <div className="mb-7">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🔧</span>
            <h1 className="text-2xl font-bold" style={{ color: '#13347b' }}>Spare Parts Inventory</h1>
          </div>
          <p className="text-sm text-gray-500 ml-9">
            Location-aware stock tracking · Demand-mapped alerts · Movement log
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
          <SummaryCard label="Total SKUs"          value={totalSKUs}     sub="across all locations" />
          <SummaryCard label="Below Reorder Level" value={belowReorder}  sub="need restocking soon"  valueClass={belowReorder > 0  ? 'text-red-600'   : 'text-gray-800'} />
          <SummaryCard label="Out of Stock"        value={outOfStock}    sub="zero units remaining"  valueClass={outOfStock > 0    ? 'text-red-600'   : 'text-gray-800'} />
          <SummaryCard label="Defective / Aged"    value={defectiveAged} sub="condition flag raised" valueClass={defectiveAged > 0 ? 'text-amber-600' : 'text-gray-800'} />
        </div>

        {/* ── Tab bar ── */}
        <div className="mb-5">
          <div className="inline-flex bg-white rounded-xl p-1 gap-1" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            {[
              { key: 'inventory',       label: 'Inventory' },
              { key: 'movements',       label: `Movements (${movements.length})` },
              { key: 'demand-planning', label: 'Demand Planning' },
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition ${
                  activeTab === tab.key ? 'text-white' : 'text-gray-500 hover:text-gray-700'
                }`}
                style={activeTab === tab.key ? { backgroundColor: '#13347b' } : {}}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ══ INVENTORY TAB ══════════════════════════════════════════════ */}
        {activeTab === 'inventory' && (
          <>
            {/* Filters */}
            <div className="bg-white rounded-2xl px-5 py-4 mb-5 flex flex-wrap gap-y-3 gap-x-6"
              style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide mr-1">City</span>
                {CITIES.map(c => (
                  <FilterPill key={c} label={c} active={cityFilter === c} onClick={() => setCityFilter(c)} />
                ))}
              </div>
              <div className="w-px bg-gray-200 hidden sm:block" />
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide mr-1">Appliance</span>
                {APPLIANCES.map(a => (
                  <FilterPill key={a} label={a} active={applianceFilter === a} onClick={() => setApplianceFilter(a)} />
                ))}
              </div>
            </div>

            {/* Parts table */}
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
                      <th className="text-center px-4 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="text-center py-12 text-gray-400 text-sm">
                          No parts match the selected filters.
                        </td>
                      </tr>
                    ) : filtered.map((part, idx) => {
                      const status   = getStockStatus(part)
                      const barPct   = Math.min(100, (part.stock / (part.reorderAt * 2)) * 100)
                      const barColor = getBarColor(part)
                      const numColor = getStockColor(part)
                      return (
                        <tr key={part.id}
                          className={`transition-colors hover:bg-sky-50/40 ${idx % 2 === 1 ? 'bg-gray-50/40' : ''}`}>

                          <td className="px-5 py-3.5">
                            <span className="font-mono text-xs text-gray-500 bg-gray-100 rounded px-2 py-0.5">{part.sku}</span>
                          </td>
                          <td className="px-4 py-3.5 max-w-[200px]">
                            <p className="font-medium text-gray-800 text-xs leading-snug">{part.name}</p>
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span className="text-xs text-gray-600">{part.appliance}</span>
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span className="text-xs font-medium text-gray-700">{part.city}</span>
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <span className={`text-lg font-bold leading-none ${numColor}`}>{part.stock}</span>
                              <div className="w-12 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                                <div className={`h-full rounded-full ${barColor}`} style={{ width: `${barPct}%` }} />
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <span className="text-sm text-gray-500">{part.reorderAt}</span>
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <div className="inline-flex items-center gap-1">
                              <span className="text-sm text-gray-700 font-medium">{part.avgMonthlyDemand}</span>
                              <span className="text-xs text-gray-400">/mo</span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <span className={`text-sm ${part.age >= 24 ? 'text-amber-600 font-medium' : 'text-gray-600'}`}>
                              {part.age}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <span className={`text-xs font-medium ${
                              part.condition === 'Good'      ? 'text-emerald-600'
                              : part.condition === 'Defective' ? 'text-orange-600'
                              : part.condition === 'Aged'      ? 'text-gray-500'
                              : 'text-red-600'
                            }`}>{part.condition}</span>
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-xs whitespace-nowrap ${status.color}`}>
                              {status.label}
                            </span>
                          </td>
                          {/* Actions */}
                          <td className="px-4 py-3.5 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => setReserveModal(part)}
                                disabled={part.stock === 0}
                                className="text-xs font-semibold px-2.5 py-1.5 rounded-lg transition whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-80"
                                style={{ backgroundColor: '#e8f0fe', color: '#13347b' }}>
                                Reserve
                              </button>
                              <button
                                onClick={() => setTransferModal(part)}
                                disabled={part.stock === 0}
                                className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed">
                                Transfer
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
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
                      {applianceFilter !== 'All' && <strong>{applianceFilter}</strong>}
                    </span>
                  )}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> OK</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Low</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> Critical</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-4 text-right">
              Prices shown are unit costs in INR · Data as of Oct 2026
            </p>
          </>
        )}

        {/* ══ MOVEMENTS TAB ════════════════════════════════════════════════ */}
        {activeTab === 'movements' && (
          <MovementsTab
            movements={movements}
            onApprove={handleApprove}
            onReject={handleReject}
            onReceive={handleReceive}
          />
        )}

        {/* ══ DEMAND PLANNING TAB ══════════════════════════════════════════ */}
        {activeTab === 'demand-planning' && <DemandPlanningTab />}

      </div>

      {/* ── Floating "+ Request Part" button ── */}
      <button
        onClick={() => setShowRequest(true)}
        className="fixed bottom-8 right-8 z-40 text-white px-5 py-3.5 rounded-2xl shadow-xl font-semibold text-sm flex items-center gap-2 transition hover:opacity-90"
        style={{ backgroundColor: '#13347b' }}>
        + Request Part
      </button>

      {/* ── Modals ── */}
      {reserveModal && (
        <ReserveModal part={reserveModal} onClose={() => setReserveModal(null)} onReserve={handleReserve} />
      )}
      {transferModal && (
        <TransferModal
          part={transferModal}
          fromCenterId={transferModal.centerId ?? 'SC001'}
          onClose={() => setTransferModal(null)}
          onTransfer={handleTransfer}
        />
      )}
      {showRequest && (
        <RequestModal
          onClose={() => setShowRequest(false)}
          onSubmitted={() => showToast('Part request submitted. Procurement will review within 2 hours (simulated).')}
        />
      )}

      {/* ── Toast notification ── */}
      {toast && (
        <div
          className="fixed bottom-24 right-8 z-50 max-w-sm px-5 py-3.5 rounded-xl text-sm text-white shadow-2xl leading-snug"
          style={{ backgroundColor: '#13347b' }}>
          {toast}
        </div>
      )}
    </div>
  )
}
